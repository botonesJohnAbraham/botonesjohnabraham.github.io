/* ================================================================
   script.js — John Abraham Portfolio
   ================================================================
   TABLE OF CONTENTS:
   1. Role Text Rotator
   2. Scroll-Triggered Fade-In Animation
   3. Project Filter Tabs
   4. Smooth Scroll (anchor links)
   5. Navbar Active State on Scroll
   ================================================================ */


/* ================================================================
   1. ROLE TEXT ROTATOR
   Cycles through the roles array every 2.5 seconds.
   To change roles: add/remove strings from the array below.
   ================================================================ */
(function initRoleRotator() {
  // ↓ Edit this array to change the rotating roles
  const roles = [
    "Web Developer",
    "Project Manager",
    "SEO Specialist",
    "Freelancer",
    "Photographer"
  ];

  let currentIndex = 0;
  const roleEl = document.getElementById("role-text");
  if (!roleEl) return;  // guard: exit if element doesn't exist

  function rotateRole() {
    // 1. Fade out + slide up the current text
    roleEl.style.opacity  = "0";
    roleEl.style.transform = "translateY(8px)";

    // 2. After the CSS transition completes (300ms), swap the text and fade in
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      roleEl.textContent = roles[currentIndex];
      roleEl.style.opacity  = "1";
      roleEl.style.transform = "translateY(0)";
    }, 300);
  }

  // Run the rotator every 2.5 seconds
  setInterval(rotateRole, 2500);
})();


/* ================================================================
   2. SCROLL-TRIGGERED FADE-IN ANIMATION
   Any element with the class "fade-in" will animate into view
   when it enters the viewport. Uses IntersectionObserver (no
   jQuery / external library needed).

   HOW TO USE: add class="fade-in" to any HTML element you want
   to animate. The "visible" class (defined in style.css) handles
   the actual CSS transition.
   ================================================================ */
(function initFadeIn() {
  const fadeElements = document.querySelectorAll(".fade-in");
  if (!fadeElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stop watching once the element has faded in (fires only once)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12  // trigger when 12% of the element is visible
    }
  );

  fadeElements.forEach((el) => observer.observe(el));
})();


/* ================================================================
   3. PROJECT FILTER TABS
   Clicking a tab shows only the matching project cards.

   HOW IT WORKS:
   - Each .filter-tab has a data-filter attribute (e.g. data-filter="landing")
   - Each .project-card has a data-category attribute (e.g. data-category="landing seo")
     A card can belong to multiple categories (space-separated).
   - "all" shows every card.

   TO ADD A NEW CATEGORY:
   1. Add a <button class="filter-tab" data-filter="your-category">Label</button>
      in the HTML filter-tabs div.
   2. Add data-category="your-category" to the matching .project-card elements.
   ================================================================ */
(function initFilterTabs() {
  const tabs  = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".project-card");
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // — Update active tab style —
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;  // e.g. "landing", "all"

      cards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");

        if (filter === "all" || categories.includes(filter)) {
          // Show matching card with a smooth fade
          card.style.display = "";          // restore display
          requestAnimationFrame(() => {
            card.style.opacity   = "1";
            card.style.transform = "scale(1)";
          });
        } else {
          // Hide non-matching card
          card.style.opacity   = "0";
          card.style.transform = "scale(0.97)";
          // Wait for the CSS transition then hide from layout
          card.addEventListener(
            "transitionend",
            () => { if (card.style.opacity === "0") card.style.display = "none"; },
            { once: true }
          );
        }
      });
    });
  });

  // Add transition style to cards so filter animations are smooth
  cards.forEach((card) => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });
})();


/* ================================================================
   4. SMOOTH SCROLL
   Intercepts all internal anchor clicks (#section) and scrolls
   smoothly instead of jumping. Accounts for the fixed navbar height.
   ================================================================ */
(function initSmoothScroll() {
  const NAVBAR_HEIGHT = 72;  // px — adjust if you change the nav height

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      const target   = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top
                      + window.pageYOffset
                      - NAVBAR_HEIGHT;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    });
  });
})();


/* ================================================================
   5. NAVBAR ACTIVE STATE ON SCROLL
   Highlights the correct nav link as you scroll through sections.
   Adds the "active" class to the link whose section is in view.
   ================================================================ */
(function initNavHighlight() {
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!navLinks.length) return;

  function onScroll() {
    const scrollPos = window.pageYOffset + 80;  // offset for navbar

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        // Remove active from all links
        navLinks.forEach((link) => link.classList.remove("nav-active"));

        // Add active to the matching link
        const activeLink = document.querySelector(
          `.nav-links a[href="#${section.id}"]`
        );
        if (activeLink) activeLink.classList.add("nav-active");
      }
    });
  }

  // CSS for the active nav link — injected here so you can see it in context
  // You can move this rule to style.css if you prefer
  const style = document.createElement("style");
  style.textContent = `.nav-links a.nav-active { color: var(--text); background: var(--border); }`;
  document.head.appendChild(style);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();  // run once on load
})();