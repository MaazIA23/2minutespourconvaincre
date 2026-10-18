// Fonction au format Netlify récent : il donne accès à la lecture « strong » de Netlify Blobs
// (indispensable au contrôle des billets). Le traitement lui-même est dans netlify/lib/fonctions/billetterie-infos.js.
import "../lib/require-esm.mjs";
import { handler } from "../lib/fonctions/billetterie-infos.js";
import { adapter } from "../lib/v2.js";

export default adapter(handler);
