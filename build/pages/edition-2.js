function render(data) {
  const { jury, marraine, intervenants, gagnants, programme, editionsIndex, galerie } = data;
  const edition2Meta = editionsIndex.editions.find((e) => e.slug === "2eme-edition");
  const edition2026 = gagnants.editions.find((e) => e.edition === "2026");
  const galerie2026 = galerie["2eme-edition"];

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
          ${e.image ? `<img src="${e.image}" alt="${e.titre}" class="timeline-photo" loading="lazy">` : ""}
        </div>
      </li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section" id="evenements-associes">
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
        <p class="associated-meta">${ev.date}, ${ev.lieu}</p>
        <p>${ev.description}</p>
        ${
          ev.photos
            ? `<div class="associated-photos">${ev.photos.map((p) => `<span class="associated-photo"><img src="${p}" alt="${ev.titre}" loading="lazy"></span>`).join("")}</div>`
            : ""
        }
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="marraine">
  <div class="container">
    <div class="fondatrice-layout reveal">
      ${marraine.photo ? `<img src="${marraine.photo}" alt="${marraine.nom}" class="fondatrice-photo">` : ""}
      <div class="fondatrice-copy">
        <p class="eyebrow">${marraine.titre}</p>
        <h2>${marraine.nom}</h2>
      </div>
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
      ${
        jury.moderatricePanel
          ? `<div class="people-card reveal">${jury.moderatricePanel.photo ? `<img src="${jury.moderatricePanel.photo}" alt="${jury.moderatricePanel.nom}" class="people-photo" loading="lazy">` : ""}<span class="badge badge-upcoming" style="margin-bottom:10px;">Modératrice</span><h3>${jury.moderatricePanel.nom}, ${jury.moderatricePanel.age} ans</h3><p>${jury.moderatricePanel.titre}</p></div>`
          : ""
      }
      ${intervenants.panel.intervenantes
        .map(
          (i) => `<div class="people-card reveal">${i.photo ? `<img src="${i.photo}" alt="${i.nom}" class="people-photo" loading="lazy">` : ""}<h3>${i.nom}</h3><p>${i.titre}</p></div>`
        )
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
        .map(
          (m) => `<div class="people-card reveal">${m.photo ? `<img src="${m.photo}" alt="${m.nom}" class="people-photo" loading="lazy">` : ""}<h3>${m.nom}</h3><p>${m.titre}</p></div>`
        )
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
        ${p.photo ? `<img src="${p.photo}" alt="${p.nom}" class="palmares-photo" loading="lazy">` : ""}
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

<section class="section alt-bg" id="galerie">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${galerie2026.titre}</p>
      <h2>${galerie2026.sousTitre}</h2>
    </div>
    <div class="galerie-grid">
      ${galerie2026.photos
        .map((p) => `<figure class="galerie-item reveal"><img src="${p.fichier}" alt="${p.alt}" loading="lazy"></figure>`)
        .join("\n      ")}
    </div>
    <p class="galerie-credit reveal">${galerie2026.credit}</p>
  </div>
</section>
`;
}

module.exports = { render };
