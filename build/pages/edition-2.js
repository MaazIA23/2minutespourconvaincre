function render(data) {
  const { jury, marraine, intervenants, gagnants, programme, editionsIndex } = data;
  const edition2Meta = editionsIndex.editions.find((e) => e.slug === "2eme-edition");
  const edition2026 = gagnants.editions.find((e) => e.edition === "2026");

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Édition passée</p>
    <h1>2ème édition</h1>
    <p class="page-hero-lead">${edition2Meta.resume}</p>
    ${
      edition2Meta.rapportPdf
        ? `<a href="${edition2Meta.rapportPdf}" class="btn btn-primary" download>📄 ${edition2Meta.rapportLabel}</a>`
        : ""
    }
  </div>
</section>

<section class="section" id="deroule">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${programme.titre}</p>
      <h2>${programme.chapeau}</h2>
    </div>
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

<section class="section alt-bg" id="marraine">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${marraine.titre}</p>
      <h2>${marraine.nom}</h2>
    </div>
    <div class="prose reveal">
      ${marraine.bio.map((p) => `<p>${p}</p>`).join("\n      ")}
      ${marraine.citations.map((c) => `<blockquote>« ${c} »</blockquote>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="panel">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Le panel de discussion</p>
      <h2>${intervenants.panel.theme}</h2>
    </div>
    <div class="people-grid">
      ${intervenants.panel.intervenantes
        .map((i) => `<div class="people-card reveal"><h3>${i.nom}</h3><p>${i.titre}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="jury">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${jury.titre}</p>
    </div>
    <div class="people-grid">
      ${jury.membres
        .map((m) => `<div class="people-card reveal"><h3>${m.nom}</h3><p>${m.titre}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="palmares">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Palmarès</p>
      <h2>Les 8 finalistes</h2>
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
        <p>${p.portrait.recit}</p>
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
    <p style="text-align:center"><a href="/partenaires/" class="btn btn-outline">Voir les partenaires de cette édition →</a></p>
  </div>
</section>
`;
}

module.exports = { render };
