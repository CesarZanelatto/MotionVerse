/* ==========================================
   Motion Verse
   cameraManager.js

   Responsável por:
   - Ler as câmeras da equipe
   - Abrir as webcams
   - Associar cada câmera ao jogador
   - Controlar os streams
========================================== */


// ==========================================
// CAMERA MANAGER
// ==========================================

class CameraManager {

    constructor() {

        this.cameras = [];

    }

    getVideoConstraints(deviceId = null) {

        const constraints = {
            width: {
                ideal: 320,
                max: 640
            },
            height: {
                ideal: 240,
                max: 480
            },
            frameRate: {
                ideal: 12,
                max: 15
            }
        };

        if (deviceId) {
            constraints.deviceId = {
                exact: deviceId
            };
        }

        return constraints;
    }


    // ======================================
    // INICIALIZAR
    // ======================================

    async iniciar() {

        try {

            // ------------------------------
            // PEGAR EQUIPE ATUAL
            // ------------------------------

            const dados =
                localStorage.getItem("equipeAtual");


            if (!dados) {

                throw new Error(
                    "Nenhuma equipe encontrada no localStorage."
                );

            }


            const equipe =
                JSON.parse(dados);


            // ------------------------------
            // VERIFICAR JOGADORES
            // ------------------------------

            if (
                !equipe.jogadores ||
                equipe.jogadores.length !== 4
            ) {

                throw new Error(
                    "A equipe precisa possuir 4 jogadores."
                );

            }


            console.log(
                "Equipe carregada:",
                equipe.equipe
            );


            // ------------------------------
            // SOLICITAR PERMISSÃO
            // ------------------------------

            await this.solicitarPermissao();


            // ------------------------------
            // ABRIR CÂMERAS
            // ------------------------------

            for (
                let i = 0;
                i < equipe.jogadores.length;
                i++
            ) {

                const jogador =
                    equipe.jogadores[i];


                await this.abrirCamera(
                    jogador,
                    i
                );

            }


            console.log(
                "Todas as câmeras foram inicializadas."
            );


            return this.cameras;

        }

        catch (erro) {

            console.error(
                "Erro ao iniciar CameraManager:",
                erro
            );

            throw erro;

        }

    }


    // ======================================
    // SOLICITAR PERMISSÃO
    // ======================================

    async solicitarPermissao() {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: this.getVideoConstraints(),

                    audio: false

                });


            // Não precisamos manter
            // esta câmera aberta.

            stream
                .getTracks()
                .forEach(track => track.stop());


            console.log(
                "Permissão para acessar câmera concedida."
            );

        }

        catch (erro) {

            console.error(
                "Permissão para câmera negada:",
                erro
            );

            throw new Error(
                "Não foi possível acessar as webcams."
            );

        }

    }


    // ======================================
    // ABRIR UMA CÂMERA
    // ======================================

    async abrirCamera(
        jogador,
        indice
    ) {

        const cameraId =
            jogador.camera?.id;


        if (!cameraId) {

            console.warn(
                `Jogador ${jogador.id} não possui câmera configurada.`
            );

            return;

        }


        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: this.getVideoConstraints(cameraId),

                    audio: false

                });


            const camera = {

                jogadorId: jogador.id,

                jogadorNome: jogador.nome,

                funcao: jogador.funcao,

                deviceId: cameraId,

                stream: stream,

                video: null

            };


            this.cameras[indice] = camera;


            console.log(
                `Câmera do jogador ${jogador.id} aberta:`,
                jogador.nome
            );


            return camera;

        }

        catch (erro) {

            console.error(

                `Erro ao abrir câmera do jogador ${jogador.id}:`,

                erro

            );

        }

    }


    // ======================================
    // ASSOCIAR STREAM A UM VIDEO
    // ======================================

    conectarVideo(
        jogadorId,
        videoElement
    ) {

        const camera =
            this.cameras.find(
                item =>
                    item &&
                    item.jogadorId === jogadorId
            );


        if (!camera) {

            console.error(
                `Câmera do jogador ${jogadorId} não encontrada.`
            );

            return;

        }


        videoElement.srcObject =
            camera.stream;


        videoElement.muted = true;

        videoElement.playsInline = true;


        camera.video =
            videoElement;


        videoElement
            .play()
            .catch(erro => {

                console.error(
                    "Erro ao reproduzir vídeo:",
                    erro
                );

            });


        console.log(
            `Vídeo conectado ao jogador ${jogadorId}.`
        );

    }


    // ======================================
    // PEGAR CÂMERA DO JOGADOR
    // ======================================

    getCamera(jogadorId) {

        return this.cameras.find(

            camera =>
                camera &&
                camera.jogadorId === jogadorId

        );

    }


    // ======================================
    // PEGAR STREAM DO JOGADOR
    // ======================================

    getStream(jogadorId) {

        const camera =
            this.getCamera(jogadorId);


        if (!camera) {

            return null;

        }


        return camera.stream;

    }


    // ======================================
    // FECHAR UMA CÂMERA
    // ======================================

    fecharCamera(jogadorId) {

        const camera =
            this.getCamera(jogadorId);


        if (!camera) {

            return;

        }


        camera.stream
            .getTracks()
            .forEach(track => {

                track.stop();

            });


        console.log(
            `Câmera do jogador ${jogadorId} encerrada.`
        );

    }


    // ======================================
    // FECHAR TODAS AS CÂMERAS
    // ======================================

    fecharTodas() {

        this.cameras.forEach(camera => {

            if (!camera) {

                return;

            }


            if (camera.stream) {

                camera.stream
                    .getTracks()
                    .forEach(track => {

                        track.stop();

                    });

            }

        });


        this.cameras = [];


        console.log(
            "Todas as câmeras foram encerradas."
        );

    }

}


// ==========================================
// INSTÂNCIA GLOBAL
// ==========================================

const cameraManager = new CameraManager();

export default cameraManager;
