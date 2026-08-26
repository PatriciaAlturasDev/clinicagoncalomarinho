/* ============================
   Área de atuação detail page
   ----------------------------
   Each area page (ansiedade.html, phda.html, …) is a thin template — a
   single #area-detail placeholder carrying the area's slug. All hero
   copy and "Quando procurar ajuda" cards are looked up in window.AREAS
   (js/areas-data.js), the same list that builds the homepage grid, so
   there is exactly one place to edit either.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  Site.mountAreaDetail = function () {
    var root = document.getElementById('area-detail');
    if (!root || !window.AREAS) return;

    var slug = root.getAttribute('data-area-slug');
    var area = window.AREAS.find(function (a) { return a.slug === slug; });
    if (!area) return;

    document.title = area.pageTitle || (area.title + ' | Clínica Gonçalo Marinho');

    var titleHTML = area.title +
      (area.titleLight ? ' <span class="hero-title-light">(' + area.titleLight + ')</span>' : '');

    root.innerHTML = [
      '<section class="area-hero section-spacing">',
      '  <div class="area-container">',
      '    <div class="area-hero-grid">',
      '      <div class="area-hero-text">',
      '        <h1>' + titleHTML + '</h1>',
      area.description.join(''),
      '      </div>',
      '      <div class="area-hero-image">',
      '        <img src="' + area.detailImage + '" alt="Ilustração - ' + area.name.replace(/\n/g, ' ') + '" ' + Site.IMG_FALLBACK_ATTR + ' />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      '<section class=" area-symptoms">',
      '  <div class="area-container">',
      '    <h3>Quando procurar ajuda</h3>',
      '    <div class="area-manifest-grid">',
      area.manifest.map(Site.manifestCardHTML).join(''),
      '    </div>',
      '  </div>',
      '</section>'
    ].join('');
  };
})();
