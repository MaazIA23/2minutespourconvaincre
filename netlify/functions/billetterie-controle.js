// Contrôle à l'entrée (page /controle/, code BILLETTERIE_CODE_ACCUEIL) : scan, recherche par nom ou numéro, validation.
const B = require("../lib/billetterie");

const heure = (iso) => new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Porto-Novo" });
const sansAccents = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

async function noterRefus(store, refus) {
  await B.majIndex(store, (index) => {
    index.refus = [{ ...refus, le: new Date().toISOString() }, ...(index.refus || [])].slice(0, 500);
  }).catch((err) => console.error("Billetterie refus :", err.message));
}

function compteur(index) {
  const valides = Object.values(index.billets).filter((b) => !b.annule && !(b.test && !B.modeTest()));
  return { entrees: valides.filter((b) => b.entree).length, total: valides.length };
}

// Valide l'entrée d'un billet : l'écriture conditionnelle empêche deux portes de valider le même billet.
async function valider(store, numero, cle, porte) {
  for (let essai = 0; essai < 5; essai++) {
    const lu = await store.getWithMetadata(`billets/${numero}`, { type: "json" });
    const billet = lu && lu.data;
    if (!billet || (cle !== null && !B.egal(cle, billet.cle))) {
      await noterRefus(store, { motif: "inconnu", numero, porte });
      return { resultat: "inconnu", message: "Billet inconnu" };
    }
    const cat = B.config.categories[billet.categorie];
    const qui = { numero: billet.numero, nom: `${billet.prenom} ${billet.nom.toUpperCase()}`, categorie: cat.nom, invitation: billet.type === "invitation" };
    if (billet.annule) {
      await noterRefus(store, { motif: "annule", numero, nom: qui.nom, porte });
      return { resultat: "refuse", message: "Billet annulé", ...qui };
    }
    if (billet.test && !B.modeTest()) {
      await noterRefus(store, { motif: "test", numero, nom: qui.nom, porte });
      return { resultat: "refuse", message: "Billet de test, non valable", ...qui };
    }
    if (billet.entree) {
      await noterRefus(store, { motif: "deja", numero, nom: qui.nom, porte });
      return { resultat: "deja", message: `Déjà utilisé à ${heure(billet.entree.le)}${billet.entree.porte ? ` (${billet.entree.porte})` : ""}`, ...qui };
    }
    if (porte && B.CATEGORIES.includes(porte) && porte !== billet.categorie) {
      const file = billet.categorie === "vip" ? "file VIP, à gauche" : "file Standard, à droite";
      return { resultat: "file", message: `Billet ${cat.nom} : ${file}`, ...qui };
    }
    const nomPorte = porte && B.CATEGORIES.includes(porte) ? `Porte ${B.config.categories[porte].nom}` : "Accueil";
    billet.entree = { le: new Date().toISOString(), porte: nomPorte };
    const ecrit = await store.setJSON(`billets/${numero}`, billet, { onlyIfMatch: lu.etag });
    if (!ecrit.modified) continue;
    const index = await B.majIndex(store, (ix) => {
      if (ix.billets[numero]) ix.billets[numero].entree = billet.entree;
      return ix;
    });
    return { resultat: "valide", message: "Billet valide", ...qui, compteur: compteur(index) };
  }
  return { resultat: "erreur", message: "Réseau saturé, scannez à nouveau." };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return B.reponse(405, { error: "Méthode non autorisée" });
  const corps = B.lireCorps(event);
  if (!corps) return B.reponse(400, { error: "Requête invalide." });
  if (!process.env.BILLETTERIE_CODE_ACCUEIL) return B.reponse(500, { error: "Code d'accueil non configuré dans Netlify." });
  if (!B.egal(corps.code, process.env.BILLETTERIE_CODE_ACCUEIL)) return B.reponse(401, { error: "Code incorrect." });
  const store = B.magasin(event);
  const porte = String(corps.porte || "");

  if (corps.action === "connexion") return B.reponse(200, { ok: true, compteur: compteur(await B.lireIndex(store)) });

  if (corps.action === "scan") {
    let numero = "", cle = "";
    try {
      const u = new URL(String(corps.contenu || ""));
      numero = u.searchParams.get("n") || "";
      cle = u.searchParams.get("c") || "";
    } catch (err) { /* contenu qui n'est pas une adresse : billet inconnu */ }
    if (!/^2MPC-[A-Z]{1,3}-\d{4,}$/.test(numero) || !/^[0-9a-f]{24}$/.test(cle)) {
      await noterRefus(store, { motif: "inconnu", numero: String(corps.contenu || "").slice(0, 80), porte });
      return B.reponse(200, { resultat: "inconnu", message: "QR code non reconnu" });
    }
    return B.reponse(200, await valider(store, numero, cle, porte));
  }

  if (corps.action === "valider") {
    const numero = String(corps.numero || "");
    if (!/^2MPC-[A-Z]{1,3}-\d{4,}$/.test(numero)) return B.reponse(400, { error: "Numéro invalide." });
    return B.reponse(200, await valider(store, numero, null, porte));
  }

  if (corps.action === "recherche") {
    const q = sansAccents(corps.q).trim();
    if (q.length < 2) return B.reponse(200, { resultats: [] });
    const index = await B.lireIndex(store);
    const resultats = Object.values(index.billets)
      .filter((b) => sansAccents(`${b.prenom} ${b.nom} ${b.numero}`).includes(q))
      .slice(0, 30)
      .map((b) => ({ numero: b.numero, nom: `${b.prenom} ${b.nom.toUpperCase()}`, categorie: B.config.categories[b.categorie].nom, invitation: b.type === "invitation", annule: b.annule, test: b.test && !B.modeTest(), entree: b.entree ? heure(b.entree.le) : null }));
    return B.reponse(200, { resultats });
  }

  return B.reponse(400, { error: "Action inconnue." });
};
