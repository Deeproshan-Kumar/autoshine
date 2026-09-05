/**
 * pageTransition.js — GSAP page transition pillars animation
 */

function hideOverlay() {
  const overlay = document.getElementById("page-transition");
  if (overlay) overlay.style.display = "none";
}

export function initPageTransition(onIntroComplete) {
  const pillars = document.querySelectorAll(".pillar");
  if (!pillars.length) {
    onIntroComplete?.();
    return;
  }

  // The overlay covers the viewport, so never leave it up if GSAP is missing
  if (typeof gsap === "undefined") {
    hideOverlay();
    onIntroComplete?.();
    return;
  }

  // Intro: animate pillars out on page load
  gsap.set(pillars, { scaleY: 1 });

  const tl = gsap.timeline({ delay: 0.1 });
  tl.to(pillars, {
    scaleY: 0,
    transformOrigin: "top",
    duration: 0.8,
    stagger: 0.08,
    ease: "power4.inOut",
    // Remove overlay from DOM flow after animation, then hand off to
    // whatever should reveal once the pillars have fully cleared.
    onComplete: () => {
      hideOverlay();
      onIntroComplete?.();
    },
  });
}
