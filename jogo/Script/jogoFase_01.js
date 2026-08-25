import { iniciarFase } from "./faseEngine.js";
import Fase01 from "../Data/fase_01.js";

const fase = Fase01;
iniciarFase(fase);

const audioFundo = new Audio("../som/fase1musicaFundo.mp3");
audioFundo.loop = true;
audioFundo.volume = 0.4;

function iniciarMusica() {
  audioFundo.play().catch((error) => {
    console.warn("Não foi possível iniciar a música.", error);
  });
}

document.addEventListener("pointerdown", iniciarMusica, { once: true });
document.addEventListener("keydown", iniciarMusica, { once: true });
