function render(data) {
  const { edition3 } = data;

  return `
<section class="page-hero coming-soon-hero">
  <div class="container">
    <p class="eyebrow">${edition3.teaser.eyebrow}</p>
    <h1>3ème édition</h1>
    <div class="hero-meta">
      <span>📅 ${edition3.date}</span>
      <span>📍 ${edition3.lieu}</span>
    </div>
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
    <div class="nouveautes-grid nouveautes-grid-compact">
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

<section class="voix-hero" id="300-voix" style="background-image: linear-gradient(100deg, rgba(13,17,50,.92) 0%, rgba(13,17,50,.72) 45%, rgba(13,17,50,.4) 80%), url('${edition3.programme300Voix.photo}')">
  <div class="container voix-hero-inner">
    <p class="eyebrow reveal">${edition3.programme300Voix.eyebrow}</p>
    <h2 class="reveal">${edition3.programme300Voix.titre}</h2>
    <p class="voix-hero-accroche reveal">« ${edition3.programme300Voix.accroche} »</p>
    <p class="reveal">${edition3.programme300Voix.texte}</p>
    <div class="hero-ctas reveal">
      <a href="${edition3.programme300Voix.ctaPrincipal.lien}" class="btn btn-primary">${edition3.programme300Voix.ctaPrincipal.label} →</a>
      <a href="${edition3.programme300Voix.ctaSecondaire.lien}" class="btn btn-ghost">${edition3.programme300Voix.ctaSecondaire.label} ↓</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container voix-pourquoi reveal">
    <h2>${edition3.programme300Voix.pourquoi.titre}</h2>
    <p>${edition3.programme300Voix.pourquoi.texte}</p>
  </div>
</section>

<section class="section alt-bg" id="voix-snapshot">
  <div class="container voix-snapshot reveal">
    <span class="voix-number">${edition3.programme300Voix.snapshot.chiffre}</span>
    <span class="voix-number-label">${edition3.programme300Voix.snapshot.libelle}</span>
    <div class="voix-tags">
      ${edition3.programme300Voix.snapshot.tags.map((t) => `<span class="voix-tag">${t}</span>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Ce que nous transmettons</p>
      <h2>Quatre compétences, une même ambition</h2>
    </div>
    <div class="voix-transmet-grid">
      ${edition3.programme300Voix.transmission
        .map(
          (t) => `<div class="voix-transmet-card reveal">
        <span class="voix-transmet-number">${t.numero}</span>
        <h3>${t.titre}</h3>
        <p>${t.description}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Concrètement</p>
      <h2>Une session 300 Voix, concrètement ?</h2>
    </div>
    <ol class="timeline">
      ${edition3.programme300Voix.parcoursSession
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

<div class="reason-block reason-block--navy">
  <div class="container reason-block-inner reveal voix-reason-inner">
    <h3>${edition3.programme300Voix.impactPreview.titre}</h3>
    <p>${edition3.programme300Voix.impactPreview.texte}</p>
    <p style="margin-top:18px;"><a href="${edition3.programme300Voix.impactPreview.cta.lien}" class="method-step-link voix-link-on-navy">${edition3.programme300Voix.impactPreview.cta.label} →</a></p>
  </div>
</div>

<div class="reason-block reason-block--light">
  <div class="container reason-block-inner reveal voix-reason-inner">
    <h3>${edition3.programme300Voix.etablissements.titre}</h3>
    <p>${edition3.programme300Voix.etablissements.texte}</p>
    <p style="margin-top:22px;"><a href="${edition3.programme300Voix.etablissements.cta.lien}" class="btn btn-primary">${edition3.programme300Voix.etablissements.cta.label} →</a></p>
  </div>
</div>

<section class="section">
  <div class="container voix-pourquoi reveal">
    <h3>${edition3.programme300Voix.partenaires.titre}</h3>
    <p>${edition3.programme300Voix.partenaires.texte}</p>
    <p><a href="${edition3.programme300Voix.partenaires.cta.lien}" class="method-step-link">${edition3.programme300Voix.partenaires.cta.label} →</a></p>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>${edition3.programme300Voix.conclusion.lignes.join("<br>")}</h2>
      <p>${edition3.programme300Voix.conclusion.sousLigne}</p>
      <div class="hero-ctas" style="justify-content:center;">
        <a href="${edition3.programme300Voix.conclusion.ctaPrincipal.lien}" class="btn btn-primary btn-lg">${edition3.programme300Voix.conclusion.ctaPrincipal.label}</a>
        <a href="${edition3.programme300Voix.conclusion.ctaSecondaire.lien}" class="btn btn-outline">${edition3.programme300Voix.conclusion.ctaSecondaire.label}</a>
      </div>
    </div>
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
