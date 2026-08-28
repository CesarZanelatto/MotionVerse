/* ==========================================
   Motion Verse
   cadastro.js
========================================== */


// ------------------------------
// GERA O PRÓXIMO ID
// ------------------------------

function gerarIdEquipe() {

    let ultimoId = localStorage.getItem("ultimoId");


    if (ultimoId === null) {

        ultimoId = 1;

    } else {

        ultimoId = parseInt(ultimoId) + 1;

    }


    localStorage.setItem("ultimoId", ultimoId);


    return "CA-" + ultimoId.toString().padStart(6, "0");

}



// ------------------------------
// ENVIO DO FORMULÁRIO
// ------------------------------

document
.getElementById("formCadastro")
.addEventListener("submit", function(event){


    event.preventDefault();



    const nomeEquipe =
    document.getElementById("nomeEquipe");


    const jogador1 =
    document.getElementById("jogador1");


    const jogador2 =
    document.getElementById("jogador2");


    const jogador3 =
    document.getElementById("jogador3");


    const jogador4 =
    document.getElementById("jogador4");



    const equipe =
    nomeEquipe.value.trim();



    // --------------------------
    // VALIDAÇÃO
    // --------------------------

    if(

        equipe === "" ||

        jogador1.value.trim() === "" ||

        jogador2.value.trim() === "" ||

        jogador3.value.trim() === "" ||

        jogador4.value.trim() === ""

    ){

        alert("Preencha todos os campos!");

        return;

    }



    // ABRE MODAL DE CONFIRMAÇÃO

    abrirModal();



});





// ------------------------------
// SALVAR EQUIPE
// ------------------------------

function salvarEquipe(){


    const nomeEquipe =
    document.getElementById("nomeEquipe");


    const jogador1 =
    document.getElementById("jogador1");


    const jogador2 =
    document.getElementById("jogador2");


    const jogador3 =
    document.getElementById("jogador3");


    const jogador4 =
    document.getElementById("jogador4");



    const equipe =
    nomeEquipe.value.trim();


    // --------------------------
    // PEGAR RANKING EXISTENTE
    // --------------------------

    let ranking = JSON.parse(

        localStorage.getItem("ranking")

    ) || [];





    // --------------------------
    // VERIFICAR DUPLICIDADE
    // --------------------------

    const existeEquipe = ranking.find(

        item => 
        item.equipe.toLowerCase() === equipe.toLowerCase()

    );



    if(existeEquipe){


        abrirModalEquipeExistente();
    
    
        return;
    
    
    }

    // --------------------------
    // GERAR ID APÓS VALIDAR NOME
    // --------------------------

    const id = gerarIdEquipe();




    // --------------------------
    // OBJETO DA EQUIPE
    // --------------------------

    const novaEquipe = { 

        id:id,

        equipe:equipe,

        fase:1,


        jogadores:[

            {
                id:1,

                nome:jogador1.value.trim(),

                funcao:"frente",

                camera:{
                    id:null,
                    nome:""
                },

                gesto:"fechada",

                status:"parado"
            },


            {
                id:2,

                nome:jogador2.value.trim(),

                funcao:"tras",

                camera:{
                    id:null,
                    nome:""
                },

                gesto:"fechada",

                status:"parado"
            },


            {
                id:3,

                nome:jogador3.value.trim(),

                funcao:"baixo",

                camera:{
                    id:null,
                    nome:""
                },

                gesto:"fechada",

                status:"parado"
            },


            {
                id:4,

                nome:jogador4.value.trim(),

                funcao:"cima",

                camera:{
                    id:null,
                    nome:""
                },

                gesto:"fechada",

                status:"parado"
            }

        ]

    };



        // --------------------------
        // SALVAR
        // --------------------------

        ranking.push(novaEquipe);



        localStorage.setItem(

            "ranking",

            JSON.stringify(ranking)

        );

        // --------------------------
        // SALVAR EQUIPE ATUAL
        // --------------------------

        localStorage.setItem(

            "equipeAtual",

            JSON.stringify(novaEquipe)

        );



    // --------------------------
    // MOSTRAR SUCESSO
    // --------------------------

    abrirModalSucesso();




    // --------------------------
    // LIMPAR FORMULÁRIO
    // --------------------------

    document
.getElementById("formCadastro")
.reset();


// IR PARA A PÁGINA DO CAMERASELECTOR

setTimeout(function(){

    window.location.href = "../cameraSelector/cameraSelector.html";

}, 1500);



}





// ======================================================
// MODAL CONFIRMAÇÃO
// ======================================================


const modal =
document.getElementById("modalConfirmacao");


const btnConfirmarModal =
document.getElementById("btnConfirmarModal");


const btnCancelarModal =
document.getElementById("btnCancelarModal");




function abrirModal(){

    if(modal){

        modal.style.display="flex";

    }

}




function fecharModal(){

    if(modal){

        modal.style.display="none";

    }

}





btnCancelarModal.addEventListener("click",function(){


    fecharModal();


});





btnConfirmarModal.addEventListener("click",function(){


    fecharModal();


    salvarEquipe();


});





// ======================================================
// MODAL SUCESSO
// ======================================================


const modalSucesso =
document.getElementById("modalSucesso");


const btnFecharSucesso =
document.getElementById("btnFecharSucesso");





function abrirModalSucesso(){

    if(modalSucesso){

        modalSucesso.style.display="flex";

    }

}





function fecharModalSucesso(){

    if(modalSucesso){

        modalSucesso.style.display="none";

    }

}





btnFecharSucesso.addEventListener("click",function(){


    fecharModalSucesso();


});

// ======================================================
// MODAL EQUIPE EXISTENTE
// ======================================================


const modalEquipeExistente =
document.getElementById("modalEquipeExistente");


const btnFecharEquipeExistente =
document.getElementById("btnFecharEquipeExistente");




function abrirModalEquipeExistente(){

    if(modalEquipeExistente){

        modalEquipeExistente.style.display="flex";

    }

}




function fecharModalEquipeExistente(){

    if(modalEquipeExistente){

        modalEquipeExistente.style.display="none";

    }

}





if(btnFecharEquipeExistente){

    btnFecharEquipeExistente.addEventListener(
    "click",
    function(){

        fecharModalEquipeExistente();

    });

}


// ======================================================
// ENTER = BOTÃO SIM
// ======================================================

document.addEventListener("keydown", function(event){

    if(event.key !== "Enter") return;

    // Se o modal de confirmação estiver aberto,
    // o Enter equivale ao botão "Sim".
    if(modal && modal.style.display === "flex"){

        event.preventDefault();

        btnConfirmarModal.click();

    }

    // Se o modal de sucesso estiver aberto,
    // o Enter equivale ao botão "Fechar".
    else if(modalSucesso && modalSucesso.style.display === "flex"){

        event.preventDefault();

        btnFecharSucesso.click();

    }

     // Modal de equipe já cadastrada
    else if(modalEquipeExistente && modalEquipeExistente.style.display === "flex"){

        event.preventDefault();
        btnFecharEquipeExistente.click();

    }

});


// ------------------------------
// BOTÃO VOLTAR
// ------------------------------

document
.getElementById("btnVoltar")
.addEventListener("click", function(){


    window.location.href="../index.html";


});






// ------------------------------
// VAGALUMES
// ------------------------------


const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;



try {


    const firefliesWrap =
    document.getElementById("fireflies");



    if(
        firefliesWrap &&
        !prefersReducedMotion
    ){


        const COUNT = 20;



        for(let i = 0; i < COUNT; i++){



            const f =
            document.createElement("span");



            f.className="firefly";



            const startX =
            Math.random()*100;



            const startY =
            20 + Math.random()*70;



            const dx =
            (Math.random()-0.5)*160;



            const dy =
            -(60 + Math.random()*140);



            const duration =
            6 + Math.random()*8;



            const delay =
            Math.random()*8;




            f.style.left =
            `${startX}%`;



            f.style.top =
            `${startY}%`;



            f.style.setProperty(
                "--dx",
                `${dx}px`
            );



            f.style.setProperty(
                "--dy",
                `${dy}px`
            );



            f.style.animationDuration =
            `${duration}s`;



            f.style.animationDelay =
            `${delay}s`;



            firefliesWrap.appendChild(f);


        }


    }


} catch(err){

    console.error(err);

}