const { listeChiffres } = require("../chiffres");
function render(data) {
  const { impact, editionsIndex } = data;
  const editionsPassees = editionsIndex.editions.filter((e) => e.statut === "passee");

  return `
<section class="page-hero">
  <div class="container">
    <h1>${impact.hero.titre}</h1>
    <p class="page-hero-lead">${impact.hero.sousTitre}</p>
    <p style="max-width:680px; color:rgba(255,255,255,0.75); margin:16px 0 0;">${impact.hero.intro}</p>
  </div>
</section>

<section class="stats-band stats-band-clair" id="chiffres">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${impact.chiffresCles.eyebrow}</p>
    ${listeChiffres(impact.chiffresCles.chiffres)}
  </div>
</section>

<section class="section alt-bg" id="histoire">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.parcours.eyebrow}</p>
      <h2>${impact.parcours.titre}</h2>
    </div>
    <ol class="frise frise-grid">
      ${impact.parcours.etapes
        .map((e, i) => `<li class="frise-etape reveal" style="--delai:${(i * 0.1).toFixed(2)}s">
        <span class="frise-repere">${e.repere}</span>
        <h3>${e.titre}</h3>
        <p>${e.description}</p>
      </li>`)
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section leviers" id="leviers">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.leviers.eyebrow}</p>
      <h2>${impact.leviers.titre}</h2>
    </div>
    <ol class="leviers-liste leviers-grid">
      ${impact.leviers.liste
        .map((l, i) => `<li class="reveal"><span class="leviers-num">${String(i + 1).padStart(2, "0")}</span><h3>${l.titre}</h3><p>${l.description}</p></li>`)
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section" id="editions">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.editions.eyebrow}</p>
      <h2>${impact.editions.titre}</h2>
    </div>
    <div class="editions-grid editions-grid-2">
      ${editionsPassees
        .map(
          (e) => `<article class="edition-card reveal">
        <div class="edition-card-media">
          <img src="${e.photo}" alt="${e.label}" loading="lazy"${e.photoPosition ? ` style="object-position:${e.photoPosition}"` : ""}>
        </div>
        <div class="edition-card-body">
          <span class="badge badge-past">Édition passée</span>
          <h3>${e.label} <span class="edition-year">(${e.annee})</span></h3>
          <p>${e.resume}</p>
          <a href="/editions/${e.slug}/" class="edition-card-link">Voir la page →</a>
        </div>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.ceQueLaParolePeutChanger.eyebrow}</p>
      <h2>${impact.ceQueLaParolePeutChanger.titre}</h2>
    </div>
    <div class="ambitions-grid${impact.ceQueLaParolePeutChanger.blocs.length === 3 ? " ambitions-grid-3" : ""}">
      ${impact.ceQueLaParolePeutChanger.blocs
        .map((b) => `<div class="ambition-card ambition-card-light reveal"><h3>${b.titre}</h3><p>${b.description}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="temoignages">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.temoignages.eyebrow}</p>
      <h2>${impact.temoignages.titre}</h2>
    </div>
    ${
      impact.temoignages.liste.length
        ? (() => {
            const card = (t) => `<div class="temoignage-card reveal">
        ${t.photo ? `<img src="${t.photo}" alt="${t.nom}" class="temoignage-photo" loading="lazy">` : ""}
        <blockquote>« ${t.citation} »</blockquote>
        ${t.citation.length > 220 ? `<button type="button" class="temoignage-readmore" aria-expanded="false">Lire la suite →</button>` : ""}
        <p class="temoignage-meta"><strong>${t.nom}</strong> — ${t.edition}, ${t.statut}</p>
        ${t.videoUrl ? `<a href="${t.videoUrl}" class="btn btn-ghost" target="_blank" rel="noopener">▶ Voir la vidéo</a>` : ""}
      </div>`;
            const cards = impact.temoignages.liste.map(card).join("\n      ");
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

<section class="acc-pleine acc-voix" id="impact-2027">
  <img src="${data.edition3.programme300Voix.photo}" alt="Une jeune femme prend la parole devant ses camarades" loading="lazy" class="acc-pleine-photo">
  <div class="container acc-pleine-texte" data-reveal>
    <p class="acc-surtitre acc-surtitre-or">${data.edition3.programme300Voix.eyebrow}</p>
    <h2>${data.edition3.programme300Voix.titre}</h2>
    <p class="acc-chapo">${data.edition3.programme300Voix.accroche}</p>
    <a href="/editions/3eme-edition/#300-voix" class="btn btn-primary btn-lg">Découvrir 300 Voix</a>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>Vous souhaitez contribuer à cet impact ?</h2>
      <a href="/partenaires/#devenir-partenaire" class="btn btn-primary btn-lg">Devenir partenaire →</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
