function render(data) {
  const { edition3 } = data;

  return `
<section class="page-hero coming-soon-hero">
  <div class="container">
    <p class="eyebrow">${edition3.teaser.eyebrow}</p>
    <h1>${edition3.accroche}</h1>
    <p class="page-hero-lead">${edition3.teaser.accroche}</p>
    <div class="hero-meta">
      <span>📅 ${edition3.date} — ${edition3.dateContexte}</span>
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
      <h2>Ce qui change pour 2027</h2>
    </div>
    <div class="nouveautes-grid">
      ${edition3.nouveautes
        .map(
          (n) => `<div class="method-step reveal">
        <div class="step-number">${n.numero}</div>
        <h3>${n.titre}</h3>
        <p>${n.description}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition3.objectifs.titre}</p>
      <p class="section-lead">${edition3.objectifs.objectifGlobal}</p>
    </div>
    <div class="ambitions-grid ambitions-grid-light">
      ${edition3.objectifs.specifiques
        .map(
          (o) => `<div class="ambition-card ambition-card-light reveal"><h3>${o.titre}</h3><p>${o.description}</p></div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="candidature-3">
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
