"use strict";

/*=========================================
        CONFIG
=========================================*/

const CONFIG = {

    ROOT: "assets/projects/"

};

/*=========================================
        DOM
=========================================*/

const DOM = {

    hero:
        document.getElementById("projectHero"),

    video:
        document.getElementById("projectVideo"),

    overview:
        document.getElementById("projectOverview"),

    gallery:
        document.getElementById("projectGallery"),

    videos:
        document.getElementById("projectVideos"),

    features:
        document.getElementById("projectFeatures"),

    technologies:
        document.getElementById("projectTechnologies"),

    specifications:
        document.getElementById("projectSpecifications"),

    challenges:
        document.getElementById("projectChallenges"),

    future:
        document.getElementById("projectFuture"),

    downloads:
        document.getElementById("projectDownloads"),

    related:
        document.getElementById("relatedProjects")

};


/*=========================================
        URL
=========================================*/

const params = new URLSearchParams(

    window.location.search

);

const projectID = params.get("id");

function imagePath(project, file){
    return `${CONFIG.ROOT}${project.folder}/${file}`.replace(/\.png$/i, ".webp");
}

function proseBlocks(text){
    const normalized = String(text || "").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    return normalized.split(/(?<=[.!?])\s+/).filter(Boolean).map(paragraph => `<p>${paragraph.trim()}</p>`).join("");
}


/*=========================================
        LOAD PROJECT
=========================================*/

async function loadProject(){

    if(!projectID){

        location.href="projects.html";

        return;

    }

    const project = await window.portfolioData(

        `${CONFIG.ROOT}${projectID}/data.json?v=20260918`

    );



    project.folder = projectID;

    buildProject(project);

}

loadProject();


/*=========================================
        BUILD
=========================================*/

function buildProject(project){

    DOM.related.innerHTML = "";

    buildHero(project);

    buildProjectVideo(project);

    buildOverview(project);

    buildGallery(project);

    buildVideos(project);

    buildFeatures(project);

    buildTechnologies(project);

    buildSpecifications(project);

    buildChallenges(project);

    buildFuture(project);

    buildDownloads(project);

}

function buildProjectVideo(project){

    const video = project.heroVideo || (Array.isArray(project.videos) ? project.videos[0] : "");
    if(!video){
        DOM.video.innerHTML = "";
        return;
    }

    const source = video ? (/^https?:\/\//.test(video) ? video : `${CONFIG.ROOT}${project.folder}/${video}`) : "";
    const extension = video.split("?")[0].split(".").pop().toLowerCase();
    const mimeType = extension === "webm" ? "video/webm" : extension === "ogv" ? "video/ogg" : "video/mp4";
    const sourceMarkup = source ? `<source src="${source}" type="${mimeType}">` : "";

    DOM.video.innerHTML = `
        <div class="container">
            <div class="section-title">
                <h2>Project Video</h2>
                <p>Watch the project demonstration and see the system in operation.</p>
            </div>
            <div class="project-video-frame">
                <video controls preload="metadata" poster="${imagePath(project, project.cover || project.hero)}">
                    ${sourceMarkup}
                    Your browser does not support embedded video.
                </video>
            </div>
        </div>`;
}


/*=========================================
        HERO
=========================================*/

function buildHero(project){

DOM.hero.innerHTML=

`

<div class="container">

<a class="article-back project-back" href="projects.html" aria-label="Back to all projects"><span aria-hidden="true">←</span><span>All projects</span></a>

<div class="project-hero">

<div class="project-content">

<span class="badge">

${project.category.join(" • ")}

</span>

<h1>

${project.title}

</h1>

<h3>

${project.subtitle}

</h3>

<div class="project-summary">

${proseBlocks(project.overview || project.description)}

</div>

<div class="tech-list">

${project.technologies.map(

tech=>

`<span>${tech}</span>`

).join("")}

</div>

<a

class="btn-primary"

href="${project.links.github}"

target="_blank"

rel="noopener"

>

Github

</a>

</div>

<div class="project-cover">

<img

src="${imagePath(project, project.hero)}"

fetchpriority="high"

decoding="sync"

>

</div>

</div>

</div>

`;

}


function buildOverview(project){

const sections = Array.isArray(project.sections) && project.sections.length
    ? project.sections.map(section => `
        <article class="project-content-block">
            <h3>${section.heading}</h3>
            <div>${(section.paragraphs || [section.text]).map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
        </article>`).join("")
    : `<div class="project-overview-copy">${proseBlocks(project.description || project.overview)}</div>`;

DOM.overview.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Project Overview

</h2>

</div>

<div class="project-section-grid">${sections}</div>

</div>

`;

}

function buildGallery(project){

    DOM.gallery.innerHTML = `

    <div class="container">

        <div class="section-title">

            <h2>Gallery</h2>

        </div>

        <div class="gallery-grid">

            ${project.gallery.map((image, index) => `

                <img

                    class="gallery-image"

                    data-index="${index}"

                    loading="eager"

                    decoding="sync"

                    fetchpriority="auto"

                    src="${imagePath(project, image)}"

                    alt="${project.title}"

                >

            `).join("")}

        </div>

    </div>

    `;

    // Get all gallery images
    const images = [
        ...document.querySelectorAll(".gallery-image")
    ];

    // Add click event to each image
    images.forEach(image => {

        image.addEventListener("click", () => {

            gallery.open(

                images.map(img => img.src),

                Number(image.dataset.index)

            );

        });

    });

}


function buildVideos(project){

if(project.videos.length===0){
    DOM.videos.innerHTML = "";

    return;
}

DOM.videos.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Videos

</h2>

</div>

<div class="video-grid">

${project.videos.map(

video=>

`

<video

controls

>

<source

src="assets/projects/${project.folder}/${video}"

type="video/mp4"

>

</video>

`

).join("")}

</div>

</div>

`;

}



function buildFeatures(project){

DOM.features.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Features

</h2>

</div>

<div class="feature-grid">

${project.features.map(

feature=>

`

<div class="project-feature">

✔

${feature}

</div>

`

).join("")}

</div>

</div>

`;

}


function buildTechnologies(project){

DOM.technologies.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Technologies

</h2>

</div>

<div class="tech-list">

${project.technologies.map(

tech=>

`<span>${tech}</span>`

).join("")}

</div>

</div>

`;

}

function buildSpecifications(project){

let html="";

for(const key in project.specifications){

html+=`

<tr>

<td>

${key}

</td>

<td>

${project.specifications[key]}

</td>

</tr>

`;

}

DOM.specifications.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Specifications

</h2>

</div>

<table class="spec-table">

${html}

</table>

</div>

`;

}


function buildChallenges(project){

DOM.challenges.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Challenges

</h2>

</div>

<div class="project-list-grid">

${project.challenges.map(

challenge=>

`<div class="project-list-item">${challenge}</div>`

).join("")}

</div>

</div>

`;

}


function buildFuture(project){

DOM.future.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Github Project Link

</h2>

</div>

<a
    class="btn-primary project-github-link"
    href="${project.links.github}"
    target="_blank"
    rel="noopener"
>
    <i class="fa-brands fa-github" aria-hidden="true"></i>
    Open Github Project
</a>

</div>

</div>

`;

}


function buildDownloads(project){

DOM.downloads.innerHTML=

`

<div class="container">

<div class="section-title">

<h2>

Downloads

</h2>

</div>

<div class="download-grid">

${project.documents.map(

file=>

`

<a

href="assets/projects/${project.folder}/${file.file}"

class="download-card"

target="_blank"

rel="noopener"

>

${file.title}

</a>

`

).join("")}

</div>

</div>

`;

}
