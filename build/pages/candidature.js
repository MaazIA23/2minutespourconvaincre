function render(data) {
  const { candidature, site, gagnants, edition3 } = data;
  const edition2026 = gagnants.editions.find((e) => e.numero === 2);
  const scenePhotos = edition2026
    ? [
        ...edition2026.palmares.map((p) => ({ nom: p.nom, profession: p.profession, photo: p.photo })),
        ...edition2026.autresFinalistes.liste,
      ]
    : [];

  return `
<section class="page-hero page-hero-photo-bg" style="background-position: 65% 12%; background-image: linear-gradient(100deg, rgba(13,17,50,.88) 0%, rgba(13,17,50,.65) 40%, rgba(13,17,50,.25) 62%, rgba(13,17,50,.1) 100%), url('/assets/img/galerie/2eme-edition/concours-orateur.jpg')">
  <div class="container">
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
  </div>
</section>

<section class="acc-section acc-prix" id="grand-prix">
  <div class="container acc-prix-grille">
    <figure class="acc-prix-photo" data-reveal><img src="/assets/img/candidature/paris.jpg" alt="La Tour Eiffel au coucher du soleil" loading="lazy"></figure>
    <div class="acc-prix-texte">
      <p class="acc-surtitre" data-reveal>${candidature.prix.eyebrow}</p>
      <h2 data-reveal style="--delai:.12s">Le Grand Prix<br><em>de la Francophonie</em></h2>
      <p class="acc-chapo" data-reveal style="--delai:.24s">${candidature.prix.description}</p>
      <div class="prix-billet" data-reveal style="--delai:.36s">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
        <span><strong>${candidature.prix.recompense}</strong>Destination France</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">La 3ème édition</p>
      <h2>Pourquoi participer ?</h2>
      <p class="section-lead">${edition3.objectifs.objectifGlobal}</p>
    </div>
  </div>
</section>

<div class="reasons-stack">
  ${edition3.objectifs.specifiques
    .map(
      (o, i) => `<div class="reason-block ${i % 2 === 0 ? "reason-block--navy" : "reason-block--light"} reveal">
    <div class="container reason-block-inner">
      <h3>${o.titre}</h3>
      <p>${o.description}</p>
    </div>
  </div>`
    )
    .join("\n  ")}
</div>

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
          ${e.description ? `<p>${e.description}</p>` : ""}
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
      <p class="eyebrow">${candidature.criteres.eyebrow}</p>
      <h2>${candidature.criteres.titre}</h2>
    </div>
    <ul class="criteres-list reveal">
      ${candidature.criteres.liste.map((c) => `<li>${c}</li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="section photo-feature">
  <div class="container photo-feature-inner">
    <div class="photo-feature-media reveal">
      <img src="/assets/img/palmares/2eme-edition/anisette-toto-agbre.jpg" alt="Anisette Toto Agbré, finaliste de la 2ème édition, sur scène" loading="lazy">
    </div>
    <div class="photo-feature-copy">
      <div class="section-head reveal" style="text-align:left; margin-bottom:20px;">
        <p class="eyebrow">L'énergie de la scène</p>
        <h2>Une scène qui vous ressemble</h2>
      </div>
      <p class="reveal">Deux orateurs, une même thématique, deux thèses opposées, et seulement 120 secondes pour convaincre le public et le jury. C'est l'énergie qui vous attend si vous montez sur cette scène.</p>
    </div>
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
        <figcaption>${p.nom}${p.profession ? `<span class="candidature-photo-profession">${p.profession}</span>` : ""}</figcaption>
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

<section class="section" id="formulaire" data-open-date="${candidature.dateOuvertureCandidaturesISO}">
  <div class="container">
    <div id="candidature-avant-ouverture">
      <div class="todo-banner reveal">
        📅 Les candidatures ouvrent le <strong>${candidature.dateOuvertureCandidatures}</strong>
      </div>
      <div class="section-head reveal" style="margin-top:28px;">
        <h2>${candidature.listeAttente.titre}</h2>
        <p class="section-lead">${candidature.listeAttente.texte}</p>
      </div>
      <form class="contact-form reveal" id="waitlist-form" data-netlify="true" name="liste-attente-candidature" netlify-honeypot="societe" novalidate>
        <input type="hidden" name="form-name" value="liste-attente-candidature">
        <p class="form-row" style="position:absolute; left:-9999px;" aria-hidden="true">
          <label for="wait-societe">Ne pas remplir</label>
          <input type="text" id="wait-societe" name="societe" tabindex="-1" autocomplete="off">
        </p>
        <div class="form-row-pair">
          <div class="form-row">
            <label for="wait-nom">Nom</label>
            <input type="text" id="wait-nom" name="nom" required>
          </div>
          <div class="form-row">
            <label for="wait-prenom">Prénom</label>
            <input type="text" id="wait-prenom" name="prenom" required>
          </div>
        </div>
        <div class="form-row">
          <label for="wait-email">Adresse e-mail</label>
          <input type="email" id="wait-email" name="email" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg btn-block">${candidature.listeAttente.ctaLabel}</button>
        <p class="form-note" id="waitlist-form-note" role="status" aria-live="polite"></p>
      </form>
    </div>

    <div id="candidature-formulaire-ouvert" hidden>
      <div class="todo-banner reveal">
        📅 Candidatures ouvertes du <strong>${candidature.dateOuvertureCandidatures}</strong> au <strong>${candidature.dateLimiteCandidatures}</strong>
      </div>
      <form class="contact-form reveal" id="candidature-form" data-netlify="true" name="candidature" netlify-honeypot="societe" novalidate>
        <input type="hidden" name="form-name" value="candidature">
        <p class="form-row" style="position:absolute; left:-9999px;" aria-hidden="true">
          <label for="cand-societe">Ne pas remplir</label>
          <input type="text" id="cand-societe" name="societe" tabindex="-1" autocomplete="off">
        </p>
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
    </div>

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
