const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const { existsSync, createReadStream } = require("fs");
const { URL } = require("url");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".glb": "model/gltf-binary",
  ".pdf": "application/pdf",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sanitizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "");
}

function slugSeguro(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
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
  return (pascal || "Fase").replace(/^[a-z]/, (m) => m.toUpperCase());
}

function nomeScriptDaFase(id) {
  const texto = String(id || "").trim();
  const lower = texto.toLowerCase();
  if (lower.startsWith("fase")) {
    return `jogoFase${texto.slice(4)}.js`;
  }
  const pascal = texto
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return `jogo${pascal || "Fase"}.js`;
}

function dataUrlToBuffer(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Arquivo enviado em formato inválido.");
  }
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

function generateHtml({ id, nome, background, scriptFile }) {
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

function generateScript({ dataImportName, dataFileName, phaseId }) {
  const musicaFase01 = phaseId === "fase_01"
    ? `

const audioFundo = new Audio("../som/fase1musicaFundo.mp3");
audioFundo.loop = true;
audioFundo.volume = 0.4;

function iniciarMusica() {
  audioFundo.play().catch((error) => {
    console.warn("N\u00e3o foi poss\u00edvel iniciar a m\u00fasica.", error);
  });
}

document.addEventListener("pointerdown", iniciarMusica, { once: true });
document.addEventListener("keydown", iniciarMusica, { once: true });`
    : "";

  return `import { iniciarFase } from "./faseEngine.js";
import ${dataImportName} from "../Data/${dataFileName}";

const fase = ${dataImportName};
iniciarFase(fase);${musicaFase01}
`;
}

// function generateScript2({ dataImportName, dataFileName, phaseId }) {
//   const musicaFase02 = phaseId === "fase_02"
//     ? `

// const audioFundo = new Audio("../som/fase2musicaFundo.mp3");
// audioFundo.loop = true;
// audioFundo.volume = 0.4;

// function iniciarMusica2() {
//   audioFundo.play().catch((error) => {
//     console.warn("N\u00e3o foi poss\u00edvel iniciar a m\u00fasica.", error);
//   });
// }

// document.addEventListener("pointerdown", iniciarMusica2, { once: true });
// document.addEventListener("keydown", iniciarMusica2, { once: true });`
//     : "";

//   return `import { iniciarFase } from "./faseEngine.js";
// import ${dataImportName} from "../Data/${dataFileName}";

// const fase2 = ${dataImportName};
// iniciarFase(fase2);${musicaFase02}
// `;
// }

function replaceBlock(text, startMarker, endMarker, newBlockContent) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Marcadores automáticos não encontrados em faseRegistry.js.");
  }
  const blockStart = start + startMarker.length;
  const before = text.slice(0, blockStart);
  const after = text.slice(end);
  return `${before}\n${newBlockContent}\n${after}`;
}

async function listarFasesCustomizadasDoDisco() {
  const dataDir = path.join(ROOT, "jogo", "Data");
  const files = await fs.readdir(dataDir);
  const candidatos = files.filter((file) => {
    const lower = file.toLowerCase();
    return (
      lower.endsWith(".js") &&
      lower.startsWith("fase") &&
      !["fase1.js", "fase2.js", "fase3.js", "faseregistry.js"].includes(lower)
    );
  });

  const fases = [];

  for (const file of candidatos) {
    const fullPath = path.join(dataDir, file);
    const content = await fs.readFile(fullPath, "utf-8");
    const match = content.match(/=\s*([\s\S]*?)\s*;\s*export default/m);
    if (!match) continue;

    try {
      const data = JSON.parse(match[1]);
      const id = sanitizeId(data.id || file.replace(/\.js$/i, ""));
      if (!id) continue;
      const importName = nomeConstDaFase(id);
      fases.push({
        id,
        nome: data.nome || id,
        background: data.background || "../Imagem/cenario/fundo_tela_inicio.png",
        htmlPath: `${id}.html`,
        dataFileName: file,
        dataImportName: importName,
      });
    } catch (error) {
      console.warn(`Não foi possível interpretar ${file} para o faseRegistry automático.`, error);
    }
  }

  return fases.sort((a, b) => a.id.localeCompare(b.id));
}

async function updateRegistry() {
  const registryPath = path.join(ROOT, "jogo", "Data", "faseRegistry.js");
  let content = await fs.readFile(registryPath, "utf-8");
  const fases = await listarFasesCustomizadasDoDisco();

  const importsBlock = [
    '// (não remova) - imports gerados automaticamente pelo Editor de Fases',
    ...fases.map((fase) => `import ${fase.dataImportName} from "./${fase.dataFileName}";`),
  ].join("\n");

  const fasesBlock = [
    '  // (não remova) - fases geradas automaticamente pelo Editor de Fases',
    ...fases.map(
      (fase) =>
        `  ${fase.id}: {\n` +
        `    id: "${fase.id}",\n` +
        `    nome: "${String(fase.nome).replace(/\"/g, '\\"')}",\n` +
        `    background: "${fase.background}",\n` +
        `    htmlPath: "${fase.htmlPath}",\n` +
        `    data: ${fase.dataImportName},\n` +
        `    origem: "padrao",\n` +
        `  },`
    ),
  ].join("\n");

  content = replaceBlock(content, "// AUTO_IMPORTS_START", "// AUTO_IMPORTS_END", importsBlock);
  content = replaceBlock(content, "// AUTO_FASES_START", "// AUTO_FASES_END", fasesBlock);

  await fs.writeFile(registryPath, content, "utf-8");
}

function mapDestino(destino) {
  const value = String(destino || "").trim();
  const match = value.match(/fase\.html\?fase=([a-z0-9_-]+)/i);
  if (match) {
    return `${match[1].toLowerCase()}.html`;
  }
  return value;
}

async function savePhase(payload) {
  const phaseInput = payload?.fase;
  if (!phaseInput || typeof phaseInput !== "object") {
    throw new Error("Fase inválida.");
  }

  const id = sanitizeId(phaseInput.id);
  const nome = String(phaseInput.nome || id).trim();
  if (!id) {
    throw new Error("Informe um ID de fase válido.");
  }

  const assetsByRef = new Map();
  for (const asset of payload.assets || []) {
    if (!asset?.originalRef || !asset?.dataUrl) continue;
    const { buffer } = dataUrlToBuffer(asset.dataUrl);
    const fileName = `${Date.now()}_${slugSeguro(asset.name || "imagem.png")}`;
    const relDisk = path.join("jogo", "Imagem", "editor_uploads", id, fileName);
    const absDisk = path.join(ROOT, relDisk);
    await ensureDir(path.dirname(absDisk));
    await fs.writeFile(absDisk, buffer);
    assetsByRef.set(asset.originalRef, `../Imagem/editor_uploads/${id}/${fileName}`.replace(/\\/g, "/"));
  }

  const phase = JSON.parse(JSON.stringify(phaseInput));
  phase.id = id;
  phase.nome = nome;
  phase.sceneWidth = 1920;
  phase.sceneHeight = 1080;
  phase.tileSize = 64;
  phase.dpi = 72;
  phase.gridCols = 30;
  phase.gridRows = 17;
  phase.player = phase.player || {};
  phase.player.img = phase.player.img || "../Imagem/personagens/clara.png";
  phase.player.velocidade = Number(phase.player.velocidade || 4);

  if (assetsByRef.has(phase.background)) {
    phase.background = assetsByRef.get(phase.background);
  }

  phase.plataforma1 = (phase.plataforma1 || []).map((item) => ({
    ...item,
    width: Math.max(1, Number(item.width || 64)),
    height: Math.max(1, Number(item.height || 64)),
    img: assetsByRef.get(item.img) || item.img,
  }));

  phase.paredes = (phase.paredes || []).map((item) => ({
    ...item,
    width: Math.max(1, Number(item.width || 64)),
    height: Math.max(1, Number(item.height || 64)),
  }));

  phase.interacoes = (phase.interacoes || []).map((item) => ({
    ...item,
    width: Math.max(1, Number(item.width || 64)),
    height: Math.max(1, Number(item.height || 64)),
    destino: mapDestino(item.destino),
  }));

  phase.coletaveis = (phase.coletaveis || []).map((item) => ({
    ...item,
    width: Math.max(1, Number(item.width || 64)),
    height: Math.max(1, Number(item.height || 64)),
    img: assetsByRef.get(item.img) || item.img,
    tipo: item.tipo || "item",
    nome: item.nome || item.id,
    unico: item.unico !== false,
  }));

  phase.elementosAnimados = (phase.elementosAnimados || []).map((item) => ({
    ...item,
    img: assetsByRef.get(item.img) || item.img,
    startX: Number(item.startX || 0),
    startY: Number(item.startY || 0),
    endX: Number(item.endX || item.startX || 0),
    endY: Number(item.endY || item.startY || 0),
    width: Math.max(1, Number(item.width || 64)),
    height: Math.max(1, Number(item.height || 64)),
    frameCount: Math.max(1, Number(item.frameCount || 1)),
    frameInterval: Math.max(1, Number(item.frameInterval || 120)),
    moveDuration: Math.max(1, Number(item.moveDuration || 2000)),
    repeatCount: Math.max(0, Number(item.repeatCount || 0)),
    colisao: Boolean(item.colisao),
  }));

  const dataImportName = nomeConstDaFase(id);
  const dataFileName = `${id}.js`;
  const htmlFileName = `${id}.html`;
  const scriptFileName = nomeScriptDaFase(id);

  const dataContent = `const ${dataImportName} = ${JSON.stringify(phase, null, 2)};\n\nexport default ${dataImportName};\n`;
  const htmlContent = generateHtml({
    id,
    nome,
    background: phase.background,
    scriptFile: scriptFileName,
  });
  const scriptContent = generateScript({
    dataImportName,
    dataFileName,
    phaseId: id,
  });

  // const scriptContent = generateScript2({
  //   dataImportName,
  //   dataFileName,
  //   phaseId: id,
  // });

  await fs.writeFile(path.join(ROOT, "jogo", "Data", dataFileName), dataContent, "utf-8");
  await fs.writeFile(path.join(ROOT, "jogo", "Marcacao", htmlFileName), htmlContent, "utf-8");
  await fs.writeFile(path.join(ROOT, "jogo", "Script", scriptFileName), scriptContent, "utf-8");
  await updateRegistry();

  return {
    ok: true,
    id,
    htmlPath: htmlFileName,
    apiBaseUrl: `http://localhost:${PORT}`,
    fase: phase,
  };
}

async function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const absPath = path.normalize(path.join(ROOT, requested));
  if (!absPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!existsSync(absPath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const stat = await fs.stat(absPath);
  const filePath = stat.isDirectory() ? path.join(absPath, "index.html") : absPath;
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    setCorsHeaders(res);
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    if (req.method === "POST" && url.pathname === "/api/editor/save-phase") {
      const body = await readBody(req);
      const result = await savePhase(body);
      return sendJson(res, 200, result);
    }

    return serveStatic(req, res, url.pathname);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: error.message || "Erro interno." });
  }
});

server.listen(PORT, () => {
  console.log(`Motion Verse rodando em http://localhost:${PORT}`);
});