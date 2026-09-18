"use strict";

/*==========================================
        LIGHTBOX
==========================================*/

class Gallery{

    constructor(){

        this.images=[];

        this.current=0;

        this.create();

    }

    create(){

        this.overlay=document.createElement("div");

        this.overlay.className="lightbox";

        this.overlay.innerHTML=`

        <button class="close">

            <i class="fa-solid fa-xmark"></i>

        </button>

        <button class="prev">

            <i class="fa-solid fa-chevron-left"></i>

        </button>

        <img>

        <button class="next">

            <i class="fa-solid fa-chevron-right"></i>

        </button>

        `;

        document.body.appendChild(this.overlay);

        this.image=this.overlay.querySelector("img");

        this.overlay

            .querySelector(".close")

            .onclick=()=>this.close();

        this.overlay

            .querySelector(".prev")

            .onclick=()=>this.previous();

        this.overlay

            .querySelector(".next")

            .onclick=()=>this.next();

    }

    open(images,index){

        this.images=images;

        this.current=index;

        this.show();

        this.overlay.classList.add("active");

    }

    close(){

        this.overlay.classList.remove("active");

    }

    show(){

        this.image.src=this.images[this.current];

    }

    next(){

        this.current++;

        if(this.current>=this.images.length)

            this.current=0;

        this.show();

    }

    previous(){

        this.current--;

        if(this.current<0)

            this.current=this.images.length-1;

        this.show();

    }

}

const gallery=new Gallery();