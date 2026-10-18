// Liste d'attente des candidatures : e-mails envoyés via Resend.
// Variables d'environnement Netlify :
//   RESEND_API_KEY           clé API Resend (déjà utilisée pour les notifications de dons)
//   NOTIFICATION_FROM_EMAIL  expéditeur sur un domaine vérifié dans Resend (ex. contact@2minpourconvaincre.com)
//   NETLIFY_API_TOKEN        jeton d'accès personnel Netlify, pour lire les inscriptions du formulaire
//   SITE_ID                  fourni par Netlify (ou NETLIFY_SITE_ID en secours)
const candidature = require("../../content/pages/candidature.json");
const site = require("../../content/site.json");

const FORM_NAME = "liste-attente-candidature";
const SITE_URL = "https://2minpourconvaincre.com";
const PAGE_CANDIDATURE = `${SITE_URL}/candidature/`;

function expediteur() {
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  // L'adresse de test de Resend n'envoie qu'au propriétaire du compte : inutilisable pour le public.
  if (!process.env.RESEND_API_KEY || !from || from.endsWith("@resend.dev")) return null;
  return `Deux Minutes Pour Convaincre <${from.replace(/^.*<|>$/g, "")}>`;
}

const RESEAUX = (site.contact.reseauxSociaux.plateformes || []).filter((r) => r.url);

const echappe = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function gabarit(titre, paragraphes, bouton, accroche, options = {}) {
  // Charte v2 : bandeau en image (Gmail ne recolore jamais les images, même en mode sombre),
  // corps en couleurs neutres qui restent lisibles quand la messagerie inverse les couleurs.
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head>
<body style="margin:0;padding:0;background:#f3f4f8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f8"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e3e5ee">
  <tr><td style="padding:0;line-height:0;background:#071487"><img src="${SITE_URL}/assets/img/email/entete-2mpc-3e-edition.jpg" width="600" alt="Deux Minutes Pour Convaincre · 3ème édition" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>
  <tr><td style="padding:30px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#1d1f33">
    <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#071487">${titre}</h1>
    ${paragraphes.map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#1d1f33;text-align:justify">${p}</p>`).join("")}
  </td></tr>
  ${options.blocs || ""}
  ${accroche ? `<tr><td style="padding:6px 32px 14px;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.45;font-style:italic;color:#b8892a">${accroche}</td></tr>` : ""}
  ${bouton ? `<tr><td style="padding:10px 32px 8px"><a href="${bouton.lien}" style="text-decoration:none"><img src="${SITE_URL}/assets/img/email/${bouton.image}" width="${bouton.largeur}" height="51" alt="${bouton.texte}" style="display:block;border:0;width:${bouton.largeur}px;height:51px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#071487"></a></td></tr>` : ""}
  <tr><td style="padding:26px 32px 6px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1d1f33;text-align:center;border-top:1px solid #eceef4">
    Suivez-nous sur nos réseaux pour ne rien manquer de l'aventure.
  </td></tr>
  <tr><td align="center" style="padding:10px 32px 24px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    ${RESEAUX.map((r) => `<td style="padding:0 6px"><a href="${r.url}" style="text-decoration:none"><img src="${SITE_URL}/assets/img/email/reseau-${r.nom.toLowerCase()}.png" width="40" height="40" alt="${r.nom}" style="display:block;border:0;width:40px;height:40px"></a></td>`).join("")}
  </tr></table></td></tr>
  <tr><td style="padding:18px 32px 26px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b6f85;text-align:center;border-top:1px solid #eceef4">
    ${options.mention || "Vous recevez cet e-mail car vous vous êtes inscrit(e) à la liste d'attente sur"} <a href="${SITE_URL}" style="color:#071487">${SITE_URL.replace("https://", "")}</a>.<br>Une création de La Muse Éloquente.
  </td></tr>
</table></td></tr></table></body></html>`;
  const text = [titre, "", ...paragraphes.map((p) => p.replace(/<[^>]+>/g, "")), options.texteBlocs || "", accroche ? `\n${accroche}` : "", bouton ? `\n${bouton.texte} : ${bouton.lien}` : "", "", "Suivez-nous pour ne rien manquer de l'aventure :", ...RESEAUX.map((r) => `${r.nom} : ${r.url}`), "", "Une création de La Muse Éloquente."].join("\n");
  return { html, text };
}

function emailConfirmation(prenom) {
  const p = echappe(prenom);
  return {
    subject: "Votre place est réservée · 3ème édition de Deux Minutes Pour Convaincre",
    ...gabarit(p ? `${p}, votre place est réservée.` : "Votre place est réservée.", [
      `Merci d'avoir rejoint la liste d'attente de la 3ème édition de Deux Minutes Pour Convaincre, la scène qui révèle les orateurs.`,
      `Le <strong>${candidature.dateOuvertureCandidatures}</strong>, les candidatures ouvriront. Vous serez parmi les premiers à le savoir : nous vous écrirons ce jour-là.`,
      `D'ici là, commencez à préparer votre voix. Cette année, tout commence en vidéo : deux minutes, un thème de votre choix, et une seule mission, convaincre.`,
    ], { texte: "Découvrir la candidature", lien: PAGE_CANDIDATURE, image: "bouton-decouvrir-la-candidature.png", largeur: 291 },
    "Et si la prochaine voix révélée était la vôtre ?"),
  };
}

function emailOuverture(prenom) {
  const p = echappe(prenom);
  return {
    subject: "La scène vous attend : les candidatures sont ouvertes",
    ...gabarit(p ? `${p}, la scène vous attend.` : "La scène vous attend.", [
      `Le moment est venu. Les candidatures de la 3ème édition de Deux Minutes Pour Convaincre sont officiellement ouvertes.`,
      `Une vidéo de deux minutes, sur le thème de votre choix. Une idée, une conviction, votre voix. Vous avez jusqu'au <strong>${candidature.dateLimiteCandidatures}</strong> pour nous convaincre.`,
      `À la clé : le Grand Prix de la Francophonie, une semaine en France pour le lauréat.`,
    ], { texte: "Je candidate", lien: PAGE_CANDIDATURE, image: "bouton-je-candidate.png", largeur: 181 },
    "Deux minutes. Une scène. À vous de jouer."),
  };
}

async function envoyer(messages) {
  const from = expediteur();
  if (!from) {
    console.error("Envoi impossible : RESEND_API_KEY ou NOTIFICATION_FROM_EMAIL (domaine vérifié) manquant.");
    return { envoyes: 0 };
  }
  let envoyes = 0;
  // L'API batch de Resend accepte jusqu'à 100 e-mails par appel.
  for (let i = 0; i < messages.length; i += 100) {
    const lot = messages.slice(i, i + 100).map((m) => ({ from, ...m }));
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(lot),
    });
    if (res.ok) envoyes += lot.length;
    else console.error("Échec d'envoi Resend :", res.status, await res.text().catch(() => ""));
  }
  return { envoyes };
}

// Toutes les inscriptions du formulaire, dédoublonnées par adresse e-mail.
async function inscrits() {
  const token = process.env.NETLIFY_API_TOKEN;
  const site = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  if (!token || !site) throw new Error("NETLIFY_API_TOKEN ou SITE_ID manquant : impossible de lire la liste d'attente.");
  const api = (chemin) => fetch(`https://api.netlify.com/api/v1${chemin}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => { if (!r.ok) throw new Error(`API Netlify ${r.status} sur ${chemin}`); return r.json(); });
  const formulaires = await api(`/sites/${site}/forms`);
  const form = formulaires.find((f) => f.name === FORM_NAME);
  if (!form) return [];
  const vus = new Map();
  for (let page = 1; ; page++) {
    const lot = await api(`/forms/${form.id}/submissions?per_page=100&page=${page}`);
    lot.forEach((s) => {
      const d = s.data || {};
      const email = String(d.email || s.email || "").trim().toLowerCase();
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !vus.has(email)) vus.set(email, { email, prenom: String(d.prenom || "").trim() });
    });
    if (lot.length < 100) break;
  }
  return [...vus.values()];
}

module.exports = { FORM_NAME, candidature, emailConfirmation, emailOuverture, envoyer, inscrits, gabarit, echappe, SITE_URL };
