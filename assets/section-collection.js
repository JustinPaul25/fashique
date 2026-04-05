/**
 * Collection template: sort select, grid/list layout, mobile filter drawer,
 * optional auto-submit on facet checkboxes, AJAX filter + grid refresh (Phase 7.2),
 * infinite scroll via [data-pagination] (Phase 7.1).
 */
(function () {
  'use strict';

  var LAYOUT_KEY = 'fashique:collection-layout';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function initSort(root) {
    var sel = root.querySelector('[data-collection-sort]');
    if (!sel) return;
    sel.addEventListener('change', function () {
      var params = new URLSearchParams(window.location.search);
      params.set('sort_by', sel.value);
      params.delete('page');
      window.location.search = params.toString();
    });
  }

  function initLayoutToggle(root) {
    var btns = root.querySelectorAll('[data-layout-toggle]');
    if (!btns.length) return;

    function apply(layout) {
      root.setAttribute('data-layout', layout);
      btns.forEach(function (b) {
        var on = b.getAttribute('data-layout-toggle') === layout;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    try {
      var saved = sessionStorage.getItem(LAYOUT_KEY);
      if (saved === 'list' || saved === 'grid') apply(saved);
    } catch (e) {}

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var layout = btn.getAttribute('data-layout-toggle');
        if (!layout) return;
        apply(layout);
        try {
          sessionStorage.setItem(LAYOUT_KEY, layout);
        } catch (e) {}
      });
    });
  }

  function initFilterDrawer(root) {
    var openBtn = root.querySelector('[data-filter-open]');
    var aside = root.querySelector('[data-collection-filters]');
    var backdrop = root.querySelector('[data-filter-backdrop]');
    var closeEls = root.querySelectorAll('[data-filter-close]');
    if (!openBtn || !aside) return;

    function setOpen(on) {
      aside.classList.toggle('is-open', on);
      if (backdrop) {
        backdrop.classList.toggle('is-visible', on);
        backdrop.setAttribute('aria-hidden', on ? 'false' : 'true');
      }
      document.body.classList.toggle('collection-filters-open', on);
      openBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }

    openBtn.addEventListener('click', function () {
      var next = !aside.classList.contains('is-open');
      setOpen(next);
    });

    closeEls.forEach(function (el) {
      el.addEventListener('click', function () {
        setOpen(false);
      });
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setOpen(false);
      });
    }

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && aside.classList.contains('is-open')) {
        setOpen(false);
        openBtn.focus();
      }
    });
  }

  function initFilterAutoSubmit(root) {
    if (root.getAttribute('data-collection-filter-ajax') === 'true') return;
    var form = root.querySelector('form[data-filter-auto-submit]');
    if (!form) return;
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.matches && t.matches('input[type="checkbox"]')) {
        form.submit();
      }
    });
  }

  function formToAbsoluteUrl(form) {
    var action = form.getAttribute('action') || window.location.pathname;
    var u = new URL(action, window.location.origin);
    var fd = new FormData(form);
    var params = new URLSearchParams(fd);
    u.search = params.toString();
    return u.toString();
  }

  function swapCollectionFragment(root, doc) {
    var sid = root.getAttribute('data-section-id') || '';
    var fresh = doc.querySelector('[data-collection-page][data-section-id="' + sid + '"]');
    if (!fresh) return false;

    var chipsOld = root.querySelector('[data-collection-ajax-chips]');
    var chipsNew = fresh.querySelector('[data-collection-ajax-chips]');
    if (chipsOld && chipsNew) chipsOld.innerHTML = chipsNew.innerHTML;

    var filtOld = root.querySelector('[data-collection-ajax-filters-inner]');
    var filtNew = fresh.querySelector('[data-collection-ajax-filters-inner]');
    if (filtOld && filtNew) filtOld.innerHTML = filtNew.innerHTML;

    var mainOld = root.querySelector('[data-collection-ajax-main]');
    var mainNew = fresh.querySelector('[data-collection-ajax-main]');
    if (mainOld && mainNew) mainOld.innerHTML = mainNew.innerHTML;

    return true;
  }

  function initFilterAjax(root) {
    if (root.getAttribute('data-collection-filter-ajax') !== 'true') return;
    if (root.getAttribute('data-filter-ajax-bound') === '1') return;
    root.setAttribute('data-filter-ajax-bound', '1');

    var filterCtrl = null;

    root.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;
      if (!form.matches('form[data-filter-auto-submit]')) return;
      if (!root.contains(form)) return;
      e.preventDefault();
      applyFilterAjax(root, form);
    });

    root.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.matches || !t.matches('input[type="checkbox"]')) return;
      var form = t.closest('form[data-filter-auto-submit]');
      if (!form || !root.contains(form)) return;
      applyFilterAjax(root, form);
    });

    function applyFilterAjax(rootEl, form) {
      if (filterCtrl) filterCtrl.abort();
      filterCtrl = new AbortController();

      var main = rootEl.querySelector('[data-collection-ajax-main]');
      if (main) {
        main.setAttribute('aria-busy', 'true');
        main.classList.add('is-filter-loading');
      }

      var url = formToAbsoluteUrl(form);

      fetch(url, { credentials: 'same-origin', signal: filterCtrl.signal })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          return r.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          if (!swapCollectionFragment(rootEl, doc)) throw new Error('swap');
          try {
            history.pushState({}, '', url);
          } catch (err) {}
          reinitCollectionMain(rootEl);
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          form.submit();
        })
        .finally(function () {
          if (main) {
            main.removeAttribute('aria-busy');
            main.classList.remove('is-filter-loading');
          }
        });
    }
  }

  function reinitCollectionMain(root) {
    if (root.__collectionInfiniteIo) {
      root.__collectionInfiniteIo.disconnect();
      root.__collectionInfiniteIo = null;
    }
    initSort(root);
    initLayoutToggle(root);
    initFilterDrawer(root);
    initInfiniteScroll(root);
  }

  function setPaginationLoading(pag, on) {
    if (!pag) return;
    var spin = pag.querySelector('[data-pagination-loading]');
    var btn = pag.querySelector('[data-pagination-load-btn]');
    pag.classList.toggle('is-loading', on);
    if (spin) {
      if (on) spin.removeAttribute('hidden');
      else spin.setAttribute('hidden', '');
    }
    if (btn) btn.setAttribute('aria-busy', on ? 'true' : 'false');
  }

  function initInfiniteScroll(root) {
    var grid = root.querySelector('[data-product-grid]');
    var pag = root.querySelector('[data-pagination]');
    if (!grid || !pag) return;

    var nextUrl = pag.getAttribute('data-next-page');
    if (!nextUrl) return;

    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    if (reduceMotion) return;

    var loading = false;

    function finish(newRoot) {
      loading = false;
      setPaginationLoading(pag, false);
      var newPag = newRoot ? newRoot.querySelector('[data-pagination]') : null;
      var next = newPag && newPag.getAttribute('data-next-page');
      if (next) {
        pag.setAttribute('data-next-page', next);
        var info = newPag.querySelector('.pagination__info');
        var btn = newPag.querySelector('.pagination__btn');
        if (info) {
          var oldInfo = pag.querySelector('.pagination__info');
          if (oldInfo) oldInfo.textContent = info.textContent;
        }
        if (btn) {
          var oldBtn = pag.querySelector('.pagination__btn');
          if (oldBtn) oldBtn.setAttribute('href', btn.getAttribute('href'));
        }
      } else {
        var allShown = newRoot && newRoot.querySelector('.pagination__all-shown');
        if (allShown) {
          pag.parentNode.replaceChild(allShown.cloneNode(true), pag);
        } else {
          pag.remove();
        }
        if (root.__collectionInfiniteIo) {
          root.__collectionInfiniteIo.disconnect();
          root.__collectionInfiniteIo = null;
        }
      }
    }

    if (root.__collectionInfiniteIo) {
      root.__collectionInfiniteIo.disconnect();
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || loading) return;
          var url = pag.getAttribute('data-next-page');
          if (!url) return;
          loading = true;
          setPaginationLoading(pag, true);
          fetch(url, { credentials: 'same-origin' })
            .then(function (r) {
              return r.text();
            })
            .then(function (html) {
              var doc = new DOMParser().parseFromString(html, 'text/html');
              var newRoot = doc.querySelector('[data-collection-page]');
              if (!newRoot) {
                loading = false;
                setPaginationLoading(pag, false);
                return;
              }
              var newGrid = newRoot.querySelector('[data-product-grid]');
              if (newGrid) {
                newGrid.querySelectorAll(':scope > li').forEach(function (li) {
                  grid.appendChild(document.importNode(li, true));
                });
              }
              finish(newRoot);
            })
            .catch(function () {
              loading = false;
              setPaginationLoading(pag, false);
            });
        });
      },
      { rootMargin: '240px', threshold: 0 },
    );

    root.__collectionInfiniteIo = io;
    io.observe(pag);
  }

  function initSection(root) {
    initSort(root);
    initLayoutToggle(root);
    initFilterDrawer(root);
    initFilterAjax(root);
    initFilterAutoSubmit(root);
    initInfiniteScroll(root);
  }

  onReady(function () {
    document.querySelectorAll('[data-collection-page]').forEach(initSection);
  });
})();
