/**
 * main.js — App entry point
 */

import {
  initLenis,
  initDateTime,
  initOfferCountdowns,
  initStatsCounters,
  initTourVideoPlayer,
  initTestimonialSwiper,
  initOffersSwiper,
  initPopularServicesSwiper,
  initServiceStatisticsSwiper,
  initCopyButtons,
  initScrollToTop,
  initTextHoverAnimation,
} from "./init.js";
import { toggleTheme } from "./toggleTheme.js";
import { initPageTransition } from "./pageTransition.js";
import { initScrollAnimations } from "./scrollAnimations.js";
import { initHeroIntro } from "./heroIntro.js";

// Mobile Menu
function handleMobileMenu(navbarToggler, target) {
  if (!navbarToggler || !target) return;

  navbarToggler.addEventListener("click", () => {
    const isActive = target.classList.toggle("active");

    navbarToggler
      .querySelector(".icon")
      .setAttribute("name", isActive ? "close" : "menu");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector("#site-header");
  const announcementBar = siteHeader?.querySelector(".announcement-bar");

  if (siteHeader && announcementBar) {
    let announcementHeight = announcementBar.getBoundingClientRect().height;
    siteHeader.style.setProperty(
      "--announcement-height",
      `${announcementHeight}px`,
    );

    const updateHeader = () => {
      const isScrolled = window.scrollY >= announcementHeight;
      siteHeader.classList.toggle("is-scrolled", isScrolled);
      document.body.classList.toggle("header-condensed", isScrolled);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", () => {
      siteHeader.classList.remove("is-scrolled");
      announcementHeight = announcementBar.offsetHeight;
      siteHeader.style.setProperty(
        "--announcement-height",
        `${announcementHeight}px`,
      );
      updateHeader();
    });
  }

  const themeToggleBtn = document.querySelector("#theme-toggle-btn");
  const savedTheme = localStorage.getItem("theme");

  // Dark theme by default
  const theme = savedTheme || "dark";

  // Apply theme
  document.documentElement.setAttribute("data-bs-theme", theme);

  // Initialize toggle button
  toggleTheme(themeToggleBtn);

  // Initialize icon
  const btnIcon = themeToggleBtn?.querySelector(".icon");

  if (btnIcon) {
    btnIcon.setAttribute("name", theme === "dark" ? "sunny" : "moon");
  }

  // Mobile Menu
  const navbarToggler = document.querySelector("#navbar-toggler");
  const mobileMenu = document.querySelector(".mobile-menu");
  handleMobileMenu(navbarToggler, mobileMenu);
  initCopyButtons();

  // Init lenis (smooth scroll)
  const lenis = initLenis();

  // Scroll-based reveal animations (GSAP ScrollTrigger)
  initScrollAnimations();

  // Text anim
  initTextHoverAnimation();

  // Build the header/hero reveal now — paused, but its .from() tweens hide
  // those elements immediately so nothing flashes visible under the overlay
  const heroIntroTl = initHeroIntro();

  // Page transition intro, then play the header/hero reveal once it clears
  initPageTransition(() => heroIntroTl?.play());

  // Live date/time
  initDateTime();

  // Offer countdowns
  initOfferCountdowns();

  // Stats counters
  initStatsCounters();

  // Copy to clipboard
  initCopyButtons();

  // Tour video player
  let tourVideo = document.querySelector("#tour-video"),
    videoCtrlBtn = document.querySelector("#video-control-btn"),
    videoCtrlIcon = document.querySelector("#video-control-icon");
  initTourVideoPlayer(videoCtrlBtn, tourVideo, videoCtrlIcon);

  // Testimonial swiper
  initTestimonialSwiper();

  // Offers swiper
  initOffersSwiper();

  // Popular services swiper
  initPopularServicesSwiper();

  // Service statistics swiper
  initServiceStatisticsSwiper();

  // Scroll to top
  let scrollToTopBtn = document.querySelector("#scroll-to-top-btn");
  initScrollToTop(scrollToTopBtn, lenis);
});
