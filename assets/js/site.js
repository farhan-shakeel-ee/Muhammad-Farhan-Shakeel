"use strict";

const SITE = {
    brand: "Engr. FARHAN",
    resume: "assets/resume/resume.pdf",
    links: [
        ["Home", "index.html"],
        ["About", "about.html"],
        ["Projects", "projects.html"],
        ["Skills", "skills.html"],
        ["Research", "research.html"],
        ["Articles", "articles.html"],
        ["Contact", "contact.html"]
    ],
    contact: {
        email: "sufyanali69941@gmail.com",
        phone: "+923404182102",
        whatsapp: "https://wa.me/923404182102"
    }
};

function currentPage() {
    const file = window.location.pathname.split("/").pop() || "index.html";
    return file === "" ? "index.html" : file;
}

function ensureSharedTheme() {
    if (document.querySelector('link[href$="reference-theme.css"]')) return;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/reference-theme.css";
    document.head.appendChild(stylesheet);
}

function renderNavigation() {
    const active = currentPage();
    const links = SITE.links.map(([label, href]) =>
        `<li><a class="${active === href ? "active" : ""}" href="${href}">${label}</a></li>`
    ).join("");
    const header = document.querySelector("header");
    if (!header) return;

    const nav = header.querySelector(".navbar");
    if (nav) {
        const logo = nav.querySelector(".logo");
        if (logo) logo.innerHTML = SITE.brand;
        const list = nav.querySelector(".nav-links");
        if (list) list.innerHTML = links;
        const resume = nav.querySelector(".resume-btn");
        if (resume) resume.href = SITE.resume;
        const actions = nav.querySelector(".nav-right");
        if (actions && !actions.querySelector(".theme-toggle")) {
            actions.insertAdjacentHTML("afterbegin", `<button class="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false"><span aria-hidden="true">☾</span></button>`);
        }
    }

    const mobileList = document.querySelector(".mobile-nav ul");
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav && !mobileNav.querySelector(".mobile-nav-close")) {
        mobileNav.insertAdjacentHTML("afterbegin", `<button class="mobile-nav-close" type="button" aria-label="Close navigation menu">&times;</button>`);
    }
    if (mobileList) mobileList.innerHTML = links;
    const closeButton = mobileNav?.querySelector(".mobile-nav-close");
    closeButton?.addEventListener("click", () => {
        document.querySelector(".mobile-nav")?.classList.remove("active");
        document.querySelector(".overlay")?.classList.remove("active");
    });
}

function initializeTheme() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
    document.documentElement.classList.remove("dark-mode-preload");

    const updateToggle = () => {
        const dark = document.body.classList.contains("dark-mode");
        toggle.setAttribute("aria-pressed", String(dark));
        toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        toggle.innerHTML = `<span aria-hidden="true">${dark ? "☀" : "☾"}</span>`;
    };

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("portfolio-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
        updateToggle();
    });
    updateToggle();
}

function renderFooter() {
    if (document.querySelector("footer")) return;
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <div class="container site-footer-inner">
            <div><strong>${SITE.brand}</strong><p>Electrical engineering, embedded systems, digital design, and practical software.</p></div>
            <div><span class="footer-label">Navigate</span><nav>${SITE.links.slice(0, 6).map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav></div>
            <div><span class="footer-label">Get in touch</span><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a><a href="tel:${SITE.contact.phone}">${SITE.contact.phone}</a><a href="${SITE.contact.whatsapp}">WhatsApp</a></div>
        </div>
        <div class="container site-footer-bottom">&copy; ${new Date().getFullYear()} ${SITE.brand}</div>`;
    document.body.appendChild(footer);
}

function initializeSiteShell() {
    ensureSharedTheme();
    renderNavigation();
    initializeTheme();
    renderFooter();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSiteShell);
} else {
    initializeSiteShell();
}
