/* ============================
   Team card component
   ----------------------------
   Renders the "Equipa" grid on equipa.html. Site.teamCardHTML is also
   reused by team-detail.js for the slideshow, so the card markup only
   exists in one place.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  Site.teamCardHTML = function (member) {
    return [
      '<a href="equipa-membro.html?slug=' + member.slug + '" class="team-card">',
      '  <div class="team-card-photo"><img src="' + member.photo + '" alt="' + member.name + '" ' + Site.IMG_FALLBACK_ATTR + ' /></div>',
      '  <div class="team-card-badge team-card-badge--' + member.color + '">',
      '    <span class="team-card-info"><strong>' + member.name + '</strong>' + member.role + '</span>',
      '    <span class="team-card-plus" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>',
      '  </div>',
      '</a>'
    ].join('');
  };

  Site.mountTeamGrid = function () {
    var grid = document.getElementById('team-grid');
    if (!grid || !window.TEAM_MEMBERS) return;
    grid.innerHTML = window.TEAM_MEMBERS.map(Site.teamCardHTML).join('');

    // Cards start hidden (see #team-grid .team-card in style.css) and pop
    // in one by one as each row actually scrolls into view — same
    // scroll-triggered stagger as the "Áreas de atuação" cards (see
    // js/scroll-reveal.js's mountStaggeredCardReveal). The team grid has
    // enough members to span several rows, taller than the viewport, so
    // a plain on-mount stagger (the previous approach) was revealing
    // every card immediately regardless of whether it was actually
    // visible yet. Container is .team-page (not #team-grid itself) so the
    // page's <h1> — a sibling of #team-grid, not a descendant — is
    // reachable as the heading to reveal alongside the first card; left
    // alone it just sat there fully visible while the cards were still
    // hidden below it.
    Site.mountStaggeredCardReveal('.team-page', '.team-card', 'h1');
  };
})();
