"use strict";

const SITE = {
    brand: "Engr. FARHAN",
    brandMarkup: '<span class="brand-prefix">Engr.</span> FARHAN',
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
        `<li><a class="${active === href ? "active" : ""}" ${active === href ? 'aria-current="page"' : ""} href="${href}">${label}</a></li>`
    ).join("");
    const header = document.querySelector("header");
    if (!header) return;

    const nav = header.querySelector(".navbar");
    if (nav) {
        const logo = nav.querySelector(".logo");
        if (logo) logo.innerHTML = SITE.brandMarkup;
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
    closeButton?.addEventListener("click", () => App.closeMenu());
    const menuButton = document.querySelector(".menu-btn");
    if (!mobileNav || !menuButton) return;
    mobileNav.id = "mobile-navigation";
    mobileNav.setAttribute("aria-label", "Mobile navigation");
    menuButton.setAttribute("aria-controls", mobileNav.id);
    if (menuButton.tagName !== "BUTTON") {
        menuButton.setAttribute("role", "button");
        menuButton.tabIndex = 0;
        menuButton.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                App.toggleMenu();
            }
        });
    }
    App.closeMenu();
    mobileNav.addEventListener("click", event => {
        if (event.target.closest("a")) App.closeMenu();
    });
    document.addEventListener("keydown", event => {
        if (!mobileNav.classList.contains("active")) return;
        if (event.key === "Escape") App.closeMenu();
        if (event.key !== "Tab") return;
        const items = [...mobileNav.querySelectorAll("button, a[href]")];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    window.matchMedia("(min-width: 1001px)").addEventListener("change", event => {
        if (event.matches) App.closeMenu();
    });
    window.addEventListener("pageshow", () => App.closeMenu());
}

function initializeTheme() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const savedTheme = localStorage.getItem("portfolio-theme");
    // Dark is the first-visit default. A visitor's explicit choice always wins.
    if (savedTheme !== "light") document.body.classList.add("dark-mode");
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

function initializePageTransitions() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.addEventListener("click", event => {
        const link = event.target.closest("a[href]");
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target || link.hasAttribute("download")) return;

        const destination = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);
        const isSameDocument = destination.pathname === current.pathname && destination.search === current.search;
        const isInternalPage = destination.origin === current.origin && /\/(?:|[^/]+\.html)$/.test(destination.pathname);

        // Leave external links, downloads, and in-page anchors to the browser.
        if (!isInternalPage || isSameDocument || document.body.classList.contains("page-leaving")) return;

        event.preventDefault();
        document.body.classList.add("page-leaving");
        window.setTimeout(() => { window.location.href = destination.href; }, 150);
    });

    // A browser may restore the previous document from its back/forward cache.
    // In that case it also restores the temporary fade-out class, leaving the
    // page transparent until a manual refresh unless we clear it here.
    const restorePageVisibility = () => {
        document.body.classList.remove("page-leaving");
    };
    window.addEventListener("pageshow", restorePageVisibility);
    window.addEventListener("popstate", () => requestAnimationFrame(restorePageVisibility));
}

function renderFooter() {
    const footer = document.querySelector("footer") || document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
        <div class="container footer-cta">
            <div>
                <span class="footer-label">Open to collaboration</span>
                <h2>Let’s build something meaningful.</h2>
            </div>
            <a class="footer-cta-link" href="contact.html">Start a conversation <span aria-hidden="true">↗</span></a>
        </div>
        <div class="container site-footer-inner">
            <section class="footer-brand">
                <a class="footer-brand-name" href="index.html">${SITE.brandMarkup}</a>
                <p>Muhammad Farhan Shakeel — Electrical Engineer and Founder of FabSCE. Building embedded and digital systems.</p>
                <span class="footer-status"><i aria-hidden="true"></i> Available for selected projects</span>
            </section>
            <section class="footer-links">
                <span class="footer-label">Explore</span>
                <nav>${SITE.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
            </section>
            <section class="footer-expertise">
                <span class="footer-label">Focus areas</span>
                <ul><li>Embedded systems</li><li>Digital & VLSI design</li><li>IoT solutions</li><li>Applied machine learning</li></ul>
            </section>
            <section class="footer-connect">
                <span class="footer-label">Connect</span>
                <a class="footer-email" href="mailto:${SITE.contact.email}">${SITE.contact.email}</a>
                <a href="tel:${SITE.contact.phone}">${SITE.contact.phone}</a>
                <div class="footer-socials"><a href="https://www.linkedin.com/in/farhanshakeel-ee/" target="_blank" rel="noopener">LinkedIn <span>↗</span></a><a href="https://github.com/farhan-shakeel-ee" target="_blank" rel="noopener">GitHub <span>↗</span></a><a href="${SITE.contact.whatsapp}" target="_blank" rel="noopener">WhatsApp <span>↗</span></a></div>
            </section>
        </div>
        <div class="container site-footer-bottom"><span>&copy; ${new Date().getFullYear()} ${SITE.brand}</span><span>Pakistan · Engineering with intent</span></div>`;
    if (!footer.isConnected) document.body.appendChild(footer);
}

function initializeSiteShell() {
    ensureSharedTheme();
    renderNavigation();
    initializeTheme();
    initializePageTransitions();
    renderFooter();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSiteShell);
} else {
    initializeSiteShell();
}
