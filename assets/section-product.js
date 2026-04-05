/**
 * Product section: variant selection, URL sync, price + inventory + media updates,
 * tiered pricing by quantity, complementary products (JSON API).
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

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  function findVariant(variants, selectedOptions, variantInput) {
    if (!variants || !variants.length) return null;
    if (!selectedOptions || selectedOptions.length === 0) {
      var vid = variantInput && parseInt(variantInput.value, 10);
      if (vid) {
        var byId = variants.find(function (v) {
          return Number(v.id) === vid;
        });
        if (byId) return byId;
      }
      return variants.length === 1 ? variants[0] : null;
    }
    return variants.find(function (v) {
      return v.options.every(function (opt, i) {
        return String(opt) === String(selectedOptions[i]);
      });
    });
  }

  function getSelectedOptions(root) {
    var optionCount = root.querySelectorAll('[data-option-index]').length;
    if (!optionCount) return [];

    var selects = root.querySelectorAll('select[data-option-select]');
    if (selects.length) {
      var out = [];
      selects.forEach(function (sel) {
        var idx = parseInt(sel.getAttribute('data-option-select'), 10);
        out[idx] = sel.value;
      });
      return out;
    }

    var map = {};
    root.querySelectorAll('.product-section__option').forEach(function (fieldset) {
      var idx = parseInt(fieldset.getAttribute('data-option-index'), 10);
      var selectedBtn = fieldset.querySelector('.product-section__opt.is-selected');
      if (selectedBtn && selectedBtn.dataset.value != null) {
        map[idx] = selectedBtn.dataset.value;
      }
    });
    var arr = [];
    for (var i = 0; i < optionCount; i++) {
      arr.push(map[i] || '');
    }
    return arr;
  }

  function setSelectedForOption(root, optionIndex, value) {
    var fieldset = root.querySelector('.product-section__option[data-option-index="' + optionIndex + '"]');
    if (!fieldset) return;

    var sel = fieldset.querySelector('select[data-option-select="' + optionIndex + '"]');
    if (sel) {
      sel.value = value;
      return;
    }

    fieldset.querySelectorAll('.product-section__opt').forEach(function (el) {
      var match = el.dataset.value === value;
      if (el.tagName === 'BUTTON') {
        el.classList.toggle('is-selected', match);
        el.setAttribute('aria-pressed', match ? 'true' : 'false');
      } else if (el.tagName === 'A') {
        el.classList.toggle('is-selected', match);
      }
    });
  }

  function updatePrice(root, variant, currency, locale, priceOverride) {
    var wrap = root.querySelector('[data-price-wrapper]');
    if (!wrap) return;

    var priceRoot = wrap.querySelector('.price');
    var current = wrap.querySelector('.price__current');
    var was = wrap.querySelector('.price__was');
    if (!priceRoot || !current) return;

    var price =
      priceOverride != null ? Number(priceOverride.price) : Number(variant.price);
    var compare =
      priceOverride != null
        ? priceOverride.compare_at_price != null
          ? Number(priceOverride.compare_at_price)
          : null
        : variant.compare_at_price != null
          ? Number(variant.compare_at_price)
          : null;

    current.classList.remove('price__current--sale', 'price__current--unavailable');
    priceRoot.classList.remove('price--sale', 'price--sold-out');

    if (!variant.available) {
      current.textContent = root.dataset.i18nSoldOut || 'Sold out';
      current.classList.add('price__current--unavailable');
      priceRoot.classList.add('price--sold-out');
      if (was) was.style.display = 'none';
      return;
    }

    if (compare != null && !isNaN(compare) && compare > price) {
      current.textContent = formatMoney(price, currency, locale);
      current.classList.add('price__current--sale');
      priceRoot.classList.add('price--sale');
      if (was) {
        was.style.display = '';
        var hidden = was.querySelector('.visually-hidden');
        if (hidden) hidden.remove();
        var regLbl =
          root.dataset.i18nRegularPrice ||
          root.getAttribute('data-i18n-regular-price') ||
          '';
        was.innerHTML =
          '<span class="visually-hidden">' +
          regLbl +
          '</span>' +
          formatMoney(compare, currency, locale);
      }
    } else {
      current.textContent = formatMoney(price, currency, locale);
      if (was) was.style.display = 'none';
    }
  }

  function clearEl(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function setInventoryLine(msg, className, text) {
    clearEl(msg);
    msg.style.display = '';
    if (!text) {
      msg.style.display = 'none';
      return;
    }
    var span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    msg.appendChild(span);
  }

  function updateInventory(root, variant, threshold) {
    var block = root.querySelector('[data-inventory-block]');
    if (!block) return;

    var msg = block.querySelector('[data-stock-message]');
    var sku = block.querySelector('[data-sku-value]');
    if (sku && variant.sku) sku.textContent = variant.sku;

    if (!msg) return;

    var th = parseInt(threshold, 10) || 5;
    var tpl = root.dataset.i18nLowStock || '';
    var showInStock = block.getAttribute('data-show-in-stock-message') === 'true';

    if (variant.inventory_management !== 'shopify' || variant.inventory_quantity == null) {
      clearEl(msg);
      msg.style.display = 'none';
      return;
    }

    if (variant.available === false) {
      setInventoryLine(
        msg,
        'product-section__stock--oos',
        root.dataset.i18nSoldOut || ''
      );
      return;
    }

    if (variant.inventory_quantity <= 0) {
      setInventoryLine(
        msg,
        'product-section__stock--oos',
        root.dataset.i18nOutOfStock || ''
      );
      return;
    }

    if (variant.inventory_quantity <= th) {
      setInventoryLine(
        msg,
        'product-section__stock--low',
        tpl.replace(/\{count\}/g, String(variant.inventory_quantity))
      );
      return;
    }

    if (showInStock) {
      setInventoryLine(
        msg,
        'product-section__stock--ok',
        root.dataset.i18nInStock || ''
      );
    } else {
      clearEl(msg);
      msg.style.display = 'none';
    }
  }

  function updateDynamicCheckout(root, variant, hideForSubscription) {
    var wrap = root.querySelector('[data-dynamic-checkout]');
    if (!wrap) return;
    if (variant.available && !hideForSubscription) {
      wrap.removeAttribute('hidden');
    } else {
      wrap.setAttribute('hidden', '');
    }
  }

  function updateQuantityInputState(root, variant) {
    var input = root.querySelector('[data-quantity-input]');
    if (!input) return;
    input.disabled = !variant.available;
  }

  function updateMedia(root, featuredMediaId) {
    if (!featuredMediaId) return;

    root.querySelectorAll('.product-section__media-panel').forEach(function (panel) {
      var id = panel.getAttribute('data-media-id');
      var show = String(id) === String(featuredMediaId);
      panel.classList.toggle('product-section__media-panel--hidden', !show);
    });

    root.querySelectorAll('[data-thumbnail-list] .product-section__thumb').forEach(function (btn) {
      var match = btn.getAttribute('data-target-media-id') === String(featuredMediaId);
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-current', match ? 'true' : 'false');
    });

    var mobileSplideRoot = root.querySelector('[data-mobile-splide]');
    if (mobileSplideRoot && mobileSplideRoot._splide) {
      var slides = mobileSplideRoot.querySelectorAll('.splide__slide');
      slides.forEach(function (slide, i) {
        if (slide.getAttribute('data-media-id') === String(featuredMediaId)) {
          mobileSplideRoot._splide.go(i);
        }
      });
    }
  }

  function updateUrl(variantId, enabled) {
    if (!enabled) return;
    try {
      var u = new URL(window.location.href);
      u.searchParams.set('variant', String(variantId));
      window.history.replaceState({}, '', u.toString());
    } catch (e) {}
  }

  function updateQuantityRules(input, rule) {
    if (!input || !rule) return;
    input.min = String(rule.min != null ? rule.min : 1);
    input.step = String(rule.increment != null ? rule.increment : 1);
    if (rule.max != null) {
      input.max = String(rule.max);
    } else {
      input.removeAttribute('max');
    }
    var v = parseInt(input.value, 10);
    if (isNaN(v) || v < rule.min) input.value = String(rule.min);
  }

  function updateATCForSellingPlan(root, variant, selectedAllocation) {
    var btn = root.querySelector('[data-main-atc]');
    if (!btn) return;
    if (variant.available) {
      btn.disabled = false;
      var useSub =
        selectedAllocation &&
        selectedAllocation.recurring_deliveries === true;
      btn.textContent = useSub
        ? root.dataset.i18nAddSubscription || 'Add subscription to cart'
        : root.dataset.i18nAddToCart || 'Add to cart';
    } else {
      btn.disabled = true;
      btn.textContent = root.dataset.i18nSoldOut || 'Sold out';
    }
  }

  function findCurrentVariant(root) {
    var variants = root._productVariants;
    if (!variants || !variants.length) return null;
    var vid = root._currentVariantId;
    return variants.find(function (v) {
      return String(v.id) === String(vid);
    });
  }

  function groupAllocationsByGroupId(allocs) {
    var order = [];
    var seen = {};
    var buckets = {};
    allocs.forEach(function (a) {
      var g = String(a.group_id);
      if (!seen[g]) {
        seen[g] = true;
        order.push(g);
      }
      if (!buckets[g]) buckets[g] = [];
      buckets[g].push(a);
    });
    return order.map(function (g) {
      var items = buckets[g];
      return {
        group_id: g,
        group_name: (items[0] && items[0].group_name) || '',
        items: items,
      };
    });
  }

  function getSelectedSellingAllocation(root, variant) {
    var mount = root.querySelector('[data-selling-plans-mount]');
    if (!mount) return null;
    var checked = mount.querySelector('[data-selling-plan-radio]:checked');
    if (!checked || !checked.value) return null;
    var pid = parseInt(checked.value, 10);
    var allocs = variant.selling_plan_allocations || [];
    return (
      allocs.find(function (a) {
        return Number(a.plan_id) === pid;
      }) || null
    );
  }

  function renderSellingPlans(root, variant) {
    var block = root.querySelector('[data-selling-plans-block]');
    if (!block) return;

    var mount = block.querySelector('[data-selling-plans-mount]');
    var input = root.querySelector('[data-selling-plan-input]');
    if (!mount || !input) return;

    var allocs = variant.selling_plan_allocations || [];
    var requires = block.getAttribute('data-requires-selling-plan') === 'true';
    var showDesc = block.getAttribute('data-show-plan-descriptions') === 'true';
    var oneTimeRaw = (block.getAttribute('data-one-time-label') || '').trim();
    var oneTime =
      oneTimeRaw || root.dataset.i18nOneTimePurchase || 'One-time purchase';
    var sectionKey = root.getAttribute('data-section-id') || 'p';
    var radioName = 'selling_plan_pick_' + sectionKey;

    if (!allocs.length) {
      block.hidden = true;
      input.value = '';
      mount.innerHTML = '';
      return;
    }

    block.hidden = false;

    var defaultPlanId = requires && allocs.length ? allocs[0].plan_id : null;
    var html = '';

    if (!requires) {
      html +=
        '<div class="product-section__selling-plan-option">' +
        '<label class="product-section__selling-plan-label">' +
        '<input type="radio" name="' +
        escapeAttr(radioName) +
        '" value="" class="product-section__selling-plan-radio" data-selling-plan-radio checked>' +
        '<span class="product-section__selling-plan-label-text">' +
        escapeHtml(oneTime) +
        '</span></label></div>';
    }

    var groups = groupAllocationsByGroupId(allocs);
    groups.forEach(function (g) {
      html += '<fieldset class="product-section__selling-plan-group">';
      if (g.group_name) {
        html +=
          '<legend class="product-section__selling-plan-group-legend">' +
          escapeHtml(g.group_name) +
          '</legend>';
      }
      g.items.forEach(function (a) {
        var checked =
          requires && defaultPlanId != null && Number(a.plan_id) === Number(defaultPlanId);
        var id = 'sp-' + sectionKey + '-' + String(a.plan_id);
        html += '<div class="product-section__selling-plan-option">';
        html +=
          '<label class="product-section__selling-plan-label" for="' +
          escapeAttr(id) +
          '">';
        html +=
          '<input type="radio" id="' +
          escapeAttr(id) +
          '" name="' +
          escapeAttr(radioName) +
          '" value="' +
          escapeAttr(String(a.plan_id)) +
          '" class="product-section__selling-plan-radio" data-selling-plan-radio' +
          (checked ? ' checked' : '') +
          '>';
        html += '<span class="product-section__selling-plan-label-text">';
        html += '<span>' + escapeHtml(a.name) + '</span>';
        if (showDesc && a.description) {
          html +=
            '<p class="product-section__selling-plan-desc">' +
            escapeHtml(a.description) +
            '</p>';
        }
        html += '</span></label></div>';
      });
      html += '</fieldset>';
    });

    mount.innerHTML = html;

    var sel = mount.querySelector('[data-selling-plan-radio]:checked');
    if (sel) {
      input.value = sel.value || '';
    } else if (requires && allocs.length) {
      input.value = String(allocs[0].plan_id);
    } else {
      input.value = '';
    }
  }

  function bindSellingPlanChange(root) {
    root.addEventListener('change', function (e) {
      if (!e.target.matches || !e.target.matches('[data-selling-plan-radio]')) return;
      var planInput = root.querySelector('[data-selling-plan-input]');
      if (planInput) planInput.value = e.target.value || '';
      var variant = findCurrentVariant(root);
      if (!variant) return;
      var currency = root.dataset.currency;
      var locale = root.dataset.locale;
      var alloc = getSelectedSellingAllocation(root, variant);
      var priceOverride =
        alloc != null
          ? { price: alloc.price, compare_at_price: alloc.compare_at_price }
          : null;
      updatePrice(root, variant, currency, locale, priceOverride);
      updateATCForSellingPlan(root, variant, alloc);
      updateDynamicCheckout(root, variant, !!(alloc && alloc.recurring_deliveries));
      document.dispatchEvent(new CustomEvent('product:variant-change'));
    });
  }

  function applyVariant(root, variant, variants, currency, locale, updateUrlFlag, threshold) {
    if (!variant) return;

    root._currentVariantId = variant.id;

    var input = root.querySelector('[data-variant-id-input]');
    if (input) input.value = String(variant.id);

    renderSellingPlans(root, variant);

    var alloc = getSelectedSellingAllocation(root, variant);
    var priceOverride =
      alloc != null
        ? { price: alloc.price, compare_at_price: alloc.compare_at_price }
        : null;
    updatePrice(root, variant, currency, locale, priceOverride);
    updateInventory(root, variant, threshold);
    updateMedia(root, variant.featured_media_id);
    updateATCForSellingPlan(root, variant, alloc);
    updateDynamicCheckout(root, variant, !!(alloc && alloc.recurring_deliveries));
    updateQuantityInputState(root, variant);
    updateQuantityRules(root.querySelector('[data-quantity-input]'), variant.quantity_rule);
    updateUrl(variant.id, updateUrlFlag);
    document.dispatchEvent(new CustomEvent('product:variant-change'));
  }

  function bindVariantEvents(root, variants, currency, locale, updateUrlFlag, threshold) {
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.product-section__opt[data-value]');
      if (!btn || btn.tagName !== 'BUTTON' || btn.disabled) return;

      var fieldset = btn.closest('.product-section__option');
      if (!fieldset) return;
      var optIdx = parseInt(fieldset.getAttribute('data-option-index'), 10);

      fieldset.querySelectorAll('.product-section__opt').forEach(function (el) {
        if (el.tagName === 'BUTTON') {
          el.classList.remove('is-selected');
          el.setAttribute('aria-pressed', 'false');
        }
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');

      var selected = getSelectedOptions(root);
      selected[optIdx] = btn.dataset.value;
      var v = findVariant(variants, selected, root.querySelector('[data-variant-id-input]'));
      if (v) applyVariant(root, v, variants, currency, locale, updateUrlFlag, threshold);
    });

    root.addEventListener('change', function (e) {
      var sel = e.target.closest('select[data-option-select]');
      if (!sel) return;
      var selected = getSelectedOptions(root);
      var v = findVariant(variants, selected, root.querySelector('[data-variant-id-input]'));
      if (v) applyVariant(root, v, variants, currency, locale, updateUrlFlag, threshold);
    });
  }

  function bindThumbnails(root, variants, currency, locale, updateUrlFlag, threshold) {
    root.addEventListener('click', function (e) {
      var thumb = e.target.closest('.product-section__thumb');
      if (!thumb || !thumb.closest('[data-thumbnail-list]')) return;
      var id = thumb.getAttribute('data-target-media-id');
      root.querySelectorAll('.product-section__media-panel').forEach(function (panel) {
        var show = panel.getAttribute('data-media-id') === id;
        panel.classList.toggle('product-section__media-panel--hidden', !show);
      });
      root.querySelectorAll('[data-thumbnail-list] .product-section__thumb').forEach(function (b) {
        var match = b === thumb;
        b.classList.toggle('is-active', match);
        b.setAttribute('aria-current', match ? 'true' : 'false');
      });
    });
  }

  function bindAjaxProductForm(root) {
    var body = document.body;
    if (body.getAttribute('data-show-post-add-modal') !== 'true') return;
    if (body.getAttribute('data-cart-type') !== 'drawer') return;

    var form = root.querySelector('.product-section__form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      var sub = e.submitter;
      if (!sub || sub.getAttribute('name') !== 'add') return;
      e.preventDefault();

      var base = (body.getAttribute('data-theme-root') || '').replace(/\/?$/, '/');
      var url = base + 'cart/add.js';

      fetch(url, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok, j: j };
          });
        })
        .then(function (res) {
          if (!res.ok) {
            var msg =
              (res.j && (res.j.description || res.j.message)) ||
              root.getAttribute('data-i18n-cart-add-error') ||
              '';
            if (msg) window.alert(msg);
            return;
          }
          document.dispatchEvent(new CustomEvent('cart:refresh'));
          var pid = root.getAttribute('data-product-id');
          if (window.FashiquePostAddModal && pid) {
            window.FashiquePostAddModal.open(pid);
          }
        })
        .catch(function () {
          form.submit();
        });
    });
  }

  function bindTieredPricing(root) {
    var tierRoot = root.querySelector('[data-tiered-pricing]');
    if (!tierRoot) return;
    var qtyInput = root.querySelector('[data-quantity-input]');
    var note = tierRoot.querySelector('[data-tier-active]');
    var rows = tierRoot.querySelectorAll('[data-tier-rows] tr[data-tier-price]');
    if (!qtyInput || !rows.length) return;

    function sync() {
      var q = parseInt(qtyInput.value, 10);
      if (isNaN(q) || q < 1) q = 1;
      var currency = root.dataset.currency;
      var locale = root.dataset.locale;
      var active = null;
      rows.forEach(function (row) {
        var min = parseInt(row.getAttribute('data-tier-min'), 10) || 1;
        var maxStr = row.getAttribute('data-tier-max');
        var max = maxStr === '' || maxStr == null ? Infinity : parseInt(maxStr, 10);
        var price = parseInt(row.getAttribute('data-tier-price'), 10);
        var match = q >= min && q <= max;
        row.classList.toggle('is-active-tier', match);
        if (match) active = { min: min, max: max, price: price };
      });
      if (note && active) {
        var unitLbl =
          root.dataset.i18nTierUnit || root.getAttribute('data-i18n-tier-unit') || '';
        note.textContent =
          formatMoney(active.price, currency, locale) + (unitLbl ? ' ' + unitLbl : '');
        note.classList.remove('visually-hidden');
      } else if (note) {
        note.textContent = '';
        note.classList.add('visually-hidden');
      }
    }

    qtyInput.addEventListener('input', sync);
    qtyInput.addEventListener('change', sync);
    sync();
  }

  function loadComplementary(root) {
    var host = root.querySelector('[data-complementary]');
    if (!host) return;

    var grid = host.querySelector('[data-complementary-grid]');
    var loading = host.querySelector('[data-complementary-loading]');
    var pid = root.dataset.productId;
    var limit = host.getAttribute('data-complementary-limit') || '4';
    var intent = host.getAttribute('data-complementary-intent') || 'complementary';
    var base = root.dataset.rootUrl || '/';

    function render(products) {
      if (!grid || !products || !products.length) {
        host.hidden = true;
        return;
      }
      host.hidden = false;
      grid.innerHTML = '';
      products.forEach(function (p) {
        var a = document.createElement('a');
        a.className = 'product-section__complementary-card';
        a.href = p.url || '#';

        var fi = p.featured_image;
        var imgUrl = '';
        if (typeof fi === 'string') {
          imgUrl = fi;
        } else if (fi && typeof fi === 'object') {
          imgUrl = fi.src || fi.url || '';
        }

        if (imgUrl) {
          var img = document.createElement('img');
          img.src = imgUrl;
          img.alt = p.title || '';
          img.loading = 'lazy';
          img.width = 360;
          img.height = 360;
          a.appendChild(img);
        }

        var h = document.createElement('p');
        h.className = 'product-section__complementary-card-title';
        h.textContent = p.title || '';
        a.appendChild(h);

        var pr = document.createElement('p');
        pr.className = 'product-section__complementary-card-price';
        var rawP = p.price;
        var cents = typeof rawP === 'number' ? rawP : parseInt(String(rawP), 10);
        if (isNaN(cents)) cents = 0;
        pr.textContent = formatMoney(cents, root.dataset.currency, root.dataset.locale);
        a.appendChild(pr);

        grid.appendChild(a);
      });
      grid.hidden = false;
      if (loading) loading.hidden = true;
    }

    function fetchRecs() {
      if (loading) loading.hidden = false;
      var url =
        base +
        (base.endsWith('/') ? '' : '/') +
        'recommendations/products.json?product_id=' +
        encodeURIComponent(pid) +
        '&limit=' +
        encodeURIComponent(limit) +
        '&intent=' +
        encodeURIComponent(intent);

      fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          render(data.products || []);
        })
        .catch(function () {
          host.hidden = true;
        });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) return;
          io.disconnect();
          fetchRecs();
        },
        { rootMargin: '0px 0px 200px 0px' }
      );
      io.observe(host);
    } else {
      fetchRecs();
    }
  }

  onReady(function () {
    document.querySelectorAll('.product-section[data-product-id]').forEach(function (root) {
      var script = root.querySelector('script[data-product-variants]');
      if (!script) return;

      var variants;
      try {
        variants = JSON.parse(script.textContent);
      } catch (e) {
        return;
      }

      var currency = root.dataset.currency;
      var locale = root.dataset.locale;
      var updateUrlFlag = root.dataset.updateUrl === 'true';
      var threshold = root.dataset.stockThreshold;

      root._productVariants = variants;
      bindSellingPlanChange(root);

      var urlVariant = new URLSearchParams(window.location.search).get('variant');
      var initial = variants[0];
      if (urlVariant) {
        var found = variants.find(function (v) {
          return String(v.id) === String(urlVariant);
        });
        if (found) initial = found;
      }

      if (initial && initial.options && initial.options.length) {
        initial.options.forEach(function (val, i) {
          setSelectedForOption(root, i, val);
        });
      }
      applyVariant(root, initial, variants, currency, locale, false, threshold);

      bindVariantEvents(root, variants, currency, locale, updateUrlFlag, threshold);
      bindThumbnails(root, variants, currency, locale, updateUrlFlag, threshold);
      bindTieredPricing(root);
      bindAjaxProductForm(root);
      loadComplementary(root);
    });

    if (window.FashiqueSplide && document.querySelector('[data-mobile-splide]')) {
      window.FashiqueSplide.init(document);
    }
  });
})();
