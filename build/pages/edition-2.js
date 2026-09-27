function render(data) {
  const { jury, marraine, intervenants, gagnants, programme, editionsIndex, galerie, edition2, partenaires, site } = data;
  const edition2Meta = editionsIndex.editions.find((e) => e.slug === "2eme-edition");
  const edition2026 = gagnants.editions.find((e) => e.edition === "2026");
  const galerie2026 = galerie["2eme-edition"];
  const edition2Historique = site.edition.historique.find((e) => e.numero === 2);

  return `
<section class="page-hero page-hero-photo-bg" style="background-position: 65% 12%; background-image: linear-gradient(100deg, rgba(13,17,50,.88) 0%, rgba(13,17,50,.65) 40%, rgba(13,17,50,.25) 62%, rgba(13,17,50,.1) 100%), url('/assets/img/galerie/2eme-edition/concours-orateur.jpg')">
  <div class="container">
    <p class="eyebrow">Édition passée</p>
    <h1>2ème édition</h1>
    <div class="hero-meta">
      <span>📅 ${edition2Historique.date}</span>
      <span>📍 ${edition2Historique.lieu}</span>
    </div>
  </div>
</section>

<section class="stats-band" id="chiffres">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${edition2.chiffresCles.eyebrow}</p>
    <div class="stats-grid stats-grid-4">
      ${edition2.chiffresCles.chiffres
        .map(
          (c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`
        )
        .join("\n      ")}
    </div>
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
    <div class="associated-grid${programme.evenementsAssocies.length === 3 ? " associated-grid-3" : ""}">
      ${programme.evenementsAssocies
        .map(
          (ev) => `<div class="associated-card reveal">
        <h3>${ev.titre}</h3>
        <p class="associated-meta">${ev.date}, ${ev.lieu}</p>
        <p>${ev.description}</p>
        ${
          ev.photos
            ? `<div class="associated-photos${ev.photos.length > 5 ? " associated-photos-preview" : ""}">${ev.photos.map((p) => `<span class="associated-photo"><img src="${p}" alt="${ev.titre}" loading="lazy"></span>`).join("")}</div>
        ${ev.photos.length > 5 ? `<button type="button" class="associated-photos-more">Voir toutes les photos (${ev.photos.length}) →</button>` : ""}`
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
      ${marraine.photo ? `<img src="${marraine.photo}" alt="${marraine.nom}" class="fondatrice-photo" loading="lazy">` : ""}
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
    <div class="jury-grid${jury.membres.length === 3 ? " jury-grid-3" : ""}">
      ${jury.membres
        .map(
          (m) => `<div class="jury-card reveal" tabindex="0">${m.photo ? `<img src="${m.photo}" alt="${m.nom}" loading="lazy">` : ""}<div class="jury-overlay"><h3>${m.nom}</h3><p>${m.titre}</p></div></div>`
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
        <p class="palmares-recit">${p.portrait.recit}</p>
        <button type="button" class="palmares-readmore" aria-expanded="false">Lire la suite →</button>
      </article>`
        )
        .join("\n      ")}
    </div>
    <div class="section-head reveal" style="margin-top:56px;">
      <h3>${edition2026.autresFinalistes.titre}</h3>
      <p class="section-lead">${edition2026.autresFinalistes.description}</p>
    </div>
    <div class="people-grid people-grid-secondary${edition2026.autresFinalistes.liste.length === 5 ? " people-grid-5" : ""}">
        ${edition2026.autresFinalistes.liste
          .map(
            (f) => `<div class="people-card reveal">${f.photo ? `<img src="${f.photo}" alt="${f.nom}" class="people-photo" loading="lazy">` : ""}<h3>${f.nom}</h3>${f.profession ? `<p>${f.profession}</p>` : ""}</div>`
          )
          .join("\n      ")}
      </div>
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

<section class="section" id="temoignages">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${edition2.temoignages.eyebrow}</p>
      <h2>${edition2.temoignages.titre}</h2>
    </div>
    ${
      edition2.temoignages.liste.length
        ? (() => {
            const card = (t) => `<div class="temoignage-card reveal">
        ${t.photo ? `<img src="${t.photo}" alt="${t.nom}" class="temoignage-photo" loading="lazy">` : ""}
        <blockquote>« ${t.citation} »</blockquote>
        ${t.citation.length > 220 ? `<button type="button" class="temoignage-readmore" aria-expanded="false">Lire la suite →</button>` : ""}
        <p class="temoignage-meta"><strong>${t.nom}</strong> — ${t.edition}, ${t.statut}</p>
        ${t.videoUrl ? `<a href="${t.videoUrl}" class="btn btn-ghost" target="_blank" rel="noopener">▶ Voir la vidéo</a>` : ""}
      </div>`;
            const cards = edition2.temoignages.liste.map(card).join("\n      ");
            return `<div class="temoignages-marquee reveal">
      <div class="temoignages-marquee-track">
        ${cards}
        ${cards}
      </div>
    </div>`;
          })()
        : `<div class="temoignages-grid">
      ${[1, 2, 3]
        .map(
          () => `<div class="temoignage-placeholder reveal">
        <span class="temoignage-placeholder-icon">🎥</span>
        <p>Témoignage à venir</p>
      </div>`
        )
        .join("\n      ")}
    </div>`
    }
  </div>
</section>

${
  edition2Meta.rapportPdf
    ? `<section class="section alt-bg" id="rapport">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Rapport de l'édition</p>
    </div>
    <p style="text-align:center"><a href="${edition2Meta.rapportPdf}" class="btn btn-primary btn-lg" download>📄 ${edition2Meta.rapportLabel}</a></p>
  </div>
</section>`
    : ""
}

<section class="section" id="partenaires-edition">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Partenaires de l'édition</p>
      <h2>Ils ont rendu cette édition possible</h2>
    </div>
    <div class="partenaires-grid">
      ${partenaires.liste
        .map((p) =>
          p.logo
            ? `<div class="partenaire-card partenaire-card-logo reveal"><img src="${p.logo}" alt="${p.nom}" loading="lazy"></div>`
            : `<div class="partenaire-card reveal"><span>${p.nom}</span></div>`
        )
        .join("\n      ")}
    </div>
    <p style="text-align:center"><a href="/partenaires/" class="btn btn-outline">Voir tous nos partenaires →</a></p>
  </div>
</section>
`;
}

module.exports = { render };
