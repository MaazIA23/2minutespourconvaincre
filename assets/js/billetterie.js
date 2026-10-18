/* Billetterie 2MPC : page de vente, confirmation, billet (dessiné en image), espace billetterie et contrôle à l'entrée. */
(function () {
  "use strict";

  var API = "/.netlify/functions/";
  var $ = function (id) { return document.getElementById(id); };
  var fcfa = function (n) { return Number(n).toLocaleString("fr-FR").replace(/ |\s/g, " ") + " FCFA"; };
  var echappe = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function appel(fonction, corps) {
    var options = corps ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) } : {};
    return fetch(API + fonction, options).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { data._ok = res.ok; data._statut = res.status; return data; });
    });
  }

  function memoire(cle, valeur) {
    try {
      if (valeur === undefined) return sessionStorage.getItem(cle);
      if (valeur === null) sessionStorage.removeItem(cle); else sessionStorage.setItem(cle, valeur);
    } catch (e) { return null; }
  }

  /* ---------------- Page de vente ---------------- */
  (function () {
    var form = $("billetterie-form");
    if (!form) return;
    var infos = null;
    var quantite = $("billet-quantite");
    var invites = $("billetterie-invites");
    var note = $("billetterie-note");
    var bouton = $("billetterie-payer");

    function categorie() { var c = form.querySelector('input[name="categorie"]:checked'); return c ? c.value : "standard"; }

    function majInvites() {
      var n = parseInt(quantite.value, 10) || 1;
      var anciens = Array.prototype.map.call(invites.querySelectorAll(".invite"), function (d) {
        return { prenom: d.querySelector("[data-prenom]").value, nom: d.querySelector("[data-nom]").value };
      });
      var html = "";
      if (n > 1) html += '<p class="invites-intro">Chaque billet est nominatif. Le billet n°&nbsp;1 est à votre nom ; indiquez le titulaire des autres billets.</p>';
      for (var i = 1; i < n; i++) {
        var a = anciens[i - 1] || { prenom: "", nom: "" };
        html += '<div class="invite form-row-pair"><div class="form-row"><label>Billet n°&nbsp;' + (i + 1) + ' · prénom</label><input type="text" data-prenom maxlength="60" required value="' + echappe(a.prenom) + '"></div>' +
          '<div class="form-row"><label>Nom</label><input type="text" data-nom maxlength="60" required value="' + echappe(a.nom) + '"></div></div>';
      }
      invites.innerHTML = html;
      majTotal();
    }

    function majTotal() {
      if (!infos || !infos.ouverte) return;
      var n = parseInt(quantite.value, 10) || 1;
      var c = infos.categories[categorie()];
      var total = c.prix * n;
      $("billetterie-total").innerHTML = n + " billet" + (n > 1 ? "s" : "") + " " + echappe(c.nom) + " × " + fcfa(c.prix) + " = <strong>" + fcfa(total) + "</strong>";
      bouton.textContent = "Payer " + fcfa(total);
    }

    appel("billetterie-infos").then(function (d) {
      if (!d._ok || !d.periode) throw new Error("infos");
      infos = d;
      $("billetterie-chargement").hidden = true;
      if (d.test) $("billetterie-test").hidden = false;
      if (d.periode === "avant") { $("billetterie-avant").hidden = false; return; }
      if (d.periode === "fermee" || !d.ouverte) { $("billetterie-fermee").hidden = false; return; }
      form.hidden = false;
      if (d.periode === "prevente") $("billetterie-prevente").hidden = false;
      Object.keys(d.categories).forEach(function (cle) {
        var c = d.categories[cle];
        var prix = form.querySelector('[data-prix="' + cle + '"]');
        prix.innerHTML = (c.prixPlein ? "<s>" + fcfa(c.prixPlein) + "</s> " : "") + fcfa(c.prix);
        prix.hidden = false;
        var input = form.querySelector('input[name="categorie"][value="' + cle + '"]');
        if (c.restantes != null) {
          var r = form.querySelector('[data-restantes="' + cle + '"]');
          r.textContent = c.restantes ? (c.restantes <= 50 ? "Plus que " + c.restantes + " place" + (c.restantes > 1 ? "s" : "") : "") : "Épuisé";
          r.hidden = !r.textContent;
          if (!c.restantes) { input.disabled = true; if (input.checked) { input.checked = false; } }
        }
      });
      if (!form.querySelector('input[name="categorie"]:checked')) {
        var libre = form.querySelector('input[name="categorie"]:not(:disabled)');
        if (libre) libre.checked = true; else { form.hidden = true; $("billetterie-fermee").hidden = false; }
      }
      majInvites();
    }).catch(function () {
      $("billetterie-chargement").innerHTML = "<p>La billetterie est momentanément indisponible. Merci de réessayer dans quelques instants.</p>";
    });

    quantite.addEventListener("change", majInvites);
    form.addEventListener("change", function (e) { if (e.target.name === "categorie") majTotal(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = "Merci de remplir tous les champs : une adresse e-mail valide, un numéro WhatsApp avec l'indicatif du pays (ex. +229) et le nom de chaque titulaire.";
        return;
      }
      bouton.disabled = true;
      note.textContent = "Redirection vers le paiement sécurisé…";
      appel("billetterie-commande", {
        categorie: categorie(),
        quantite: parseInt(quantite.value, 10),
        acheteur: { prenom: $("acheteur-prenom").value, nom: $("acheteur-nom").value, email: $("acheteur-email").value, whatsapp: $("acheteur-whatsapp").value },
        invites: Array.prototype.map.call(invites.querySelectorAll(".invite"), function (d) {
          return { prenom: d.querySelector("[data-prenom]").value, nom: d.querySelector("[data-nom]").value };
        }),
      }).then(function (r) {
        if (r._ok && r.url) { window.location.href = r.url; return; }
        note.textContent = r.error || "Le paiement n'a pas pu être lancé (erreur " + r._statut + "). Merci de réessayer dans quelques instants.";
        bouton.disabled = false;
      }).catch(function () {
        note.textContent = "Connexion impossible. Vérifiez votre réseau, puis réessayez.";
        bouton.disabled = false;
      });
    });
  })();

  /* ---------------- Page de confirmation ---------------- */
  (function () {
    var zone = $("merci-billets");
    if (!zone) return;
    var commande = new URLSearchParams(location.search).get("commande") || "";
    var titre = $("merci-billets-titre"), texte = $("merci-billets-texte");
    var essais = 0;
    function verifier() {
      appel("billetterie-statut?commande=" + encodeURIComponent(commande)).then(function (r) {
        if (r.statut === "payee") {
          titre.textContent = "Merci " + r.prenom + ", c'est réservé !";
          texte.textContent = (r.billets.length > 1 ? "Vos billets ont été envoyés" : "Votre billet a été envoyé") + " à " + r.email + ". Vous pouvez aussi les ouvrir ici.";
          zone.innerHTML = r.billets.map(function (b) {
            return '<a class="billet-lien" href="' + b.lien + '"><span>' + echappe(b.categorie) + '</span><strong>' + echappe(b.prenom + " " + b.nom.toUpperCase()) + '</strong><em>Billet n° ' + echappe(b.numero) + '</em><b>Voir le billet →</b></a>';
          }).join("");
          return;
        }
        if (r.statut === "echec" || r._statut === 404 || r._statut === 400) {
          titre.textContent = "Le paiement n'a pas abouti.";
          texte.textContent = "Aucun montant n'a été débité pour cette commande, ou il vous sera restitué par FedaPay. Vous pouvez recommencer votre achat.";
          $("merci-retour").hidden = false;
          return;
        }
        if (++essais < 40) { setTimeout(verifier, 3000); return; }
        titre.textContent = "Paiement en cours de confirmation.";
        texte.innerHTML = "La confirmation prend plus de temps que prévu. Dès qu'elle arrive, vos billets vous sont envoyés par e-mail. En cas de doute, écrivez-nous à <a href=\"mailto:contact@2minpourconvaincre.com\">contact@2minpourconvaincre.com</a>.";
      }).catch(function () { if (++essais < 40) setTimeout(verifier, 4000); });
    }
    verifier();
  })();

  /* ---------------- Retrouver mes billets ---------------- */
  (function () {
    var form = $("retrouver-form");
    if (!form) return;
    var note = $("retrouver-note"), bouton = $("retrouver-envoyer");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { note.textContent = "Merci d'indiquer une adresse e-mail valide."; return; }
      bouton.disabled = true;
      note.textContent = "Envoi en cours…";
      appel("billetterie-retrouver", { email: $("retrouver-email").value }).then(function (r) {
        note.textContent = r.message || r.error || "L'envoi n'a pas pu aboutir. Merci de réessayer dans quelques instants.";
        bouton.disabled = false;
      }).catch(function () { note.textContent = "Connexion impossible. Vérifiez votre réseau, puis réessayez."; bouton.disabled = false; });
    });
  })();

  /* ---------------- Dessin du billet (format horizontal, 1620 × 620) ---------------- */
  function chargerImage(src) {
    return new Promise(function (ok, ko) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = ko; i.src = src; });
  }

  // Texte avec espacement des lettres (tous les navigateurs ne gèrent pas ctx.letterSpacing).
  function texteEspace(ctx, texte, x, y, espace, align) {
    var largeur = 0, i;
    for (i = 0; i < texte.length; i++) largeur += ctx.measureText(texte[i]).width + (i < texte.length - 1 ? espace : 0);
    var depart = align === "center" ? x - largeur / 2 : align === "right" ? x - largeur : x;
    var ancien = ctx.textAlign; ctx.textAlign = "left";
    for (i = 0; i < texte.length; i++) { ctx.fillText(texte[i], depart, y); depart += ctx.measureText(texte[i]).width + espace; }
    ctx.textAlign = ancien;
    return largeur;
  }

  function rectArrondi(ctx, x, y, l, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + l, y, x + l, y + h, r); ctx.arcTo(x + l, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + l, y, r); ctx.closePath();
  }

  function dessinerBillet(b, qrSrc) {
    var W = 1620, H = 620, E = 2;
    var canvas = document.createElement("canvas");
    canvas.width = W * E; canvas.height = H * E;
    var ctx = canvas.getContext("2d");
    ctx.scale(E, E);
    var polices = ["800 58px Poppins", "700 30px Poppins", "600 20px Poppins", "500 20px Poppins"].map(function (p) { return document.fonts ? document.fonts.load(p) : Promise.resolve(); });
    return Promise.all([chargerImage("/assets/img/billet/logo-blanc.png"), chargerImage(qrSrc)].concat(polices)).then(function (res) {
      var logo = res[0], qr = res[1];
      var cat = b.categorie.toUpperCase();

      ctx.save();
      rectArrondi(ctx, 0, 0, W, H, 36); ctx.clip();
      var fond = ctx.createLinearGradient(0, 0, W * 0.55, H * 1.4);
      fond.addColorStop(0, "#0b1fa8"); fond.addColorStop(0.55, "#071487"); fond.addColorStop(1, "#050f6e");
      ctx.fillStyle = fond; ctx.fillRect(0, 0, W, H);
      var halo = ctx.createRadialGradient(320, 0, 0, 320, 0, 520);
      halo.addColorStop(0, "rgba(255,240,190,.14)"); halo.addColorStop(1, "rgba(255,240,190,0)");
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);

      // Logo et badge « 3ème Édition » de la même largeur
      ctx.drawImage(logo, 70, 56, 330, 330 * logo.height / logo.width);
      var by = 56 + 330 * logo.height / logo.width + 14;
      var or = ctx.createLinearGradient(70, 0, 400, 0);
      or.addColorStop(0, "#f3e3a0"); or.addColorStop(0.5, "#d9b54a"); or.addColorStop(1, "#c99a2e");
      ctx.fillStyle = or; rectArrondi(ctx, 70, by, 330, 42, 21); ctx.fill();
      ctx.fillStyle = "#10154a"; ctx.textBaseline = "alphabetic";
      ctx.font = "600 24px Poppins"; var l3 = ctx.measureText("3").width;
      ctx.font = "600 14px Poppins"; var lE = ctx.measureText("ème").width;
      ctx.font = "600 24px Poppins"; var lEd = ctx.measureText(" Édition").width;
      var bx = 235 - (l3 + lE + lEd) / 2;
      ctx.fillText("3", bx, by + 30);
      ctx.font = "600 14px Poppins"; ctx.fillText("ème", bx + l3, by + 21);
      ctx.font = "600 24px Poppins"; ctx.fillText(" Édition", bx + l3 + lE, by + 30);

      ctx.fillStyle = "#e3c35a"; ctx.font = "600 22px Poppins"; ctx.textAlign = "right";
      ctx.fillText("www.2minpourconvaincre.com", 1110, 120); ctx.textAlign = "left";

      // Bande de catégorie
      var bande = ctx.createLinearGradient(0, 0, 1180, 0);
      bande.addColorStop(0, "#ffffff"); bande.addColorStop(0.7, "#eef2ff"); bande.addColorStop(1, "#dfe6ff");
      ctx.fillStyle = bande; ctx.fillRect(0, 276, 1180, 82);
      ctx.fillStyle = "#071487"; ctx.font = "800 58px Poppins";
      var lc = texteEspace(ctx, cat, 70, 339, 5.8);
      ctx.globalAlpha = 0.8; ctx.font = "600 20px Poppins";
      texteEspace(ctx, b.sousTitre.toUpperCase(), 70 + lc + 28, 337, 2.8);
      ctx.globalAlpha = 1;
      if (b.test) { ctx.fillStyle = "#c62828"; ctx.font = "800 22px Poppins"; ctx.textAlign = "right"; ctx.fillText("BILLET DE TEST", 1150, 330); ctx.textAlign = "left"; }

      // Informations
      function champ(x, y, etiquette, valeur, taille) {
        ctx.fillStyle = "#cfd9ff"; ctx.font = "600 19px Poppins"; texteEspace(ctx, etiquette.toUpperCase(), x, y, 3.4);
        ctx.fillStyle = "#ffffff"; ctx.font = "700 " + (taille || 29) + "px Poppins"; ctx.fillText(valeur, x, y + 10 + (taille || 29));
      }
      var nom = b.prenom + " " + b.nom.toUpperCase();
      var tNom = 42; ctx.font = "700 42px Poppins";
      while (ctx.measureText(nom).width > 360 && tNom > 26) { tNom -= 2; ctx.font = "700 " + tNom + "px Poppins"; }
      champ(70, 424, "Nom du détenteur", nom, tNom);
      champ(459, 424, "Date", b.evenement.date);
      champ(865, 424, "Tarif", b.tarif);
      champ(70, 531, "Billet n°", b.numero);
      ctx.fillStyle = "#cfd9ff"; ctx.font = "600 19px Poppins"; texteEspace(ctx, "LIEU", 459, 531, 3.4);
      ctx.fillStyle = "#ffffff"; ctx.font = "700 29px Poppins";
      var lieu = b.evenement.lieu + " ";
      ctx.fillText(lieu, 459, 570);
      var ll = ctx.measureText(lieu).width;
      ctx.fillStyle = "#dfe5ff"; ctx.font = "500 29px Poppins"; ctx.fillText("(" + b.evenement.salle + ")", 459 + ll, 570);

      // Talon : catégorie, QR code, consigne
      var cx = 1402;
      ctx.fillStyle = "#e3c35a"; ctx.font = "800 30px Poppins";
      if (b.invitation) { texteEspace(ctx, "INVITATION", cx, 112, 6, "center"); texteEspace(ctx, cat, cx, 150, 6, "center"); }
      else texteEspace(ctx, cat, cx, 132, 6, "center");
      ctx.fillStyle = "#ffffff"; rectArrondi(ctx, cx - 145, 176, 290, 290, 20); ctx.fill();
      ctx.imageSmoothingEnabled = false; ctx.drawImage(qr, cx - 133, 188, 266, 266); ctx.imageSmoothingEnabled = true;
      ctx.textAlign = "center";
      ctx.font = "700 22px Poppins"; ctx.fillText("Présentez ce billet à l'accueil.", cx, 512);
      ctx.fillStyle = "#e6ebff"; ctx.font = "500 19px Poppins"; ctx.fillText("Une personne, une seule entrée.", cx, 540);
      ctx.textAlign = "left";

      // Perforation et encoches
      ctx.strokeStyle = "rgba(207,217,255,.55)"; ctx.lineWidth = 4; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(1182, 30); ctx.lineTo(1182, H - 30); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalCompositeOperation = "destination-out";
      [0, H].forEach(function (y) { ctx.beginPath(); ctx.arc(1182, y, 32, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalCompositeOperation = "source-over";

      if (b.annule) {
        ctx.fillStyle = "rgba(4,11,82,.72)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff"; ctx.font = "800 96px Poppins"; ctx.textAlign = "center"; ctx.fillText("BILLET ANNULÉ", W / 2, H / 2 + 32); ctx.textAlign = "left";
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(207,217,255,.5)"; ctx.lineWidth = 3; rectArrondi(ctx, 1.5, 1.5, W - 3, H - 3, 35); ctx.stroke();
      return canvas;
    });
  }

  /* ---------------- Page du billet ---------------- */
  (function () {
    var statut = $("billet-statut");
    if (!statut || !$("billet-img")) return;
    var p = new URLSearchParams(location.search);
    var n = p.get("n") || "", c = p.get("c") || "";
    var qrSrc = API + "billetterie-billet?n=" + encodeURIComponent(n) + "&c=" + encodeURIComponent(c) + "&format=qr";
    appel("billetterie-billet?n=" + encodeURIComponent(n) + "&c=" + encodeURIComponent(c)).then(function (b) {
      if (!b._ok) { statut.innerHTML = "Billet introuvable. Vérifiez le lien reçu par e-mail, ou <a href=\"/billetterie/retrouver/\">recevez à nouveau vos billets</a>."; return; }
      document.title = (b.invitation ? "Invitation " : "Billet ") + b.categorie + " · " + b.prenom + " " + b.nom.toUpperCase();
      return dessinerBillet(b, qrSrc).then(function (canvas) {
        var url = canvas.toDataURL("image/png");
        var img = $("billet-img");
        img.src = url; img.alt = document.title;
        $("billet-figure").hidden = false;
        statut.textContent = b.annule ? "Ce billet a été annulé." : (b.invitation ? "Votre invitation " : "Votre billet ") + b.categorie + " pour la " + b.evenement.nom.toLowerCase() + ", " + b.evenement.date.toLowerCase() + ".";
        if (b.annule) return;
        var nomFichier = "Billet-2MPC-" + b.numero + ".png";
        var tele = $("billet-telecharger"); tele.href = url; tele.download = nomFichier;
        $("billet-actions").hidden = false;
        $("billet-qr-img").src = qrSrc; $("billet-qr").hidden = false;
        $("billet-imprimer").addEventListener("click", function () { window.print(); });
        canvas.toBlob(function (blob) {
          var fichier = blob && window.File ? new File([blob], nomFichier, { type: "image/png" }) : null;
          if (fichier && navigator.canShare && navigator.canShare({ files: [fichier] })) {
            var partager = $("billet-partager"); partager.hidden = false;
            partager.addEventListener("click", function () { navigator.share({ files: [fichier], title: document.title }).catch(function () {}); });
          }
        });
      });
    }).catch(function () { statut.textContent = "Impossible d'afficher le billet pour le moment. Vérifiez votre connexion, puis rechargez la page."; });
  })();

  /* ---------------- Espace billetterie ---------------- */
  (function () {
    var connexion = $("espace-connexion");
    if (!connexion) return;
    var mdp = memoire("2mpc-espace");
    var donnees = null, minuterie = null;
    var heure = function (iso) { return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };
    var jour = function (iso) { return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); };
    var libelle = { prevente: "Prévente", vente: "Plein tarif", invitation: "Invitation" };
    var motifs = { inconnu: "Billet inconnu", deja: "Déjà utilisé", annule: "Billet annulé", test: "Billet de test" };

    function charger() {
      return appel("billetterie-admin", { motdepasse: mdp, action: "tableau" }).then(function (d) {
        if (d._statut === 401) { memoire("2mpc-espace", null); location.reload(); return; }
        if (!d._ok) throw new Error(d.error || "Erreur");
        donnees = d; afficher();
      });
    }

    function carte(titre, valeur, detail) { return '<div class="outil-carte"><span>' + titre + '</span><strong>' + valeur + '</strong>' + (detail ? '<em>' + detail + '</em>' : "") + '</div>'; }

    function afficher() {
      var d = donnees;
      var reels = d.billets.filter(function (b) { return !b.annule && (!b.test || d.test); });
      var alertes = [];
      if (!d.tarifsConfigures) alertes.push("Les prix ne sont pas encore enregistrés dans Netlify (BILLETTERIE_TARIFS) : la vente ne peut pas ouvrir.");
      if (!d.codeAccueilConfigure) alertes.push("Le code d'accueil n'est pas encore enregistré dans Netlify (BILLETTERIE_CODE_ACCUEIL).");
      if (d.test) alertes.push("Mode test actif : la billetterie est ouverte hors dates et les billets portent la mention TEST.");
      $("espace-alertes").innerHTML = alertes.map(echappe).join("<br>"); $("espace-alertes").hidden = !alertes.length;

      var html = "";
      Object.keys(d.categories).forEach(function (c) {
        var vendus = reels.filter(function (b) { return b.categorie === c && b.type === "vente"; }).length;
        var invites = reels.filter(function (b) { return b.categorie === c && b.type === "invitation"; }).length;
        html += carte("Billets " + d.categories[c] + " vendus", vendus, invites + " invitation" + (invites > 1 ? "s" : "") + (d.restantes[c] != null ? " · " + d.restantes[c] + " places restantes" : ""));
      });
      var encaisse = reels.filter(function (b) { return b.type === "vente"; }).reduce(function (s, b) { return s + (b.prix || 0); }, 0);
      html += carte("Montant encaissé", fcfa(encaisse), "hors frais FedaPay");
      html += carte("Entrées", reels.filter(function (b) { return b.entree; }).length + " / " + reels.length, "personnes entrées / billets émis");
      html += carte("Période", { avant: "Avant l'ouverture", prevente: "Prévente", vente: "Plein tarif", fermee: "Billetterie fermée" }[d.periode], "");
      $("espace-cartes").innerHTML = html;
      $("espace-maj").textContent = "Mis à jour à " + heure(new Date().toISOString()) + " · actualisation automatique toutes les 20 secondes.";

      afficherBillets();

      var entres = reels.filter(function (b) { return b.entree; }).sort(function (a, b) { return a.entree.le < b.entree.le ? 1 : -1; });
      var html2 = "";
      Object.keys(d.categories).forEach(function (c) {
        var tous = reels.filter(function (b) { return b.categorie === c; });
        html2 += carte(d.categories[c], tous.filter(function (b) { return b.entree; }).length + " / " + tous.length, "entrées / billets");
      });
      html2 += carte("Refus", d.refus.length, "tentatives refusées");
      $("espace-cartes-entrees").innerHTML = html2;
      $("espace-entrees").innerHTML = entres.map(function (b) {
        return "<tr><td>" + heure(b.entree.le) + "</td><td>" + echappe(b.entree.porte) + "</td><td>" + echappe(b.numero) + "</td><td>" + echappe(b.prenom + " " + b.nom.toUpperCase()) + "</td><td>" + echappe(d.categories[b.categorie]) + (b.type === "invitation" ? " (invitation)" : "") + "</td></tr>";
      }).join("") || '<tr><td colspan="5">Aucune entrée pour le moment.</td></tr>';
      $("espace-absents").innerHTML = reels.filter(function (b) { return !b.entree; }).sort(function (a, b) { return (a.nom + a.prenom).localeCompare(b.nom + b.prenom, "fr"); }).map(function (b) {
        return "<tr><td>" + echappe(b.numero) + "</td><td>" + echappe(b.prenom + " " + b.nom.toUpperCase()) + "</td><td>" + echappe(d.categories[b.categorie]) + (b.type === "invitation" ? " (invitation)" : "") + "</td><td>" + (b.whatsapp ? '<a href="https://wa.me/' + b.whatsapp.replace(/[^\d]/g, "") + '" target="_blank" rel="noopener">' + echappe(b.whatsapp) + "</a>" : "") + "</td></tr>";
      }).join("") || '<tr><td colspan="4">Tout le monde est arrivé.</td></tr>';
      $("espace-refus").innerHTML = d.refus.map(function (r) {
        return "<tr><td>" + heure(r.le) + "</td><td>" + echappe({ vip: "Porte VIP", standard: "Porte Standard" }[r.porte] || "Accueil") + "</td><td>" + echappe(motifs[r.motif] || r.motif) + "</td><td>" + echappe(r.numero) + "</td><td>" + echappe(r.nom || "") + "</td></tr>";
      }).join("") || '<tr><td colspan="5">Aucune tentative refusée.</td></tr>';
    }

    function afficherBillets() {
      var q = $("espace-recherche").value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
      var liste = donnees.billets.filter(function (b) {
        return !q || (b.prenom + " " + b.nom + " " + b.email + " " + b.numero + " " + b.whatsapp).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().indexOf(q) >= 0;
      });
      $("espace-billets").innerHTML = liste.map(function (b) {
        var wa = b.whatsapp ? "https://wa.me/" + b.whatsapp.replace(/[^\d]/g, "") + "?text=" + encodeURIComponent("Bonjour " + b.prenom + ", voici votre " + (b.type === "invitation" ? "invitation" : "billet") + " pour la grande finale de Deux Minutes Pour Convaincre : " + b.lien) : "";
        return '<tr class="' + (b.annule ? "annule" : "") + '"><td><a href="' + b.lien + '" target="_blank" rel="noopener">' + echappe(b.numero) + "</a>" + (b.test ? " <small>TEST</small>" : "") + "<br><small>" + jour(b.cree) + "</small></td>" +
          "<td>" + echappe(b.prenom + " " + b.nom.toUpperCase()) + "</td><td>" + echappe(donnees.categories[b.categorie]) + "</td><td>" + echappe(libelle[b.type === "invitation" ? "invitation" : b.tarif]) + (b.prix ? "<br><small>" + fcfa(b.prix) + "</small>" : "") + "</td>" +
          "<td>" + echappe(b.email) + (b.whatsapp ? "<br>" + echappe(b.whatsapp) : "") + "</td><td>" + (b.annule ? "Annulé" : b.entree ? heure(b.entree.le) : "–") + "</td>" +
          '<td class="outil-actions"><button type="button" data-copier="' + echappe(b.lien) + '">Copier le lien</button>' + (wa ? '<a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>' : "") +
          '<button type="button" data-renvoyer="' + echappe(b.numero) + '">Renvoyer</button><button type="button" data-' + (b.annule ? "retablir" : "annuler") + '="' + echappe(b.numero) + '">' + (b.annule ? "Rétablir" : "Annuler") + "</button></td></tr>";
      }).join("") || '<tr><td colspan="7">Aucun billet pour le moment.</td></tr>';
    }

    function entrer() {
      connexion.hidden = true; $("espace").hidden = false;
      charger().catch(function (e) { $("espace-alertes").textContent = e.message; $("espace-alertes").hidden = false; });
      minuterie = setInterval(function () { charger().catch(function () {}); }, 20000);
    }

    connexion.addEventListener("submit", function (e) {
      e.preventDefault();
      mdp = $("espace-mdp").value;
      appel("billetterie-admin", { motdepasse: mdp, action: "tableau" }).then(function (d) {
        if (!d._ok) { $("espace-connexion-note").textContent = d.error || "Connexion impossible."; return; }
        memoire("2mpc-espace", mdp); entrer();
      }).catch(function () { $("espace-connexion-note").textContent = "Connexion impossible. Vérifiez votre réseau."; });
    });
    if (mdp) entrer();

    document.querySelectorAll("[data-onglet]").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-onglet]").forEach(function (x) { x.classList.toggle("actif", x === b); });
        document.querySelectorAll("[data-panneau]").forEach(function (p) { p.hidden = p.getAttribute("data-panneau") !== b.getAttribute("data-onglet"); });
      });
    });
    $("espace-recherche").addEventListener("input", function () { if (donnees) afficherBillets(); });

    $("espace-billets").addEventListener("click", function (e) {
      var t = e.target;
      if (t.dataset.copier) {
        (navigator.clipboard ? navigator.clipboard.writeText(t.dataset.copier) : Promise.reject()).then(function () { t.textContent = "Copié ✓"; }, function () { window.prompt("Copiez le lien :", t.dataset.copier); });
        return;
      }
      var action = t.dataset.renvoyer ? "renvoyer" : t.dataset.annuler ? "annuler" : t.dataset.retablir ? "retablir" : null;
      if (!action) return;
      var numero = t.dataset[action];
      var corps = { motdepasse: mdp, action: action, numero: numero };
      if (action === "renvoyer") {
        var b = donnees.billets.filter(function (x) { return x.numero === numero; })[0];
        var email = window.prompt("Renvoyer le billet " + numero + " à l'adresse :", b.email || "");
        if (!email) return; corps.email = email;
      }
      if (action === "annuler" && !window.confirm("Annuler le billet " + numero + " ? Il sera refusé à l'entrée. (Le remboursement éventuel se fait depuis FedaPay.)")) return;
      t.disabled = true;
      appel("billetterie-admin", corps).then(function (r) {
        if (!r._ok) window.alert(r.error || "Action impossible.");
        else if (action === "renvoyer") window.alert("Billet renvoyé à " + r.email + ".");
        return charger();
      }).catch(function () { window.alert("Connexion impossible."); t.disabled = false; });
    });

    $("espace-inviter").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, note = $("espace-inviter-note");
      var corps = { motdepasse: mdp, action: "inviter" };
      ["categorie", "prenom", "nom", "email", "whatsapp"].forEach(function (k) { corps[k] = f.elements[k].value; });
      note.textContent = "Création de l'invitation…";
      appel("billetterie-admin", corps).then(function (r) {
        if (!r._ok) { note.textContent = r.error || "Création impossible."; return; }
        note.innerHTML = "Invitation " + echappe(r.numero) + " créée" + (r.envoye ? " et envoyée par e-mail" : "") + '. <a href="' + echappe(r.lien) + '" target="_blank" rel="noopener">Voir l\'invitation</a>';
        f.reset(); charger();
      }).catch(function () { note.textContent = "Connexion impossible."; });
    });

    $("espace-export").addEventListener("click", function () {
      if (!donnees) return;
      var col = ["Numéro", "Catégorie", "Type", "Tarif", "Prix (FCFA)", "Prénom", "Nom", "E-mail", "WhatsApp", "Acheté le", "Entrée", "Porte", "Annulé", "Test", "Lien"];
      var cell = function (v) { v = String(v == null ? "" : v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      var lignes = donnees.billets.map(function (b) {
        return [b.numero, donnees.categories[b.categorie], b.type === "invitation" ? "Invitation" : "Vente", libelle[b.type === "invitation" ? "invitation" : b.tarif], b.prix || 0, b.prenom, b.nom, b.email, b.whatsapp, jour(b.cree), b.entree ? jour(b.entree.le) : "", b.entree ? b.entree.porte : "", b.annule ? "oui" : "", b.test ? "oui" : "", b.lien].map(cell).join(";");
      });
      var blob = new Blob(["﻿" + [col.join(";")].concat(lignes).join("\r\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "billetterie-2mpc-" + new Date().toISOString().slice(0, 10) + ".csv"; a.click();
    });

    $("espace-imprimer").addEventListener("click", function () {
      if (!donnees) return;
      var liste = donnees.billets.filter(function (b) { return !b.annule && (!b.test || donnees.test); }).sort(function (a, b) { return (a.nom + a.prenom).localeCompare(b.nom + b.prenom, "fr"); });
      var w = window.open("", "_blank");
      if (!w) { window.alert("Autorisez l'ouverture des fenêtres pour imprimer la liste."); return; }
      w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Liste de secours · billetterie 2MPC</title><style>body{font:13px Arial,sans-serif;margin:24px}h1{font-size:18px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:5px 7px;text-align:left}th{background:#eee}td:last-child{width:70px}</style></head><body><h1>Liste de secours · Grande finale · ' + liste.length + " billets · imprimée le " + jour(new Date().toISOString()) + "</h1><table><tr><th>Nom</th><th>Prénom</th><th>Catégorie</th><th>Billet</th><th>Entré(e)</th></tr>" +
        liste.map(function (b) { return "<tr><td>" + echappe(b.nom.toUpperCase()) + "</td><td>" + echappe(b.prenom) + "</td><td>" + echappe(donnees.categories[b.categorie]) + (b.type === "invitation" ? " (invitation)" : "") + "</td><td>" + echappe(b.numero) + "</td><td>" + (b.entree ? "✓" : "") + "</td></tr>"; }).join("") + "</table></body></html>");
      w.document.close(); w.focus(); w.print();
    });
  })();

  /* ---------------- Contrôle à l'entrée ---------------- */
  (function () {
    var connexion = $("controle-connexion");
    if (!connexion) return;
    var code = memoire("2mpc-accueil-code"), porte = memoire("2mpc-accueil-porte") || "";
    var video = $("controle-video"), canvas = $("controle-canvas"), ctx = canvas.getContext("2d", { willReadFrequently: true });
    var detecteur = null, flux = null, pause = false, dernier = "", dernierLe = 0, retour = null;
    var nomsPortes = { vip: "Porte VIP", standard: "Porte Standard", "": "Accueil unique" };

    function compteur(c) { if (c) $("controle-compteur").textContent = c.entrees + " entrée" + (c.entrees > 1 ? "s" : "") + " sur " + c.total + " billets"; }

    function resultat(etat, message, detail) {
      var zone = $("controle-resultat");
      zone.setAttribute("data-etat", etat);
      $("controle-message").textContent = message;
      $("controle-detail").textContent = detail || "";
      clearTimeout(retour);
      if (etat !== "attente") retour = setTimeout(function () { resultat("attente", "Scannez un billet", ""); }, etat === "valide" ? 2500 : 5000);
      if (navigator.vibrate && etat !== "attente") navigator.vibrate(etat === "valide" ? 120 : [80, 60, 80, 60, 200]);
    }

    function traiter(r) {
      var detail = r.nom ? r.nom + " · " + (r.invitation ? "Invitation " : "") + r.categorie + " · " + r.numero : "";
      var etat = { valide: "valide", deja: "deja", file: "file", refuse: "refuse", inconnu: "refuse" }[r.resultat] || "refuse";
      resultat(etat, r.message || r.error || "Erreur", detail);
      compteur(r.compteur);
    }

    function envoyer(corps) {
      corps.code = code; corps.porte = porte;
      return appel("billetterie-controle", corps).then(function (r) {
        if (r._statut === 401) { memoire("2mpc-accueil-code", null); location.reload(); return; }
        traiter(r);
      }).catch(function () { resultat("refuse", "Pas de connexion internet", "Réessayez, ou utilisez la liste de secours."); });
    }

    function lu(contenu) {
      var maintenant = Date.now();
      if (pause || (contenu === dernier && maintenant - dernierLe < 5000)) return;
      dernier = contenu; dernierLe = maintenant; pause = true;
      resultat("attente", "Vérification…", "");
      envoyer({ action: "scan", contenu: contenu }).then(function () { setTimeout(function () { pause = false; }, 1200); });
    }

    function boucle() {
      if (!flux) return;
      if (!pause && video.readyState >= 2) {
        if (detecteur) {
          detecteur.detect(video).then(function (codes) { if (codes.length) lu(codes[0].rawValue); }).catch(function () {});
        } else if (window.jsQR) {
          var l = 480, h = Math.round(480 * video.videoHeight / video.videoWidth) || 360;
          canvas.width = l; canvas.height = h;
          ctx.drawImage(video, 0, 0, l, h);
          var image = ctx.getImageData(0, 0, l, h);
          var trouve = window.jsQR(image.data, l, h, { inversionAttempts: "dontInvert" });
          if (trouve && trouve.data) lu(trouve.data);
        }
      }
      setTimeout(function () { requestAnimationFrame(boucle); }, 120);
    }

    function camera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { resultat("refuse", "Caméra indisponible", "Utilisez la recherche par nom ci-dessous."); return; }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (s) {
        flux = s; video.srcObject = s; video.play();
        $("controle-camera-btn").hidden = true;
        var natif = "BarcodeDetector" in window ? window.BarcodeDetector.getSupportedFormats() : Promise.resolve([]);
        natif.then(function (formats) { if (formats.indexOf("qr_code") >= 0) detecteur = new window.BarcodeDetector({ formats: ["qr_code"] }); }).catch(function () {}).then(boucle);
      }).catch(function () { resultat("refuse", "Accès à la caméra refusé", "Autorisez la caméra dans les réglages du navigateur, puis rechargez la page."); });
    }

    function entrer(c) {
      connexion.hidden = true; $("controle").hidden = false;
      $("controle-poste").textContent = nomsPortes[porte] || "Accueil";
      compteur(c);
      camera();
    }

    connexion.addEventListener("submit", function (e) {
      e.preventDefault();
      code = $("controle-code").value; porte = $("controle-porte").value;
      appel("billetterie-controle", { code: code, action: "connexion" }).then(function (r) {
        if (!r._ok) { $("controle-connexion-note").textContent = r.error || "Connexion impossible."; return; }
        memoire("2mpc-accueil-code", code); memoire("2mpc-accueil-porte", porte); entrer(r.compteur);
      }).catch(function () { $("controle-connexion-note").textContent = "Pas de connexion internet."; });
    });
    if (code) {
      appel("billetterie-controle", { code: code, action: "connexion" }).then(function (r) {
        if (r._ok) entrer(r.compteur); else memoire("2mpc-accueil-code", null);
      }).catch(function () { entrer(null); });
    }

    $("controle-camera-btn").addEventListener("click", camera);
    $("controle-quitter").addEventListener("click", function () { memoire("2mpc-accueil-code", null); location.reload(); });

    $("controle-recherche").addEventListener("submit", function (e) {
      e.preventDefault();
      var liste = $("controle-resultats");
      liste.innerHTML = "<li>Recherche…</li>";
      appel("billetterie-controle", { code: code, porte: porte, action: "recherche", q: $("controle-q").value }).then(function (r) {
        liste.innerHTML = (r.resultats || []).map(function (b) {
          var etat = b.annule ? "Annulé" : b.test ? "Test" : b.entree ? "Entré(e) à " + b.entree : "";
          return "<li><span><strong>" + echappe(b.nom) + "</strong><br>" + (b.invitation ? "Invitation " : "") + echappe(b.categorie) + " · " + echappe(b.numero) + (etat ? " · " + echappe(etat) : "") + "</span>" +
            (etat ? "" : '<button type="button" class="btn btn-primary" data-valider="' + echappe(b.numero) + '">Valider l\'entrée</button>') + "</li>";
        }).join("") || "<li>Aucun billet trouvé.</li>";
      }).catch(function () { liste.innerHTML = "<li>Pas de connexion internet.</li>"; });
    });
    $("controle-resultats").addEventListener("click", function (e) {
      var numero = e.target.dataset && e.target.dataset.valider;
      if (!numero) return;
      e.target.disabled = true;
      envoyer({ action: "valider", numero: numero }).then(function () { $("controle-resultats").innerHTML = ""; $("controle-q").value = ""; window.scrollTo(0, 0); });
    });
  })();
})();
