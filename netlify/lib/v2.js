// Adapte un gestionnaire au format « Lambda » ({ httpMethod, body, headers, queryStringParameters } → { statusCode, headers, body })
// au format récent des fonctions Netlify (Request → Response), qui configure Netlify Blobs avec la lecture « strong ».
function adapter(handler) {
  return async function (req) {
    const url = new URL(req.url);
    const headers = {};
    req.headers.forEach((valeur, nom) => { headers[nom] = valeur; });
    const event = {
      httpMethod: req.method,
      body: req.method === "GET" || req.method === "HEAD" ? "" : await req.text(),
      headers,
      queryStringParameters: Object.fromEntries(url.searchParams),
    };
    try {
      const r = await handler(event);
      const corps = r.isBase64Encoded ? Buffer.from(r.body, "base64") : r.body;
      return new Response(corps, { status: r.statusCode, headers: r.headers || {} });
    } catch (err) {
      console.error(`Erreur dans ${url.pathname} :`, err && err.stack ? err.stack : err);
      return new Response(JSON.stringify({ error: "Erreur technique sur le serveur. Merci de réessayer dans quelques instants." }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  };
}

module.exports = { adapter };
