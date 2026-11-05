// Vote « Coup de cœur du public » :
//   GET                                   état du vote (ouvert ou non), nombre total de voix et, avant la date de masquage, voix de chaque finaliste
//   POST { action: "voter", finaliste, prenom, nom, email, pays, actualites, jeton? }
//        avec un jeton valide (votant déjà confirmé sur cet appareil) : la voix compte tout de suite ;
//        sinon : un e-mail de confirmation est envoyé, la voix compte au clic sur le lien.
//   POST { action: "confirmer", code }    confirmation depuis le lien de l'e-mail ; renvoie le jeton du votant
const B = require("../billetterie");
const V = require("../vote");
const { gabarit, echappe, SITE_URL } = require("../liste-attente");

const DEJA_VOTE = "Vous avez déjà voté aujourd'hui. Revenez demain pour voter à nouveau : vous disposez d'une voix par jour.";

function emailConfirmation(fiche, f, code) {
  const lien = `${SITE_URL}/vote/?confirmer=${code}`;
  return {
    subject: `Confirmez votre vote pour ${V.nomFinaliste(f)} · Coup de cœur du public`,
    ...gabarit(`${echappe(fiche.prenom)}, confirmez votre vote.`, [
      `Vous avez choisi de voter pour <strong>${echappe(V.nomFinaliste(f))}</strong>, finaliste de la 3ème édition de Deux Minutes Pour Convaincre.`,
      `Pour que votre voix compte, cliquez sur le bouton ci-dessous. Ce lien est valable 48 heures. Ensuite, vous pourrez revoter chaque jour depuis le même appareil, sans nouvelle confirmation, jusqu'au ${V.config.fermetureTexte}.`,
    ], { texte: "Confirmer mon vote", lien, image: "bouton-confirmer-mon-vote.png", largeur: 236 },
    "Partagez le lien du vote autour de vous : chaque voix compte.", { mention: "Vous recevez cet e-mail car vous avez voté pour le Coup de cœur du public sur" }),
  };
}

async function enregistrerVotant(store, id, fiche) {
  const cle = `votants/${id}`;
  const ancienne = await store.get(cle, { type: "json" });
  await store.setJSON(cle, {
    prenom: fiche.prenom, nom: fiche.nom, email: fiche.email, pays: fiche.pays,
    actualites: !!(fiche.actualites || (ancienne && ancienne.actualites)),
    premierVote: (ancienne && ancienne.premierVote) || new Date().toISOString(), test: !!V.config.essai,
  });
}

exports.handler = async function (event) {
  const store = V.magasin(event);

  if (event.httpMethod === "GET") {
    const masques = V.scoresMasques();
    return B.reponse(200, {
      periode: V.periode(), total: await V.lireTotal(store), jour: V.jourDuVote(), essai: !!V.config.essai,
      masques, scores: masques ? null : await V.lireScores(store),
    });
  }
  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  if (!corps) return B.reponse(400, { error: "Requête invalide." });
  const ferme = () => B.reponse(400, { error: V.periode() === "avant" ? `Le vote ouvre le ${V.config.ouvertureTexte}.` : `Le vote est clos depuis le ${V.config.fermetureTexte}. Merci pour votre participation !` });

  if (corps.action === "confirmer") {
    const code = String(corps.code || "");
    if (!/^[0-9a-f]{48}$/.test(code)) return B.reponse(404, { error: "Lien de confirmation invalide." });
    const attente = await store.get(`attente/${code}`, { type: "json" });
    if (!attente) return B.reponse(404, { error: "Ce lien a déjà été utilisé ou n'existe plus. Vous pouvez voter à nouveau depuis la page du vote." });
    if (Date.now() - new Date(attente.le).getTime() > V.VALIDITE_ATTENTE) {
      await store.delete(`attente/${code}`);
      return B.reponse(410, { error: "Ce lien a expiré (48 heures). Vous pouvez voter à nouveau depuis la page du vote." });
    }
    if (V.periode() !== "ouvert") return ferme();
    const f = V.finaliste(attente.finaliste);
    if (!f) return B.reponse(400, { error: "Ce finaliste n'est plus soumis au vote." });
    const id = V.votant(attente.email);
    await enregistrerVotant(store, id, attente);
    const jeton = await V.signer(store, id);
    const total = await V.enregistrerVoix(store, id, attente, f.id, "e-mail");
    await store.delete(`attente/${code}`);
    const votantPublic = { prenom: attente.prenom, nom: attente.nom, pays: attente.pays };
    if (total === null) return B.reponse(409, { error: DEJA_VOTE, jeton, votant: votantPublic });
    return B.reponse(200, { ok: true, jeton, votant: votantPublic, finaliste: f.id, nomFinaliste: V.nomFinaliste(f), total });
  }

  if (corps.action !== "voter") return B.reponse(400, { error: "Action inconnue." });
  if (V.periode() !== "ouvert") return ferme();
  const f = V.finaliste(String(corps.finaliste || ""));
  if (!f) return B.reponse(400, { error: "Merci de choisir un finaliste." });
  const ip = event.headers["x-nf-client-connection-ip"] || (event.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (!(await V.limiter(store, ip))) return B.reponse(429, { error: "Trop de demandes depuis cette connexion aujourd'hui. Merci de réessayer demain." });

  // Votant déjà confirmé sur cet appareil : la voix compte tout de suite.
  const idJeton = corps.jeton ? await V.verifierJeton(store, corps.jeton) : null;
  if (idJeton) {
    const fiche = await store.get(`votants/${idJeton}`, { type: "json" });
    if (fiche) {
      const total = await V.enregistrerVoix(store, idJeton, fiche, f.id, "appareil");
      if (total === null) return B.reponse(409, { error: DEJA_VOTE });
      return B.reponse(200, { ok: true, confirme: true, finaliste: f.id, nomFinaliste: V.nomFinaliste(f), total });
    }
  }

  const fiche = {
    prenom: B.propre(corps.prenom, 60), nom: B.propre(corps.nom, 60), email: B.propre(corps.email, 120).toLowerCase(),
    pays: B.propre(corps.pays, 60), actualites: corps.actualites === true,
  };
  if (!fiche.prenom || !fiche.nom) return B.reponse(400, { error: "Merci d'indiquer votre prénom et votre nom." });
  if (!B.emailValide(fiche.email)) return B.reponse(400, { error: "Merci d'indiquer une adresse e-mail valide : le lien de confirmation y sera envoyé." });
  if (!fiche.pays) return B.reponse(400, { error: "Merci d'indiquer votre pays." });
  const id = V.votant(fiche.email);
  if (await store.get(`voix/${V.jourDuVote()}/${id}`, { type: "json" })) return B.reponse(409, { error: DEJA_VOTE });

  const code = require("crypto").randomBytes(24).toString("hex");
  await store.setJSON(`attente/${code}`, { ...fiche, finaliste: f.id, le: new Date().toISOString() });
  const envoye = await B.envoyerEmail({ to: [fiche.email], ...emailConfirmation(fiche, f, code) });
  if (!envoye) {
    await store.delete(`attente/${code}`).catch(() => {});
    return B.reponse(502, { error: "L'e-mail de confirmation n'a pas pu être envoyé. Merci de réessayer dans quelques instants." });
  }
  return B.reponse(200, { ok: true, aConfirmer: true, email: fiche.email, nomFinaliste: V.nomFinaliste(f) });
};
