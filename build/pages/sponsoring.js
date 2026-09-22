function slugForPalier(nom) {
  if (nom === "Sponsor Officiel") return "officiel";
  if (nom === "Sponsor Platinum") return "platinum";
  if (nom === "Sponsor Or") return "or";
  if (nom === "Sponsor Argent") return "argent";
  if (nom === "Topaze Bleue") return "topaze";
  if (nom === "Contributeur") return "contributeur";
  return "";
}

function render(data) {
  const { sponsoring } = data;

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Partenaires</p>
    <h1>${sponsoring.titre}</h1>
    <p class="page-hero-lead">${sponsoring.sousTitre}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sponsoring-grid">
      ${sponsoring.paliers
        .map(
          (p) => `<article class="sponsoring-card sponsoring-card-${slugForPalier(p.nom)} reveal">
        <div class="sponsoring-card-head">
          <span class="sponsoring-badge">${p.nom}</span>
          <p class="sponsoring-price">${p.montant}</p>
        </div>
        <ul>
          ${p.avantages.map((a) => `<li>${a}</li>`).join("\n          ")}
        </ul>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>Envie d'en savoir plus ?</h2>
      ${
        sponsoring.dossierSponsoringPdf
          ? `<a href="${sponsoring.dossierSponsoringPdf}" class="btn btn-primary btn-lg" download>📄 ${sponsoring.ctaLabel}</a>`
          : `<button type="button" class="btn btn-primary btn-lg" disabled>📄 ${sponsoring.ctaLabel}</button>
      <p style="max-width:480px; margin:16px auto 0; font-size:0.88rem; color:var(--ink-soft);">Dossier disponible très prochainement.</p>`
      }
      <p style="margin-top:24px"><a href="/partenaires/#devenir-partenaire" class="btn btn-outline">Devenir partenaire →</a></p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
