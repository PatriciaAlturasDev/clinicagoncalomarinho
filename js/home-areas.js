/* ============================
   Homepage "Áreas de atuação" tiles
   ----------------------------
   Sourced from window.AREAS (js/areas-data.js) — the same list that
   builds every area's detail page.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  // Builds the markup for one homepage "área de atuação" tile.
  function homeAreaCardHTML(item) {
    var flip = item.flip ? ' flip' : '';
    var name = (item.name || '').split('\n').join('<br>');
    return [
      '<a href="' + item.href + '" class="home-area-card home-area-card--' + item.color + '">',
      '  <div class="home-area-card-illu' + flip + '"><img src="' + item.icon + '" alt="" ' + Site.IMG_FALLBACK_ATTR + ' /></div>',
      '  <div class="home-area-card-foot">',
      '    <span class="home-area-card-name">' + name + '</span>',
      '    <i class="fa-solid fa-arrow-right home-area-card-arrow" aria-hidden="true"></i>',
      '  </div>',
      '</a>'
    ].join('');
  }

  Site.mountHomeAreas = function () {
    var slot = document.getElementById('home-areas-slot');
    var items = window.AREAS || Site.readJsonData('home-areas-data');
    if (!slot || !items) return;
    // outerHTML so each card lands as its own grid item, not wrapped in the slot div.
    slot.outerHTML = items.map(homeAreaCardHTML).join('');
    // Cards pop in one by one as the section scrolls into view — see
    // js/scroll-reveal.js.
    Site.mountStaggeredCardReveal('.home-areas', '.home-area-card', '.home-areas-title');
  };
})();
