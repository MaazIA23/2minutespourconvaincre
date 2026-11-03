// Fonction au format Netlify récent : il donne accès à la lecture « strong » de Netlify Blobs
// (une seule voix par jour et par votant, compteur exact). Le traitement lui-même est dans netlify/lib/fonctions/vote.js.
import "../lib/require-esm.mjs";
import { handler } from "../lib/fonctions/vote.js";
import { adapter } from "../lib/v2.js";

export default adapter(handler);
