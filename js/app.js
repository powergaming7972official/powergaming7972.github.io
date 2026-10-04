"use strict";

/* =========================================================
   POWER GAMING 7972
   Main Website JavaScript
========================================================= */

/* =========================
   Utilities
========================= */

const on = (element, event, handler, options) => {
    if (element) {
        element.addEventListener(event, handler, options);
    }
};

const getScrollTop = () =>
    window.scrollY || document.documentElement.scrollTop || 0;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================
   Loader
========================= */

const initLoader = () => {
    const loader = document.getElementById("loader");

    if (!loader) return;

    const hideLoader = () => {
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    };

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, {
            once: true
        });
    }
};


/* =========================
   Mobile Menu
========================= */

const initMobileMenu = () => {
    const menuBtn =
        document.querySelector(".menu-btn") ||
        document.getElementById("menuBtn");

    const nav =
        document.querySelector(".nav-links") ||
        document.getElementById("navLinks");

    if (!menuBtn || !nav) return;

    const setMenuState = (open) => {
        nav.classList.toggle("active", open);
        nav.classList.toggle("show", open);

        menuBtn.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuBtn.setAttribute(
            "aria-label",
            open
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !open);
            icon.classList.toggle("fa-xmark", open);
        }
    };

    on(menuBtn, "click", (event) => {
        event.preventDefault();

        const isOpen =
            nav.classList.contains("active");

        setMenuState(!isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
        on(link, "click", () => {
            setMenuState(false);
        });
    });

    on(document, "keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    setMenuState(false);
};


/* =========================
   Scroll Progress Bar
========================= */

const updateScrollProgress = () => {
    const progressBar =
        document.getElementById("progress-bar");

    if (!progressBar) return;

    const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (scrollHeight <= 0) {
        progressBar.style.width = "0%";
        return;
    }

    const scrolled =
        (getScrollTop() / scrollHeight) * 100;

    progressBar.style.width =
        `${Math.min(Math.max(scrolled, 0), 100)}%`;
};

const initScrollUtilities = () => {
    updateScrollProgress();

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateScrollProgress,
        { passive: true }
    );
};


/* =========================
   BACK TO TOP
========================= */

const initBackToTop = () => {
    const topBtn =
        document.getElementById("topBtn");

    if (!topBtn) return;

    const updateButton = () => {
        if (getScrollTop() > 400) {
            topBtn.classList.add("show");
            topBtn.classList.add("active");
        } else {
            topBtn.classList.remove("show");
            topBtn.classList.remove("active");
        }
    };

    on(topBtn, "click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion
                ? "auto"
                : "smooth"
        });
    });

    updateButton();

    window.addEventListener(
        "scroll",
        updateButton,
        { passive: true }
    );
};


/* =========================
   Counter Animation
========================= */

const animateCounter = (counter) => {
    if (!counter) return;

    if (counter.dataset.animated === "true") {
        return;
    }

    const target =
        Number(counter.dataset.target);

    if (!Number.isFinite(target)) {
        return;
    }

    counter.dataset.animated = "true";

    if (prefersReducedMotion) {
        counter.innerText =
            target.toLocaleString();

        return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        const value =
            Math.floor(progress * target);

        counter.innerText =
            value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText =
                target.toLocaleString();
        }
    };

    requestAnimationFrame(update);
};


/* =========================
   Scroll Reveal + Counters
========================= */

const initIntersectionFeatures = () => {
    const revealElements =
        document.querySelectorAll(".reveal");

    const counters =
        document.querySelectorAll(".counter");

    if (
        !revealElements.length &&
        !counters.length
    ) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });

        counters.forEach(animateCounter);

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const element =
                        entry.target;

                    if (
                        element.classList.contains(
                            "reveal"
                        )
                    ) {
                        element.classList.add(
                            "show"
                        );
                    }

                    if (
                        element.classList.contains(
                            "counter"
                        )
                    ) {
                        animateCounter(element);
                        obs.unobserve(element);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

    revealElements.forEach((element) => {
        observer.observe(element);
    });

    counters.forEach((counter) => {
        observer.observe(counter);
    });
};


/* =========================
   FAQ
========================= */

const initFAQ = () => {
    const questions =
        document.querySelectorAll(
            ".faq-question"
        );

    if (!questions.length) return;

    questions.forEach((button) => {
        on(button, "click", () => {
            const item =
                button.closest(".faq-item");

            const answer =
                button.nextElementSibling;

            if (!answer) return;

            const isOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";

            questions.forEach((otherButton) => {
                if (otherButton === button) return;

                const otherItem =
                    otherButton.closest(
                        ".faq-item"
                    );

                const otherAnswer =
                    otherButton.nextElementSibling;

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (otherItem) {
                    otherItem.classList.remove(
                        "active"
                    );
                }

                if (otherAnswer) {
                    otherAnswer.style.display =
                        "none";
                }
            });

            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            if (item) {
                item.classList.toggle(
                    "active",
                    !isOpen
                );
            }

            answer.style.display =
                !isOpen ? "block" : "none";
        });
    });
};


/* =========================
   Image Lightbox
========================= */

const initImageLightbox = () => {
    const lightbox =
        document.getElementById("lightbox");

    const lightboxImg =
        document.getElementById("lightbox-img");

    const closeLightbox =
        document.getElementById(
            "close-lightbox"
        );

    const galleryButtons =
        document.querySelectorAll(
            ".gallery-button"
        );

    if (
        !lightbox ||
        !lightboxImg ||
        !galleryButtons.length
    ) {
        return;
    }

    const openLightbox = (img) => {
        if (!img || !img.src) return;

        lightboxImg.src = img.src;

        lightboxImg.alt =
            img.alt ||
            "Power Gaming 7972";

        lightbox.hidden = false;

        requestAnimationFrame(() => {
            lightbox.classList.add(
                "active"
            );
        });

        document.body.classList.add(
            "lightbox-open"
        );
    };

    const close = () => {
        lightbox.classList.remove(
            "active"
        );

        setTimeout(() => {
            lightbox.hidden = true;
            lightboxImg.src = "";
            lightboxImg.alt = "";
        }, prefersReducedMotion ? 0 : 200);

        document.body.classList.remove(
            "lightbox-open"
        );
    };

    galleryButtons.forEach((button) => {
        on(button, "click", () => {
            const img =
                button.querySelector("img");

            if (img) {
                openLightbox(img);
            }
        });
    });

    on(
        closeLightbox,
        "click",
        close
    );

    on(lightbox, "click", (event) => {
        if (event.target === lightbox) {
            close();
        }
    });

    on(document, "keydown", (event) => {
        if (
            event.key === "Escape" &&
            !lightbox.hidden
        ) {
            close();
        }
    });
};


/* =========================
   Share Modal
========================= */

const initShareModal = () => {
    const modal =
        document.getElementById(
            "shareModal"
        );

    const closeButton =
        document.getElementById(
            "closeShare"
        );

    const copyButton =
        document.getElementById(
            "copyLink"
        );

    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );

    const telegram =
        document.getElementById(
            "telegramShare"
        );

    const facebook =
        document.getElementById(
            "facebookShare"
        );

    if (!modal) return;

    const currentUrl =
        window.location.href;

    const encodedUrl =
        encodeURIComponent(
            currentUrl
        );

    const encodedText =
        encodeURIComponent(
            document.title
        );

    if (whatsapp) {
        whatsapp.href =
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    }

    if (telegram) {
        telegram.href =
            `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    }

    if (facebook) {
        facebook.href =
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    const closeModal = () => {
        modal.hidden = true;
        modal.classList.remove(
            "active"
        );
    };

    on(
        closeButton,
        "click",
        closeModal
    );

    on(modal, "click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    on(copyButton, "click", async () => {
        try {
            await navigator.clipboard.writeText(
                currentUrl
            );
        } catch (error) {
            const textArea =
                document.createElement(
                    "textarea"
                );

            textArea.value =
                currentUrl;

            document.body.appendChild(
                textArea
            );

            textArea.select();

            document.execCommand(
                "copy"
            );

            textArea.remove();
        }

        if (copyButton) {
            copyButton.textContent =
                "Copied!";

            setTimeout(() => {
                copyButton.textContent =
                    "Copy Link";
            }, 1500);
        }
    });

    on(document, "keydown", (event) => {
        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {
            closeModal();
        }
    });
};


/* =========================
   Newsletter
========================= */

const initNewsletter = () => {
    const form =
        document.querySelector(
            ".newsletter-form"
        );

    if (!form) return;

    on(form, "submit", (event) => {
        event.preventDefault();

        const input =
            form.querySelector(
                'input[type="email"]'
            );

        if (
            !input ||
            !input.value.trim()
        ) {
            return;
        }

        input.value = "";

        const button =
            form.querySelector(
                "button"
            );

        if (button) {
            const originalText =
                button.textContent;

            button.textContent =
                "Subscribed!";

            setTimeout(() => {
                button.textContent =
                    originalText;
            }, 2000);
        }
    });
};


/* =========================
   Initialize App
========================= */

const initApp = () => {
    initLoader();
    initMobileMenu();
    initScrollUtilities();
    initBackToTop();
    initIntersectionFeatures();
    initFAQ();
    initImageLightbox();
    initShareModal();
    initNewsletter();
};


/* =========================
   Start
========================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initApp,
        { once: true }
    );
} else {
    initApp();
}