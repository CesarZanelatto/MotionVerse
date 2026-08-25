/* ==========================================
   Motion Verse
   ranking.js
========================================== */


const corpoTabela = document.getElementById("corpoTabela");
const pesquisa = document.getElementById("pesquisa");
const btnLimpar = document.getElementById("btnLimpar");


const senhaCorreta = "Senacsala21@";


const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;



let acaoConfirmacao = null;
let acaoSenha = null;




// ======================================================
// LOCAL STORAGE
// ======================================================


function obterRanking(){

    try{

        const dados =
        JSON.parse(localStorage.getItem("ranking"));

        return Array.isArray(dados) ? dados : [];

    }catch{

        return [];

    }

}




function salvarRanking(ranking){

    localStorage.setItem(
        "ranking",
        JSON.stringify(ranking)
    );

}





// ======================================================
// TABELA
// ======================================================


function criarCelula(texto){

    const td =
    document.createElement("td");


    td.textContent =
    texto || "-";


    return td;

}





function carregarRanking(){


    const ranking =
    obterRanking();


    corpoTabela.innerHTML="";



    if(ranking.length === 0){


        const tr =
        document.createElement("tr");


        const td =
        document.createElement("td");


        td.colSpan = 9;

        td.className="vazio";

        td.textContent =
        "Nenhuma equipe cadastrada.";


        tr.appendChild(td);

        corpoTabela.appendChild(tr);


        return;

    }





    ranking.forEach((equipe, indice)=>{


        const tr =
        document.createElement("tr");


        const jogadores =
        Array.isArray(equipe.jogadores)
        ? equipe.jogadores
        : [];



        tr.appendChild(
            criarCelula(equipe.equipe)
        );


        tr.appendChild(
            criarCelula(
                jogadores[0]?.nome
            )
        );
        
        
        tr.appendChild(
            criarCelula(
                jogadores[1]?.nome
            )
        );
        
        
        tr.appendChild(
            criarCelula(
                jogadores[2]?.nome
            )
        );
        
        
        tr.appendChild(
            criarCelula(
                jogadores[3]?.nome
            )
        );

        
        tr.appendChild(
            criarCelula(equipe.tempo || "00:00")
        );



        const tdAcoes =
        document.createElement("td");



        const btn =
        document.createElement("button");


        btn.className="btn-excluir";

        btn.textContent="Excluir";



        btn.addEventListener(
            "click",
            ()=>solicitarSenha(
                ()=>excluirEquipe(indice)
            )
        );



        tdAcoes.appendChild(btn);


        tr.appendChild(tdAcoes);



        corpoTabela.appendChild(tr);



    });


}





// ======================================================
// EXCLUSÃO
// ======================================================


function excluirEquipe(indice){


    abrirConfirmacao(

        "Deseja excluir esta equipe?",

        function(){


            const ranking =
            obterRanking();


            ranking.splice(indice,1);


            salvarRanking(ranking);


            carregarRanking();


            abrirMensagem(
                "Equipe excluída com sucesso!"
            );


        }

    );


}






// ======================================================
// LIMPAR RANKING
// ======================================================


btnLimpar.addEventListener(
"click",
function(){


    solicitarSenha(

        function(){


            abrirConfirmacao(

                "Deseja apagar TODAS as equipes?",


                function(){


                    localStorage.removeItem(
                        "ranking"
                    );


                    carregarRanking();


                    abrirMensagem(
                        "Ranking apagado com sucesso!"
                    );


                }

            );


        }

    );


});







// ======================================================
// PESQUISA
// ======================================================


pesquisa.addEventListener(
"keyup",
function(){


    const texto =
    pesquisa.value.toLowerCase();


    const linhas =
    corpoTabela.querySelectorAll("tr");



    linhas.forEach(linha=>{


        const conteudo =
        linha.innerText.toLowerCase();



        linha.style.display =
        conteudo.includes(texto)
        ? ""
        : "none";


    });


});






// ======================================================
// MODAIS
// ======================================================

const btnConfirmarSenha =
document.getElementById("btnConfirmarSenha");

const btnConfirmarConfirmacao =
document.getElementById("btnConfirmarConfirmacao");

const btnFecharMensagem =
document.getElementById("btnFecharMensagem");

function solicitarSenha(funcao){


    acaoSenha = funcao;


    document
    .getElementById("senhaModal")
    .value="";


    document
    .getElementById("modalSenha")
    .style.display="flex";


}





document
.getElementById("btnConfirmarSenha")
.addEventListener(
"click",
function(){


    const senha =
    document.getElementById("senhaModal").value;



    if(senha !== senhaCorreta){


        fecharModalSenha();


        abrirMensagem(
            "Senha incorreta!"
        );


        return;

    }



    fecharModalSenha();



    if(acaoSenha){

        acaoSenha();

    }



});





document
.getElementById("btnCancelarSenha")
.addEventListener(
"click",
fecharModalSenha
);





function fecharModalSenha(){


    document
    .getElementById("modalSenha")
    .style.display="none";


}







function abrirConfirmacao(texto, funcao){


    acaoConfirmacao = funcao;


    document
    .getElementById("mensagemConfirmacao")
    .textContent = texto;



    document
    .getElementById("modalConfirmar")
    .style.display="flex";


}






document
.getElementById("btnConfirmarConfirmacao")
.addEventListener(
"click",
function(){


    fecharConfirmacao();



    if(acaoConfirmacao){

        acaoConfirmacao();

    }


});






document
.getElementById("btnCancelarConfirmacao")
.addEventListener(
"click",
fecharConfirmacao
);





function fecharConfirmacao(){


    document
    .getElementById("modalConfirmar")
    .style.display="none";


}







function abrirMensagem(texto){


    document
    .getElementById("textoMensagem")
    .textContent = texto;



    document
    .getElementById("modalMensagem")
    .style.display="flex";


}






document
.getElementById("btnFecharMensagem")
.addEventListener(
"click",
function(){


    document
    .getElementById("modalMensagem")
    .style.display="none";


});

// ======================================================
// ENTER = BOTÃO SIM / CONFIRMAR
// ======================================================

document.addEventListener("keydown", function(event){

    if(event.key !== "Enter") return;

    // Modal da senha
    if(document.getElementById("modalSenha").style.display === "flex"){

        event.preventDefault();

        btnConfirmarSenha.click();

    }

    // Modal de confirmação
    else if(document.getElementById("modalConfirmar").style.display === "flex"){

        event.preventDefault();

        btnConfirmarConfirmacao.click();

    }

    // Modal de mensagem
    else if(document.getElementById("modalMensagem").style.display === "flex"){

        event.preventDefault();

        btnFecharMensagem.click();

    }

});





// ======================================================
// CARREGAR
// ======================================================


window.addEventListener(
"DOMContentLoaded",
carregarRanking
);







// ======================================================
// VAGALUMES
// ======================================================


try{


    const firefliesWrap =
    document.getElementById("fireflies");



    if(
        firefliesWrap &&
        !prefersReducedMotion
    ){


        const COUNT = 20;



        for(let i=0;i<COUNT;i++){


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


}catch(err){

    console.error(err);

}
