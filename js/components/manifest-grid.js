/* ============================
   "Quando procurar ajuda" manifest-card grid
   ----------------------------
   Used two ways:
   1. Standalone — a page provides its own #area-manifest-grid +
      #area-manifest-data JSON (e.g. neurodesenvolvimento.html).
   2. Reused — area-detail.js calls Site.manifestCardHTML directly for
      each item in an área de atuação's `manifest` list.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  Site.manifestCardHTML = function (item) {
    return [
      '<div class="area-manifest-card area-manifest-card--dark">',
      '  <span class="icon-circle icon-circle--' + item.color + '"><img src="' + item.icon + '" alt="" ' + Site.IMG_FALLBACK_ATTR + ' /></span>',
      '  <p>' + item.text + '</p>',
      '  <span class="underline underline--' + item.color + '"></span>',
      '</div>'
    ].join('');
  };

  Site.mountManifestGrid = function () {
    var grid = document.getElementById('area-manifest-grid');
    var items = Site.readJsonData('area-manifest-data');
    if (!grid || !items) return;
    grid.innerHTML = items.map(Site.manifestCardHTML).join('');
  };
})();
