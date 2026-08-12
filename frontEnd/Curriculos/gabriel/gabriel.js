// =========================
// Efeito de digitação
// =========================

const texto = "Tecnologia da Informação & Química Aplicada";
const typing = document.getElementById("typing");

let indice = 0;

function escrever() {

    if (indice < texto.length) {

        typing.textContent += texto.charAt(indice);

        indice++;

        setTimeout(escrever, 70);

    }

}

escrever();


// =========================
// Cards aparecem ao rolar
// =========================

const cards = document.querySelectorAll(".card");

const observador = new IntersectionObserver((entradas) => {

    entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {

            entrada.target.classList.add("show");

        }

    });

}, {
    threshold: 0.2
});

cards.forEach((card) => {

    observador.observe(card);

});


// =========================
// Botão voltar ao topo
// =========================

const topo = document.getElementById("topo");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topo.style.display = "block";

    } else {

        topo.style.display = "none";

    }

});

topo.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


// =========================
// Efeito 3D na foto
// =========================

const foto = document.getElementById("foto");

foto.addEventListener("mousemove", (e) => {

    const rect = foto.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    const rotY = ((x / rect.width) - 0.5) * 20;

    const rotX = ((y / rect.height) - 0.5) * -20;

    foto.style.transform =
        `perspective(700px)
         rotateX(${rotX}deg)
         rotateY(${rotY}deg)
         scale(1.08)`;

});

foto.addEventListener("mouseleave", () => {

    foto.style.transform =
        "perspective(700px) rotateX(0) rotateY(0) scale(1)";

});


// =========================
// Animação dos ícones
// =========================

const icones = document.querySelectorAll(".fa-brands, .material-symbols-outlined");

icones.forEach((icone) => {

    icone.addEventListener("mouseenter", () => {

        icone.style.transform = "rotate(12deg) scale(1.3)";

    });

    icone.addEventListener("mouseleave", () => {

        icone.style.transform = "rotate(0deg) scale(1)";

    });

});


// =========================
// Animação ao abrir Details
// =========================

const detalhes = document.querySelectorAll("details");

detalhes.forEach((item) => {

    item.addEventListener("toggle", () => {

        if (item.open) {

            item.animate([
                {
                    transform: "scale(.98)",
                    opacity: 0.8
                },
                {
                    transform: "scale(1)",
                    opacity: 1
                }
            ], {
                duration: 300,
                easing: "ease"
            });

        }

    });

});


// =========================
// Título da página piscando
// quando a aba perde foco
// =========================

const tituloOriginal = document.title;

let intervalo;

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        intervalo = setInterval(() => {

            document.title =
                document.title === tituloOriginal
                    ? "👋 Volte ao currículo!"
                    : tituloOriginal;

        }, 1200);

    } else {

        clearInterval(intervalo);

        document.title = tituloOriginal;

    }

});