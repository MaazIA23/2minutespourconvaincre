// Accueil : mise en page aérée, apparitions douces au défilement (data-reveal), peu de cadres.
function render(data) {
  const { edition3, partenaires, editionsIndex, accueil, actualites, candidature } = data;
  const presentation = (accueil.sections || []).find((s) => s.id === "presentation");
  const voix = edition3.programme300Voix;
  const delai = (i, pas = 0.12) => `style="--delai:${(i * pas).toFixed(2)}s"`;
  // Fil doré qui se dessine entre deux sections.
  const fil = (sens = 1) => `<svg class="acc-fil" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${sens > 0 ? "M0,90 C260,10 520,110 760,50 S1100,30 1200,70" : "M0,40 C300,110 560,10 820,70 S1080,100 1200,30"}"/></svg>`;

  return `
<section class="hero hero-split" id="top">
  <div class="hero-motif" aria-hidden="true"></div>
  <div class="container hero-inner">
    <figure class="hero-visual" data-reveal>
      <img src="/assets/img/galerie/2eme-edition/concours-orateur.jpg" alt="Un orateur sur la scène de Deux Minutes Pour Convaincre" fetchpriority="high">
      <figcaption class="hero-badge"><span class="hero-badge-icon" aria-hidden="true">✈️</span><span><strong>Grand Prix de la Francophonie</strong>Une semaine en France pour le lauréat</span></figcaption>
    </figure>
    <div class="hero-copy">
      <p class="hero-kicker" data-reveal ${delai(1)}><span>3ème édition</span> Mars 2027 · Journée de la Francophonie</p>
      <h1 class="hero-rotator" id="hero-rotator" data-reveal ${delai(2)}>${(edition3.accrochesRotatives || [edition3.accroche])
        .map((phrase, i) => `<span class="hero-rotator-phrase${i === 0 ? " is-active" : ""}">${phrase}</span>`)
        .join("")}</h1>
      <div class="hero-ctas" data-reveal ${delai(3)}>
        <a href="/candidature/" class="btn btn-primary btn-lg">Candidater</a>
      </div>
    </div>
  </div>
</section>

${
  presentation
    ? `<section class="acc-section acc-manifeste" id="quest-ce-que">
  <div class="container">
    <p class="acc-surtitre" data-reveal>Qu'est-ce que Deux Minutes Pour Convaincre ?</p>
    <div class="acc-manifeste-grille">
      <h2 class="acc-grand" data-reveal ${delai(1)}>Deux minutes.<br>Une thèse imposée.<br><em>Une salle à convaincre.</em></h2>
      <div class="acc-manifeste-texte" data-reveal ${delai(2)}>
        <p class="acc-chapo">${presentation.titre}</p>
        ${presentation.paragraphes.map((p) => `<p>${p}</p>`).join("\n        ")}
        <a href="${presentation.cta.lien}/" class="acc-lien">${presentation.cta.label} <span aria-hidden="true">→</span></a>
      </div>
    </div>
    ${
      accueil.videoPresentation
        ? `<figure class="acc-video" id="video" data-reveal>
      <div class="video-embed">
        <iframe src="https://www.youtube.com/embed/${accueil.videoPresentation.youtubeId}" title="${accueil.videoPresentation.titre}" loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <figcaption><span aria-hidden="true">▶</span> ${accueil.videoPresentation.titre}</figcaption>
    </figure>`
        : ""
    }
  </div>
  ${fil(1)}
</section>`
    : ""
}

${
  accueil.chiffresCles
    ? `<section class="acc-chiffres" id="chiffres">
  <div class="container">
    <p class="acc-surtitre acc-surtitre-centre" data-reveal>${accueil.chiffresCles.eyebrow}</p>
    <ul class="acc-chiffres-liste">
      ${accueil.chiffresCles.chiffres
        .map((c, i) => `<li data-reveal ${delai(i, 0.1)}><strong data-compteur>${c.valeur}</strong><span>${c.libelle}</span></li>`)
        .join("\n      ")}
    </ul>
  </div>
</section>`
    : ""
}

<section class="acc-section acc-nouveautes" id="nouveautes">
  <div class="container acc-nouveautes-grille">
    <div class="acc-nouveautes-tete">
      <p class="acc-surtitre" data-reveal>Cap sur 2027</p>
      <h2 data-reveal ${delai(1)}>${edition3.nouvelleAmbition.titre}</h2>
      <p class="acc-chapo" data-reveal ${delai(2)}>${edition3.nouvelleAmbition.resumeCourt}</p>
      <figure class="acc-nouveautes-photo" data-reveal ${delai(3)}><img src="/assets/img/galerie/2eme-edition/photo-04.jpg" alt="Intervenante au micro sur la scène de Deux Minutes Pour Convaincre" loading="lazy"></figure>
    </div>
    <ol class="acc-nouveautes-liste">
      ${edition3.nouveautes
        .map((n, i) => `<li data-reveal ${delai(i, 0.08)}>
        <span class="acc-num">${n.numero}</span>
        <div><h3>${n.titre}</h3><p>${n.description}</p></div>
      </li>`)
        .join("\n      ")}
    </ol>
  </div>
</section>

<section class="acc-pleine acc-voix" id="trois-cents-voix">
  <img src="${voix.photo}" alt="Une jeune femme prend la parole devant ses camarades" loading="lazy" class="acc-pleine-photo">
  <div class="container acc-pleine-texte" data-reveal>
    <p class="acc-surtitre acc-surtitre-or">${voix.eyebrow}</p>
    <h2>${voix.titre}</h2>
    <p class="acc-chapo">${voix.accroche}</p>
    <p>${voix.texte}</p>
    <a href="/editions/3eme-edition/#nouveautes" class="btn btn-primary btn-lg">Découvrir 300 Voix</a>
  </div>
</section>

<section class="acc-section acc-prix" id="grand-prix">
  <div class="container acc-prix-grille">
    <figure class="acc-prix-photo" data-reveal><img src="/assets/img/candidature/paris.jpg" alt="La Tour Eiffel au coucher du soleil" loading="lazy"></figure>
    <div class="acc-prix-texte">
      <p class="acc-surtitre" data-reveal>La récompense</p>
      <h2 data-reveal ${delai(1)}>Le Grand Prix<br><em>de la Francophonie</em></h2>
      <p class="acc-chapo" data-reveal ${delai(2)}>Parce qu'une victoire doit ouvrir une porte : le lauréat de la 3ème édition remporte une semaine en France.</p>
      <a href="/candidature/" class="acc-lien" data-reveal ${delai(3)}>Tout savoir sur la candidature <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<section class="acc-section acc-editions" id="editions">
  <div class="container">
    <div class="acc-tete-ligne">
      <div>
        <p class="acc-surtitre" data-reveal>Depuis 2025</p>
        <h2 data-reveal ${delai(1)}>${editionsIndex.titre}</h2>
      </div>
      <a href="/editions/" class="acc-lien" data-reveal ${delai(2)}>Toutes les éditions <span aria-hidden="true">→</span></a>
    </div>
    <div class="acc-editions-liste">
      ${editionsIndex.editions
        .map((e, i) => `<a class="acc-edition" href="/editions/${e.slug}/" data-reveal ${delai(i)}>
        <span class="acc-edition-photo"><img src="${e.photo}" alt="${e.label}" loading="lazy"></span>
        <span class="acc-edition-meta">${e.statut === "a-venir" ? "À venir" : "Édition passée"} · ${e.annee}</span>
        <span class="acc-edition-titre">${e.label}</span>
        <span class="acc-edition-resume">${e.resume}</span>
      </a>`)
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="acc-section alerte-candidature" id="liste-attente" data-masquer-apres="${candidature.dateOuvertureCandidaturesISO}">
  <div class="container alerte-inner">
    <div class="alerte-copy">
      <p class="acc-surtitre" data-reveal>Candidatures 2027</p>
      <h2 data-reveal ${delai(1)}>Ouverture le ${candidature.dateOuvertureCandidatures}</h2>
      <p data-reveal ${delai(2)}>Laissez votre e-mail : vous recevrez une confirmation tout de suite, puis une alerte le jour de l'ouverture des candidatures.</p>
    </div>
    <form class="alerte-form" data-reveal ${delai(2)} id="waitlist-form-accueil" data-netlify="true" name="liste-attente-candidature" netlify-honeypot="societe" novalidate>
      <input type="hidden" name="form-name" value="liste-attente-candidature">
      <p class="form-row" style="position:absolute; left:-9999px;" aria-hidden="true">
        <label for="acc-societe">Ne pas remplir</label>
        <input type="text" id="acc-societe" name="societe" tabindex="-1" autocomplete="off">
      </p>
      <div class="form-row-pair">
        <div class="form-row"><label for="acc-prenom">Prénom</label><input type="text" id="acc-prenom" name="prenom" autocomplete="given-name" required></div>
        <div class="form-row"><label for="acc-nom">Nom</label><input type="text" id="acc-nom" name="nom" autocomplete="family-name" required></div>
      </div>
      <div class="form-row"><label for="acc-email">Adresse e-mail</label><input type="email" id="acc-email" name="email" autocomplete="email" required></div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">Prévenez-moi à l'ouverture</button>
      <p class="form-note" id="waitlist-accueil-note" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>

<section class="acc-section acc-partenaires partenaires-teaser">
  <div class="container">
    <p class="acc-surtitre acc-surtitre-centre" data-reveal>Ils nous soutiennent</p>
    <div class="partner-marquee" data-reveal ${delai(1)}>
      <div class="partner-marquee-track">
        ${partenaires.liste.map((p) => `<img src="${p.logo}" alt="${p.nom}" loading="lazy">`).join("\n        ")}
        ${partenaires.liste.map((p) => `<img src="${p.logo}" alt="" aria-hidden="true" loading="lazy">`).join("\n        ")}
      </div>
    </div>
    <div class="acc-devenir" data-reveal ${delai(2)}>
      <h2>Associez votre marque à la 3ème édition</h2>
      <p>Visibilité, engagement jeunesse et impact mesurable : six niveaux de partenariat, de 200 000 à 5 000 000 FCFA.</p>
      <div class="acc-devenir-actions">
        <a href="/partenaires/#devenir-partenaire" class="btn btn-primary btn-lg">Devenir partenaire</a>
        <a href="/assets/documents/dossier-sponsoring-2mpc-2027.pdf" class="acc-lien" download>Télécharger le dossier de sponsoring <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  </div>
</section>

${
  actualites.liste.length
    ? `<section class="acc-section acc-actus" id="actualites">
  <div class="container">
    <div class="acc-tete-ligne">
      <div>
        <p class="acc-surtitre" data-reveal>Actualités</p>
        <h2 data-reveal ${delai(1)}>Les dernières nouvelles</h2>
      </div>
      <a href="/actualites/" class="acc-lien" data-reveal ${delai(2)}>Toutes les actualités <span aria-hidden="true">→</span></a>
    </div>
    <div class="acc-actus-liste">
      ${actualites.liste
        .slice()
        .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
        .slice(0, 3)
        .map((a, i) => `<article class="acc-actu" data-reveal ${delai(i)}>
        <span class="acc-actu-photo"><img src="${a.image}" alt="${a.alt}" loading="lazy"></span>
        <p class="acc-actu-meta">${a.categorie} · ${a.date}</p>
        <h3>${a.titre}</h3>
        <p>${a.resume}</p>
      </article>`)
        .join("\n      ")}
    </div>
  </div>
</section>`
    : ""
}

<section class="acc-final" id="candidature-cta">
  ${fil(-1)}
  <div class="container acc-final-in">
    <p class="acc-surtitre acc-surtitre-or acc-surtitre-centre" data-reveal>La 3ème édition se construit maintenant</p>
    <h2 data-reveal ${delai(1)}>Prêt(e) à monter<br>sur scène en 2027 ?</h2>
    <p data-reveal ${delai(2)}>Pour cette 3ème édition, la candidature se fait en vidéo : deux minutes, sur un thème de votre choix, pour nous convaincre.</p>
    <div class="acc-final-actions" data-reveal ${delai(3)}>
      <a href="/candidature/" class="btn btn-primary btn-lg">Candidater</a>
      <a href="/partenaires/#devenir-partenaire" class="btn btn-outline btn-lg">Devenir partenaire</a>
    </div>
  </div>
</section>


`;
}

module.exports = { render };
