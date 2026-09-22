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

  /* Titre du hero qui tourne entre plusieurs accroches */
  (function () {
    var rotator = document.getElementById("hero-rotator");
    if (!rotator) return;
    var phrases = Array.prototype.slice.call(rotator.querySelectorAll(".hero-rotator-phrase"));
    if (phrases.length < 2) return;
    var index = 0;
    window.setInterval(function () {
      var current = phrases[index];
      current.classList.add("is-fading");
      window.setTimeout(function () {
        current.classList.remove("is-active", "is-fading");
        index = (index + 1) % phrases.length;
        phrases[index].classList.add("is-active");
      }, 350);
    }, 3800);
  })();

  /* Countdown vers la date de l'évènement (hero accueil) */
  (function () {
    var el = document.getElementById("hero-countdown");
    if (!el || !el.dataset.target) return;
    var target = new Date(el.dataset.target).getTime();
    if (isNaN(target)) return;
    var daysEl = el.querySelector('[data-unit="days"]');
    var hoursEl = el.querySelector('[data-unit="hours"]');
    var minutesEl = el.querySelector('[data-unit="minutes"]');
    var secondsEl = el.querySelector('[data-unit="seconds"]');
    function pad(n) { return String(n).padStart(2, "0"); }
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    }
    tick();
    window.setInterval(tick, 1000);
  })();

  /* Animation de comptage pour les chiffres clés (.stat-value) au scroll */
  (function () {
    var statEls = document.querySelectorAll(".stat-value");
    if (!statEls.length) return;

    function parseStat(text) {
      var i = 0;
      while (i < text.length && !/\d/.test(text[i])) i++;
      var prefix = text.slice(0, i);
      var j = i;
      while (j < text.length) {
        var ch = text[j];
        if (/\d/.test(ch)) { j++; continue; }
        if ((ch === "." || ch === "," || ch === " ") && /\d/.test(text[j + 1] || "")) { j++; continue; }
        break;
      }
      var core = text.slice(i, j);
      var suffix = text.slice(j);
      var digitsOnly = core.replace(/[^\d]/g, "");
      var sep = null;
      for (var k = 0; k < core.length; k++) {
        if (!/\d/.test(core[k])) { sep = core[k]; break; }
      }
      return { prefix: prefix, suffix: suffix, target: parseInt(digitsOnly, 10) || 0, sep: sep, padLen: digitsOnly.length };
    }

    function formatNumber(value, sep, padLen) {
      var s = String(value);
      if (padLen && s.length < padLen) s = "0".repeat(padLen - s.length) + s;
      if (!sep) return s;
      var out = "", count = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        out = s[i] + out;
        count++;
        if (count % 3 === 0 && i !== 0) out = sep + out;
      }
      return out;
    }

    function animateStat(el) {
      var data = parseStat(el.textContent.trim());
      if (!data.target) return;
      var duration = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = data.prefix + formatNumber(Math.round(data.target * eased), data.sep, data.padLen) + data.suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      var statObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      statEls.forEach(function (el) { statObserver.observe(el); });
    }
  })();

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

  /* "Lire la suite" pour les récits de finalistes (palmarès) */
  document.querySelectorAll(".palmares-readmore").forEach(function (btn) {
    var recit = btn.previousElementSibling;
    if (!recit || !recit.classList.contains("palmares-recit")) return;
    btn.addEventListener("click", function () {
      var expanded = recit.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Voir moins ↑" : "Lire la suite →";
    });
  });

  ["candidature-form", "contact-form", "notify-form", "partenaire-form"].forEach(function (id) {
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
