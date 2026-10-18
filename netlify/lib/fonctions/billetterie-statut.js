// Page de confirmation : vérifie le paiement auprès de FedaPay (si le webhook n'est pas encore passé) et renvoie les billets.
const B = require("../billetterie");

exports.handler = async function (event) {
  const id = String((event.queryStringParameters || {}).commande || "");
  if (!/^[0-9a-f]{24}$/.test(id)) return B.reponse(400, { error: "Commande inconnue." });
  const store = B.magasin(event);
  let commande = await store.get(`commandes/${id}`, { type: "json" });
  if (!commande) return B.reponse(404, { error: "Commande inconnue." });
  let statutFedapay = null;
  if (commande.statut !== "payee") {
    try {
      const data = await B.fedapay(`/transactions/${commande.transactionId}`, "GET");
      const transaction = data["v1/transaction"];
      statutFedapay = transaction && transaction.status;
      commande = (await B.finaliserCommande(store, id, transaction)) || commande;
    } catch (err) {
      console.error("Billetterie statut :", err.message);
    }
  }
  if (commande.statut !== "payee") {
    const echec = ["declined", "canceled", "cancelled", "refunded", "expired"].includes(statutFedapay);
    return B.reponse(200, { statut: echec ? "echec" : "attente" });
  }
  const billets = commande.billets.map((b, i) => ({
    numero: b.numero, categorie: B.config.categories[commande.categorie].nom,
    prenom: commande.titulaires[i].prenom, nom: commande.titulaires[i].nom,
    lien: `/billet/?n=${encodeURIComponent(b.numero)}&c=${b.cle}`,
  }));
  return B.reponse(200, { statut: "payee", email: commande.acheteur.email, prenom: commande.acheteur.prenom, billets });
};
