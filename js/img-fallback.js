/* ============================
   Broken-image fallback
   ----------------------------
   Several photos referenced across the site (team portraits, a couple of
   area illustrations) don't exist as real files yet. Rather than show the
   browser's broken-image icon, swap in the generic user silhouette once
   and mark the element so CSS can frame it nicely instead of stretching it.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var IMG_FALLBACK_SRC = 'assets/user.png';

  Site.IMG_FALLBACK_ATTR =
    'onerror="this.onerror=null;this.src=\'' + IMG_FALLBACK_SRC + '\';this.classList.add(\'img-fallback\')"';
})();
