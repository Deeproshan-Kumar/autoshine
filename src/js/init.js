/**
 * init.js — initiliazes external libraries
 */

// Initialize a new Lenis instance for smooth scrolling
export function initLenis() {
  const lenis = new Lenis({
    lerp: 0.05,
    smoothWheel: true,
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// Initialize a datetime function
export function initDateTime() {
  const el = document.getElementById("datetime");
  if (!el) return;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function update() {
    const now = new Date();
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "pm" : "am";
    const h12 = now.getHours() % 12 || 12;

    el.textContent = `${day}, ${date} ${month} ${year} | ${String(h12).padStart(2, "0")}:${m}:${s} ${ampm}`;
  }

  update();
  setInterval(update, 1000);
}

// Init tour video player function
export function initTourVideoPlayer(videoCtrlBtn, video, videoCtrlIcon) {
  if (!videoCtrlBtn || !video || !videoCtrlIcon) return;
  video.pause();

  videoCtrlBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      videoCtrlIcon.setAttribute("name", "pause");
    } else {
      video.pause();
      videoCtrlIcon.setAttribute("name", "play");
    }
  });
}

// Init testimonial swiper
export function initTestimonialSwiper() {
  const testimonialSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      el: ".testimonial-swiper .swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".testimonial-swiper .swiper-button-next",
      prevEl: ".testimonial-swiper .swiper-button-prev",
    },

    breakpoints: {
      576: {
        slidesPerView: 1,
      },

      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },

      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

// Init offers swiper
export function initOffersSwiper() {
  const offersSwiper = document.querySelector(".offers-swiper");
  if (!offersSwiper) return;

  new Swiper(offersSwiper, {
    slidesPerView: 2,
    spaceBetween: 24,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      el: ".offers-swiper .swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".offers-swiper .swiper-button-next",
      prevEl: ".offers-swiper .swiper-button-prev",
    },

    breakpoints: {
      576: {
        slidesPerView: 1,
      },

      768: {
        slidesPerView: 1,
        spaceBetween: 24,
      },

      1024: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
    },
  });
}

// Init copy to clipboard
export function initCopyButtons() {
  const copyButtons = document.querySelectorAll("[data-copy-target]");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target) return;

      const value = target.textContent.trim();
      let copied = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          copied = true;
        } else {
          const input = document.createElement("textarea");
          input.value = value;
          input.setAttribute("readonly", "");
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          copied = document.execCommand("copy");
          input.remove();
        }
      } catch {
        copied = false;
      }

      if (!copied) return;

      const icon = button.querySelector("ion-icon");
      const originalLabel = button.getAttribute("aria-label");
      const originalTitle = button.getAttribute("title");

      icon?.setAttribute("name", "checkmark");
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");

      window.setTimeout(() => {
        icon?.setAttribute("name", "copy");
        if (originalLabel) button.setAttribute("aria-label", originalLabel);
        if (originalTitle) button.setAttribute("title", originalTitle);
      }, 1600);
    });
  });
}

// Init scroll to top
export function initScrollToTop(el, lenis) {
  if (!el) return;

  const header = document.querySelector(".site-header");
  const getThreshold = () => header?.offsetHeight ?? 0;
  let currentScroll = window.scrollY;

  function updateVisibility(scrollPosition = window.scrollY) {
    currentScroll = scrollPosition;
    const isVisible = scrollPosition >= getThreshold();
    el.classList.toggle("is-visible", isVisible);
    el.setAttribute("aria-hidden", String(!isVisible));
    el.tabIndex = isVisible ? 0 : -1;
  }

  updateVisibility();

  if (lenis) {
    lenis.on("scroll", (event) => {
      const scrollPosition =
        typeof event === "number" ? event : (event?.scroll ?? lenis.scroll);
      updateVisibility(scrollPosition);
    });
  } else {
    window.addEventListener("scroll", updateVisibility, { passive: true });
  }

  el.addEventListener("click", function () {
    if (currentScroll >= getThreshold()) {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  });
}

// Init text hover animation
export function initTextHoverAnimation() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const textElements = document.querySelectorAll(".anim-txt span");

  textElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      if (gsap.isTweening(element)) return;
      gsap.to(element, {
        transformOrigin: "bottom",
        scaleY: 0.75,
        scaleX: 1.25,
        duration: 0.1,
        onComplete: () => {
          gsap.to(element, {
            scaleY: 1,
            scaleX: 1,
            duration: 2.5,
            ease: "elastic.out(1, 0.25)",
          });
        },
      });
    });
  });
}
