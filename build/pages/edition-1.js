function render(data) {
  const { edition1, editionsIndex, gagnants } = data;
  const edition1Meta = editionsIndex.editions.find((e) => e.slug === "1ere-edition");
  const edition2025 = gagnants.editions.find((e) => e.edition === "2025");

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Édition passée</p>
    <h1>${edition1.titre}</h1>
    <p class="page-hero-lead">${edition1.sousTitre}</p>
    <div class="hero-meta">
      <span>📅 ${edition1.date}</span>
      <span>📍 ${edition1.lieu}</span>
    </div>
    ${
      edition1Meta.rapportPdf
        ? `<a href="${edition1Meta.rapportPdf}" class="btn btn-primary" download>📄 ${edition1Meta.rapportLabel}</a>`
        : ""
    }
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose reveal">
      ${edition1.recit.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container stats-grid">
    ${edition1.chiffres
      .map(
        (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
      )
      .join("\n    ")}
  </div>
</section>

${
  edition2025
    ? `<section class="section" id="palmares">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Palmarès</p>
      <h2>Les lauréats</h2>
      <p class="section-lead">${edition2025.intro}</p>
    </div>
    <div class="palmares-grid">
      ${edition2025.palmares
        .map(
          (p) => `<article class="palmares-card reveal">
        <p class="palmares-prix">${p.prix}</p>
        <h3>${p.nom}</h3>
        <p>${p.lots}</p>
      </article>`
        )
        .join("\n      ")}
    </div>
    <p class="prose reveal" style="text-align:center">${edition2025.autresParticipants}</p>
  </div>
</section>`
    : ""
}

<section class="section alt-bg">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ Pas de jury ni de marraine/parrain identifiés pour cette édition à ce stade. À compléter dès que le client les fournit.
    </div>
    <p style="text-align:center"><a href="/editions/" class="btn btn-outline">← Retour aux éditions</a></p>
  </div>
</section>
`;
}

module.exports = { render };
