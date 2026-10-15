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
  <div class="container don-grille">
    <div class="don-texte reveal">
      <figure class="don-photo"><img src="/assets/img/galerie/2eme-edition/photo-05.jpg" alt="Le public de la 2ème édition de Deux Minutes Pour Convaincre" loading="lazy"></figure>
      <p class="eyebrow">Pourquoi soutenir</p>
      <h2>Une scène de plus pour <span class="or-fonce">les prochaines voix</span></h2>
      <p>Deux Minutes Pour Convaincre est organisé par La Muse Éloquente. Chaque don, même modeste, aide à faire grandir le concours et à offrir une scène plus grande aux prochains orateurs.</p>
      <ul class="don-points">
        <li>À partir de ${soutenir.montantMinimum.toLocaleString("fr-FR").replace(/\u202f|\s/g, "\u00a0")}&nbsp;FCFA</li>
        <li>Don anonyme ou en votre nom</li>
        <li>Paiement sécurisé</li>
      </ul>
    </div>
    <form class="contact-form reveal" id="don-form" novalidate>
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
