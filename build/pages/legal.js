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

module.exports = { renderLegalPage };
