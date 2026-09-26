const MIN_AMOUNT = 2000;

function apiBase() {
  return (process.env.FEDAPAY_ENV || "live") === "sandbox"
    ? "https://sandbox-api.fedapay.com"
    : "https://api.fedapay.com";
}

async function fedapayRequest(path, method, secretKey, body) {
  const res = await fetch(`${apiBase()}/v1${path}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && data.message) || `Erreur FedaPay (HTTP ${res.status})`;
    throw new Error(message);
  }
  return data;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Requête invalide" }) };
  }

  const amount = Math.round(Number(payload.amount));
  const isAnonymous = !!payload.isAnonymous;
  const prenom = (payload.prenom || "").trim();
  const nom = (payload.nom || "").trim();
  const email = (payload.email || "").trim();

  if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
    return { statusCode: 400, body: JSON.stringify({ error: `Le montant minimum est de ${MIN_AMOUNT} FCFA.` }) };
  }
  if (!isAnonymous && (!prenom || !nom || !email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Nom, prénom et e-mail sont requis pour un don non anonyme." }),
    };
  }

  const secretKey = process.env.FEDAPAY_SECRET_KEY;
  if (!secretKey) {
    console.error("FEDAPAY_SECRET_KEY manquante dans les variables d'environnement.");
    return { statusCode: 500, body: JSON.stringify({ error: "Configuration de paiement manquante." }) };
  }

  const siteUrl = process.env.URL || `https://${event.headers.host}`;
  const callbackUrl = isAnonymous
    ? `${siteUrl}/soutenir/merci/`
    : `${siteUrl}/soutenir/merci/?prenom=${encodeURIComponent(prenom)}`;

  const transactionBody = {
    description: "Don de soutien - Deux Minutes Pour Convaincre",
    amount: amount,
    currency: { iso: "XOF" },
    callback_url: callbackUrl,
  };
  if (!isAnonymous) {
    transactionBody.customer = { firstname: prenom, lastname: nom, email: email };
  }

  try {
    const createData = await fedapayRequest("/transactions", "POST", secretKey, transactionBody);
    const transactionId = createData["v1/transaction"] && createData["v1/transaction"].id;
    if (!transactionId) {
      throw new Error("Réponse FedaPay inattendue lors de la création de la transaction.");
    }

    const tokenData = await fedapayRequest(`/transactions/${transactionId}/token`, "POST", secretKey);
    if (!tokenData.url) {
      throw new Error("Réponse FedaPay inattendue lors de la génération du lien de paiement.");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tokenData.url }),
    };
  } catch (err) {
    console.error("Erreur FedaPay:", err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Impossible de créer la transaction. Merci de réessayer." }),
    };
  }
};
