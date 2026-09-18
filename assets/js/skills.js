"use strict";

async function loadSkills(){

    const skillsContainer = document.getElementById("skillsContainer");
    if(!skillsContainer){
        console.warn("Skills container not found: #skillsContainer");
        return;
    }

    try {
        const response = await fetch("./assets/data/skills.json");
        if(!response.ok){
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        renderSkills(data.categories, skillsContainer);
    } catch (error) {
        console.error("Failed to load skills:", error);
    }

}

function renderSkills(categories, skillsContainer){

    skillsContainer.innerHTML = "";

    categories.forEach(category=>{

        const card=document.createElement("div");

        card.className="skill-category glass-card fade-up";
        card.classList.add("show");

        card.innerHTML=`

            <div class="skill-header">

                <i class="${category.icon}"></i>

                <h3>${category.title}</h3>

            </div>

            ${category.skills.map(skill=>`

                <div class="skill">

                    <div class="skill-info">

                        <span>${skill.name}</span>

                    </div>

                    <div class="skill-bar">

                        <div
                            class="skill-progress"
                            style="width:${skill.level}%">
                        </div>

                    </div>

                </div>

            `).join("")}

        `;

        skillsContainer.appendChild(card);

    });

}

loadSkills();