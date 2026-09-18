"use strict";

const articleGrid = document.querySelector("#articleGrid");
const articleSearch = document.querySelector("#articleSearch");
let articles = [];
let activeCategory = "all";

function articleCard(article) {
    const url = `article.html?id=${encodeURIComponent(article.id)}`;
    return `<article class="article-card" tabindex="0" role="link" data-article-url="${url}"><div class="article-meta"><span>${article.category}</span><span>${article.readTime}</span></div><h3>${article.title}</h3><p>${article.summary}</p><a class="article-link" href="${url}">Read article <span aria-hidden="true">&rarr;</span></a></article>`;
}

function renderArticles() {
    const query = articleSearch.value.trim().toLowerCase();
    const visible = articles.filter(article => {
        const matchesCategory = activeCategory === "all" || article.category === activeCategory;
        const text = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
        return matchesCategory && text.includes(query);
    });
    articleGrid.innerHTML = visible.length ? visible.map(articleCard).join("") : `<p class="article-empty">No articles match that search.</p>`;
    articleGrid.querySelectorAll("[data-article-url]").forEach(card => {
        card.addEventListener("click", event => {
            if (event.target.closest("a")) return;
            window.location.href = card.dataset.articleUrl;
        });
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = card.dataset.articleUrl;
            }
        });
    });
}

async function loadArticles() {
    articles = await fetch("assets/data/articles.json").then(response => response.json());
    const categories = [...new Set(articles.map(article => article.category))];
    document.querySelector("#articleFilters").insertAdjacentHTML("beforeend", categories.map(category => `<button type="button" data-article-filter="${category}">${category}</button>`).join(""));
    document.querySelectorAll("[data-article-filter]").forEach(button => button.addEventListener("click", () => {
        const articleFilters = document.querySelectorAll("[data-article-filter]");
        articleFilters.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.articleFilter;
        renderArticles();
    }));
    renderArticles();
}

articleSearch.addEventListener("input", renderArticles);
loadArticles().catch(() => { articleGrid.innerHTML = `<p class="article-empty">Articles are temporarily unavailable.</p>`; });
