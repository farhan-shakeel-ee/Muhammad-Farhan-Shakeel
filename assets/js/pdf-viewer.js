"use strict";

const params = new URLSearchParams(window.location.search);
const pdfFile = params.get("file");
const backTarget = params.get("back");
const pdfFrame = document.querySelector("#pdfFrame");
const pdfBack = document.querySelector("#pdfBack");
const pdfThemeToggle = document.querySelector("#pdfThemeToggle");

if (pdfFile) pdfFrame.src = pdfFile;
if (backTarget) pdfBack.href = backTarget;

// app.js loads the shared site script asynchronously, so establish the same
// first-visit default here before this page's dedicated toggle is rendered.
if (localStorage.getItem("portfolio-theme") !== "light") {
    document.body.classList.add("dark-mode");
}

function updatePdfThemeToggle() {
    const dark = document.body.classList.contains("dark-mode");
    pdfThemeToggle.setAttribute("aria-pressed", String(dark));
    pdfThemeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    pdfThemeToggle.textContent = dark ? "☀" : "☾";
}

pdfThemeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("portfolio-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updatePdfThemeToggle();
});

updatePdfThemeToggle();
