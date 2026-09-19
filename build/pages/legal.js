function renderLegalPage(title) {
  return `
<section class="page-hero">
  <div class="container">
    <h1>${title}</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="todo-banner reveal">
      ⚠️ Contenu non fourni. Cette page est un placeholder généré automatiquement en attendant le texte exact de « ${title} » du site officiel. Colle le contenu réel de cette page pour qu'il soit intégré ici tel quel.
    </div>
  </div>
</section>
`;
}

function renderLegalContent(title, content) {
  return `
<section class="page-hero">
  <div class="container">
    <h1>${title}</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose reveal">
      ${(content.intro || []).map((p) => `<p>${p}</p>`).join("\n      ")}
      ${content.sections
        .map(
          (s) => `<h3>${s.heading}</h3>
      ${(s.paragraphs || []).map((p) => `<p>${p}</p>`).join("\n      ")}
      ${
        s.champs
          ? `<ul>${s.champs.map((c) => `<li><strong>${c.label} :</strong> ${c.valeur}</li>`).join("")}</ul>`
          : ""
      }
      ${s.liste ? `<ul>${s.liste.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
      ${(s.apresListe || []).map((p) => `<p>${p}</p>`).join("\n      ")}`
        )
        .join("\n      ")}
    </div>
  </div>
</section>
`;
}

module.exports = { renderLegalPage, renderLegalContent };
