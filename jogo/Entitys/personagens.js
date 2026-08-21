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
        this.intervaloFrame = 120;

        // INPUT SUAVIZADO
        // Agora com aceleração e frenagem diferentes:
        // - acelera rápido (resposta ágil, tipo CS)
        // - freia devagar (aquele "deslize ensaboado" ao soltar a tecla)
        this._inputSuave = {
            direita: 0,
            esquerda: 0,
            cima: 0,
            baixo: 0
        };

        this._msAcelerar = 70;   // menor = responde mais rápido ao apertar
        this._msFrear   = 0;  // maior = desliza mais ao soltar (efeito "soapy")

        // Zona morta de histerese pra escolher a direção da animação
        // evita a linha do sprite "piscando" perto da diagonal
        this._direcaoAtualPeso = { x: 0, y: 0 };

    }

    atualizar(input, deltaTime){

        const inputSuave = this.suavizarInput(input, deltaTime);
        this.mover(inputSuave, deltaTime);
        this.animar(deltaTime);

    }

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

        const dt = Number.isFinite(deltaTime) ? deltaTime : 16;

        const alvo = {
            direita: input?.direita ? 1 : 0,
            esquerda: input?.esquerda ? 1 : 0,
            cima: input?.cima ? 1 : 0,
            baixo: input?.baixo ? 1 : 0
        };

        // Para cada eixo, escolhe a constante de tempo dependendo se está
        // acelerando (indo em direção a 1) ou freando (indo em direção a 0)
        const suavizarEixo = (atual, alvoVal) => {
            const acelerando = alvoVal > atual;
            const ms = acelerando ? this._msAcelerar : this._msFrear;
            const alpha = 1 - Math.exp(-dt / ms);
            return atual + (alvoVal - atual) * alpha;
        };

        this._inputSuave.direita  = suavizarEixo(this._inputSuave.direita, alvo.direita);
        this._inputSuave.esquerda = suavizarEixo(this._inputSuave.esquerda, alvo.esquerda);
        this._inputSuave.cima     = suavizarEixo(this._inputSuave.cima, alvo.cima);
        this._inputSuave.baixo    = suavizarEixo(this._inputSuave.baixo, alvo.baixo);

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

        const dt = Number.isFinite(deltaTime) ? deltaTime : 16;
        const fator = dt / 16.6667;
        const passo = this.velocidade * fator;

        const direita = Number(input?.direita || 0);
        const esquerda = Number(input?.esquerda || 0);
        const cima = Number(input?.cima || 0);
        const baixo = Number(input?.baixo || 0);

        // Vetor de movimento combinado
        let vx = direita - esquerda;
        let vy = baixo - cima;

        const andando = Math.abs(vx) > 0.02 || Math.abs(vy) > 0.02;

        // NORMALIZA a diagonal: sem isso, andar na diagonal é ~41% mais
        // rápido que andar reto, o que é a maior causa da sensação "estranha"
        const mag = Math.hypot(vx, vy);
        if (mag > 1) {
            vx /= mag;
            vy /= mag;
        }

        // Direção da animação com histerese (evita flicker perto da diagonal)
        const abs = Math.abs;
        if (andando) {
            if (abs(vx) > abs(vy) * 1.15) {
                this.direcao = vx > 0 ? "direita" : "esquerda";
            } else if (abs(vy) > abs(vx) * 1.15) {
                this.direcao = vy > 0 ? "baixo" : "cima";
            }
            // se estiver "empatado" perto da diagonal, mantém a direção anterior
            // em vez de trocar — isso é o que dá aquele ar "liso"
        }

        // Move X e Y separadamente pra permitir "deslizar" na parede
        if (vx !== 0) {
            const novoX = this.x + passo * vx;
            if (!this.colideComParede(novoX, this.y)) this.x = novoX;
        }

        if (vy !== 0) {
            const novoY = this.y + passo * vy;
            if (!this.colideComParede(this.x, novoY)) this.y = novoY;
        }

        this.estado = andando ? "walk" : "idle";
    }

    animar(deltaTime){

        if(this.direcao === "baixo") this.linha = 0;
        if(this.direcao === "direita") this.linha = 1;
        if(this.direcao === "cima") this.linha = 2;
        if(this.direcao === "esquerda") this.linha = 3;

        // idle trava frame — mas não reseta o tempo abruptamente,
        // isso deixa a retomada da caminhada mais fluida
        if(this.estado === "idle"){
            this.frame = 0;
            this.indiceFrame = 0;
            return;
        }

        if(!deltaTime) deltaTime = 16;

        this.tempoFrame += deltaTime;

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

            this.tamanho,
            this.tamanho,

            this.x,
            this.y,

            this.tamanho,
            this.tamanho

        );
    }
}

export default Personagem;