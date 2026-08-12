import Personagem from "../Entitys/personagens.js";
import Plataforma from "../Entitys/plataforma.js";
import criarControleEntrada from "./controleEntrada.js";
import Inventario from "./inventario.js";

function criarHudInventario() {
  let hud = document.querySelector("#inventarioHUD");
  if (hud) return hud;

  hud = document.createElement("div");
  hud.id = "inventarioHUD";
  Object.assign(hud.style, {
    position: "fixed",
    top: "16px",
    right: "16px",
    minWidth: "220px",
    maxWidth: "360px",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "rgba(11, 32, 54, 0.9)",
    color: "#eef3f8",
    border: "2px solid rgba(255,255,255,0.12)",
    fontFamily: '"Pixelify Sans", monospace',
    zIndex: "20",
  });

  document.body.appendChild(hud);
  return hud;
}

function atualizarHudInventario(hud, inventario) {
  const itens = inventario.listar();
  const lista = itens.length
    ? itens.map((item) => `• ${item.nome}`).join("<br>")
    : "vazio";

  hud.innerHTML = `
    <strong style="display:block;margin-bottom:6px;">Inventário</strong>
    <span>${lista}</span>
  `;
}

function carregarPlataformas(fase) {
  return (fase.plataforma1 || []).map(
    (square) => new Plataforma(square.x, square.y, square.img, square.width, square.height)
  );
}

function carregarColetaveis(fase) {
  return (fase.coletaveis || []).map((item) => ({
    ...item,
    coletado: false,
    plataforma: new Plataforma(item.x, item.y, item.img, item.width, item.height),
  }));
}

function criarElementoAnimado(item) {
  const largura = Number(item.width || 64);
  const altura = Number(item.height || 64);
  const imagem = new Image();
  imagem.src = item.img || "";

  return {
    ...item,
    width: largura,
    height: altura,
    currentX: Number(item.startX || 0),
    currentY: Number(item.startY || 0),
    elapsed: 0,
    completedCycles: 0,
    sourceImage: imagem,
    frameCount: Math.max(1, Number(item.frameCount || 1)),
    frameInterval: Math.max(1, Number(item.frameInterval || 120)),
    moveDuration: Math.max(1, Number(item.moveDuration || 2000)),
    repeatCount: Math.max(0, Number(item.repeatCount || 0)),
    colisao: Boolean(item.colisao),
  };
}

function carregarElementosAnimados(fase) {
  return (fase.elementosAnimados || []).map((item) => criarElementoAnimado(item));
}

function colide(personagem, zona) {
  return (
    personagem.x < zona.x + zona.width &&
    personagem.x + personagem.tamanho > zona.x &&
    personagem.y < zona.y + zona.height &&
    personagem.y + personagem.tamanho > zona.y
  );
}

export function iniciarFase(fase, opcoes = {}) {
  const canvasSelector = opcoes.canvasSelector || "#telaRuntime";
  const tela = document.querySelector(canvasSelector);
  const ctx = tela.getContext("2d");
  const fundo = document.querySelector(opcoes.fundoSelector || "#fundo");
  const caixaDialogo = document.querySelector(opcoes.caixaDialogoSelector || "#caixa-dialogo");
  const textoDialogo = document.querySelector(opcoes.textoDialogoSelector || "#texto-dialogo");

  const sceneWidth = Number(fase.sceneWidth || 1920);
  const sceneHeight = Number(fase.sceneHeight || 1080);
  const tileSize = Number(fase.tileSize || 64);

  tela.width = sceneWidth;
  tela.height = sceneHeight;
  tela.style.width = `${sceneWidth}px`;
  tela.style.height = `${sceneHeight}px`;
  document.documentElement.style.setProperty("--scene-width", `${sceneWidth}px`);
  document.documentElement.style.setProperty("--scene-height", `${sceneHeight}px`);

  if (fundo) {
    fundo.src = fase.background || "../Imagem/cenario/fundo_tela_inicio.png";
    fundo.style.width = `${sceneWidth}px`;
    fundo.style.height = `${sceneHeight}px`;
  }

  const jogador = new Personagem(fase.player.x, fase.player.y, fase);
  const plataformas = carregarPlataformas(fase);
  const coletaveis = carregarColetaveis(fase);
  const elementosAnimados = carregarElementosAnimados(fase);
  const controleEntrada = criarControleEntrada();
  const inventario = new Inventario();
  const inventarioHud = criarHudInventario();

  controleEntrada.iniciarCameraSeDisponivel();
  atualizarHudInventario(inventarioHud, inventario);

  let interacaoAtiva = null;
  let timeoutTexto = null;
  let ultimoFrame = performance.now();
  fase.__paredesDinamicas = [];

  function mostrarTexto(texto, duracaoMs = 2000) {
    if (!caixaDialogo || !textoDialogo) return;
    textoDialogo.textContent = texto;
    caixaDialogo.classList.remove("oculto");

    if (timeoutTexto) clearTimeout(timeoutTexto);
    timeoutTexto = setTimeout(() => {
      caixaDialogo.classList.add("oculto");
      timeoutTexto = null;
    }, duracaoMs);
  }

  function executarInteracao(zona) {
    if (zona.tipo === "porta") {
      window.location.href = zona.destino;
      return;
    }

    if (zona.tipo === "texto") {
      mostrarTexto(zona.texto || "Mensagem", zona.duracao || 2000);
      return;
    }

    if (zona.tipo === "senha") {
      const resposta = window.prompt(zona.pergunta || "Digite a senha:");
      if (resposta === null) return;

      if (String(resposta).trim() === String(zona.resposta || "").trim()) {
        mostrarTexto(zona.textoSucesso || "Senha correta!", zona.duracao || 1500);
        window.dispatchEvent(new CustomEvent("motionverse:senha-correta", { detail: zona }));
      } else {
        mostrarTexto(zona.textoErro || "Senha incorreta.", zona.duracaoErro || 1500);
        window.dispatchEvent(new CustomEvent("motionverse:senha-incorreta", { detail: zona }));
      }
      return;
    }

    if (zona.tipo === "evento") {
      window.dispatchEvent(new CustomEvent("motionverse:evento-fase", { detail: zona }));
      if (zona.texto) {
        mostrarTexto(zona.texto, zona.duracao || 1500);
      }
      if (zona.destino) {
        setTimeout(() => {
          window.location.href = zona.destino;
        }, 600);
      }
    }
  }

  function verificarInteracoes() {
    const zonas = fase.interacoes || [];
    let tocandoAlgumaZona = false;

    for (const zona of zonas) {
      if (colide(jogador, zona)) {
        tocandoAlgumaZona = true;

        if (interacaoAtiva === zona.id) continue;

        interacaoAtiva = zona.id;
        executarInteracao(zona);
      }
    }

    if (!tocandoAlgumaZona) {
      interacaoAtiva = null;
    }
  }

  function verificarColetaveis() {
    coletaveis.forEach((item) => {
      if (item.coletado) return;
      if (!colide(jogador, item)) return;

      const adicionado = inventario.adicionar(item);
      item.coletado = true;
      atualizarHudInventario(inventarioHud, inventario);

      window.dispatchEvent(
        new CustomEvent("motionverse:item-coletado", {
          detail: {
            item,
            inventario: inventario.listar(),
          },
        })
      );

      if (adicionado) {
        mostrarTexto(`Coletado: ${item.nome || item.id}`, 1200);
      } else {
        mostrarTexto(`${item.nome || item.id} já está no inventário.`, 1200);
      }
    });
  }

  function desenharGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.3)";

    for (let x = 0; x <= sceneWidth; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, sceneHeight);
      ctx.stroke();
    }

    for (let y = 0; y <= sceneHeight; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(sceneWidth, y);
      ctx.stroke();
    }
  }

  function atualizarElementosAnimados(deltaTime) {
    fase.__paredesDinamicas = [];

    elementosAnimados.forEach((item) => {
      item.elapsed += deltaTime;
      const duracao = item.moveDuration;
      const progressoCiclo = Math.min(1, (item.elapsed % duracao) / duracao);
      const cicloAtual = Math.floor(item.elapsed / duracao);
      const infinito = item.repeatCount === 0;

      if (!infinito && cicloAtual >= item.repeatCount) {
        item.currentX = Number(item.endX || item.startX || 0);
        item.currentY = Number(item.endY || item.startY || 0);
      } else {
        item.currentX = Number(item.startX || 0) + (Number(item.endX || item.startX || 0) - Number(item.startX || 0)) * progressoCiclo;
        item.currentY = Number(item.startY || 0) + (Number(item.endY || item.startY || 0) - Number(item.startY || 0)) * progressoCiclo;
      }

      if (item.colisao) {
        fase.__paredesDinamicas.push({
          id: item.id,
          x: item.currentX,
          y: item.currentY,
          width: item.width,
          height: item.height,
        });
      }
    });
  }

  function desenharElementosAnimados() {
    elementosAnimados.forEach((item) => {
      const largura = item.width;
      const altura = item.height;
      const frameCount = item.frameCount;
      const frameAtual = Math.floor(item.elapsed / item.frameInterval) % frameCount;

      if (item.sourceImage.complete && item.sourceImage.naturalWidth > 0) {
        const frameWidth = item.sourceImage.naturalWidth / frameCount;
        const frameHeight = item.sourceImage.naturalHeight;
        ctx.drawImage(
          item.sourceImage,
          frameAtual * frameWidth,
          0,
          frameWidth,
          frameHeight,
          item.currentX,
          item.currentY,
          largura,
          altura
        );
      } else {
        ctx.save();
        ctx.fillStyle = "rgba(0, 120, 255, 0.35)";
        ctx.fillRect(item.currentX, item.currentY, largura, altura);
        ctx.restore();
      }

      ctx.save();
      ctx.strokeStyle = item.colisao ? "rgba(255, 90, 90, 0.95)" : "rgba(0, 200, 255, 0.95)";
      ctx.lineWidth = 2;
      ctx.strokeRect(item.currentX + 1, item.currentY + 1, largura - 2, altura - 2);
      ctx.restore();
    });
  }

  function desenharCenario() {
    plataformas.forEach((plataforma) => plataforma.desenhar(ctx));
    desenharElementosAnimados();

    coletaveis.forEach((item) => {
      if (item.coletado) return;
      item.plataforma.desenhar(ctx);

      ctx.save();
      ctx.strokeStyle = "rgba(0, 255, 170, 0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(item.x + 2, item.y + 2, tileSize - 4, tileSize - 4);
      ctx.restore();
    });
  }

  function desenhar() {
    const agora = performance.now();
    const deltaTime = agora - ultimoFrame;
    ultimoFrame = agora;

    ctx.clearRect(0, 0, sceneWidth, sceneHeight);
    atualizarElementosAnimados(deltaTime);
    desenharGrid();
    desenharCenario();
    jogador.atualizar(controleEntrada.obterInput(), deltaTime);
    verificarInteracoes();
    verificarColetaveis();
    jogador.desenhar(ctx);

    requestAnimationFrame(desenhar);
  }

  requestAnimationFrame(desenhar);

  return {
    inventario,
    jogador,
  };
}
