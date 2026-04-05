/**
 * Quick order list: variant price sync, batch add via Cart API { items: [...] }.
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

  function getRootUrl() {
    var b = document.body;
    return (b && b.getAttribute('data-theme-root')) || '/';
  }

  function syncRowPrice(row, currency, locale) {
    var cell = row.querySelector('[data-qol-price-cell]');
    var sel = row.querySelector('[data-qol-variant-select]');
    if (!cell || !sel) return;
    var opt = sel.options[sel.selectedIndex];
    if (!opt) return;
    var cents = parseInt(opt.getAttribute('data-price-cents'), 10);
    if (isNaN(cents)) return;
    cell.innerHTML = '<span class="price">' + formatMoney(cents, currency, locale) + '</span>';
  }

  function bindRow(row, currency, locale) {
    var sel = row.querySelector('[data-qol-variant-select]');
    if (sel) {
      sel.addEventListener('change', function () {
        syncRowPrice(row, currency, locale);
      });
    }
  }

  onReady(function () {
    var currency = (document.body && document.body.getAttribute('data-currency')) || 'USD';
    var locale = (document.body && document.body.getAttribute('data-locale')) || '';

    document.querySelectorAll('[data-qol-root]').forEach(function (root) {
      root.querySelectorAll('[data-qol-row]').forEach(function (row) {
        bindRow(row, currency, locale);
        if (row.querySelector('[data-qol-variant-select]')) {
          syncRowPrice(row, currency, locale);
        }
      });

      var form = root.querySelector('[data-qol-form]');
      if (!form) return;

      var status = root.querySelector('[data-qol-status]');
      var selectMsg = root.getAttribute('data-qol-select-msg') || '';
      var errMsg = root.getAttribute('data-qol-error-msg') || '';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (status) {
          status.hidden = true;
          status.textContent = '';
          status.classList.remove('is-error');
        }

        var items = [];
        root.querySelectorAll('[data-qol-row]').forEach(function (row) {
          var sel = row.querySelector('[data-qol-variant-select]');
          var hidden = row.querySelector('[data-qol-variant-id]');
          var qtyInput = row.querySelector('[data-qol-qty]');
          if (!qtyInput) return;
          var qty = parseInt(qtyInput.value, 10) || 0;
          if (qty < 1) return;
          var idStr = sel ? sel.value : hidden && hidden.value;
          var vid = parseInt(idStr, 10);
          if (!isNaN(vid)) {
            items.push({ id: vid, quantity: qty });
          }
        });

        if (items.length === 0) {
          if (status) {
            status.textContent = selectMsg;
            status.hidden = false;
            status.classList.add('is-error');
          }
          return;
        }

        var base = getRootUrl().replace(/\/?$/, '/');
        fetch(base + 'cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ items: items }),
        })
          .then(function (r) {
            return r.json().then(function (j) {
              return { ok: r.ok, j: j };
            });
          })
          .then(function (res) {
            if (!res.ok) {
              var msg =
                (res.j && (res.j.description || res.j.message)) || errMsg;
              if (status) {
                status.textContent = msg;
                status.hidden = false;
                status.classList.add('is-error');
              }
              return;
            }
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            root.querySelectorAll('[data-qol-qty]').forEach(function (input) {
              input.value = '0';
            });
            if (status) {
              status.hidden = true;
            }
          })
          .catch(function () {
            if (status) {
              status.textContent = errMsg;
              status.hidden = false;
              status.classList.add('is-error');
            }
          });
      });
    });
  });
})();
