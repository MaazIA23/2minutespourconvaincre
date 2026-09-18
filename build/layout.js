function renderHeader(data, activeSlug) {
  const links = data.nav.menuPrincipal
    .map((item) => {
      const slug = item.lien === "/" ? "" : item.lien.replace(/^\//, "").replace(/\/$/, "");
      const isActive = slug === activeSlug || (item.enfants && activeSlug.startsWith(slug + "/"));
      const active = isActive ? ' class="active"' : "";
      if (item.enfants) {
        const children = item.enfants
          .map((c) => `<li><a href="${c.lien}">${c.label}</a></li>`)
          .join("");
        return `<li class="has-dropdown">
          <a href="${item.lien}"${active}>${item.label} <span class="dropdown-caret">▾</span></a>
          <ul class="dropdown-menu">${children}</ul>
        </li>`;
      }
      return `<li><a href="${item.lien === "/" ? "/" : "/" + slug + "/"}"${active}>${item.label}</a></li>`;
    })
    .join("\n        ");

  return `
<header class="site-header" id="site-header">
  <div class="container header-inner">
    <a href="/" class="logo" aria-label="${data.site.nomSite} — accueil">
      <img src="/assets/img/logo.png" alt="${data.site.nomSite}" class="logo-img">
    </a>
    <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
      <ul>
        ${links}
      </ul>
    </nav>
    <div class="header-actions">
      <a href="/candidature/" class="btn btn-primary">S'inscrire</a>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Ouvrir le menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;
}

function renderFooter(data) {
  const legalLinks = data.nav.footer.liensLegaux
    .map((l) => `<li><a href="${l.lien}/">${l.label}</a></li>`)
    .join("\n      ");

  const navLinks = data.nav.menuPrincipal
    .map((item) => {
      const href = item.lien === "/" || item.lien.endsWith("/") ? item.lien : item.lien + "/";
      return `<li><a href="${href}">${item.label}</a></li>`;
    })
    .join("\n        ");

  const socials = (data.site.contact.reseauxSociaux.plateformes || [])
    .map((p) => `<li><a href="#" aria-label="${p}">${p.slice(0, 2)}</a></li>`)
    .join("\n        ");

  return `
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="/" class="logo">
        <img src="/assets/img/logo.png" alt="${data.site.nomSite}" class="logo-img">
      </a>
      <p>Le plus grand concours d'improvisation oratoire du Bénin, organisé par ${data.site.organisation.agence}.</p>
      <ul class="social-links" aria-label="Réseaux sociaux">
        ${socials}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Navigation</h4>
      <ul>
        ${navLinks}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:${data.site.contact.telephoneWhatsapp.replace(/\s/g, "")}">${data.site.contact.telephoneWhatsapp}</a></li>
        <li><a href="https://wa.me/${data.site.contact.telephoneWhatsapp.replace(/[^\d]/g, "")}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li>${data.site.evenement.lieu}</li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Légal</h4>
      <ul>
        ${legalLinks}
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© <span id="year"></span> ${data.site.nomSite}. Tous droits réservés. — ${data.site.organisation.agence}</p>
  </div>
</footer>`;
}

function renderLayout(data, { title, description, activeSlug = "", bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${data.site.nomSite}</title>
<meta name="description" content="${description}">
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Baloo+2:wght@500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<a class="skip-link" href="#main">Aller au contenu</a>
${renderHeader(data, activeSlug)}
<main id="main">
${bodyHtml}
</main>
${renderFooter(data)}
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

module.exports = { renderLayout, renderHeader, renderFooter };
