// Liste d'attente des candidatures : e-mails envoyés via Resend.
// Variables d'environnement Netlify :
//   RESEND_API_KEY           clé API Resend (déjà utilisée pour les notifications de dons)
//   NOTIFICATION_FROM_EMAIL  expéditeur sur un domaine vérifié dans Resend (ex. contact@2minpourconvaincre.com)
//   NETLIFY_API_TOKEN        jeton d'accès personnel Netlify, pour lire les inscriptions du formulaire
//   SITE_ID                  fourni par Netlify (ou NETLIFY_SITE_ID en secours)
const candidature = require("../../content/pages/candidature.json");

const FORM_NAME = "liste-attente-candidature";
const SITE_URL = "https://2minpourconvaincre.com";
const PAGE_CANDIDATURE = `${SITE_URL}/candidature/`;

function expediteur() {
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  // L'adresse de test de Resend n'envoie qu'au propriétaire du compte : inutilisable pour le public.
  if (!process.env.RESEND_API_KEY || !from || from.endsWith("@resend.dev")) return null;
  return `Deux Minutes Pour Convaincre <${from.replace(/^.*<|>$/g, "")}>`;
}

const echappe = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function gabarit(titre, paragraphes, bouton) {
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#231f20;line-height:1.6">
  <div style="background:#283477;padding:24px 28px;border-radius:14px 14px 0 0">
    <p style="margin:0;color:#f6cc0c;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:12px">Deux Minutes Pour Convaincre · 3ème édition</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:24px;line-height:1.2">${titre}</h1>
  </div>
  <div style="background:#fff;border:1px solid #e4e4e4;border-top:0;padding:24px 28px;border-radius:0 0 14px 14px">
    ${paragraphes.map((p) => `<p style="margin:0 0 14px">${p}</p>`).join("")}
    ${bouton ? `<p style="margin:22px 0 6px"><a href="${bouton.lien}" style="display:inline-block;background:#f6cc0c;color:#283477;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:999px">${bouton.texte}</a></p>` : ""}
    <p style="margin:22px 0 0;font-size:12px;color:#6b6b6b">Vous recevez cet e-mail car vous vous êtes inscrit(e) à la liste d'attente sur ${SITE_URL.replace("https://", "")}.</p>
  </div>
</div>`;
  const text = [titre, "", ...paragraphes.map((p) => p.replace(/<[^>]+>/g, "")), bouton ? `\n${bouton.texte} : ${bouton.lien}` : ""].join("\n");
  return { html, text };
}

function emailConfirmation(prenom) {
  return {
    subject: "Vous êtes sur la liste d'attente : 3ème édition",
    ...gabarit(`Merci ${echappe(prenom) || ""}, c'est noté !`.replace(" ,", ","), [
      `Vous êtes bien inscrit(e) sur la liste d'attente de la 3ème édition de Deux Minutes Pour Convaincre.`,
      `Les candidatures ouvrent le <strong>${candidature.dateOuvertureCandidatures}</strong>. Nous vous écrirons ce jour-là pour vous prévenir.`,
      `En attendant, préparez-vous : la candidature se fait en vidéo, deux minutes sur un thème de votre choix, pour nous convaincre.`,
    ], { texte: "Découvrir la candidature", lien: PAGE_CANDIDATURE }),
  };
}

function emailOuverture(prenom) {
  return {
    subject: "C'est ouvert : candidatez à la 3ème édition !",
    ...gabarit(`${echappe(prenom) ? echappe(prenom) + ", les" : "Les"} candidatures sont ouvertes !`, [
      `Le moment est venu : les candidatures pour la 3ème édition de Deux Minutes Pour Convaincre sont ouvertes.`,
      `Envoyez-nous une vidéo de deux minutes, sur un thème de votre choix, pour nous convaincre. Vous avez jusqu'au <strong>${candidature.dateLimiteCandidatures}</strong>.`,
      `À la clé : le Grand Prix de la Francophonie, une semaine en France pour le lauréat.`,
    ], { texte: "Je candidate", lien: PAGE_CANDIDATURE }),
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

module.exports = { FORM_NAME, candidature, emailConfirmation, emailOuverture, envoyer, inscrits };
