/* ============================
   Scroll-reveal
   ----------------------------
   The hidden state lives entirely in CSS (see the "Scroll-reveal" block
   in style.css) — every non-hero section is opacity:0 by default, before
   any script runs. This file's only job is to add .is-visible at the
   right moment:
     - while scrolling, via IntersectionObserver, once
     - immediately (after a short delay) for anything already on screen
       at mount time, since it would never otherwise cross the observer's
       boundary
   One-shot: each element is revealed once, then left alone. Re-run
   after every SPA navigation, same as the other mount* functions.

   The three dark full-bleed sections (home-areas / consultas-types /
   area-manifest-inverted) are excluded here — see mountStaggeredCardReveal
   below, which reveals their cards one by one instead of fading the
   whole block in as one piece.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var observer = null;
  var COLOR_BLOCK_CLASSES = ['home-areas', 'consultas-types', 'area-manifest-inverted'];

  function isColorBlock(section) {
    for (var i = 0; i < COLOR_BLOCK_CLASSES.length; i++) {
      if (section.classList.contains(COLOR_BLOCK_CLASSES[i])) return true;
    }
    return false;
  }

  Site.mountScrollReveal = function () {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // CSS's own reduced-motion block already shows everything

    var sections = Array.prototype.slice.call(document.querySelectorAll('main section'));
    var targets = sections.slice(1).filter(function (section) { return !isColorBlock(section); }); // skip the hero — always visible on load
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      // No observer support: just reveal everything rather than leave
      // it permanently hidden.
      targets.forEach(function (section) { section.classList.add('is-visible'); });
      return;
    }

    // threshold 0 (any overlap counts) so this never breaks for sections
    // taller than the viewport. A small positive bottom margin triggers
    // the reveal just before the section reaches the true edge, so the
    // animation runs while it's still scrolling into place instead of
    // firing late and mostly finishing off-screen.
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 60px 0px' });

    targets.forEach(function (section) {
      // A section already on screen at mount time (e.g. a short hero
      // pushes the next section straight into view) would otherwise get
      // its IntersectionObserver "entered" callback almost immediately,
      // which reads as "never had a transition" rather than as a scroll
      // reveal. Give those a deliberate, slightly-delayed entrance
      // instead of relying on the observer for them.
      var rect = section.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        window.setTimeout(function () {
          section.classList.add('is-visible');
        }, 300);
        return;
      }

      observer.observe(section);
    });
  };

  /* ============================
     Decor reveal
     ----------------------------
     Same fade-in treatment as mountScrollReveal above, applied to the
     background vector shapes (see the "Decor reveal" block in style.css)
     instead of whole sections — including ones already on screen at
     mount time, which would never otherwise cross an IntersectionObserver
     boundary. Also includes .booking-decor--yellow/--red-mid and
     .booking-dot--blue, the 3 shapes that only actually show once an
     accordion opens (.has-open-accordion in style.css) — adding
     .is-visible here is harmless for those (that selector still wins on
     specificity while no accordion is open) but keeps every decor piece
     on one consistent reveal path.
     ============================ */
  var decorObserver = null;

  Site.mountDecorReveal = function () {
    if (decorObserver) {
      decorObserver.disconnect();
      decorObserver = null;
    }

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // CSS's own reduced-motion block already shows everything

    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.home-intro-decor, .area-info-decor, .terms-decor, .booking-decor--blue, .booking-decor--red, .booking-dot--yellow, .booking-decor--yellow, .booking-decor--red-mid, .booking-dot--blue'
    ));
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    decorObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        decorObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 60px 0px' });

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        window.setTimeout(function () { el.classList.add('is-visible'); }, 300);
        return;
      }
      decorObserver.observe(el);
    });
  };

  /* ============================
     Alternating card reveal
     ----------------------------
     For small card groups (home-approach-item, consultas-modality-card)
     where the whole-section treatment above isn't granular enough — each
     card gets its own hidden state in CSS (odd cards offset left, even
     cards offset right; see style.css) and this adds .is-visible per card
     as it scrolls into view. Same one-shot IntersectionObserver pattern as
     mountScrollReveal/mountDecorReveal, but keyed by selector so multiple
     card groups can each run their own observer.

     threshold 0.2 + a negative bottom rootMargin (rather than the 0/+60px
     used above) is deliberate: those two produce a reveal that fires the
     instant a section's first pixel appears, which is fine for a whole
     section but too early to actually notice on a single card — this
     waits until a card is meaningfully inside the viewport instead.
     ============================ */
  var cardObservers = {};

  Site.mountAlternatingCardReveal = function (selector) {
    if (cardObservers[selector]) {
      cardObservers[selector].disconnect();
      delete cardObservers[selector];
    }

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var cards = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) { card.classList.add('is-visible'); });
      return;
    }

    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        cardObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -15% 0px' });
    cardObservers[selector] = cardObserver;

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        window.setTimeout(function () { card.classList.add('is-visible'); }, 300);
        return;
      }
      cardObserver.observe(card);
    });
  };

  /* ============================
     Staggered grid reveal
     ----------------------------
     For the three dark full-bleed sections (home-areas, consultas-types,
     area-manifest-inverted) — instead of fading the whole card grid in as
     one flat block, each card pops up on its own, one after another.
     Reads as a more deliberate, considered entrance than a single fade —
     and works far better for a multi-card grid than the alternating
     left/right slide used for the single-column lists (home-approach-item
     etc.), which would look chaotic across several columns.

     Each card is observed individually (not the container as a whole) —
     home-areas in particular spans several rows, taller than the
     viewport, so a container-level trigger would fire the instant its
     top edge appeared and reveal every card at once, including rows still
     well below the fold. Cards that cross into view together in the same
     observer callback (the common case — a whole row entering on one
     scroll step) still get staggered relative to each other, by their
     order within that batch, so it keeps the one-by-one cascade without
     ever revealing a card before it's actually in view.

     The optional headingSelector reveals the section's heading the first
     time any of its cards do, instead of leaving it always visible —
     otherwise the title just sits there fully shown while the cards are
     still hidden below it, which reads as broken rather than as a
     deliberate staggered entrance.
     ============================ */
  var STAGGER_STEP_MS = 180;
  var staggerObservers = {};

  Site.mountStaggeredCardReveal = function (containerSelector, cardSelector, headingSelector) {
    var key = containerSelector + ' ' + cardSelector;
    if (staggerObservers[key]) {
      staggerObservers[key].disconnect();
      delete staggerObservers[key];
    }

    var containers = Array.prototype.slice.call(document.querySelectorAll(containerSelector));
    if (!containers.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // CSS's own reduced-motion block already shows everything

    function revealHeadingOnce(container) {
      if (!headingSelector) return;
      var heading = container.querySelector(headingSelector);
      if (heading) heading.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window)) {
      containers.forEach(function (container) {
        revealHeadingOnce(container);
        Array.prototype.slice.call(container.querySelectorAll(cardSelector))
          .forEach(function (card) { card.classList.add('is-visible'); });
      });
      return;
    }

    var cardObserver = new IntersectionObserver(function (entries) {
      var entering = entries.filter(function (entry) { return entry.isIntersecting; });
      entering.forEach(function (entry, i) {
        var card = entry.target;
        var container = card.closest(containerSelector);
        if (container) revealHeadingOnce(container);
        window.setTimeout(function () { card.classList.add('is-visible'); }, i * STAGGER_STEP_MS);
        cardObserver.unobserve(card);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -15% 0px' });
    staggerObservers[key] = cardObserver;

    containers.forEach(function (container) {
      var cards = Array.prototype.slice.call(container.querySelectorAll(cardSelector));

      // Cards already on screen at mount time (e.g. the top row, right
      // under a short hero) would never cross the observer's boundary on
      // their own — reveal those together, staggered, right away instead.
      var alreadyVisible = [];
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          alreadyVisible.push(card);
        } else {
          cardObserver.observe(card);
        }
      });

      if (alreadyVisible.length) {
        revealHeadingOnce(container);
        alreadyVisible.forEach(function (card, i) {
          window.setTimeout(function () { card.classList.add('is-visible'); }, 300 + i * STAGGER_STEP_MS);
        });
      }
    });
  };
})();
