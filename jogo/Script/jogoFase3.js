import { iniciarFase } from "./faseEngine.js";
import Fase3 from "../Data/fase3.js";

const fase = Fase3;
iniciarFase(fase);

// const audioFundo = new Audio("../som/fase3musicaFundo.mp3");
// audioFundo.loop = true;
// audioFundo.volume = 0.4;

// function iniciarMusica3() {
//   audioFundo.play().catch((error) => {
//     console.warn("Não foi possível iniciar a música.", error);
//   });
// }

// document.addEventListener("pointerdown", iniciarMusica3, { once: true });
// document.addEventListener("keydown", iniciarMusica3, { once: true });
