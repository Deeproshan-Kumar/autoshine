/**
 * scrollAnimations.js — premium scroll-based reveals powered by GSAP + ScrollTrigger
 *
 * Two building blocks:
 *  - revealGroup(): a simple fade/slide-up reveal for standalone elements
 *    (headings, images, timeline entries, footer columns, etc.)
 *  - waveReveal(): the signature "card wave" — cards in a row rise into place
 *    one after another. Each card only ever travels along the Y axis, but the
 *    sine-eased stagger across the row makes the cascade read as a wave.
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
function waveReveal(containerSelector, itemSelector, vars = {}) {
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
        toggleActions: "play none none reverse",
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

// Scroll animations
export function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  // Respect the user's motion preference — leave everything in its natural,
  // fully-visible state instead of animating it in.
  if (REDUCED_MOTION) return;

  gsap.registerPlugin(ScrollTrigger);

  // Section headings across the page
  revealGroup(".section-header");
  revealGroup(".popular-services .popular-car-item", { y: 32, duration: 0.8 });
  revealGroup(".service-marquee", { y: 20, duration: 0.7 });
  revealGroup(".trusted-partners .trusted-partners__track", {
    y: 20,
    duration: 0.7,
  });
  revealGroup(".service-statistics .col-lg-4", { y: 24, duration: 0.7 });

  // About section
  revealGroup(".about img", { scale: 0.94, y: 16 });
  revealGroup(".about .col-lg-6:last-child > p", { y: 24, duration: 0.7 });
  revealGroup(".about .contact-handle", {
    y: 24,
    duration: 0.6,
    delay: 0.12,
  });

  // Our Journey — timeline entries reveal one by one as you scroll past them
  revealGroup(".our-journey .journey", { y: 32 });

  // Why Choose Us
  waveReveal(
    ".why-choose-us .panel.left > div, .why-choose-us .panel.right > div",
    ":scope > .card",
  );
  revealGroup(".why-choose-us .panel.middle img", { scale: 0.9, y: 0 });

  // ---- Card sections: vertical wave reveal ----
  waveReveal(".our-services ul.row", ":scope > li");
  waveReveal(".our-latest-works .cards.row", ":scope > div");
  waveReveal(".offers-swiper .swiper-wrapper", ":scope > .swiper-slide");
  waveReveal(".our-amenities .amenities", ":scope > div");
  revealGroup(".customer-experiences .row.gy-4 > div:first-child img", {
    scale: 0.94,
    y: 0,
  });
  revealGroup(".customer-experiences .row.gy-4 > div:last-child", {
    x: 32,
    y: 0,
  });
  waveReveal(".customer-experiences .row.mt-2", ":scope > div", {
    y: 32,
    skewY: 0,
  });
  waveReveal(".how-we-works .row.gy-4", ":scope > div");
  waveReveal(".testimonial-swiper .swiper-wrapper", ":scope > .swiper-slide");
  waveReveal(".blogs .col-lg-7 > .d-flex", ":scope > article");
  pinBlogIntro();

  // Text anim — letters wave in
  waveTextReveal(".text-anim .anim-txt");

  // Studio tour
  revealGroup(".tour-video-container", { scale: 0.96, y: 0 });

  // Customer experiences intro / contact handles
  revealGroup(".contact-us .social-handles > li", { y: 24, duration: 0.6 });

  // FAQs
  revealGroup(".faqs .accordion-item", { y: 24 });
  revealGroup(".faqs .faq-visual > img", { scale: 0.94, y: 0 });

  // Fullwidth CTA
  revealGroup(".fullwidth-cta .wrapper", { x: -32, y: 0 });
  revealGroup(".fullwidth-cta .col-lg-4", { x: 32, y: 0 });

  // Keep footer content immediately available on small screens. The footer is
  // often reached by a short touch scroll before ScrollTrigger can refresh.
  if (window.matchMedia("(min-width: 768px)").matches) {
    revealGroup(".footer .footer-inner > div", { y: 24, duration: 0.7 });
  }

  // Re-measure trigger positions once everything (images, fonts) has
  // finished loading, since layout height can shift after first paint.
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
