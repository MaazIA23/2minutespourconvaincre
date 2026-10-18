// Les fonctions .mjs sont empaquetées en ESM. Ce module, importé en premier par chacune :
// - fournit require aux modules CommonJS embarqués (nos bibliothèques appellent require("crypto"), etc.) ;
// - charge @netlify/blobs et qrcode par de vrais import, pour que Netlify les embarque avec la fonction
//   (un require caché dans un module CommonJS n'est pas repéré et la fonction plantait :
//   « Cannot find module '@netlify/blobs' »). Nos bibliothèques les lisent ensuite sur globalThis.
import { createRequire } from "node:module";
import * as blobs from "@netlify/blobs";
import QRCode from "qrcode";

if (typeof globalThis.require === "undefined") globalThis.require = createRequire(import.meta.url);
globalThis.__2mpcBlobs ??= blobs;
globalThis.__2mpcQRCode ??= QRCode;
