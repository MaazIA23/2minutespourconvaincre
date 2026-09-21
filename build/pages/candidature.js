function render(data) {
  const { candidature, site } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
    <a href="#formulaire" class="btn btn-primary btn-lg">Je veux candidater →</a>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${candidature.parcours.eyebrow}</p>
      <h2>${candidature.parcours.titre}</h2>
    </div>
    <ol class="timeline">
      ${candidature.parcours.etapes
        .map(
          (e, i) => `<li class="timeline-item reveal">
        <div class="timeline-marker">${String(i + 1).padStart(2, "0")}</div>
        <div class="timeline-content">
          <h3>${e.titre}</h3>
        </div>
      </li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="section-head reveal">
      <h2>${candidature.nouveauFormat.titre}</h2>
    </div>
    <p class="callout-statement reveal">${candidature.nouveauFormat.accroche}</p>
    <div class="prose reveal">
      ${candidature.nouveauFormat.description.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${candidature.conseilsVideo.eyebrow}</p>
    </div>
    <div class="ambitions-grid">
      ${candidature.conseilsVideo.liste
        .map((c) => `<div class="ambition-card reveal"><h3>${c.titre}</h3><p>${c.description}</p></div>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section alt-bg" id="formulaire">
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
    <p style="text-align:center; margin-top:18px; font-size:0.88rem; color:var(--ink-soft);">
      Une question ? <a href="https://wa.me/${site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" target="_blank" rel="noopener" style="font-weight:700; color:var(--navy-950);">Contactez-nous sur WhatsApp</a>.
    </p>
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
