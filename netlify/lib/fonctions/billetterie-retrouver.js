// « Retrouver mes billets » : renvoie à une adresse e-mail les billets achetés ou reçus avec elle.
// La réponse est toujours la même, pour ne jamais révéler si une adresse a des billets.
const crypto = require("crypto");
const B = require("../billetterie");

const DELAI_MINUTES = 5;
const MESSAGE = "Si des billets sont associés à cette adresse, ils viennent de vous être envoyés par e-mail. Pensez à regarder dans vos courriers indésirables.";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  const email = B.propre(corps && corps.email, 120).toLowerCase();
  if (!B.emailValide(email)) return B.reponse(400, { error: "Merci d'indiquer une adresse e-mail valide." });

  const store = B.magasin(event);
  // Un seul envoi toutes les quelques minutes par adresse, pour éviter les envois en rafale.
  const cle = `renvois/${crypto.createHash("sha256").update(email).digest("hex")}`;
  const dernier = await store.get(cle, { type: "json" });
  if (dernier && Date.now() - new Date(dernier.le).getTime() < DELAI_MINUTES * 60000) return B.reponse(200, { message: MESSAGE });
  await store.setJSON(cle, { le: new Date().toISOString() });

  const index = await B.lireIndex(store);
  const numeros = Object.values(index.billets)
    .filter((b) => b.email === email && !b.annule && (!b.test || B.modeTest()))
    .map((b) => b.numero);
  if (numeros.length) {
    const billets = (await Promise.all(numeros.map((n) => store.get(`billets/${n}`, { type: "json" })))).filter(Boolean);
    const invitation = billets.every((b) => b.type === "invitation");
    if (billets.length) await B.envoyerEmail({ to: [email], ...B.emailBillets(billets, { invitation }) });
  }
  return B.reponse(200, { message: MESSAGE });
};
