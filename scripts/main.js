document.addEventListener("DOMContentLoaded", () => {

  try {
    if (window.bootstrap?.ScrollSpy) {
      window.bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
        target: "#collapsiblenavbar",
        offset: 110,
      });
    }
  } catch (_) {}

  const nav = document.getElementById("collapsiblenavbar");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a.nav-link[href^="#"]'));

  function setActive(link) {
    links.forEach((l) => l.classList.toggle("active", l === link));
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      setActive(link);
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close the mobile menu after clicking a link
      try {
        const collapseEl = nav;
        if (collapseEl.classList.contains("show") && window.bootstrap?.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
        }
      } catch (_) {}
    });
  });

  // About intro animation 
  const introSkip = new Set();
  try {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReducedMotion) {
      const aboutHeading = document.getElementById("about");
      const aboutContainer = aboutHeading?.nextElementSibling;

      if (aboutHeading && aboutContainer && aboutContainer.classList?.contains("container")) {
        const aboutImg = aboutContainer.querySelector("img");
        const textWrap = aboutContainer.querySelector(".col-md-6:last-child .d-flex");

        if (aboutImg) {
          aboutImg.classList.add("emma-intro--img", "emma-intro-hidden");
          introSkip.add(aboutImg);
        }

        if (textWrap) {
          textWrap.classList.add("emma-intro--text", "emma-intro-hidden");
          introSkip.add(textWrap);
        }

        
        aboutHeading.classList.add("emma-intro--heading", "emma-intro-hidden");
        introSkip.add(aboutHeading);

        // Delay
        window.setTimeout(() => {
          if (aboutImg) aboutImg.classList.add("emma-intro-in");
        }, 1400);

        window.setTimeout(() => {
          aboutHeading.classList.add("emma-intro-in");
          if (textWrap) textWrap.classList.add("emma-intro-in");
        }, 2200);
      }
    }
  } catch (_) {}

  try {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return;

    const revealSelectors = [
      ".about",
      ".solution",
      ".impact-title",
      ".programs-title",
      ".sponsor",
      ".vision-mission-card",
      ".impact-card",
      ".program-card",
      ".container img",
      ".program-image-wrapper img",
      ".impact-icon img",
      ".carousel-inner img",
      ".budget-sec .card",
      ".departments .tab-content .details",
      ".departments .tab-content img",
      ".info .address",
      ".info .email",
      ".info .phone",
      "form",
    ];

    const elements = Array.from(document.querySelectorAll(revealSelectors.join(","))).filter(
      (el) => !introSkip.has(el)
    );
    elements.forEach((el, i) => {
      el.classList.add("emma-reveal");

      el.style.setProperty("--emma-delay", `${Math.min(i * 60, 360)}ms`);

      if (
        el.classList.contains("vision-mission-card") ||
        el.classList.contains("impact-card") ||
        el.classList.contains("program-card") ||
        el.classList.contains("budget")
      ) {
        el.classList.add("emma-reveal--scale");
      }

      // Images slide in from the left
      if (el.tagName === "IMG") {
        el.classList.add("emma-reveal--left");
      }
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("emma-reveal--in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("emma-reveal--in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((el) => io.observe(el));
  } catch (_) {}
});

