"use strict";

const certificateId = new URLSearchParams(window.location.search).get("id");
const certificateRoot = document.querySelector("#certificateRoot");

fetch("assets/data/certificates.json")
    .then(response => response.json())
    .then(records => {
        const item = records.find(record => record.id === certificateId) || records[0];
        const image = item.image ? `<figure class="certificate-document-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></figure>` : "";
        const documentLink = item.document ? `<a class="article-download" href="${item.document}" target="_blank" rel="noopener"><span aria-hidden="true">↓</span> Open Document</a>` : `<span class="article-download article-download-disabled">Document unavailable</span>`;
        document.title = `${item.title} | Farhan Portfolio`;
        certificateRoot.innerHTML = `
            <div class="article-reader-top">
                <a class="article-back" href="index.html#certificates" aria-label="Back to certificates"><span aria-hidden="true">←</span><span>Certificates</span></a>
                ${documentLink}
            </div>
            <div class="article-meta"><span>${item.type}</span><span>${item.date}</span></div>
            <h1>${item.title}</h1>
            <p class="certificate-detail-issuer">${item.issuer}</p>
            <div class="article-summary"><p>${item.summary}</p></div>
            <div class="article-body certificate-detail-body">
                ${image}
                <h2>Details</h2>
                ${item.details.map(detail => `<p>${detail}</p>`).join("")}
                <h2>Skills and Areas</h2>
                <div class="certificate-skills">${item.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
            </div>`;
    })
    .catch(() => {
        certificateRoot.innerHTML = `<p class="article-empty">This certificate could not be loaded.</p>`;
    });
