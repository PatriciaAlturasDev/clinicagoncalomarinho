/* ============================
   App entry point
   ----------------------------
   Loads last (see the <script> order in every page's <head>). Every other
   file in js/ just attaches functions to window.Site; this file is the
   only one that actually calls them, on first load and after every SPA
   navigation.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  function injectFlaticonUIcons() {
    if (document.getElementById('fi-cdn')) return;
    var link = document.createElement('link');
    link.id = 'fi-cdn';
    link.rel = 'stylesheet';
    link.href = 'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css';
    document.head.appendChild(link);
  }

  function injectFontAwesome() {
    if (document.getElementById('fa-cdn')) return;
    var link = document.createElement('link');
    link.id = 'fa-cdn';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
  }

  // Re-run on every SPA page swap, not just on first load.
  Site.mountCardComponents = function () {
    Site.mountManifestGrid();
    Site.mountAreaDetail();
    Site.mountHomeAreas();
    Site.mountHomeApproach();
    Site.mountTeamGrid();
    Site.mountTeamDetail();
    Site.mountBookingForm();
    Site.mountScrollReveal();
    Site.mountDecorReveal();
    Site.mountAlternatingCardReveal('.consultas-modality-card');
    Site.mountStaggeredCardReveal('.consultas-types', '.consultas-type-card', 'h3');
    Site.mountStaggeredCardReveal('.area-manifest-inverted', '.area-manifest-card', 'h3');
  };

  function init() {
    injectFlaticonUIcons();
    injectFontAwesome();
    Site.mountHeader();
    Site.mountFooter();
    Site.mountAreaCta();
    Site.mountCardComponents();
    Site.mountWhatsappFloat();
    Site.setupSpa();
    Site.setupDropdowns();
    Site.setupMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
