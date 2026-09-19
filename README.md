# 2 Minutes pour Convaincre

Site officiel de « Deux Minutes Pour Convaincre », le concours d'improvisation oratoire
organisé au Bénin par **La Muse Éloquente**.

Architecture pensée pour que le contenu éditorial (textes, chiffres, jury, partenaires,
palmarès, programme…) soit **entièrement séparé du code**, afin qu'il soit facile de faire
évoluer le site d'une édition à l'autre — 2026 → 2027 — sans toucher au HTML/CSS/JS.

## Structure

```
content/               Toute la matière éditoriale, en JSON, rien d'autre
  site.json             Infos globales : nom, édition en cours, événement, contact
  nav.json               Menu principal + liens de pied de page
  jury.json               Jury, coach, MC, modérateur/modératrice
  marraine.json           Marraine/parrain de l'édition
  intervenants.json       Panel de discussion
  gagnants.json            Palmarès, par édition (historique conservé)
  partenaires.json         Liste des partenaires
  perspectives-3e-edition.json  Pistes exprimées pour la 3e édition (brouillon, à valider)
  pages/
    accueil.json
    a-propos.json
    programme.json
    qui-sommes-nous.json

build/                  Génère le site statique à partir de content/
  build.js               Point d'entrée : lit content/*.json, écrit dans public/
  layout.js               En-tête, pied de page, structure HTML commune
  pages/*.js               Un fichier par page : structure HTML, aucun texte en dur

assets/                 CSS et JS partagés, copiés tels quels dans public/assets/
public/                 Site statique généré (NE PAS éditer à la main — régénéré par le build)
```

## Modifier le contenu

1. Éditer le fichier JSON concerné dans `content/`.
2. Régénérer le site :
   ```bash
   node build/build.js
   ```
3. Prévisualiser en local :
   ```bash
   cd public && python3 -m http.server 8000
   ```
   puis ouvrir http://localhost:8000

Chaque fichier JSON qui doit être revu pour la 3e édition porte un champ `TODO_2027`
expliquant ce qui doit changer (année, dates, lieu, programme, candidats, partenaires,
prix/pass, jury, intervenants, infos de candidature, photos, gagnants).

## État du contenu (édition 2026)

Le contenu vient de deux sources fournies par le client : des captures d'écran du site en
ligne, et le *Rapport Général* officiel de la 2ème édition (PDF). Certaines pages/sections
n'ont pas encore de contenu confirmé et affichent un bandeau `⚠️` le signalant :

- **Candidature** : conditions d'éligibilité et formulaire exacts non fournis (structure
  générale du processus reprise du rapport).
- **Mentions légales / Politique de confidentialité / CGU** : contenu non fourni, pages en
  placeholder.
- **Pass (Diaspora / Candidat / Simple / VIP), FAQ, galerie photo, newsletter** : évoqués par
  le client mais contenu textuel pas encore récupéré — pas encore intégrés au site.

Deux incohérences chiffrées relevées dans le rapport officiel lui-même (non résolues
arbitrairement, signalées dans `content/pages/accueil.json`) :
- Candidats présélectionnés : 12 (p.6 du rapport) vs 16 (p.17)
- Public présent le jour J : +200 (p.6) vs ~150 (p.17)
