// Espace billetterie (page /espace-billetterie/, mot de passe BILLETTERIE_MOT_DE_PASSE) :
// tableau de bord, liste des billets et des entrées, invitations, renvoi et annulation de billets.
const B = require("../billetterie");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  if (!corps) return B.reponse(400, { error: "Requête invalide." });
  if (!process.env.BILLETTERIE_MOT_DE_PASSE) return B.reponse(500, { error: "Mot de passe non configuré dans Netlify (BILLETTERIE_MOT_DE_PASSE)." });
  if (!B.egal(corps.motdepasse, process.env.BILLETTERIE_MOT_DE_PASSE)) return B.reponse(401, { error: "Mot de passe incorrect." });
  const store = B.magasin(event);

  if (corps.action === "tableau") {
    const index = await B.lireIndex(store);
    return B.reponse(200, {
      periode: B.periode(), test: !!B.modeTest(), tarifsConfigures: !!B.tarifs(),
      codeAccueilConfigure: !!process.env.BILLETTERIE_CODE_ACCUEIL,
      places: Object.fromEntries(B.CATEGORIES.map((c) => [c, B.config.categories[c].places])),
      restantes: B.placesRestantes(index),
      categories: Object.fromEntries(B.CATEGORIES.map((c) => [c, B.config.categories[c].nom])),
      billets: Object.values(index.billets).sort((a, b) => (a.cree < b.cree ? 1 : -1)),
      refus: index.refus || [],
    });
  }

  if (corps.action === "inviter") {
    const categorie = B.CATEGORIES.includes(corps.categorie) ? corps.categorie : null;
    const prenom = B.propre(corps.prenom), nom = B.propre(corps.nom);
    const email = B.propre(corps.email, 120).toLowerCase();
    const whatsapp = B.propre(corps.whatsapp, 30);
    const fonction = B.propre(corps.fonction, 80);
    if (!categorie || !prenom || !nom) return B.reponse(400, { error: "Catégorie, prénom et nom sont obligatoires." });
    if (email && !B.emailValide(email)) return B.reponse(400, { error: "Adresse e-mail invalide." });
    const [billet] = await B.creerBillets(store, { categorie, type: "invitation", tarif: "invitation", prix: 0, titulaires: [{ prenom, nom }], contact: { email, whatsapp, fonction } });
    const envoye = email ? await B.envoyerEmail({ to: [email], ...B.emailBillets([billet], { invitation: true }) }) : false;
    return B.reponse(200, { numero: billet.numero, lien: B.lienBillet(billet), envoye });
  }

  const numero = String(corps.numero || "");
  if (!/^2MPC-[A-Z]{1,3}-\d{4,}$/.test(numero)) return B.reponse(400, { error: "Numéro de billet invalide." });
  const billet = await store.get(`billets/${numero}`, { type: "json" });
  if (!billet) return B.reponse(404, { error: "Billet introuvable." });

  if (corps.action === "renvoyer") {
    const email = B.propre(corps.email || billet.email, 120).toLowerCase();
    if (!B.emailValide(email)) return B.reponse(400, { error: "Aucune adresse e-mail valide pour ce billet." });
    const envoye = await B.envoyerEmail({ to: [email], ...B.emailBillets([billet], { invitation: billet.type === "invitation" }) });
    return envoye ? B.reponse(200, { ok: true, email }) : B.reponse(502, { error: "L'e-mail n'a pas pu être envoyé." });
  }

  // Changement de nom (conditions de vente) : nouvelle clé, donc l'ancien billet et son QR code ne sont plus valables.
  if (corps.action === "renommer") {
    const prenom = B.propre(corps.prenom), nom = B.propre(corps.nom);
    if (!prenom || !nom) return B.reponse(400, { error: "Prénom et nom du nouveau titulaire obligatoires." });
    if (billet.entree) return B.reponse(400, { error: "Ce billet a déjà été utilisé à l'entrée." });
    const ancien = `${billet.prenom} ${billet.nom}`;
    billet.prenom = prenom; billet.nom = nom;
    billet.cle = require("crypto").randomBytes(12).toString("hex");
    billet.renomme = { le: new Date().toISOString(), ancien };
    await store.setJSON(`billets/${numero}`, billet);
    await B.majIndex(store, (index) => {
      if (index.billets[numero]) Object.assign(index.billets[numero], { prenom, nom, lien: B.lienBillet(billet), renomme: billet.renomme });
    });
    const email = B.propre(corps.email || billet.email, 120).toLowerCase();
    const envoye = B.emailValide(email) ? await B.envoyerEmail({ to: [email], ...B.emailBillets([billet], { invitation: billet.type === "invitation" }) }) : false;
    return B.reponse(200, { ok: true, lien: B.lienBillet(billet), envoye, email });
  }

  if (corps.action === "annuler" || corps.action === "retablir") {
    billet.annule = corps.action === "annuler";
    await store.setJSON(`billets/${numero}`, billet);
    await B.majIndex(store, (index) => { if (index.billets[numero]) index.billets[numero].annule = billet.annule; });
    return B.reponse(200, { ok: true, annule: billet.annule });
  }

  return B.reponse(400, { error: "Action inconnue." });
};
