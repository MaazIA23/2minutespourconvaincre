# 2 Minutes pour Convaincre

Site vitrine statique pour un coaching de pitch et de prise de parole, autour de la promesse
« vous avez 2 minutes pour convaincre ». Reconstruction indépendante (HTML/CSS/JS vanilla,
sans dépendance de build), à adapter avec le contenu et l'identité visuelle réels.

> Remarque : cette version n'est pas une copie du site `2minpourconvaincre.com` — l'accès
> réseau sortant n'était pas disponible pour l'analyser. C'est une reproduction plausible du
> concept (structure, sections type, ton), à ajuster une fois le contenu réel disponible.

## Structure

```
index.html       Page unique (hero, méthode, programmes, témoignages, FAQ, contact)
css/style.css     Styles (design system en variables CSS, responsive)
js/main.js        Menu mobile, accordéon FAQ, animations au scroll, formulaires
```

## Lancer en local

Aucune dépendance à installer. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000
