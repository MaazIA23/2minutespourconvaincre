function render(data) {
  const { aPropos } = data;
  const conceptObjectifs = aPropos.sections.find((s) => s.id === "concept-objectifs");
  const leConcept = aPropos.sections.find((s) => s.id === "concept");

  return `
<section class="page-hero">
  <div class="container">
    <h1>${aPropos.titre}</h1>
    <p class="page-hero-lead">${aPropos.sousTitre}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${conceptObjectifs.titre}</p>
      <h2>${conceptObjectifs.sousTitre}</h2>
    </div>
    <div class="prose reveal">
      ${conceptObjectifs.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
    <div class="ambitions-block reveal">
      <p class="ambitions-chapeau">${conceptObjectifs.ambitions.chapeau}</p>
      <div class="ambitions-grid">
        ${conceptObjectifs.ambitions.liste
          .map(
            (a) => `<div class="ambition-card"><h3>${a.titre}</h3><p>${a.description}</p></div>`
          )
          .join("\n        ")}
      </div>
    </div>
    <p class="prose reveal">${conceptObjectifs.cloture}</p>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>${leConcept.titre}</h2>
    </div>
    <div class="prose reveal">
      ${leConcept.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>Jury, marraine, palmarès…</h2>
      <p>Le jury, la marraine, le panel et le palmarès complet sont propres à chaque édition. Retrouvez-les sur la page de l'édition qui vous intéresse.</p>
      <a href="/editions/" class="btn btn-primary btn-lg">Voir les éditions</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
