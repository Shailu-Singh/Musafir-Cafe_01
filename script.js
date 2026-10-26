
/* MUSAFIR CAFE — Responsive Review Slider + GSAP Animations */

(() => {
    "use strict";

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mobile navigation
    const nav = document.querySelector("nav");
    const navList = nav?.querySelector("ul");

    if (nav && navList && !nav.querySelector(".menu-toggle")) {
        const toggle = document.createElement("button");

        toggle.className = "menu-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Open navigation menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "musafir-navigation");
        toggle.innerHTML = "<span></span><span></span>";

        navList.id = "musafir-navigation";
        nav.insertBefore(toggle, navList);

        const closeMenu = () => {
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
            navList.classList.remove("is-open");
        };

        toggle.addEventListener("click", () => {
            const isOpen =
                toggle.getAttribute("aria-expanded") === "true";

            toggle.setAttribute("aria-expanded", String(!isOpen));
            toggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation menu" : "Close navigation menu"
            );

            navList.classList.toggle("is-open", !isOpen);
        });

        navList.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", event => {
            if (!nav.contains(event.target)) closeMenu();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) closeMenu();
        });
    }

    // Responsive testimonial slider
    const track = document.querySelector(".review-track");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const slider = document.querySelector(".review-slider");
    const cards = track
        ? Array.from(track.querySelectorAll(".review-card"))
        : [];

    let currentIndex = 0;
    let autoplayId = null;

    function visibleCards() {
        if (window.innerWidth <= 540) return 1;
        if (window.innerWidth <= 780) return 2;
        return 3;
    }

    function maxIndex() {
        return Math.max(0, cards.length - visibleCards());
    }

    function moveSlider() {
        if (!track || !cards.length) return;

        currentIndex = Math.min(currentIndex, maxIndex());

        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 20;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const distance = currentIndex * (cardWidth + gap);

        track.style.transform =
            `translate3d(-${distance}px, 0, 0)`;
    }

    function nextReview() {
        if (!cards.length) return;

        currentIndex =
            currentIndex >= maxIndex() ? 0 : currentIndex + 1;

        moveSlider();
    }

    function previousReview() {
        if (!cards.length) return;

        currentIndex =
            currentIndex <= 0 ? maxIndex() : currentIndex - 1;

        moveSlider();
    }

    function stopAutoplay() {
        if (autoplayId !== null) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();

        if (!reduceMotion && cards.length > visibleCards()) {
            autoplayId = setInterval(nextReview, 4000);
        }
    }

    function restartAutoplay() {
        startAutoplay();
    }

    if (track && cards.length) {
        nextBtn?.addEventListener("click", () => {
            nextReview();
            restartAutoplay();
        });

        prevBtn?.addEventListener("click", () => {
            previousReview();
            restartAutoplay();
        });

        slider?.addEventListener("mouseenter", stopAutoplay);
        slider?.addEventListener("mouseleave", startAutoplay);
        slider?.addEventListener("focusin", stopAutoplay);
        slider?.addEventListener("focusout", startAutoplay);

        window.addEventListener("resize", () => {
            currentIndex = Math.min(currentIndex, maxIndex());
            moveSlider();
            startAutoplay();
        });

        moveSlider();
        startAutoplay();
    }

    // Lazy-load existing images without changing their paths
    document.querySelectorAll(
        ".about-image img, .menu-card img, " +
        ".reservation-content img, .review-card img"
    ).forEach(img => {
        if (!img.hasAttribute("loading")) img.loading = "lazy";
        if (!img.hasAttribute("decoding")) img.decoding = "async";
    });

    // GSAP + ScrollTrigger animations
    function initAnimations() {
        if (
            reduceMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const heroContent = document.querySelector(".hero-content");
        const heroImage = document.querySelector(".hero-image");

        if (heroContent) {
            gsap.from(Array.from(heroContent.children), {
                y: 28,
                opacity: 0,
                duration: 0.85,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.12
            });
        }

        if (heroImage) {
            gsap.from(heroImage, {
                x: 35,
                opacity: 0,
                scale: 0.97,
                duration: 1,
                ease: "power3.out",
                delay: 0.2
            });
        }

        const revealSelectors = [
            ".about-image",
            ".about-content",
            ".menu-heading",
            ".reservation-content .left-side",
            ".reservation-content > .reservation",
            ".contact-content",
            ".footer-container > div"
        ];

        revealSelectors.forEach(selector => {
            gsap.utils.toArray(selector).forEach(element => {
                gsap.from(element, {
                    y: 32,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 88%",
                        once: true
                    }
                });
            });
        });

        gsap.utils.toArray(".menu-card").forEach((card, index) => {
            gsap.from(card, {
                y: 35,
                opacity: 0,
                duration: 0.7,
                delay: (index % 3) * 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 92%",
                    once: true
                }
            });
        });

        gsap.utils.toArray(".review-card").forEach((card, index) => {
            gsap.from(card, {
                y: 24,
                opacity: 0,
                duration: 0.65,
                delay: (index % 3) * 0.07,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".review-slider",
                    start: "top 88%",
                    once: true
                }
            });
        });

        if (window.matchMedia("(min-width: 900px)").matches) {
            gsap.to(".hero-image img", {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.6
                }
            });
        }

        window.addEventListener(
            "load",
            () => ScrollTrigger.refresh(),
            { once: true }
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initAnimations,
            { once: true }
        );
    } else {
        initAnimations();
    }
})();

/* ==========================================
   MUSAFIR CAFE — FORMSUBMIT AJAX
   Email + Success / Error Feedback
========================================== */

(() => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-status");
    const submitBtn = document.getElementById("contact-submit-btn");

    if (!form || !status || !submitBtn) return;
    if (form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const btnText = submitBtn.querySelector(".contact-btn-text");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        status.hidden = true;
        status.textContent = "";
        status.classList.remove("success", "error");

        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");

        if (btnText) btnText.textContent = "Sending your message...";

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Message could not be sent."
                );
            }

            status.textContent =
                "✓ Thank you! Your message has been sent successfully. We'll get back to you soon. ☕";

            status.classList.add("success");
            form.reset();

        } catch (error) {
            status.textContent =
                "Sorry, your message couldn't be sent. Please try again or email us directly.";

            status.classList.add("error");

        } finally {
            status.hidden = false;
            submitBtn.disabled = false;
            submitBtn.removeAttribute("aria-busy");

            if (btnText) btnText.textContent = "Send Message ☕";
        }
    });
})();
