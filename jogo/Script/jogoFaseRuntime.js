import { obterFasePorId } from "../Data/faseRegistry.js";
import { iniciarFase } from "./faseEngine.js";

const params = new URLSearchParams(window.location.search);
const faseId = (params.get("fase") || "inicio").toLowerCase();
const faseRegistro = obterFasePorId(faseId);

if (!faseRegistro) {
  alert(`Fase "${faseId}" não encontrada.`);
  window.location.href = "./editor.html";
  throw new Error(`Fase "${faseId}" não encontrada.`);
}

const fase = faseRegistro.data;
iniciarFase(fase);
