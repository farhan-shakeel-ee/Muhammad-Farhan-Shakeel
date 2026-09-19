"use strict";

// Start data and image requests from the head, before page rendering scripts run.
(() => {
    const requests = new Map();
    window.portfolioData = path => {
        if (!requests.has(path)) {
            requests.set(path, fetch(path).then(response => {
                if (!response.ok) throw new Error(`Unable to load ${path}`);
                return response.json();
            }));
        }
        return requests.get(path);
    };
    const preload = source => {
        if (!source) return;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = source;
        link.fetchPriority = "high";
        document.head.appendChild(link);
    };
    const page = location.pathname.split("/").pop();
    const id = new URLSearchParams(location.search).get("id");
    const warm = async () => {
        if (page === "article.html" || page === "research-paper.html") {
            const source = page === "article.html" ? "articles" : "research";
            const items = await window.portfolioData(`assets/data/${source}.json`);
            const item = items.find(item => item.id === id) || items[0];
            preload(item?.images?.[0]);
        } else if (page === "project.html" && id) {
            const project = await window.portfolioData(`assets/projects/${id}/data.json?v=20260918`);
            preload(`assets/projects/${id}/${project.hero}`);
        } else if (page === "projects.html") {
            const list = await window.portfolioData("assets/data/projects.json");
            await Promise.all(list.projects.map(async ({ folder }, index) => {
                const project = await window.portfolioData(`assets/projects/${folder}/data.json`);
                if (project.featured || index < 2) preload(`assets/projects/${folder}/${project.cover}`);
            }));
        }
    };
    warm().catch(() => {}); // The page renderer handles data errors.
})();
