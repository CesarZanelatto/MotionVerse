import Inicio from "../Data/inicio.js";


class Personagem {
    constructor(x, y, faseData = Inicio) {

        this.x = x;
        this.y = y;

        this.faseData = faseData || Inicio;
        this.velocidade = this.faseData.player?.velocidade || Inicio.player.velocidade;

        // SPRITE
        this.img = new Image();
        this.img.src = this.faseData.player?.img || Inicio.player.img;

        this.tamanho = 64;

        // DIREÇÃO
        this.direcao = "baixo";
        this.estado = "idle";

        // ANIMAÇÃO
        this.linha = 0;

        this.framesWalk = [0,1,2,3];

        this.indiceFrame = 0;
        this.frame = 0;

        this.tempoFrame = 0;
        this.intervaloFrame = 120; // ↑ mais estável (100 pode ficar rápido demais)

        // INPUT SUAVIZADO (para controlar melhor com HandController)
        // Valores vão de 0..1 para cada direção.
        this._inputSuave = {
            direita: 0,
            esquerda: 0,
            cima: 0,
            baixo: 0
        };

        // "Tempo" de suavização (ms). Menor = responde mais rápido.
        this._suavizacaoMs = 90;

    }

    atualizar(input, deltaTime){

        const inputSuave = this.suavizarInput(input, deltaTime);
        this.mover(inputSuave, deltaTime);
        this.animar(deltaTime);

    }

    // Verifica se um retângulo (x, y, tamanho, tamanho) colide com alguma parede
    colideComParede(x, y){
        const paredesFixas = this.faseData?.paredes || [];
        const paredesDinamicas = this.faseData?.__paredesDinamicas || [];
        const paredes = [...paredesFixas, ...paredesDinamicas];

        for(const parede of paredes){
            const colide =
                x < parede.x + parede.width &&
                x + this.tamanho > parede.x &&
                y < parede.y + parede.height &&
                y + this.tamanho > parede.y;

            if(colide) return true;
        }

        return false;
    }

    suavizarInput(input, deltaTime) {

        // Se o deltaTime vier quebrado, assume um frame "padrão"
        const dt = Number.isFinite(deltaTime) ? deltaTime : 16;

        // Filtro exponencial: alpha é estável independente do FPS
        const alpha = 1 - Math.exp(-dt / this._suavizacaoMs);

        const alvo = {
            direita: input?.direita ? 1 : 0,
            esquerda: input?.esquerda ? 1 : 0,
            cima: input?.cima ? 1 : 0,
            baixo: input?.baixo ? 1 : 0
        };

        // Atualiza suavizado
        this._inputSuave.direita += (alvo.direita - this._inputSuave.direita) * alpha;
        this._inputSuave.esquerda += (alvo.esquerda - this._inputSuave.esquerda) * alpha;
        this._inputSuave.cima += (alvo.cima - this._inputSuave.cima) * alpha;
        this._inputSuave.baixo += (alvo.baixo - this._inputSuave.baixo) * alpha;

        // Pequena zona morta para evitar tremedeira
        const dead = 0.02;
        const clamp01 = (v) => (v < dead ? 0 : (v > 1 ? 1 : v));

        return {
            direita: clamp01(this._inputSuave.direita),
            esquerda: clamp01(this._inputSuave.esquerda),
            cima: clamp01(this._inputSuave.cima),
            baixo: clamp01(this._inputSuave.baixo)
        };
    }

    mover(input, deltaTime){

        let andando = false;

        // Move eixo X e eixo Y separadamente,
        // testando colisão antes de confirmar cada um.
        // Isso permite "deslizar" na parede em vez de travar de vez.

        // Base de movimento ajustada por deltaTime (para ficar consistente em FPS diferentes)
        const dt = Number.isFinite(deltaTime) ? deltaTime : 16;
        const fator = dt / 16.6667;
        const passo = this.velocidade * fator;

        const direita = Number(input?.direita || 0);
        const esquerda = Number(input?.esquerda || 0);
        const cima = Number(input?.cima || 0);
        const baixo = Number(input?.baixo || 0);

        // Direção principal (para animação)
        const abs = (v) => Math.abs(v);
        const horizontal = direita - esquerda;
        const vertical = baixo - cima;

        if (abs(horizontal) > abs(vertical) && abs(horizontal) > 0.05) {
            this.direcao = horizontal > 0 ? "direita" : "esquerda";
        } else if (abs(vertical) > 0.05) {
            this.direcao = vertical > 0 ? "baixo" : "cima";
        }

        if(direita > 0.01){
            const novoX = this.x + (passo * direita);
            if(!this.colideComParede(novoX, this.y)) this.x = novoX;
            andando = true;
        }

        if(esquerda > 0.01){
            const novoX = this.x - (passo * esquerda);
            if(!this.colideComParede(novoX, this.y)) this.x = novoX;
            andando = true;
        }

        if(cima > 0.01){
            const novoY = this.y - (passo * cima);
            if(!this.colideComParede(this.x, novoY)) this.y = novoY;
            andando = true;
        }

        if(baixo > 0.01){
            const novoY = this.y + (passo * baixo);
            if(!this.colideComParede(this.x, novoY)) this.y = novoY;
            andando = true;
        }

        this.estado = andando ? "walk" : "idle";
    }

    animar(deltaTime){

        // direção → linha correta da sprite
        if(this.direcao === "baixo") this.linha = 0;
        if(this.direcao === "direita") this.linha = 1;
        if(this.direcao === "cima") this.linha = 2;
        if(this.direcao === "esquerda") this.linha = 3;

        // idle trava frame
        if(this.estado === "idle"){
            this.frame = 0;
            this.indiceFrame = 0;
            this.tempoFrame = 0;
            return;
        }

        // segurança caso deltaTime venha quebrado
        if(!deltaTime) deltaTime = 16;

        this.tempoFrame += deltaTime;

        // loop de animação estável
        while(this.tempoFrame >= this.intervaloFrame){

            this.tempoFrame -= this.intervaloFrame;

            this.indiceFrame = (this.indiceFrame + 1) % this.framesWalk.length;

            this.frame = this.framesWalk[this.indiceFrame];
        }
    }

    desenhar(ctx){

        if(!this.img.complete) return;

        ctx.drawImage(

            this.img,

            this.frame * this.tamanho,
            this.linha * this.tamanho,

            this.tamanho,/* x*/
            this.tamanho,/* y*/

            this.x,
            this.y,

            this.tamanho,
            this.tamanho

        );
    }
}

export default Personagem;
