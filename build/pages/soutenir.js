function render(data) {
  const { soutenir } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${soutenir.titre}</h1>
    <p class="page-hero-lead">${soutenir.sousTitre}</p>
  </div>
</section>

<section class="section" id="don">
  <div class="container">
    <form class="contact-form reveal" id="don-form" novalidate style="max-width:520px; margin:0 auto;">
      <div class="form-row">
        <label for="don-montant">Montant du don (FCFA)</label>
        <input type="number" id="don-montant" name="montant" min="${soutenir.montantMinimum}" step="100" value="${soutenir.montantMinimum}" required>
      </div>
      <div class="form-row">
        <label>Type de don</label>
        <div class="form-radio-group">
          <label class="form-radio"><input type="radio" name="don-mode" value="anonyme" required> Don anonyme</label>
          <label class="form-radio"><input type="radio" name="don-mode" value="nominatif" required> Don en mon nom</label>
        </div>
      </div>
      <div id="don-identite" class="form-row-pair" hidden>
        <div class="form-row">
          <label for="don-prenom">Prénom</label>
          <input type="text" id="don-prenom" name="prenom">
        </div>
        <div class="form-row">
          <label for="don-nom">Nom</label>
          <input type="text" id="don-nom" name="nom">
        </div>
      </div>
      <div id="don-email-row" class="form-row" hidden>
        <label for="don-email">Adresse e-mail</label>
        <input type="email" id="don-email" name="email">
        <p style="margin: 4px 0 0; font-size: 0.8rem; color: var(--ink-soft);">Pour vous adresser un merci automatique.</p>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block" id="don-submit">${soutenir.ctaLabel}</button>
      <p class="form-note" id="don-note" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
`;
}

module.exports = { render };
