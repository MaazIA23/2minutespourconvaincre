// Les fonctions .mjs sont empaquetées en ESM : les modules CommonJS qu'elles embarquent (nos bibliothèques, qrcode…)
// appellent require("crypto"), require("fs"), etc., qui n'existe pas en ESM. On le fournit ici, avant tout le reste.
import { createRequire } from "node:module";

if (typeof globalThis.require === "undefined") globalThis.require = createRequire(import.meta.url);
