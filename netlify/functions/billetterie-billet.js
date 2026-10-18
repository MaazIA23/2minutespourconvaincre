// Données d'un billet pour son affichage (?n=…&c=…), ou son QR code en image (&format=qr), utilisé dans les e-mails.
const QRCode = require("qrcode");
const B = require("../lib/billetterie");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const numero = String(q.n || "");
  const cle = String(q.c || "");
  if (!/^2MPC-[A-Z]{1,3}-\d{4,}$/.test(numero) || !/^[0-9a-f]{24}$/.test(cle)) return B.reponse(404, { error: "Billet introuvable." });
  const billet = await B.magasin(event).get(`billets/${numero}`, { type: "json" });
  if (!billet || !B.egal(cle, billet.cle)) return B.reponse(404, { error: "Billet introuvable." });

  if (q.format === "qr") {
    const png = await QRCode.toBuffer(B.lienBillet(billet), { margin: 1, width: 360, color: { dark: "#040b52", light: "#ffffff" } });
    return { statusCode: 200, headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" }, body: png.toString("base64"), isBase64Encoded: true };
  }
  const cat = B.config.categories[billet.categorie];
  return B.reponse(200, {
    numero: billet.numero, prenom: billet.prenom, nom: billet.nom, categorie: cat.nom, sousTitre: cat.sousTitre,
    invitation: billet.type === "invitation", tarif: B.libelleTarif[billet.type === "invitation" ? "invitation" : billet.tarif],
    test: billet.test, annule: billet.annule, evenement: B.config.evenement, lien: B.lienBillet(billet),
  });
};
