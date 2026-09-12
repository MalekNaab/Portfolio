"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const bootScreen =
    document.getElementById("boot-screen");

const bootLogo =
    document.getElementById("boot-logo");

const bootMessage =
    document.getElementById("boot-message");

const bootParticles =
    document.getElementById("boot-particles");

const ambientParticles =
    document.getElementById("ambient-particles");

const mainOS =
    document.getElementById("main-os");

const navButtons =
    document.querySelectorAll(".nav-btn");

const pages =
    document.querySelectorAll(".page");

const clock =
    document.getElementById("clock");

const returnBootButton =
    document.getElementById("return-boot");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const projectCards =
    document.querySelectorAll(".project-card");

const openPageButtons =
    document.querySelectorAll("[data-open-page]");

const contactForm =
    document.getElementById("contact-form");

const formStatus =
    document.getElementById("form-status");


let hasBooted =
    false;


let currentPageIndex =
    0;



/* =========================================================
   PARTICLES
========================================================= */

function createBootParticles() {

    if (!bootParticles) {
        return;
    }


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.classList.add(
            "boot-particle"
        );


        const size =
            Math.random() * 3 + 1;


        particle.style.width =
            `${size}px`;


        particle.style.height =
            `${size}px`;


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.animationDuration =
            `${Math.random() * 10 + 7}s`;


        particle.style.animationDelay =
            `${Math.random() * -15}s`;


        bootParticles.appendChild(
            particle
        );

    }

}



function createAmbientParticles() {

    if (!ambientParticles) {
        return;
    }


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.classList.add(
            "ambient-particle"
        );


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.animationDuration =
            `${Math.random() * 15 + 12}s`;


        particle.style.animationDelay =
            `${Math.random() * -20}s`;


        ambientParticles.appendChild(
            particle
        );

    }

}



/* =========================================================
   BOOT
========================================================= */

function bootSystem() {

    if (hasBooted) {
        return;
    }


    hasBooted =
        true;


    if (bootScreen) {

        bootScreen.style.opacity =
            "0";


        bootScreen.style.transition =
            "opacity 0.5s ease";

    }


    setTimeout(
        function () {

            if (bootScreen) {

                bootScreen.classList.add(
                    "hidden"
                );

            }


            if (mainOS) {

                mainOS.classList.remove(
                    "hidden"
                );

            }


            openPage(
                "home"
            );

        },
        500
    );

}



if (bootLogo) {

    bootLogo.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            bootSystem();

        }
    );

}



if (bootScreen) {

    bootScreen.addEventListener(
        "click",
        bootSystem
    );

}



/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageID) {

    const targetPage =
        document.getElementById(
            pageID
        );


    if (!targetPage) {
        return;
    }


    pages.forEach(
        function (page) {

            page.classList.remove(
                "active-page"
            );

        }
    );


    targetPage.classList.add(
        "active-page"
    );


    navButtons.forEach(
        function (
            button,
            index
        ) {

            const active =
                button.dataset.page ===
                pageID;


            button.classList.toggle(
                "active",
                active
            );


            if (active) {

                currentPageIndex =
                    index;

            }

        }
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================================
   NAV BUTTONS
========================================================= */

navButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const page =
                    button.dataset.page;


                if (page) {

                    openPage(
                        page
                    );

                }

            }
        );

    }
);



openPageButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const page =
                    button.dataset.openPage;


                if (page) {

                    openPage(
                        page
                    );

                }

            }
        );

    }
);



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {


        if (
            bootScreen &&
            !bootScreen.classList.contains(
                "hidden"
            )
        ) {

            bootSystem();

            return;

        }


        if (
            !mainOS ||
            mainOS.classList.contains(
                "hidden"
            )
        ) {

            return;

        }


        const activeElement =
            document.activeElement;


        if (
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA"
            )
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();


            currentPageIndex =
                (
                    currentPageIndex +
                    1
                ) %
                navButtons.length;


            const button =
                navButtons[
                    currentPageIndex
                ];


            if (button) {

                openPage(
                    button.dataset.page
                );

            }

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();


            currentPageIndex =
                (
                    currentPageIndex -
                    1 +
                    navButtons.length
                ) %
                navButtons.length;


            const button =
                navButtons[
                    currentPageIndex
                ];


            if (button) {

                openPage(
                    button.dataset.page
                );

            }

        }


        if (
            event.key ===
            "Escape"
        ) {

            event.preventDefault();

            openPage(
                "home"
            );

        }

    }
);



/* =========================================================
   PROJECT FILTERS
========================================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const filter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                projectCards.forEach(
                    function (project) {

                        const category =
                            project.dataset.category;


                        const show =
                            filter === "all" ||
                            category === filter;


                        project.classList.toggle(
                            "hide-project",
                            !show
                        );

                    }
                );

            }
        );

    }
);



/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonialCards =
    document.querySelectorAll(
        ".testimonial-card"
    );


const feedbackPrevious =
    document.getElementById(
        "feedback-prev"
    );


const feedbackNext =
    document.getElementById(
        "feedback-next"
    );


const feedbackCurrent =
    document.getElementById(
        "feedback-current"
    );


const feedbackTotal =
    document.getElementById(
        "feedback-total"
    );


let currentFeedback =
    0;



if (feedbackTotal) {

    feedbackTotal.textContent =
        String(
            testimonialCards.length
        ).padStart(
            2,
            "0"
        );

}



function showFeedback(index) {

    if (!testimonialCards.length) {
        return;
    }


    if (index < 0) {

        index =
            testimonialCards.length - 1;

    }


    if (
        index >=
        testimonialCards.length
    ) {

        index =
            0;

    }


    currentFeedback =
        index;


    testimonialCards.forEach(
        function (
            card,
            cardIndex
        ) {

            card.classList.toggle(
                "active",
                cardIndex ===
                currentFeedback
            );

        }
    );


    if (feedbackCurrent) {

        feedbackCurrent.textContent =
            String(
                currentFeedback + 1
            ).padStart(
                2,
                "0"
            );

    }

}



if (feedbackPrevious) {

    feedbackPrevious.addEventListener(
        "click",
        function () {

            showFeedback(
                currentFeedback - 1
            );

        }
    );

}



if (feedbackNext) {

    feedbackNext.addEventListener(
        "click",
        function () {

            showFeedback(
                currentFeedback + 1
            );

        }
    );

}



showFeedback(
    0
);



/* =========================================================
   MMA
========================================================= */

const mmaSlides =
    document.querySelectorAll(
        ".mma-slide"
    );


const mmaPrevious =
    document.getElementById(
        "mma-prev"
    );


const mmaNext =
    document.getElementById(
        "mma-next"
    );


const mmaCurrent =
    document.getElementById(
        "mma-current"
    );


let currentMMASlide =
    0;



function showMMASlide(index) {

    if (!mmaSlides.length) {
        return;
    }


    if (index < 0) {

        index =
            mmaSlides.length - 1;

    }


    if (
        index >=
        mmaSlides.length
    ) {

        index =
            0;

    }


    currentMMASlide =
        index;


    mmaSlides.forEach(
        function (
            slide,
            slideIndex
        ) {

            slide.classList.toggle(
                "active",
                slideIndex ===
                currentMMASlide
            );

        }
    );


    if (mmaCurrent) {

        mmaCurrent.textContent =
            String(
                currentMMASlide + 1
            ).padStart(
                2,
                "0"
            );

    }

}



if (mmaPrevious) {

    mmaPrevious.addEventListener(
        "click",
        function () {

            showMMASlide(
                currentMMASlide - 1
            );

        }
    );

}



if (mmaNext) {

    mmaNext.addEventListener(
        "click",
        function () {

            showMMASlide(
                currentMMASlide + 1
            );

        }
    );

}



showMMASlide(
    0
);



/* =========================================================
   EXPERIENCE DROPDOWNS
========================================================= */

const experienceDropdowns =
    document.querySelectorAll(
        ".experience-dropdown"
    );


experienceDropdowns.forEach(
    function (dropdown) {

        const header =
            dropdown.querySelector(
                ".experience-header"
            );


        const toggleText =
            dropdown.querySelector(
                ".experience-toggle span"
            );


        if (!header) {
            return;
        }


        header.addEventListener(
            "click",
            function () {

                const isOpen =
                    dropdown.classList.contains(
                        "open"
                    );


                experienceDropdowns.forEach(
                    function (item) {

                        item.classList.remove(
                            "open"
                        );


                        const itemHeader =
                            item.querySelector(
                                ".experience-header"
                            );


                        const itemText =
                            item.querySelector(
                                ".experience-toggle span"
                            );


                        if (itemHeader) {

                            itemHeader.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }


                        if (itemText) {

                            itemText.textContent =
                                "VIEW DETAILS";

                        }

                    }
                );


                if (!isOpen) {

                    dropdown.classList.add(
                        "open"
                    );


                    header.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                    if (toggleText) {

                        toggleText.textContent =
                            "CLOSE DETAILS";

                    }

                }

            }
        );

    }
);



/* =========================================================
   SERVICE DROPDOWNS
========================================================= */

const serviceDropdowns =
    document.querySelectorAll(
        ".service-dropdown"
    );


serviceDropdowns.forEach(
    function (dropdown) {

        const header =
            dropdown.querySelector(
                ".service-header"
            );


        const toggleText =
            dropdown.querySelector(
                ".service-toggle span"
            );


        if (!header) {
            return;
        }


        header.addEventListener(
            "click",
            function () {

                const isOpen =
                    dropdown.classList.contains(
                        "open"
                    );


                serviceDropdowns.forEach(
                    function (item) {

                        item.classList.remove(
                            "open"
                        );


                        const itemHeader =
                            item.querySelector(
                                ".service-header"
                            );


                        const itemText =
                            item.querySelector(
                                ".service-toggle span"
                            );


                        if (itemHeader) {

                            itemHeader.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }


                        if (itemText) {

                            itemText.textContent =
                                "VIEW SERVICE";

                        }

                    }
                );


                if (!isOpen) {

                    dropdown.classList.add(
                        "open"
                    );


                    header.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                    if (toggleText) {

                        toggleText.textContent =
                            "CLOSE SERVICE";

                    }

                }

            }
        );

    }
);



/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    if (!clock) {
        return;
    }


    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    clock.textContent =
        `${hours}:${minutes}`;

}



updateClock();


setInterval(
    updateClock,
    30000
);



/* =========================================================
   CONTACT
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const submitButton =
                contactForm.querySelector(".send-btn");

            if (formStatus) {
                formStatus.textContent =
                    "Sending message...";
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.opacity = "0.6";
                submitButton.style.cursor = "not-allowed";
            }

            try {

                const formData =
                    new FormData(contactForm);

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                if (data.success) {

                    if (formStatus) {
                        formStatus.textContent =
                            "Message sent successfully.";
                    }

                    contactForm.reset();

                }
                else {

                    if (formStatus) {
                        formStatus.textContent =
                            "Message could not be sent. Please try again.";
                    }

                }

            }
            catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );

                if (formStatus) {
                    formStatus.textContent =
                        "Something went wrong. Please try again.";
                }

            }
            finally {

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.style.opacity = "1";
                    submitButton.style.cursor = "pointer";
                }

            }

        }
    );

}

/* =========================================================
   RETURN TO BOOT
========================================================= */

if (returnBootButton) {

    returnBootButton.addEventListener(
        "click",
        function () {

            if (mainOS) {

                mainOS.classList.add(
                    "hidden"
                );

            }


            if (bootScreen) {

                bootScreen.classList.remove(
                    "hidden"
                );


                bootScreen.style.opacity =
                    "1";

            }


            if (bootMessage) {

                bootMessage.textContent =
                    "Click or press any button to continue";

            }


            hasBooted =
                false;


            openPage(
                "home"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}



/* =========================================================
   EMPTY LINKS
========================================================= */

document
    .querySelectorAll(
        'a[href="#"]'
    )
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                }
            );

        }
    );



/* =========================================================
   START
========================================================= */

createBootParticles();

createAmbientParticles();

openPage(
    "home"
);
