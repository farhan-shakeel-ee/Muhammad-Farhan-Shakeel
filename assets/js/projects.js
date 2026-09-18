/*==========================================================
    PROJECT ENGINE
    Portfolio v2
==========================================================*/

"use strict";

/*==========================================================
    CONFIG
==========================================================*/

const CONFIG = {

    DATA_FILE: "assets/data/projects.json",

    PROJECTS_PATH: "assets/projects/",

    DEFAULT_VISIBLE: 6

};

/*==========================================================
    APPLICATION STATE
==========================================================*/

const ProjectApp = {

    projects: [],

    filteredProjects: [],

    featuredProject: null,

    visibleProjects: CONFIG.DEFAULT_VISIBLE,

    currentFilter: "all",

    searchQuery: "",

    sortBy: "featured"

};

/*==========================================================
    DOM ELEMENTS
==========================================================*/

const DOM = {

    grid: document.getElementById("projectsGrid"),

    featured: document.getElementById("featuredProject"),

    search: document.getElementById("searchProject"),

    loadMore: document.getElementById("loadMore"),

    filters: document.querySelectorAll("[data-filter]")

};


/*==========================================================
    HELPERS
==========================================================*/

const Helpers = {

    async getJSON(path){

        const response = await fetch(path);

        if(!response.ok){

            throw new Error(

                "Unable to load " + path

            );

        }

        return await response.json();

    },

    createElement(html){

        const div = document.createElement("div");

        div.innerHTML = html.trim();

        return div.firstChild;

    },

    slug(text){

        return text

            .toLowerCase()

            .replace(/\s+/g,"-");

    },

    clear(element){

        element.innerHTML="";

    }

};


/*==========================================================
    LOAD PROJECT LIST
==========================================================*/

async function loadProjects(){

    try{

        const response = await Helpers.getJSON(

            CONFIG.DATA_FILE

        );

        const folders = response.projects.map(p => p.folder);

        const loadedProjects = [];

        for(const folder of folders){

            const data = await Helpers.getJSON(

                `${CONFIG.PROJECTS_PATH}${folder}/data.json`

            );

            data.folder = folder;

            loadedProjects.push(data);

        }

        ProjectApp.projects = loadedProjects;

        ProjectApp.filteredProjects = [...loadedProjects];

    }

    catch(error){

        console.error(error);

    }

}


/*==========================================================
    FEATURED PROJECT
==========================================================*/

function findFeaturedProject(){

    ProjectApp.featuredProject =

        ProjectApp.projects.find(

            project => project.featured

        );

}



/*==========================================================
    SORT
==========================================================*/

function sortProjects(){

    switch(ProjectApp.sortBy){

        case "featured":

            ProjectApp.filteredProjects.sort(

                (a,b)=>

                b.featured-a.featured

            );

        break;

        case "newest":

            ProjectApp.filteredProjects.sort(

                (a,b)=>

                Number(b.year)-Number(a.year)

            );

        break;

        case "alphabetical":

            ProjectApp.filteredProjects.sort(

                (a,b)=>

                a.title.localeCompare(b.title)

            );

        break;

    }

}


/*==========================================================
    FILTER
==========================================================*/

function filterProjects(){

    let list=[...ProjectApp.projects];

    if(ProjectApp.currentFilter!=="all"){

        list=list.filter(project=>

            project.category.some(

                category=>

                category.toLowerCase()

                ===

                ProjectApp.currentFilter

            )

        );

    }

    if(ProjectApp.searchQuery!==""){

        list=list.filter(project=>

            project.title

            .toLowerCase()

            .includes(

                ProjectApp.searchQuery

            )

        );

    }

    ProjectApp.filteredProjects=list;

}

/*==========================================================
    SEARCH
==========================================================*/

function searchProjects(event){

    ProjectApp.searchQuery=

        event.target.value

        .toLowerCase()

        .trim();

    updateProjects();

}



/*==========================================================
    FILTER BUTTONS
==========================================================*/

function filterClicked(){

    DOM.filters.forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                DOM.filters.forEach(

                    b=>b.classList.remove(

                        "active"

                    )

                );

                button.classList.add(

                    "active"

                );

                ProjectApp.currentFilter=

                    button.dataset.filter;

                updateProjects();

            }

        );

    });

}


/*==========================================================
    UPDATE
==========================================================*/

function updateProjects(){

    filterProjects();

    sortProjects();

    renderFeaturedProject();

    renderProjects();

}

/*==========================================================
    INITIALIZE
==========================================================*/

async function initializePortfolio(){

    await loadProjects();

    findFeaturedProject();

    filterClicked();

    if(DOM.search){

        DOM.search.addEventListener(

            "input",

            searchProjects

        );

    }

    updateProjects();

}

initializePortfolio();



/*==========================================================
    PROJECT PATH
==========================================================*/

function projectPath(project, file){

    return `${CONFIG.PROJECTS_PATH}${project.folder}/${file}`;

}

/*==========================================================
    TECHNOLOGY BADGES
==========================================================*/

function createTechnologyBadges(technologies){

    return technologies

        .map(technology =>

            `<span>${technology}</span>`

        )

        .join("");

}



/*==========================================================
    PROJECT STATS
==========================================================*/

function createProjectStats(project){

    return `

        <div class="project-info">

            <div>

                <strong>

                    ${project.gallery.length}

                </strong>

                <small>Images</small>

            </div>

            <div>

                <strong>

                    ${project.videos.length}

                </strong>

                <small>Videos</small>

            </div>

            <div>

                <strong>

                    ${project.documents.length}

                </strong>

                <small>Docs</small>

            </div>

            <div>

                <strong>

                    ${project.duration}

                </strong>

                <small>Duration</small>

            </div>

        </div>

    `;

}


/*==========================================================
    PROJECT CARD
==========================================================*/

function createProjectCard(project){

    return `

<div class="project-card">

    <div class="project-image">

        <img

            loading="lazy"

            src="${projectPath(project,project.cover)}"

            alt="${project.title}"

        >

    </div>

    <div class="project-body">

        <h3>

            ${project.title}

        </h3>

        <p>

            ${project.subtitle}

        </p>

        <div class="project-tags">

            ${createTechnologyBadges(

                project.technologies

            )}

        </div>

        ${createProjectStats(project)}

        <a

            href="project.html?id=${project.id}"

            class="btn-primary"

        >

            View Case Study

        </a>

    </div>

</div>

`;

}


/*==========================================================
    FEATURED PROJECT
==========================================================*/

function renderFeaturedProject(){

    if(!ProjectApp.featuredProject || !DOM.featured){

        return;

    }

    const project = ProjectApp.featuredProject;

    DOM.featured.innerHTML =

`

<div class="featured-project">

<div class="featured-image">

<img

src="${projectPath(project,project.hero)}"

alt="${project.title}"

>

</div>

<div class="featured-content">

<span class="badge">

Featured Project

</span>

<h2>

${project.title}

</h2>

<h3>

${project.subtitle}

</h3>

<p>

${project.description}

</p>

<div class="project-tags">

${createTechnologyBadges(

project.technologies

)}

</div>

${createProjectStats(project)}

<a

href="project.html?id=${project.id}"

class="btn-primary"

>

Explore Project

</a>

</div>

</div>

`;

}



/*==========================================================
    EMPTY
==========================================================*/

function renderEmpty(){

    DOM.grid.innerHTML =

`

<div class="empty-projects">

<i class="fa-solid fa-folder-open"></i>

<h2>

No Projects Found

</h2>

<p>

Try another keyword or category.

</p>

</div>

`;

}


/*==========================================================
    PROJECT GRID
==========================================================*/

function renderProjects(){

    Helpers.clear(DOM.grid);

    if(

        ProjectApp.filteredProjects.length===0

    ){

        renderEmpty();

        return;

    }

    const visible =

        ProjectApp.filteredProjects.slice(

            0,

            ProjectApp.visibleProjects

        );

    visible.forEach(project=>{

        DOM.grid.insertAdjacentHTML(

            "beforeend",

            createProjectCard(project)

        );

    });

    updateLoadMore();

}


/*==========================================================
    LOAD MORE
==========================================================*/

function updateLoadMore(){

    if(

        ProjectApp.filteredProjects.length

        <=

        ProjectApp.visibleProjects

    ){

        DOM.loadMore.style.display="none";

    }

    else{

        DOM.loadMore.style.display="inline-flex";

    }

}

DOM.loadMore.addEventListener(

"click",

()=>{

ProjectApp.visibleProjects+=6;

renderProjects();

}

);


function updateProjects(){

    ProjectApp.visibleProjects =

        CONFIG.DEFAULT_VISIBLE;

    filterProjects();

    sortProjects();

    renderFeaturedProject();

    renderProjects();

}



/*==========================================================
    IMAGE FALLBACK
==========================================================*/

document.addEventListener(

"error",

(event)=>{

    if(

        event.target.tagName==="IMG"

    ){

        event.target.src=

        "assets/images/project-placeholder.webp";

    }

},

true

);




