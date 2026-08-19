const Fase1 = {
  id: "Fase1",
  nome: "Fase1",
 
  tileSize: 64,
  width: 64,
  height: 64,
 
  player: {
    velocidade: 4,
    x: 1088,
    y: 256,
    img: "../Imagem/personagens/clara.png",
  },
  plataforma1: [
    {
      id: "ch_1",
      x: 1152,
      y: 384,
      width: 64,
      height: 64,
      img: "../Imagem/cenario/assets/armario/armario.png",
      efeito: false,
    },
  ],
  // PAREDES INVISÍVEIS — cada objeto é um retângulo de colisão
  // x, y = posição do pixel (canto superior esquerdo)
  // width, height = tamanho da área bloqueada
  paredes: [
    {
        id: "parede_1",
        x: 1179,
        y: 390,
        width: 30,
        height: 30,
        img: "../Imagem/cenario/assets/armario/armario.png",
    },
  ],
  interacoes: [
],
  caixa1: {
    id: "c1_1",
    x: 1179,
    y: 390,
    width: 10,
    height: 10  ,
    img: "",
    efeito: {
      status: true,
    },
  },
  elemento1: {
    id: "e1_1",
    x: 64,
    y: 0,
    width: 64,
    height: 64,
    img: "",
    status: true,
    texto: "",
  },
};
 
export default Fase1;