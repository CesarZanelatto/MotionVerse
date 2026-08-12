const loading = document.getElementById("loading");

const dialogo = document.getElementById("dialogo");
const textoDialogo = document.getElementById("textoDialogo");

const avatar = document.getElementById("avatar3d");

const btnAcenar = document.getElementById("btnAcenar");

const modal = document.getElementById("modal");

const fechar = document.getElementById("fechar");

const cards = document.querySelectorAll(".project-card");

const barras = document.querySelectorAll(".progresso");

const mensagemInicial =
"Olá! Seja bem-vindo ao meu espaço. Aqui você encontrará um pouco da minha trajetória, tecnologias que utilizo e alguns projetos desenvolvidos por mim. Espero que goste!";

const frasePrincipal =
"Transformando ideias em experiências digitais.";

window.addEventListener("load", iniciarSistema);

function iniciarSistema(){

    iniciarLoading();

}

function iniciarLoading(){

    setTimeout(()=>{

        loading.style.opacity="0";

        setTimeout(()=>{

            loading.style.display="none";

            abrirDialogo();

            iniciarSkills();

            escreverFrase();

        },700);

    },2500);

}

function abrirDialogo(){

    dialogo.style.display="block";

    escreverDialogo(mensagemInicial);

}

function fecharDialogo(){

    dialogo.style.opacity="0";

    setTimeout(()=>{

        dialogo.style.display="none";

    },500);

}

function escreverDialogo(texto){

    textoDialogo.innerHTML="";

    let i=0;

    const intervalo=setInterval(()=>{

        textoDialogo.innerHTML+=texto.charAt(i);

        i++;

        if(i>=texto.length){

            clearInterval(intervalo);

            setTimeout(fecharDialogo,4000);

        }

    },25);

}




/*=========================================================
    BARRAS DE HABILIDADES
=========================================================*/

function iniciarSkills(){

    barras.forEach(barra=>{

        const largura=barra.classList.contains("html") ? "95%" :

                      barra.classList.contains("css") ? "90%" :

                      barra.classList.contains("js") ? "92%" :

                      barra.classList.contains("java") ? "82%" :

                      barra.classList.contains("mysql") ? "87%" :

                      "70%";

        barra.style.width="0";

        setTimeout(()=>{

            barra.style.width=largura;

        },300);

    });

}



/*=========================================================
    UTILITÁRIOS
=========================================================*/

function fadeIn(elemento){

    elemento.style.opacity=0;

    elemento.style.display="block";

    let opacidade=0;

    const intervalo=setInterval(()=>{

        opacidade+=0.05;

        elemento.style.opacity=opacidade;

        if(opacidade>=1){

            clearInterval(intervalo);

        }

    },20);

}



function fadeOut(elemento){

    let opacidade=1;

    const intervalo=setInterval(()=>{

        opacidade-=0.05;

        elemento.style.opacity=opacidade;

        if(opacidade<=0){

            clearInterval(intervalo);

            elemento.style.display="none";

        }

    },20);

}



/*=========================================================
    EVENTOS
=========================================================*/

btnAcenar.addEventListener("click",()=>{

    // Parte 2
    // Aqui será adicionada a animação do personagem.

});


cards.forEach(card=>{

    card.addEventListener("click",()=>{

        // Parte 2
        // Abrirá o modal do projeto.

    });

});


fechar.addEventListener("click",()=>{

    fadeOut(modal);

});



/*=========================================================
    PREPARAÇÃO
=========================================================*/

// Avatar seguindo o mouse
// (Parte 2)
/*=========================================================
    SCRIPT.JS
    PARTE 2
=========================================================*/


/*=========================================================
    DADOS DOS PROJETOS
=========================================================*/

const projetos = {

    doce:{

        titulo:"DoceEncanto",

        imagem:"img/projetos/doceencanto.png",

        descricao:
        "Site desenvolvido para uma confeitaria com foco em design responsivo, experiência do usuário e apresentação dos produtos.",

        tecnologias:[
            "HTML",
            "CSS",
            "JavaScript"
        ]

    },

    uptickets:{

        titulo:"UpTickets",

        imagem:"img/projetos/uptickets.png",

        descricao:
        "Sistema para gerenciamento e venda de ingressos para eventos.",

        tecnologias:[
            "Java",
            "MySQL",
            "JavaScript"
        ]

    },

    spotify:{

        titulo:"Projeto Spotify",

        imagem:"img/projetos/spotify.png",

        descricao:
        "Clone da interface do Spotify utilizando HTML, CSS e JavaScript.",

        tecnologias:[
            "HTML"," ",
            "CSS"," "
        ]

    },

    waygo:{

        titulo:"WayGo",

        imagem:"img/projetos/waygo.png",

        descricao:
        "Sistema corporativo para gestão de viagens B2B utilizando banco de dados relacional.",

        tecnologias:[
            "Java",
            "MySQL",
            "SQL"
        ]

    }

};



/*=========================================================
    ELEMENTOS DO MODAL
=========================================================*/

const tituloProjeto =
document.getElementById("tituloProjeto");

const imagemProjeto =
document.getElementById("imagemProjeto");

const descricaoProjeto =
document.getElementById("descricaoProjeto");

const tecnologias =
document.querySelector(".tecnologias");



/*=========================================================
    ABRIR MODAL
=========================================================*/

function abrirProjeto(id){

    const projeto = projetos[id];

    if(!projeto) return;

    tituloProjeto.innerHTML =
    projeto.titulo;

    imagemProjeto.src =
    projeto.imagem;

    descricaoProjeto.innerHTML =
    projeto.descricao;

    tecnologias.innerHTML = "";

    projeto.tecnologias.forEach(item=>{

        const span =
        document.createElement("span");

        span.innerHTML = item;

        tecnologias.appendChild(span);

    });

    fadeIn(modal);

}



/*=========================================================
    EVENTO DOS CARDS
=========================================================*/

cards.forEach(card=>{

    card.addEventListener("click",()=>{

        abrirProjeto(
            card.dataset.project
        );

    });

});



/*=========================================================
    BOTÃO FECHAR
=========================================================*/

fechar.addEventListener("click",()=>{

    fadeOut(modal);

});



modal.addEventListener("click",(e)=>{

    if(e.target===modal){

        fadeOut(modal);

    }

});



/*=========================================================
    ACENO DO PERSONAGEM
=========================================================*/

function acenar(){

    avatar.classList.remove("acenar");

    void avatar.offsetWidth;

    avatar.classList.add("acenar");

}



btnAcenar.addEventListener("click",()=>{

    acenar();

});



/*=========================================================
    PERSONAGEM SEGUE O MOUSE
=========================================================*/

document.addEventListener("mousemove",(event)=>{

    const x =
    (event.clientX/window.innerWidth-.5)*18;

    const y =
    (event.clientY/window.innerHeight-.5)*18;

    avatar.style.transform =
    `translate(${x}px,${y}px)`;

});



/*=========================================================
    HOVER DOS CARDS
=========================================================*/

cards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform =
        "translateY(-10px) scale(1.05)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform =
        "translateY(0) scale(1)";

    });

});



/*=========================================================
    ABRIR MODAL COM ENTER
=========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        fadeOut(modal);

    }

});



/*=========================================================
    EFEITO DE BRILHO NO AVATAR
=========================================================*/

setInterval(()=>{

    avatar.animate(

        [

            {

                filter:"drop-shadow(0 0 0px gold)"

            },

            {

                filter:"drop-shadow(0 0 18px gold)"

            },

            {

                filter:"drop-shadow(0 0 0px gold)"

            }

        ],

        {

            duration:2500

        }

    );

},2600);



/*=========================================================
    ACENO AUTOMÁTICO
=========================================================*/

setTimeout(()=>{

    acenar();

},3200);

// Modal dos projetos
// (Parte 2)


// Inventário
// (Parte 3)

/*=========================================================
    SCRIPT.JS
    PARTE 3
=========================================================*/


/*=========================================================
    PARTÍCULAS
=========================================================*/

const particleContainer =
document.getElementById("particles");

function criarParticula(){

    const estrela =
    document.createElement("span");

    estrela.classList.add("particle");

    estrela.style.left =
    Math.random()*100+"%";

    estrela.style.animationDuration =
    4+Math.random()*5+"s";

    estrela.style.opacity =
    Math.random();

    estrela.style.transform =
    `scale(${Math.random()+0.4})`;

    particleContainer.appendChild(estrela);

    setTimeout(()=>{

        estrela.remove();

    },9000);

}

setInterval(criarParticula,250);


/*=========================================================
    ATALHOS
=========================================================*/

document.addEventListener("keydown",(e)=>{

    switch(e.key.toLowerCase()){

        case "i":

            document.querySelector(".inventario")
            .scrollIntoView({

                behavior:"smooth"

            });

            break;

        case "p":

            document.querySelector(".projetos")
            .scrollIntoView({

                behavior:"smooth"

            });

            break;

        case "h":

            document.querySelector("header")
            .scrollIntoView({

                behavior:"smooth"

            });

            break;

    }

});



/*=========================================================
    ANIMAÇÃO DOS BOTÕES
=========================================================*/

inventarioBotoes.forEach(botao=>{

    botao.addEventListener("mouseenter",()=>{

        botao.style.transform="scale(1.08)";

    });

    botao.addEventListener("mouseleave",()=>{

        botao.style.transform="scale(1)";

    });

});



/*=========================================================
    PREPARAÇÃO PARA O JOGO
=========================================================*/

function abrirCurriculo(){

    document.querySelector(".curriculo")
    .style.display="flex";

}



function fecharCurriculo(){

    document.querySelector(".curriculo")
    .style.display="none";

}



/*=========================================================
    PREPARAÇÃO PARA O MODELO 3D
=========================================================*/

let modelo3D = null;

function carregarModelo3D(){

    /*
        Futuramente iremos utilizar:

        THREE.GLTFLoader()

        para carregar o arquivo .glb

        modelo3D será armazenado aqui.

    */

}



/*=========================================================
    LOOP PRINCIPAL
=========================================================*/

function atualizar(){

    requestAnimationFrame(atualizar);

    /*
        Aqui ficarão:

        animação do modelo 3D

        partículas

        câmera

        iluminação

        efeitos

    */

}

atualizar();
// Partículas
// (Parte 3)


// Easter Eggs
// (Parte 3)


// Integração com o jogo
// (Parte 3)