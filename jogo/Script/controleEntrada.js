import cameraManager from "./handController/cameraManager.js";
import handController from "./handController/controller.js";

const DIRECOES_PADRAO = ["direita", "esquerda", "baixo", "cima"];

function criarEstadoBase() {
  return {
    direita: false,
    esquerda: false,
    cima: false,
    baixo: false,
  };
}

export default function criarControleEntrada() {
  const inputTeclado = criarEstadoBase();
  let inputCamera = null;

  document.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
      case "d":
      case "arrowright":
        inputTeclado.direita = true;
        break;
      case "a":
      case "arrowleft":
        inputTeclado.esquerda = true;
        break;
      case "w":
      case "arrowup":
        inputTeclado.cima = true;
        break;
      case "s":
      case "arrowdown":
        inputTeclado.baixo = true;
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()) {
      case "d":
      case "arrowright":
        inputTeclado.direita = false;
        break;
      case "a":
      case "arrowleft":
        inputTeclado.esquerda = false;
        break;
      case "w":
      case "arrowup":
        inputTeclado.cima = false;
        break;
      case "s":
      case "arrowdown":
        inputTeclado.baixo = false;
        break;
    }
  });

  async function iniciarCameraSeDisponivel() {
    const modoControle = localStorage.getItem("modoControle") || "camera";

    if (modoControle === "teclado") {
      inputCamera = null;
      return;
    }

    try {
      const equipe = JSON.parse(localStorage.getItem("equipeAtual") || "null");
      const jogadores = equipe?.jogadores || [];

      const camerasConfiguradas =
        jogadores.length === 4 &&
        jogadores.every((jogador) => jogador?.camera?.id);

      if (!camerasConfiguradas) {
        inputCamera = null;
        return;
      }

      await cameraManager.iniciar();

      let container = document.getElementById("hand-videos");
      if (!container) {
        container = document.createElement("div");
        container.id = "hand-videos";
        container.style.position = "fixed";
        container.style.left = "-10000px";
        container.style.top = "-10000px";
        container.style.width = "1px";
        container.style.height = "1px";
        container.style.overflow = "hidden";
        document.body.appendChild(container);
      }

      const mapping = {};

      for (let i = 0; i < Math.min(4, jogadores.length); i++) {
        const jogadorId = jogadores[i].id;
        mapping[jogadorId] = DIRECOES_PADRAO[i];

        const video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        container.appendChild(video);

        cameraManager.conectarVideo(jogadorId, video);
      }

      inputCamera = handController.iniciar({ cameraManager, mapping });
    } catch (error) {
      console.warn("HandController indisponível. O jogo continuará no teclado.", error);
      inputCamera = null;
    }
  }

  function obterInput() {
    return {
      direita: inputTeclado.direita || Boolean(inputCamera?.direita),
      esquerda: inputTeclado.esquerda || Boolean(inputCamera?.esquerda),
      cima: inputTeclado.cima || Boolean(inputCamera?.cima),
      baixo: inputTeclado.baixo || Boolean(inputCamera?.baixo),
    };
  }

  return {
    iniciarCameraSeDisponivel,
    obterInput,
  };
}
