function render(data) {
  const { edition1 } = data;

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
      ⚠️ Pas de rapport PDF ni de palmarès nominatif disponibles pour cette édition à ce stade — à compléter dès que le client les fournit.
    </div>
    <p style="text-align:center"><a href="/editions/" class="btn btn-outline">← Retour aux éditions</a></p>
  </div>
</section>
`;
}

module.exports = { render };
