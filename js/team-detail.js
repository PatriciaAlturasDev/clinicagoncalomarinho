/* ============================
   Team member detail page + slideshow
   ----------------------------
   equipa-membro.html?slug=X renders one member's bio here, plus a
   continuous marquee of everyone else. The track holds the member list
   twice back-to-back and slides left forever via a CSS transform; once
   it has moved exactly one full list-width, the loop point is visually
   identical to the start, so it reads as an endless, smooth walk with
   no scrollbar or jump-cut.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var SLIDESHOW_VISIBLE = 3;
  var SLIDESHOW_SECONDS_PER_CARD = 9;
  var slideshowResizeHandler = null;
  var slideshowState = null; // { track, cardStep, distance, durationS, offset, manual }

  // Looks up a member by slug (from the ?slug= URL param) in window.TEAM_MEMBERS.
  function getTeamMember(slug) {
    if (!window.TEAM_MEMBERS) return null;
    return window.TEAM_MEMBERS.find(function (m) { return m.slug === slug; }) || null;
  }

  // Cancels the current slideshow's resize listener (called before mounting
  // a new one, and whenever the detail page navigates away).
  function stopTeamSlideshow() {
    if (slideshowResizeHandler) {
      window.removeEventListener('resize', slideshowResizeHandler);
      slideshowResizeHandler = null;
    }
    slideshowState = null;
  }

  // Measures the rendered card size and sets the CSS variable/duration the
  // marquee animation (see @keyframes team-marquee) needs to travel exactly
  // one full list-width, so the loop point lines up. Returns the numbers
  // the manual prev/next buttons need too (cardStep, distance, durationS).
  function layoutTeamSlideshow(track, count) {
    // Card size comes from CSS (.team-slideshow .team-card — same 360px
    // square as the team grid, stepping down responsively via media
    // queries), so just measure what actually rendered.
    var firstCard = track.querySelector('.team-card');
    if (!firstCard) return null;

    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    var cardStep = firstCard.getBoundingClientRect().width + gap;
    var distance = count * cardStep;
    var durationS = count * SLIDESHOW_SECONDS_PER_CARD;

    track.style.setProperty('--team-slide-distance', '-' + distance + 'px');
    track.style.animationDuration = durationS + 's';

    return { cardStep: cardStep, distance: distance, durationS: durationS };
  }

  // Freezes the track at its current auto-scroll position and switches it
  // to JS-driven manual mode (see .team-slideshow-track.is-manual in
  // style.css for the transition) — entered the moment the mouse hovers
  // the slideshow (see settleTeamSlideshow) or, as a fallback for
  // non-hover input, when a nav button is clicked directly.
  function enterManualMode(state) {
    if (state.manual) return;
    var matrix = getComputedStyle(state.track).transform;
    var tx = 0;
    if (matrix && matrix !== 'none') {
      var parts = matrix.match(/matrix\(([^)]+)\)/);
      if (parts) tx = parseFloat(parts[1].split(',')[4]) || 0;
    }
    state.offset = tx;
    state.manual = true;
    state.track.classList.remove('is-sliding');
    // Cancelling the @keyframes animation (via .is-manual, which sets
    // animation: none) and changing `transform` in the same tick leaves
    // the browser with no reliable "before" value to transition from —
    // it was landing on the frozen position with a snap instead of a
    // transition. Forcing a reflow between the two commits `tx` as the
    // painted starting point first, so whatever the caller sets next
    // (settleTeamSlideshow, stepTeamSlideshow) actually eases from here.
    state.track.classList.add('is-manual');
    state.track.style.transform = 'translateX(' + tx + 'px)';
    void state.track.offsetHeight;
  }

  // Jumps the track to a given offset with no transition — used only to
  // snap across the wrap point (see stepTeamSlideshow), where the two
  // duplicated card lists make position 0 and position -distance visually
  // identical, so the jump itself is invisible.
  function snapTeamSlideshow(state, offsetPx) {
    state.track.style.transitionDuration = '0s';
    state.track.style.transform = 'translateX(' + offsetPx + 'px)';
    void state.track.offsetHeight; // force reflow so the next transform change transitions again
    state.track.style.transitionDuration = '';
    state.offset = offsetPx;
  }

  // Rounds the current (mid-slide) offset to the nearest full card and
  // animates there — called on mouseenter, while the @keyframes animation
  // is still actually running. There's deliberately no CSS
  // animation-play-state: paused on :hover — that stops the marquee dead
  // the instant the mouse arrives, and this eased glide starting a beat
  // later on top of that read as a jarring stop-then-slide. Cancelling the
  // animation and easing to the nearest card in one continuous motion
  // (see enterManualMode) feels like one deliberate movement instead.
  // Settling on a full card (rather than freezing wherever the continuous
  // scroll happened to be) also avoids a card sliced clean in half at the
  // viewport edge, which — with no border to mark it as an edge — reads
  // as a wall rather than a paused carousel.
  function settleTeamSlideshow(viewport) {
    var state = slideshowState;
    if (!state || state.track !== viewport.querySelector('.team-slideshow-track')) return;
    enterManualMode(state);
    var nearest = Math.round(state.offset / state.cardStep) * state.cardStep;
    state.offset = nearest;
    state.track.style.transform = 'translateX(' + nearest + 'px)';
  }

  // Advances the manual slideshow by one card. dir is 1 for next (further
  // left) or -1 for prev (back toward the start). Wraps seamlessly in
  // either direction using the duplicated card list already in the DOM.
  function stepTeamSlideshow(viewport, dir) {
    var state = slideshowState;
    if (!state || state.track !== viewport.querySelector('.team-slideshow-track')) return;
    enterManualMode(state);

    if (dir > 0 && state.offset <= -state.distance) {
      snapTeamSlideshow(state, 0);
    } else if (dir < 0 && state.offset >= 0) {
      snapTeamSlideshow(state, -state.distance);
    }

    state.offset += dir * -state.cardStep;
    state.track.style.transform = 'translateX(' + state.offset + 'px)';
  }

  // Hands control back to the CSS @keyframes marquee, picking up from
  // wherever the manual offset left off (via a negative animation-delay)
  // instead of jumping back to the start.
  function resumeTeamSlideshow(viewport) {
    var state = slideshowState;
    if (!state || !state.manual) return;
    if (state.track !== viewport.querySelector('.team-slideshow-track')) return;

    var fraction = ((-state.offset) % state.distance) / state.distance;
    state.manual = false;
    state.track.classList.remove('is-manual');
    state.track.style.transitionDuration = '';
    state.track.style.transform = '';
    state.track.style.animationDelay = '-' + (fraction * state.durationS) + 's';
    state.track.classList.add('is-sliding');
  }

  // Kicks off the marquee for the "A nossa Equipa" section, given the
  // pool of other team members to show.
  function startTeamSlideshow(viewport, pool) {
    stopTeamSlideshow();
    if (pool.length <= SLIDESHOW_VISIBLE) return; // not enough to loop meaningfully

    var track = viewport.querySelector('.team-slideshow-track');
    if (!track) return;

    var layout = layoutTeamSlideshow(track, pool.length);
    if (!layout) return;
    track.classList.add('is-sliding');

    slideshowState = {
      track: track,
      cardStep: layout.cardStep,
      distance: layout.distance,
      durationS: layout.durationS,
      offset: 0,
      manual: false
    };

    slideshowResizeHandler = function () {
      var relayout = layoutTeamSlideshow(track, pool.length);
      if (relayout && slideshowState) {
        slideshowState.cardStep = relayout.cardStep;
        slideshowState.distance = relayout.distance;
        slideshowState.durationS = relayout.durationS;
      }
    };
    window.addEventListener('resize', slideshowResizeHandler);

    var prevBtn = viewport.querySelector('.team-slideshow-nav--prev');
    var nextBtn = viewport.querySelector('.team-slideshow-nav--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { stepTeamSlideshow(viewport, -1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepTeamSlideshow(viewport, 1); });
    viewport.addEventListener('mouseenter', function () { settleTeamSlideshow(viewport); });
    viewport.addEventListener('mouseleave', function () { resumeTeamSlideshow(viewport); });
  }

  Site.mountTeamDetail = function () {
    var root = document.getElementById('team-detail');
    if (!root || !window.TEAM_MEMBERS) return;

    stopTeamSlideshow();

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var member = getTeamMember(slug) || window.TEAM_MEMBERS[0];
    var others = window.TEAM_MEMBERS.filter(function (m) { return m.slug !== member.slug; });

    document.title = member.name + ' | Clínica Gonçalo Marinho';

    root.innerHTML = [
      '<section class="team-detail-hero section-spacing">',
      '  <div class="area-container">',
      '    <a href="equipa.html" class="team-detail-back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></a>',
      '    <div class="team-detail-grid">',
      '      <div class="team-detail-text">',
      '        <h1>' + member.name + '</h1>',
      '        <p class="team-detail-role">' + (member.om ? 'OM ' + member.om : member.role) + '</p>',
      member.bio.map(function (p) { return '<p>' + p + '</p>'; }).join(''),
      '      </div>',
      '      <div class="team-detail-photo">',
      '        <img src="' + member.detailPhoto + '" alt="' + member.name + '" ' + Site.IMG_FALLBACK_ATTR + ' />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      '<section class="team-more section-spacing">',
      '  <div class="area-container">',
      '    <h3>A nossa Equipa</h3>',
      '    <div class="team-slideshow" id="team-slideshow">',
      '      <div class="team-slideshow-viewport">',
      '        <div class="team-slideshow-track">',
      others.map(Site.teamCardHTML).join(''),
      // Duplicate set so the loop point (after translating one full list-width)
      // is visually identical to the start — display:contents keeps these as
      // direct flex children while aria-hiding the repeated content.
      '          <div aria-hidden="true" style="display:contents">' + others.map(Site.teamCardHTML).join('') + '</div>',
      '        </div>',
      '      </div>',
      // Only worth showing nav buttons when the marquee actually loops
      // (see the SLIDESHOW_VISIBLE check in startTeamSlideshow) — otherwise
      // there'd be nothing for them to do.
      others.length > SLIDESHOW_VISIBLE ? [
        '      <button type="button" class="team-slideshow-nav team-slideshow-nav--prev" aria-label="Anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>',
        '      <button type="button" class="team-slideshow-nav team-slideshow-nav--next" aria-label="Seguinte"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>'
      ].join('') : '',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('');

    var viewport = document.getElementById('team-slideshow');
    if (viewport && others.length) startTeamSlideshow(viewport, others);
  };
})();
