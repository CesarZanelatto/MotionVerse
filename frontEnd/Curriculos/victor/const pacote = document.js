const mensagem = document.getElementById('mensagem');
let etapaAtual = 0;

botao.addEventListener('click', () => {
    etapaAtual++;

    if (etapaAtual === 1) {
        pacote.className = 'no-roteador';
        mensagem.innerText = "🛰️ Passo 1: O pacote saiu do seu PC e chegou ao Roteador local. Ele está sendo fragmentado e endereçado via IP.";
    } 
    else if (etapaAtual === 2) {
        pacote.className = 'no-servidor';
        mensagem.innerText = "🌊 Passo 2: O pacote viajou por cabos de fibra ótica e chegou ao Servidor de destino. Requisição aceita!";
    } 
    else {
        etapaAtual = 0;
        pacote.className = 'no-pc';
        mensagem.innerText = "🔄 Reiniciando... Pronto para uma nova conexão.";
    }
});

botao.addEventListener('click', () => {
    etapaAtual++;

    if (etapaAtual === 1) {
        pacote.className = 'no-roteador';
        mensagem.innerText = "📟 PASSO 1: O roteador local analisa o endereço IP de destino e escolhe a melhor rota.";
    } 
    else if (etapaAtual === 2) {
        pacote.className = 'no-cabo';
        mensagem.innerText = "🌊 PASSO 2: O pacote agora viaja por pulsos de luz em cabos de fibra ótica no fundo do oceano!";
    }
    else if (etapaAtual === 3) {
        pacote.className = 'no-servidor';
        mensagem.innerText = "☁️ PASSO 3: Chegamos! O servidor processa os dados e prepara a resposta (Download).";
    }
    else {
        etapaAtual = 0;
        pacote.className = 'no-pc';
        mensagem.innerText = "💻 Início: O dado está pronto no seu computador.";
    }
});