/* Vote « Coup de cœur du public » (page /vote/).
   Première fois : formulaire, puis lien de confirmation par e-mail. Ensuite, le jeton gardé dans le navigateur
   permet de revoter en un clic chaque jour. Les événements sont envoyés à Google Analytics seulement si
   l'internaute a accepté la mesure d'audience (aucune donnée personnelle : finaliste, pays et mode de vote). */
(function () {
  var section = document.getElementById("vote");
  if (!section) return;
  var API = "/.netlify/functions/vote";
  var CLE = "2mpc-vote";
  var $ = function (id) { return document.getElementById(id); };
  var dialogue = $("vote-dialogue"), form = $("vote-form"), message = $("vote-message");
  var choix = null;

  function memoire(valeur) {
    try {
      if (valeur === undefined) return JSON.parse(localStorage.getItem(CLE));
      if (valeur === null) localStorage.removeItem(CLE); else localStorage.setItem(CLE, JSON.stringify(valeur));
    } catch (e) { return null; }
  }
  function mesure(nom, params) {
    if (window.mesureAudienceChargee && window.gtag) window.gtag("event", nom, params || {});
  }
  function appel(corps) {
    var options = corps ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) } : {};
    return fetch(API, options).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) { d._ok = res.ok; d._statut = res.status; return d; });
    });
  }
  function afficherTotal(total) {
    if (typeof total !== "number" || total < 1) return;
    $("vote-total").textContent = String(total).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    $("vote-compteur").hidden = false;
  }
  function afficherScores(scores) {
    if (!scores) return;
    document.querySelectorAll(".vote-carte").forEach(function (c) {
      var n = scores[c.getAttribute("data-finaliste")] || 0, el = c.querySelector(".vote-score");
      if (!el) return;
      el.querySelector("strong").textContent = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
      el.hidden = false;
    });
  }
  function lienPartage(id) { return location.origin + "/vote/" + (id ? "?f=" + id : ""); }

  // État du vote (dates et mode essai vérifiés aussi par le serveur).
  var ouvert = !!document.querySelector(".vote-carte");
  appel().then(function (d) {
    if (!d._ok) return;
    afficherTotal(d.total);
    if (d.masques && d.periode === "ouvert") $("vote-masques").hidden = false; else afficherScores(d.scores);
    if (d.essai) $("vote-essai").hidden = false;
    if (d.periode === "ferme") { $("vote-ferme").hidden = false; $("vote-grille").hidden = true; ouvert = false; }
    if (d.periode === "avant") { $("vote-avant").hidden = false; $("vote-grille").hidden = true; ouvert = false; }
  }).catch(function () {});

  function ouvrir(carte) {
    choix = { id: carte.getAttribute("data-finaliste"), nom: carte.getAttribute("data-nom"), prenom: carte.getAttribute("data-prenom") };
    $("vote-choix").textContent = choix.nom;
    message.textContent = "";
    $("vote-partage").hidden = true;
    var moi = memoire();
    $("vote-rapide").hidden = !(moi && moi.jeton);
    form.hidden = !!(moi && moi.jeton);
    if (moi && moi.jeton) $("vote-qui").textContent = moi.prenom + " " + moi.nom + " (" + moi.pays + ")";
    if (typeof dialogue.showModal === "function") dialogue.showModal(); else dialogue.setAttribute("open", "");
    mesure("vote_formulaire", { finaliste: choix.id });
  }
  function fermer() { if (dialogue.open) { if (dialogue.close) dialogue.close(); else dialogue.removeAttribute("open"); } }

  function merci(d) {
    form.hidden = true;
    $("vote-rapide").hidden = true;
    message.innerHTML = "<strong>Merci&nbsp;! Votre voix pour " + d.nomFinaliste + " est bien comptée.</strong><br>Revenez demain pour voter à nouveau&nbsp;: vous disposez d'une voix par jour.";
    afficherTotal(d.total);
    appel().then(function (e) { if (e._ok && !e.masques) afficherScores(e.scores); }).catch(function () {});
    var lien = lienPartage(choix.id);
    var texte = "Je viens de voter pour " + choix.nom + ", finaliste de Deux Minutes Pour Convaincre. Votez vous aussi pour le Coup de cœur du public, c'est gratuit : ";
    dialogue.querySelector('[data-partage="whatsapp"]').href = "https://wa.me/?text=" + encodeURIComponent(texte + lien);
    dialogue.querySelector('[data-partage="facebook"]').href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(lien);
    dialogue.querySelector('[data-partage="copier"]').textContent = "Copier le lien";
    $("vote-partage").hidden = false;
  }

  document.querySelectorAll(".vote-choisir").forEach(function (b) {
    b.addEventListener("click", function () { ouvrir(b.closest(".vote-carte")); });
  });
  $("vote-fermer").addEventListener("click", fermer);
  dialogue.addEventListener("click", function (e) { if (e.target === dialogue) fermer(); });

  $("vote-pays").addEventListener("change", function () {
    var autre = this.value === "autre";
    $("vote-pays-autre").hidden = !autre;
    $("vote-pays-autre").required = autre;
  });
  function pays() { var p = $("vote-pays").value; return p === "autre" ? $("vote-pays-autre").value.trim() : p; }

  // Revote en un clic, avec le jeton de cet appareil.
  $("vote-rapide-ok").addEventListener("click", function () {
    var moi = memoire(), bouton = this;
    bouton.disabled = true;
    message.textContent = "Enregistrement de votre voix…";
    appel({ action: "voter", finaliste: choix.id, jeton: moi && moi.jeton }).then(function (d) {
      bouton.disabled = false;
      if (d._ok && d.confirme) { mesure("vote_confirme", { finaliste: choix.id, pays: moi.pays, mode: "appareil" }); merci(d); return; }
      if (d._statut === 409) mesure("vote_deja", { finaliste: choix.id });
      message.textContent = d.error || "Votre vote n'a pas pu être enregistré. Merci de réessayer.";
    }).catch(function () { bouton.disabled = false; message.textContent = "Connexion impossible. Vérifiez votre réseau, puis réessayez."; });
  });
  $("vote-pas-moi").addEventListener("click", function () { memoire(null); $("vote-rapide").hidden = true; form.hidden = false; message.textContent = ""; });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity() || !pays()) { message.textContent = "Merci d'indiquer votre prénom, votre nom, une adresse e-mail valide et votre pays."; return; }
    var bouton = $("vote-envoyer");
    bouton.disabled = true;
    message.textContent = "Envoi du lien de confirmation…";
    var corps = { action: "voter", finaliste: choix.id, prenom: $("vote-prenom").value, nom: $("vote-nom").value, email: $("vote-email").value, pays: pays(), actualites: $("vote-actualites").checked };
    appel(corps).then(function (d) {
      bouton.disabled = false;
      if (d._ok && d.aConfirmer) {
        mesure("vote_demande", { finaliste: choix.id, pays: corps.pays });
        form.hidden = true;
        message.innerHTML = "<strong>Plus qu'une étape&nbsp;!</strong><br>Nous venons d'envoyer un lien à " + d.email + ". Cliquez dessus pour que votre voix pour " + d.nomFinaliste + " compte. Pensez à regarder dans vos courriers indésirables.";
        return;
      }
      if (d._statut === 409) mesure("vote_deja", { finaliste: choix.id });
      message.textContent = d.error || "Votre vote n'a pas pu être enregistré. Merci de réessayer.";
    }).catch(function () { bouton.disabled = false; message.textContent = "Connexion impossible. Vérifiez votre réseau, puis réessayez."; });
  });

  // Partage : lien direct vers le finaliste choisi.
  $("vote-partage").addEventListener("click", function (e) {
    var b = e.target.closest("[data-partage]");
    if (!b || !choix) return;
    var lien = lienPartage(choix.id);
    var canal = b.getAttribute("data-partage");
    mesure("vote_partage", { finaliste: choix.id, canal: canal });
    if (canal === "copier") {
      e.preventDefault();
      var fait = function () { b.textContent = "Lien copié"; };
      if (navigator.clipboard) navigator.clipboard.writeText(lien).then(fait, function () { window.prompt("Copiez ce lien :", lien); });
      else window.prompt("Copiez ce lien :", lien);
    }
  });

  var params = new URLSearchParams(location.search);

  // Retour depuis l'e-mail : confirmation de la voix.
  var code = params.get("confirmer");
  if (code) {
    history.replaceState(null, "", location.pathname);
    var bandeau = document.createElement("p");
    bandeau.className = "vote-etat vote-confirmation";
    bandeau.textContent = "Confirmation de votre vote…";
    section.querySelector(".container").prepend(bandeau);
    appel({ action: "confirmer", code: code }).then(function (d) {
      if (d.jeton) memoire({ jeton: d.jeton, prenom: d.votant.prenom, nom: d.votant.nom, pays: d.votant.pays });
      if (d._ok) {
        mesure("vote_confirme", { finaliste: d.finaliste, pays: d.votant.pays, mode: "e-mail" });
        afficherTotal(d.total);
        var carte = document.querySelector('.vote-carte[data-finaliste="' + d.finaliste + '"]');
        if (carte) { ouvrir(carte); merci(d); }
        bandeau.textContent = "Merci " + d.votant.prenom + ", votre voix pour " + d.nomFinaliste + " est bien comptée. Revenez demain pour voter à nouveau !";
        return;
      }
      if (d._statut === 409) mesure("vote_deja", {});
      bandeau.textContent = d.error || "La confirmation n'a pas pu aboutir.";
    }).catch(function () { bandeau.textContent = "Connexion impossible. Rechargez la page pour confirmer votre vote."; });
  }

  // Lien partagé vers un finaliste : la carte est mise en avant.
  var f = params.get("f");
  var cible = f && document.querySelector('.vote-carte[data-finaliste="' + f.replace(/[^a-z0-9-]/gi, "") + '"]');
  if (cible && !code) {
    cible.classList.add("vote-carte-cible");
    cible.scrollIntoView({ block: "center" });
    if (ouvert) setTimeout(function () { ouvrir(cible); }, 400);
  }
})();
