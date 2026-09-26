function statusBadge(statut) {
  return statut === "a-venir"
    ? '<span class="badge badge-upcoming">À venir</span>'
    : '<span class="badge badge-past">Édition passée</span>';
}

function render(data) {
  const { editionsIndex } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${editionsIndex.titre}</h1>
    <p class="page-hero-lead">${editionsIndex.intro}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="editions-grid">
      ${editionsIndex.editions
        .map(
          (e) => `<article class="edition-card reveal">
        <div class="edition-card-media">
          <img src="${e.photo}" alt="${e.label}" loading="lazy">
        </div>
        <div class="edition-card-body">
          ${statusBadge(e.statut)}
          <h2>${e.label} <span class="edition-year">(${e.annee})</span></h2>
          <p>${e.resume}</p>
          <a href="/editions/${e.slug}/" class="edition-card-link">Voir la page →</a>
        </div>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>
`;
}

module.exports = { render };
