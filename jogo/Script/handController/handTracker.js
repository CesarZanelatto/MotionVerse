/* ==========================================
   Motion Verse
   handTracker.js

   Wrapper simples para rastrear mão usando
   MediaPipe (Tasks Vision) via CDN.
========================================== */

let _visionLoaderPromise = null;

async function getVisionLoader() {

    if (_visionLoaderPromise) {
        return _visionLoaderPromise;
    }

    _visionLoaderPromise = (async () => {

        const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14");
        const { FilesetResolver, HandLandmarker } = vision;

        const resolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        return { HandLandmarker, resolver };

    })();

    return _visionLoaderPromise;
}

async function createHandLandmarker() {

    const { HandLandmarker, resolver } = await getVisionLoader();

    return HandLandmarker.createFromOptions(resolver, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task"
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.45,
        minHandPresenceConfidence: 0.35,
        minTrackingConfidence: 0.35
    });
}

function distancia(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

function calcularAbertura(landmarks) {

    // Heurística:
    // - Usa distâncias (normalizadas) dos dedos para o pulso.
    // - Quanto maior, mais "mão aberta".
    // Funciona razoavelmente bem independente da orientação.

    const wrist = landmarks[0]; // WRIST

    // Base para normalização: pulso -> middle_mcp
    const middleMcp = landmarks[9]; // MIDDLE_FINGER_MCP
    const base = Math.max(0.00001, distancia(wrist, middleMcp));

    // Pontas dos dedos
    const tips = [
        landmarks[4],  // THUMB_TIP
        landmarks[8],  // INDEX_FINGER_TIP
        landmarks[12], // MIDDLE_FINGER_TIP
        landmarks[16], // RING_FINGER_TIP
        landmarks[20]  // PINKY_TIP
    ];

    const media = tips.reduce((acc, p) => acc + distancia(wrist, p), 0) / tips.length;
    const score = media / base; // ~1.2..3.0

    // Limiar empírico
    const aberta = score > 1.8;

    return { aberta, score };
}

function contarDedosAbertos(landmarks) {

    // Índices do MediaPipe:
    // Thumb: 2(MCP) 3(IP) 4(TIP)
    // Index: 5(MCP) 6(PIP) 7(DIP) 8(TIP)
    // Middle: 9(MCP) 10(PIP) 11(DIP) 12(TIP)
    // Ring: 13(MCP) 14(PIP) 15(DIP) 16(TIP)
    // Pinky: 17(MCP) 18(PIP) 19(DIP) 20(TIP)

    const wrist = landmarks[0];
    const middleMcp = landmarks[9];

    const base = Math.max(0.00001, distancia(wrist, middleMcp));

    const ratio = (i) => distancia(wrist, landmarks[i]) / base;

    const dedoEstendido = (tip, pip, mcp, minTip = 1.55, minDelta = 0.18) => {

        const rTip = ratio(tip);
        const rPip = ratio(pip);
        const rMcp = ratio(mcp);

        // Regras combinadas para reduzir falso positivo:
        // 1) ponta bem mais longe do pulso
        // 2) ponta significativamente mais longe que o PIP
        // 3) ponta mais longe que o MCP (garante dedo "abrindo")
        return (
            rTip > minTip &&
            (rTip - rPip) > minDelta &&
            rTip > (rMcp + 0.10)
        );
    };

    const indexAberto = dedoEstendido(8, 6, 5, 1.60, 0.18);
    const middleAberto = dedoEstendido(12, 10, 9, 1.62, 0.18);
    const ringAberto = dedoEstendido(16, 14, 13, 1.58, 0.17);
    const pinkyAberto = dedoEstendido(20, 18, 17, 1.50, 0.16);

    // Polegar é diferente: além de "longe do pulso", precisa estar afastado do indicador
    const thumbTip = landmarks[4];
    const indexMcp = landmarks[5];

    const thumbAberto = (
        ratio(4) > 1.32 &&
        (ratio(4) - ratio(3)) > 0.12 &&
        distancia(thumbTip, indexMcp) > (0.42 * base)
    );

    const dedos = [
        thumbAberto,
        indexAberto,
        middleAberto,
        ringAberto,
        pinkyAberto
    ];

    return {
        dedosAbertos: dedos.filter(Boolean).length,
        thumbAberto,
        indexAberto,
        middleAberto,
        ringAberto,
        pinkyAberto
    };
}

function maoCincoDedosAbertos(landmarks) {
    const { dedosAbertos } = contarDedosAbertos(landmarks);
    return dedosAbertos === 5;
}

class HandTracker {

    constructor({
        video,
        onUpdate,
        openThreshold = 1.72,
        closeThreshold = 1.52,
        processIntervalMs = 90,
        downscaleWidth = 160,
        downscaleHeight = 120
    }) {
        this.video = video;
        this.onUpdate = onUpdate;
        this.openThreshold = openThreshold;
        this.closeThreshold = closeThreshold;
        this.processIntervalMs = processIntervalMs;
        this.downscaleWidth = downscaleWidth;
        this.downscaleHeight = downscaleHeight;
        this._running = false;
        this._lastVideoTime = -1;
        this._raf = null;
        this._landmarker = null;
        this._nextProcessAt = 0;
        this._processIntervalMs = processIntervalMs; // padrão ~11 FPS por câmera
        this._framesSemMao = 0;
        this._maxFramesSemMao = 6; // evita "sumir e voltar" toda hora por perda momentânea
        this._estadoAberta = false;
        this._streakAberta = 0;
        this._streakFechada = 0;
        this._minStreakParaTroca = 2;
        this._canvas = null;
        this._ctx = null;
    }

    async start() {

        if (this._running) {
            return;
        }

        if (!this.video) {
            throw new Error("HandTracker: video não informado.");
        }

        this._running = true;
        this._landmarker = await createHandLandmarker();
        this._processIntervalMs = Math.max(30, Number(this.processIntervalMs || 90));

        const loop = () => {

            if (!this._running) {
                return;
            }

            const video = this.video;
            const now = performance.now();

            if (
                video.readyState >= 2 &&
                video.currentTime !== this._lastVideoTime &&
                now >= this._nextProcessAt
            ) {

                this._lastVideoTime = video.currentTime;
                this._nextProcessAt = now + this._processIntervalMs;

                // Downscale para acelerar a inferência
                if (!this._canvas) {
                    this._canvas = document.createElement("canvas");
                    this._canvas.width = this.downscaleWidth;
                    this._canvas.height = this.downscaleHeight;
                    this._ctx = this._canvas.getContext("2d", { willReadFrequently: false });
                }

                if (this._ctx) {
                    this._ctx.drawImage(video, 0, 0, this._canvas.width, this._canvas.height);
                }

                const source = this._canvas && this._ctx ? this._canvas : video;
                const result = this._landmarker.detectForVideo(source, now);
                const lm = result?.landmarks?.[0] || null;

                if (!lm) {
                    this._framesSemMao += 1;

                    if (this._framesSemMao >= this._maxFramesSemMao) {
                        this._estadoAberta = false;
                        this._streakAberta = 0;
                        this._streakFechada = 0;
                    }

                    this.onUpdate?.({
                        presente: this._framesSemMao < this._maxFramesSemMao,
                        aberta: this._estadoAberta,
                        dedosAbertos: 0,
                        score: 0
                    });
                } else {
                    this._framesSemMao = 0;
                    const { score } = calcularAbertura(lm);
                    const dedos = contarDedosAbertos(lm);

                    // Ativa SOMENTE se detectar claramente 5 dedos abertos
                    const aberta5 = maoCincoDedosAbertos(lm);

                    // Debounce: exige 2 leituras seguidas antes de trocar estado
                    if (aberta5) {
                        this._streakAberta += 1;
                        this._streakFechada = 0;
                    } else {
                        this._streakFechada += 1;
                        this._streakAberta = 0;
                    }

                    if (!this._estadoAberta && this._streakAberta >= this._minStreakParaTroca) {
                        this._estadoAberta = true;
                    }

                    if (this._estadoAberta && this._streakFechada >= this._minStreakParaTroca) {
                        this._estadoAberta = false;
                    }

                    this.onUpdate?.({
                        presente: true,
                        aberta: this._estadoAberta,
                        dedosAbertos: dedos.dedosAbertos,
                        score: score
                    });
                }
            }

            this._raf = requestAnimationFrame(loop);

        };

        this._raf = requestAnimationFrame(loop);
    }

    stop() {
        this._running = false;
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = null;
        }
        if (this._landmarker?.close) {
            this._landmarker.close();
        }
        this._landmarker = null;
        this._canvas = null;
        this._ctx = null;
    }
}

export default HandTracker;
