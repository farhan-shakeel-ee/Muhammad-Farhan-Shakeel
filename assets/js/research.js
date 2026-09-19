"use strict";

const researchGrid = document.querySelector("#researchGrid");

function researchCard(paper) {
    const url = `research-paper.html?id=${encodeURIComponent(paper.id)}`;
    return `<article class="research-card timeline-content glass-card" tabindex="0" role="link" data-research-url="${url}">
        <span class="timeline-date">${paper.number}</span>
        <div class="article-meta"><span>${paper.category}</span><span>${paper.date}</span></div>
        <h3>${paper.title}</h3>
        <p>${paper.summary}</p>
        <ul>${paper.keywords.map(keyword => `<li>${keyword}</li>`).join("")}</ul>
        <a class="article-link" href="${url}">Read paper <span aria-hidden="true">&rarr;</span></a>
    </article>`;
}

async function loadResearch() {
    const papers = await fetch("assets/data/research.json").then(response => response.json());
    researchGrid.innerHTML = papers.map(researchCard).join("");
    researchGrid.querySelectorAll("[data-research-url]").forEach(card => {
        card.addEventListener("click", event => {
            if (event.target.closest("a")) return;
            card.querySelector("a").click();
        });
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                card.querySelector("a").click();
            }
        });
    });
}

loadResearch().catch(() => {
    researchGrid.innerHTML = `<p class="article-empty">Research papers are temporarily unavailable.</p>`;
});
