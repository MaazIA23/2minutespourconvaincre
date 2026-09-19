(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".has-dropdown > a").forEach(function (link) {
    var caret = link.querySelector(".dropdown-caret");
    if (!caret) return;
    caret.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      link.parentElement.classList.toggle("is-open");
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 80px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
    // Safety net: never leave content permanently invisible (e.g. if an
    // element is observed after it has already scrolled past, or on a
    // browser/automation quirk where the observer misses a fast jump).
    window.setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lightbox for gallery-style images (galerie, événements associés) */
  (function () {
    var groups = [];
    document.querySelectorAll(".galerie-grid, .associated-photos").forEach(function (container) {
      var imgs = Array.prototype.slice.call(container.querySelectorAll("img"));
      if (!imgs.length) return;
      var group = imgs.map(function (img) { return { src: img.currentSrc || img.src, alt: img.alt || "" }; });
      groups.push(group);
      var groupIndex = groups.length - 1;
      imgs.forEach(function (img, i) {
        img.classList.add("lightbox-trigger");
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Agrandir la photo");
        function open() { openLightbox(groupIndex, i); }
        img.addEventListener("click", open);
        img.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
      });
    });

    if (!groups.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Fermer">✕</button>' +
      '<button class="lightbox-prev" aria-label="Photo précédente">‹</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lightbox-next" aria-label="Photo suivante">›</button>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector("img");
    var captionEl = overlay.querySelector("figcaption");
    var current = { group: 0, index: 0 };

    function render() {
      var item = groups[current.group][current.index];
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      captionEl.textContent = item.alt;
    }
    function openLightbox(g, i) {
      current.group = g;
      current.index = i;
      render();
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function step(delta) {
      var group = groups[current.group];
      current.index = (current.index + delta + group.length) % group.length;
      render();
    }

    overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    overlay.querySelector(".lightbox-prev").addEventListener("click", function () { step(-1); });
    overlay.querySelector(".lightbox-next").addEventListener("click", function () { step(1); });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  })();

  ["candidature-form", "contact-form", "notify-form"].forEach(function (id) {
    var form = document.getElementById(id);
    var note = document.getElementById("form-note");
    if (form && note) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          note.textContent = "Merci de renseigner les champs obligatoires avec une adresse e-mail valide.";
          return;
        }
        note.textContent = "Merci ! Votre demande a bien été enregistrée, nous revenons vers vous rapidement.";
        form.reset();
      });
    }
  });
})();
