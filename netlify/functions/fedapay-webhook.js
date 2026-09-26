const crypto = require("crypto");

const TOLERANCE_SECONDS = 300;

function verifySignature(rawBody, header, secret) {
  if (!header) return false;

  const parts = header.split(",").reduce(
    (acc, item) => {
      const [key, value] = item.split("=");
      if (key === "t") acc.timestamp = parseInt(value, 10);
      if (key === "s") acc.signatures.push(value);
      return acc;
    },
    { timestamp: -1, signatures: [] }
  );

  if (parts.timestamp === -1 || !parts.signatures.length) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const matches = parts.signatures.some((sig) => {
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
  if (!matches) return false;

  const age = Math.floor(Date.now() / 1000) - parts.timestamp;
  return age <= TOLERANCE_SECONDS;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("FEDAPAY_WEBHOOK_SECRET manquante : webhook ignoré.");
    return { statusCode: 500, body: "Webhook non configuré" };
  }

  const signature = event.headers["x-fedapay-signature"] || event.headers["X-FEDAPAY-SIGNATURE"];
  const rawBody = event.body || "";

  if (!verifySignature(rawBody, signature, secret)) {
    console.error("Signature webhook FedaPay invalide ou expirée.");
    return { statusCode: 400, body: "Signature invalide" };
  }

  let fedapayEvent;
  try {
    fedapayEvent = JSON.parse(rawBody);
  } catch (err) {
    return { statusCode: 400, body: "Payload invalide" };
  }

  console.log("Événement FedaPay reçu:", JSON.stringify(fedapayEvent));

  return { statusCode: 200, body: "OK" };
};
