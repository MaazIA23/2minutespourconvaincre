// Bloc « chiffres clés » commun à toutes les pages : un chiffre par ligne, en très grand,
// qui compte depuis zéro à l'apparition (data-compteur, voir assets/js/main.js).
function listeChiffres(chiffres) {
  return `<ul class="acc-chiffres-liste">
      ${chiffres
        .map((c, i) => `<li data-reveal style="--delai:${(i * 0.1).toFixed(2)}s"><strong data-compteur>${c.valeur}</strong><span>${c.libelle}</span></li>`)
        .join("\n      ")}
    </ul>`;
}

module.exports = { listeChiffres };
