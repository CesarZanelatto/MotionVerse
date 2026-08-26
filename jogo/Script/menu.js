let iniciou = false;

function iniciarMenu() {
  if (iniciou) return;
  iniciou = true;
  document.getElementById("menu").classList.add("menu-iniciado");
}

document.addEventListener("keydown", iniciarMenu);
document.addEventListener("click", iniciarMenu);

const btn_jogar = document.querySelector("#btn_jogar");
const btn_tutorial = document.querySelector("#btn_tutorial");
const btn_sair = document.querySelector("#btn_sair");
const fundo = document.querySelector("#fundo");

if (fundo) {
  fundo.style.opacity = "1";
}

btn_jogar.addEventListener("click", () => {
  window.location.href = "../../frontEnd/cutscene-Intro/cutscene.html";
});

btn_tutorial.addEventListener("click", () => {
  window.location.href = "../Marcacao/tutorial.html";
});

btn_sair.addEventListener("click", () => {
  window.location.href = "../../frontEnd/index.html";
});
