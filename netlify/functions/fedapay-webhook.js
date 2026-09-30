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

async function sendNotificationEmail(entity) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    console.error("RESEND_API_KEY ou NOTIFICATION_EMAIL manquante : email de notification non envoyé.");
    return;
  }
  const from = process.env.NOTIFICATION_FROM_EMAIL || "onboarding@resend.dev";

  const amount = entity && entity.amount;
  const currency = (entity && entity.currency && entity.currency.iso) || "XOF";
  const customer = (entity && entity.customer) || null;
  const donateur =
    customer && (customer.firstname || customer.lastname)
      ? `${customer.firstname || ""} ${customer.lastname || ""}`.trim()
      : "Anonyme";
  const customerEmail = (customer && customer.email) || null;

  const lines = [
    "Un don vient d'être confirmé sur 2minpourconvaincre.com.",
    "",
    `Montant : ${amount ? `${amount} ${currency}` : "inconnu"}`,
    `Donateur : ${donateur}`,
    customerEmail ? `Email : ${customerEmail}` : null,
    `Référence FedaPay : ${(entity && entity.id) || "inconnue"}`,
  ].filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: `Nouveau don reçu : ${amount ? `${amount} ${currency}` : "montant inconnu"}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("Échec envoi email de notification (Resend):", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("Erreur envoi email de notification:", err.message);
  }
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

  const eventName = fedapayEvent && fedapayEvent.name;
  const entity = fedapayEvent && fedapayEvent.entity;
  if (eventName === "transaction.approved" || (entity && entity.status === "approved")) {
    await sendNotificationEmail(entity);
  }

  return { statusCode: 200, body: "OK" };
};
