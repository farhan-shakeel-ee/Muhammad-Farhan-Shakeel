"use strict";

const certificateGrid = document.querySelector("#certificateGrid");

function certificateCard(item) {
    const url = `certificate.html?id=${encodeURIComponent(item.id)}`;
    return `<article class="certificate-card" tabindex="0" role="link" data-certificate-url="${url}">
        <div class="certificate-card-top"><span class="certificate-type">${item.type}</span><span class="certificate-date">${item.date}</span></div>
        <h3>${item.title}</h3>
        <p class="certificate-issuer">${item.issuer}</p>
        <p>${item.summary}</p>
        <a class="article-link" href="${url}">View details <span aria-hidden="true">&rarr;</span></a>
    </article>`;
}

async function loadCertificates() {
    const records = await fetch("assets/data/certificates.json").then(response => response.json());
    certificateGrid.innerHTML = records.map(certificateCard).join("");
    certificateGrid.querySelectorAll("[data-certificate-url]").forEach(card => {
        card.addEventListener("click", event => {
            if (event.target.closest("a")) return;
            window.location.href = card.dataset.certificateUrl;
        });
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = card.dataset.certificateUrl;
            }
        });
    });
}

loadCertificates().catch(() => {
    certificateGrid.innerHTML = `<p class="article-empty">Certificates are temporarily unavailable.</p>`;
});
