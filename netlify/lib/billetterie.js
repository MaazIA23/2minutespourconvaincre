// Billetterie de la 3ème édition : commandes FedaPay, billets nominatifs à QR code, invitations et contrôle à l'entrée.
// Données dans Netlify Blobs (magasin « billetterie ») :
//   index                  résumé de tous les billets + compteurs de numérotation (écrit avec contrôle de version)
//   billets/<numero>       billet complet, avec sa clé secrète et son entrée (fait foi au contrôle)
//   commandes/<id>         commande en attente ou payée
//   transactions/<id>      transaction FedaPay → commande
//   verrous/<commande>     garantit qu'une commande payée ne génère ses billets qu'une seule fois
//   candidatures/<commande> pass acheté pendant l'avant-première des candidats, puis candidature déposée (une seule par pass)
//   depots/<commande>      garantit qu'un pass ne sert qu'à une seule candidature
// Variables d'environnement Netlify :
//   BILLETTERIE_TARIFS        prix en FCFA, ex. {"standard":{"prevente":8000,"vente":10000},"vip":{"prevente":18000,"vente":20000}}
//   BILLETTERIE_MOT_DE_PASSE  mot de passe de l'espace billetterie
//   BILLETTERIE_CODE_ACCUEIL  code de la page de contrôle (équipe d'accueil)
//   BILLETTERIE_TEST          « candidats », « prevente » ou « vente » : ouvre la billetterie hors dates, billets marqués TEST
//   FEDAPAY_SECRET_KEY, FEDAPAY_ENV, RESEND_API_KEY, NOTIFICATION_FROM_EMAIL, NOTIFICATION_EMAIL (déjà utilisées pour les dons)
const crypto = require("crypto");
const { getStore, connectLambda } = globalThis.__2mpcBlobs || require("@netlify/blobs");
const config = require("../../content/billetterie.json");
const { gabarit, echappe, SITE_URL } = require("./liste-attente");

const CATEGORIES = Object.keys(config.categories);

function magasin(event) {
  if (event && event.blobs) connectLambda(event);
  return getStore({ name: "billetterie", consistency: "strong" });
}

const reponse = (statusCode, data) => ({ statusCode, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(data) });

function lireCorps(event) {
  try { return JSON.parse(event.body || "{}"); } catch (err) { return null; }
}

// Comparaison à temps constant des mots de passe et codes.
function egal(saisi, attendu) {
  if (!attendu) return false;
  const a = crypto.createHash("sha256").update(String(saisi || "")).digest();
  const b = crypto.createHash("sha256").update(String(attendu)).digest();
  return crypto.timingSafeEqual(a, b);
}

function tarifs() {
  try {
    const t = JSON.parse(process.env.BILLETTERIE_TARIFS || "");
    return CATEGORIES.every((c) => t[c] && t[c].prevente > 0 && t[c].vente > 0) ? t : null;
  } catch (err) { return null; }
}

const modeTest = () => (["candidats", "prevente", "vente"].includes(process.env.BILLETTERIE_TEST) ? process.env.BILLETTERIE_TEST : null);

// « avant », « candidats » (avant-première réservée aux candidats), « prevente », « vente » ou « fermee ».
function periode(maintenant = new Date()) {
  if (modeTest()) return modeTest();
  if (maintenant < new Date(config.candidats.ouverture)) return "avant";
  if (maintenant <= new Date(config.candidats.fermeture)) return "candidats";
  if (maintenant < new Date(config.ouverture)) return "avant";
  if (maintenant <= new Date(config.finPrevente)) return "prevente";
  if (maintenant <= new Date(config.fermeture)) return "vente";
  return "fermee";
}

const libelleTarif = { candidats: "Pass candidat", prevente: "Prévente", vente: "Plein tarif", invitation: "Invitation" };

// Prix unitaire d'une catégorie pour la période ; l'avant-première des candidats reprend un tarif existant.
const prixPeriode = (t, categorie, p) => t[categorie][p === "candidats" ? config.candidats.tarif : p];

const lienDepot = (idCommande) => `${SITE_URL}/candidature/?pass=${idCommande}#formulaire`;

function lienBillet(b) {
  return `${SITE_URL}/billet/?n=${encodeURIComponent(b.numero)}&c=${b.cle}`;
}

// Lecture-modification-écriture de l'index, rejouée si un autre appel l'a modifié entre-temps.
async function majIndex(store, modifier) {
  for (let essai = 0; essai < 12; essai++) {
    const lu = await store.getWithMetadata("index", { type: "json" });
    const index = (lu && lu.data) || { compteurs: {}, billets: {}, refus: [] };
    const resultat = modifier(index);
    const options = lu ? { onlyIfMatch: lu.etag } : { onlyIfNew: true };
    const ecrit = await store.setJSON("index", index, options);
    if (ecrit.modified) return resultat;
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 140));
  }
  throw new Error("Index de la billetterie trop sollicité, réessayer.");
}

async function lireIndex(store) {
  return (await store.get("index", { type: "json" })) || { compteurs: {}, billets: {}, refus: [] };
}

function placesPrises(index, categorie) {
  return Object.values(index.billets).filter((b) => b.categorie === categorie && !b.annule && !b.test).length;
}

function placesRestantes(index) {
  const r = {};
  CATEGORIES.forEach((c) => {
    const max = config.categories[c].places;
    r[c] = max == null ? null : Math.max(0, max - placesPrises(index, c));
  });
  return r;
}

const propre = (s, max = 60) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const emailValide = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

// Crée des billets (numéros réservés en une seule écriture de l'index), puis leurs fiches complètes.
async function creerBillets(store, { categorie, type, tarif, prix, titulaires, contact, commande, essai = false }) {
  const test = !!modeTest() || essai;
  const prefixe = (type === "invitation" ? "I" : "") + config.categories[categorie].prefixe;
  const maintenant = new Date().toISOString();
  const billets = titulaires.map((t) => ({
    numero: null, cle: crypto.randomBytes(12).toString("hex"), categorie, type, tarif, prix: prix || 0, test,
    prenom: t.prenom, nom: t.nom, email: contact.email || "", whatsapp: contact.whatsapp || "", fonction: contact.fonction || "", commande: commande || null,
    cree: maintenant, annule: false, entree: null,
  }));
  await majIndex(store, (index) => {
    billets.forEach((b) => {
      const n = (index.compteurs[prefixe] || 0) + 1;
      index.compteurs[prefixe] = n;
      b.numero = `2MPC-${test ? "T" : ""}${prefixe}-${String(n).padStart(4, "0")}`;
      const { cle, ...resume } = b;
      index.billets[b.numero] = { ...resume, lien: lienBillet(b) };
    });
  });
  await Promise.all(billets.map((b) => store.setJSON(`billets/${b.numero}`, b)));
  return billets;
}

// ---------- E-mails ----------

function blocBillet(b) {
  const cat = config.categories[b.categorie];
  const ev = config.evenement;
  const qr = `${SITE_URL}/.netlify/functions/billetterie-billet?n=${encodeURIComponent(b.numero)}&c=${b.cle}&format=qr`;
  return `<tr><td style="padding:8px 32px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #071487;border-radius:14px">
    <tr><td style="padding:14px 18px 4px;font-family:Arial,Helvetica,sans-serif">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b8892a;font-weight:700">${b.type === "invitation" ? "Invitation " : "Billet "}${cat.nom}</p>
      <p style="margin:6px 0 2px;font-size:22px;font-weight:700;color:#071487">${echappe(b.prenom)} ${echappe(b.nom.toUpperCase())}</p>
      <p style="margin:0;font-size:14px;color:#1d1f33">${ev.date} · ${ev.lieu} (${ev.salle})</p>
      <p style="margin:4px 0 0;font-size:13px;color:#6b6f85">Billet n° ${b.numero} · ${libelleTarif[b.type === "invitation" ? "invitation" : b.tarif]}</p>
    </td></tr>
    <tr><td align="center" style="padding:10px 18px 6px"><img src="${qr}" width="180" height="180" alt="QR code du billet ${b.numero}" style="display:block;border:0;width:180px;height:180px"></td></tr>
    <tr><td align="center" style="padding:4px 18px 16px;font-family:Arial,Helvetica,sans-serif"><a href="${lienBillet(b)}" style="color:#071487;font-size:15px;font-weight:700">Voir et télécharger ce billet</a></td></tr>
  </table></td></tr>`;
}

function blocDepot(idCommande) {
  return `<tr><td style="padding:8px 32px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#071487;border-radius:14px">
    <tr><td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;color:#ffffff">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#e3c35a;font-weight:700">Étape 2 sur 2</p>
      <p style="margin:6px 0 10px;font-size:18px;font-weight:700;line-height:1.35">Déposez votre candidature avant le ${config.candidats.fermetureTexte}.</p>
      <a href="${lienDepot(idCommande)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#e3c35a;color:#10154a;font-size:15px;font-weight:700;text-decoration:none">Déposer ma candidature</a>
    </td></tr>
  </table></td></tr>`;
}

function emailBillets(billets, { invitation = false, candidature = null } = {}) {
  const premier = billets[0];
  const prenom = echappe(premier.prenom);
  const ev = config.evenement;
  const plusieurs = billets.length > 1;
  const titre = invitation
    ? `${prenom}, vous êtes notre invité(e).`
    : `${prenom}, ${plusieurs ? "vos billets sont prêts" : "votre billet est prêt"}.`;
  const paragraphes = invitation
    ? [
        `La Muse Éloquente a le plaisir de vous inviter à la grande finale de la 3ème édition de Deux Minutes Pour Convaincre, le <strong>${ev.date.toLowerCase()}</strong>, au <strong>${ev.lieu} (${ev.salle})</strong>.`,
        `Votre invitation nominative est ci-dessous. Présentez-la à l'accueil, sur votre téléphone ou imprimée : il suffit de scanner le QR code.`,
      ]
    : [
        `Merci pour votre achat. Nous avons hâte de vous accueillir à la grande finale de la 3ème édition de Deux Minutes Pour Convaincre, le <strong>${ev.date.toLowerCase()}</strong>, au <strong>${ev.lieu} (${ev.salle})</strong>.`,
        plusieurs
          ? `Voici vos ${billets.length} billets nominatifs. Chaque billet est valable pour une personne et une seule entrée : transmettez à chacun de vos invités le lien de son billet.`
          : `Voici votre billet nominatif. Présentez-le à l'accueil, sur votre téléphone ou imprimé : il suffit de scanner le QR code.`,
      ];
  if (candidature) paragraphes.splice(1, 0, `Votre pass vous garantit votre place à la grande finale, que vous soyez sélectionné(e) ou non. Il ne vous reste plus qu'à déposer votre candidature : le lien est ci-dessous, il ne sert qu'une fois.`);
  const sujet = invitation
    ? `Votre invitation · Grande finale de Deux Minutes Pour Convaincre`
    : `${plusieurs ? "Vos billets" : "Votre billet"} · Grande finale de Deux Minutes Pour Convaincre`;
  const texteBlocs = billets.map((b) => `${b.type === "invitation" ? "Invitation" : "Billet"} ${config.categories[b.categorie].nom} · ${b.prenom} ${b.nom} · n° ${b.numero}\n${lienBillet(b)}`).join("\n\n");
  return {
    subject: sujet,
    ...gabarit(titre, paragraphes, null, "La scène qui révèle les orateurs.", {
      blocs: (candidature ? blocDepot(candidature) : "") + billets.map(blocBillet).join(""),
      texteBlocs: (candidature ? `\nDéposer ma candidature (avant le ${config.candidats.fermetureTexte}) : ${lienDepot(candidature)}\n` : "") + "\n" + texteBlocs + "\n",
      mention: invitation ? "Vous recevez cet e-mail car La Muse Éloquente vous a invité(e) via" : "Vous recevez cet e-mail suite à votre achat sur",
    }),
  };
}

function expediteur() {
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  if (!process.env.RESEND_API_KEY || !from || from.endsWith("@resend.dev")) return null;
  return `Deux Minutes Pour Convaincre <${from.replace(/^.*<|>$/g, "")}>`;
}

async function envoyerEmail(message) {
  const from = expediteur();
  if (!from) { console.error("Billetterie : RESEND_API_KEY ou NOTIFICATION_FROM_EMAIL manquant, e-mail non envoyé."); return false; }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...message }),
  });
  if (!res.ok) console.error("Billetterie : échec Resend", res.status, await res.text().catch(() => ""));
  return res.ok;
}

async function notifierEquipe(sujet, lignes) {
  if (!process.env.NOTIFICATION_EMAIL) return;
  await envoyerEmail({ to: [process.env.NOTIFICATION_EMAIL], subject: sujet, text: lignes.join("\n") }).catch(() => {});
}

// ---------- FedaPay ----------

function apiFedapay() {
  return (process.env.FEDAPAY_ENV || "live") === "sandbox" ? "https://sandbox-api.fedapay.com" : "https://api.fedapay.com";
}

async function fedapay(chemin, methode, corps) {
  const res = await fetch(`${apiFedapay()}/v1${chemin}`, {
    method: methode,
    headers: { Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`, "Content-Type": "application/json" },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.message) || `Erreur FedaPay (HTTP ${res.status})`);
  return data;
}

// Génère les billets d'une commande payée, une seule fois même si le webhook et la page de confirmation arrivent ensemble.
async function finaliserCommande(store, idCommande, transaction) {
  const commande = await store.get(`commandes/${idCommande}`, { type: "json" });
  if (!commande) return null;
  if (commande.statut === "payee") return commande;
  if (!transaction || transaction.status !== "approved") return commande;
  if (Number(transaction.amount) !== commande.montant) {
    console.error(`Billetterie : montant FedaPay ${transaction.amount} différent de la commande ${idCommande} (${commande.montant}).`);
    return commande;
  }
  const verrou = await store.setJSON(`verrous/${idCommande}`, { le: new Date().toISOString() }, { onlyIfNew: true });
  if (!verrou.modified) return commande;
  try {
    const billets = await creerBillets(store, {
      categorie: commande.categorie, type: "vente", tarif: commande.tarif, prix: commande.prixUnitaire,
      titulaires: commande.titulaires, contact: commande.acheteur, commande: idCommande, essai: !!commande.essai,
    });
    commande.statut = "payee";
    commande.payeeLe = new Date().toISOString();
    commande.billets = billets.map((b) => ({ numero: b.numero, cle: b.cle }));
    await store.setJSON(`commandes/${idCommande}`, commande);
    if (commande.candidature) {
      await store.setJSON(`candidatures/${idCommande}`, {
        pass: idCommande, statut: "a-deposer", ...commande.acheteur, categorie: commande.categorie, billet: billets[0].numero,
        payeLe: commande.payeeLe, test: !!commande.test,
      });
    }
    await envoyerEmail({ to: [commande.acheteur.email], ...emailBillets(billets, { candidature: commande.candidature ? idCommande : null }) });
    await notifierEquipe(`Billetterie : ${billets.length} ${commande.candidature ? "pass candidat" : "billet(s)"} ${config.categories[commande.categorie].nom} vendu(s)${modeTest() || commande.essai ? " [TEST]" : ""}`, [
      `Acheteur : ${commande.acheteur.prenom} ${commande.acheteur.nom} (${commande.acheteur.email}, ${commande.acheteur.whatsapp})`,
      `Fonction : ${commande.acheteur.fonction || "non indiquée"}`,
      `Billets : ${billets.map((b) => `${b.numero} ${b.prenom} ${b.nom}`).join(", ")}`,
      `Montant : ${commande.montant} FCFA (${libelleTarif[commande.tarif]})`,
      `Référence FedaPay : ${transaction.id}`,
    ]);
    return commande;
  } catch (err) {
    await store.delete(`verrous/${idCommande}`).catch(() => {});
    throw err;
  }
}

module.exports = {
  config, CATEGORIES, magasin, reponse, lireCorps, egal, tarifs, modeTest, periode, libelleTarif, prixPeriode, lienDepot, lienBillet, notifierEquipe,
  majIndex, lireIndex, placesRestantes, propre, emailValide, creerBillets, emailBillets, envoyerEmail, fedapay, finaliserCommande,
};
