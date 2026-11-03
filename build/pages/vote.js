// Page /vote/ : vote en ligne « Coup de cœur du public » (règlement, article 7.2).
// Les finalistes viennent de content/vote.json ; tant que la liste est vide, la page annonce l'ouverture du vote.

const PAYS = [
  "Bénin", "Togo", "Côte d'Ivoire", "Sénégal", "Burkina Faso", "Niger", "Mali", "Nigeria", "Ghana", "Cameroun", "Gabon",
  "Congo", "République démocratique du Congo", "Guinée", "Tchad", "Centrafrique", "Madagascar", "Rwanda", "Burundi",
  "Mauritanie", "Maroc", "Algérie", "Tunisie", "Égypte", "Afrique du Sud", "Djibouti", "Comores", "Maurice", "Haïti",
  "France", "Belgique", "Suisse", "Luxembourg", "Canada", "États-Unis", "Royaume-Uni", "Allemagne", "Italie", "Espagne",
  "Chine", "Émirats arabes unis",
];

const echappe = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function carte(f) {
  return `<article class="vote-carte" id="finaliste-${f.id}" data-finaliste="${f.id}" data-nom="${echappe(f.prenom)} ${echappe(f.nom)}" data-prenom="${echappe(f.prenom)}">
      <div class="vote-photo">${f.photo ? `<img src="${f.photo}" alt="${echappe(f.prenom)} ${echappe(f.nom)}" loading="lazy">` : ""}</div>
      <p class="vote-prenom">${echappe(f.prenom)}</p>
      <p class="vote-nom">${echappe(f.nom)}</p>
      ${f.video ? `<a class="vote-video" href="${f.video}" target="_blank" rel="noopener">Voir sa prestation</a>` : ""}
      <button type="button" class="btn btn-primary vote-choisir">Voter pour ${echappe(f.prenom)}</button>
    </article>`;
}

function render(data) {
  const v = data.vote;
  const pret = v.finalistes.length > 0;
  return `
<section class="page-hero vote-hero">
  <div class="container">
    <p class="eyebrow">3<sup>ème</sup>&nbsp;Édition · Vote en ligne gratuit</p>
    <h1>${v.titre}</h1>
    <p class="page-hero-lead">Votez pour le finaliste qui vous a le plus convaincu. Vous disposez d'une voix par jour, jusqu'au ${v.fermetureTexte}. Le trophée « Coup de cœur du public » sera remis lors de la grande finale.</p>
    <p class="vote-compteur" id="vote-compteur" hidden><strong id="vote-total">0</strong> voix déjà exprimées</p>
  </div>
</section>

<section class="section vote-section" id="vote" data-ouverture="${v.ouverture}" data-fermeture="${v.fermeture}" data-essai="${v.essai ? "1" : ""}">
  <div class="container">
    <p class="vote-etat" id="vote-avant"${pret ? " hidden" : ""}>Le vote ouvrira le <strong>${v.ouvertureTexte}</strong>, dès l'annonce des huit finalistes. Revenez nous voir à cette date !</p>
    <p class="vote-etat" id="vote-ferme" hidden>Le vote est clos depuis le ${v.fermetureTexte}. Merci pour votre participation ! Le Coup de cœur du public sera révélé lors de la grande finale.</p>
    <p class="vote-etat vote-essai" id="vote-essai" hidden>Mode essai : les voix sont marquées TEST et seront effacées avant l'ouverture.</p>

    <div class="vote-grille" id="vote-grille"${pret ? "" : " hidden"}>
      ${v.finalistes.map(carte).join("\n      ")}
    </div>

    <div class="vote-regles">
      <h2>Comment voter&nbsp;?</h2>
      <ol>
        <li><strong>Choisissez votre finaliste</strong> et indiquez votre prénom, votre nom, votre e-mail et votre pays.</li>
        <li><strong>Confirmez votre vote</strong> grâce au lien reçu par e-mail. Votre voix compte dès que vous cliquez.</li>
        <li><strong>Revenez chaque jour</strong> : depuis le même appareil, vous revotez en un clic, sans nouvelle confirmation.</li>
      </ol>
      <p class="vote-note">Le vote en ligne est distinct du vote du public en salle et n'entre pas dans les notes du jury. Les voix obtenues de manière frauduleuse (votes automatisés, adresses fictives ou multiples) sont annulées.</p>
    </div>
  </div>
</section>

<dialog class="vote-dialogue" id="vote-dialogue" aria-labelledby="vote-dialogue-titre">
  <button type="button" class="vote-fermer" id="vote-fermer" aria-label="Fermer">×</button>
  <h2 id="vote-dialogue-titre">Votre vote pour <span id="vote-choix"></span></h2>

  <div id="vote-rapide" hidden>
    <p>Vous votez en tant que <strong id="vote-qui"></strong>.</p>
    <button type="button" class="btn btn-primary btn-lg btn-block" id="vote-rapide-ok">Voter maintenant</button>
    <button type="button" class="lien-cookies vote-pas-moi" id="vote-pas-moi">Ce n'est pas moi</button>
  </div>

  <form id="vote-form" novalidate>
    <div class="form-row-pair">
      <div class="form-row"><label for="vote-prenom">Prénom</label><input type="text" id="vote-prenom" maxlength="60" autocomplete="given-name" required></div>
      <div class="form-row"><label for="vote-nom">Nom</label><input type="text" id="vote-nom" maxlength="60" autocomplete="family-name" required></div>
    </div>
    <div class="form-row"><label for="vote-email">E-mail</label><input type="email" id="vote-email" maxlength="120" autocomplete="email" required><small class="form-hint">Vous y recevrez le lien pour confirmer votre vote.</small></div>
    <div class="form-row"><label for="vote-pays">Pays</label>
      <select id="vote-pays" required><option value="">Choisissez votre pays</option>${PAYS.map((p) => `<option>${p}</option>`).join("")}<option value="autre">Autre pays</option></select>
      <input type="text" id="vote-pays-autre" maxlength="60" placeholder="Indiquez votre pays" hidden>
    </div>
    <label class="form-case"><input type="checkbox" id="vote-actualites"> <span>J'accepte de recevoir les actualités de Deux Minutes Pour Convaincre (facultatif).</span></label>
    <p class="vote-mention">Vos données servent à vérifier votre vote (une voix par jour) et à établir des statistiques. Elles ne sont jamais vendues. <a href="/confidentialite/#vote" target="_blank" rel="noopener">En savoir plus</a></p>
    <button type="submit" class="btn btn-primary btn-lg btn-block" id="vote-envoyer">Recevoir mon lien de confirmation</button>
  </form>
  <p class="vote-message" id="vote-message" role="status" aria-live="polite"></p>

  <div class="vote-partage" id="vote-partage" hidden>
    <p>Partagez le vote autour de vous :</p>
    <div class="vote-partage-boutons">
      <a class="btn btn-outline" data-partage="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn btn-outline" data-partage="facebook" target="_blank" rel="noopener">Facebook</a>
      <button type="button" class="btn btn-outline" data-partage="copier">Copier le lien</button>
    </div>
  </div>
</dialog>
`;
}

module.exports = { render };
