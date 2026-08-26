/* ============================
   Shared URL helpers — which page (filename) the browser is on right now.
   Used by header.js (active nav state) and spa-router.js (SPA navigation).
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  Site.getPageFromUrl = function (url) {
    var u = new URL(url, window.location.href);
    var last = u.pathname.split('/').pop().toLowerCase();
    return last || 'index.html';
  };

  Site.getCurrentPage = function () {
    return Site.getPageFromUrl(window.location.href);
  };
})();
