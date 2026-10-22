// Candidature rattachée à un pass (avant-première des candidats) :
//   GET  ?pass=<commande>  coordonnées du pass pour préremplir le formulaire, et état du dépôt
//   POST { pass, pays, videoUrl }  dépôt de la candidature, une seule fois par pass payé, pendant l'avant-première
const B = require("../billetterie");
const { gabarit, echappe } = require("../liste-attente");

const passValide = (id) => /^[0-9a-f]{24}$/.test(id);

function emailCandidature(fiche) {
  return {
    subject: "Candidature reçue · 3ème édition de Deux Minutes Pour Convaincre",
    ...gabarit(`${echappe(fiche.prenom)}, votre candidature est bien reçue.`, [
      `Merci d'avoir candidaté à la 3ème édition de Deux Minutes Pour Convaincre. Votre vidéo est entre les mains de notre équipe.`,
      `Nous reviendrons vers vous à l'issue de la présélection. Quelle que soit la suite, votre place pour la grande finale du <strong>${B.config.evenement.date.toLowerCase()}</strong> est garantie : votre billet n° ${echappe(fiche.billet)} vous a été envoyé par e-mail.`,
    ], null, "Et si la prochaine voix révélée était la vôtre ?", { mention: "Vous recevez cet e-mail suite à votre candidature sur" }),
  };
}

exports.handler = async function (event) {
  const store = B.magasin(event);

  if (event.httpMethod === "GET") {
    const id = String((event.queryStringParameters || {}).pass || "");
    if (!passValide(id)) return B.reponse(404, { error: "Pass introuvable." });
    const fiche = await store.get(`candidatures/${id}`, { type: "json" });
    if (!fiche) return B.reponse(404, { error: "Pass introuvable, ou paiement pas encore confirmé." });
    return B.reponse(200, {
      statut: fiche.statut, prenom: fiche.prenom, nom: fiche.nom, email: fiche.email, whatsapp: fiche.whatsapp, fonction: fiche.fonction,
      categorie: B.config.categories[fiche.categorie].nom, ouverte: B.periode() === "candidats", fermeture: B.config.candidats.fermetureTexte,
    });
  }

  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  if (!corps) return B.reponse(400, { error: "Requête invalide." });
  const id = String(corps.pass || "");
  if (!passValide(id)) return B.reponse(404, { error: "Pass introuvable." });
  if (B.periode() !== "candidats") return B.reponse(400, { error: `Les candidatures sont closes depuis le ${B.config.candidats.fermetureTexte}.` });

  const pays = B.propre(corps.pays, 60);
  const fonction = B.propre(corps.fonction, 80);
  const videoUrl = B.propre(corps.videoUrl, 300);
  const age = Number(corps.age);
  if (!Number.isInteger(age) || age < 18 || age > 30) return B.reponse(400, { error: "La candidature est ouverte aux personnes âgées de 18 à 30 ans : merci d'indiquer votre âge." });
  if (!pays) return B.reponse(400, { error: "Merci d'indiquer votre pays de résidence." });
  if (!fonction) return B.reponse(400, { error: "Merci d'indiquer votre fonction ou profession." });
  if (!/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(videoUrl)) return B.reponse(400, { error: "Merci d'indiquer le lien complet de votre vidéo (il commence par https://)." });

  const fiche = await store.get(`candidatures/${id}`, { type: "json" });
  if (!fiche) return B.reponse(404, { error: "Pass introuvable, ou paiement pas encore confirmé." });
  if (fiche.statut === "deposee") return B.reponse(409, { error: "Une candidature a déjà été déposée avec ce pass." });
  const verrou = await store.setJSON(`depots/${id}`, { le: new Date().toISOString() }, { onlyIfNew: true });
  if (!verrou.modified) return B.reponse(409, { error: "Une candidature a déjà été déposée avec ce pass." });

  Object.assign(fiche, { statut: "deposee", age, pays, fonction, videoUrl, deposeeLe: new Date().toISOString() });
  try {
    await store.setJSON(`candidatures/${id}`, fiche);
  } catch (err) {
    await store.delete(`depots/${id}`).catch(() => {});
    throw err;
  }
  await B.envoyerEmail({ to: [fiche.email], ...emailCandidature(fiche) }).catch(() => {});
  await B.notifierEquipe(`Candidature déposée : ${fiche.prenom} ${fiche.nom}${fiche.test ? " [TEST]" : ""}`, [
    `Candidat : ${fiche.prenom} ${fiche.nom} (${fiche.email}, ${fiche.whatsapp})`,
    `Âge : ${age} ans · Fonction : ${fonction} · Pays de résidence : ${pays}`,
    `Vidéo : ${videoUrl}`,
    `Pass : ${B.config.categories[fiche.categorie].nom}, billet ${fiche.billet}`,
  ]);
  return B.reponse(200, { ok: true, prenom: fiche.prenom, email: fiche.email });
};
