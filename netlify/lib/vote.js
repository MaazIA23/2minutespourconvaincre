// Vote en ligne « Coup de cœur du public » (règlement, article 7.2) : gratuit, une voix par jour et par adresse e-mail confirmée.
// Données dans Netlify Blobs (magasin « vote ») :
//   cle                         clé secrète des jetons de votant (créée au premier vote)
//   attente/<jeton>             vote en attente de confirmation par e-mail (valable 48 h)
//   voix/<jour>/<votant>        une voix, le jour J (heure du Bénin) ; <votant> = empreinte de l'adresse e-mail
//   votants/<votant>            fiche du votant : prénom, nom, e-mail, pays, accord pour les actualités
//   total                       nombre de voix affiché sur le site
//   limites/<jour>/<ip>         nombre de demandes par connexion et par jour, contre les robots
const crypto = require("crypto");
const { getStore, connectLambda } = globalThis.__2mpcBlobs || require("@netlify/blobs");
const config = require("../../content/vote.json");

const MAX_DEMANDES_PAR_JOUR = 40;
const VALIDITE_ATTENTE = 48 * 3600e3;

function magasin(event) {
  if (event && event.blobs) connectLambda(event);
  return getStore({ name: "vote", consistency: "strong" });
}

// « avant », « ouvert » ou « ferme ».
function periode(maintenant = new Date()) {
  if (config.essai) return "ouvert";
  if (maintenant < new Date(config.ouverture)) return "avant";
  if (maintenant <= new Date(config.fermeture)) return "ouvert";
  return "ferme";
}

// Jour du vote à l'heure du Bénin (UTC+1, sans heure d'été) : une voix par jour calendaire.
const jourDuVote = (d = new Date()) => new Date(d.getTime() + 3600e3).toISOString().slice(0, 10);

const empreinte = (texte) => crypto.createHash("sha256").update(String(texte)).digest("hex").slice(0, 32);
const votant = (email) => empreinte("votant:" + email);

async function cleSecrete(store) {
  const existante = await store.get("cle", { type: "text" });
  if (existante) return existante;
  await store.set("cle", crypto.randomBytes(32).toString("hex"), { onlyIfNew: true });
  return store.get("cle", { type: "text" });
}

// Jeton gardé dans le navigateur après une première confirmation : permet de revoter les jours suivants sans repasser par l'e-mail.
async function signer(store, id) {
  return id + "." + crypto.createHmac("sha256", await cleSecrete(store)).update(id).digest("hex").slice(0, 32);
}
async function verifierJeton(store, jeton) {
  const [id, sig] = String(jeton || "").split(".");
  if (!/^[0-9a-f]{32}$/.test(id || "") || !sig) return null;
  const attendu = (await signer(store, id)).split(".")[1];
  if (sig.length !== attendu.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(attendu))) return null;
  return id;
}

async function lireTotal(store) {
  return Number(await store.get("total", { type: "text" })) || 0;
}

// Compteur public : écriture avec contrôle de version, pour ne perdre aucune voix quand plusieurs arrivent en même temps.
// En cas d'affluence extrême, le compteur est recalculé à partir des voix elles-mêmes, qui font foi.
async function incrementerTotal(store) {
  for (let essai = 0; essai < 12; essai++) {
    const lu = await store.getWithMetadata("total", { type: "text" });
    const valeur = (lu ? Number(lu.data) || 0 : 0) + 1;
    const res = lu ? await store.set("total", String(valeur), { onlyIfMatch: lu.etag }) : await store.set("total", String(valeur), { onlyIfNew: true });
    if (res.modified) return valeur;
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 80 * (essai + 1)));
  }
  return recompter(store);
}

async function recompter(store) {
  const { blobs } = await store.list({ prefix: "voix/" });
  await store.set("total", String(blobs.length));
  return blobs.length;
}

async function limiter(store, ip) {
  const cle = `limites/${jourDuVote()}/${empreinte("ip:" + (ip || "inconnue"))}`;
  const n = (Number(await store.get(cle, { type: "text" })) || 0) + 1;
  await store.set(cle, String(n));
  return n <= MAX_DEMANDES_PAR_JOUR;
}

const finaliste = (id) => config.finalistes.find((f) => f.id === id) || null;
const nomFinaliste = (f) => `${f.prenom} ${f.nom}`;

// Enregistre la voix du jour ; null si ce votant a déjà voté aujourd'hui.
async function enregistrerVoix(store, idVotant, fiche, idFinaliste, via) {
  const jour = jourDuVote();
  const res = await store.setJSON(`voix/${jour}/${idVotant}`, {
    finaliste: idFinaliste, pays: fiche.pays, le: new Date().toISOString(), via, test: !!config.essai,
  }, { onlyIfNew: true });
  if (!res.modified) return null;
  return incrementerTotal(store);
}

module.exports = {
  config, magasin, periode, jourDuVote, votant, signer, verifierJeton, lireTotal, limiter, finaliste, nomFinaliste,
  enregistrerVoix, VALIDITE_ATTENTE,
};
