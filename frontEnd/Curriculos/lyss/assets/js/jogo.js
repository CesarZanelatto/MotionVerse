// =========================
// MINI GAME - CORRIDA AO NÚMERO
// =========================


// =========================
// ESTATÍSTICAS
// =========================

let estatisticas = {

    vitorias: Number(localStorage.getItem("vitorias")) || 0,

    derrotas: Number(localStorage.getItem("derrotas")) || 0,

    total: Number(localStorage.getItem("totalJogos")) || 0

};


function atualizarEstatisticas(){

    document.querySelector("#vitorias").textContent =
    estatisticas.vitorias;


    document.querySelector("#derrotas").textContent =
    estatisticas.derrotas;


    document.querySelector("#totalJogos").textContent =
    estatisticas.total;

}


atualizarEstatisticas();



// =========================
// VARIÁVEIS DO JOGO
// =========================


let numeroSecreto =
Math.floor(Math.random() * 100) + 1;


let tentativas = 0;


let pontuacao = 100;



// =========================
// ELEMENTOS HTML
// =========================


const inputPalpite =
document.querySelector("#palpite");


const btnJogar =
document.querySelector("#btn-jogar");


const btnReiniciar =
document.querySelector("#btn-reiniciar");


const textoTentativas =
document.querySelector("#tentativas");


const textoPontuacao =
document.querySelector("#pontuacao");


const textoRecorde =
document.querySelector("#recorde");


const mensagem =
document.querySelector("#mensagem");

const resultado =
document.querySelector("#resultado");


const tituloResultado =
document.querySelector("#tituloResultado");


const pontuacaoFinal =
document.querySelector("#pontuacaoFinal");


const btnNovoJogo =
document.querySelector("#btnNovoJogo");


// Sons (protegidos)

const somVitoria = document.querySelector("#somVitoria");
const somErro = document.querySelector("#somErro");



// =========================
// RECORDE
// =========================


let recorde =
Number(localStorage.getItem("recorde")) || 0;


textoRecorde.textContent = recorde;



btnReiniciar.disabled = true;



// =========================
// MENSAGEM
// =========================


function mostrarMensagem(texto, cor){


    mensagem.textContent = texto;


    mensagem.style.color = cor;


    mensagem.classList.remove("animarMensagem");


    void mensagem.offsetWidth;


    mensagem.classList.add("animarMensagem");


}



// =========================
// JOGAR
// =========================


function jogar(){



    if(btnJogar.disabled){

        return;

    }



    if(inputPalpite.value === ""){


        mostrarMensagem(
            "Digite um número!",
            "#dc2626"
        );


        return;

    }



    const palpite =
    Number(inputPalpite.value);



    if(palpite < 1 || palpite > 100){


        mostrarMensagem(
            "Digite um número entre 1 e 100!",
            "#dc2626"
        );


        return;

    }



    tentativas++;



    // =========================
    // ACERTOU
    // =========================


    if(palpite === numeroSecreto){



        mostrarMensagem(
            "🎉 Parabéns! Você acertou!",
            "#16a34a"
        );
        



        if(somVitoria){

    somVitoria.currentTime = 0;
    somVitoria.play();

}



        // Vitória

        estatisticas.vitorias++;

        estatisticas.total++;



        salvarEstatisticas();



        mostrarMedalha();


        criarConfetes();



        // Recorde

        if(pontuacao > recorde){


            recorde = pontuacao;


            localStorage.setItem(
                "recorde",
                recorde
            );


            textoRecorde.textContent =
            recorde;

        }



        btnJogar.disabled = true;


        btnReiniciar.disabled = false;



    }



    // =========================
    // ERROU
    // =========================


    else {



        if(somErro){

    somErro.currentTime = 0;
    somErro.play();

}



        pontuacao =
        Math.max(
            0,
            pontuacao - 10
        );




        if(palpite < numeroSecreto){



            mostrarMensagem(
                "📈 O número secreto é maior.",
                "#2563eb"
            );



        }else{



            mostrarMensagem(
                "📉 O número secreto é menor.",
                "#ea580c"
            );

        }




        if(tentativas >= 10){



            mostrarMensagem(
                `😢 Você perdeu! O número era ${numeroSecreto}.`,
                "#dc2626"
            );



            estatisticas.derrotas++;

            estatisticas.total++;


            salvarEstatisticas();



            btnJogar.disabled = true;


            btnReiniciar.disabled = false;



        }



    }



    textoTentativas.textContent =
    tentativas;



    textoPontuacao.textContent =
    pontuacao;



    inputPalpite.value = "";


    inputPalpite.focus();



}



// =========================
// SALVAR ESTATÍSTICAS
// =========================


function salvarEstatisticas(){


    localStorage.setItem(
        "vitorias",
        estatisticas.vitorias
    );


    localStorage.setItem(
        "derrotas",
        estatisticas.derrotas
    );


    localStorage.setItem(
        "totalJogos",
        estatisticas.total
    );


    atualizarEstatisticas();

}




// =========================
// REINICIAR
// =========================


function reiniciarJogo(){


    numeroSecreto =
    Math.floor(Math.random() * 100) + 1;



    tentativas = 0;


    pontuacao = 100;



    textoTentativas.textContent =
    tentativas;



    textoPontuacao.textContent =
    pontuacao;



    mostrarMensagem(
        "🍀 Boa sorte!",
        "#444"
    );



    inputPalpite.value = "";



    btnJogar.disabled = false;


    btnReiniciar.disabled = true;



    inputPalpite.focus();



}



// =========================
// MEDALHA
// =========================


function mostrarMedalha(){


    const medalha =
    document.querySelector("#medalha");



    if(pontuacao >= 90){


        medalha.innerHTML =
        "🥇 Medalha de Ouro";


    }
    else if(pontuacao >= 60){


        medalha.innerHTML =
        "🥈 Medalha de Prata";


    }
    else{


        medalha.innerHTML =
        "🥉 Medalha de Bronze";


    }


}




// =========================
// CONFETES
// =========================


function criarConfetes(){



    for(let i = 0; i < 100; i++){



        let confete =
        document.createElement("div");



        confete.classList.add("confete");



        confete.style.left =
        Math.random() * 100 + "vw";



        confete.style.background =
        `hsl(${Math.random()*360},100%,50%)`;



        confete.style.animationDuration =
        (Math.random()*3+2)+"s";



        document.body.appendChild(confete);



        setTimeout(()=>{


            confete.remove();


        },5000);



    }


}



// =========================
// EVENTOS
// =========================


btnJogar.addEventListener(
    "click",
    function(){

        if(somVitoria){
            somVitoria.load();
        }

        if(somErro){
            somErro.load();
        }

        jogar();

    }
);



btnReiniciar.addEventListener(
    "click",
    reiniciarJogo
);



inputPalpite.addEventListener(
    "keydown",
    function(event){


        if(event.key === "Enter"){


            jogar();


        }


    }
);