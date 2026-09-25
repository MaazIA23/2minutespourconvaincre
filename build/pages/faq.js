function render(data) {
  const { faq, site } = data;

  return `
<section class="page-hero">
  <div class="container">
    <h1>${faq.titre}</h1>
    <p class="page-hero-lead">${faq.sousTitre}</p>
  </div>
</section>

${faq.categories
  .map(
    (cat, i) => `<section class="section${i % 2 === 1 ? " alt-bg" : ""}">
  <div class="container">
    <div class="section-head reveal">
      <h2>${cat.titre}</h2>
    </div>
    <div class="faq-list">
      ${cat.questions
        .map(
          (q) => `<div class="faq-item reveal">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>${q.question}</span>
          <span class="faq-caret">▾</span>
        </button>
        <div class="faq-answer">
          <p>${q.reponse}</p>
        </div>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
  )
  .join("\n")}

<section class="section${faq.categories.length % 2 === 1 ? " alt-bg" : ""}">
  <div class="container">
    <div class="prose reveal" style="text-align:center">
      <p>Vous ne trouvez pas la réponse à votre question ? <a href="https://wa.me/${site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" target="_blank" rel="noopener"><strong>Contactez-nous sur WhatsApp</strong></a>.</p>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
