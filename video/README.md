# Vidéos

Scripts de montage générant des vidéos à partir des photos du site (`public/assets/img/`).

| Script | Résultat |
| --- | --- |
| `teaser-2eme-edition.py` | Reel vertical 9:16, 1080×1920, 30 s — « Retour sur la 2ème édition » |

```bash
pip install pillow imageio-ffmpeg   # ou ffmpeg installé sur la machine
python3 video/teaser-2eme-edition.py
# -> video/out/teaser-2eme-edition.mp4 (non versionné)
```

- Photos, légendes et mouvements de caméra : liste `PLANS` en haut du script.
- Polices du site (Anton, Poppins — licence OFL) dans `video/fonts/`.
- La piste audio est muette : ajouter la musique directement dans Instagram/TikTok
  (bibliothèque sous licence) ou fournir un fichier libre de droits.
