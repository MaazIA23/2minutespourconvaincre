const { icoDate, icoLieu } = require("../icones");
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
<section class="page-hero page-hero-photo-bg" style="background-position: 65% 12%; background-image: linear-gradient(100deg, rgba(4,11,82,.88) 0%, rgba(4,11,82,.65) 40%, rgba(4,11,82,.25) 62%, rgba(4,11,82,.1) 100%), url('/assets/img/galerie/2eme-edition/concours-orateur.jpg')">
  <div class="container">
    <h1>${candidature.titre}</h1>
    <p class="page-hero-lead">${candidature.sousTitre}</p>
  </div>
</section>

<section class="section spot-candidature" id="spot">
  <div class="container spot-grille">
    <div class="spot-texte reveal">
      <p class="eyebrow">Le spot de la 3ème édition</p>
      <h2>La scène vous <span class="or-fonce">attend</span></h2>
      <p>Deux orateurs, une thématique, aucune seconde chance : en 34 secondes, découvrez ce qui vous attend sur la scène de Deux Minutes Pour Convaincre.</p>
    </div>
    <figure class="spot-video reveal">
      <video controls playsinline preload="none" poster="/assets/video/spot-3e-edition.jpg" aria-label="Spot de la 3ème édition de Deux Minutes Pour Convaincre">
        <source src="/assets/video/spot-3e-edition.mp4" type="video/mp4">
      </video>
    </figure>
  </div>
</section>

<section class="acc-section acc-prix" id="grand-prix">
  <div class="container acc-prix-grille">
    <figure class="acc-prix-photo" data-reveal><img src="/assets/img/candidature/paris.jpg" alt="La Tour Eiffel au coucher du soleil" loading="lazy"><figcaption class="acc-prix-badge"><span>Destination</span>France</figcaption></figure>
    <div class="acc-prix-texte">
      <p class="acc-surtitre" data-reveal>${candidature.prix.eyebrow}</p>
      <h2 data-reveal style="--delai:.12s">Le Grand Prix<br><em>de la Francophonie</em></h2>
      <p class="acc-chapo" data-reveal style="--delai:.24s">Parce qu'une victoire doit ouvrir une porte&nbsp;: le lauréat de la 3ème édition remporte une semaine en France.</p>
      <a href="#formulaire" class="acc-lien" data-reveal style="--delai:.36s">Je candidate <span aria-hidden="true">→</span></a>
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
      <p class="reveal" style="text-align:justify">Imaginez. Les lumières se tamisent, la salle retient son souffle, et votre nom résonne. Vous avancez, le micro à la main. Face à vous, un public venu vous écouter et un jury attentif à chacun de vos mots. On vous dévoile la thématique&nbsp;: vous avez deux minutes, pas une seconde de plus. Ici, nul besoin d'être parfait ou de réciter un discours appris par cœur. On attend votre voix, vos idées, votre manière unique de voir le monde. Étudiant, jeune professionnel, entrepreneur ou simple passionné, peu importe d'où vous venez&nbsp;: cette scène est faite pour celles et ceux qui ont quelque chose à dire et l'audace de le dire. Pendant 120 secondes, elle vous appartient.</p>
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

<section class="section" id="formulaire" data-open-date="${data.billetterie.candidats.ouverture}" data-close-date="${data.billetterie.candidats.fermeture}">
  <div class="container">
    <div id="candidature-avant-ouverture">
      <div class="todo-banner reveal">
        ${icoDate} Les candidatures ouvrent le <strong>${candidature.dateOuvertureCandidatures}</strong>
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
        <div class="form-row"><label for="wait-whatsapp">Numéro WhatsApp</label><input type="tel" id="wait-whatsapp" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+229 01 23 45 67 89" pattern="\\+[0-9][0-9 ]{6,18}" required><small class="form-hint">Avec l'indicatif du pays, par exemple +229 pour le Bénin.</small></div>
        <button type="submit" class="btn btn-primary btn-lg btn-block">${candidature.listeAttente.ctaLabel}</button>
        <p class="form-note" id="waitlist-form-note" role="status" aria-live="polite"></p>
      </form>
    </div>

    <div id="candidature-etape1" hidden>
      <div class="todo-banner reveal">
        ${icoDate} Candidatures ouvertes du <strong>${candidature.dateOuvertureCandidatures}</strong> au <strong>${candidature.dateLimiteCandidatures}</strong>
      </div>
      <div class="candidature-etape reveal">
        <p class="eyebrow">Étape 1 sur 2</p>
        <h2>Obtenez votre pass</h2>
        <p>La candidature est gratuite. Pour participer, il vous suffit d'obtenir votre pass pour la grande finale, Standard ou VIP, au choix&nbsp;: votre place est garantie, que vous soyez sélectionné(e) ou non. Les candidats l'obtiennent en avant-première, avant l'ouverture de la billetterie au public.</p>
        <p>Dès votre paiement confirmé, vous recevez votre billet par e-mail et vous êtes redirigé(e) vers l'étape 2&nbsp;: votre formulaire de candidature, déjà prérempli. Il ne vous restera qu'à y ajouter le lien de votre vidéo.</p>
        <a href="/billetterie/" class="btn btn-primary btn-lg">Obtenir mon pass <span aria-hidden="true">→</span></a>
        <p class="candidature-etape-note">Vous avez déjà votre pass&nbsp;? Le lien pour déposer votre candidature figure dans l'e-mail de votre billet.</p>
      </div>
    </div>

    <div id="candidature-formulaire-ouvert" hidden>
      <div class="todo-banner reveal">
        ${icoDate} Candidatures ouvertes jusqu'au <strong>${candidature.dateLimiteCandidatures}</strong>
      </div>
      <div class="candidature-etape" id="candidature-etape2-entete">
        <p class="eyebrow">Étape 2 sur 2</p>
        <h2>Déposez votre candidature</h2>
        <p id="candidature-pass-texte">Vérification de votre pass…</p>
      </div>
      <form class="contact-form" id="candidature-form" novalidate hidden>
        <div class="form-row-pair">
          <div class="form-row">
            <label for="cand-nom">Nom</label>
            <input type="text" id="cand-nom" readonly>
          </div>
          <div class="form-row">
            <label for="cand-prenom">Prénom</label>
            <input type="text" id="cand-prenom" readonly>
          </div>
        </div>
        <div class="form-row-pair">
          <div class="form-row">
            <label for="cand-email">Adresse e-mail</label>
            <input type="email" id="cand-email" readonly>
          </div>
          <div class="form-row">
            <label for="cand-phone">Numéro WhatsApp</label>
            <input type="tel" id="cand-phone" readonly>
          </div>
        </div>
        <small class="form-hint candidature-pass-hint">Ces informations sont celles de votre pass. Une erreur&nbsp;? Écrivez-nous à contact@2minpourconvaincre.com.</small>
        <div class="form-row-pair">
          <div class="form-row">
            <label for="cand-fonction">Fonction ou profession</label>
            <input type="text" id="cand-fonction" autocomplete="organization-title" maxlength="80" placeholder="Par exemple : juriste, étudiant(e)" required>
          </div>
          <div class="form-row">
            <label for="cand-pays">Pays de résidence</label>
            <input type="text" id="cand-pays" maxlength="60" value="Bénin" required>
          </div>
        </div>
        <div class="form-row">
          <label for="cand-video">Lien de votre vidéo</label>
          <p style="margin: 0 0 8px; font-size: 0.85rem; color: var(--ink-soft); text-align: left;">${candidature.formulaire.videoInstructions}</p>
          <input type="url" id="cand-video" maxlength="300" placeholder="https://..." required>
        </div>
        <label class="form-case"><input type="checkbox" id="cand-cgu" required> <span>J'accepte les <a href="/cgu/" target="_blank" rel="noopener">conditions d'utilisation</a>. Une seule candidature est possible par pass.</span></label>
        <button type="submit" class="btn btn-primary btn-lg btn-block" id="cand-envoyer">${candidature.ctaSubmit}</button>
        <p class="form-note" id="form-note" role="status" aria-live="polite"></p>
      </form>
    </div>

    <div id="candidature-close" class="candidature-etape" hidden>
      <h2>Les candidatures sont closes</h2>
      <p>Merci à toutes celles et ceux qui ont candidaté à la 3ème édition. Rendez-vous à la grande finale&nbsp;: la billetterie ouvre au public le ${data.billetterie.ouvertureTexte}.</p>
      <a href="/billetterie/" class="btn btn-outline">Découvrir la billetterie</a>
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
