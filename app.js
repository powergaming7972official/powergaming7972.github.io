"use strict";

/* ===========================
   Utilities
=========================== */

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

/* ===========================
   Loader
=========================== */

const initLoader = () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  window.addEventListener("load", () => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  });
};

/* ===========================
   Mobile Menu
=========================== */

const initMobileMenu = () => {
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav-links");

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
};

/* ===========================
   Scroll Progress Bar
=========================== */

const updateScrollProgress = () => {
  const progressBar = document.getElementById("progress-bar");

  if (!progressBar) return;

  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const scrolled = scrollHeight > 0 ? (getScrollTop() / scrollHeight) * 100 : 0;

  progressBar.style.width = `${scrolled}%`;
};

/* ===========================
   Back To Top
=========================== */

const initBackToTop = () => {
  const topBtn = document.getElementById("topBtn");

  if (!topBtn) return;

  const updateBackToTopButton = () => {
    topBtn.classList.toggle("active", getScrollTop() > 400);
  };

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  updateBackToTopButton();

  window.addEventListener(
    "scroll",
    () => {
      updateBackToTopButton();
    },
    { passive: true }
  );
};

/* ===========================
   Counter Animation
=========================== */

const animateCounter = (counter) => {
  if (!counter || counter.dataset.animated === "true") return;

  const target = Number(counter.dataset.target);

  if (!Number.isFinite(target)) return;

  counter.dataset.animated = "true";

  if (prefersReducedMotion) {
    counter.innerText = target.toLocaleString();
    return;
  }

  const duration = 1600;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);

    counter.innerText = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };

  requestAnimationFrame(update);
};

/* ===========================
   Scroll Reveal
=========================== */

const initIntersectionFeatures = () => {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");

  if (!revealElements.length && !counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        if (element.classList.contains("reveal")) {
          element.classList.add("show");
        }

        if (element.classList.contains("counter")) {
          animateCounter(element);
          observer.unobserve(element);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
  counters.forEach((counter) => observer.observe(counter));
};

/* ===========================
   FAQ
=========================== */

const initFAQ = () => {
  const questions = document.querySelectorAll(".faq-question");

  if (!questions.length) return;

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;

      if (!answer) return;

      answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
  });
};

/* ===========================
   Image Lightbox
=========================== */

const initImageLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeLightbox = document.getElementById("close-lightbox");
  const images = document.querySelectorAll("img");

  if (!lightbox || !lightboxImg || !images.length) return;

  const openLightbox = (img) => {
    if (!img || !img.src) return;

    lightbox.classList.add("active");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  };

  const close = () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  };

  images.forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  on(closeLightbox, "click", close);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      close();
    }
  });
};

/* ===========================
   Utilities
=========================== */

const initScrollUtilities = () => {
  updateScrollProgress();

  window.addEventListener(
    "scroll",
    () => {
      updateScrollProgress();
    },
    { passive: true }
  );
};

const initApp = () => {
  initLoader();
  initMobileMenu();
  initBackToTop();
  initIntersectionFeatures();
  initFAQ();
  initImageLightbox();
  initScrollUtilities();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}