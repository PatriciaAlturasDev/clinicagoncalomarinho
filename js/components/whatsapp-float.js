/* ============================
   Floating WhatsApp button
   ----------------------------
   Persists across SPA navigation (appended once to <body>, outside
   <main>), so it is mounted from app.js's init() only — not from
   mountCardComponents(), which reruns on every page swap.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var WHATSAPP_NUMBER = '351913310251';

  Site.mountWhatsappFloat = function () {
    if (document.querySelector('.whatsapp-float')) return;

    var link = document.createElement('a');
    link.href = 'https://wa.me/' + WHATSAPP_NUMBER;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'whatsapp-float';
    link.setAttribute('aria-label', 'Falar connosco no WhatsApp');
    link.setAttribute('data-no-spa', '');
    link.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';

    document.body.appendChild(link);
  };
})();
