/* ============================
   Shared DOM helper — read a page's inline JSON data block.
   Used by any component that pulls its content from a
   <script type="application/json"> tag next to its placeholder.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  Site.readJsonData = function (id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      console.error('Invalid JSON in #' + id, e);
      return null;
    }
  };
})();
