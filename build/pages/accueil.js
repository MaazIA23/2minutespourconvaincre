function render(data) {
  const { accueil, site, gagnants, partenaires } = data;
  const hero = accueil.hero;
  const presentation = accueil.sections.find((s) => s.id === "presentation");
  const stats = accueil.sections.find((s) => s.id === "stats");
  const chiffres = accueil.sections.find((s) => s.id === "chiffresEvocateurs");
  const edition2026 = gagnants.editions.find((e) => e.edition === "2026");

  const heroSubtitleHtml = hero.sousTitre.replace(
    hero.sousTitreAccent,
    `<mark>${hero.sousTitreAccent}</mark>`
  );

  return `
<section class="hero" id="top">
  <div class="hero-bg" aria-hidden="true">
    <div class="hero-glow glow-1"></div>
    <div class="hero-glow glow-2"></div>
  </div>
  <div class="container hero-inner">
    <div class="hero-copy reveal">
      <p class="eyebrow">${hero.eyebrow}</p>
      <h1>${hero.titre}</h1>
      <p class="hero-lead">${heroSubtitleHtml}</p>
      <div class="hero-meta">
        <span>📅 ${hero.date}</span>
        <span>📍 ${hero.lieu}</span>
      </div>
      <div class="hero-cta">
        <a href="/candidature/" class="btn btn-primary btn-lg">${hero.cta.label}</a>
        <a href="#presentation" class="btn btn-outline btn-lg">Découvrir le concept ↓</a>
      </div>
    </div>
  </div>
</section>

<section class="section presentation" id="presentation">
  <div class="container presentation-inner">
    <div class="presentation-copy reveal">
      <h2>${presentation.titre}</h2>
      ${presentation.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
      <a href="/a-propos/" class="btn btn-outline">${presentation.cta.label}</a>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container stats-grid">
    ${stats.chiffres
      .map(
        (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
      )
      .join("\n    ")}
  </div>
</section>

<section class="section chiffres" id="chiffres">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Édition ${chiffres.titre ? "" : ""}2026</p>
      <h2>${chiffres.titre}</h2>
      <p class="section-lead">${chiffres.intro}</p>
    </div>
    <div class="chiffres-grid">
      ${chiffres.chiffres
        .map(
          (c) => `<div class="chiffre-item reveal"><strong>${c.valeur}</strong><span>${c.libelle}</span></div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section palmares" id="palmares">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Palmarès 2026</p>
      <h2>Ils ont marqué cette édition</h2>
      <p class="section-lead">${edition2026.intro}</p>
    </div>
    <div class="palmares-grid">
      ${edition2026.palmares
        .map(
          (p) => `<article class="palmares-card reveal">
        <p class="palmares-prix">${p.prix}</p>
        <h3>${p.nom}</h3>
        <p class="palmares-portrait-titre">${p.portrait.titre}</p>
        <blockquote>« ${p.portrait.citation} »</blockquote>
      </article>`
        )
        .join("\n      ")}
    </div>
    <p class="palmares-more"><a href="/a-propos/#palmares-complet" class="btn btn-outline">Voir le palmarès complet et les 8 finalistes</a></p>
  </div>
</section>

<section class="section partenaires-teaser">
  <div class="container">
    <p class="eyebrow" style="text-align:center">Ils nous soutiennent</p>
    <ul class="partner-strip">
      ${partenaires.liste
        .slice(0, 10)
        .map((p) => `<li>${p.nom}</li>`)
        .join("\n      ")}
    </ul>
    <p style="text-align:center"><a href="/partenaires/" class="btn btn-ghost">Voir tous nos partenaires →</a></p>
  </div>
</section>

<section class="cta-final" id="candidature-cta">
  <div class="container cta-final-inner">
    <div class="reveal">
      <h2>Prêt(e) à monter sur scène ?</h2>
      <p>Le concours d'improvisation le plus attendu du Bénin revient. Envie de tenter votre chance ?</p>
      <a href="/candidature/" class="btn btn-primary btn-lg">Déposer ma candidature</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
