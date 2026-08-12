// Seleciona o botão

const botao = document.querySelector("#tema");


// Anima a seção Sobre ao aparecer na tela

const elementos = document.querySelectorAll(".animar");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("mostrar");
        }

    });

}, {
    threshold: 0.2
});

elementos.forEach((elemento) => {
    observer.observe(elemento);
});


