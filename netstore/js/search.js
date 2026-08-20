/* ==========================================================================
   NetStore — global arama
   Ürün, müşteri ve fatura kayıtlarında arar; sonuçlar gruplanmış bir panelde
   gösterilir. Klavye ile gezilebilir (↑ ↓ Enter Esc).
   ========================================================================== */

const SEARCH_LIMIT = 5;      // grup başına
let SEARCH_RESULTS = [];     // düz liste — klavye gezinmesi için
let SEARCH_INDEX = -1;

/** Aksan/büyük-küçük farkını ve Farsça rakamları yok sayan karşılaştırma. */
function normalize(s) {
  return String(s == null ? '' : s)
    .toLocaleLowerCase('tr')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0))  // ۰۱۲ → 012
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[İIıi]/g, 'i')
    .replace(/[ĞğGg]/g, 'g')
    .replace(/[Şşs]/g, 's')
    .replace(/[Öö]/g, 'o')
    .replace(/[Üü]/g, 'u')
    .replace(/[Çç]/g, 'c')
    .replace(/\s+/g, ' ')
    .trim();
}

function matches(haystack, needle) {
  return normalize(haystack).indexOf(needle) !== -1;
}

/** Aramayı çalıştırır, gruplanmış sonuç döner. */
function runSearch(query) {
  const q = normalize(query);
  if (q.length < 2) return [];

  const groups = [];

  const products = PRODUCTS.filter((p) =>
    matches(p.name, q) || matches(p.sku, q) || matches(catLabel(p.cat), q)
  ).slice(0, SEARCH_LIMIT);
  if (products.length) groups.push({
    label: t('nav_products'),
    items: products.map((p) => ({
      icon: 'package',
      title: p.name,
      sub: p.sku + ' · ' + t('ln_stock_left', { n: num(p.stock) }),
      meta: money(p.sell),
      href: '#/urunler'
    }))
  });

  const customers = CUSTOMERS.filter((c) =>
    matches(customerName(c), q) || matches(c.phone, q) ||
    matches(c.email, q) || matches(L(c.addr), q)
  ).slice(0, SEARCH_LIMIT);
  if (customers.length) groups.push({
    label: t('nav_customers'),
    items: customers.map((c) => {
      const sum = customerSummary(c.id);
      return {
        icon: 'users',
        title: customerName(c),
        sub: c.phone,
        meta: sum.remaining > 0 ? money(sum.remaining) : '',
        metaTone: sum.isLate ? 'danger' : sum.remaining > 0 ? 'warning' : '',
        href: '#/musteri/' + c.id
      };
    })
  });

  const sales = SALES.filter((s) => {
    const c = customerById(s.customerId);
    return matches(s.no, q) || (c && matches(customerName(c), q));
  }).slice(0, SEARCH_LIMIT);
  if (sales.length) groups.push({
    label: t('nav_invoices'),
    items: sales.map((s) => {
      const x = saleTotals(s);
      const st = saleStatus(s);
      return {
        icon: 'invoice',
        title: s.no,
        sub: customerName(customerById(s.customerId)) + ' · ' + fmtDate(s.date),
        meta: money(x.total),
        badge: st,
        href: '#/musteri/' + s.customerId
      };
    })
  });

  return groups;
}

/* --------------------------------------------------------------------------
   Panel
   -------------------------------------------------------------------------- */

function searchPanel() { return document.getElementById('searchPanel'); }

function renderSearch(query) {
  const panel = searchPanel();
  const groups = runSearch(query);

  SEARCH_RESULTS = [];
  groups.forEach((g) => g.items.forEach((it) => SEARCH_RESULTS.push(it)));
  SEARCH_INDEX = -1;

  if (normalize(query).length < 2) { closeSearch(); return; }

  if (!groups.length) {
    panel.innerHTML = '<div class="search-empty">' + icon('search') +
      '<p>' + esc(t('sr_none', { q: query })) + '</p></div>';
    panel.classList.add('on');
    return;
  }

  let i = 0;
  panel.innerHTML = groups.map((g) =>
    '<div class="search-group">' +
      '<div class="search-group-label">' + esc(g.label) + '</div>' +
      g.items.map((it) =>
        '<a class="search-item" href="' + it.href + '" data-idx="' + (i++) + '">' +
          '<span class="search-icon">' + icon(it.icon) + '</span>' +
          '<span class="search-text">' +
            '<span class="search-title">' + esc(it.title) + '</span>' +
            '<span class="search-sub">' +
              /* Rozet alt satırda durur: aynı satıra konunca tutarla birlikte
                 başlığı sıfır genişliğe eziyordu. */
              (it.badge ? '<span class="badge badge-' + it.badge.tone + '">' +
                icon(it.badge.icon) + esc(it.badge.label) + '</span> ' : '') +
              esc(it.sub) +
            '</span>' +
          '</span>' +
          (it.meta ? '<span class="search-meta num' +
            (it.metaTone ? ' text-' + it.metaTone : '') + '">' + it.meta + '</span>' : '') +
        '</a>').join('') +
    '</div>').join('') +
    '<div class="search-hint">' + esc(t('sr_hint')) + '</div>';

  panel.classList.add('on');
}

function closeSearch() {
  const panel = searchPanel();
  if (panel) { panel.classList.remove('on'); panel.innerHTML = ''; }
  SEARCH_RESULTS = [];
  SEARCH_INDEX = -1;
  document.body.classList.remove('search-open');
}

function highlightSearch(delta) {
  if (!SEARCH_RESULTS.length) return;
  SEARCH_INDEX = (SEARCH_INDEX + delta + SEARCH_RESULTS.length) % SEARCH_RESULTS.length;
  const items = searchPanel().querySelectorAll('.search-item');
  items.forEach((el, k) => el.classList.toggle('on', k === SEARCH_INDEX));
  const active = items[SEARCH_INDEX];
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function openSearchResult() {
  const it = SEARCH_RESULTS[SEARCH_INDEX >= 0 ? SEARCH_INDEX : 0];
  if (!it) return;
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  closeSearch();
  location.hash = it.href.replace(/^#/, '');
}

/* --------------------------------------------------------------------------
   Bağlama
   -------------------------------------------------------------------------- */

function bindSearch() {
  const input = document.getElementById('searchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';

  input.addEventListener('input', function () { renderSearch(this.value); });
  input.addEventListener('focus', function () {
    if (this.value) renderSearch(this.value);
  });

  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); highlightSearch(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); highlightSearch(-1); }
    else if (ev.key === 'Enter') { ev.preventDefault(); openSearchResult(); }
    else if (ev.key === 'Escape') { this.value = ''; closeSearch(); this.blur(); }
  });

  /* Panel dışına tıklayınca kapanır. Aç/kapat düğmesi istisnadır: aksi hâlde
     bu dinleyici, düğmenin az önce açtığı paneli aynı tıklamada kapatır. */
  document.addEventListener('click', function (ev) {
    if (ev.target.closest('.search') || ev.target.closest('[data-act="search-toggle"]')) return;
    closeSearch();
  });

  /* sonuç tıklaması normal bağlantı gibi çalışır, panel kapanır */
  document.addEventListener('click', function (ev) {
    if (ev.target.closest('.search-item')) {
      input.value = '';
      setTimeout(closeSearch, 0);
    }
  });
}

/** Mobilde arama kutusu gizli; düğme ile açılır. */
function toggleMobileSearch() {
  const open = document.body.classList.toggle('search-open');
  const input = document.getElementById('searchInput');
  if (open && input) input.focus();
  else closeSearch();
}
