// Bloc « chiffres clés » commun à toutes les pages : un chiffre par ligne, en très grand,
// qui compte depuis zéro à l'apparition (data-compteur, voir assets/js/main.js).
// Un chiffre peut porter des liens vers les réseaux sociaux (champ « reseaux »), affichés en icônes sous le libellé.
const icones = {
  TikTok: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.9c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3.3-2.7 5.9-5.9 5.9S4.7 18.3 4.7 15c0-3.1 2.4-5.6 5.4-5.9v3c-1.3.3-2.4 1.5-2.4 2.9 0 1.6 1.3 3 3 3s3-1.3 3-3V3h2.8z"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.2-1.5 1.6-1.5h1.7V4.7C15.9 4.6 14.9 4.5 13.8 4.5c-2.5 0-4.2 1.5-4.2 4.3v2.1H7v3.1h2.6V22h3.9z"/></svg>',
  Instagram: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none"/></svg>',
};
const reseaux = (liste) => liste && liste.length
  ? `<span class="chiffre-reseaux">${liste.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nom}">${icones[r.nom] || r.nom}</a>`).join("")}</span>`
  : "";

function listeChiffres(chiffres) {
  return `<ul class="acc-chiffres-liste">
      ${chiffres
        .map((c, i) => `<li data-reveal style="--delai:${(i * 0.1).toFixed(2)}s"><strong data-compteur>${c.valeur}</strong><span>${c.libelle}</span>${reseaux(c.reseaux)}</li>`)
        .join("\n      ")}
    </ul>`;
}

module.exports = { listeChiffres };
