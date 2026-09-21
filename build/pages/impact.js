function render(data) {
  const { impact } = data;

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">${impact.hero.eyebrow}</p>
    <h1>${impact.hero.titre}</h1>
    <p class="page-hero-lead">${impact.hero.lead}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <h2>${impact.pourquoiLaParole.titre}</h2>
    </div>
    <div class="prose reveal">
      ${impact.pourquoiLaParole.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${impact.objectifs.eyebrow}</p>
      <h2>${impact.objectifs.titre}</h2>
    </div>
    <div class="ambitions-block reveal">
      <p class="ambitions-chapeau">${impact.objectifs.objectifGlobal}</p>
      <div class="ambitions-grid">
        ${impact.objectifs.specifiques
          .map((s) => `<div class="ambition-card"><h3>${s.titre}</h3><p>${s.description}</p></div>`)
          .join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="section photo-feature">
  <div class="container photo-feature-inner">
    <div class="photo-feature-media reveal">
      <img src="/assets/img/galerie/2eme-edition/photo-09.jpg" alt="Participants lors de la dictée intuitive, Deux Minutes Pour Convaincre">
    </div>
    <div class="photo-feature-copy">
      <div class="section-head reveal" style="text-align:left; margin-bottom:20px;">
        <p class="eyebrow">${impact.programme300Voix.eyebrow}</p>
        <h2>${impact.programme300Voix.titre}</h2>
      </div>
      <p class="reveal">${impact.programme300Voix.description}</p>
      <a href="${impact.programme300Voix.cta.lien}" class="btn btn-outline">${impact.programme300Voix.cta.label}</a>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${impact.portee.eyebrow}</p>
    <div class="stats-grid">
      ${impact.portee.chiffres
        .map((c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>La 3ème édition se construit maintenant.</h2>
      <p>Vous voulez monter sur scène ou soutenir le projet ? Il y a une place pour vous.</p>
      <div class="hero-ctas" style="justify-content: center;">
        <a href="/candidature/" class="btn btn-primary btn-lg">Candidater</a>
        <a href="/partenaires/#devenir-partenaire" class="btn btn-outline">Devenir partenaire</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
