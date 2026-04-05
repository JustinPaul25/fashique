(() => {
  'use strict';

  const header = document.getElementById('site-header');
  if (!header) return;

  const STICKY_MODE       = header.dataset.sticky;
  const COMPACT_THRESHOLD = 40; // px scrolled before compact mode triggers

  // ── CSS custom property: --header-height ──────────────────────────────
  // Stores the live header height for external consumers (e.g. scroll-margin-top).
  // We measure headerInner (NOT header) to exclude the border-bottom, which
  // prevents the "grows by 1px per transition" feedback loop.
  // The spacer is synced by CSS sibling selector (.site-header.is-compact ~ .site-header__spacer),
  // so no JS manipulation of the spacer is needed here.
  const headerInner = header.querySelector('.site-header__inner');

  const setHeaderHeight = () => {
    const h = headerInner ? headerInner.offsetHeight : header.offsetHeight;
    if (h > 0) {
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    }
  };

  // Defer first measurement to after initial paint so section CSS has applied.
  requestAnimationFrame(setHeaderHeight);
  window.addEventListener('resize', setHeaderHeight, { passive: true });

  // ── Sticky / scroll behaviour ──────────────────────────────────────────
  if (STICKY_MODE !== 'none') {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      header.classList.toggle('is-scrolled', y > 0);
      header.classList.toggle('is-compact', y > COMPACT_THRESHOLD);

      if (STICKY_MODE === 'on-scroll-up') {
        if (y > lastScrollY && y > COMPACT_THRESHOLD) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
      }

      // Guard against negative scroll on iOS rubber-band
      lastScrollY = Math.max(0, y);
      setHeaderHeight();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── Focus trap helper ──────────────────────────────────────────────────
  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const trapFocus = (container) => {
    const els = [...container.querySelectorAll(FOCUSABLE)];
    const first = els[0];
    const last  = els[els.length - 1];

    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  };

  // ── Mobile nav drawer ──────────────────────────────────────────────────
  const mobileDrawer  = document.getElementById('mobile-nav-drawer');
  const hamburger     = document.querySelector('[data-hamburger]');
  const drawerClose   = mobileDrawer?.querySelector('[data-drawer-close]');
  const drawerOverlay = mobileDrawer?.querySelector('[data-drawer-overlay]');

  let removeTrap = null;

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    removeTrap = trapFocus(mobileDrawer.querySelector('.mobile-nav-drawer__panel'));
    drawerClose?.focus();
  };

  const closeDrawer = (returnFocus = true) => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    removeTrap?.();
    removeTrap = null;
    if (returnFocus) hamburger?.focus();
  };

  hamburger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', () => closeDrawer(true));
  drawerOverlay?.addEventListener('click', () => closeDrawer(false));

  // Close when a nav link inside the drawer is tapped (page navigation)
  mobileDrawer?.querySelectorAll('.mobile-nav-drawer__link').forEach((link) => {
    link.addEventListener('click', () => closeDrawer(false));
  });

  // ── Search drawer ──────────────────────────────────────────────────────
  const searchTrigger = document.querySelector('[data-search-trigger]');
  const searchDrawer  = document.querySelector('[data-search-drawer]');
  const searchInput   = searchDrawer?.querySelector('[data-search-input]');
  const searchClose   = searchDrawer?.querySelector('[data-search-close]');

  const openSearch = () => {
    if (!searchDrawer) return;
    searchDrawer.setAttribute('aria-hidden', 'false');
    searchTrigger?.setAttribute('aria-expanded', 'true');
    // Delay focus so the CSS max-height transition begins first
    requestAnimationFrame(() => searchInput?.focus());
  };

  const closeSearch = (returnFocus = true) => {
    if (!searchDrawer) return;
    searchDrawer.setAttribute('aria-hidden', 'true');
    searchTrigger?.setAttribute('aria-expanded', 'false');
    if (returnFocus) searchTrigger?.focus();
  };

  searchTrigger?.addEventListener('click', () => {
    const isOpen = searchDrawer?.getAttribute('aria-hidden') === 'false';
    isOpen ? closeSearch() : openSearch();
  });

  searchClose?.addEventListener('click', () => closeSearch(true));

  // ── Mega menu ──────────────────────────────────────────────────────────
  // Panels live as direct children of .site-header and are positioned
  // absolutely below the header bar. JS wires hover/focus/keyboard.
  const megaTriggers = header.querySelectorAll('[data-mega-trigger]');
  const MEGA_HOVER_DELAY = 100; // ms before opening/closing on hover
  let megaOpenTimer  = null;
  let megaCloseTimer = null;
  let removeMegaTrap = null;

  const openMegaPanel = (trigger) => {
    const key   = trigger.dataset.megaTrigger;
    const panel = header.querySelector(`[data-mega-panel="${key}"]`);
    if (!panel) return;
    // Close every other open panel first
    header.querySelectorAll('.mega-menu:not([hidden])').forEach((p) => {
      if (p !== panel) closeMegaPanel(p);
    });
    removeMegaTrap?.();
    removeMegaTrap = null;
    panel.removeAttribute('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    removeMegaTrap = trapFocus(panel);
  };

  const closeMegaPanel = (panel) => {
    const key     = panel.dataset.megaPanel;
    const trigger = header.querySelector(`[data-mega-trigger="${key}"]`);
    removeMegaTrap?.();
    removeMegaTrap = null;
    panel.setAttribute('hidden', '');
    trigger?.setAttribute('aria-expanded', 'false');
  };

  const closeAllMega = () => {
    header.querySelectorAll('.mega-menu:not([hidden])').forEach(closeMegaPanel);
  };

  megaTriggers.forEach((trigger) => {
    const navItem = trigger.closest('.site-header__nav-item');
    const key     = trigger.dataset.megaTrigger;
    const panel   = header.querySelector(`[data-mega-panel="${key}"]`);

    // Hover: open after short delay; cancel close when re-entering
    navItem?.addEventListener('mouseenter', () => {
      clearTimeout(megaCloseTimer);
      megaOpenTimer = setTimeout(() => openMegaPanel(trigger), MEGA_HOVER_DELAY);
    });
    navItem?.addEventListener('mouseleave', () => {
      clearTimeout(megaOpenTimer);
      megaCloseTimer = setTimeout(closeAllMega, MEGA_HOVER_DELAY * 2);
    });

    // Keep panel open when pointer moves into it
    panel?.addEventListener('mouseenter', () => clearTimeout(megaCloseTimer));
    panel?.addEventListener('mouseleave', () => {
      megaCloseTimer = setTimeout(closeAllMega, MEGA_HOVER_DELAY * 2);
    });

    // Keyboard: Enter / Space toggles the panel
    trigger.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (panel?.hasAttribute('hidden')) {
        openMegaPanel(trigger);
        panel?.querySelector('a, button')?.focus();
      } else {
        closeAllMega();
        trigger.focus();
      }
    });
  });

  // Close all mega menus when clicking outside the header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeAllMega();
  });

  // ── Global keyboard handler ────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAllMega();
    if (mobileDrawer?.classList.contains('is-open'))                   closeDrawer(true);
    if (searchDrawer?.getAttribute('aria-hidden') === 'false')         closeSearch(true);
  });

  // ── Localization select: auto-submit on change ─────────────────────────
  document.querySelectorAll('[data-localization-select]').forEach((select) => {
    select.addEventListener('change', () => select.closest('form')?.submit());
  });
})();
