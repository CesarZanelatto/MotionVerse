const setinha1 = document.querySelector("#setinha1");
const banner1 = document.querySelector("#banner1");
const setinha2 = document.querySelector("#setinha2");
const banner2 = document.querySelector("#banner2");
const logo = document.querySelector("#logo")
const mudarCor = document.querySelector("#mudar-cor")
const divbotao = document.querySelector("#div-botao")
const cards = document.querySelector("#cards")
const techs = document.querySelector("#techs")
const projetos = document.querySelector("#projetos")
const body = document.querySelector("body")

setinha1.addEventListener("click", () =>{
    banner1.classList.toggle("ativo")
    banner2.classList.toggle("inativo")
})

setinha2.addEventListener("click", () =>{
    banner2.classList.toggle("ativo2")
    logo.classList.toggle("ativo2")
    banner1.classList.toggle("inativo")
    divbotao.classList.toggle("mudar")
})

mudarCor.addEventListener("click", () =>{
    divbotao.classList.toggle("mudar")
    logo.classList.toggle("ativo2")
    banner1.classList.toggle("claro")
    banner2.classList.toggle("escuro")
    cards.classList.toggle("claro")
    techs.classList.toggle("claro")
    projetos.classList.toggle("claro")
    body.classList.toggle("claro")
    
})
