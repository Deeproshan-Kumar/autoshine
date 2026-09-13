/**
 * beforeAfterSlider.js — Interactive Before & After Image Comparison Slider & Category Filter
 */

export function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll(".ba-slider");

  sliders.forEach((slider) => {
    const handle = slider.querySelector(".ba-handle");
    const beforeLayer = slider.querySelector(".ba-layer-before");
    const container = slider.querySelector(".ba-image-container") || slider;

    if (!beforeLayer || !handle) return;

    let isDragging = false;
    let currentPos = 50; // percentage
    let rAF = null;
    let targetPercent = 50;

    const updateDOM = () => {
      slider.style.setProperty("--ba-position", `${targetPercent}%`);
      slider.setAttribute("aria-valuenow", Math.round(targetPercent));
      rAF = null;
    };

    const setPosition = (percent, immediate = false) => {
      const clamped = Math.max(0, Math.min(100, percent));
      targetPercent = clamped;
      currentPos = clamped;

      if (immediate) {
        if (rAF) cancelAnimationFrame(rAF);
        updateDOM();
      } else if (!rAF) {
        rAF = requestAnimationFrame(updateDOM);
      }
    };

    const getPercentFromX = (clientX) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return 50;
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    };

    const onDragMove = (clientX) => {
      if (!isDragging) return;
      setPosition(getPercentFromX(clientX));
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("is-dragging");
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", onDragEnd);
      window.removeEventListener("pointercancel", onDragEnd);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onDragEnd);
      window.removeEventListener("touchcancel", onDragEnd);
    };

    const handlePointerMove = (e) => onDragMove(e.clientX);
    const handleMouseMove = (e) => onDragMove(e.clientX);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        onDragMove(e.touches[0].clientX);
      }
    };

    const startDrag = (clientX) => {
      isDragging = true;
      slider.classList.add("is-dragging");
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";

      setPosition(getPercentFromX(clientX), true);

      // Attach global window listeners for continuous seamless drag tracking
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerup", onDragEnd);
      window.addEventListener("pointercancel", onDragEnd);
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", onDragEnd);
      window.addEventListener("touchcancel", onDragEnd);
    };

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      startDrag(e.clientX);
    };

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientX);
      }
    };

    // Prevent default HTML5 image dragging preview
    slider.addEventListener("dragstart", (e) => e.preventDefault());

    // Event listeners on slider element
    slider.addEventListener("pointerdown", onPointerDown);
    slider.addEventListener("touchstart", onTouchStart, { passive: true });

    // Keyboard accessibility
    slider.addEventListener("keydown", (e) => {
      let delta = 0;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -5;
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = 5;
      else if (e.key === "Home") setPosition(0, true);
      else if (e.key === "End") setPosition(100, true);

      if (delta !== 0) {
        e.preventDefault();
        setPosition(currentPos + delta, true);
      }
    });

    // Initial position
    setPosition(50, true);
  });
}

export function initCategoryFilters() {
  const filterContainer = document.querySelector(".ba-filter-group");
  if (!filterContainer) return;

  const filterButtons = filterContainer.querySelectorAll(".ba-filter-btn");
  const items = document.querySelectorAll(".ba-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-filter");

      // Active state on buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter animation
      items.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");

        if (selectedCategory === "all" || itemCategory === selectedCategory) {
          item.classList.add("is-visible");
          item.style.display = "block";
          requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0) scale(1)";
          });
        } else {
          item.classList.remove("is-visible");
          item.style.opacity = "0";
          item.style.transform = "translateY(0.9375rem) scale(0.96)";
          setTimeout(() => {
            if (!item.classList.contains("is-visible")) {
              item.style.display = "none";
            }
          }, 300);
        }
      });

      // Refresh ScrollTrigger so layout height shifts don't throw off triggers
      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });
}
