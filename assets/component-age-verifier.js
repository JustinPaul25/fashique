/**
 * Age verifier: localStorage key `age-verified` = 'true' after confirm.
 * Decline uses href from data-decline-url (section setting).
 * Focus is trapped in the panel while the gate is visible (no Escape bypass).
 */
(function () {
  'use strict';

  var KEY = 'age-verified';

  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function trapFocus(container) {
    function visible(el) {
      return el.offsetParent !== null;
    }
    function refreshList() {
      return [].filter.call(container.querySelectorAll(FOCUSABLE), visible);
    }
    var list = refreshList();
    var first = list[0];
    var last = list[list.length - 1];

    function onKey(e) {
      if (e.key !== 'Tab') return;
      list = refreshList();
      if (!list.length) return;
      first = list[0];
      last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    container.addEventListener('keydown', onKey);
    return function () {
      container.removeEventListener('keydown', onKey);
    };
  }

  onReady(function () {
    var root = document.querySelector('[data-age-verifier]');
    if (!root) return;

    var designMode = root.getAttribute('data-design-mode') === 'true';
    var confirmBtn = root.querySelector('[data-age-confirm]');
    var declineLink = root.querySelector('[data-age-decline]');
    var panel = root.querySelector('.age-verifier__panel');
    var removeTrap = null;

    function hideGate() {
      document.documentElement.classList.add('age-verifier-passed');
      root.setAttribute('aria-hidden', 'true');
    }

    function dismissAndReturnFocus() {
      if (removeTrap) removeTrap();
      removeTrap = null;
      hideGate();
      var main = document.getElementById('main-content');
      if (main && typeof main.focus === 'function') {
        main.focus({ preventScroll: true });
      }
    }

    if (!designMode) {
      try {
        if (localStorage.getItem(KEY) === 'true') {
          hideGate();
          return;
        }
      } catch (e) {}
    }

    if (panel) {
      removeTrap = trapFocus(panel);
    }
    if (confirmBtn) {
      confirmBtn.focus({ preventScroll: true });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(KEY, 'true');
        } catch (e) {}
        dismissAndReturnFocus();
      });
    }

    if (declineLink && !declineLink.getAttribute('href')) {
      var fallback = root.getAttribute('data-decline-url');
      if (fallback) declineLink.setAttribute('href', fallback);
    }
  });
})();
