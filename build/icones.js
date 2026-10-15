// Icônes au trait (charte v2) : remplacent les émojis 📅 et 📍, qui s'affichaient différemment selon les téléphones.
const trait = (d) => `<svg class="ico-meta" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const icoDate = trait('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>');
const icoLieu = trait('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>');
module.exports = { icoDate, icoLieu };
