function render(data) {
  const { edition1, editionsIndex, gagnants, galerie } = data;
  const edition1Meta = editionsIndex.editions.find((e) => e.slug === "1ere-edition");
  const edition2025 = gagnants.editions.find((e) => e.edition === "2025");
  const galerie2025 = galerie["1ere-edition"];

  return `
<section class="page-hero page-hero-photo-bg" style="background-image: linear-gradient(100deg, rgba(13,17,50,.88) 0%, rgba(13,17,50,.65) 40%, rgba(13,17,50,.25) 62%, rgba(13,17,50,.1) 100%), url('/assets/img/galerie/1ere-edition/photo-09.jpg')">
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

<section class="stats-band" id="chiffres">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">Chiffres clés</p>
    <div class="stats-grid${edition1.chiffres.length === 4 ? " stats-grid-4" : ""}">
      ${edition1.chiffres
        .map(
          (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
        )
        .join("\n      ")}
    </div>
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
    <div class="palmares-grid${edition2025.palmares.length < 3 ? " palmares-grid-2" : ""}">
      ${edition2025.palmares
        .map(
          (p) => `<article class="palmares-card reveal">
        ${p.photo ? `<img src="${p.photo}" alt="${p.nom}" class="palmares-photo" loading="lazy">` : ""}
        <p class="palmares-prix">${p.prix}</p>
        <h3>${p.nom}</h3>
        <p>${p.lots}</p>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
    : ""
}

${
  galerie2025
    ? `<section class="section alt-bg" id="galerie">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${galerie2025.titre}</p>
      <h2>${galerie2025.sousTitre}</h2>
    </div>
    <div class="galerie-grid">
      ${galerie2025.photos
        .map((p) => `<figure class="galerie-item reveal"><img src="${p.fichier}" alt="${p.alt}" loading="lazy"></figure>`)
        .join("\n      ")}
    </div>
    <p class="galerie-credit reveal">${galerie2025.credit}</p>
  </div>
</section>`
    : ""
}

<section class="section" id="temoignages">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition1.temoignages.eyebrow}</p>
      <h2>${edition1.temoignages.titre}</h2>
    </div>
    <div class="temoignages-grid">
      ${
        edition1.temoignages.liste.length
          ? edition1.temoignages.liste
              .map(
                (t) => `<div class="temoignage-card reveal">
        ${t.photo ? `<img src="${t.photo}" alt="${t.nom}" class="temoignage-photo" loading="lazy">` : ""}
        <blockquote>« ${t.citation} »</blockquote>
        <p class="temoignage-meta"><strong>${t.nom}</strong> — ${t.edition}, ${t.statut}</p>
        ${t.videoUrl ? `<a href="${t.videoUrl}" class="btn btn-ghost" target="_blank" rel="noopener">▶ Voir la vidéo</a>` : ""}
      </div>`
              )
              .join("\n      ")
          : [1, 2, 3]
              .map(
                () => `<div class="temoignage-placeholder reveal">
        <span class="temoignage-placeholder-icon">🎥</span>
        <p>Témoignage à venir</p>
      </div>`
              )
              .join("\n      ")
      }
    </div>
  </div>
</section>

${
  edition1Meta.rapportPdf
    ? `<section class="section alt-bg" id="rapport">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Rapport de l'édition</p>
    </div>
    <p style="text-align:center"><a href="${edition1Meta.rapportPdf}" class="btn btn-primary btn-lg" download>📄 ${edition1Meta.rapportLabel}</a></p>
  </div>
</section>`
    : ""
}

<section class="section">
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
