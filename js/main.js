(function () {
  "use strict";

  /* Year in footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
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

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    question.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.setAttribute("data-open", "false");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      item.setAttribute("data-open", String(!isOpen));
      question.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* Scroll reveal */
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
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Animated stat counters */
  var statEls = document.querySelectorAll(".stat-number");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1400;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && statEls.length) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* Hero countdown ring (visual only, loops 2:00 -> 0:00) */
  var ring = document.getElementById("ring-fg");
  var timerText = document.getElementById("timer-text");
  if (ring && timerText) {
    var CIRCUMFERENCE = 327;
    var TOTAL_SECONDS = 120;
    var elapsed = 0;
    setInterval(function () {
      elapsed = (elapsed + 1) % (TOTAL_SECONDS + 1);
      var remaining = TOTAL_SECONDS - elapsed;
      var minutes = Math.floor(remaining / 60);
      var seconds = remaining % 60;
      timerText.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
      var offset = CIRCUMFERENCE * (1 - elapsed / TOTAL_SECONDS);
      ring.style.strokeDashoffset = String(offset);
    }, 1000);
  }

  /* Contact form (front-end only demo) */
  var contactForm = document.getElementById("contact-form");
  var formNote = document.getElementById("form-note");
  if (contactForm && formNote) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formNote.textContent = "Merci de renseigner votre nom et une adresse e-mail valide.";
        return;
      }
      formNote.textContent = "Merci ! Votre demande a bien été enregistrée, nous revenons vers vous sous 24h.";
      contactForm.reset();
    });
  }

  /* Newsletter form (front-end only demo) */
  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector("input");
      if (input) input.value = "";
      var btn = newsletterForm.querySelector("button");
      var original = btn.textContent;
      btn.textContent = "Inscrit ✓";
      setTimeout(function () { btn.textContent = original; }, 2500);
    });
  }
})();
