import { iniciarFase } from "./faseEngine.js";
import Fase02 from "../Data/fase_02.js";

const fase = Fase02;
iniciarFase(fase);

const audioFundo = new Audio("../som/fase2musicaFundo.mp3");
audioFundo.loop = true;
audioFundo.volume = 0.4;

function iniciarMusica2() {
  audioFundo.play().catch((error) => {
    console.warn("Não foi possível iniciar a música.", error);
  });
}

document.addEventListener("pointerdown", iniciarMusica2, { once: true });
document.addEventListener("keydown", iniciarMusica2, { once: true });
