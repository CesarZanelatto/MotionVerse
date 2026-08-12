const titulo = document.getElementById("titulo");

if (titulo) {
    setTimeout(() => {
        titulo.classList.add("titulo-sai");
    }, 1500);
}

const seta = document.getElementById("seta");

titulo.addEventListener("transitionend", () => {
    seta.style.opacity = "1";
});