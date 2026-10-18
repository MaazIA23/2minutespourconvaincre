// Crée la commande et la transaction FedaPay ; les billets sont générés une fois le paiement confirmé.
const crypto = require("crypto");
const B = require("../billetterie");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  if (!corps) return B.reponse(400, { error: "Requête invalide." });

  const p = B.periode();
  const t = B.tarifs();
  if (p === "avant") return B.reponse(400, { error: `La billetterie ouvrira le ${B.config.ouvertureTexte}.` });
  if (p === "fermee") return B.reponse(400, { error: "La billetterie est fermée." });
  if (!t || !process.env.FEDAPAY_SECRET_KEY) return B.reponse(500, { error: "La billetterie n'est pas encore configurée." });

  const categorie = B.CATEGORIES.includes(corps.categorie) ? corps.categorie : null;
  const quantite = Math.floor(Number(corps.quantite));
  const a = corps.acheteur || {};
  const acheteur = { prenom: B.propre(a.prenom), nom: B.propre(a.nom), email: B.propre(a.email, 120).toLowerCase(), whatsapp: B.propre(a.whatsapp, 30), fonction: B.propre(a.fonction, 80) };
  if (!categorie) return B.reponse(400, { error: "Merci de choisir une catégorie de billet." });
  if (!(quantite >= 1 && quantite <= B.config.maxParCommande)) return B.reponse(400, { error: `Vous pouvez commander de 1 à ${B.config.maxParCommande} billets.` });
  if (!acheteur.prenom || !acheteur.nom) return B.reponse(400, { error: "Merci d'indiquer votre prénom et votre nom." });
  if (!B.emailValide(acheteur.email)) return B.reponse(400, { error: "Merci d'indiquer une adresse e-mail valide : vos billets y seront envoyés." });
  if (!acheteur.fonction) return B.reponse(400, { error: "Merci d'indiquer votre fonction ou profession." });
  if (!/^\+[0-9][0-9 ]{6,18}$/.test(acheteur.whatsapp)) return B.reponse(400, { error: "Merci d'indiquer votre numéro WhatsApp avec l'indicatif du pays (ex. +229)." });

  const autres = Array.isArray(corps.invites) ? corps.invites : [];
  const titulaires = [{ prenom: acheteur.prenom, nom: acheteur.nom }];
  for (let i = 1; i < quantite; i++) {
    const inv = autres[i - 1] || {};
    const titulaire = { prenom: B.propre(inv.prenom), nom: B.propre(inv.nom) };
    if (!titulaire.prenom || !titulaire.nom) return B.reponse(400, { error: `Merci d'indiquer le prénom et le nom du titulaire du billet n° ${i + 1}.` });
    titulaires.push(titulaire);
  }

  const store = B.magasin(event);
  const restantes = B.placesRestantes(await B.lireIndex(store))[categorie];
  if (restantes != null && restantes < quantite) {
    return B.reponse(409, { error: restantes ? `Il ne reste que ${restantes} billet(s) ${B.config.categories[categorie].nom}.` : `Les billets ${B.config.categories[categorie].nom} sont épuisés.` });
  }

  const prixUnitaire = t[categorie][p];
  const montant = prixUnitaire * quantite;
  const id = crypto.randomBytes(12).toString("hex");
  const nomCat = B.config.categories[categorie].nom;

  try {
    const creation = await B.fedapay("/transactions", "POST", {
      description: `${quantite} billet(s) ${nomCat} · Grande finale Deux Minutes Pour Convaincre`,
      amount: montant,
      currency: { iso: "XOF" },
      callback_url: `${process.env.URL || "https://2minpourconvaincre.com"}/billetterie/merci/?commande=${id}`,
      customer: { firstname: acheteur.prenom, lastname: acheteur.nom, email: acheteur.email },
    });
    const transaction = creation["v1/transaction"];
    if (!transaction || !transaction.id) throw new Error("Réponse FedaPay inattendue lors de la création de la transaction.");
    await store.setJSON(`commandes/${id}`, {
      id, statut: "attente", categorie, quantite, tarif: p, prixUnitaire, montant, acheteur, titulaires,
      transactionId: transaction.id, creee: new Date().toISOString(), test: !!B.modeTest(),
    });
    await store.setJSON(`transactions/${transaction.id}`, { commande: id });
    const jeton = await B.fedapay(`/transactions/${transaction.id}/token`, "POST");
    if (!jeton.url) throw new Error("Réponse FedaPay inattendue lors de la génération du lien de paiement.");
    return B.reponse(200, { url: jeton.url });
  } catch (err) {
    console.error("Billetterie commande :", err.message);
    return B.reponse(502, { error: "Impossible de lancer le paiement pour le moment. Merci de réessayer dans quelques instants." });
  }
};
