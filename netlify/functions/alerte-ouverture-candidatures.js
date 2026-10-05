// Fonction planifiée : le jour de l'ouverture des candidatures, prévient tous les inscrits de la liste d'attente.
// Exécution le 15 janvier à 7h UTC (8h à Cotonou). Elle peut aussi être lancée à la main depuis Netlify
// (« Run now ») : elle n'envoie rien en dehors de la période de candidature.
const { candidature, emailOuverture, envoyer, inscrits } = require("../lib/liste-attente");

exports.handler = async () => {
  const ouverture = new Date(candidature.dateOuvertureCandidaturesISO + "+01:00");
  const maintenant = new Date();
  const fin = new Date(ouverture.getTime() + 16 * 24 * 3600 * 1000); // jusqu'à la date limite (30 janvier) incluse
  if (maintenant < ouverture || maintenant > fin) {
    console.log(`Hors période de candidature (${ouverture.toISOString()} → ${fin.toISOString()}) : aucun envoi.`);
    return { statusCode: 200, body: "hors période" };
  }
  try {
    const liste = await inscrits();
    const { envoyes } = await envoyer(liste.map((p) => ({ to: [p.email], ...emailOuverture(p.prenom) })));
    console.log(`Alerte d'ouverture : ${envoyes} e-mail(s) envoyé(s) sur ${liste.length} inscrit(s).`);
    return { statusCode: 200, body: `${envoyes}/${liste.length}` };
  } catch (err) {
    console.error("Alerte d'ouverture :", err.message);
    return { statusCode: 500, body: err.message };
  }
};

exports.config = { schedule: "0 7 15 1 *" };
