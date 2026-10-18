// Ce que la page billetterie affiche : période en cours, prix (seulement quand la vente est ouverte) et places restantes.
const B = require("../lib/billetterie");

exports.handler = async function (event) {
  const p = B.periode();
  const t = B.tarifs();
  const ouverte = (p === "prevente" || p === "vente") && !!t;
  let restantes = {};
  try { restantes = B.placesRestantes(await B.lireIndex(B.magasin(event))); } catch (err) { console.error("Billetterie infos :", err.message); }
  const categories = {};
  B.CATEGORIES.forEach((c) => {
    categories[c] = { nom: B.config.categories[c].nom, restantes: restantes[c] == null ? null : restantes[c] };
    if (ouverte) categories[c].prix = t[c][p];
    if (ouverte && p === "prevente") categories[c].prixPlein = t[c].vente;
  });
  return B.reponse(200, {
    periode: p, ouverte, test: !!B.modeTest(), categories, maxParCommande: B.config.maxParCommande,
    textes: { ouverture: B.config.ouvertureTexte, finPrevente: B.config.finPreventeTexte, fermeture: B.config.fermetureTexte },
  });
};
