import Personagem from "../Entitys/personagens.js";
import Plataforma from "../Entitys/plataforma.js";
import Inicio from "../Data/inicio.js"
import criarControleEntrada from "./controleEntrada.js";
 
const tela = document.querySelector("#tela");
const ctx = tela.getContext("2d");
 
tela.width = window.innerWidth;
tela.height = window.innerHeight;
 
const quadrado = 64;
 
const jogador = new Personagem(
    Inicio.player.x,
    Inicio.player.y,
    Inicio
);

const controleEntrada = criarControleEntrada();
controleEntrada.iniciarCameraSeDisponivel();
 
function criarCenario() {
  Inicio.plataforma1.forEach((square) => {
    const p = new Plataforma(square.x, square.y, square.img, square.width, square.height);
    p.desenhar(ctx);
  });
}
 
const caixaDialogo = document.querySelector("#caixa-dialogo");
const textoDialogo = document.querySelector("#texto-dialogo");
 
let interacaoAtiva = null;
let timeoutTexto = null;
 
function colide(persognagem, zona) {
  return (
    persognagem.x < zona.x + zona.width &&
    persognagem.x + persognagem.tamanho > zona.x &&
    persognagem.y < zona.y + zona.height &&
    persognagem.y + persognagem.tamanho > zona.y
  );
}
 
function mostrarTexto(texto, duracaoMs) {
  textoDialogo.textContent = texto;
  caixaDialogo.classList.remove("oculto");
 
  if (timeoutTexto) clearTimeout(timeoutTexto);
 
  timeoutTexto = setTimeout(() => {
    caixaDialogo.classList.add("oculto");
    timeoutTexto = null;
  }, duracaoMs);
}
 
function irParaPorta(destino) {
  window.location.href = destino;
}
 
function verificarInteracoes() {
  const zonas = Inicio.interacoes || [];
  let tocandoAlgumaZona = false;
 
  for (const zona of zonas) {
    if (colide(jogador, zona)) {
      tocandoAlgumaZona = true;
 
      if (interacaoAtiva === zona.id) continue;
 
      interacaoAtiva = zona.id;
 
      if (zona.tipo === "porta") {
        irParaPorta(zona.destino);
      }
 
      if (zona.tipo === "texto") {
        mostrarTexto(zona.texto, zona.duracao || 20000);
      }
    }
  }
 
  if (!tocandoAlgumaZona) interacaoAtiva = null;
}
 
function desenharGrid() {
  ctx.font = "9px Arial";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
 
  for (let y = 0; y <= tela.height; y += quadrado) {
    for (let x = 0; x <= tela.width; x += quadrado) {
      ctx.strokeRect(x + 0.5, y + 0.5, quadrado, quadrado);
 
      ctx.fillText(`x:${x} y:${y}`, x + 2, y + 10);
    }
  }
}
 
// DEBUG: mostra as paredes invisíveis desenhando um retângulo vermelho
// translúcido em cada uma. Mude para false quando quiser esconder.
const MOSTRAR_PAREDES = true;
 
function desenharParedes() {
  if (!MOSTRAR_PAREDES) return;
 
  ctx.save();
  ctx.fillStyle = "rgba(255, 0, 0, 0.35)";
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
 
  (Inicio.paredes || []).forEach((parede) => {
    ctx.fillRect(parede.x, parede.y, parede.width, parede.height);
    ctx.strokeRect(parede.x, parede.y, parede.width, parede.height);
  });
 
  ctx.restore();
}
 
let ultimoFrame = performance.now();

function desenhar(agora) {
  ctx.clearRect(0, 0, tela.width, tela.height);
 
  desenharGrid();
  criarCenario();
  desenharParedes();

  const deltaTime = agora - ultimoFrame;
  ultimoFrame = agora;

  jogador.atualizar(
    controleEntrada.obterInput(),
    deltaTime
  );
 
  verificarInteracoes();
 
  jogador.desenhar(ctx);
 
  requestAnimationFrame(desenhar);
}
 
requestAnimationFrame(desenhar);
