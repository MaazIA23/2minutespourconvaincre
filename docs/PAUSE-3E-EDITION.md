# Pause de la 3ème édition : dates retirées du site (novembre 2026)

**Pourquoi** : en novembre 2026, le calendrier de la 3ème édition n'est pas confirmé (financement en cours).
Mazidath Bello a demandé de ne plus afficher de dates (janvier, février, mars) tout en gardant les pré-inscriptions ouvertes.

**Réglage** : `content/site.json` → `"pause": { "actif": true }`. Le contenu d'origine n'a PAS été modifié :
les dates restent dans `content/pages/candidature.json`, `content/billetterie.json`, `content/vote.json`, etc.
La transformation est faite à la publication par `build/pause.js`.

## Ce qui a été retiré ou bloqué pendant la pause

| Élément | Avant | Pendant la pause |
|---|---|---|
| Accroche de l'accueil | « 3ème édition · Mars 2027 · Journée de la Francophonie » | « 3ème édition · En préparation » |
| Menu, titres, descriptions | « 3ème édition (mars 2027) », « en mars 2027 » | « 3ème édition (2027) », « en 2027 » |
| Compte à rebours (accueil) | jusqu'au 15 janvier 2027 | retiré |
| Bloc liste d'attente (accueil) | « Ouverture le 15 janvier 2027 » | « Soyez prévenu(e) de l'ouverture » |
| Candidature, 3ème édition, FAQ, actualités | dates du 15 au 30 janvier 2027 | « dates annoncées prochainement » |
| Billetterie | ouverture candidats 15 janvier, public 1er février, prévente jusqu'au 7 février, finale samedi 20 mars 2027 · Palais des Congrès (Salle bleue) | « date et lieu annoncés prochainement » |
| Conditions de vente | changement de nom « au plus tard le samedi 13 mars 2027 » | « au plus tard 7 jours avant la grande finale » |
| E-mail de confirmation de la liste d'attente | « Le 15 janvier 2027, les candidatures ouvriront » | « Les dates de candidature seront annoncées très prochainement » |
| Ouverture automatique | candidatures et billetterie le 15 janvier 2027 | bloquée (période « avant ») |
| Alerte e-mail à la liste d'attente | envoyée le 15 janvier 2027 à 8h | désactivée |

Inchangé : formulaires de pré-inscription (ouverts), page de vote (cachée, mode essai, dates du vote conservées).

## Pour relancer avec les nouvelles dates

1. Mettre à jour les dates dans : `content/pages/candidature.json` (ouverture, date limite),
   `content/billetterie.json` (candidats, ouverture public, fin de prévente, fermeture, date et lieu de la finale),
   `content/vote.json` (ouverture, masquage, fermeture), `build/pages/accueil.js` (accroche « Mars 2027 »),
   la date de l'alerte dans `netlify/functions/alerte-ouverture-candidatures.js` (`schedule`),
   les conditions de vente (date limite de changement de nom) et les textes contenant « mars 2027 ».
2. Repasser `"pause": { "actif": false }` dans `content/site.json`.
3. Vérifier qu'aucune ancienne date ne reste, publier, puis prévenir les pré-inscrits (liste Netlify « liste-attente-candidature »).
4. Mettre aussi à jour les documents PDF : dossier de sponsoring, règlement, chronogramme.
