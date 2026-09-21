function render(data) {
  const { edition3, partenaires, editionsIndex, accueil, actualites } = data;

  return `
<section class="hero hero-photo-bg" id="top" style="background-image: linear-gradient(100deg, rgba(13,17,50,.8) 0%, rgba(13,17,50,.55) 40%, rgba(13,17,50,.1) 62%, rgba(13,17,50,0) 78%), url('/assets/img/hero/accueil.jpg')">
  <div class="container hero-inner hero-inner-single">
    <div class="hero-copy reveal">
      <h1 class="hero-rotator" id="hero-rotator">${(edition3.accrochesRotatives || [edition3.accroche])
        .map((phrase, i) => `<span class="hero-rotator-phrase${i === 0 ? " is-active" : ""}">${phrase}</span>`)
        .join("")}</h1>
      <div class="hero-meta">
        <span>📅 ${edition3.date}</span>
      </div>
      ${
        edition3.dateCountdownISO
          ? `<div class="hero-countdown-block">
        <p class="eyebrow hero-countdown-label">3ème édition dans</p>
        <div class="hero-countdown" id="hero-countdown" data-target="${edition3.dateCountdownISO}">
          <div class="countdown-item"><span class="countdown-value" data-unit="days">00</span><span class="countdown-label">Jours</span></div>
          <div class="countdown-item"><span class="countdown-value" data-unit="hours">00</span><span class="countdown-label">Heures</span></div>
          <div class="countdown-item"><span class="countdown-value" data-unit="minutes">00</span><span class="countdown-label">Min</span></div>
          <div class="countdown-item"><span class="countdown-value" data-unit="seconds">00</span><span class="countdown-label">Sec</span></div>
        </div>
      </div>`
          : ""
      }
      <div class="hero-ctas reveal">
        <a href="/editions/3eme-edition/" class="btn btn-outline">Découvrir la 3ème édition</a>
        <a href="/partenaires/#devenir-partenaire" class="btn btn-ghost">Devenir partenaire →</a>
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

${
  accueil.chiffresCles
    ? `<section class="stats-band" id="chiffres">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${accueil.chiffresCles.eyebrow}</p>
    <div class="stats-grid stats-grid-5">
      ${accueil.chiffresCles.chiffres
        .map(
          (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
        )
        .join("\n      ")}
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
          ${n.titre.includes("300 Voix") ? `<a href="/editions/3eme-edition/#nouveautes" class="method-step-link">Découvrir 300 Voix →</a>` : ""}
        </div>`
          )
          .join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="section alt-bg" id="impact-teaser">
  <div class="container">
    <div class="section-head reveal">
      <h2>Au-delà de la scène</h2>
      <p class="section-lead">Deux Minutes Pour Convaincre ne se limite pas à une finale. Le projet grandit pour faire de la parole une compétence, un levier d'opportunités et un outil d'émancipation.</p>
    </div>
    <div class="ambitions-grid">
      <div class="ambition-card ambition-card-light reveal"><h3>Révéler les talents</h3><p>Identifier des profils à fort potentiel et leur offrir visibilité et réseau.</p></div>
      <div class="ambition-card ambition-card-light reveal"><h3>Former la jeunesse</h3><p>Transmettre les clés de la prise de parole, de l'argumentation et de la confiance en soi.</p></div>
      <div class="ambition-card ambition-card-light reveal"><h3>Créer des opportunités</h3><p>Inscrire chaque victoire dans une logique de mérite, de transmission et d'ascension.</p></div>
    </div>
    <p style="text-align:center"><a href="/impact/" class="btn btn-outline">Découvrir notre impact →</a></p>
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
        <h3>${e.label} <span class="edition-year">(${e.annee})</span></h3>
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
    <p class="partenaires-teaser-cta reveal">Vous souhaitez contribuer à la prochaine édition ?
      <a href="/partenaires/#devenir-partenaire">Devenir partenaire →</a></p>
  </div>
</section>

${
  actualites.liste.length
    ? `<section class="section" id="actualites">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Actualités</p>
      <h2>Les dernières nouvelles</h2>
    </div>
    <div class="actualites-grid">
      ${actualites.liste
        .slice()
        .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
        .slice(0, 3)
        .map(
          (a) => `<article class="actualite-card reveal">
        <img src="${a.image}" alt="${a.alt}" class="actualite-photo" loading="lazy">
        <div class="actualite-card-body">
          <div class="actualite-meta">
            <span class="badge badge-upcoming">${a.categorie}</span>
            <span class="actualite-date">${a.date}</span>
          </div>
          <h3>${a.titre}</h3>
          <p class="actualite-resume">${a.resume}</p>
        </div>
      </article>`
        )
        .join("\n      ")}
    </div>
    <p style="text-align:center"><a href="/actualites/" class="btn btn-outline">Voir toutes les actualités →</a></p>
  </div>
</section>`
    : ""
}

<section class="cta-final" id="candidature-cta">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal cta-final-pretext">
      <p class="eyebrow">La 3ème édition se construit maintenant.</p>
      <div class="hero-ctas" style="justify-content: center;">
        <a href="/candidature/" class="btn btn-outline">Candidater</a>
        <a href="/partenaires/#devenir-partenaire" class="btn btn-ghost">Devenir partenaire</a>
      </div>
    </div>
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
