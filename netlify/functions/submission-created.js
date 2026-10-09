// Déclenchée par Netlify à chaque envoi de formulaire.
// Pour la liste d'attente : e-mail de confirmation immédiat à la personne inscrite.
const { FORM_NAME, emailConfirmation, envoyer } = require("../lib/liste-attente");

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || "{}");
    if (!payload || payload.form_name !== FORM_NAME) return { statusCode: 200, body: "ignoré" };
    const d = payload.data || {};
    const email = String(d.email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { statusCode: 200, body: "adresse invalide" };
    const { envoyes } = await envoyer([{ to: [email], ...emailConfirmation(d.prenom) }]);
    return { statusCode: 200, body: envoyes ? "confirmation envoyée" : "confirmation non envoyée" };
  } catch (err) {
    console.error("submission-created :", err.message);
    return { statusCode: 200, body: "erreur" };
  }
};
