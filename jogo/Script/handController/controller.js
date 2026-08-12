/* ==========================================
   Motion Verse
   controller.js

   Controlador de entrada por mão:
   - Cada jogador controla um lado do personagem
   - Usa a webcam escolhida de cada jogador (via CameraManager)
========================================== */

import HandTracker from "./handTracker.js";
import { gestureParaComando } from "./gestureRecognizer.js";

const DIRECOES_VALIDAS = ["direita", "esquerda", "cima", "baixo"];

class HandController {

    constructor() {
        this.trackers = [];
        this.estado = {
            direita: false,
            esquerda: false,
            cima: false,
            baixo: false
        };
        this.estadoJogadores = {};
    }

    iniciar({ cameraManager, mapping, onPlayerUpdate, playerConfigs = {} }) {

        this.parar();

        const mapa = mapping || {
            // Assunção padrão (pode ajustar depois):
            // 1: Frente  -> direita
            // 2: Trás    -> esquerda
            // 3: Baixo   -> baixo
            // 4: Cima    -> cima
            1: "direita",
            2: "esquerda",
            3: "baixo",
            4: "cima"
        };

        Object.keys(mapa).forEach(key => {

            const jogadorId = Number(key);
            const direcao = mapa[key];

            if (!DIRECOES_VALIDAS.includes(direcao)) {
                return;
            }

            const camera = cameraManager?.getCamera?.(jogadorId);
            const video = camera?.video || null;

            if (!video) {
                console.warn(`HandController: vídeo do jogador ${jogadorId} não está disponível.`);
                return;
            }

            const tracker = new HandTracker({
                video,
                ...(playerConfigs[jogadorId] || {}),
                onUpdate: (leitura) => {

                    const comando = gestureParaComando(leitura);
                    this.estado[direcao] = Boolean(comando.ativo);
                    this.estadoJogadores[jogadorId] = {
                        jogadorId,
                        direcao,
                        presente: Boolean(leitura.presente),
                        ativa: Boolean(comando.ativo),
                        dedosAbertos: Number(leitura.dedosAbertos || 0),
                        score: Number(leitura.score || 0)
                    };

                    onPlayerUpdate?.(this.estadoJogadores[jogadorId]);

                }
            });

            this.trackers.push(tracker);
        });

        // Inicia todos
        this.trackers.forEach(t => t.start().catch(err => console.error(err)));

        return this.estado;
    }

    parar() {
        this.trackers.forEach(t => t.stop());
        this.trackers = [];
        this.estado.direita = false;
        this.estado.esquerda = false;
        this.estado.cima = false;
        this.estado.baixo = false;
        this.estadoJogadores = {};
    }
}

const controller = new HandController();

export default controller;
