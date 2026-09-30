/* ==========================================================================
   Yonoio — main.js
   --------------------------------------------------------------------------
   Progressive enhancement only. Every piece of page content exists in the
   HTML; this file adds behaviour on top of it. With JavaScript disabled the
   site must remain fully readable and navigable.

   Modules in this file:
     1. initNavToggle()     — mobile navigation panel
     2. initStickyHeader()  — header background state on scroll
     3. initFooterYear()    — copyright year
     4. initAppDirectory()  — search, category filter and sort on existing cards
     5. initFaq()           — accessible FAQ accordion
     6. initCategoryDownloads() — skip empty # affiliate placeholders
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  function debounce(fn, wait) {
    var timer = null;

    return function () {
      var context = this;
      var args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  function normalise(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }


  /* ------------------------------------------------------------------------
     1. Mobile navigation panel

     The nav markup is always present. On small screens CSS hides it and this
     toggles the .is-open class, keeping aria-expanded in sync so screen
     readers announce the state correctly.
     ------------------------------------------------------------------------ */

  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');

    if (!toggle || !nav) {
      return;
    }

    function setOpen(isOpen) {
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('is-nav-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('.primary-nav__link')) {
        setOpen(false);
      }
    });

    document.addEventListener('click', function (event) {
      if (!isOpen()) {
        return;
      }
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    var desktop = window.matchMedia('(min-width: 900px)');

    function handleBreakpoint(event) {
      if (event.matches) {
        setOpen(false);
      }
    }

    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', handleBreakpoint);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(handleBreakpoint);
    }
  }


  /* ------------------------------------------------------------------------
     2. Sticky header state
     ------------------------------------------------------------------------ */

  function initStickyHeader() {
    var header = document.querySelector('.site-header');

    if (!header) {
      return;
    }

    var threshold = 8;
    var scrolled = null;

    function update() {
      var next = window.scrollY > threshold;

      if (next !== scrolled) {
        scrolled = next;
        header.classList.toggle('is-scrolled', next);
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ------------------------------------------------------------------------
     3. Footer copyright year
     ------------------------------------------------------------------------ */

  function initFooterYear() {
    var target = document.querySelector('[data-current-year]');

    if (target) {
      target.textContent = String(new Date().getFullYear());
    }
  }


  /* ------------------------------------------------------------------------
     4. App directory — search, category filter, sort

     Cards already exist in the HTML. This only shows, hides and reorders
     those nodes. It never creates listing content.
     ------------------------------------------------------------------------ */

  function getCardName(item) {
    var title = item.querySelector('.card__title');
    return title ? title.textContent : '';
  }

  function getCardCategory(item) {
    var badge = item.querySelector('.badge');
    return badge ? badge.textContent.trim() : '';
  }

  function getCardHaystack(item) {
    var name = getCardName(item);
    var category = getCardCategory(item);
    var desc = item.querySelector('.app-card__desc');
    var description = desc ? desc.textContent : '';
    return normalise(name + ' ' + category + ' ' + description);
  }

  function collectDirectoryItems(grid) {
    var children = grid.children;
    var items = [];
    var i;

    for (i = 0; i < children.length; i += 1) {
      items.push(children[i]);
      children[i].dataset.originalIndex = String(i);
    }

    return items;
  }

  function uniqueCategories(items) {
    var seen = {};
    var list = [];
    var i;
    var category;

    for (i = 0; i < items.length; i += 1) {
      category = getCardCategory(items[i]);
      if (category && !seen[category]) {
        seen[category] = true;
        list.push(category);
      }
    }

    list.sort(function (a, b) {
      return a.localeCompare(b);
    });

    return list;
  }

  function fillCategorySelect(select, items) {
    var categories = uniqueCategories(items);
    var i;
    var option;

    for (i = 0; i < categories.length; i += 1) {
      option = document.createElement('option');
      option.value = categories[i];
      option.textContent = categories[i];
      select.appendChild(option);
    }
  }

  function ensureEmptyMessage(grid) {
    var parent = grid.parentNode;
    var existing = parent.querySelector('[data-directory-empty]');
    var message;

    if (existing) {
      return existing;
    }

    message = document.createElement('p');
    message.className = 'directory-empty';
    message.hidden = true;
    message.setAttribute('data-directory-empty', '');
    message.textContent = 'No apps match this search.';
    parent.insertBefore(message, grid.nextSibling);
    return message;
  }

  function sortItems(items, mode) {
    var sorted = items.slice();

    if (mode === 'name-asc') {
      sorted.sort(function (a, b) {
        return getCardName(a).localeCompare(getCardName(b));
      });
    } else if (mode === 'name-desc') {
      sorted.sort(function (a, b) {
        return getCardName(b).localeCompare(getCardName(a));
      });
    } else {
      sorted.sort(function (a, b) {
        return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
      });
    }

    return sorted;
  }

  function applyDirectoryState(grid, items, emptyMessage, status, query, category, sortMode) {
    var needle = normalise(query);
    var visible = 0;
    var ordered = sortItems(items, sortMode);
    var i;
    var item;
    var matchesQuery;
    var matchesCategory;
    var show;
    var label;

    for (i = 0; i < ordered.length; i += 1) {
      item = ordered[i];
      matchesQuery = !needle || getCardHaystack(item).indexOf(needle) !== -1;
      matchesCategory = !category || getCardCategory(item) === category;
      show = matchesQuery && matchesCategory;
      item.hidden = !show;
      grid.appendChild(item);
      if (show) {
        visible += 1;
      }
    }

    emptyMessage.hidden = visible !== 0;

    if (status) {
      if (!needle && !category) {
        label = visible + ' apps shown.';
      } else if (visible === 0) {
        label = 'No apps match this search.';
      } else if (visible === 1) {
        label = '1 app shown.';
      } else {
        label = visible + ' apps shown.';
      }
      status.textContent = label;
    }
  }

  function syncDirectoryUrl(query, category) {
    if (!window.history || typeof window.history.replaceState !== 'function') {
      return;
    }

    var url = new URL(window.location.href);

    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }

    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }

    window.history.replaceState({}, '', url);
  }

  function initAppDirectory() {
    var grid = document.querySelector('[data-app-directory]');

    if (!grid) {
      return;
    }

    var items = collectDirectoryItems(grid);

    if (!items.length) {
      return;
    }

    var controls = document.querySelector('[data-directory-controls]');
    var searchInput = document.getElementById('app-search');
    var categorySelect = null;
    var sortSelect = null;
    var status = null;
    var emptyMessage = ensureEmptyMessage(grid);
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var initialCategory = params.get('category') || '';

    if (controls) {
      controls.hidden = false;
      searchInput = controls.querySelector('[data-directory-search]') || searchInput;
      categorySelect = controls.querySelector('[data-directory-category]');
      sortSelect = controls.querySelector('[data-directory-sort]');
      status = controls.querySelector('[data-directory-status]');
    }

    if (categorySelect) {
      fillCategorySelect(categorySelect, items);
      if (initialCategory) {
        categorySelect.value = initialCategory;
        if (categorySelect.value !== initialCategory) {
          initialCategory = '';
        }
      }
    }

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function currentQuery() {
      return searchInput ? searchInput.value : '';
    }

    function currentCategory() {
      return categorySelect ? categorySelect.value : '';
    }

    function currentSort() {
      return sortSelect ? sortSelect.value : 'default';
    }

    function update(syncUrl) {
      var query = currentQuery();
      var category = currentCategory();
      applyDirectoryState(
        grid,
        items,
        emptyMessage,
        status,
        query,
        category,
        currentSort()
      );
      if (syncUrl && controls) {
        syncDirectoryUrl(normalise(query), category);
      }
    }

    var scheduleUpdate = debounce(function () {
      update(true);
    }, 120);

    if (searchInput) {
      searchInput.addEventListener('input', scheduleUpdate);
      searchInput.addEventListener('change', function () {
        update(true);
      });
      searchInput.addEventListener('search', function () {
        update(true);
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', function () {
        update(true);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        update(false);
      });
    }

    if (controls) {
      controls.addEventListener('submit', function (event) {
        event.preventDefault();
        update(true);
      });
    }

    update(false);
  }


  /* ------------------------------------------------------------------------
     5. FAQ accordion

     Markup uses buttons + panels so the answers stay in the HTML. JavaScript
     only toggles visibility and aria-expanded.
     ------------------------------------------------------------------------ */

  function setFaqItem(trigger, panel, expanded) {
    trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    panel.hidden = !expanded;
  }

  function initFaq() {
    var root = document.querySelector('.app-faq');

    if (!root) {
      return;
    }

    var triggers = root.querySelectorAll('.app-faq__trigger');
    var i;

    function findPanel(trigger) {
      var id = trigger.getAttribute('aria-controls');
      return id ? document.getElementById(id) : null;
    }

    for (i = 0; i < triggers.length; i += 1) {
      (function (trigger) {
        var panel = findPanel(trigger);
        if (!panel) {
          return;
        }

        setFaqItem(trigger, panel, false);

        trigger.addEventListener('click', function () {
          var willOpen = trigger.getAttribute('aria-expanded') !== 'true';
          var other;
          var otherPanel;
          var n;

          for (n = 0; n < triggers.length; n += 1) {
            other = triggers[n];
            otherPanel = findPanel(other);
            if (otherPanel) {
              setFaqItem(other, otherPanel, other === trigger && willOpen);
            }
          }
        });
      }(triggers[i]));
    }
  }


  /* ------------------------------------------------------------------------
     6. Category / product card download buttons

     Each card has a separate Download link for an affiliate URL. Until that
     href is a real address, keep the click from jumping to the top of the
     page. Clicking the rest of the card still goes to the app page.
     ------------------------------------------------------------------------ */

  function initCategoryDownloads() {
    var buttons = document.querySelectorAll('.category-card__download');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (event) {
        var href = this.getAttribute('href');
        if (!href || href === '#') {
          event.preventDefault();
        }
      });
    }
  }


  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */

  function init() {
    initNavToggle();
    initStickyHeader();
    initFooterYear();
    initAppDirectory();
    initFaq();
    initCategoryDownloads();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
