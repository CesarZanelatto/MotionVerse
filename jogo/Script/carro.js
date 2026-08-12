const carro1 = document.querySelector("#carro");

const carro2 = document.querySelector("#carro2");

const listaURL = [
  "../Imagem/cenario/assets/carro/carro-vermei.png",
  "../Imagem/cenario/assets/carro/carro-rosa.png",
  "../Imagem/cenario/assets/carro/carro-amarelo.png",
  "../Imagem/cenario/assets/carro/carro-roxo.png",
];

const listaURLInvertidos = [
  "../Imagem/cenario/assets/carro/carro-vermei-invertido.png",
  "../Imagem/cenario/assets/carro/carro-rosa-invertido.png",
  "../Imagem/cenario/assets/carro/carro-amarelo-invertido.png",
  "../Imagem/cenario/assets/carro/carro-roxo-invertido.png",
];

function mudarCarro() {
  const random = Math.floor(Math.random() * listaURL.length);
  carro1.style.backgroundImage = `url(${listaURL[random]})`;
}

function mudarCarroInvertido() {
  const random = Math.floor(Math.random() * listaURLInvertidos.length);
  carro2.style.backgroundImage = `url(${listaURLInvertidos[random]})`;
}

mudarCarro();
mudarCarroInvertido();

carro1.addEventListener("animationiteration", (e) => {
  if (e.animationName === "carroAndar") {
    mudarCarro();
  }
});

carro2.addEventListener("animationiteration", (e) => {
  if (e.animationName === "carroAndarDeRe") {
    mudarCarroInvertido();
  }
});
