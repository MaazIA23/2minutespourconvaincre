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
