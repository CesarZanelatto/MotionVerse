/* ==========================================
   Motion Verse
   cameraSelector.js
========================================== */


let equipe = null;
let cameras = [];



// ==========================================
// ELEMENTOS
// ==========================================


const nomeEquipe = document.getElementById("nomeEquipe");


const jogadores = [

    document.getElementById("nomeJogador1"),
    document.getElementById("nomeJogador2"),
    document.getElementById("nomeJogador3"),
    document.getElementById("nomeJogador4")

];


const selects = [

    document.getElementById("camera1"),
    document.getElementById("camera2"),
    document.getElementById("camera3"),
    document.getElementById("camera4")

];


const btnVoltar =
    document.getElementById("btnVoltar");


const btnIniciar =
    document.getElementById("btnIniciar");

const btnTeclado =
    document.getElementById("btnTeclado");




// MODAIS (opcionais)

const modal =
    document.getElementById("modalConfirmacao");


const btnCancelar =
    document.getElementById("btnCancelarModal");


const btnConfirmar =
    document.getElementById("btnConfirmarModal");



const modalErro =
    document.getElementById("modalErro");


const mensagemErro =
    document.getElementById("mensagemErro");


const btnFecharErro =
    document.getElementById("btnFecharErro");





// ==========================================
// INICIALIZAÇÃO
// ==========================================


window.addEventListener(
"DOMContentLoaded",
async()=>{


    equipe =
        JSON.parse(
            localStorage.getItem("equipeAtual")
        );



    if(!equipe){


        mostrarErro(
            "Nenhuma equipe encontrada."
        );


        setTimeout(()=>{


            window.location.href =
            "../Cadastro/cadastro.html";


        },2000);


        return;


    }




    carregarEquipe();


    criarFireflies();


    await carregarCameras();



});






// ==========================================
// CARREGAR EQUIPE
// ==========================================


function carregarEquipe(){


    if(nomeEquipe){


        nomeEquipe.textContent =
            equipe.equipe ||
            equipe.nomeEquipe ||
            "Equipe sem nome";


    }



    jogadores.forEach(
    (elemento,index)=>{


        if(!elemento)
            return;



        const jogador =
            equipe.jogadores?.[index];



        if(!jogador)
            return;



        if(typeof jogador === "object"){


            elemento.textContent =
                jogador.nome || "Jogador";


        }
        else{


            elemento.textContent =
                jogador;


        }


    });


}







// ==========================================
// FIRELIES
// ==========================================


function criarFireflies(){


    const area =
        document.querySelector(".bg-fireflies");



    if(!area)
        return;



    const reduzir =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;



    if(reduzir)
        return;



    for(let i=0;i<20;i++){



        const f =
            document.createElement("span");



        f.className =
            "firefly";



        f.style.left =
            Math.random()*100+"%";



        f.style.top =
            Math.random()*100+"%";



        f.style.setProperty(
            "--dx",
            `${(Math.random()-0.5)*160}px`
        );



        f.style.setProperty(
            "--dy",
            `${-(60+Math.random()*140)}px`
        );



        f.style.animationDuration =
            `${6+Math.random()*8}s`;



        f.style.animationDelay =
            `${Math.random()*5}s`;



        area.appendChild(f);


    }


}






// ==========================================
// CARREGAR WEBCAMS
// ==========================================


async function carregarCameras(){


    try{


        const stream =
            await navigator.mediaDevices.getUserMedia(
            {

                video:true

            });



        stream
        .getTracks()
        .forEach(track=>track.stop());





        const dispositivos =
            await navigator.mediaDevices.enumerateDevices();





        cameras =
            dispositivos.filter(
            dispositivo=>

                dispositivo.kind === "videoinput"

            );





        selects.forEach(select=>{


            if(select){

                preencherSelect(select);

            }


        });



    }


    catch(error){


        console.error(error);



        mostrarErro(
            "Permissão de câmera negada."
        );


    }


}







// ==========================================
// PREENCHER SELECT
// ==========================================


function preencherSelect(select){


    select.innerHTML="";



    const opcao =
        document.createElement("option");



    opcao.value="";


    opcao.textContent =
        "Selecione uma câmera";



    select.appendChild(opcao);





    cameras.forEach(
    (camera,index)=>{


        const option =
            document.createElement("option");



        option.value =
            camera.deviceId;



        option.textContent =
            camera.label ||
            `Webcam ${index+1}`;



        select.appendChild(option);



    });


}








// ==========================================
// SALVAR CONFIGURAÇÃO
// ==========================================


function salvarConfiguracao(){



    const usados=[];




    for(
        let i=0;
        i<selects.length;
        i++
    ){



        const select =
            selects[i];



        if(!select)
            continue;




        const idCamera =
            select.value;




        if(!idCamera){


            mostrarErro(
                "Selecione todas as webcams."
            );


            return false;


        }





        if(
            usados.includes(idCamera)
        ){


            mostrarErro(
                "Não use a mesma câmera em jogadores diferentes."
            );


            return false;


        }





        usados.push(idCamera);





        if(
            typeof equipe.jogadores[i] === "string"
        ){


            equipe.jogadores[i] = {


                nome:
                equipe.jogadores[i]


            };


        }






        const camera =
            cameras.find(
            c=>

                c.deviceId === idCamera

            );





        equipe.jogadores[i].camera = {


            id:idCamera,


            nome:
            camera?.label ||
            `Webcam ${i+1}`


        };


    }






    localStorage.setItem(

        "equipeAtual",

        JSON.stringify(equipe)

    );





    atualizarRanking();



    return true;


}








// ==========================================
// RANKING
// ==========================================


function atualizarRanking(){



    let ranking =
        JSON.parse(
            localStorage.getItem("ranking")
        )
        ||
        [];





    const index =
        ranking.findIndex(
        item=>

            item.id === equipe.id

        );





    if(index>=0){


        ranking[index]=equipe;


    }
    else{


        ranking.push(equipe);


    }





    localStorage.setItem(

        "ranking",

        JSON.stringify(ranking)

    );


}








// ==========================================
// ERRO
// ==========================================


function mostrarErro(msg){



    if(
        mensagemErro &&
        modalErro
    ){


        mensagemErro.textContent =
            msg;


        modalErro.style.display =
            "flex";


    }
    else{


        alert(msg);


    }


}







if(btnFecharErro){


    btnFecharErro.onclick=()=>{


        modalErro.style.display =
            "none";


    };


}







// ==========================================
// BOTÕES
// ==========================================


if(btnVoltar){


    btnVoltar.onclick=()=>{


        window.location.href =
        "../Cadastro/cadastro.html";


    };


}






if(btnIniciar){


    btnIniciar.onclick=()=>{


        if(
            salvarConfiguracao()
        ){


            if(modal){


                modal.style.display =
                "flex";


            }
            else{


                localStorage.setItem("modoControle", "camera");

                // Após configurar as câmeras, entra direto no jogo inicial
                window.location.href =
                "../../jogo/Marcacao/inicio.html";


            }


        }


    };


}







// ==========================================
// CONFIRMAÇÃO
// ==========================================


if(btnCancelar){


    btnCancelar.onclick=()=>{


        modal.style.display =
        "none";


    };


}





if(btnConfirmar){


    btnConfirmar.onclick=()=>{


        modal.style.display =
        "none";



        localStorage.setItem("modoControle", "camera");

        // Após configurar as câmeras, entra direto no jogo inicial
        window.location.href =
        "../../jogo/Marcacao/inicio.html";


    };


}






// ==========================================
// TECLA ENTER
// ==========================================


document.addEventListener(
"keydown",
(e)=>{


    if(e.key !== "Enter")
        return;



    // Modal confirmação aberto
    if(
        modal &&
        modal.style.display === "flex"
    ){


        btnConfirmar?.click();


        return;


    }



    // Modal de erro aberto
    if(
        modalErro &&
        modalErro.style.display === "flex"
    ){


        btnFecharErro?.click();


        return;


    }



    // Enter funciona como botão iniciar

    btnIniciar?.click();



});





// ==========================================
// FECHAR CLICANDO FORA
// ==========================================


window.onclick=(e)=>{


    if(
        e.target === modal
    ){


        modal.style.display =
        "none";


    }



    if(
        e.target === modalErro
    ){


        modalErro.style.display =
        "none";


    }


};

if(btnTeclado){


    btnTeclado.onclick=()=>{


        localStorage.setItem("modoControle", "teclado");

        // Entra direto no jogo inicial (sem câmera)
        window.location.href =
        "../../jogo/Marcacao/inicio.html";


    };


}
