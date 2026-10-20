function render(data) {
  const { aPropos } = data;
  const conceptObjectifs = aPropos.sections.find((s) => s.id === "concept-objectifs");
  const leConcept = aPropos.sections.find((s) => s.id === "concept");

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
      <h2>${conceptObjectifs.titre}</h2>
    </div>
    <div class="apropos-intro">
      <div class="prose reveal">
        ${conceptObjectifs.paragraphes.map((p) => `<p>${p}</p>`).join("\n        ")}
      </div>
      <figure class="apropos-photo reveal"><img src="/assets/img/palmares/2eme-edition/audrey-bonnialy.jpg" alt="Audrey Bonnialy, finaliste, au micro sur la scène de la 2ème édition de Deux Minutes Pour Convaincre" loading="lazy"></figure>
    </div>
    <div class="ambitions-block reveal">
      <p class="ambitions-chapeau">${conceptObjectifs.ambitions.chapeau}</p>
      <div class="ambitions-grid ambitions-alternees">
        ${conceptObjectifs.ambitions.liste
          .map(
            (a) => `<div class="ambition-card"><h3>${a.titre}</h3><p>${a.description}</p></div>`
          )
          .join("\n        ")}
      </div>
    </div>
    ${conceptObjectifs.cloture ? `<p class="prose reveal">${conceptObjectifs.cloture}</p>` : ""}
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>${leConcept.titre}</h2>
    </div>
    <div class="duel duel-grid reveal" aria-label="Deux orateurs, deux thèses opposées : pour et contre">
      <figure class="duel-cote duel-pour"><img src="/assets/img/palmares/2eme-edition/geovani-de-souza.jpg" alt="Geovani de Souza au micro, 2ème édition" loading="lazy"><figcaption>Pour</figcaption></figure>
      <span class="duel-vs" aria-hidden="true">VS</span>
      <figure class="duel-cote duel-contre"><img src="/assets/img/palmares/2eme-edition/anita-dadele.jpg" alt="Anita Dadélé au micro, 2ème édition" loading="lazy"><figcaption>Contre</figcaption></figure>
    </div>
    <p class="duel-legende reveal">Un thème. <strong>Deux thèses.</strong> 120 secondes chacun pour convaincre.</p>
    <div class="prose reveal">
      ${leConcept.paragraphes.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
    <p class="apropos-editions reveal"><a href="/editions/" class="acc-lien">Voir les éditions <span aria-hidden="true">→</span></a></p>
  </div>
</section>

`;
}

module.exports = { render };
