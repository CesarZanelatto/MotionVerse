import { iniciarFase } from "./faseEngine.js";
import Fase01 from "../Data/fase_01.js";

const fase = Fase01;
iniciarFase(fase);

const audioFundo = new Audio("../som/fase1musicaFundo.mp3");
audioFundo.loop = true;

document.addEventListener("click", () => {
  audioFundo.play().catch(() => {});
}, { once: true });



