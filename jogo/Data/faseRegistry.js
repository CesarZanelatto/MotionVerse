import Inicio from "./inicio.js";
import Fase1 from "./fase1.js";
import Fase2 from "./fase2.js";
import Fase3 from "./fase3.js";

// AUTO_IMPORTS_START
// (não remova) - imports gerados automaticamente pelo Editor de Fases
import Fase01 from "./fase_01.js";
import Fase02 from "./fase_02.js";
import FaseInicio from "./fase_inicio.js";
// AUTO_IMPORTS_END

export const CUSTOM_PHASES_STORAGE_KEY = "motionverse_custom_phases";

const FASES_PADRAO = {
  inicio: {
    id: "inicio",
    nome: "Início",
    background: "../Imagem/cenario/fundo_tela_inicio.png",
    htmlPath: "jogo.html",
    data: Inicio,
    origem: "padrao",
  },
  fase1: {
    id: "fase1",
    nome: "Fase 1",
    background: "../Imagem/cenario/fase1/fase1.png",
    htmlPath: "fase1.html",
    data: Fase1,
    origem: "padrao",
  },
  fase2: {
    id: "fase2",
    nome: "Fase 2",
    background: "../Imagem/cenario/fundo_tela_inicio.png",
    htmlPath: "fase2.html",
    data: Fase2,
    origem: "padrao",
  },
  fase3: {
    id: "fase3",
    nome: "Fase 3",
    background: "../Imagem/cenario/fundo_tela_inicio.png",
    htmlPath: "fase3.html",
    data: Fase3,
    origem: "padrao",
  },

  // AUTO_FASES_START
  // (não remova) - fases geradas automaticamente pelo Editor de Fases
  fase_01: {
    id: "fase_01",
    nome: "Servidor",
    background: "../Imagem/editor_uploads/fase_01/1786371159926_fase1.png",
    htmlPath: "fase_01.html",
    data: Fase01,
    origem: "padrao",
  },
  fase_02: {
  id: "fase_02",
  nome: "Biblioteca",
  background: "../Imagem/editor_uploads/fase_02/1786449093193_biblioteca.png",
  htmlPath: "fase_02.html",
  data: Fase02,
  origem: "padrao",
},
  fase_inicio: {
    id: "fase_inicio",
    nome: "Casa",
    background: "../Imagem/cenario/fundo_tela_inicio.png",
    htmlPath: "fase_inicio.html",
    data: FaseInicio,
    origem: "padrao",
  },
// AUTO_FASES_END
};

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function normalizarFase(id, fase, meta = {}) {
  const faseBase = clonar(fase || {});
  const faseId = String(id || faseBase.id || "").trim();
  const nome = String(faseBase.nome || faseId || "Nova Fase").trim();
  const tileSize = Number(faseBase.tileSize || 64);

  return {
    id: faseId,
    nome,
    background: faseBase.background || meta.background || "../Imagem/cenario/fundo_tela_inicio.png",
    htmlPath: meta.htmlPath || faseBase.htmlPath || "fase.html",
    origem: meta.origem || faseBase.origem || "custom",
    data: {
      id: faseBase.id || faseId,
      nome,
      background: faseBase.background || meta.background || "../Imagem/cenario/fundo_tela_inicio.png",
      sceneWidth: Number(faseBase.sceneWidth || 1920),
      sceneHeight: Number(faseBase.sceneHeight || 1080),
      tileSize,
      gridCols: Number(faseBase.gridCols || 30),
      gridRows: Number(faseBase.gridRows || 17),
      width: Number(faseBase.width || 64),
      height: Number(faseBase.height || 64),
      player: {
        velocidade: Number(faseBase.player?.velocidade || 4),
        x: Number(faseBase.player?.x || 0),
        y: Number(faseBase.player?.y || 0),
        img: faseBase.player?.img || "../Imagem/personagens/clara.png",
      },
      plataforma1: Array.isArray(faseBase.plataforma1) ? faseBase.plataforma1 : [],
      paredes: Array.isArray(faseBase.paredes) ? faseBase.paredes : [],
      interacoes: Array.isArray(faseBase.interacoes) ? faseBase.interacoes : [],
      elementosAnimados: Array.isArray(faseBase.elementosAnimados) ? faseBase.elementosAnimados : [],
      coletaveis: Array.isArray(faseBase.coletaveis) ? faseBase.coletaveis : [],
      caixa1: faseBase.caixa1 || {
        id: "c1_1",
        x: 0,
        y: 0,
        width: tileSize,
        height: tileSize,
        img: "",
        efeito: { status: true },
      },
      elemento1: faseBase.elemento1 || {
        id: "e1_1",
        x: 0,
        y: 0,
        width: tileSize,
        height: tileSize,
        img: "",
        status: true,
        texto: "",
      },
    },
  };
}

function lerFasesCustomizadas() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const bruto = localStorage.getItem(CUSTOM_PHASES_STORAGE_KEY);
    if (!bruto) return {};
    const parsed = JSON.parse(bruto);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Não foi possível ler as fases customizadas:", error);
    return {};
  }
}

function escreverFasesCustomizadas(fases) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CUSTOM_PHASES_STORAGE_KEY, JSON.stringify(fases));
}

export function listarFasesRegistradas() {
  const custom = lerFasesCustomizadas();
  const customNormalizadas = Object.entries(custom).reduce((acc, [id, fase]) => {
    acc[id] = normalizarFase(id, fase, { origem: "custom", htmlPath: "fase.html" });
    return acc;
  }, {});

  const padraoNormalizadas = Object.entries(FASES_PADRAO).reduce((acc, [id, item]) => {
    acc[id] = normalizarFase(id, item.data, item);
    return acc;
  }, {});

  return {
    ...padraoNormalizadas,
    ...customNormalizadas,
  };
}

export function listarMetadadosFases() {
  return Object.values(listarFasesRegistradas()).map((fase) => ({
    id: fase.id,
    nome: fase.nome,
    origem: fase.origem,
    htmlPath: fase.htmlPath,
  }));
}

export function obterFasePorId(id) {
  const faseId = String(id || "").trim().toLowerCase();
  if (!faseId) return null;
  return listarFasesRegistradas()[faseId] || null;
}

export function faseJaExiste(id) {
  return Boolean(obterFasePorId(id));
}

export function salvarFaseCustomizada(fase) {
  const id = String(fase?.id || "").trim().toLowerCase();
  if (!id) {
    throw new Error("Informe um ID de fase.");
  }

  const registroAtual = obterFasePorId(id);
  if (registroAtual?.origem === "padrao") {
    throw new Error("Esse ID já pertence a uma fase padrão do jogo.");
  }

  const custom = lerFasesCustomizadas();
  custom[id] = clonar(fase);
  escreverFasesCustomizadas(custom);

  return obterFasePorId(id);
}

export function removerFaseCustomizada(id) {
  const faseId = String(id || "").trim().toLowerCase();
  if (!faseId) return;

  const custom = lerFasesCustomizadas();
  delete custom[faseId];
  escreverFasesCustomizadas(custom);
}

export function obterRotaDaFase(id) {
  const fase = obterFasePorId(id);
  if (!fase) {
    return `fase.html?fase=${encodeURIComponent(id)}`;
  }

  // Fases que ainda estão só no armazenamento (localStorage) usam o player genérico com querystring.
  if (fase.origem === "custom") {
    return `fase.html?fase=${encodeURIComponent(fase.id)}`;
  }

  // Se existir um HTML dedicado, usa ele (compatível com fases "manuais")
  if (fase.htmlPath) {
    return fase.htmlPath;
  }

  return `fase.html?fase=${encodeURIComponent(fase.id)}`;
}
