/* ============================
   Header component
   ----------------------------
   Renders the nav bar into #site-header, keeps the active nav item in sync
   with the current page, and owns the two header-only interactions:
   the "Áreas de Atuação"-style dropdown and the mobile hamburger menu.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  // "Áreas de Atuação" dropdown intentionally left out of NAV_ITEMS for
  // now (not in use in the header yet) — the dropdown-rendering code
  // below still supports it; add an item with type: 'dropdown' back in
  // when it's ready. See js/data/areas-data.js for the source list.
  var NAV_ITEMS = [
    { type: 'link', href: 'index.html', label: 'INÍCIO', match: ['index.html'] },
    { type: 'link', href: 'consultas.html', label: 'CONSULTAS', match: ['consultas.html'] },
    { type: 'link', href: 'equipa.html', label: 'EQUIPA', match: ['equipa.html', 'equipa-membro.html'] },
    { type: 'link', href: 'contactos.html', label: 'CONTACTOS', match: ['contactos.html'] }
  ];

  // Same calendar icon (assets/icons/calendar.png) as the "Marcar Consulta" CTA
  // button used throughout the site (see js/components/area-cta.js), rather than its
  // own separate inline SVG glyph.
  var CALENDAR_ICON = '<img src="assets/icons/calendar.png" alt="" />';
  var CHEVRON_ICON = '<svg class="chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 5 6 8 9 5"></polyline></svg>';
  var HAMBURGER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  // True when the current page is one of this dropdown's own links, so the
  // trigger itself can be marked "active" even though it's not a direct link.
  function isDropdownActive(item, page) {
    return item.type === 'dropdown' &&
      item.children.some(function (c) { return c.href === page; });
  }

  // Builds the full <header> markup as a string, given which page is active.
  function renderHeader(activePage) {
    var items = NAV_ITEMS.map(function (item) {
      if (item.type === 'dropdown') {
        var isActive = isDropdownActive(item, activePage);
        var triggerCls = 'nav-item nav-trigger' + (isActive ? ' active' : '');
        var subItems = item.children.map(function (c) {
          var subActive = (c.href === activePage) ? ' is-current' : '';
          return '<li><a href="' + c.href + '" class="dropdown-item' + subActive + '" role="menuitem">' + c.label + '</a></li>';
        }).join('');

        return [
          '<li class="nav-item-wrap has-dropdown">',
          '  <button type="button" class="' + triggerCls + '" aria-haspopup="true" aria-expanded="false">',
          '    <span>' + item.label + '</span>',
          '    ' + CHEVRON_ICON,
          '  </button>',
          '  <div class="dropdown" role="menu">',
          '    <ul class="dropdown-list">' + subItems + '</ul>',
          '  </div>',
          '</li>'
        ].join('\n');
      }

      var isActiveLink = item.match.indexOf(activePage) !== -1;
      var cls = 'nav-item' + (isActiveLink ? ' active' : '');
      return '<li class="nav-item-wrap"><a href="' + item.href + '" class="' + cls + '">' + item.label + '</a></li>';
    }).join('\n');

    return [
      '<header class="header">',
      '  <div class="header-container">',
      '    <a href="index.html" class="logo" aria-label="Clínica Gonçalo Marinho - Início">',
      '      <img src="assets/brand/logo.svg" alt="Clínica Gonçalo Marinho" />',
      '    </a>',
      '    <nav class="primary-nav" aria-label="Navegação principal">',
      '      <ul class="nav-list">',
      items,
      '      </ul>',
      '    </nav>',
      '    <div class="header-actions">',
      '      <a href="marcar-consulta.html" class="cta-button">',
      '        ' + CALENDAR_ICON,
      '        <span>MARCAR CONSULTA</span>',
      '      </a>',
      '      <button type="button" class="hamburger" aria-label="Abrir menu" aria-expanded="false">',
      '        <span class="hamburger-icon hamburger-open">' + HAMBURGER_ICON + '</span>',
      '        <span class="hamburger-icon hamburger-close">' + CLOSE_ICON + '</span>',
      '      </button>',
      '    </div>',
      '  </div>',
      '</header>'
    ].join('\n');
  }

  Site.updateActiveNav = function (page) {
    var header = document.getElementById('site-header');
    if (!header) return;

    header.querySelectorAll('.nav-item, .dropdown-item').forEach(function (el) {
      el.classList.remove('active');
      el.classList.remove('is-current');
    });

    NAV_ITEMS.forEach(function (item) {
      if (item.type === 'dropdown') {
        if (isDropdownActive(item, page)) {
          var trigger = header.querySelector('.has-dropdown .nav-trigger');
          if (trigger) trigger.classList.add('active');
          var child = header.querySelector('.dropdown-item[href="' + page + '"]');
          if (child) child.classList.add('is-current');
        }
      } else if (item.match.indexOf(page) !== -1) {
        var node = header.querySelector('.nav-item[href="' + item.href + '"]');
        if (node) node.classList.add('active');
      }
    });
  };

  Site.mountHeader = function () {
    var host = document.getElementById('site-header');
    if (host && !host.hasChildNodes()) {
      host.innerHTML = renderHeader(Site.getCurrentPage());
    }
  };

  /* ============================
     Dropdown behaviour
     ============================ */
  Site.closeAllDropdowns = function () {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (drop) {
      drop.classList.remove('is-open');
      var trigger = drop.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  // Opens the given dropdown, closing any other open one first (only one
  // dropdown panel is ever open at a time).
  function toggleDropdown(drop) {
    var trigger = drop.querySelector('.nav-trigger');
    var wasOpen = drop.classList.contains('is-open');
    Site.closeAllDropdowns();
    if (!wasOpen) {
      drop.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
  }

  Site.setupDropdowns = function () {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('.nav-trigger');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        var drop = trigger.closest('.has-dropdown');
        if (drop) toggleDropdown(drop);
        return;
      }
      if (!e.target.closest || !e.target.closest('.has-dropdown')) {
        Site.closeAllDropdowns();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        Site.closeAllDropdowns();
        Site.closeMobileMenu();
      }
    });
  };

  /* ============================
     Mobile menu
     ============================ */
  Site.closeMobileMenu = function () {
    var header = document.querySelector('.header');
    if (header && header.classList.contains('is-menu-open')) {
      header.classList.remove('is-menu-open');
      var btn = header.querySelector('.hamburger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('is-menu-locked');
    }
  };

  // Mirror of Site.closeMobileMenu() — opens the hamburger menu and
  // locks page scroll while it's open.
  function openMobileMenu() {
    var header = document.querySelector('.header');
    if (header && !header.classList.contains('is-menu-open')) {
      header.classList.add('is-menu-open');
      var btn = header.querySelector('.hamburger');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('is-menu-locked');
    }
  }

  Site.setupMobileMenu = function () {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.hamburger');
      if (!btn) return;
      e.preventDefault();
      var header = btn.closest('.header');
      if (!header) return;
      if (header.classList.contains('is-menu-open')) {
        Site.closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  };
})();
