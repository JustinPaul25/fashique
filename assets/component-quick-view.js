/**
 * Quick view dialog: Section Rendering API (?view=quick-view&sections=main), focus trap, variant sync, Ajax add to cart.
 */
(function () {
  'use strict';

  function formatMoney(cents, currency, locale) {
    try {
      return new Intl.NumberFormat(locale || undefined, {
        style: 'currency',
        currency: currency || 'USD',
      }).format(cents / 100);
    } catch (e) {
      return (cents / 100).toFixed(2);
    }
  }

  function findVariant(variants, selectedOptions) {
    if (!variants || !variants.length) return null;
    if (!selectedOptions || selectedOptions.length === 0) return variants[0];
    return variants.find(function (v) {
      return v.options.every(function (opt, i) {
        return String(opt) === String(selectedOptions[i]);
      });
    });
  }

  function getRootUrl() {
    var b = document.body;
    return (b && b.getAttribute('data-theme-root')) || '/';
  }

  function getLocale() {
    var b = document.body;
    return (b && b.getAttribute('data-locale')) || '';
  }

  function parseJsonScript(root, sel) {
    var el = root.querySelector(sel);
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function updateQuickViewPrice(root, variant, currency, locale) {
    var wrap = root.querySelector('[data-qv-price] .price');
    if (!wrap) return;
    var current = wrap.querySelector('.price__current');
    var was = wrap.querySelector('.price__was');
    if (!current) return;

    var price = Number(variant.price);
    var compare = variant.compare_at_price != null ? Number(variant.compare_at_price) : null;

    current.classList.remove('price__current--sale', 'price__current--unavailable');
    wrap.classList.remove('price--sale', 'price--sold-out');

    if (!variant.available) {
      current.textContent = 'Sold out';
      current.classList.add('price__current--unavailable');
      wrap.classList.add('price--sold-out');
      if (was) was.style.display = 'none';
      return;
    }

    if (compare != null && !isNaN(compare) && compare > price) {
      current.textContent = formatMoney(price, currency, locale);
      current.classList.add('price__current--sale');
      wrap.classList.add('price--sale');
      if (was) {
        was.style.display = '';
        was.innerHTML =
          '<span class="visually-hidden">Regular price</span>' + formatMoney(compare, currency, locale);
      }
    } else {
      current.textContent = formatMoney(price, currency, locale);
      if (was) was.style.display = 'none';
    }

    wrap.setAttribute('data-price', String(price));
    wrap.setAttribute('data-compare-at-price', compare != null ? String(compare) : '');
  }

  function updateQuickViewMedia(root, variant, mediaMap) {
    var imgWrap = root.querySelector('[data-qv-media]');
    if (!imgWrap || !mediaMap || !variant.featured_media_id) return;
    var url = mediaMap[String(variant.featured_media_id)];
    if (!url) return;
    var img = imgWrap.querySelector('img');
    if (img) {
      img.src = url;
      img.srcset = '';
    }
  }

  function bindQuickViewVariant(root, currency, locale) {
    var variants = parseJsonScript(root, '[data-qv-variants]');
    var mediaMap = parseJsonScript(root, '[data-qv-media-by-id]') || {};
    if (!variants || !variants.length) return;

    var idInput = root.querySelector('[data-qv-variant-id]');
    var selects = root.querySelectorAll('select[data-qv-option]');
    var submit = root.querySelector('[data-qv-submit]');

    function selectedOptions() {
      var out = [];
      selects.forEach(function (sel) {
        var idx = parseInt(sel.getAttribute('data-qv-option'), 10);
        out[idx] = sel.value;
      });
      return out;
    }

    function sync() {
      var opts = selectedOptions();
      var v = findVariant(variants, opts);
      if (!v) return;
      if (idInput) idInput.value = String(v.id);
      updateQuickViewPrice(root, v, currency, locale);
      updateQuickViewMedia(root, v, mediaMap);
      if (submit) {
        submit.disabled = !v.available;
        submit.textContent = v.available ? submit.getAttribute('data-label-atc') || 'Add to cart' : 'Sold out';
      }
    }

    if (submit && !submit.getAttribute('data-label-atc')) {
      submit.setAttribute('data-label-atc', submit.textContent.trim());
    }

    selects.forEach(function (sel) {
      sel.addEventListener('change', sync);
    });
    sync();
  }

  function trapFocus(dialog) {
    var focusables = dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    var list = Array.prototype.filter.call(focusables, function (n) {
      return n.offsetParent !== null;
    });
    if (!list.length) return function () {};
    var first = list[0];
    var last = list[list.length - 1];

    function onKey(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    dialog.addEventListener('keydown', onKey);
    return function () {
      dialog.removeEventListener('keydown', onKey);
    };
  }

  var lastFocus = null;
  var untrap = null;

  function openDialog(dialog, contentHost) {
    lastFocus = document.activeElement;
    contentHost.innerHTML = '';
    dialog.removeAttribute('hidden');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    untrap = trapFocus(dialog);
    var closeBtn = dialog.querySelector('[data-quick-view-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeDialog(dialog, contentHost) {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    dialog.setAttribute('hidden', '');
    if (untrap) untrap();
    untrap = null;
    if (contentHost) contentHost.innerHTML = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function initLoadedQuickView(html, dialog, contentHost, currency) {
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var root = wrap.querySelector('[data-quick-view-root]');
    if (!root) {
      contentHost.innerHTML = html;
      return;
    }
    contentHost.innerHTML = '';
    contentHost.appendChild(root);
    bindQuickViewVariant(root, currency, getLocale());

    var form = root.querySelector('.quick-view__form') || root.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var addUrl = getRootUrl().replace(/\/?$/, '/') + 'cart/add.js';
        fetch(addUrl, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' },
        })
          .then(function (r) {
            return r.json();
          })
          .then(function () {
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            closeDialog(dialog, contentHost);
          })
          .catch(function () {
            form.submit();
          });
      });
    }
  }

  function initFashiqueQuickView() {
    if (window.__fashiqueQVInitialized) return;
    if (document.body.getAttribute('data-enable-quick-view') === 'false') return;

    var dialog = document.getElementById('QuickViewDialog');
    if (!dialog) return;
    var contentHost = dialog.querySelector('[data-quick-view-content]');
    if (!contentHost) return;

    window.__fashiqueQVInitialized = true;

    var currency =
      (document.body && document.body.getAttribute('data-currency')) ||
      (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) ||
      'USD';

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-quick-view]');
      if (!btn) return;
      var handle = btn.getAttribute('data-quick-view');
      if (!handle) return;
      e.preventDefault();

      var base = getRootUrl().replace(/\/?$/, '/');
      var url =
        base + 'products/' + encodeURIComponent(handle) + '?view=quick-view&sections=main';

      openDialog(dialog, contentHost);
      contentHost.innerHTML = '<p class="quick-view-dialog__loading">Loading…</p>';

      fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          var html = data.sections && data.sections.main;
          if (!html) throw new Error('no section');
          initLoadedQuickView(html, dialog, contentHost, currency);
        })
        .catch(function () {
          contentHost.innerHTML = '<p class="quick-view-dialog__error">Unable to load product.</p>';
        });
    });

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-quick-view-close]')) {
        closeDialog(dialog, contentHost);
      }
    });

    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDialog(dialog, contentHost);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dialog.open) closeDialog(dialog, contentHost);
    });
  }

  window.FashiqueInitQuickView = initFashiqueQuickView;
})();
