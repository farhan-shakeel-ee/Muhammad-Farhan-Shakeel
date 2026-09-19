"use strict";

const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");
const articleRoot = document.querySelector("#articleRoot");

fetch("assets/data/articles.json")
    .then(response => response.json())
    .then(articles => {
        const article = articles.find(item => item.id === articleId) || articles[0];
        const images = Array.isArray(article.images) ? article.images : [];
        const body = Array.isArray(article.body) ? article.body : [];
        const bodyContent = body.map((paragraph, index) => {
            const image = images[index];
            const imageMarkup = image ? `<figure class="article-image"><img src="${image}" alt="${article.title} illustration ${index + 1}" loading="eager" decoding="sync" fetchpriority="${index === 0 ? "high" : "auto"}"></figure>` : "";
            return `<article class="article-content-block"><p>${paragraph}</p>${imageMarkup}</article>`;
        }).join("");
        const download = article.article_pdf ? `<a class="article-download" href="${article.article_pdf}" download><span aria-hidden="true">↓</span> Download PDF</a>` : "";
        document.title = `${article.title} | Farhan Portfolio`;
        articleRoot.innerHTML = `<div class="article-reader-top"><a class="article-back" href="articles.html" aria-label="Back to all articles"><span aria-hidden="true">←</span><span>All articles</span></a>${download}</div><div class="article-meta"><span>${article.category}</span><span>${article.readTime}</span></div><h1>${article.title}</h1><p class="article-byline">${article.readTime}</p><div class="article-summary"><span>Article summary</span><p>${article.summary}</p></div><div class="article-body article-content-list">${bodyContent}</div>`;
    })
    .catch(() => { articleRoot.innerHTML = `<p class="article-empty">This article could not be loaded.</p>`; });
