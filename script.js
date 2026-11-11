"use strict";

const bootScreen = document.getElementById("boot-screen");
const mainOS = document.getElementById("main-os");
const pages = Array.from(document.querySelectorAll(".page"));
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentPage = "home";

function openPage(pageID, { updateHistory = true, moveFocus = true } = {}) {
    const target = pages.find(page => page.id === pageID);
    if (!target) return;
    currentPage = pageID;
    pages.forEach(page => page.classList.toggle("active-page", page === target));
    navButtons.forEach(button => {
        const active = button.dataset.page === pageID;
        button.classList.toggle("active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });
    const activeNav = navButtons.find(button => button.dataset.page === pageID);
    const navigation = activeNav?.parentElement;
    if (navigation && navigation.scrollWidth > navigation.clientWidth) {
        navigation.scrollTo({
            left: activeNav.offsetLeft - navigation.offsetLeft - (navigation.clientWidth - activeNav.offsetWidth) / 2,
            behavior: reducedMotion ? "instant" : "smooth"
        });
    }
    if (updateHistory && window.location.hash !== `#${pageID}`) {
        history.pushState(null, "", `#${pageID}`);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (moveFocus) {
        const heading = target.querySelector("h1");
        if (heading) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
    }
}

navButtons.forEach(button => button.addEventListener("click", () => openPage(button.dataset.page)));
document.querySelectorAll("[data-open-page]").forEach(button => {
    button.addEventListener("click", () => openPage(button.dataset.openPage));
});
function restorePage() {
    const id = window.location.hash.slice(1);
    if (id === "main-content") return;
    openPage(pages.some(page => page.id === id) ? id : "home", { updateHistory: false, moveFocus: false });
}
window.addEventListener("popstate", restorePage);
window.addEventListener("hashchange", restorePage);
restorePage();

// Restore the console welcome screen; direct section links still open their page.
function enterPortfolio() {
    bootScreen.classList.add("hidden");
    mainOS.classList.remove("hidden");
    openPage(currentPage, { updateHistory: false });
}
document.getElementById("boot-logo").addEventListener("click", event => {
    event.stopPropagation();
    enterPortfolio();
});
bootScreen.addEventListener("click", enterPortfolio);
function showBoot() {
    mainOS.classList.add("hidden");
    bootScreen.classList.remove("hidden");
    document.getElementById("boot-logo").focus();
    window.scrollTo({ top: 0, behavior: "instant" });
}
document.getElementById("return-boot").addEventListener("click", showBoot);
if (!pages.some(page => `#${page.id}` === window.location.hash)) showBoot();
document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!bootScreen.classList.contains("hidden")) {
        if (["Enter", " ", "Escape"].includes(event.key)) {
            event.preventDefault();
            enterPortfolio();
        }
        return;
    }
    const focused = document.activeElement;
    if (focused?.closest("input, textarea, select, [contenteditable='true']")) return;
    if (event.key === "Escape") {
        event.preventDefault();
        openPage("home");
        return;
    }
    // Console shortcuts work from the page and navigation without stealing
    // arrow keys from links, form controls, accordions or slideshow buttons.
    const focusedIndex = navButtons.indexOf(focused);
    const interactive = focused?.closest("a, button, summary, [role='slider']");
    if ((focusedIndex !== -1 || !interactive) && ["ArrowRight", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
        const index = focusedIndex !== -1 ? focusedIndex : navButtons.findIndex(button => button.dataset.page === currentPage);
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = navButtons[(index + direction + navButtons.length) % navButtons.length];
        openPage(next.dataset.page, { moveFocus: false });
        next.focus({ preventScroll: true });
    }
});

function createParticles(id, count, className) {
    const container = document.getElementById(id);
    if (!container || reducedMotion) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.className = className;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 15 + 12}s`;
        particle.style.animationDelay = `${Math.random() * -20}s`;
        fragment.appendChild(particle);
    }
    container.appendChild(fragment);
}
createParticles("boot-particles", 35, "boot-particle");
createParticles("ambient-particles", 20, "ambient-particle");

const filters = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-card");
filters.forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
        filters.forEach(item => {
            item.classList.toggle("active", item === button);
            item.setAttribute("aria-pressed", String(item === button));
        });
        projects.forEach(project => {
            const show = button.dataset.filter === "all" || project.dataset.category === button.dataset.filter;
            project.classList.toggle("hide-project", !show);
        });
    });
});

function setUpSlider(selector, previousID, nextID, counterID, totalID) {
    const items = Array.from(document.querySelectorAll(selector));
    if (!items.length) return;
    let index = 0;
    const counter = document.getElementById(counterID);
    const total = totalID && document.getElementById(totalID);
    if (total) total.textContent = String(items.length).padStart(2, "0");
    function show(nextIndex) {
        index = (nextIndex + items.length) % items.length;
        items.forEach((item, i) => {
            item.classList.toggle("active", i === index);
            item.setAttribute("aria-hidden", String(i !== index));
        });
        if (counter) counter.textContent = String(index + 1).padStart(2, "0");
    }
    document.getElementById(previousID)?.addEventListener("click", () => show(index - 1));
    document.getElementById(nextID)?.addEventListener("click", () => show(index + 1));
    show(0);
}
setUpSlider(".testimonial-card", "feedback-prev", "feedback-next", "feedback-current", "feedback-total");
setUpSlider(".mma-slide", "mma-prev", "mma-next", "mma-current");

function setUpAccordions(prefix, label) {
    const items = Array.from(document.querySelectorAll(`.${prefix}-dropdown`));
    items.forEach((item, index) => {
        const button = item.querySelector(`.${prefix}-header`);
        const panel = item.querySelector(`.${prefix}-details`);
        if (!button || !panel) return;
        panel.id = `${prefix}-panel-${index}`;
        button.setAttribute("aria-controls", panel.id);
        panel.setAttribute("aria-hidden", "true");
        button.addEventListener("click", () => {
            const opening = !item.classList.contains("open");
            items.forEach(other => {
                const active = opening && other === item;
                other.classList.toggle("open", active);
                other.querySelector(`.${prefix}-header`).setAttribute("aria-expanded", String(active));
                other.querySelector(`.${prefix}-details`).setAttribute("aria-hidden", String(!active));
                const text = other.querySelector(`.${prefix}-toggle span`);
                if (text) text.textContent = `${active ? "CLOSE" : "VIEW"} ${label}`;
            });
        });
    });
}
setUpAccordions("service", "SERVICE");
setUpAccordions("experience", "DETAILS");

function updateClock() {
    document.getElementById("clock").textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 30000);

// Keep the existing contact form provider and account configuration.
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
contactForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = contactForm.querySelector(".send-btn");
    if (submitButton.disabled) return;
    formStatus.textContent = "Sending your enquiry…";
    submitButton.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: new FormData(contactForm)
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error("Message delivery failed");
        formStatus.textContent = "Thanks — your enquiry has been sent. I’ll get back to you by email.";
        contactForm.reset();
    } catch (error) {
        formStatus.textContent = "Your message could not be sent. Please try again, or email maleknaab@gmail.com directly.";
    } finally {
        submitButton.disabled = false;
        contactForm.removeAttribute("aria-busy");
    }
});
