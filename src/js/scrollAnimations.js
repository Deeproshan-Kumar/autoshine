/**
 * scrollAnimations.js — premium scroll-based reveals powered by GSAP + ScrollTrigger
 *
 * Two building blocks:
 *  - revealGroup(): a simple fade/slide-up reveal for standalone elements
 *    (headings, images, timeline entries, footer columns, etc.)
 *  - waveReveal(): the signature "card wave" — cards in a row rise into place
 *    one after another. Each card only ever travels along the Y axis, but the
 *    sine-eased stagger across the row makes the cascade read as a wave.
 *
 * Selector discipline: always target by meaningful class names or IDs,
 * never by bare tag names. Where no suitable class existed, gsap- prefixed
 * classes have been added to the HTML so GSAP has an unambiguous handle.
 */

const REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// Fade + slide-up reveal, one ScrollTrigger per element so long lists (like
// the journey timeline) reveal as the viewport actually reaches each entry.
function revealGroup(selector, vars = {}) {
  const els = gsap.utils.toArray(selector);
  if (!els.length) return;

  els.forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      ...vars,
    });
  });
}

// Vertical "wave" reveal for card grids/rows.
// playOnce: set to true for Swiper wrappers (avoid re-animating cloned slides)
function waveReveal(containerSelector, itemSelector, vars = {}, playOnce = false) {
  const containers = gsap.utils.toArray(containerSelector);

  containers.forEach((container) => {
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;

    gsap.from(items, {
      y: 90,
      skewY: 8,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: {
        each: 0.14,
        from: "start",
        ease: "sine.inOut",
      },
      scrollTrigger: {
        trigger: container,
        start: "top 88%",
        // Swiper loop clones slides — don't reverse-animate them on scroll-up
        toggleActions: playOnce
          ? "play none none none"
          : "play none none reverse",
      },
      ...vars,
    });
  });
}

// Letter-by-letter wave for the "AutoShine" text-anim heading — same wave
// mechanic as the card grids, applied to individual glyphs.
function waveTextReveal(containerSelector) {
  const containers = gsap.utils.toArray(containerSelector);

  containers.forEach((container) => {
    const letters = container.querySelectorAll(":scope > span");
    if (!letters.length) return;

    gsap.from(letters, {
      y: 60,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: {
        each: 0.06,
        from: "start",
        ease: "sine.inOut",
      },
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

// Blog intro pin animation
function pinBlogIntro() {
  const intro = document.querySelector(".blogs-intro");
  const section = document.querySelector(".blogs");

  if (!intro || !section || window.matchMedia("(max-width: 991px)").matches)
    return;

  ScrollTrigger.create({
    trigger: section,
    start: "top top+=96",
    end: () => {
      const scrollDistance = section.offsetHeight - intro.offsetHeight;
      return `+=${Math.max(scrollDistance, 1)}`;
    },
    pin: intro,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });
}

// Keep the recent-blogs sidebar visible while the detail article is read.
function pinRecentBlogs() {
  const sidebar = document.querySelector(".recent-blogs");
  const article = document.querySelector(".blog-content");

  if (!sidebar || !article || window.matchMedia("(max-width: 991px)").matches)
    return;

  ScrollTrigger.create({
    trigger: sidebar,
    start: "top top+=128",
    endTrigger: article,
    end: "bottom bottom",
    pin: sidebar,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });
}

// Scroll animations
export function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  // Respect the user's motion preference — leave everything in its natural,
  // fully-visible state instead of animating it in.
  if (REDUCED_MOTION) return;

  gsap.registerPlugin(ScrollTrigger);

  // ---- Section headings & subpage banner ----
  revealGroup(".section-header");
  revealGroup(".subpage-banner h1", { y: 32, duration: 0.8 });
  revealGroup(".subpage-banner > .container > p", { y: 24, duration: 0.7 });
  revealGroup(".subpage-banner .breadcrumb", { y: 20, duration: 0.6 });

  // ---- Homepage: popular services ----
  revealGroup(".popular-services .popular-car-item", { y: 32, duration: 0.8 });
  revealGroup(".service-marquee", { y: 20, duration: 0.7 });
  revealGroup(".trusted-partners .trusted-partners__viewport", {
    y: 20,
    duration: 0.7,
  });
  revealGroup(".service-statistics .col-lg-4", { y: 24, duration: 0.7 });

  // ---- About section (homepage) ----
  // Target the about section image and text blocks by their specific class handles
  revealGroup(".gsap-about-img", { scale: 0.94, y: 16 });
  revealGroup(".gsap-about-text", { y: 24, duration: 0.7 });
  revealGroup(".gsap-about-contact-handles .contact-handle", {
    y: 24,
    duration: 0.6,
    delay: 0.12,
  });

  // ---- About page sections ----
  revealGroup(".gsap-about-intro-img", { scale: 0.93, y: 16 });
  revealGroup(".gsap-about-intro-content", { y: 32, duration: 0.85 });
  waveReveal(".gsap-about-values-grid", ".gsap-value-card", { y: 40, skewY: 0 });
  revealGroup(".gsap-about-stats-item", { y: 24, duration: 0.7 });

  // ---- Our Journey — timeline entries reveal one by one as you scroll ----
  revealGroup(".our-journey .journey", { y: 32 });

  // ---- Why Choose Us ----
  // Split comma-selector into two explicit calls to avoid selector-string issues
  waveReveal(".why-choose-us .panel.left > div", ":scope > .card");
  waveReveal(".why-choose-us .panel.right > div", ":scope > .card");
  revealGroup(".why-choose-us .panel.middle img", { scale: 0.9, y: 0 });

  // ---- Card sections: vertical wave reveal ----
  waveReveal(".team .col-lg-10 > .row", ":scope > div", {
    y: 48,
    skewY: 0,
  });
  waveReveal(".selection-process .row", ":scope > div", {
    y: 48,
    skewY: 0,
  });
  waveReveal(".careers .job-layout", ":scope > .job", {
    y: 48,
    skewY: 0,
  });
  waveReveal(".our-services ul.row", ":scope > li");
  waveReveal(".our-latest-works .cards.row", ":scope > div");

  // Swiper wrappers: play once so GSAP never fights Swiper's cloned slides
  waveReveal(".offers-swiper .swiper-wrapper", ":scope > .swiper-slide", {}, true);
  waveReveal(".testimonial-swiper .swiper-wrapper", ":scope > .swiper-slide", {}, true);

  waveReveal(".our-amenities .amenities", ":scope > div");

  // Customer experiences page — use the gsap-cx-reviews-row class
  waveReveal(".gsap-cx-reviews-row", ":scope > div", {
    y: 32,
    skewY: 0,
  });
  // Customer experiences rating platform cards
  waveReveal(".gsap-cx-platform-cards", ".gsap-platform-card", {
    y: 40,
    skewY: 0,
  });
  // Customer experiences stats band
  revealGroup(".gsap-cx-stat-item", { y: 24, duration: 0.7 });

  // ---- Customer Experience page ----
  // 1. Hero Section (#ce-hero)
  const ceHero = document.querySelector("#ce-hero");
  if (ceHero) {
    const heroImg = ceHero.querySelector(".col-lg-6:first-child img");
    const heroContent = ceHero.querySelector(".col-lg-6:last-child");
    const heroItems = heroContent ? heroContent.children : [];

    if (heroImg) {
      gsap.from(heroImg, {
        x: -60,
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ceHero,
          start: "top 85%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }

    if (heroItems.length) {
      gsap.from(heroItems, {
        x: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ceHero,
          start: "top 85%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }
  }

  // 2. The Difference Is in the Details (#before-after)
  const beforeAfterSection = document.querySelector("#before-after");
  if (beforeAfterSection) {
    const baFilterBtns = beforeAfterSection.querySelectorAll(".ba-filter-group .ba-filter-btn");

    if (baFilterBtns.length) {
      gsap.from(baFilterBtns, {
        y: 25,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: beforeAfterSection.querySelector(".ba-filter-group"),
          start: "top 88%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }
  }

  // 3. A Look Inside Our Work (#our-works) — Stagger-like grid
  const ourWorksSection = document.querySelector("#our-works");
  if (ourWorksSection) {
    const worksImages = ourWorksSection.querySelectorAll(".masonary-grid img");
    const worksBtns = ourWorksSection.querySelectorAll(".d-flex .btn");

    if (worksImages.length) {
      gsap.from(worksImages, {
        y: 80,
        opacity: 0,
        scale: 0.85,
        rotation: 2,
        skewY: 2,
        duration: 0.85,
        ease: "power3.out",
        stagger: {
          each: 0.08,
          from: "start",
          ease: "sine.out",
        },
        scrollTrigger: {
          trigger: ourWorksSection.querySelector(".masonary-grid"),
          start: "top 82%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }

    if (worksBtns.length) {
      gsap.from(worksBtns, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ourWorksSection.querySelector(".d-flex"),
          start: "top 90%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }
  }

  waveReveal(".how-we-works .row.gy-4", ":scope > div");
  waveReveal(".blogs > .container > .row.gy-4", ":scope > div", {
    y: 48,
    skewY: 0,
  });
  waveReveal(".photos > .container > .row.gy-4", ":scope > div", {
    y: 48,
    skewY: 0,
  });
  waveReveal(".blogs .col-lg-7 > .d-flex", ":scope > article");
  pinBlogIntro();
  pinRecentBlogs();

  // ---- Blog Detail page ----
  revealGroup(".blog-detail .blog-content", { y: 32, duration: 0.8 });
  revealGroup(".blog-detail .recent-blogs", { x: 32, y: 0, duration: 0.8 });

  // ---- Contact page ----
  revealGroup(".gsap-contact-form-cols", { y: 32, duration: 0.8 });
  waveReveal(".contact-form .d-flex.flex-column.gap-4", ":scope > .consulation", {
    y: 40,
    skewY: 0,
  });
  revealGroup(".studio-location .map-container", { scale: 0.96, y: 0 });
  waveReveal(".studio-location .our-locations", ":scope > div", {
    y: 48,
    skewY: 0,
  });

  // ---- Text anim — letters wave in ----
  waveTextReveal(".text-anim .anim-txt");

  // ---- Studio tour ----
  revealGroup(".tour-video-container", { scale: 0.96, y: 0 });

  // ---- Customer experiences intro / contact handles ----
  revealGroup(".contact-us .social-handles > li", { y: 24, duration: 0.6 });

  // ---- FAQs ----
  revealGroup(".faqs .accordion-item", { y: 24 });
  revealGroup(".faqs .faq-visual > img", { scale: 0.94, y: 0 });

  // ---- Fullwidth CTA ----
  revealGroup(".fullwidth-cta .wrapper", { x: -32, y: 0 });
  revealGroup(".fullwidth-cta .col-lg-4", { x: 32, y: 0 });

  // ---- Footer (desktop only — avoid cutting off mobile quick scroll) ----
  if (window.matchMedia("(min-width: 768px)").matches) {
    revealGroup(".footer .footer-inner > div", { y: 24, duration: 0.7 });
  }

  // Re-measure trigger positions once everything (images, fonts) has
  // finished loading, since layout height can shift after first paint.
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
