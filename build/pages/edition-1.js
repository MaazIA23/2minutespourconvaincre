function render(data) {
  const { edition1, editionsIndex } = data;
  const edition1Meta = editionsIndex.editions.find((e) => e.slug === "1ere-edition");

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

<section class="section alt-bg">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ Pas de palmarès nominatif disponible pour cette édition à ce stade. À compléter dès que le client le fournit.
    </div>
    <p style="text-align:center"><a href="/editions/" class="btn btn-outline">← Retour aux éditions</a></p>
  </div>
</section>
`;
}

module.exports = { render };
