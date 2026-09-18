function render(data) {
  const { programme } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${programme.titre}</h1>
    <p class="page-hero-lead">${programme.sousTitre}</p>
    <p class="page-hero-chapeau">${programme.chapeau}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <ol class="timeline">
      ${programme.etapes
        .map(
          (e, i) => `<li class="timeline-item reveal">
        <div class="timeline-marker">${String(i + 1).padStart(2, "0")}</div>
        <div class="timeline-content">
          <h3>${e.titre}</h3>
          <p>${e.description}</p>
        </div>
      </li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Autour de l'événement</p>
      <h2>Événements associés</h2>
    </div>
    <div class="associated-grid">
      ${programme.evenementsAssocies
        .map(
          (ev) => `<div class="associated-card reveal">
        <h3>${ev.titre}</h3>
        <p class="associated-meta">${ev.date} — ${ev.lieu}</p>
        <p>${ev.description}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>
`;
}

module.exports = { render };
