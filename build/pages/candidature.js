function render(data) {
  const { candidature, site, gagnants } = data;
  const edition2026 = gagnants.editions.find((e) => e.numero === 2);
  const scenePhotos = edition2026
    ? [
        ...edition2026.palmares.map((p) => ({ nom: p.nom, photo: p.photo })),
        ...edition2026.autresFinalistes.liste,
      ]
    : [];

  return `
<section class="page-hero page-hero-photo-bg" style="background-image: linear-gradient(100deg, rgba(13,17,50,.88) 0%, rgba(13,17,50,.65) 40%, rgba(13,17,50,.25) 62%, rgba(13,17,50,.1) 100%), url('/assets/img/galerie/2eme-edition/concours-orateur.jpg')">
  <div class="container">
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
    <a href="#formulaire" class="btn btn-primary btn-lg">Je veux candidater →</a>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${candidature.prix.eyebrow}</p>
    </div>
    <div class="prize-card reveal">
      <span class="prize-icon">🏆</span>
      <h2>${candidature.prix.titre}</h2>
      <p>${candidature.prix.description}</p>
      <div class="prize-ticket">
        <span class="prize-ticket-icon">✈️</span>
        <div class="prize-ticket-text">
          <strong>${candidature.prix.recompense}</strong>
          <span>Paris, France 🇫🇷</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section alt-bg">
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
          ${e.description ? `<p>${e.description}</p>` : ""}
        </div>
      </li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">${candidature.criteres.eyebrow}</p>
      <h2>${candidature.criteres.titre}</h2>
    </div>
    <ul class="criteres-list reveal">
      ${candidature.criteres.liste.map((c) => `<li>${c}</li>`).join("\n      ")}
    </ul>
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

${
  scenePhotos.length
    ? `<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Elles et ils étaient sur cette scène</p>
      <h2>Les 8 finalistes de la 2ème édition</h2>
    </div>
    <div class="candidature-photos">
      ${scenePhotos
        .map(
          (p) => `<figure class="reveal">
        <img src="${p.photo}" alt="${p.nom}" loading="lazy">
        <figcaption>${p.nom}</figcaption>
      </figure>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
    : ""
}

<section class="section alt-bg">
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

<section class="section" id="formulaire">
  <div class="container">
    <div class="todo-banner reveal">
      📅 Candidatures ouvertes du <strong>${candidature.dateOuvertureCandidatures}</strong> au <strong>${candidature.dateLimiteCandidatures}</strong>
    </div>
    <form class="contact-form reveal" id="candidature-form" novalidate>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="cand-nom">Nom</label>
          <input type="text" id="cand-nom" name="nom" required>
        </div>
        <div class="form-row">
          <label for="cand-prenom">Prénom</label>
          <input type="text" id="cand-prenom" name="prenom" required>
        </div>
      </div>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="cand-profession">Profession</label>
          <select id="cand-profession" name="profession" required>
            <option value="" disabled selected>Sélectionnez une option</option>
            ${candidature.formulaire.professions.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
        </div>
        <div class="form-row">
          <label for="cand-pays">Pays de résidence</label>
          <input type="text" id="cand-pays" name="pays" placeholder="Bénin" required>
        </div>
      </div>
      <div class="form-row-pair">
        <div class="form-row">
          <label for="cand-email">Adresse e-mail</label>
          <input type="email" id="cand-email" name="email" required>
        </div>
        <div class="form-row">
          <label for="cand-phone">Numéro WhatsApp</label>
          <input type="tel" id="cand-phone" name="phone" required>
        </div>
      </div>
      <div class="form-row">
        <label for="cand-video">Lien de votre vidéo</label>
        <p style="margin: 0 0 8px; font-size: 0.85rem; color: var(--ink-soft);">${candidature.formulaire.videoInstructions}</p>
        <input type="url" id="cand-video" name="videoUrl" placeholder="https://..." required>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">${candidature.ctaSubmit}</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
    </form>
    <p style="text-align:center; margin-top:18px; font-size:0.88rem; color:var(--ink-soft);">
      Une question ? Consultez notre <a href="/faq/" style="font-weight:700; color:var(--navy-950);">FAQ</a> ou <a href="https://wa.me/${site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" target="_blank" rel="noopener" style="font-weight:700; color:var(--navy-950);">contactez-nous sur WhatsApp</a>.
    </p>
  </div>
</section>

<section class="section alt-bg">
  <div class="container">
    <div class="prose reveal" style="text-align:center">
      <p>Retrouvez comment se sont déroulées les candidatures des éditions précédentes sur la page <a href="/editions/"><strong>Éditions</strong></a>.</p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
