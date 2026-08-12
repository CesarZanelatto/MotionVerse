import {
  listarMetadadosFases,
  obterFasePorId,
  faseJaExiste,
  obterRotaDaFase,
} from "../Data/faseRegistry.js";

const backgrounds = [
  { label: "Campo inicial", value: "../Imagem/cenario/fundo_tela_inicio.png" },
  { label: "Fase 1", value: "../Imagem/cenario/fase1/fase1.png" },
  { label: "Teto inicial", value: "../Imagem/cenario/teto-inicio.png" },
];

const assets = [
  { label: "Chão 1", value: "../Imagem/cenario/chao/chao1.png" },
  { label: "Chão 2", value: "../Imagem/cenario/chao/chao2.png" },
  { label: "Chão 3", value: "../Imagem/cenario/chao/chao3.png" },
  { label: "Parede 1", value: "../Imagem/cenario/parede/1.png" },
  { label: "Parede 2", value: "../Imagem/cenario/parede/2.png" },
  { label: "Parede quadro", value: "../Imagem/cenario/parede/quadro.png" },
  { label: "Mesa 1", value: "../Imagem/cenario/assets/mesas/mesa1.png" },
  { label: "Mesa 2", value: "../Imagem/cenario/assets/mesas/mesa2.png" },
  { label: "Computador 1", value: "../Imagem/cenario/assets/computadores/pc1.png" },
  { label: "Computador 2", value: "../Imagem/cenario/assets/computadores/pc2.png" },
  { label: "Armário", value: "../Imagem/cenario/assets/armario/armario1.png" },
  { label: "Gaveta", value: "../Imagem/cenario/assets/gaveta/gaveta.png" },
  { label: "Lousa", value: "../Imagem/cenario/assets/lousa/lousa.png" },
  { label: "Planta 1", value: "../Imagem/cenario/assets/planta/planta1.png" },
  { label: "Planta 2", value: "../Imagem/cenario/assets/planta/planta2.png" },
  { label: "Servidor 1", value: "../Imagem/cenario/assets/servidores/servidor1.png" },
  { label: "Bebedouro", value: "../Imagem/cenario/assets/galao-d-agua/bebedouro.png" },
  { label: "Lixo 1", value: "../Imagem/cenario/assets/lixo/lixo1.png" },
];

const tileSize = 64;
const sceneWidth = 1920;
const sceneHeight = 1080;
const defaultGridCols = 30;
const defaultGridRows = 17;
const playerSprite = "../Imagem/personagens/clara.png";

const canvas = document.getElementById("editorCanvas");
const ctx = canvas.getContext("2d");

const faseIdInput = document.getElementById("faseId");
const faseNomeInput = document.getElementById("faseNome");
const faseBackgroundSelect = document.getElementById("faseBackground");
const backgroundFolderPathInput = document.getElementById("backgroundFolderPath");
const backgroundFileNameInput = document.getElementById("backgroundFileName");
const backgroundCustomPathInput = document.getElementById("backgroundCustomPath");
const faseExistenteSelect = document.getElementById("faseExistente");
const ferramentaSelect = document.getElementById("ferramenta");
const assetSelect = document.getElementById("assetSelect");
const assetFolderPathInput = document.getElementById("assetFolderPath");
const assetFileNameInput = document.getElementById("assetFileName");
const assetCustomPathInput = document.getElementById("assetCustomPath");
const destinoFaseSelect = document.getElementById("destinoFase");
const interacaoTextoInput = document.getElementById("interacaoTexto");
const senhaPerguntaInput = document.getElementById("senhaPergunta");
const senhaRespostaInput = document.getElementById("senhaResposta");
const eventoNomeInput = document.getElementById("eventoNome");
const animadoIdInput = document.getElementById("animadoId");
const animadoFramesInput = document.getElementById("animadoFrames");
const animadoFrameMsInput = document.getElementById("animadoFrameMs");
const animadoDuracaoMsInput = document.getElementById("animadoDuracaoMs");
const animadoRepeticoesInput = document.getElementById("animadoRepeticoes");
const animadoLarguraInput = document.getElementById("animadoLargura");
const animadoAlturaInput = document.getElementById("animadoAltura");
const animadoColisaoInput = document.getElementById("animadoColisao");
const animadoMarcacaoStatus = document.getElementById("animadoMarcacaoStatus");
const coletavelIdInput = document.getElementById("coletavelId");
const coletavelNomeInput = document.getElementById("coletavelNome");
const coletavelTipoInput = document.getElementById("coletavelTipo");
const coletavelUnicoInput = document.getElementById("coletavelUnico");
const posicaoCursor = document.getElementById("posicaoCursor");
const faseAtualLabel = document.getElementById("faseAtualLabel");
const statusEditor = document.getElementById("statusEditor");
const resumoItens = document.getElementById("resumoItens");

const btnCarregarFase = document.getElementById("btnCarregarFase");
const btnNovaFase = document.getElementById("btnNovaFase");
const btnSalvarFase = document.getElementById("btnSalvarFase");
const btnTestarFase = document.getElementById("btnTestarFase");
const btnLimparGrid = document.getElementById("btnLimparGrid");
const btnAplicarAssetPath = document.getElementById("btnAplicarAssetPath");
const btnAplicarBackgroundPath = document.getElementById("btnAplicarBackgroundPath");
const pastaProjetoStatus = document.getElementById("pastaProjetoStatus");

const btnEscolherTileArquivo = document.getElementById("btnEscolherTileArquivo");
const btnEscolherBackgroundArquivo = document.getElementById("btnEscolherBackgroundArquivo");
const tileArquivoLabel = document.getElementById("tileArquivoLabel");
const backgroundArquivoLabel = document.getElementById("backgroundArquivoLabel");
const filePickerTile = document.getElementById("filePickerTile");
const filePickerBackground = document.getElementById("filePickerBackground");

const backgroundImage = new Image();
const imageCache = new Map();

let faseCarregadaOriginal = null;

let faseAtual = criarFaseVazia();

// Arquivos selecionados manualmente pelo usuário (para copiar para dentro do projeto ao salvar)
let tileArquivoSelecionado = null;
let backgroundArquivoSelecionado = null;

// Para visualizar no editor antes de salvar
let tilePreviewUrl = "";
let backgroundPreviewUrl = "";

// Mapa blobUrl -> File (permite múltiplas imagens no mesmo mapa)
const arquivosBlob = new Map();
const rotasFasesGeradas = new Map();
const fasesGeradasSessao = new Map();
let animadoInicioPendente = null;

function criarFaseVazia() {
  return {
    id: "",
    nome: "",
    background: backgrounds[0].value,
    sceneWidth,
    sceneHeight,
    tileSize,
    dpi: 72,
    gridCols: defaultGridCols,
    gridRows: defaultGridRows,
    width: 64,
    height: 64,
    player: {
      velocidade: 4,
      x: 128,
      y: 128,
      img: playerSprite,
    },
    plataforma1: [],
    paredes: [],
    interacoes: [],
    elementosAnimados: [],
    coletaveis: [],
    caixa1: {
      id: "c1_1",
      x: 0,
      y: 0,
      width: tileSize,
      height: tileSize,
      img: "",
      efeito: { status: true },
    },
    elemento1: {
      id: "e1_1",
      x: 0,
      y: 0,
      width: tileSize,
      height: tileSize,
      img: "",
      status: true,
      texto: "",
    },
  };
}

function clonar(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizarSeparadores(caminho) {
  return String(caminho || "").replace(/\\/g, "/").trim();
}

function juntarCaminho(pasta, arquivo) {
  const base = normalizarSeparadores(pasta).replace(/\/+$/, "");
  const nome = normalizarSeparadores(arquivo).replace(/^\/+/, "");

  if (!base) return nome;
  if (!nome) return base;

  return `${base}/${nome}`;
}

function labelDoCaminho(caminho) {
  const partes = normalizarSeparadores(caminho).split("/");
  return partes[partes.length - 1] || caminho;
}

function preencherSelect(select, options, labelField = "label", valueField = "value") {
  select.innerHTML = "";
  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[valueField];
    option.textContent = item[labelField];
    select.appendChild(option);
  });
}

function garantirOpcao(select, value, labelPrefix = "Custom") {
  const caminho = normalizarSeparadores(value);
  if (!caminho) return;

  const existente = Array.from(select.options).find((option) => option.value === caminho);
  if (existente) {
    select.value = caminho;
    return;
  }

  const option = document.createElement("option");
  option.value = caminho;
  option.textContent = `${labelPrefix}: ${labelDoCaminho(caminho)}`;
  select.appendChild(option);
  select.value = caminho;
}

function garantirFaseNasListas(id, origem = "arquivo") {
  const label = `${id} (${origem})`;
  const garantir = (select) => {
    const existente = Array.from(select.options).find((option) => option.value === id);
    if (!existente) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = label;
      select.appendChild(option);
    } else {
      existente.textContent = label;
    }
  };

  garantir(faseExistenteSelect);
  garantir(destinoFaseSelect);
}

function obterRotaDaFaseEditor(id) {
  return rotasFasesGeradas.get(id) || obterRotaDaFase(id);
}

function setStatusPastaProjeto(texto, erro = false) {
  if (!pastaProjetoStatus) return;
  pastaProjetoStatus.textContent = texto;
  pastaProjetoStatus.style.color = erro ? "#ffb3b3" : "";
}

function inserirNoBloco(texto, marcadorInicio, marcadorFim, linha) {
  const start = texto.indexOf(marcadorInicio);
  const end = texto.indexOf(marcadorFim);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Não encontrei os marcadores de inserção automática no faseRegistry.js.");
  }

  const blocoInicio = start + marcadorInicio.length;
  const antes = texto.slice(0, blocoInicio);
  const meio = texto.slice(blocoInicio, end);
  const depois = texto.slice(end);

  if (meio.includes(linha.trim())) {
    return texto; // já existe
  }

  // insere no final do bloco (antes do marcador de fim)
  const meioNovo = `${meio.replace(/\s*$/, "")}\n${linha}\n`;
  return `${antes}${meioNovo}${depois}`;
}

function substituirOuInserirNoBloco(texto, marcadorInicio, marcadorFim, regexSubstituicao, novoTrecho) {
  const start = texto.indexOf(marcadorInicio);
  const end = texto.indexOf(marcadorFim);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Não encontrei os marcadores de inserção automática no faseRegistry.js.");
  }

  const blocoInicio = start + marcadorInicio.length;
  const antes = texto.slice(0, blocoInicio);
  const meio = texto.slice(blocoInicio, end);
  const depois = texto.slice(end);

  let meioNovo = meio;
  if (regexSubstituicao.test(meio)) {
    meioNovo = meio.replace(regexSubstituicao, `${novoTrecho}\n`);
  } else {
    meioNovo = `${meio.replace(/\s*$/, "")}\n${novoTrecho}\n`;
  }

  return `${antes}${meioNovo}${depois}`;
}

function nomeConstDaFase(id) {
  const texto = String(id || "").trim();
  const pascal = texto
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  const normalizado = pascal || "Fase";
  return normalizado.charAt(0).toUpperCase() + normalizado.slice(1);
}

function gerarHtmlDaFase({ id, nome, background, scriptFile }) {
  const bg = background || "../Imagem/cenario/fundo_tela_inicio.png";
  return `<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../Estilo/fase1.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Motion Verse - ${nome || id}</title>
  </head>
  <body>
    <header></header>
    <img id="fundo" src="${bg}" alt="Fundo da fase" />
    <main>
      <div id="display_jogador"></div>
      <canvas id="telaRuntime"></canvas>
      <div id="caixa-dialogo" class="oculto">
        <p id="texto-dialogo"></p>
      </div>
    </main>
    <footer></footer>
    <script type="module" src="../Script/${scriptFile}"></script>
  </body>
</html>`;
}

function gerarScriptDaFase({ dataImport, dataFile, destinoPadrao }) {
  // Script compatível com o padrão do projeto (Personagem + Plataforma + interações)
  return `import Personagem from "../Entitys/personagens.js";
import Plataforma from "../Entitys/plataforma.js";
import criarControleEntrada from "./controleEntrada.js";
import ${dataImport} from "../Data/${dataFile}";

const fase = ${dataImport};

const tela = document.querySelector("#telaRuntime");
const ctx = tela.getContext("2d");
const fundo = document.querySelector("#fundo");
const caixaDialogo = document.querySelector("#caixa-dialogo");
const textoDialogo = document.querySelector("#texto-dialogo");

tela.width = window.innerWidth;
tela.height = window.innerHeight;

if (fundo) {
  fundo.src = fase.background || "${destinoPadrao}";
}

const jogador = new Personagem(
  fase.player.x,
  fase.player.y,
  fase
);

const controleEntrada = criarControleEntrada();
controleEntrada.iniciarCameraSeDisponivel();

let interacaoAtiva = null;
let timeoutTexto = null;
let ultimoFrame = performance.now();

function criarCenario() {
  (fase.plataforma1 || []).forEach((square) => {
    const p = new Plataforma(square.x, square.y, square.img, square.width, square.height);
    p.desenhar(ctx);
  });
}

function colide(personagem, zona) {
  return (
    personagem.x < zona.x + zona.width &&
    personagem.x + personagem.tamanho > zona.x &&
    personagem.y < zona.y + zona.height &&
    personagem.y + personagem.tamanho > zona.y
  );
}

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
      if (zona.destino) {
        setTimeout(() => {
          window.location.href = zona.destino;
        }, 600);
      }
    } else {
      mostrarTexto(zona.textoErro || "Senha incorreta.", zona.duracaoErro || 1500);
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

function desenharGrid() {
  const quadrado = Number(fase.tileSize || 64);
  ctx.font = "9px Arial";
  ctx.strokeStyle = "rgba(255,255,255,0.25)";

  for (let y = 0; y <= tela.height; y += quadrado) {
    for (let x = 0; x <= tela.width; x += quadrado) {
      ctx.strokeRect(x + 0.5, y + 0.5, quadrado, quadrado);
    }
  }
}

function desenhar() {
  const agora = performance.now();
  const deltaTime = agora - ultimoFrame;
  ultimoFrame = agora;

  ctx.clearRect(0, 0, tela.width, tela.height);
  desenharGrid();
  criarCenario();

  jogador.atualizar(
    controleEntrada.obterInput(),
    deltaTime
  );

  verificarInteracoes();
  jogador.desenhar(ctx);

  requestAnimationFrame(desenhar);
}

requestAnimationFrame(desenhar);
`;
}


function slugSeguro(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function nomeScriptDaFase(id) {
  const texto = String(id || "").trim();
  const lower = texto.toLowerCase();
  if (lower.startsWith("fase")) {
    return `jogoFase${texto.slice(4)}.js`;
  }
  // fallback
  const pascal = texto
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return `jogo${pascal || "Fase"}.js`;
}

function destinoHtmlDaFase(id) {
  return `${String(id || "").trim().toLowerCase()}.html`;
}

function obterFaseLocal(id) {
  return fasesGeradasSessao.get(String(id || "").trim().toLowerCase()) || null;
}

function registrarFaseLocal(fase, htmlPath) {
  const id = String(fase?.id || "").trim().toLowerCase();
  if (!id) return;
  fasesGeradasSessao.set(id, clonar(fase));
  rotasFasesGeradas.set(id, htmlPath);
  garantirFaseNasListas(id, "arquivo");
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${file?.name || ""}.`));
    reader.readAsDataURL(file);
  });
}

async function gerarPayloadArquivos(fase) {
  const assetsPayload = [];
  const refs = new Set();

  if (String(fase.background || "").startsWith("blob:")) {
    refs.add(fase.background);
  }

  for (const item of fase.plataforma1 || []) {
    if (String(item.img || "").startsWith("blob:")) {
      refs.add(item.img);
    }
  }

  for (const item of fase.elementosAnimados || []) {
    if (String(item.img || "").startsWith("blob:")) {
      refs.add(item.img);
    }
  }

  for (const item of fase.coletaveis || []) {
    if (String(item.img || "").startsWith("blob:")) {
      refs.add(item.img);
    }
  }

  for (const ref of refs) {
    const file = arquivosBlob.get(ref);
    if (!file) continue;
    assetsPayload.push({
      originalRef: ref,
      name: file.name,
      type: file.type || "application/octet-stream",
      dataUrl: await fileToDataURL(file),
    });
  }

  return assetsPayload;
}

function obterBasesApi() {
  const bases = [];
  const origemAtual = window.location.origin;

  if (origemAtual && origemAtual !== "null") {
    bases.push(origemAtual);
  }

  const host = window.location.hostname || "localhost";
  const fallbackPrincipal = `${window.location.protocol}//${host}:3000`;
  const fallbackLocalhost = `http://localhost:3000`;

  for (const base of [fallbackPrincipal, fallbackLocalhost]) {
    if (!bases.includes(base)) {
      bases.push(base);
    }
  }

  return bases;
}

async function salvarFaseViaApi(fase, assetsPayload) {
  let ultimoErro = null;

  for (const base of obterBasesApi()) {
    try {
      const resposta = await fetch(`${base}/api/editor/save-phase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fase,
          assets: assetsPayload,
        }),
      });

      const data = await resposta.json().catch(() => ({}));
      if (resposta.ok && data?.ok) {
        return {
          ...data,
          apiBaseUrl: data.apiBaseUrl || base,
        };
      }

      ultimoErro = new Error(
        data?.error ||
          `Não foi possível salvar a fase pelo servidor ${base}.`
      );
    } catch (error) {
      ultimoErro = error;
    }
  }

  throw new Error(
    ultimoErro?.message ||
      "Não foi possível salvar a fase. Inicie `npm start` e use `http://localhost:3000/jogo/Marcacao/editor.html`."
  );
}

function atualizarListas() {
  preencherSelect(faseBackgroundSelect, backgrounds);
  preencherSelect(assetSelect, assets);

  const fases = listarMetadadosFases()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((fase) => ({
      label: `${fase.id} (${fase.origem})`,
      value: fase.id,
    }));

  preencherSelect(faseExistenteSelect, [{ label: "Selecione uma fase", value: "" }, ...fases]);
  preencherSelect(destinoFaseSelect, [{ label: "Selecione a fase destino", value: "" }, ...fases]);
}

function atualizarStatusAnimado() {
  if (!animadoMarcacaoStatus) return;

  if (animadoInicioPendente) {
    animadoMarcacaoStatus.textContent =
      `Início marcado em (${animadoInicioPendente.x}, ${animadoInicioPendente.y}). Clique no fim do movimento.`;
    return;
  }

  animadoMarcacaoStatus.textContent =
    "Ferramenta animada: clique no início e depois no fim do movimento.";
}

function sincronizarFormulario() {
  faseAtual.sceneWidth = sceneWidth;
  faseAtual.sceneHeight = sceneHeight;
  faseAtual.gridCols = defaultGridCols;
  faseAtual.gridRows = defaultGridRows;
  faseIdInput.value = faseAtual.id || "";
  faseNomeInput.value = faseAtual.nome || "";
  garantirOpcao(faseBackgroundSelect, faseAtual.background || backgrounds[0].value, "Background");
  backgroundCustomPathInput.value = faseAtual.background || backgrounds[0].value;

  const partesBackground = normalizarSeparadores(faseAtual.background || "").split("/");
  backgroundFileNameInput.value = partesBackground.pop() || "";
  backgroundFolderPathInput.value = partesBackground.join("/");

  assetCustomPathInput.value = assetSelect.value || assets[0].value;
  const partesAsset = normalizarSeparadores(assetCustomPathInput.value).split("/");
  assetFileNameInput.value = partesAsset.pop() || "";
  assetFolderPathInput.value = partesAsset.join("/");
  faseAtualLabel.textContent = faseAtual.id
    ? `Editando: ${faseAtual.id}`
    : "Fase nova ainda não salva";
  atualizarStatusAnimado();
}

function carregarFaseNoEditor(faseId) {
  const faseLocal = obterFaseLocal(faseId);
  if (faseLocal) {
    faseAtual = clonar(faseLocal);
    faseAtual.plataforma1 = faseAtual.plataforma1 || [];
    faseAtual.paredes = faseAtual.paredes || [];
    faseAtual.interacoes = faseAtual.interacoes || [];
    faseAtual.elementosAnimados = faseAtual.elementosAnimados || [];
    faseAtual.coletaveis = faseAtual.coletaveis || [];
    faseAtual.id = faseLocal.id;
    faseAtual.nome = faseLocal.nome;
    faseCarregadaOriginal = {
      id: faseLocal.id,
      origem: "arquivo",
    };
    const htmlPathLocal = destinoHtmlDaFase(faseLocal.id);
    rotasFasesGeradas.set(faseLocal.id, htmlPathLocal);

    canvas.width = sceneWidth;
    canvas.height = sceneHeight;
    sincronizarFormulario();
    renderizar();
    definirStatus(`Fase ${faseLocal.id} carregada no editor.`);
    return;
  }

  const registro = obterFasePorId(faseId);
  if (!registro) {
    definirStatus("Fase não encontrada.", true);
    return;
  }

  faseAtual = clonar(registro.data);
  faseAtual.plataforma1 = faseAtual.plataforma1 || [];
  faseAtual.paredes = faseAtual.paredes || [];
  faseAtual.interacoes = faseAtual.interacoes || [];
  faseAtual.elementosAnimados = faseAtual.elementosAnimados || [];
  faseAtual.coletaveis = faseAtual.coletaveis || [];
  faseAtual.id = registro.id;
  faseAtual.nome = registro.nome;
  faseAtual.background = registro.data.background || registro.background || backgrounds[0].value;
  faseCarregadaOriginal = {
    id: registro.id,
    origem: registro.origem,
  };
  if (registro.htmlPath) {
    rotasFasesGeradas.set(registro.id, registro.htmlPath);
  }

  canvas.width = sceneWidth;
  canvas.height = sceneHeight;
  animadoInicioPendente = null;
  sincronizarFormulario();

  const ultimoTile = faseAtual.plataforma1[faseAtual.plataforma1.length - 1];
  if (ultimoTile?.img) {
    garantirOpcao(assetSelect, ultimoTile.img, "Tile");
    assetCustomPathInput.value = ultimoTile.img;
    const partesAsset = normalizarSeparadores(ultimoTile.img).split("/");
    assetFileNameInput.value = partesAsset.pop() || "";
    assetFolderPathInput.value = partesAsset.join("/");
  }

  renderizar();
  definirStatus(`Fase ${registro.id} carregada no editor.`);
}

function definirStatus(texto, erro = false) {
  statusEditor.textContent = texto;
  statusEditor.style.color = erro ? "#ffb3b3" : "";
}

function atualizarResumo() {
  resumoItens.innerHTML = "";
  const itens = [
    `Sprites: ${faseAtual.plataforma1.length}`,
    `Colisões: ${faseAtual.paredes.length}`,
    `Animados: ${faseAtual.elementosAnimados.length}`,
    `Interações: ${faseAtual.interacoes.length}`,
    `Coletáveis: ${faseAtual.coletaveis.length}`,
    `Mapa: 1920x1080`,
    `Início do personagem: (${faseAtual.player.x}, ${faseAtual.player.y})`,
  ];

  itens.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    resumoItens.appendChild(li);
  });
}

function carregarImagem(src) {
  if (!src) {
    return Promise.resolve(null);
  }

  if (imageCache.has(src)) {
    return imageCache.get(src);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

function renderizarBackground() {
  return new Promise((resolve) => {
    if (!faseAtual.background) {
      resolve();
      return;
    }

    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      resolve();
    };

    backgroundImage.onerror = () => resolve();
    backgroundImage.src = faseAtual.background;
  });
}

function desenharGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  for (let x = 0; x <= canvas.width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize) {
      ctx.fillText(`X:${x}`, x + 4, y + 6);
      ctx.fillText(`Y:${y}`, x + 4, y + 20);
    }
  }

  ctx.restore();
}

function desenharRetangulos(lista, cor) {
  ctx.save();
  ctx.fillStyle = cor;
  lista.forEach((item) => {
    ctx.fillRect(item.x, item.y, item.width || tileSize, item.height || tileSize);
  });
  ctx.restore();
}

function desenharSpawn() {
  ctx.save();
  ctx.fillStyle = "#f7941d";
  ctx.beginPath();
  ctx.arc(faseAtual.player.x + tileSize / 2, faseAtual.player.y + tileSize / 2, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(faseAtual.player.x + 4, faseAtual.player.y + 4, tileSize - 8, tileSize - 8);
  ctx.restore();
}

async function desenharElementosAnimados() {
  const elementos = await Promise.all(
    faseAtual.elementosAnimados.map(async (item) => ({
      item,
      img: await carregarImagem(item.img),
    }))
  );

  elementos.forEach(({ item, img }) => {
    const largura = Number(item.width || tileSize);
    const altura = Number(item.height || tileSize);

    ctx.save();
    ctx.strokeStyle = item.colisao ? "rgba(255, 90, 90, 0.95)" : "rgba(0, 200, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(item.startX + largura / 2, item.startY + altura / 2);
    ctx.lineTo(item.endX + largura / 2, item.endY + altura / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.fillRect(item.startX + 8, item.startY + 8, 12, 12);
    ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
    ctx.fillRect(item.endX + 8, item.endY + 8, 12, 12);

    if (img) {
      ctx.drawImage(img, item.startX, item.startY, largura, altura);
    } else {
      ctx.fillStyle = "rgba(0, 120, 255, 0.35)";
      ctx.fillRect(item.startX, item.startY, largura, altura);
    }

    if (item.colisao) {
      ctx.strokeStyle = "rgba(255, 90, 90, 0.95)";
      ctx.strokeRect(item.startX + 1, item.startY + 1, largura - 2, altura - 2);
    }

    ctx.restore();
  });

  if (animadoInicioPendente) {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 0, 0.95)";
    ctx.lineWidth = 3;
    ctx.strokeRect(animadoInicioPendente.x + 2, animadoInicioPendente.y + 2, tileSize - 4, tileSize - 4);
    ctx.restore();
  }
}

async function renderizar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await renderizarBackground();
  desenharGrid();

  const imagens = await Promise.all(
    faseAtual.plataforma1.map(async (item) => ({
      item,
      img: await carregarImagem(item.img),
    }))
  );

  imagens.forEach(({ item, img }) => {
    if (img) {
      ctx.drawImage(img, item.x, item.y, tileSize, tileSize);
      return;
    }

    ctx.save();
    ctx.fillStyle = "rgba(255, 140, 0, 0.35)";
    ctx.fillRect(item.x, item.y, tileSize, tileSize);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.strokeRect(item.x + 1, item.y + 1, tileSize - 2, tileSize - 2);
    ctx.restore();
  });

  desenharRetangulos(faseAtual.paredes, "rgba(255, 0, 0, 0.35)");
  desenharRetangulos(
    faseAtual.interacoes.filter((item) => item.tipo === "porta"),
    "rgba(0, 163, 255, 0.35)"
  );
  desenharRetangulos(
    faseAtual.interacoes.filter((item) => item.tipo === "texto"),
    "rgba(255, 255, 0, 0.35)"
  );
  desenharRetangulos(
    faseAtual.interacoes.filter((item) => item.tipo === "senha"),
    "rgba(170, 102, 255, 0.35)"
  );
  desenharRetangulos(
    faseAtual.interacoes.filter((item) => item.tipo === "evento"),
    "rgba(0, 255, 170, 0.35)"
  );
  const coletaveis = await Promise.all(
    faseAtual.coletaveis.map(async (item) => ({
      item,
      img: await carregarImagem(item.img),
    }))
  );

  coletaveis.forEach(({ item, img }) => {
    if (img) {
      ctx.drawImage(img, item.x, item.y, tileSize, tileSize);
    }

    ctx.save();
    ctx.strokeStyle = "rgba(0, 255, 170, 0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(item.x + 2, item.y + 2, tileSize - 4, tileSize - 4);
    ctx.restore();
  });
  await desenharElementosAnimados();
  desenharSpawn();
  atualizarResumo();
}

function obterPosicaoGrid(event) {
  const rect = canvas.getBoundingClientRect();
  const brutoX = Math.floor((event.clientX - rect.left) / tileSize) * tileSize;
  const brutoY = Math.floor((event.clientY - rect.top) / tileSize) * tileSize;
  const limiteX = sceneWidth - tileSize;
  const limiteY = Math.floor((sceneHeight - 1) / tileSize) * tileSize;
  const foraDaGrade = brutoX < 0 || brutoY < 0 || brutoX > limiteX || brutoY > limiteY;

  return {
    x: brutoX,
    y: brutoY,
    foraDaGrade,
  };
}

function gerarId(prefixo, x, y) {
  return `${prefixo}_${x}_${y}`;
}

function removerItensNaPosicao(x, y) {
  faseAtual.plataforma1 = faseAtual.plataforma1.filter((item) => !(item.x === x && item.y === y));
  faseAtual.paredes = faseAtual.paredes.filter((item) => !(item.x === x && item.y === y));
  faseAtual.interacoes = faseAtual.interacoes.filter((item) => !(item.x === x && item.y === y));
  faseAtual.elementosAnimados = faseAtual.elementosAnimados.filter(
    (item) =>
      !(
        (item.startX === x && item.startY === y) ||
        (item.endX === x && item.endY === y)
      )
  );
  faseAtual.coletaveis = faseAtual.coletaveis.filter((item) => !(item.x === x && item.y === y));
}

function upsertNaLista(lista, item) {
  const index = lista.findIndex((atual) => atual.id === item.id);
  if (index >= 0) {
    lista[index] = item;
  } else {
    lista.push(item);
  }
}

function aplicarFerramenta(x, y) {
  const ferramenta = ferramentaSelect.value;

  const limiteX = sceneWidth - tileSize;
  const limiteY = Math.floor((sceneHeight - 1) / tileSize) * tileSize;
  if (x < 0 || y < 0 || x > limiteX || y > limiteY) {
    definirStatus("A posição está fora da grade útil de 64x64 dentro do mapa 1920x1080.", true);
    return;
  }

  if (ferramenta === "apagar") {
    removerItensNaPosicao(x, y);
    renderizar();
    return;
  }

  if (ferramenta === "spawn") {
    faseAtual.player.x = x;
    faseAtual.player.y = y;
    definirStatus(`Início do personagem marcado em (${x}, ${y}).`);
    renderizar();
    return;
  }

  if (ferramenta === "plataforma") {
    upsertNaLista(faseAtual.plataforma1, {
      id: gerarId("tile", x, y),
      x,
      y,
      width: tileSize,
      height: tileSize,
      img: assetSelect.value,
      efeito: false,
    });
    renderizar();
    return;
  }

  if (ferramenta === "colisao") {
    upsertNaLista(faseAtual.paredes, {
      id: gerarId("parede", x, y),
      x,
      y,
      width: tileSize,
      height: tileSize,
      img: "",
    });
    renderizar();
    return;
  }

  if (ferramenta === "animado") {
    if (!animadoInicioPendente) {
      animadoInicioPendente = { x, y };
      atualizarStatusAnimado();
      definirStatus(`Início do movimento marcado em (${x}, ${y}). Agora clique no fim.`);
      renderizar();
      return;
    }

    const animadoId = String(animadoIdInput.value || "").trim() || gerarId("animado", animadoInicioPendente.x, animadoInicioPendente.y);
    upsertNaLista(faseAtual.elementosAnimados, {
      id: animadoId,
      img: assetSelect.value,
      startX: animadoInicioPendente.x,
      startY: animadoInicioPendente.y,
      endX: x,
      endY: y,
      width: Math.max(1, Number(animadoLarguraInput.value || tileSize)),
      height: Math.max(1, Number(animadoAlturaInput.value || tileSize)),
      frameCount: Math.max(1, Number(animadoFramesInput.value || 1)),
      frameInterval: Math.max(1, Number(animadoFrameMsInput.value || 120)),
      moveDuration: Math.max(1, Number(animadoDuracaoMsInput.value || 2000)),
      repeatCount: Math.max(0, Number(animadoRepeticoesInput.value || 0)),
      colisao: Boolean(animadoColisaoInput.checked),
    });
    animadoInicioPendente = null;
    atualizarStatusAnimado();
    definirStatus(`Elemento animado salvo com movimento de (${x}, ${y}).`);
    renderizar();
    return;
  }

  if (ferramenta === "coletavel") {
    const itemId = String(coletavelIdInput.value || "").trim() || gerarId("item", x, y);
    upsertNaLista(faseAtual.coletaveis, {
      id: itemId,
      nome: String(coletavelNomeInput.value || "").trim() || itemId,
      tipo: String(coletavelTipoInput.value || "").trim() || "item",
      unico: Boolean(coletavelUnicoInput.checked),
      x,
      y,
      width: tileSize,
      height: tileSize,
      img: assetSelect.value,
    });
    renderizar();
    return;
  }

  if (ferramenta === "texto") {
    upsertNaLista(faseAtual.interacoes, {
      id: gerarId("texto", x, y),
      tipo: "texto",
      x,
      y,
      width: tileSize,
      height: tileSize,
      texto: interacaoTextoInput.value || "Mensagem",
      duracao: 2000,
    });
    renderizar();
    return;
  }

  if (ferramenta === "porta") {
    if (!destinoFaseSelect.value) {
      definirStatus("Selecione a fase destino antes de posicionar a porta.", true);
      return;
    }

    upsertNaLista(faseAtual.interacoes, {
      id: gerarId("porta", x, y),
      tipo: "porta",
      x,
      y,
      width: tileSize,
      height: tileSize,
      destino: obterRotaDaFaseEditor(destinoFaseSelect.value),
      texto: interacaoTextoInput.value || "",
    });
    renderizar();
    return;
  }

  if (ferramenta === "senha") {
    upsertNaLista(faseAtual.interacoes, {
      id: gerarId("senha", x, y),
      tipo: "senha",
      x,
      y,
      width: tileSize,
      height: tileSize,
      pergunta: senhaPerguntaInput.value || "Digite a senha:",
      resposta: senhaRespostaInput.value || "",
      textoSucesso: interacaoTextoInput.value || "Senha correta!",
      textoErro: "Senha incorreta.",
      destino: destinoFaseSelect.value ? obterRotaDaFaseEditor(destinoFaseSelect.value) : "",
    });
    renderizar();
    return;
  }

  if (ferramenta === "evento") {
    upsertNaLista(faseAtual.interacoes, {
      id: gerarId("evento", x, y),
      tipo: "evento",
      x,
      y,
      width: tileSize,
      height: tileSize,
      eventoNome: eventoNomeInput.value || "evento_generico",
      texto: interacaoTextoInput.value || "",
      destino: destinoFaseSelect.value ? obterRotaDaFaseEditor(destinoFaseSelect.value) : "",
      duracao: 1500,
    });
    renderizar();
  }
}

function gerarObjetoParaSalvar() {
  const id = String(faseIdInput.value || "").trim().toLowerCase();
  const nome = String(faseNomeInput.value || "").trim();

  if (!id) {
    throw new Error("Informe o ID da fase.");
  }

  if (!nome) {
    throw new Error("Informe o nome da fase.");
  }

  const existe = faseJaExiste(id) || Boolean(obterFaseLocal(id));
  const podeSobrescrever = faseCarregadaOriginal && faseCarregadaOriginal.id === id;

  if (existe && !podeSobrescrever) {
    throw new Error("Esse ID já está em uso. Escolha outro.");
  }

  return {
    ...clonar(faseAtual),
    id,
    nome,
    background: backgroundCustomPathInput.value || faseBackgroundSelect.value,
    elementosAnimados: clonar(faseAtual.elementosAnimados || []),
    player: {
      ...faseAtual.player,
      img: playerSprite,
    },
  };
}

function aplicarCaminhoBackground() {
  const caminho = normalizarSeparadores(
    backgroundCustomPathInput.value || juntarCaminho(backgroundFolderPathInput.value, backgroundFileNameInput.value)
  );

  if (!caminho) {
    definirStatus("Informe o caminho do background.", true);
    return;
  }

  backgroundCustomPathInput.value = caminho;
  const partes = caminho.split("/");
  backgroundFileNameInput.value = partes.pop() || "";
  backgroundFolderPathInput.value = partes.join("/");
  garantirOpcao(faseBackgroundSelect, caminho, "Background");
  faseAtual.background = caminho;
  renderizar();
  definirStatus("Background atualizado.");
}

function aplicarCaminhoAsset() {
  const caminho = normalizarSeparadores(
    assetCustomPathInput.value || juntarCaminho(assetFolderPathInput.value, assetFileNameInput.value)
  );

  if (!caminho) {
    definirStatus("Informe o caminho do tile.", true);
    return;
  }

  assetCustomPathInput.value = caminho;
  const partes = caminho.split("/");
  assetFileNameInput.value = partes.pop() || "";
  assetFolderPathInput.value = partes.join("/");
  garantirOpcao(assetSelect, caminho, "Tile");
  definirStatus("Imagem do tile atualizada.");
}

async function salvarFase() {
  try {
    const fase = gerarObjetoParaSalvar();
    fase.sceneWidth = sceneWidth;
    fase.sceneHeight = sceneHeight;
    fase.tileSize = 64;
    fase.dpi = 72;
    fase.gridCols = defaultGridCols;
    fase.gridRows = defaultGridRows;

    for (const item of fase.plataforma1 || []) {
      item.width = 64;
      item.height = 64;
    }
    for (const item of fase.paredes || []) {
      item.width = 64;
      item.height = 64;
    }
    for (const item of fase.interacoes || []) {
      item.width = 64;
      item.height = 64;
    }
    fase.elementosAnimados = fase.elementosAnimados || [];
    for (const item of fase.coletaveis || []) {
      item.width = 64;
      item.height = 64;
    }
    for (const item of fase.elementosAnimados || []) {
      item.startX = Math.max(0, Number(item.startX || 0));
      item.startY = Math.max(0, Number(item.startY || 0));
      item.endX = Math.max(0, Number(item.endX || item.startX || 0));
      item.endY = Math.max(0, Number(item.endY || item.startY || 0));
      item.width = Math.max(1, Number(item.width || tileSize));
      item.height = Math.max(1, Number(item.height || tileSize));
      item.frameCount = Math.max(1, Number(item.frameCount || 1));
      item.frameInterval = Math.max(1, Number(item.frameInterval || 120));
      item.moveDuration = Math.max(1, Number(item.moveDuration || 2000));
      item.repeatCount = Math.max(0, Number(item.repeatCount || 0));
      item.colisao = Boolean(item.colisao);
    }

    const assetsPayload = await gerarPayloadArquivos(fase);
    const salva = await salvarFaseViaApi(fase, assetsPayload);
    const fasePersistida = salva.fase || fase;
    const id = String(salva.id || fasePersistida.id || "").trim().toLowerCase();
    const htmlPath = salva.htmlPath || `${id}.html`;

    faseAtual = clonar(fasePersistida);
    faseAtual.id = id;
    faseAtual.nome = fasePersistida.nome || id;
    faseCarregadaOriginal = { id, origem: "arquivo" };
    registrarFaseLocal(fasePersistida, htmlPath);
    sincronizarFormulario();
    renderizar();
    setStatusPastaProjeto("Modo projeto local ativo.");
    definirStatus(`✓ Fase salva: ${id}. Arquivos gerados em jogo/ e fase pronta para teste.`);

    return {
      id,
      htmlPath,
      apiBaseUrl: salva.apiBaseUrl || "",
    };
  } catch (error) {
    console.error(error);
    definirStatus(error.message || "Erro ao salvar fase.", true);
    return null;
  }
}

async function testarFase() {
  const salva = await salvarFase();
  if (!salva) return;
  const destino = salva.apiBaseUrl
    ? `${salva.apiBaseUrl}/jogo/Marcacao/${salva.htmlPath}`
    : `./${salva.htmlPath}`;
  window.location.href = destino;
}

canvas.addEventListener("mousemove", (event) => {
  const { x, y, foraDaGrade } = obterPosicaoGrid(event);
  posicaoCursor.textContent = foraDaGrade
    ? `x: ${x} | y: ${y} | fora da grade útil`
    : `x: ${x} | y: ${y}`;
});

canvas.addEventListener("click", (event) => {
  const { x, y } = obterPosicaoGrid(event);
  aplicarFerramenta(x, y);
});

faseBackgroundSelect.addEventListener("change", () => {
  faseAtual.background = faseBackgroundSelect.value;
  backgroundCustomPathInput.value = faseBackgroundSelect.value;
  const partes = normalizarSeparadores(faseBackgroundSelect.value).split("/");
  backgroundFileNameInput.value = partes.pop() || "";
  backgroundFolderPathInput.value = partes.join("/");
  renderizar();
});

assetSelect.addEventListener("change", () => {
  assetCustomPathInput.value = assetSelect.value;
  const partes = normalizarSeparadores(assetSelect.value).split("/");
  assetFileNameInput.value = partes.pop() || "";
  assetFolderPathInput.value = partes.join("/");
});

btnCarregarFase.addEventListener("click", () => {
  if (!faseExistenteSelect.value) {
    definirStatus("Selecione uma fase para carregar.", true);
    return;
  }
  carregarFaseNoEditor(faseExistenteSelect.value);
});

btnNovaFase.addEventListener("click", () => {
  faseAtual = criarFaseVazia();
  faseCarregadaOriginal = null;
  animadoInicioPendente = null;
  canvas.width = sceneWidth;
  canvas.height = sceneHeight;
  sincronizarFormulario();
  renderizar();
  definirStatus("Nova fase criada no editor.");
});

btnSalvarFase.addEventListener("click", () => {
  salvarFase();
});

btnTestarFase.addEventListener("click", () => {
  testarFase();
});

btnLimparGrid.addEventListener("click", () => {
  faseAtual.plataforma1 = [];
  faseAtual.paredes = [];
  faseAtual.interacoes = [];
  faseAtual.elementosAnimados = [];
  faseAtual.coletaveis = [];
  animadoInicioPendente = null;
  atualizarStatusAnimado();
  renderizar();
  definirStatus("Grid limpo.");
});

btnAplicarAssetPath.addEventListener("click", () => {
  aplicarCaminhoAsset();
});

btnAplicarBackgroundPath.addEventListener("click", () => {
  aplicarCaminhoBackground();
});

btnEscolherTileArquivo?.addEventListener("click", () => {
  filePickerTile?.click();
});

btnEscolherBackgroundArquivo?.addEventListener("click", () => {
  filePickerBackground?.click();
});

filePickerTile?.addEventListener("change", () => {
  const file = filePickerTile.files?.[0] || null;
  tileArquivoSelecionado = file;
  tileArquivoLabel.textContent = file ? file.name : "Nenhum arquivo";
  tilePreviewUrl = file ? URL.createObjectURL(file) : "";
  if (tilePreviewUrl && file) {
    arquivosBlob.set(tilePreviewUrl, file);
  }
  if (tilePreviewUrl) {
    assetCustomPathInput.value = tilePreviewUrl;
    garantirOpcao(assetSelect, tilePreviewUrl, "Tile");
  }
});

filePickerBackground?.addEventListener("change", () => {
  const file = filePickerBackground.files?.[0] || null;
  backgroundArquivoSelecionado = file;
  backgroundArquivoLabel.textContent = file ? file.name : "Nenhum arquivo";
  backgroundPreviewUrl = file ? URL.createObjectURL(file) : "";
  if (backgroundPreviewUrl && file) {
    arquivosBlob.set(backgroundPreviewUrl, file);
  }
  if (backgroundPreviewUrl) {
    backgroundCustomPathInput.value = backgroundPreviewUrl;
    garantirOpcao(faseBackgroundSelect, backgroundPreviewUrl, "Background");
    faseAtual.background = backgroundPreviewUrl;
    renderizar();
  }
});

canvas.width = sceneWidth;
canvas.height = sceneHeight;
atualizarListas();
sincronizarFormulario();
setStatusPastaProjeto("Modo projeto local ativo.");
renderizar();
