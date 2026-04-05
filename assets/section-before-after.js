/**
 * Before/after comparison sliders: pointer + keyboard (Phase 8 / Feature #4).
 * Inits every [data-ba-slider] (including inside Splide slides).
 */
(function () {
  'use strict';

  function initBaSlider(slider) {
    if (!slider || slider.getAttribute('data-ba-initialized') === '1') return;
    slider.setAttribute('data-ba-initialized', '1');

    var beforeWrap = slider.querySelector('[data-ba-before]');
    var divider = slider.querySelector('[data-ba-divider]');
    if (!beforeWrap || !divider) return;

    var isVertical = slider.getAttribute('data-ba-orientation') === 'vertical';
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var isDragging = false;
    var position = 50;

    function applyPosition(pct) {
      position = Math.max(0, Math.min(100, pct));
      divider.setAttribute('aria-valuenow', String(Math.round(position)));
      beforeWrap.style.width = '';
      beforeWrap.style.height = '';
      if (isVertical) {
        beforeWrap.style.clipPath = 'inset(0 0 calc(100% - ' + position + '%) 0)';
        divider.style.top = position + '%';
        divider.style.left = '';
      } else {
        beforeWrap.style.clipPath = 'inset(0 calc(100% - ' + position + '%) 0 0)';
        divider.style.left = position + '%';
        divider.style.top = '';
      }
    }

    function getPointerPosition(e) {
      var rect = slider.getBoundingClientRect();
      if (isVertical) {
        return ((e.clientY - rect.top) / rect.height) * 100;
      }
      var pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (isRtl) return 100 - pct;
      return pct;
    }

    divider.addEventListener('pointerdown', function (e) {
      isDragging = true;
      divider.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    slider.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      applyPosition(getPointerPosition(e));
    });

    slider.addEventListener('pointerup', function () {
      isDragging = false;
    });
    slider.addEventListener('pointercancel', function () {
      isDragging = false;
    });

    divider.addEventListener('keydown', function (e) {
      var step = 5;
      if (isVertical) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          applyPosition(position - step);
          e.preventDefault();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          applyPosition(position + step);
          e.preventDefault();
        }
      } else if (isRtl) {
        if (e.key === 'ArrowRight') {
          applyPosition(position - step);
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          applyPosition(position + step);
          e.preventDefault();
        }
      } else {
        if (e.key === 'ArrowLeft') {
          applyPosition(position - step);
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          applyPosition(position + step);
          e.preventDefault();
        }
      }
      if (e.key === 'Home') {
        applyPosition(0);
        e.preventDefault();
      }
      if (e.key === 'End') {
        applyPosition(100);
        e.preventDefault();
      }
    });

    applyPosition(50);
  }

  function initAll(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-ba-slider]').forEach(initBaSlider);
  }

  window.FashiqueBeforeAfter = { init: initAll };

  function onReady() {
    initAll(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
