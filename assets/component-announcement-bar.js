/**
 * component-announcement-bar.js
 *
 * Responsibilities:
 *  1. Reads sessionStorage on load; hides the bar without re-rendering if
 *     already dismissed (the synchronous inline script in the section handles
 *     the pre-paint hide, this runs the deferred cleanup).
 *  2. Measures the bar's exact height and writes it to the
 *     --announcement-bar-height CSS custom property on :root so that the
 *     sticky header can offset itself correctly.
 *  3. Keeps the height in sync on window resize.
 *  4. Close button: animates the bar out, saves the dismissal to sessionStorage,
 *     and updates --announcement-bar-height to 0px.
 */

(function () {
  'use strict';

  const STORAGE_PREFIX = 'fq-ab-dismissed-';
  const ROOT           = document.documentElement;

  /** Write --announcement-bar-height to :root. */
  function setBarHeight(px) {
    ROOT.style.setProperty('--announcement-bar-height', px + 'px');
  }

  function initBar(bar) {
    const barId      = bar.dataset.announcementBar;
    const storageKey = STORAGE_PREFIX + barId;

    // Already dismissed in a previous visit — ensure it stays hidden and
    // CSS variable is cleared (the inline script handled the visual hide,
    // this just makes the JS state consistent).
    if (sessionStorage.getItem(storageKey)) {
      bar.setAttribute('hidden', '');
      setBarHeight(0);
      return;
    }

    // ── Height sync ──────────────────────────────────────────────────────
    const updateHeight = () => {
      const h = bar.hasAttribute('hidden') ? 0 : bar.offsetHeight;
      setBarHeight(h);
    };

    // Measure after layout is complete
    requestAnimationFrame(updateHeight);

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(bar);

    // ── Close button ─────────────────────────────────────────────────────
    const closeBtn = bar.querySelector('[data-announcement-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sessionStorage.setItem(storageKey, '1');

        // Animate the bar out; wait for the max-height transition to finish
        bar.classList.add('is-dismissed');

        const onEnd = () => {
          bar.setAttribute('hidden', '');
          setBarHeight(0);
          resizeObserver.disconnect();
        };

        // Use transitionend for accuracy; fall back after 400ms if it never fires
        let settled = false;
        bar.addEventListener(
          'transitionend',
          (e) => {
            if (e.propertyName === 'max-height') {
              settled = true;
              onEnd();
            }
          },
          { once: true }
        );
        setTimeout(() => {
          if (!settled) onEnd();
        }, 400);
      });
    }
  }

  // Initialize every bar on the page (there should only be one, but be safe)
  document.querySelectorAll('[data-announcement-bar]').forEach(initBar);
})();
