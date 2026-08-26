/* ============================
   SPA navigation
   ----------------------------
   Intercepts same-origin .html link clicks, fetches the target page,
   and swaps in its <main> behind a full-screen overlay instead of a full
   reload. The overlay stays up until the new page's images are loaded, so
   the DOM swap and scroll reset never show as a visible jump.
   Falls back to a normal navigation if anything goes wrong (e.g. file://).
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var pageCache = new Map();
  // Bumped at the start of every navigate() call; a call only keeps writing
  // to the DOM/history/overlay as long as its own token is still the latest
  // one issued. This lets a newer navigation (e.g. the user hitting back
  // while a click-triggered one is still fetching) supersede an older one
  // in flight instead of the two racing to leave the page in a mismatched
  // state (URL pointing at one page, content showing another).
  var navToken = 0;
  var OVERLAY_FADE_MS = 220;
  var IMAGE_WAIT_MS = 600;
  var FETCH_TIMEOUT_MS = 8000;

  // Returns the transition overlay, creating (and appending to <body>) it
  // on first use.
  function getOverlay() {
    var overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      var spinner = document.createElement('div');
      spinner.className = 'page-transition-spinner';
      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  // Resolves once every <img> inside container has loaded (or errored), or
  // after timeoutMs — whichever comes first — so a slow/broken image can
  // never hang the page transition indefinitely.
  function waitForImages(container, timeoutMs) {
    var imgs = Array.prototype.slice.call(container.querySelectorAll('img'));
    if (!imgs.length) return Promise.resolve();

    var pending = imgs.filter(function (img) { return !img.complete; });
    if (!pending.length) return Promise.resolve();

    var allLoaded = Promise.all(pending.map(function (img) {
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));
    var timeout = new Promise(function (resolve) { setTimeout(resolve, timeoutMs); });

    return Promise.race([allLoaded, timeout]);
  }

  // Whether a clicked/hovered <a> should be handled by the SPA router
  // (same-origin .html page) rather than left to the browser as usual —
  // excludes new-tab links, downloads, mailto/tel, anchors, and anything
  // explicitly opted out via [data-no-spa].
  function isInternalLink(linkEl) {
    if (!linkEl || linkEl.tagName !== 'A') return false;
    if (linkEl.target && linkEl.target !== '_self') return false;
    if (linkEl.hasAttribute('download')) return false;
    if (linkEl.hasAttribute('data-no-spa')) return false;

    var rawHref = linkEl.getAttribute('href');
    if (!rawHref) return false;
    if (rawHref.startsWith('#')) return false;
    if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return false;

    var url;
    try {
      url = new URL(linkEl.href, window.location.href);
    } catch (e) {
      return false;
    }
    if (url.origin !== window.location.origin) return false;

    return /\.html$/i.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
  }

  // Fetches a page's raw HTML, caching the in-flight/settled promise per
  // URL so a prefetch and a later real navigation to the same page share
  // one network request instead of firing two.
  function fetchPage(url) {
    if (pageCache.has(url)) return pageCache.get(url);
    // Aborts the request if it stalls (e.g. a flaky connection that never
    // errors on its own), so a bad network can't leave the transition
    // overlay spinning forever — the catch below still runs and falls back
    // to a real navigation.
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS);
    var promise = fetch(url, { credentials: 'same-origin', signal: controller.signal })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .catch(function (err) {
        pageCache.delete(url);
        throw err;
      })
      .finally(function () { clearTimeout(timeoutId); });
    pageCache.set(url, promise);
    return promise;
  }

  // Warms the page cache on hover/touchstart, before the user actually
  // clicks — best-effort only, so any fetch failure here is swallowed.
  function prefetch(url) {
    if (pageCache.has(url)) return;
    try { fetchPage(url); } catch (e) { /* swallow */ }
  }

  async function navigate(href, opts) {
    opts = opts || {};

    var targetUrl;
    try {
      targetUrl = new URL(href, window.location.href);
    } catch (e) {
      window.location.href = href;
      return;
    }

    // Skip this same-URL short-circuit for popstate (skipPush) calls: by
    // the time 'popstate' fires the browser has already updated
    // window.location to the target, so this would always match and the
    // back/forward buttons would never actually swap the content.
    if (
      !opts.skipPush &&
      targetUrl.pathname === window.location.pathname &&
      targetUrl.search === window.location.search
    ) {
      if (targetUrl.hash) window.location.hash = targetUrl.hash;
      return;
    }

    var myToken = ++navToken;
    var overlay = getOverlay();

    try {
      // 1. Cover the page before touching the DOM, so nothing below is
      //    visible while we fetch, swap and mount the new page.
      overlay.classList.add('is-active');
      await new Promise(function (resolve) { setTimeout(resolve, OVERLAY_FADE_MS); });
      // A newer navigate() call (e.g. the user hit back/forward, or clicked
      // another link) started while we were waiting — bail out and let it
      // finish the job instead of both writing to the DOM/history.
      if (myToken !== navToken) return;

      var html = await fetchPage(targetUrl.href);
      if (myToken !== navToken) return;

      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      var newMain = doc.querySelector('main');
      if (!newMain) throw new Error('No <main> element in fetched page');

      var titleEl = doc.querySelector('title');
      var titleText = titleEl ? titleEl.textContent : document.title;
      var newBodyClass = doc.body ? doc.body.className : '';
      var page = Site.getPageFromUrl(targetUrl.href);

      // Close any open menus first so the header is in its calm state.
      Site.closeAllDropdowns();
      Site.closeMobileMenu();

      var currentMain = document.querySelector('main');
      if (currentMain) {
        currentMain.replaceWith(newMain);
      }
      document.title = titleText;
      document.body.className = newBodyClass;

      // Update the URL (and window.location) before mounting components —
      // mountTeamDetail() and friends read window.location.search to know
      // which content to render, so it must already point at the new page.
      if (!opts.skipPush) {
        history.pushState({ url: targetUrl.href }, '', targetUrl.href);
      }

      // Reset scroll so the new page starts at the top — happens behind
      // the overlay, so it's never seen as a jump.
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      Site.updateActiveNav(page);
      Site.mountAreaCta();
      Site.mountCardComponents();

      // 2. Let the new page's images finish loading (bounded by a
      //    timeout) so revealing it doesn't shift layout either.
      await waitForImages(newMain, IMAGE_WAIT_MS);
      if (myToken !== navToken) return;

      // 3. Reveal the new page.
      overlay.classList.remove('is-active');
    } catch (err) {
      // A newer navigation has already taken over — let it report its own
      // errors instead of hard-navigating to this stale href.
      if (myToken !== navToken) return;
      // Fallback to real navigation if anything fails (e.g. file://). Clear
      // the overlay first: this page is about to be unloaded, and if the
      // browser freezes it into the back/forward cache, it must not be
      // frozen mid-spinner — otherwise hitting Back later restores a
      // page stuck showing the loading overlay forever.
      overlay.classList.remove('is-active');
      window.location.href = href;
      return;
    }
  }

  // Delegated click handler: hijacks plain left-clicks on internal .html
  // links into an SPA navigate(), and otherwise gets out of the way
  // (modifier-clicks, middle-clicks, external links, etc. behave normally).
  function onClick(e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest && e.target.closest('a');
    if (!isInternalLink(link)) return;

    e.preventDefault();
    navigate(link.href);
  }

  // Delegated hover/touchstart handler: prefetches the target page of any
  // internal link the user is likely about to click.
  function onHover(e) {
    var link = e.target.closest && e.target.closest('a');
    if (!isInternalLink(link)) return;
    prefetch(link.href);
  }

  // Handles the browser's back/forward buttons — re-navigates to
  // window.location without pushing a new history entry.
  function onPopstate() {
    Site.closeAllDropdowns();
    Site.closeMobileMenu();
    navigate(window.location.href, { skipPush: true });
  }

  // Safety net for the back/forward cache: if this page is ever restored
  // from bfcache (event.persisted) while the transition overlay happens to
  // be active — e.g. it was frozen mid-navigation before an unrelated real
  // page unload — clear it and invalidate any stale in-flight navigation
  // so the page never comes back stuck on the loading spinner.
  function onPageshow(e) {
    if (!e.persisted) return;
    navToken++;
    var overlay = document.querySelector('.page-transition-overlay');
    if (overlay) overlay.classList.remove('is-active');
  }

  Site.setupSpa = function () {
    document.addEventListener('click', onClick);
    document.addEventListener('mouseover', onHover);
    document.addEventListener('touchstart', onHover, { passive: true });
    window.addEventListener('popstate', onPopstate);
    window.addEventListener('pageshow', onPageshow);
  };
})();
