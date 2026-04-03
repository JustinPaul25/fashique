/**
 * splide-init.js
 * Scoped Splide initialiser — version 4.1.4
 *
 * Usage (from any section or snippet):
 *
 *   <div class="splide" data-splide-config='{"type":"loop","perPage":3}'>
 *     <div class="splide__track">
 *       <ul class="splide__list">
 *         <li class="splide__slide">...</li>
 *       </ul>
 *     </div>
 *   </div>
 *
 *   Per-instance options are read from the data-splide-config attribute (JSON).
 *   Fallback defaults are applied when the attribute is absent.
 *
 * Accessibility & motion:
 *   - Splide's built-in accessibility option is always enabled.
 *   - Autoplay and transitions are suppressed when the user has requested
 *     reduced motion via the OS/browser preference.
 */

(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Default options applied to every slider unless overridden. */
  const DEFAULTS = {
    accessibility: true,
    rewind: true,
    gap: '1rem',
    autoplay: !REDUCED_MOTION,
    pauseOnHover: true,
    pauseOnFocus: true,
    reducedMotion: {
      speed: 0,
      rewindSpeed: 0,
      autoplay: false,
    },
  };

  /**
   * Initialise a single Splide element.
   * Options in data-splide-config are deep-merged over DEFAULTS.
   *
   * @param {HTMLElement} el
   */
  function initSlider(el) {
    let instanceOptions = {};

    const raw = el.dataset.splideConfig;
    if (raw) {
      try {
        instanceOptions = JSON.parse(raw);
      } catch (e) {
        console.warn('[splide-init] Invalid JSON in data-splide-config:', el, e);
      }
    }

    const options = Object.assign({}, DEFAULTS, instanceOptions);

    // RTL: mirror direction when the page is rendered right-to-left.
    if (document.documentElement.dir === 'rtl') {
      options.direction = 'rtl';
    }

    // Suppress animation when reduced motion is requested, regardless of
    // what the per-instance config says.
    if (REDUCED_MOTION) {
      options.autoplay = false;
      options.speed = 0;
      options.rewindSpeed = 0;
    }

    try {
      const splide = new Splide(el, options);
      splide.mount();

      // Expose the instance on the element for external access (e.g. sync).
      el._splide = splide;
    } catch (e) {
      console.error('[splide-init] Failed to mount Splide on element:', el, e);
    }
  }

  /**
   * Find and initialise all .splide elements inside a given root.
   * Skips elements that have already been initialised (is-initialized class).
   *
   * @param {Element|Document} root  — defaults to document
   */
  function initAll(root) {
    const scope = root || document;
    const sliders = scope.querySelectorAll('.splide:not(.is-initialized)');
    if (!sliders.length) return;
    sliders.forEach(initSlider);
  }

  /**
   * Public API — attach to window so sections can call
   * window.FashiqueSplide.init() after injecting new markup.
   */
  window.FashiqueSplide = {
    init: initAll,
    initOne: initSlider,
  };

  // Auto-init on DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }
})();
