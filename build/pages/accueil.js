function render(data) {
  const { edition3, partenaires, editionsIndex, accueil } = data;

  return `
<section class="hero hero-photo-bg" id="top" style="background-image: linear-gradient(100deg, rgba(13,17,50,.8) 0%, rgba(13,17,50,.55) 40%, rgba(13,17,50,.1) 62%, rgba(13,17,50,0) 78%), url('/assets/img/hero/accueil.jpg')">
  <div class="container hero-inner hero-inner-single">
    <div class="hero-copy reveal">
      <p class="eyebrow">${edition3.teaser.eyebrow} — 3ème édition</p>
      <h1>${edition3.accroche}</h1>
      <p class="hero-lead">${edition3.teaser.accrocheCourte}</p>
      <div class="hero-meta">
        <span>📅 ${edition3.date}</span>
        <span>📍 ${edition3.lieu}</span>
      </div>
      <div class="hero-cta">
        <a href="/editions/3eme-edition/#notify" class="btn btn-primary btn-lg">Être informé(e) du lancement</a>
        <a href="/editions/" class="btn btn-outline btn-lg">Voir les éditions précédentes ↓</a>
      </div>
    </div>
  </div>
</section>

${
  accueil.videoPresentation
    ? `<section class="section video-feature" id="video">
  <div class="container">
    <div class="video-embed reveal">
      <iframe
        src="https://www.youtube.com/embed/${accueil.videoPresentation.youtubeId}"
        title="${accueil.videoPresentation.titre}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</section>`
    : ""
}

<section class="section presentation" id="presentation">
  <div class="container presentation-inner">
    <div class="presentation-copy reveal">
      <h2>${edition3.nouvelleAmbition.titre}</h2>
      <p>${edition3.nouvelleAmbition.resumeCourt}</p>
      <a href="/editions/3eme-edition/" class="btn btn-outline">Découvrir la 3ème édition</a>
    </div>
  </div>
</section>

<section class="section alt-bg photo-feature" id="nouveautes">
  <div class="container photo-feature-inner">
    <div class="photo-feature-media reveal">
      <img src="/assets/img/galerie/2eme-edition/photo-04.jpg" alt="Intervenante au micro sur scène, Deux Minutes Pour Convaincre">
    </div>
    <div class="photo-feature-copy">
      <div class="section-head reveal" style="text-align:left; margin-bottom:28px;">
        <p class="eyebrow">Cap sur 2027</p>
        <h2>Ce qui change pour la 3ème édition</h2>
      </div>
      <div class="nouveautes-grid nouveautes-grid-compact">
        ${edition3.nouveautes
          .map(
            (n) => `<div class="method-step reveal">
          <div class="step-number">${n.numero}</div>
          <h3>${n.titre}</h3>
          <p>${n.description}</p>
        </div>`
          )
          .join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="section" id="editions">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Depuis 2025</p>
      <h2>${editionsIndex.titre}</h2>
      <p class="section-lead">${editionsIndex.intro}</p>
    </div>
    <div class="editions-grid">
      ${editionsIndex.editions
        .map(
          (e) => `<article class="edition-card reveal">
        ${e.statut === "a-venir" ? '<span class="badge badge-upcoming">À venir</span>' : '<span class="badge badge-past">Édition passée</span>'}
        <h3>${e.label} <span class="edition-year">— ${e.annee}</span></h3>
        <p>${e.resume}</p>
        <a href="/editions/${e.slug}/" class="btn btn-outline">Voir la page</a>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg partenaires-teaser">
  <div class="container">
    <p class="eyebrow" style="text-align:center">Ils nous soutiennent</p>
    <div class="partner-marquee reveal">
      <div class="partner-marquee-track">
        ${partenaires.liste.map((p) => `<img src="${p.logo}" alt="${p.nom}" loading="lazy">`).join("\n        ")}
        ${partenaires.liste.map((p) => `<img src="${p.logo}" alt="" aria-hidden="true" loading="lazy">`).join("\n        ")}
      </div>
    </div>
    <p style="text-align:center"><a href="/partenaires/" class="btn btn-ghost">Voir tous nos partenaires →</a></p>
  </div>
</section>

<section class="cta-final" id="candidature-cta">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>Prêt(e) à monter sur scène en 2027 ?</h2>
      <p>Pour cette 3ème édition, la candidature se fait en vidéo : deux minutes, sur un thème de votre choix, pour nous convaincre.</p>
      <a href="/candidature/" class="btn btn-primary btn-lg">En savoir plus sur la candidature</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
