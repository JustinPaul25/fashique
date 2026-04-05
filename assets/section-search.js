/**
 * Search page: debounced predictive search via /search/suggest + section_id.
 * Expects [data-search-page] with data-predictive-url, data-section-id, data-enable-predictive.
 */
(function () {
  var DEBOUNCE_MS = 280;
  var MIN_CHARS = 2;

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, ms);
    };
  }

  function initSearchPage(root) {
    var enable = root.getAttribute('data-enable-predictive') === 'true';
    if (!enable) return;

    var urlBase = root.getAttribute('data-predictive-url') || '/search/suggest';
    var sectionId = root.getAttribute('data-section-id') || 'predictive-search';
    var input = qs(root, '[data-search-input]');
    var live = qs(root, '[data-search-live]');
    var output = qs(root, '[data-predictive-output]');
    var wrap = qs(root, '[data-predictive-wrap]');
    if (!input || !output || !wrap) return;

    var ctrl = new AbortController();

    function closePanel() {
      output.innerHTML = '';
      wrap.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    function openPanel() {
      wrap.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    var fetchSuggestions = debounce(function (q) {
      ctrl.abort();
      ctrl = new AbortController();
      if (!q || q.length < MIN_CHARS) {
        closePanel();
        if (live) live.textContent = '';
        return;
      }

      var params = new URLSearchParams();
      params.set('q', q);
      params.set('section_id', sectionId);
      params.set('resources[type]', 'product,article,collection,page');
      params.set('resources[limit]', '10');
      params.set('resources[limit_scope]', 'all');

      var reqUrl = urlBase + (urlBase.indexOf('?') >= 0 ? '&' : '?') + params.toString();

      fetch(reqUrl, {
        signal: ctrl.signal,
        headers: { Accept: 'text/html' },
        credentials: 'same-origin',
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.statusText);
          return res.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var section = doc.querySelector('#shopify-section-' + sectionId);
          if (!section) {
            closePanel();
            return;
          }
          var inner = section.querySelector('[data-predictive-panel]');
          output.innerHTML = inner ? inner.outerHTML : section.innerHTML;
          if (output.textContent.trim()) {
            openPanel();
            if (live) {
              var msg = root.getAttribute('data-live-msg');
              if (msg) live.textContent = msg;
            }
          } else {
            closePanel();
            if (live) live.textContent = '';
          }
        })
        .catch(function (err) {
          if (err.name === 'AbortError') return;
          closePanel();
        });
    }, DEBOUNCE_MS);

    input.addEventListener('input', function () {
      fetchSuggestions(input.value.trim());
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanel();
        if (live) live.textContent = '';
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target) && e.target !== input) {
        closePanel();
      }
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= MIN_CHARS) {
        fetchSuggestions(input.value.trim());
      }
    });
  }

  document.querySelectorAll('[data-search-page]').forEach(initSearchPage);
})();
