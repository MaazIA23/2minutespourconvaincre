// Pause de la 3ème édition (content/site.json → "pause".actif).
// Tant que la pause est active : dates précises masquées (les pré-inscriptions restent ouvertes), compte à rebours retiré,
// et aucune ouverture automatique (candidatures, billetterie, alerte e-mail). Le contenu d'origine reste intact :
// passer "actif" à false et republier suffit à tout remettre comme avant.
const site = require("../content/site.json");

const actif = () => !!(site.pause && site.pause.actif);
const LOIN = "2099-01-01T00:00:00+01:00";

// Remplacements exacts (dans l'ordre), appliqués à toutes les pages sauf /vote/ pour les phrases datées.
const PHRASES = [
  ["Les candidatures seront ouvertes du 15 janvier au 30 janvier 2027 à 23h59. Pour être prévenu(e) dès l'ouverture, inscrivez-vous sur la liste d'attente de la page Candidature.", "Les dates de candidature seront annoncées prochainement. Pour être prévenu(e) dès l'ouverture, inscrivez-vous sur la liste d'attente de la page Candidature."],
  ["Du 15 au 30 janvier 2027, la candidature à la 3ème édition se fera en vidéo.", "Pour la 3ème édition, la candidature se fera en vidéo."],
  ["Jusqu'au samedi 30 janvier 2027 à 23h59, la billetterie est réservée aux candidats. Elle ouvrira au public le lundi 1er février 2027.", "La billetterie de la 3ème édition ouvrira prochainement : d'abord en avant-première pour les candidats, puis au public."],
  ["Prévente : tarif réduit jusqu'au dimanche 7 février 2027.", "Prévente : tarif réduit pendant les premiers jours de vente."],
  ["Samedi 20 mars 2027 · Palais des Congrès de Cotonou (Salle bleue). Réservez votre place", "Grande finale à Cotonou : date et lieu annoncés prochainement. Réservez bientôt votre place"],
  ["Billetterie de la grande finale, Samedi 20 mars 2027.", "Billetterie de la grande finale de la 3ème édition."],
  ["Les candidatures pour la 3ème édition ouvriront le 15 janvier 2027. Inscrivez-vous dès maintenant pour être informé(e) en priorité dès l'ouverture.", "Le calendrier de la 3ème édition sera annoncé très prochainement. Inscrivez-vous dès maintenant pour être informé(e) en priorité dès l'ouverture."],
  ["du vendredi 15 janvier 2027 au samedi 30 janvier 2027 à 23h59, depuis la page", "pendant la période de candidature, depuis la page"],
  ["au plus tard le samedi 13 mars 2027,", "au plus tard 7 jours avant la grande finale,"],
  ["Les candidatures ouvrent le 15 janvier 2027. Laissez votre e-mail : vous recevrez une confirmation, puis une alerte le jour de l'ouverture.", "Les dates de candidature seront annoncées très prochainement. Laissez votre e-mail : vous recevrez une confirmation, puis une alerte le jour de l'ouverture."],
  ["Les candidatures pour la 3ème édition sont ouvertes du 15 au 30 janvier 2027, 23h59.", "Les dates de candidature de la 3ème édition seront annoncées prochainement."],
  ["la billetterie ouvre au public le lundi 1er février 2027.", "la billetterie ouvrira prochainement au public."],
  ["La billetterie ouvre au public le lundi 1er février 2027.", "La billetterie ouvrira prochainement."],
  ["Rendez-vous le samedi 20 mars 2027 !", "Rendez-vous à la grande finale !"],
  ["du 15 au 30 janvier 2027, avant l'ouverture", "pendant la période de candidature, avant l'ouverture"],
  ["jusqu'au 30 janvier 2027 à 23h59.", "jusqu'à la date limite de candidature."],
  ["Une prévente à tarif réduit aura lieu jusqu'au dimanche 7 février 2027.", "Une prévente à tarif réduit aura lieu dès l'ouverture."],
  ["Ouverture le 15 janvier 2027", "Soyez prévenu(e) de l'ouverture"],
  ["Les candidatures ouvrent le <strong>15 janvier 2027</strong>", "Le calendrier des candidatures sera annoncé prochainement"],
  ["Candidatures ouvertes jusqu'au <strong>30 janvier 2027 à 23h59</strong>", "Candidatures bientôt ouvertes"],
  ["<span>3ème édition</span> Mars 2027 · Journée de la Francophonie", "<span>3ème édition</span> En préparation"],
  ["</svg> Mars 2027</span>", "</svg> Dates à venir</span>"],
  [", en mars 2027.", "."],
];
// Mentions génériques du mois (menu, titres, descriptions), sur toutes les pages.
const GENERIQUES = [["(mars 2027)", "(2027)"], ["pour mars 2027", "pour 2027"], ["en mars 2027", "en 2027"], ["3ème édition, mars 2027", "3ème édition"], ["À Cotonou, en 2027.", "À Cotonou."]];

function transformer(html, slug) {
  if (!actif()) return html;
  html = html.replace(/<section\b[^>]*id="compte-a-rebours"[\s\S]*?<\/section>/, "");
  html = html.replace(/data-open-date="[^"]*"/g, `data-open-date="${LOIN}"`).replace(/data-masquer-apres="[^"]*"/g, `data-masquer-apres="${LOIN}"`);
  if (slug !== "vote") for (const [a, b] of PHRASES) html = html.split(a).join(b);
  for (const [a, b] of GENERIQUES) html = html.split(a).join(b);
  return html;
}

module.exports = { actif, transformer };
