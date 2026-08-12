const Fase3 = {
  id: "Fase3",
  nome: "Fase3",
  background: "../Imagem/cenario/fundo_tela_inicio.png",
  tileSize: 64,
  width: 64,
  height: 64,
  player: {
    velocidade: 4,
    x: 128,
    y: 128,
    img: "../Imagem/personagens/clara.png",
  },
  plataforma1: [],
  paredes: [],
  interacoes: [],
  caixa1: {
    id: "c1_1",
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    img: "",
    efeito: {
      status: true,
    },
  },
  elemento1: {
    id: "e1_1",
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    img: "",
    status: true,
    texto: "",
  },
};

export default Fase3;
