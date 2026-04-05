/**
 * Sticky ATC: IntersectionObserver on main product ATC, sync with variant events.
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    if (document.body.getAttribute('data-enable-sticky-atc') === 'false') return;

    var bar = document.querySelector('[data-sticky-atc]');
    if (!bar) return;

    var mainAtc = document.querySelector('.product-section [data-main-atc]');
    var variantInput = document.querySelector('.product-section [data-variant-id-input]');
    if (!mainAtc || !variantInput) return;

    var form =
      variantInput.form || document.querySelector('.product-section .product-section__form');
    var submitBtn = bar.querySelector('[data-sticky-atc-submit]');
    if (submitBtn && form && form.id) {
      submitBtn.setAttribute('form', form.id);
    }

    bar.removeAttribute('hidden');

    function setVisible(show) {
      bar.classList.toggle('is-visible', show);
    }

    var io = new IntersectionObserver(
      function (entries) {
        var e = entries[0];
        if (!e) return;
        setVisible(!e.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    io.observe(mainAtc);

    var titleEl = bar.querySelector('[data-sticky-atc-title]');
    var variantEl = bar.querySelector('[data-sticky-atc-variant]');
    var priceHost = bar.querySelector('[data-sticky-atc-price]');

    var productTitle = document.querySelector('.product-section__title');
    if (titleEl && productTitle) {
      titleEl.textContent = productTitle.textContent.trim();
    }

    function syncFromMain() {
      if (variantEl && variantInput) {
        var skuEl = document.querySelector('[data-sku-value]');
        var opts = [];
        document.querySelectorAll('.product-section__option').forEach(function (fs) {
          var sel = fs.querySelector('select[data-option-select]');
          if (sel) {
            opts.push(sel.options[sel.selectedIndex].text);
            return;
          }
          var btn = fs.querySelector('.product-section__opt.is-selected');
          if (btn && btn.dataset.value) opts.push(btn.dataset.value);
        });
        variantEl.textContent = opts.length ? opts.join(' / ') : '';
        if (!variantEl.textContent && skuEl && skuEl.textContent) {
          variantEl.textContent = skuEl.textContent.trim();
        }
      }
      if (priceHost) {
        var mainPrice = document.querySelector('.product-section [data-price-wrapper] .price');
        if (mainPrice) {
          priceHost.innerHTML = mainPrice.outerHTML;
        }
      }
      if (submitBtn) {
        submitBtn.disabled = mainAtc.disabled;
        submitBtn.textContent = mainAtc.textContent.trim();
      }
    }

    document.addEventListener('product:variant-change', syncFromMain);
    syncFromMain();
  });
})();
