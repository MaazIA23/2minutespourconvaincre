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
    accueil: readJson("pages/accueil.json"),
    aPropos: readJson("pages/a-propos.json"),
    programme: readJson("pages/programme.json"),
    quiSommesNous: readJson("pages/qui-sommes-nous.json"),
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
  const programme = require("./pages/programme.js");
  const partenaires = require("./pages/partenaires.js");
  const quiSommesNous = require("./pages/qui-sommes-nous.js");
  const candidature = require("./pages/candidature.js");
  const legal = require("./pages/legal.js");

  writePage(
    "",
    renderLayout(data, {
      title: "Accueil",
      description: `${data.hero ? "" : ""}${data.accueil.hero.eyebrow} ${data.accueil.hero.titre} — ${data.accueil.hero.sousTitre}`,
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
    "programme",
    renderLayout(data, {
      title: "Programme",
      description: data.programme.chapeau,
      activeSlug: "programme",
      bodyHtml: programme.render(data),
    })
  );

  writePage(
    "candidature",
    renderLayout(data, {
      title: "Candidature",
      description: "Déposez votre candidature au concours d'improvisation Deux Minutes Pour Convaincre.",
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
    writePage(
      slug,
      renderLayout(data, {
        title,
        description: title,
        activeSlug: slug,
        bodyHtml: legal.renderLegalPage(title),
      })
    );
  }

  copyDir(ASSETS_DIR, path.join(PUBLIC_DIR, "assets"));
  console.log("  ✓ assets/");
  console.log("Build complete → public/");
}

main();
