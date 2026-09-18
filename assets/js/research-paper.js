"use strict";

const params = new URLSearchParams(window.location.search);
const researchId = params.get("id");
const paperRoot = document.querySelector("#researchPaperRoot");

function sectionMarkup(section, image) {
    const paragraphs = section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("");
    const imageMarkup = image ? `<figure class="article-image"><img src="${image}" alt="${section.heading} illustration" loading="lazy"></figure>` : "";
    return `<section class="research-section"><h2>${section.heading}</h2>${paragraphs}${imageMarkup}</section>`;
}

fetch("assets/data/research.json")
    .then(response => response.json())
    .then(papers => {
        const paper = papers.find(item => item.id === researchId) || papers[0];
        const images = Array.isArray(paper.images) ? paper.images : [];
        const sections = Array.isArray(paper.sections) ? paper.sections : [];
        const download = paper.article_pdf
            ? `<a class="article-download" href="${paper.article_pdf}" download><span aria-hidden="true">↓</span> Download Paper</a>`
            : `<span class="article-download article-download-disabled" aria-disabled="true"><span aria-hidden="true">↓</span> PDF unavailable</span>`;
        const pdfUrl = paper.article_pdf
            ? `pdf-viewer.html?file=${encodeURIComponent(paper.article_pdf)}&back=${encodeURIComponent(`research-paper.html?id=${paper.id}`)}`
            : "#paper-content";
        const readButton = `<a class="article-read-button" href="${pdfUrl}"><span aria-hidden="true">↓</span> Read Paper</a>`;

        document.title = `${paper.title} | Research | Farhan Portfolio`;
        paperRoot.innerHTML = `
            <div class="article-reader-top research-actions">
                <a class="article-back" href="research.html" aria-label="Back to all research"><span aria-hidden="true">←</span><span>All research</span></a>
                <div class="research-paper-actions">${readButton}${download}</div>
            </div>
            <div class="article-meta"><span>${paper.category}</span><span>${paper.date}</span></div>
            <h1>${paper.title}</h1>
            <p class="research-byline">${paper.authors}</p>
            <div class="article-summary"><span>Abstract</span><p>${sections[0]?.paragraphs?.[0] || paper.summary}</p></div>
            <div id="paper-content" class="article-body research-paper-body">${sections.slice(1).map((section, index) => sectionMarkup(section, images[index])).join("")}</div>`;
    })
    .catch(() => {
        paperRoot.innerHTML = `<p class="article-empty">This research paper could not be loaded.</p>`;
    });
