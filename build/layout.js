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
    <a href="/" class="logo" aria-label="${data.site.nomSite}, accueil">
      <img src="/assets/img/logo.png" alt="${data.site.nomSite}" class="logo-img">
    </a>
    <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
      <ul>
        ${links}
      </ul>
    </nav>
    <div class="header-actions">
      <a href="/candidature/" class="btn btn-primary">Candidater</a>
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
      const extra =
        item.label === "Partenaires"
          ? `<li><a href="/partenaires/#devenir-partenaire">Devenir partenaire</a></li>`
          : item.label === "Impact"
            ? `<li><a href="/actualites/">Actualités</a></li>`
            : item.label === "Candidature"
              ? `<li><a href="/faq/">FAQ</a></li>`
              : "";
      return `<li><a href="${href}">${item.label}</a></li>${extra}`;
    })
    .join("\n        ");

  const socialIcons = {
    Facebook:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.2-1.5 1.6-1.5h1.7V4.7C15.9 4.6 14.9 4.5 13.8 4.5c-2.5 0-4.2 1.5-4.2 4.3v2.1H7v3.1h2.6V22h3.9z"/></svg>',
    TikTok:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.9c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3.3-2.7 5.9-5.9 5.9S4.7 18.3 4.7 15c0-3.1 2.4-5.6 5.4-5.9v3c-1.3.3-2.4 1.5-2.4 2.9 0 1.6 1.3 3 3 3s3-1.3 3-3V3h2.8z"/></svg>',
    Instagram:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none"/></svg>',
    LinkedIn:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM9 9h3.6v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z"/></svg>',
    YouTube:
      '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor"/><path d="M10 9.5v5l5-2.5z" fill="var(--navy-950)"/></svg>',
  };
  const socials = (data.site.contact.reseauxSociaux.plateformes || [])
    .map(
      (p) =>
        `<li><a href="${p.url}" target="_blank" rel="noopener" aria-label="${p.nom}">${socialIcons[p.nom] || p.nom.slice(0, 2)}</a></li>`
    )
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
    <p>© <span id="year"></span> ${data.site.nomSite}. Tous droits réservés. Un projet ${data.site.organisation.agence}.</p>
  </div>
</footer>`;
}

function renderLayout(data, { title, description, activeSlug = "", bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | ${data.site.nomSite}</title>
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
<button type="button" id="back-to-top" class="back-to-top" aria-label="Remonter en haut de la page">↑</button>
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

module.exports = { renderLayout, renderHeader, renderFooter };
