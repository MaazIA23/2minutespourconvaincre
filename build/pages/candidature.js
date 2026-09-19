function render(data) {
  const { candidature, edition3 } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${candidature.nouveauFormat.titre}</p>
    </div>
    <div class="prose reveal">
      ${candidature.nouveauFormat.description.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ ${candidature.statutOuverture}
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
      <button type="submit" class="btn btn-primary btn-lg btn-block">${candidature.ctaNotify}</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose reveal" style="text-align:center">
      <p>Retrouvez comment se sont déroulées les candidatures des éditions précédentes sur la page <a href="/editions/"><strong>Éditions</strong></a>.</p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
