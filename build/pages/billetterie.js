// Pages de la billetterie (toutes en noindex, hors plan du site) : vente, confirmation, billet, espace billetterie et contrôle.
// Les prix ne sont jamais écrits dans le HTML : la page les reçoit de la fonction billetterie-infos quand la vente est ouverte.

const coche = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';

function vente(data) {
  const b = data.billetterie;
  const ev = b.evenement;
  const tous = [...new Set(Object.values(b.categories).flatMap((c) => c.avantages.map((a) => a.replace(/ VIP(?= et)/, ""))))];
  const formule = (cle) => {
    const c = b.categories[cle];
    const inclus = new Set(c.avantages.map((a) => a.replace(/ VIP(?= et)/, "")));
    return `<label class="formule${cle === "vip" ? " formule-vip" : ""}">
      <input type="radio" name="categorie" value="${cle}" required${cle === "standard" ? " checked" : ""}>
      <span class="formule-carte">
        <span class="formule-nom">${c.nom}</span>
        <span class="formule-prix" data-prix="${cle}" hidden></span>
        <span class="formule-restantes" data-restantes="${cle}" hidden></span>
        <ul class="formule-avantages">
          ${tous.map((a) => `<li class="${inclus.has(a) ? "" : "absent"}">${inclus.has(a) ? coche : "<span aria-hidden=\"true\">–</span>"} ${cle === "vip" && a === "Badge et goodies personnalisés" ? "Badge VIP et goodies personnalisés" : a}</li>`).join("\n          ")}
        </ul>
        <span class="formule-choix">Choisir ${c.nom}</span>
      </span>
    </label>`;
  };
  const options = Array.from({ length: b.maxParCommande }, (_, i) => `<option value="${i + 1}">${i + 1} billet${i ? "s" : ""}</option>`).join("");

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">${ev.nom} · 3ème édition</p>
    <h1>Billetterie</h1>
    <p class="page-hero-lead">${ev.date} · ${ev.lieu} (${ev.salle}). Réservez votre place pour assister à la grande finale de Deux Minutes Pour Convaincre.</p>
  </div>
</section>

<section class="section billetterie">
  <div class="container">
    <p class="billetterie-test" id="billetterie-test" hidden>Mode test : les billets émis portent la mention TEST et ne sont pas valables le jour J.</p>
    <div class="billetterie-etat" id="billetterie-chargement"><p>Chargement de la billetterie…</p></div>
    <div class="billetterie-etat" id="billetterie-avant" hidden>
      <p class="eyebrow">Bientôt</p>
      <h2>La billetterie ouvre le ${b.ouvertureTexte}.</h2>
      <p>Une prévente à tarif réduit aura lieu jusqu'au ${b.finPreventeTexte}. Suivez-nous sur nos réseaux pour ne pas manquer l'ouverture.</p>
    </div>
    <div class="billetterie-etat" id="billetterie-fermee" hidden>
      <h2>La billetterie est fermée.</h2>
      <p>Merci à toutes celles et ceux qui ont réservé leur place. Rendez-vous le ${ev.date.toLowerCase()} !</p>
    </div>

    <form id="billetterie-form" class="billetterie-form" novalidate hidden>
      <p class="billetterie-prevente" id="billetterie-prevente" hidden>Prévente : tarif réduit jusqu'au ${b.finPreventeTexte}.</p>
      <fieldset class="formules">
        <legend class="sr-only">Choisissez votre formule</legend>
        ${formule("standard")}
        ${formule("vip")}
      </fieldset>

      <div class="contact-form billetterie-coordonnees">
        <h2>Vos billets</h2>
        <div class="form-row">
          <label for="billet-quantite">Nombre de billets</label>
          <select id="billet-quantite" name="quantite">${options}</select>
        </div>
        <div class="form-row-pair">
          <div class="form-row"><label for="acheteur-prenom">Prénom</label><input type="text" id="acheteur-prenom" name="prenom" autocomplete="given-name" maxlength="60" required></div>
          <div class="form-row"><label for="acheteur-nom">Nom</label><input type="text" id="acheteur-nom" name="nom" autocomplete="family-name" maxlength="60" required></div>
        </div>
        <div class="form-row">
          <label for="acheteur-email">Adresse e-mail</label>
          <input type="email" id="acheteur-email" name="email" autocomplete="email" maxlength="120" required>
          <small class="form-hint">Vos billets y seront envoyés dès le paiement confirmé.</small>
        </div>
        <div class="form-row">
          <label for="acheteur-whatsapp">Numéro WhatsApp</label>
          <input type="tel" id="acheteur-whatsapp" name="whatsapp" autocomplete="tel" placeholder="+229 01 23 45 67 89" pattern="\\+[0-9][0-9 ]{6,18}" required>
          <small class="form-hint">Avec l'indicatif du pays, par exemple +229 pour le Bénin.</small>
        </div>
        <div id="billetterie-invites"></div>
        <p class="billetterie-total" id="billetterie-total"></p>
        <button type="submit" class="btn btn-primary btn-lg btn-block" id="billetterie-payer">Payer</button>
        <p class="form-note" id="billetterie-note" role="status" aria-live="polite"></p>
        <p class="billetterie-rassurance">Paiement sécurisé par FedaPay : MTN Mobile Money, Moov Money ou carte bancaire. Chaque billet est nominatif, valable pour une personne et une seule entrée.</p>
      </div>
    </form>
  </div>
</section>
`;
}

function merci() {
  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Billetterie</p>
    <h1 id="merci-billets-titre">Confirmation de votre paiement…</h1>
    <p class="page-hero-lead" id="merci-billets-texte">Nous vérifions votre paiement auprès de FedaPay. Cela prend généralement quelques secondes.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="billets-liste" id="merci-billets"></div>
    <p class="billetterie-actions"><a href="/billetterie/" class="btn btn-outline" id="merci-retour" hidden>Retour à la billetterie</a></p>
  </div>
</section>
`;
}

function billet() {
  return `
<section class="section billet-page">
  <div class="container">
    <p class="billet-statut" id="billet-statut">Chargement de votre billet…</p>
    <figure class="billet-image" id="billet-figure" hidden><img id="billet-img" alt=""></figure>
    <div class="billet-actions" id="billet-actions" hidden>
      <a class="btn btn-primary" id="billet-telecharger" download>Télécharger le billet</a>
      <button type="button" class="btn btn-outline" id="billet-partager" hidden>Partager</button>
      <button type="button" class="btn btn-outline" id="billet-imprimer">Imprimer</button>
    </div>
    <div class="billet-qr" id="billet-qr" hidden>
      <img id="billet-qr-img" alt="QR code du billet" width="260" height="260">
      <p><strong>À présenter à l'accueil.</strong> Augmentez la luminosité de votre écran pour faciliter le scan.</p>
    </div>
  </div>
</section>
`;
}

function espace() {
  return `
<section class="outil">
  <div class="outil-tete"><img src="/assets/img/logo-640.png" alt="Deux Minutes Pour Convaincre"><span>Espace billetterie</span></div>

  <form class="outil-connexion" id="espace-connexion">
    <label for="espace-mdp">Mot de passe</label>
    <input type="password" id="espace-mdp" autocomplete="current-password" required>
    <button type="submit" class="btn btn-primary">Entrer</button>
    <p class="form-note" id="espace-connexion-note" role="status"></p>
  </form>

  <div id="espace" hidden>
    <nav class="outil-onglets" aria-label="Sections">
      <button type="button" data-onglet="tableau" class="actif">Tableau de bord</button>
      <button type="button" data-onglet="billets">Billets</button>
      <button type="button" data-onglet="entrees">Entrées</button>
      <button type="button" data-onglet="inviter">Inviter</button>
    </nav>
    <p class="outil-alerte" id="espace-alertes" hidden></p>

    <div class="outil-panneau" data-panneau="tableau">
      <div class="outil-cartes" id="espace-cartes"></div>
      <p class="outil-maj" id="espace-maj"></p>
    </div>

    <div class="outil-panneau" data-panneau="billets" hidden>
      <div class="outil-barre">
        <input type="search" id="espace-recherche" placeholder="Rechercher un nom, un e-mail, un numéro…">
        <button type="button" class="btn btn-outline" id="espace-export">Télécharger en Excel (CSV)</button>
        <button type="button" class="btn btn-outline" id="espace-imprimer">Liste imprimable de secours</button>
      </div>
      <div class="outil-tableau"><table><thead><tr><th>Billet</th><th>Titulaire</th><th>Catégorie</th><th>Tarif</th><th>Contact</th><th>Entrée</th><th></th></tr></thead><tbody id="espace-billets"></tbody></table></div>
    </div>

    <div class="outil-panneau" data-panneau="entrees" hidden>
      <div class="outil-cartes" id="espace-cartes-entrees"></div>
      <h3>Entrées validées</h3>
      <div class="outil-tableau"><table><thead><tr><th>Heure</th><th>Porte</th><th>Billet</th><th>Titulaire</th><th>Catégorie</th></tr></thead><tbody id="espace-entrees"></tbody></table></div>
      <h3>Pas encore arrivés</h3>
      <div class="outil-tableau"><table><thead><tr><th>Billet</th><th>Titulaire</th><th>Catégorie</th><th>WhatsApp</th></tr></thead><tbody id="espace-absents"></tbody></table></div>
      <h3>Tentatives refusées</h3>
      <div class="outil-tableau"><table><thead><tr><th>Heure</th><th>Porte</th><th>Motif</th><th>Billet</th><th>Titulaire</th></tr></thead><tbody id="espace-refus"></tbody></table></div>
    </div>

    <div class="outil-panneau" data-panneau="inviter" hidden>
      <form class="outil-formulaire" id="espace-inviter">
        <p>L'invité reçoit son invitation nominative par e-mail, avec son QR code. Sans e-mail, copiez le lien et envoyez-le par WhatsApp.</p>
        <label>Catégorie
          <select name="categorie"><option value="standard">Invitation Standard</option><option value="vip">Invitation VIP</option></select></label>
        <label>Prénom <input name="prenom" required maxlength="60"></label>
        <label>Nom <input name="nom" required maxlength="60"></label>
        <label>E-mail (facultatif) <input name="email" type="email" maxlength="120"></label>
        <label>WhatsApp (facultatif) <input name="whatsapp" type="tel" maxlength="30" placeholder="+229…"></label>
        <button type="submit" class="btn btn-primary">Créer l'invitation</button>
        <p class="form-note" id="espace-inviter-note" role="status"></p>
      </form>
    </div>
  </div>
</section>
`;
}

function controle() {
  return `
<section class="outil outil-controle">
  <div class="outil-tete"><img src="/assets/img/logo-640.png" alt="Deux Minutes Pour Convaincre"><span>Contrôle des billets</span></div>

  <form class="outil-connexion" id="controle-connexion">
    <label for="controle-code">Code d'accueil</label>
    <input type="password" id="controle-code" inputmode="numeric" autocomplete="off" required>
    <label for="controle-porte">Votre poste</label>
    <select id="controle-porte">
      <option value="vip">Porte VIP (file de gauche)</option>
      <option value="standard">Porte Standard (file de droite)</option>
      <option value="">Accueil unique (toutes catégories)</option>
    </select>
    <button type="submit" class="btn btn-primary">Commencer</button>
    <p class="form-note" id="controle-connexion-note" role="status"></p>
  </form>

  <div id="controle" hidden>
    <p class="controle-poste"><span id="controle-poste"></span> · <span id="controle-compteur"></span> <button type="button" id="controle-quitter">Changer</button></p>
    <div class="controle-resultat" id="controle-resultat" data-etat="attente">
      <strong id="controle-message">Scannez un billet</strong>
      <span id="controle-detail"></span>
    </div>
    <div class="controle-camera"><video id="controle-video" playsinline muted></video><canvas id="controle-canvas" hidden></canvas></div>
    <button type="button" class="btn btn-primary btn-block" id="controle-camera-btn">Activer la caméra</button>
    <form class="controle-recherche" id="controle-recherche">
      <label for="controle-q">Billet illisible ? Recherchez par nom ou numéro</label>
      <div><input type="search" id="controle-q" placeholder="Nom ou numéro de billet"><button type="submit" class="btn btn-outline">Chercher</button></div>
      <ul id="controle-resultats"></ul>
    </form>
  </div>
</section>
`;
}

module.exports = { vente, merci, billet, espace, controle };
