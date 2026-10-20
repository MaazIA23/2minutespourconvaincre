const { listeChiffres } = require("../chiffres");
function render(data) {
  const { quiSommesNous } = data;
  const ag = quiSommesNous.agence;
  const livre = quiSommesNous.fondatrice.livre;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${quiSommesNous.titre}</h1>
    <p class="page-hero-lead">${quiSommesNous.intro}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <img src="/assets/img/partenaires/la-muse-eloquente.jpg" alt="${ag.nom}" class="agency-logo" loading="lazy">
      <p class="eyebrow">L'agence organisatrice</p>
      <h2>${ag.nom}</h2>
      <p class="section-lead">${ag.description}</p>
    </div>
    <div class="two-col reveal">
      <div class="vision-mission-card">
        <h3>Vision</h3>
        <p>${ag.vision}</p>
      </div>
      <div class="vision-mission-card">
        <h3>Mission</h3>
        <p>${ag.mission}</p>
      </div>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container">
    ${listeChiffres(ag.chiffres)}
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>Ce que nous proposons</h2>
    </div>
    <div class="offer-grid">
      ${ag.ceQueNousProposons
        .map(
          (cat) => `<div class="offer-card reveal">
        <h3>${cat.categorie}</h3>
        <ul>${cat.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`
        )
        .join("\n      ")}
    </div>
    <div class="offre-cta reveal">
      <p><strong>${ag.ctaTexte}</strong></p>
      ${ag.cta ? `<a href="${ag.cta.lien}" target="_blank" rel="noopener" class="btn btn-primary btn-lg">${ag.cta.label} <span aria-hidden="true">↗</span></a>` : ""}
    </div>
  </div>
</section>

<section class="section" id="fondatrice">
  <div class="container">
    <div class="fondatrice-layout reveal">
      ${quiSommesNous.fondatrice.photo ? `<img src="${quiSommesNous.fondatrice.photo}" alt="${quiSommesNous.fondatrice.nom}" class="fondatrice-photo" loading="lazy">` : ""}
      <div class="fondatrice-copy">
        <p class="eyebrow">La fondatrice</p>
        <h2>${quiSommesNous.fondatrice.nom}</h2>
        <p class="section-lead" style="text-align:left; margin:0">${quiSommesNous.fondatrice.titre}</p>
      </div>
    </div>
    <div class="livre-bloc reveal">
      <figure class="livre-photo"><img src="${livre.photo}" alt="Le livre Chroniques d'une voix qui s'est révélée, de Mazidath Bello" loading="lazy"></figure>
      <div class="livre-texte">
        <p class="eyebrow">Son livre</p>
        <h3>Chroniques d'une voix<br>qui s'est <span class="or-texte">révélée</span></h3>
        <p class="manuscrit livre-tome">Tome 1 : De l'Ombre à la Scène</p>
        <p>${livre.description}</p>
        <p class="livre-dispo">${livre.disponibilite}</p>
        <div class="livre-actions">
          <a href="${livre.lienAchat}" class="btn btn-primary" target="_blank" rel="noopener">Se procurer le livre</a>
          <a href="/editions/2eme-edition/#evenements-associes" class="btn btn-outline">Voir le lancement</a>
        </div>
      </div>
    </div>
    ${
      livre.temoignages && livre.temoignages.length
        ? `<div class="livre-avis">
      <p class="eyebrow reveal">Premiers retours de lecture</p>
      <div class="livre-avis-liste">
        ${livre.temoignages
          .map((t) => `<figure class="livre-avis-carte reveal"><blockquote><p>« ${t.texte} »</p></blockquote><figcaption>${t.nom}<span>Lectrice</span></figcaption></figure>`)
          .join("\n        ")}
      </div>
    </div>`
        : ""
    }
  </div>
</section>

<section class="section alt-bg" id="equipe">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${quiSommesNous.equipe.eyebrow}</p>
      <h2>${quiSommesNous.equipe.titre}</h2>
    </div>
    <div class="equipe-defile equipe-grid">
    <button type="button" class="equipe-fleche equipe-prec" aria-label="Membres précédents" data-defile="-1">‹</button>
    <div class="people-grid equipe-piste" tabindex="0" aria-label="L'équipe, faites défiler">
      ${quiSommesNous.equipe.membres
        .map(
          (m) => `<div class="people-card reveal">${m.photo ? `<img src="${m.photo}" alt="${m.nom}" class="people-photo" loading="lazy">` : ""}<h3>${m.nom}</h3><p>${m.role}</p></div>`
        )
        .join("\n      ")}
    </div>
    <button type="button" class="equipe-fleche equipe-suiv" aria-label="Membres suivants" data-defile="1">›</button>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
