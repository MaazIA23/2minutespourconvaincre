function render(data) {
  const { partenaires, site } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${partenaires.titre}</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose reveal">
      ${partenaires.intro.map((p) => `<p>${p}</p>`).join("\n      ")}
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
    <p class="prose reveal remerciement">${partenaires.remerciement}</p>
  </div>
</section>

<section class="cta-final" id="devenir-partenaire">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>Vous souhaitez contribuer à la prochaine édition ?</h2>
      <p>Pour devenir partenaire de la 3ème édition, contactez-nous directement : nous étudions chaque proposition avec attention.</p>
      <a href="https://wa.me/${site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" class="btn btn-primary btn-lg" target="_blank" rel="noopener">Nous contacter sur WhatsApp</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
