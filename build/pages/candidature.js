function render(data) {
  const { site } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>Candidature</h1>
    <p class="page-hero-lead">Envie de monter sur la scène de « ${site.nomSite} » ? Déposez votre candidature.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ Contenu à confirmer : les conditions d'éligibilité, les étapes de sélection précises et le formulaire exact de cette page n'ont pas encore été fournis. Le rapport d'édition confirme le processus global (25 candidatures → présélection → coaching → 8 finalistes → 3 rounds : quarts, demi-finales, finale) mais pas le texte exact de l'appel à candidatures affiché sur le site.
    </div>
    <div class="prose reveal">
      <h2>Le processus, tel que vécu par l'édition 2026</h2>
      <p>Sur les candidatures reçues, un premier groupe de candidats est retenu à l'issue d'une phase de sélection. Suit un programme d'accompagnement et de coaching en art oratoire et en improvisation, encadré par plusieurs coachs, dont M. Georges Amlon, ancien Directeur Général de l'ORTB. À l'issue de ce parcours, les finalistes sont désignés pour la grande finale, où ils s'affrontent en duels successifs : quarts, demi-finales, puis finale.</p>
    </div>
    <form class="contact-form reveal" id="candidature-form" novalidate>
      <div class="form-row">
        <label for="cand-name">Nom complet</label>
        <input type="text" id="cand-name" name="name" required>
      </div>
      <div class="form-row">
        <label for="cand-email">Adresse e-mail</label>
        <input type="email" id="cand-email" name="email" required>
      </div>
      <div class="form-row">
        <label for="cand-phone">Téléphone / WhatsApp</label>
        <input type="tel" id="cand-phone" name="phone">
      </div>
      <div class="form-row">
        <label for="cand-message">Pourquoi voulez-vous participer ? (optionnel)</label>
        <textarea id="cand-message" name="message" rows="4"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">Envoyer ma candidature</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
`;
}

module.exports = { render };
