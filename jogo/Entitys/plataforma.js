
class Plataforma{

    constructor(x,y,img_url){
        this.x=x;
        this.y=y;
        this.tamanho=64;
        this.img = new Image();
        this.img.src=img_url
    }

    desenhar(ctx){
        if(!this.img.complete) return;
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.tamanho,
            this.tamanho,
        )

    }


}

export default Plataforma;