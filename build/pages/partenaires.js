function render(data) {
  const { partenaires } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${partenaires.titre}</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose reveal">
      ${partenaires.intro.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
    <div class="partenaires-grid">
      ${partenaires.liste
        .map(
          (p) => `<div class="partenaire-card reveal"><span>${p.nom}</span>${p.type ? `<small>${p.type}</small>` : ""}</div>`
        )
        .join("\n      ")}
    </div>
    <p class="prose reveal remerciement">${partenaires.remerciement}</p>
  </div>
</section>
`;
}

module.exports = { render };
