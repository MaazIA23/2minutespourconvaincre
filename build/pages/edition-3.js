function render(data) {
  const { edition3 } = data;

  return `
<section class="page-hero coming-soon-hero">
  <div class="container">
    <p class="eyebrow">${edition3.teaser.eyebrow}</p>
    <h1>3ème édition</h1>
    <div class="hero-meta">
      <span>📅 ${edition3.date} (${edition3.dateContexte})</span>
      <span>📍 ${edition3.lieu}</span>
    </div>
    <a href="#notify" class="btn btn-primary btn-lg">Être informé(e) du lancement</a>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <h2>${edition3.nouvelleAmbition.titre}</h2>
    </div>
    <div class="prose reveal">
      ${edition3.nouvelleAmbition.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>${edition3.pourquoiLaParole.titre}</h2>
    </div>
    <div class="prose reveal">
      ${edition3.pourquoiLaParole.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="nouveautes">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Cap sur la 3ème édition</p>
      <h2>Ce qui change pour la 3ème édition</h2>
    </div>
    <div class="nouveautes-grid">
      ${edition3.nouveautes
        .map((n) =>
          n.titre.includes("300 Voix")
            ? `<div class="method-step reveal">
        <div class="step-number">${n.numero}</div>
        <h3>${edition3.programme300Voix.titre}</h3>
        <p>${edition3.programme300Voix.accroche}</p>
        <a href="${edition3.programme300Voix.ctaPrincipal.lien}" class="method-step-link">${edition3.programme300Voix.ctaPrincipal.label} →</a>
        <a href="${edition3.programme300Voix.ctaSecondaire.lien}" class="method-step-link" style="margin-left:18px">${edition3.programme300Voix.ctaSecondaire.label} →</a>
      </div>`
            : `<div class="method-step reveal">
        <div class="step-number">${n.numero}</div>
        <h3>${n.titre}</h3>
        <p>${n.description}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="300-voix">
  <div class="container">
    <div class="photo-banner reveal">
      <img src="${edition3.programme300Voix.photo}" alt="Une élève prend la parole au micro devant ses camarades de classe, programme 300 Voix" loading="lazy">
    </div>
    <div class="section-head reveal">
      <p class="eyebrow">${edition3.programme300Voix.eyebrow}</p>
      <h2>${edition3.programme300Voix.titre}</h2>
      <p class="section-lead"><em>${edition3.programme300Voix.accroche}</em></p>
    </div>
    <div class="prose reveal" style="max-width:680px; margin:0 auto 32px; text-align:center;">
      <p>${edition3.programme300Voix.texte}</p>
    </div>
    <div class="mini-indicators reveal">
      ${edition3.programme300Voix.indicateurs
        .map((i) => `<div class="mini-indicator"><span class="mini-indicator-icon">${i.icone}</span><span>${i.libelle}</span></div>`)
        .join("\n      ")}
    </div>
    <div style="text-align:center; margin-top:36px;">
      <p class="eyebrow reveal">Au programme</p>
    </div>
    <ul class="finalistes-list au-programme-list reveal">
      ${edition3.programme300Voix.auProgramme.map((item) => `<li>${item}</li>`).join("\n      ")}
    </ul>
    <p style="text-align:center; margin-top:32px;"><a href="${edition3.programme300Voix.ctaSecondaire.lien}" class="btn btn-primary btn-lg">${edition3.programme300Voix.ctaSecondaire.label}</a></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition3.objectifs.titre}</p>
      <p class="section-lead">${edition3.objectifs.objectifGlobal}</p>
    </div>
    <div class="ambitions-grid ambitions-grid-swipe">
      ${edition3.objectifs.specifiques
        .map(
          (o) => `<div class="ambition-card reveal"><h3>${o.titre}</h3><p>${o.description}</p></div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="candidature-3">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition3.candidatureFormat.titre}</p>
    </div>
    <div class="prose reveal">
      ${edition3.candidatureFormat.description.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
    <p style="text-align:center"><a href="/candidature/" class="btn btn-outline">En savoir plus sur la candidature →</a></p>
  </div>
</section>

<section class="section" id="parcours-2027">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition3.parcours2027.eyebrow}</p>
      <h2>${edition3.parcours2027.titre}</h2>
      <p class="section-lead">${edition3.parcours2027.chapeau}</p>
    </div>
    <ol class="timeline">
      ${edition3.parcours2027.etapes
        .map(
          (e, i) => `<li class="timeline-item reveal">
        <div class="timeline-marker">${String(i + 1).padStart(2, "0")}</div>
        <div class="timeline-content">
          <h3>${e.titre}</h3>
          <p>${e.description}</p>
        </div>
      </li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="cta-final" id="notify">
  <div class="container cta-final-inner">
    <div class="reveal">
      <h2>Soyez averti(e) dès l'ouverture</h2>
      <p>Programme complet, dates précises et ouverture des candidatures seront annoncés prochainement.</p>
    </div>
    <form class="contact-form reveal" id="notify-form" novalidate>
      <div class="form-row">
        <label for="notify-email">Votre e-mail</label>
        <input type="email" id="notify-email" name="email" required placeholder="vous@exemple.com">
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">M'avertir</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
`;
}

module.exports = { render };
