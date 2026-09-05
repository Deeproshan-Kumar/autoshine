/**
 * heroIntro.js — GSAP staggered reveal for the header and hero section.
 *
 * The returned timeline is created paused: its `.from()` tweens render
 * their hidden starting state the instant it's built (so nothing flashes
 * fully visible underneath the pillar overlay), and it only plays once the
 * caller triggers it — once the pillar wipe has fully cleared.
 */

const REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

export function initHeroIntro() {
  if (typeof gsap === "undefined") return null;

  // Respect the user's motion preference — leave header/hero in their
  // natural, fully-visible state instead of animating them in.
  if (REDUCED_MOTION) return null;

  const header = document.querySelector(".site-header");
  const hero = document.querySelector("#hero");
  if (!header && !hero) return null;

  const logo = header?.querySelector(".navbar-brand");
  const navItems = header?.querySelectorAll(".nav-item");
  const headerActions = header?.querySelector(".header-actions");
  const headerActionItems = headerActions ? headerActions.children : null;

  // The hero's first column holds every piece of hero copy, in the exact
  // order it should reveal — animate its direct children as one sequence.
  const heroColumns = hero?.querySelectorAll(".col-sm-12.col-lg-6");
  const heroContent = heroColumns?.[0];
  const heroItems = heroContent?.children;
  const heroImageColumn = heroColumns?.[1];

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

  if (logo) {
    tl.from(logo, { y: -16, opacity: 0, duration: 0.5 });
  }

  if (navItems?.length) {
    tl.from(
      navItems,
      { y: -14, opacity: 0, duration: 0.45, stagger: 0.06 },
      "-=0.3",
    );
  }

  if (headerActionItems?.length) {
    tl.from(
      headerActionItems,
      { y: -14, opacity: 0, duration: 0.4, stagger: 0.08 },
      "-=0.25",
    );
  }

  if (heroItems?.length) {
    tl.from(
      heroItems,
      { y: 26, opacity: 0, duration: 0.55, stagger: 0.14 },
      "-=0.1",
    );
  }

  if (heroImageColumn) {
    tl.from(
      heroImageColumn,
      {
        opacity: 0,
        scale: 0.75,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.5",
    );
  }

  return tl;
}
