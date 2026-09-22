function render(data) {
  const { partenaires, site } = data;
  const typeOptions = partenaires.formulaire.typesPartenariat
    .map((t) => `<option value="${t}">${t}</option>`)
    .join("");

  return `
<section class="page-hero">
  <div class="container">
    <h1>${partenaires.hero.titre}</h1>
    <p class="page-hero-lead">${partenaires.hero.sousTitre}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${partenaires.pourquoiSoutenir.eyebrow}</p>
    </div>
    <div class="ambitions-grid">
      ${partenaires.pourquoiSoutenir.liste
        .map((b) => `<div class="ambition-card reveal"><h3>${b.titre}</h3><p>${b.description}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container">
    <p class="eyebrow reveal" style="text-align:center; margin-bottom:28px;">${partenaires.chiffresCles.eyebrow}</p>
    <div class="stats-grid stats-grid-4">
      ${partenaires.chiffresCles.chiffres
        .map((c) => `<div class="stat-card reveal"><span class="stat-value">${c.valeur}</span><span class="stat-label">${c.libelle}</span></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${partenaires.formesPartenariat.eyebrow}</p>
    </div>
    <div class="nouveautes-grid">
      ${partenaires.formesPartenariat.liste
        .map((f) => `<div class="method-step reveal"><h3>${f.titre}</h3><p>${f.description}</p></div>`)
        .join("\n      ")}
    </div>
    <p style="text-align:center; margin-top:30px"><a href="/partenaires/sponsoring/" class="btn btn-outline">Découvrir nos offres de sponsoring →</a></p>
  </div>
</section>

<section class="section" id="ils-nous-font-confiance">
  <div class="container">
    <div class="section-head reveal">
      <h2>Ils nous font confiance</h2>
    </div>
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

<section class="section alt-bg" id="devenir-partenaire">
  <div class="container">
    <div class="section-head reveal">
      <h2>${partenaires.formulaire.titre}</h2>
      <p class="section-lead">${partenaires.formulaire.sousTitre}</p>
    </div>
    <form class="contact-form reveal" id="partenaire-form" novalidate>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="part-nom">Nom</label>
          <input type="text" id="part-nom" name="nom" required>
        </div>
        <div class="form-row">
          <label for="part-prenom">Prénom</label>
          <input type="text" id="part-prenom" name="prenom" required>
        </div>
      </div>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="part-organisation">Organisation</label>
          <input type="text" id="part-organisation" name="organisation" required>
        </div>
        <div class="form-row">
          <label for="part-fonction">Fonction</label>
          <input type="text" id="part-fonction" name="fonction">
        </div>
      </div>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="part-email">Email</label>
          <input type="email" id="part-email" name="email" required>
        </div>
        <div class="form-row">
          <label for="part-telephone">Téléphone</label>
          <input type="tel" id="part-telephone" name="telephone">
        </div>
      </div>
      <div class="form-row">
        <label for="part-type">Type de partenariat</label>
        <select id="part-type" name="type" required>
          <option value="" disabled selected>Sélectionnez une option</option>
          ${typeOptions}
        </select>
      </div>
      <div class="form-row">
        <label for="part-message">Message</label>
        <textarea id="part-message" name="message" rows="4"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">${partenaires.formulaire.cta}</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
    <p style="text-align:center; margin-top:18px; font-size:0.88rem; color:var(--ink-soft);">
      Vous préférez échanger directement ? <a href="https://wa.me/${site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" target="_blank" rel="noopener" style="font-weight:700; color:var(--navy-950);">Écrivez-nous sur WhatsApp</a>.
    </p>
  </div>
</section>

<section class="cta-final">
  <div class="container cta-final-inner" style="grid-template-columns: 1fr; text-align: center;">
    <div class="reveal">
      <h2>${partenaires.sectionFinale.titre}</h2>
      ${
        partenaires.sectionFinale.dossierPdf
          ? `<a href="${partenaires.sectionFinale.dossierPdf}" class="btn btn-primary btn-lg" download>📄 ${partenaires.sectionFinale.ctaLabel}</a>`
          : `<p style="max-width:520px; margin:0 auto;">Le dossier de partenariat est en cours de préparation. En attendant, l'équipe 2MPC se fera un plaisir de vous présenter le projet en détail.</p>`
      }
    </div>
  </div>
</section>
`;
}

module.exports = { render };
