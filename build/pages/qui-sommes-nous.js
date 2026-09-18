function render(data) {
  const { quiSommesNous } = data;
  const ag = quiSommesNous.agence;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${quiSommesNous.titre}</h1>
    <p class="page-hero-lead">${quiSommesNous.intro}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <img src="/assets/img/partenaires/la-muse-eloquente.jpg" alt="${ag.nom}" class="agency-logo">
      <p class="eyebrow">L'agence organisatrice</p>
      <h2>${ag.nom}</h2>
      <p class="section-lead">${ag.description}</p>
    </div>
    <div class="two-col reveal">
      <div class="vision-mission-card">
        <h3>Vision</h3>
        <p>${ag.vision}</p>
      </div>
      <div class="vision-mission-card">
        <h3>Mission</h3>
        <p>${ag.mission}</p>
      </div>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container stats-grid">
    ${ag.chiffres
      .map(
        (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
      )
      .join("\n    ")}
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>Ce que nous proposons</h2>
    </div>
    <div class="offer-grid">
      ${ag.ceQueNousProposons
        .map(
          (cat) => `<div class="offer-card reveal">
        <h3>${cat.categorie}</h3>
        <ul>${cat.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`
        )
        .join("\n      ")}
    </div>
    <p class="prose reveal" style="text-align:center"><strong>${ag.ctaTexte}</strong></p>
  </div>
</section>

<section class="section" id="fondatrice">
  <div class="container">
    <div class="fondatrice-layout reveal">
      ${quiSommesNous.fondatrice.photo ? `<img src="${quiSommesNous.fondatrice.photo}" alt="${quiSommesNous.fondatrice.nom}" class="fondatrice-photo">` : ""}
      <div class="fondatrice-copy">
        <p class="eyebrow">La fondatrice</p>
        <h2>${quiSommesNous.fondatrice.nom}</h2>
        <p class="section-lead" style="text-align:left; margin:0">${quiSommesNous.fondatrice.titre}</p>
      </div>
    </div>
    <div class="prose reveal">
      ${quiSommesNous.fondatrice.motIntroduction.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
    <div class="book-card reveal">
      <h3>${quiSommesNous.fondatrice.livre.titre}</h3>
      <p>${quiSommesNous.fondatrice.livre.description}</p>
      <p><em>${quiSommesNous.fondatrice.livre.disponibilite}</em></p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
