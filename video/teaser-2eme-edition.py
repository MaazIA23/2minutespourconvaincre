#!/usr/bin/env python3
"""Teaser vertical (9:16, 30 s) « Retour sur la 2ème édition ».

Génère video/out/teaser-2eme-edition.mp4 à partir des photos de la galerie du site.
Dépendances : Pillow, ffmpeg (ou `pip install imageio-ffmpeg`), polices Anton + Poppins
(fichiers .ttf/.woff, chemin via la variable FONTS_DIR — cf. video/README.md).

    python3 video/teaser-2eme-edition.py
"""
import os
import shutil
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public/assets/img")
GAL = os.path.join(IMG, "galerie/2eme-edition")
OUT = os.path.join(ROOT, "video/out/teaser-2eme-edition.mp4")
FONTS = os.environ.get("FONTS_DIR", os.path.join(ROOT, "video/fonts"))

W, H, FPS = 1080, 1920, 30
INK = (35, 31, 32)
GOLD = (246, 204, 12)
WHITE = (255, 255, 255)
XFADE = 0.5  # durée des fondus enchaînés (s)

# Chaque plan : photo, légende, sous-titre, mouvement.
#   ("pan", x_debut, x_fin)       -> panoramique horizontal (0 = gauche, 1 = droite)
#   ("zoom", cx, cy, z_debut, z_fin) -> zoom lent centré sur (cx, cy) en fraction de l'image
PLANS = [
    ("photo-12.jpg", "UNE SCÈNE", "08 août 2026 · Azalaï Hôtel", ("pan", 0.30, 0.55)),
    ("photo-10.jpg", "DES VOIX", None, ("zoom", 0.5, 0.40, 1.00, 1.12)),
    ("conference-presse-07.jpg", "2 MINUTES", "pour convaincre", ("zoom", 0.5, 0.35, 1.12, 1.00)),
    ("photo-05.jpg", "UN PUBLIC", "+200 participants", ("pan", 0.15, 0.75)),
    ("lancement-livre-03.jpg", "UN LIVRE", None, ("zoom", 0.5, 0.45, 1.00, 1.12)),
    ("afterwork-01.jpg", "UNE COMMUNAUTÉ", "24 partenaires mobilisés", ("pan", 0.55, 0.30)),
    ("photo-14.jpg", "DES LAURÉATS", "8 finalistes sur scène", ("pan", 0.0, 1.0)),
]
D_INTRO, D_PLAN, D_OUTRO = 3.2, 3.4, 6.6


def font(name, size):
    for ext in (".ttf", ".woff"):
        p = os.path.join(FONTS, name + ext)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    sys.exit(f"Police introuvable : {name} dans {FONTS}")


F_BIG = lambda s: font("anton", s)
F_SUB = lambda s: font("poppins700", s)
F_TXT = lambda s: font("poppins500", s)


def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def ffmpeg_bin():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg introuvable (installer ffmpeg ou `pip install imageio-ffmpeg`).")


# ---------- éléments graphiques ----------

def load_logo(width):
    lg = Image.open(os.path.join(IMG, "logo.png")).convert("RGBA")
    return lg.resize((width, round(lg.height * width / lg.width)), Image.LANCZOS)


def text_layer(lines):
    """lines : liste de (texte, police, couleur, y_centre). Renvoie un calque RGBA plein cadre."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for txt, f, col, y in lines:
        d.text((W / 2, y), txt, font=f, fill=col, anchor="mm")
    return layer


def bottom_gradient():
    g = Image.new("L", (1, H), 0)
    for y in range(H):
        t = max(0.0, (y - H * 0.50) / (H * 0.50))
        g.putpixel((0, y), int(235 * t ** 1.4))
    mask = g.resize((W, H))
    layer = Image.new("RGBA", (W, H), INK + (0,))
    layer.putalpha(mask)
    return layer


def caption_layer(title, sub):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    y = 1540 if sub else 1600
    f = F_BIG(170 if len(title) < 12 else 128)
    d.text((W / 2, y), title, font=f, fill=WHITE, anchor="mm")
    bw = 120
    d.rounded_rectangle((W / 2 - bw / 2, y + 100, W / 2 + bw / 2, y + 112), 6, fill=GOLD)
    if sub:
        d.text((W / 2, y + 180), sub, font=F_SUB(50), fill=GOLD, anchor="mm")
    return layer


def cover_source(path, zoom_max=1.15):
    """Charge la photo à une résolution juste suffisante pour le recadrage 9:16."""
    im = Image.open(path).convert("RGB")
    scale = max(W / im.width, H / im.height) * zoom_max * 1.1
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    return im


def frame_from(im, move, t):
    """Recadre la photo en 9:16 selon le mouvement, à l'instant t ∈ [0, 1]."""
    iw, ih = im.size
    ratio = W / H
    if iw / ih > ratio:
        ch, cw = ih, ih * ratio
    else:
        cw, ch = iw, iw / ratio
    k = ease(t) * 0.6 + t * 0.4  # mouvement légèrement adouci
    if move[0] == "pan":
        _, a, b = move
        x0 = (iw - cw) * (a + (b - a) * k)
        y0 = (ih - ch) / 2
        box = (x0, y0, x0 + cw, y0 + ch)
    else:
        _, cx, cy, z0, z1 = move
        z = z0 + (z1 - z0) * k
        w, h = cw / z, ch / z
        x0 = min(max(cx * iw - w / 2, 0), iw - w)
        y0 = min(max(cy * ih - h / 2, 0), ih - h)
        box = (x0, y0, x0 + w, y0 + h)
    return im.resize((W, H), Image.BICUBIC, box=box)


# ---------- séquences ----------

class Intro:
    def __init__(self, dur):
        self.dur = dur
        bg = cover_source(os.path.join(GAL, "photo-12.jpg"))
        bg = frame_from(bg, ("zoom", 0.5, 0.5, 1.0, 1.0), 0).filter(ImageFilter.GaussianBlur(28))
        self.bg = Image.blend(bg, Image.new("RGB", (W, H), INK), 0.72).convert("RGBA")
        self.logo = load_logo(880)
        self.txt = text_layer([
            ("2ÈME ÉDITION", F_BIG(120), GOLD, 1150),
            ("Retour en images", F_TXT(52), WHITE, 1265),
        ])

    def render(self, t):
        s = t * self.dur
        fr = self.bg.copy()
        a = 0.45 + 0.55 * ease(s / 0.8)  # logo visible dès la 1re image (miniature)
        z = 0.92 + 0.08 * ease(s / 1.2)
        lg = self.logo.resize((round(self.logo.width * z), round(self.logo.height * z)), Image.BICUBIC)
        lg.putalpha(lg.getchannel("A").point(lambda v: int(v * a)))
        fr.alpha_composite(lg, (round((W - lg.width) / 2), round(760 - lg.height / 2)))
        ta = ease((s - 0.4) / 0.6)
        if ta > 0:
            fr.alpha_composite(shift_fade(self.txt, ta, 40))
        return fr.convert("RGB")


class Plan:
    grad = None

    def __init__(self, dur, fname, title, sub, move):
        self.dur, self.move = dur, move
        self.im = cover_source(os.path.join(GAL, fname))
        Plan.grad = Plan.grad or bottom_gradient()
        self.cap = caption_layer(title, sub)
        self.logo = load_logo(300)
        self.logo.putalpha(self.logo.getchannel("A").point(lambda v: int(v * 0.9)))

    def render(self, t):
        s = t * self.dur
        fr = frame_from(self.im, self.move, t).convert("RGBA")
        fr.alpha_composite(Plan.grad)
        fr.alpha_composite(self.logo, ((W - self.logo.width) // 2, 90))
        ca = ease((s - 0.35) / 0.5)
        if ca > 0:
            fr.alpha_composite(shift_fade(self.cap, ca, 60))
        return fr.convert("RGB")


class Outro:
    def __init__(self, dur):
        self.dur = dur
        bg = cover_source(os.path.join(GAL, "photo-14.jpg"))
        bg = frame_from(bg, ("zoom", 0.5, 0.5, 1.0, 1.0), 0).filter(ImageFilter.GaussianBlur(28))
        self.bg = Image.blend(bg, Image.new("RGB", (W, H), INK), 0.78).convert("RGBA")
        self.logo = load_logo(700)
        self.l1 = text_layer([("RENDEZ-VOUS POUR LA", F_SUB(48), WHITE, 700)])
        self.l2 = text_layer([("3ÈME ÉDITION", F_BIG(150), GOLD, 830)])
        self.l3 = text_layer([("MARS 2027 · COTONOU", F_SUB(56), WHITE, 965)])
        self.l4 = text_layer([
            ("@2minpourconvaincre", F_SUB(50), GOLD, 1640),
            ("2minpourconvaincre.com", F_TXT(40), WHITE, 1715),
        ])

    def render(self, t):
        s = t * self.dur
        fr = self.bg.copy()
        for i, layer in enumerate((self.l1, self.l2, self.l3)):
            a = ease((s - 0.3 - i * 0.35) / 0.55)
            if a > 0:
                fr.alpha_composite(shift_fade(layer, a, 50))
        a = ease((s - 1.6) / 0.7)
        if a > 0:
            lg = self.logo.copy()
            lg.putalpha(lg.getchannel("A").point(lambda v: int(v * a)))
            fr.alpha_composite(lg, ((W - lg.width) // 2, 1290 - lg.height // 2))
            fr.alpha_composite(shift_fade(self.l4, a, 30))
        out = fr.convert("RGB")
        fade = ease((s - (self.dur - 0.8)) / 0.8)  # fondu au noir final
        return Image.blend(out, Image.new("RGB", (W, H), (0, 0, 0)), fade) if fade > 0 else out


def shift_fade(layer, a, dy):
    """Calque qui monte de dy px en apparaissant (a ∈ [0, 1])."""
    off = round(dy * (1 - a))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(layer, (0, off))
    if a < 1:
        out.putalpha(out.getchannel("A").point(lambda v: int(v * a)))
    return out


def main():
    segs = [Intro(D_INTRO)] + [Plan(D_PLAN, *p) for p in PLANS] + [Outro(D_OUTRO)]
    starts, t = [], 0.0
    for sg in segs:
        starts.append(t)
        t += sg.dur - XFADE
    total = t + XFADE
    n = round(total * FPS)
    print(f"Durée : {total:.1f} s, {n} images")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    cmd = [ffmpeg_bin(), "-v", "error", "-y",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
           "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", OUT]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        ts = i / FPS
        frame = None
        for sg, st in zip(segs, starts):
            if st <= ts < st + sg.dur:
                img = sg.render((ts - st) / sg.dur)
                if frame is None:
                    frame = img
                else:  # fondu enchaîné avec le plan précédent
                    frame = Image.blend(frame, img, ease((ts - st) / XFADE))
        proc.stdin.write(frame.tobytes())
        if i % 150 == 0:
            print(f"  {i}/{n}")
    proc.stdin.close()
    proc.wait()
    print("OK :", OUT)


if __name__ == "__main__":
    main()
