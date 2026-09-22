function render(data) {
  const { impact } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${impact.hero.titre}</h1>
    <p class="page-hero-lead">${impact.hero.sousTitre}</p>
    <p style="max-width:680px; color:rgba(255,255,255,0.75); margin:16px 0 0;">${impact.hero.intro}</p>
  </div>
</section>

<section class="stats-band" id="chiffres">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${impact.chiffresCles.eyebrow}</p>
    <div class="stats-grid">
      ${impact.chiffresCles.chiffres
        .map((c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="editions">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.editions.eyebrow}</p>
      <h2>${impact.editions.titre}</h2>
    </div>
    <div class="editions-grid editions-grid-2">
      ${impact.editions.liste
        .map(
          (e) => `<article class="edition-card reveal">
        <span class="badge badge-past">Édition passée</span>
        <h3>${e.label} <span class="edition-year">(${e.annee})</span></h3>
        <p style="margin:4px 0">📅 ${e.date} · 📍 ${e.lieu}</p>
        <p style="margin:0 0 10px">${e.participants}</p>
        <p class="palmares-prix" style="margin-bottom:4px">Gagnant</p>
        <p style="margin:0 0 14px; font-weight:700; color:var(--navy-950)">${e.gagnant}</p>
        <a href="${e.lien}" class="btn btn-outline">Voir la page</a>
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
    <div class="temoignages-grid">
      ${
        impact.temoignages.liste.length
          ? impact.temoignages.liste
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

<section class="section alt-bg photo-feature photo-feature-compact" id="impact-2027">
  <div class="container photo-feature-inner">
    <div class="photo-feature-media reveal">
      <img src="/assets/img/galerie/2eme-edition/photo-09.jpg" alt="Participants lors de la dictée intuitive, Deux Minutes Pour Convaincre" loading="lazy">
    </div>
    <div class="photo-feature-copy">
      <div class="section-head reveal" style="text-align:left; margin-bottom:20px;">
        <p class="eyebrow">${impact.impact2027.eyebrow}</p>
        <h2>${impact.impact2027.titre}</h2>
      </div>
      <p class="reveal">${impact.impact2027.description}</p>
      <a href="${impact.impact2027.cta.lien}" class="btn btn-outline">${impact.impact2027.cta.label}</a>
    </div>
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
