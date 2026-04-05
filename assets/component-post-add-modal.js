/**
 * Post add to cart recommendations modal (product page Ajax add only).
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

  function escapeHtml(str) {
    if (str == null) return '';
    var d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }

  var untrapPostAdd = null;

  function trapFocus(container) {
    var focusables = container.querySelectorAll(
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
    container.addEventListener('keydown', onKey);
    return function () {
      container.removeEventListener('keydown', onKey);
    };
  }

  function getRootUrl() {
    var b = document.body;
    return (b && b.getAttribute('data-theme-root')) || '/';
  }

  function openModal(productId) {
    var dialog = document.getElementById('PostAddDialog');
    var recs = dialog && dialog.querySelector('[data-post-add-recs]');
    if (!dialog || !recs) return;

    var emptyMsg = dialog.getAttribute('data-post-add-empty') || '';

    function mountTrap() {
      if (untrapPostAdd) untrapPostAdd();
      untrapPostAdd = null;
      var panel = dialog.querySelector('.post-add-dialog__panel');
      if (panel) untrapPostAdd = trapFocus(panel);
      var closeBtn = dialog.querySelector('[data-post-add-close]');
      if (closeBtn) closeBtn.focus();
    }

    recs.innerHTML = '<p class="post-add-dialog__loading">…</p>';
    dialog.removeAttribute('hidden');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    mountTrap();

    var base = getRootUrl().replace(/\/?$/, '/');
    var currency =
      (document.body && document.body.getAttribute('data-currency')) || 'USD';
    var locale = (document.body && document.body.getAttribute('data-locale')) || '';

    fetch(
      base +
        'recommendations/products.json?product_id=' +
        encodeURIComponent(productId) +
        '&limit=4&intent=complementary'
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var products = (data && data.products) || [];
        if (!products.length) {
          recs.innerHTML =
            '<p class="post-add-dialog__empty">' + escapeHtml(emptyMsg) + '</p>';
          if (!dialog.hasAttribute('hidden')) mountTrap();
          return;
        }
        recs.innerHTML = '';
        products.forEach(function (p) {
          var a = document.createElement('a');
          a.className = 'post-add-dialog__row';
          a.href = p.url || '#';
          var img = document.createElement('img');
          var fi = p.featured_image;
          if (fi) {
            img.src = typeof fi === 'string' ? fi : fi.src || '';
          }
          img.alt = p.title || '';
          img.loading = 'lazy';
          var title = document.createElement('span');
          title.textContent = p.title || '';
          var price = document.createElement('span');
          var cents = typeof p.price === 'number' ? p.price : parseInt(String(p.price), 10);
          if (!isNaN(cents)) price.textContent = formatMoney(cents, currency, locale);
          a.appendChild(img);
          a.appendChild(title);
          a.appendChild(price);
          recs.appendChild(a);
        });
        if (!dialog.hasAttribute('hidden')) mountTrap();
      })
      .catch(function () {
        recs.innerHTML = '';
        if (!dialog.hasAttribute('hidden')) mountTrap();
      });
  }

  function closeModal() {
    if (untrapPostAdd) untrapPostAdd();
    untrapPostAdd = null;
    var dialog = document.getElementById('PostAddDialog');
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    dialog.setAttribute('hidden', '');
  }

  onReady(function () {
    var dialog = document.getElementById('PostAddDialog');
    if (!dialog) return;

    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-post-add-close]')) closeModal();
    });

    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeModal();
    });

    dialog.querySelector('[data-post-add-continue]') &&
      dialog.querySelector('[data-post-add-continue]').addEventListener('click', closeModal);

    var viewCart = dialog.querySelector('[data-post-add-view-cart]');
    if (viewCart) {
      viewCart.addEventListener('click', function () {
        closeModal();
        if (window.FashiqueCartDrawer && typeof window.FashiqueCartDrawer.open === 'function') {
          window.FashiqueCartDrawer.open();
        } else {
          var u = dialog.getAttribute('data-cart-url');
          window.location.href = u || getRootUrl().replace(/\/?$/, '/') + 'cart';
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      var d = document.getElementById('PostAddDialog');
      if (!d || e.key !== 'Escape') return;
      if (d.hasAttribute('hidden')) return;
      closeModal();
    });

    window.FashiquePostAddModal = { open: openModal, close: closeModal };
  });
})();
