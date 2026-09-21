function render(data) {
  const { actualites } = data;
  const liste = [...actualites.liste].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

  return `
<section class="page-hero">
  <div class="container">
    <h1>${actualites.titre}</h1>
    <p class="page-hero-lead">${actualites.intro}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="actualites-grid">
      ${liste
        .map(
          (a) => `<article class="actualite-card reveal">
        <img src="${a.image}" alt="${a.alt}" class="actualite-photo" loading="lazy">
        <div class="actualite-card-body">
          <div class="actualite-meta">
            <span class="badge badge-upcoming">${a.categorie}</span>
            <span class="actualite-date">${a.date}</span>
          </div>
          <h3>${a.titre}</h3>
          <p class="actualite-resume">${a.resume}</p>
          <p class="actualite-contenu">${a.contenu}</p>
          ${
            a.videoUrl
              ? `<a href="${a.videoUrl}" class="btn btn-ghost" target="_blank" rel="noopener">▶ Voir la vidéo</a>`
              : ""
          }
        </div>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>
`;
}

module.exports = { render };
