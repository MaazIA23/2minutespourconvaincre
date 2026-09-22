const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const ASSETS_DIR = path.join(ROOT, "assets");
const PUBLIC_DIR = path.join(ROOT, "public");

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, relPath), "utf8"));
}

function loadData() {
  return {
    site: readJson("site.json"),
    nav: readJson("nav.json"),
    jury: readJson("jury.json"),
    marraine: readJson("marraine.json"),
    intervenants: readJson("intervenants.json"),
    gagnants: readJson("gagnants.json"),
    partenaires: readJson("partenaires.json"),
    sponsoring: readJson("pages/sponsoring.json"),
    galerie: readJson("galerie.json"),
    editionsIndex: readJson("editions-index.json"),
    actualites: readJson("actualites.json"),
    accueil: readJson("pages/accueil.json"),
    aPropos: readJson("pages/a-propos.json"),
    programme: readJson("pages/programme.json"),
    quiSommesNous: readJson("pages/qui-sommes-nous.json"),
    candidature: readJson("pages/candidature.json"),
    edition1: readJson("pages/edition-1.json"),
    edition2: readJson("pages/edition-2.json"),
    edition3: readJson("pages/edition-3.json"),
    impact: readJson("pages/impact.json"),
    legalPages: readJson("pages/legal.json"),
  };
}

function writePage(slug, html) {
  const dir = slug === "" ? PUBLIC_DIR : path.join(PUBLIC_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log(`  ✓ /${slug}/`.replace("//", "/"));
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function main() {
  console.log("Building 2 Minutes Pour Convaincre...");
  const data = loadData();
  const { renderLayout } = require("./layout.js");

  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });

  const accueil = require("./pages/accueil.js");
  const aPropos = require("./pages/a-propos.js");
  const partenaires = require("./pages/partenaires.js");
  const sponsoring = require("./pages/sponsoring.js");
  const quiSommesNous = require("./pages/qui-sommes-nous.js");
  const candidature = require("./pages/candidature.js");
  const legal = require("./pages/legal.js");
  const editionsIndex = require("./pages/editions-index.js");
  const edition1 = require("./pages/edition-1.js");
  const edition2 = require("./pages/edition-2.js");
  const edition3 = require("./pages/edition-3.js");
  const impact = require("./pages/impact.js");
  const actualites = require("./pages/actualites.js");

  writePage(
    "",
    renderLayout(data, {
      title: "Accueil",
      description: `${data.edition3.accroche}. 3ème édition, ${data.edition3.date}.`,
      activeSlug: "",
      bodyHtml: accueil.render(data),
    })
  );

  writePage(
    "a-propos",
    renderLayout(data, {
      title: "À propos",
      description: data.aPropos.sousTitre,
      activeSlug: "a-propos",
      bodyHtml: aPropos.render(data),
    })
  );

  writePage(
    "editions",
    renderLayout(data, {
      title: "Éditions",
      description: data.editionsIndex.intro,
      activeSlug: "editions",
      bodyHtml: editionsIndex.render(data),
    })
  );

  writePage(
    "editions/1ere-edition",
    renderLayout(data, {
      title: "1ère édition (2025)",
      description: data.edition1.sousTitre,
      activeSlug: "editions/1ere-edition",
      bodyHtml: edition1.render(data),
    })
  );

  writePage(
    "editions/2eme-edition",
    renderLayout(data, {
      title: "2ème édition (2026)",
      description: "Le palmarès, le jury et le déroulé de la 2ème édition, 08 août 2026.",
      activeSlug: "editions/2eme-edition",
      bodyHtml: edition2.render(data),
    })
  );

  writePage(
    "editions/3eme-edition",
    renderLayout(data, {
      title: "3ème édition (mars 2027)",
      description: data.edition3.teaser.accroche,
      activeSlug: "editions/3eme-edition",
      bodyHtml: edition3.render(data),
    })
  );

  writePage(
    "candidature",
    renderLayout(data, {
      title: "Candidature",
      description: data.candidature.sousTitre,
      activeSlug: "candidature",
      bodyHtml: candidature.render(data),
    })
  );

  writePage(
    "partenaires",
    renderLayout(data, {
      title: "Partenaires",
      description: data.partenaires.titre,
      activeSlug: "partenaires",
      bodyHtml: partenaires.render(data),
    })
  );

  writePage(
    "partenaires/sponsoring",
    renderLayout(data, {
      title: "Nos offres de sponsoring",
      description: data.sponsoring.sousTitre,
      activeSlug: "partenaires",
      bodyHtml: sponsoring.render(data),
    })
  );

  writePage(
    "impact",
    renderLayout(data, {
      title: "Notre impact",
      description: data.impact.hero.sousTitre,
      activeSlug: "impact",
      bodyHtml: impact.render(data),
    })
  );

  writePage(
    "actualites",
    renderLayout(data, {
      title: "Actualités",
      description: data.actualites.intro,
      activeSlug: "actualites",
      bodyHtml: actualites.render(data),
    })
  );

  writePage(
    "qui-sommes-nous",
    renderLayout(data, {
      title: "Qui sommes-nous ?",
      description: data.quiSommesNous.intro,
      activeSlug: "qui-sommes-nous",
      bodyHtml: quiSommesNous.render(data),
    })
  );

  for (const [slug, title] of [
    ["mentions-legales", "Mentions légales"],
    ["confidentialite", "Politique de confidentialité"],
    ["cgu", "Conditions générales d'utilisation"],
  ]) {
    const pageContent = data.legalPages[slug];
    writePage(
      slug,
      renderLayout(data, {
        title,
        description: title,
        activeSlug: slug,
        bodyHtml: pageContent
          ? legal.renderLegalContent(title, pageContent)
          : legal.renderLegalPage(title),
      })
    );
  }

  copyDir(ASSETS_DIR, path.join(PUBLIC_DIR, "assets"));
  console.log("  ✓ assets/");
  console.log("Build complete → public/");
}

main();
