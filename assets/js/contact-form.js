"use strict";

const contactForm = document.querySelector(".contact-form");

contactForm?.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const topic = formData.get("topic");
    const message = formData.get("message");
    const subject = `${topic} inquiry from ${name}`;
    const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        "Project details:",
        message
    ].join("\n");

    window.location.href = `mailto:sufyanali69941@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
