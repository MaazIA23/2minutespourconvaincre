function render(data) {
  const { aPropos, jury, marraine, intervenants, gagnants } = data;
  const conceptObjectifs = aPropos.sections.find((s) => s.id === "concept-objectifs");
  const leConcept = aPropos.sections.find((s) => s.id === "concept");
  const edition2026 = gagnants.editions.find((e) => e.edition === "2026");

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

<section class="section" id="marraine">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${marraine.titre}</p>
      <h2>${marraine.nom}</h2>
    </div>
    <div class="prose reveal">
      ${marraine.bio.map((p) => `<p>${p}</p>`).join("\n      ")}
      <p><em>${marraine.role2026}</em></p>
      ${marraine.citations.map((c) => `<blockquote>« ${c} »</blockquote>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="panel">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Le panel de discussion</p>
      <h2>${intervenants.panel.theme}</h2>
      <p class="section-lead">${intervenants.panel.intro}</p>
    </div>
    <div class="people-grid">
      ${intervenants.panel.intervenantes
        .map((i) => `<div class="people-card reveal"><h3>${i.nom}</h3><p>${i.titre}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="jury">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${jury.titre}</p>
      <h2>${jury.intro}</h2>
    </div>
    <div class="people-grid">
      ${jury.membres
        .map((m) => `<div class="people-card reveal"><h3>${m.nom}</h3><p>${m.titre}</p></div>`)
        .join("\n      ")}
    </div>
    <div class="people-grid people-grid-secondary">
      <div class="people-card reveal"><h3>${jury.coachFinalistes.nom}</h3><p>${jury.coachFinalistes.titre}</p></div>
      <div class="people-card reveal"><h3>${jury.maitreDeCeremonie.nom}</h3><p>${jury.maitreDeCeremonie.titre}</p></div>
      <div class="people-card reveal"><h3>${jury.moderatricePanel.nom} (${jury.moderatricePanel.age} ans)</h3><p>${jury.moderatricePanel.titre}</p></div>
    </div>
  </div>
</section>

<section class="section alt-bg" id="palmares-complet">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Palmarès complet — édition 2026</p>
      <h2>Les 8 finalistes</h2>
    </div>
    <div class="palmares-grid">
      ${edition2026.palmares
        .map(
          (p) => `<article class="palmares-card reveal">
        <p class="palmares-prix">${p.prix}</p>
        <h3>${p.nom}</h3>
        <p class="palmares-portrait-titre">${p.portrait.titre}</p>
        <blockquote>« ${p.portrait.citation} »</blockquote>
        <p>${p.portrait.recit}</p>
        <p class="palmares-lots"><strong>Lots :</strong> ${p.lots}</p>
      </article>`
        )
        .join("\n      ")}
    </div>
    <div class="prose reveal">
      <h3>${edition2026.autresFinalistes.intro}</h3>
      <ul class="finalistes-list">
        ${edition2026.autresFinalistes.noms.map((n) => `<li>${n}</li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
