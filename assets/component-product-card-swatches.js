/**
 * Product card color swatches: swap primary/hover images and product links by variant (Phase 7.3).
 * Event delegation — safe when grids refresh via infinite scroll or AJAX filters.
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.product-card__swatches [data-swatch-interactive]');
      if (!btn) return;
      var card = btn.closest('.product-card');
      if (!card) return;

      e.preventDefault();

      var wrap = btn.closest('.product-card__swatches');
      if (wrap) {
        wrap.querySelectorAll('[data-swatch-interactive].is-active').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
      }
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      var primary = btn.getAttribute('data-media-primary');
      var hover = btn.getAttribute('data-media-hover');
      var imgs = card.querySelectorAll('.product-card__media-link .product-card__img');
      if (imgs[0] && primary) {
        imgs[0].src = primary;
        imgs[0].removeAttribute('srcset');
        imgs[0].removeAttribute('sizes');
      }
      if (imgs[1]) {
        if (hover) {
          imgs[1].src = hover;
          imgs[1].removeAttribute('srcset');
          imgs[1].removeAttribute('sizes');
        } else if (primary) {
          imgs[1].src = primary;
          imgs[1].removeAttribute('srcset');
          imgs[1].removeAttribute('sizes');
        }
      }

      var vUrl = btn.getAttribute('data-variant-url');
      if (vUrl) {
        card.querySelectorAll('a.product-card__title-link, a.product-card__media-link').forEach(function (a) {
          a.href = vUrl;
        });
      }
    });
  });
})();
