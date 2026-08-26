/* ============================
   Area CTA banner component
   ----------------------------
   Every area-detail page ends with the same yellow "Marcar Consulta"
   banner. Pages carry an empty #area-cta-slot placeholder; this swaps
   it for the real markup so the source HTML stays clean.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var AREA_CTA_HTML = [
    '<section class="area-cta section-spacing">',
    '  <div class="area-container">',
    '    <div class="area-cta-banner">',
    '      <div class="area-cta-content">',
    '        <p class="area-cta-lead">Se se identifica com estes sintomas</p>',
    '        <p class="area-cta-headline">pode ser útil procurar uma avaliação especializada.</p>',
    '      </div>',
    '      <a href="marcar-consulta.html" class="area-cta-button">',
    '        <img src="assets/icons/calendar.png" alt="" />',
    '        <span>Marcar Consulta</span>',
    '      </a>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  Site.mountAreaCta = function () {
    var slot = document.getElementById('area-cta-slot');
    if (!slot) return;
    slot.outerHTML = AREA_CTA_HTML;
  };
})();
