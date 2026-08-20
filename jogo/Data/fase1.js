const Fase1 = {
  "id": "fase1",
  "nome": "Fase1",
  "background": "../Imagem/cenario/fase1/fase1.png",
  "sceneWidth": 1920,
  "sceneHeight": 1080,
  "tileSize": 64,
  "gridCols": 30,
  "gridRows": 17,
  "width": 64,
  "height": 64,
  "player": {
    "velocidade": 4,
    "x": 1088,
    "y": 256,
    "img": "../Imagem/personagens/clara.png"
  },
  "plataforma1": [
    {
      "id": "ch_1",
      "x": 1152,
      "y": 384,
      "width": 64,
      "height": 64,
      "img": "../Imagem/cenario/assets/armario/armario.png",
      "efeito": false
    },
    {
      "id": "tile_512_512",
      "x": 512,
      "y": 512,
      "width": 64,
      "height": 64,
      "img": "../Imagem/editor_uploads/fase1/1786718776435_servidor1_a.png",
      "efeito": false
    },
    {
      "id": "tile_576_512",
      "x": 576,
      "y": 512,
      "width": 64,
      "height": 64,
      "img": "../Imagem/editor_uploads/fase1/1786718776439_servidor1_b.png",
      "efeito": false
    },
    {
      "id": "tile_512_576",
      "x": 512,
      "y": 576,
      "width": 64,
      "height": 64,
      "img": "../Imagem/editor_uploads/fase1/1786718776441_servidor1_c.png",
      "efeito": false
    },
    {
      "id": "tile_576_576",
      "x": 576,
      "y": 576,
      "width": 64,
      "height": 64,
      "img": "../Imagem/editor_uploads/fase1/1786718776445_servidor1_d.png",
      "efeito": false
    }
  ],
  "paredes": [
    {
      "id": "parede_1",
      "x": 1179,
      "y": 390,
      "width": 64,
      "height": 64,
      "img": "../Imagem/cenario/assets/armario/armario.png"
    }
  ],
  interacoes: [
    {
        id: "placa1",
        tipo: "texto",
        x: 1152,
        y: 512,
        width: 64,
        height: 64,
        texto: "Você entrou na cidade!",
        duracao: 1000,
    }
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
  "elemento1": {
    "id": "e1_1",
    "x": 64,
    "y": 0,
    "width": 64,
    "height": 64,
    "img": "",
    "status": true,
    "texto": ""
  },
  "dpi": 72
};

export default Fase1;
