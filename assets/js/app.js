"use strict";

/*==================================================
                APP ENGINE
==================================================*/

const App = {

    init(){

        this.cacheDOM();

        this.initPerformance();

        const siteScript = document.createElement("script");
        siteScript.src = "assets/js/site.js";
        document.head.appendChild(siteScript);

        this.bindEvents();

        this.initTyping();

        this.initCounters();

        this.initScrollReveal();

        this.initProgressBar();

        this.initParticles();

        this.initCursor();

        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';

    },

    initCursor() {
        const cursor = document.querySelector('.cursor');
        const dot = document.querySelector('.cursor-dot');

        if (!cursor || !dot) return;

        document.addEventListener('mousemove', (event) => {
            cursor.style.left = event.clientX - 15 + 'px';
            cursor.style.top = event.clientY - 15 + 'px';
            dot.style.left = event.clientX - 3 + 'px';
            dot.style.top = event.clientY - 3 + 'px';
        });

        document.querySelectorAll('a, button, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                dot.classList.add('hover');
            });
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                dot.classList.remove('hover');
            });
        });
    },

    cacheDOM(){

        this.header=document.querySelector("header");

        this.menuBtn=document.querySelector(".menu-btn");

        this.mobileNav=document.querySelector(".mobile-nav");

        this.overlay=document.querySelector(".overlay");

        this.themeBtn=document.querySelector(".icon-btn");

    },

    bindEvents(){

        window.addEventListener(

            "scroll",

            ()=>{

                this.navbarScroll();

                this.activeNavigation();

                this.progress();

            }

        );

        if(this.menuBtn){

            this.menuBtn.onclick=()=>this.toggleMenu();

        }

        if(this.overlay){

            this.overlay.onclick=()=>this.closeMenu();

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    ()=>App.init()

);

App.navbarScroll=function(){

    if(window.scrollY>80)

        this.header.classList.add("scrolled");

    else

        this.header.classList.remove("scrolled");

};


App.toggleMenu=function(){

    this.mobileNav.classList.toggle("active");

    this.overlay.classList.toggle("active");

};

App.closeMenu=function(){

    this.mobileNav.classList.remove("active");

    this.overlay.classList.remove("active");

};

App.activeNavigation=function(){

    const sections=document.querySelectorAll("section");

    const links=document.querySelectorAll(".nav-links a");

    let current="";

    sections.forEach(section=>{

        const top=section.offsetTop-150;

        if(scrollY>=top)

            current=section.id;

    });

    links.forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href")==="#"+current

        ){

            link.classList.add("active");

        }

    });

};


App.initCounters=function(){

const counters=

document.querySelectorAll(

"[data-count]"

);

const observer=

new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting)

return;

const counter=entry.target;

const target=

Number(

counter.dataset.count

);

let value=0;

const speed=target/80;

const interval=

setInterval(()=>{

value+=speed;

if(value>=target){

counter.innerText=target;

clearInterval(interval);

}else{

counter.innerText=

Math.floor(value);

}

},20);

observer.unobserve(counter);

});

}

);

counters.forEach(counter=>

observer.observe(counter)

);

};


App.initTyping=function(){

const element=

document.querySelector(

".typing-text"

);

if(!element)

return;

element.innerText="Electrical Engineer";

const words=[

"Electrical Engineer",

"AI Developer",

"Embedded Systems",

"IoT Engineer",

"PCB Designer",

"ML Enthusiast"

];

let word=0;

let letter=0;

let deleting=false;

function type(){

const text=words[word];

if(!deleting){

letter++;

}else{

letter--;

}

element.innerText=

text.substring(0,letter);

if(letter===text.length){

deleting=true;

setTimeout(type,1500);

return;

}

if(letter===0){

deleting=false;

word++;

if(word>=words.length)

word=0;

}

setTimeout(

type,

deleting?40:120

);

}

type();

};


App.initScrollReveal=function(){

const elements=

document.querySelectorAll(

".glass-card,.project-card,.stat-card,.section-title"

);

const observer=

new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(

"show"

);

}

});

},

{

threshold:.2

}

);

elements.forEach(element=>

observer.observe(element)

);

};


App.initTheme=function(){

const button=

document.querySelector(

".fa-moon"

);

if(!button)

return;

button.onclick=()=>{

document.body.classList.toggle(

"light"

);

localStorage.setItem(

"theme",

document.body.classList.contains(

"light"

)

);

};

if(

localStorage.getItem(

"theme"

)==="true"

){

document.body.classList.add(

"light"

);

}

};


App.initProgressBar=function(){

const bar=document.createElement("div");

bar.className="progress-bar";

document.body.appendChild(bar);

this.bar=bar;

};

App.progress=function(){

const total=

document.body.scrollHeight-

window.innerHeight;

const value=

(scrollY/total)*100;

this.bar.style.width=value+"%";

};

// Warm same-site pages after rendering and cache files after the first visit.
App.initPerformance=function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js").catch(()=>{});
    }

    const warmNavigation=()=>{
        ["about.html", "projects.html", "skills.html", "research.html", "contact.html"]
            .filter(path=>!location.pathname.endsWith(path))
            .forEach(path=>fetch(path, { priority:"low" }).catch(()=>{}));
    };

    if("requestIdleCallback" in window) requestIdleCallback(warmNavigation, { timeout:3000 });
    else setTimeout(warmNavigation, 1500);
};



App.initParticles=function(){

const canvas=document.createElement(

"canvas"

);

canvas.id="particles";

document.body.prepend(canvas);

const ctx=canvas.getContext("2d");

function resize(){

canvas.width=innerWidth;

canvas.height=innerHeight;

}

resize();

window.addEventListener(

"resize",

resize

);

const dots=[];

for(let i=0;i<80;i++){

dots.push({

x:Math.random()*canvas.width,

y:Math.random()*canvas.height,

vx:(Math.random()-.5),

vy:(Math.random()-.5),

r:Math.random()*2+1

});

}

function animate(){

ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);

dots.forEach(dot=>{

dot.x+=dot.vx;

dot.y+=dot.vy;

if(dot.x<0||dot.x>canvas.width)

dot.vx*=-1;

if(dot.y<0||dot.y>canvas.height)

dot.vy*=-1;

ctx.beginPath();

ctx.arc(

dot.x,

dot.y,

dot.r,

0,

Math.PI*2

);

ctx.fillStyle="rgba(79,124,255,.35)";

ctx.fill();

});

requestAnimationFrame(

animate

);

}

animate();

};


