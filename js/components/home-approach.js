/* ============================
   Homepage "A nossa abordagem clínica" rows
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  // Builds the markup for one row of the "abordagem clínica" list.
  function homeApproachItemHTML(item) {
    return [
      '<div class="home-approach-item home-approach-item--' + item.color + '">',
      '  <span class="home-approach-icon" aria-hidden="true"><img src="' + item.icon + '" alt="" ' + Site.IMG_FALLBACK_ATTR + ' /></span>',
      '  <div class="home-approach-body">',
      '    <h3>' + item.title + '</h3>',
      '    <p>' + item.text + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  Site.mountHomeApproach = function () {
    var slot = document.getElementById('home-approach-slot');
    var items = Site.readJsonData('home-approach-data');
    if (!slot || !items) return;
    slot.outerHTML = items.map(homeApproachItemHTML).join('');
    // Per-card alternating slide-in as each row scrolls into view — see
    // js/components/scroll-reveal.js.
    Site.mountAlternatingCardReveal('.home-approach-item');
  };
})();
