function render(data) {
  const { candidature } = data;
  const { champs, cta, confirmation } = candidature.formulaire;

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">${candidature.eyebrow}</p>
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ ${candidature.statutOuverture}
    </div>
    <form
      class="contact-form reveal"
      id="candidature-form"
      novalidate
      data-success-title="${confirmation.titre}"
      data-success-message="${confirmation.texte}"
    >
      <div class="form-row">
        <label for="cand-name">${champs.nom.label}</label>
        <input type="text" id="cand-name" name="name" required>
      </div>
      <div class="form-row">
        <label for="cand-whatsapp">${champs.whatsapp.label}</label>
        <input type="tel" id="cand-whatsapp" name="whatsapp" required>
      </div>
      <div class="form-row">
        <label for="cand-email">${champs.email.label}</label>
        <input type="email" id="cand-email" name="email" required>
      </div>
      <div class="form-row">
        <label for="cand-ville">${champs.ville.label}</label>
        <input type="text" id="cand-ville" name="ville" required>
      </div>
      <fieldset class="form-row form-radio-group">
        <legend>${champs.dejaParticipe.label}</legend>
        <div class="form-radio-options">
          ${champs.dejaParticipe.options
            .map(
              (option) => `<label class="form-radio-option">
            <input type="radio" name="deja-participe" value="${option}" required>
            <span>${option}</span>
          </label>`
            )
            .join("\n          ")}
        </div>
      </fieldset>
      <div class="form-row">
        <label for="cand-motivation">${champs.motivation.label}</label>
        <textarea id="cand-motivation" name="motivation" rows="4"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">${cta}</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
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
    <div class="prose reveal" style="text-align:center">
      <p>Retrouvez comment se sont déroulées les candidatures des éditions précédentes sur la page <a href="/editions/"><strong>Éditions</strong></a>.</p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
