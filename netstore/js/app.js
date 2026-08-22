/* ==========================================================================
   NetStore — uygulama kabuğu, yönlendirme ve sayfalar
   Tüm metinler i18n üzerinden gelir; dil değişince sayfa yeniden çizilir.
   ========================================================================== */

const NAV = [
  { group:null, items:[ { id:'dashboard', key:'nav_dashboard', icon:'dashboard' } ] },
  { group:'grp_inventory', items:[
    { id:'urunler', key:'nav_products', icon:'package' },
    { id:'stok',    key:'nav_stock',    icon:'boxes' } ] },
  { group:'grp_operations', items:[
    { id:'satislar',   key:'nav_sales',     icon:'cart' },
    { id:'alislar',    key:'nav_purchases', icon:'truck' },
    { id:'musteriler', key:'nav_customers', icon:'users' },
    { id:'faturalar',  key:'nav_invoices',  icon:'invoice' } ] },
  { group:'grp_finance', items:[
    { id:'tahsilatlar', key:'nav_payments', icon:'wallet' },
    { id:'borc',        key:'nav_debt',     icon:'scale' },
    { id:'raporlar',    key:'nav_reports',  icon:'chart' } ] },
  { group:'grp_management', items:[
    { id:'personel', key:'nav_staff',    icon:'staff' },
    { id:'indir',    key:'nav_download', icon:'download' },
    { id:'ayarlar',  key:'nav_settings', icon:'settings' } ] }
];

const PAGE_META = {
  dashboard:  { title:'nav_dashboard', crumb:'crumb_overview' },
  urunler:    { title:'nav_products',  crumb:'grp_inventory' },
  stok:       { title:'nav_stock',     crumb:'grp_inventory' },
  satislar:   { title:'nav_sales',     crumb:'grp_operations' },
  alislar:    { title:'nav_purchases', crumb:'grp_operations' },
  musteriler: { title:'nav_customers', crumb:'grp_operations' },
  musteri:    { title:'page_customer', crumb:'nav_customers' },
  faturalar:  { title:'nav_invoices',  crumb:'grp_operations' },
  tahsilatlar:{ title:'nav_payments',  crumb:'grp_finance' },
  borc:       { title:'nav_debt',      crumb:'grp_finance' },
  raporlar:   { title:'nav_reports',   crumb:'grp_finance' },
  personel:   { title:'nav_staff',     crumb:'grp_management' },
  indir:      { title:'nav_download',  crumb:'grp_management' },
  ayarlar:    { title:'nav_settings',  crumb:'grp_management' }
};

/* --------------------------------------------------------------------------
   Görünüm yardımcıları
   -------------------------------------------------------------------------- */

function badge(tone, label, ic) {
  return '<span class="badge badge-' + tone + '">' +
    (ic ? icon(ic) : '<span class="bullet"></span>') + esc(label) + '</span>';
}
function statusBadge(st) { return badge(st.tone, st.label, st.icon); }

/**
 * Tablo üretici. İlk sütun mobilde kart başlığı olur; her hücre data-label
 * taşır, 720px altında tablo kart görünümüne döner.
 */
function table(cols, rows, opts) {
  opts = opts || {};
  if (!rows.length) {
    return '<div class="empty">' + icon('archive') + '<p>' + esc(opts.empty || t('e_no_record')) + '</p></div>';
  }
  const head = cols.map((c) =>
    '<th class="' + (c.align === 'right' ? 'right' : '') + '">' + esc(c.label) + '</th>').join('');

  const body = rows.map((r, ri) => {
    const tds = cols.map((c, ci) => {
      const cls = [];
      if (c.align === 'right') cls.push('right');
      if (ci === 0) cls.push('card-title-cell');
      if (c.key === '_actions') cls.push('actions-cell');
      return '<td class="' + cls.join(' ') + '" data-label="' + esc(c.label) + '">' + c.render(r, ri) + '</td>';
    }).join('');
    return '<tr>' + tds + '</tr>';
  }).join('');

  return '<div class="table-wrap"><table class="data as-cards' + (opts.wide ? ' wide' : '') +
         '"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
}

function statCard(o) {
  const trend = o.trend
    ? '<span class="trend ' + o.trend.tone + '">' + (o.trend.icon ? icon(o.trend.icon) : '') +
      o.trend.text + '</span>' : '';
  return '<article class="stat">' +
    '<div class="stat-top">' +
      '<span class="stat-icon ' + (o.tone || '') + '">' + icon(o.icon) + '</span>' +
      '<div style="min-width:0">' +
        '<div class="stat-label">' + esc(o.label) + '</div>' +
        '<div class="stat-value">' + o.value + '</div>' +
      '</div>' +
    '</div>' +
    (o.meter ? o.meter :
      '<div class="stat-foot">' +
        '<div style="min-width:0">' + trend + '<div class="stat-desc">' + o.desc + '</div></div>' +
        (o.spark || '') +
      '</div>') +
  '</article>';
}

/** Payda sıfırken NaN yerine 0 döner — boş veride ekranlar bozulmasın. */
function ratio(a, b) { return b > 0 ? a / b : 0; }

function meter(r, leftLabel, rightLabel, tone) {
  const p = Math.max(0, Math.min(1, isFinite(r) ? r : 0));
  return '<div class="stat-foot"><div class="meter">' +
    '<div class="meter-track"><div class="meter-fill" style="width:' + (p * 100).toFixed(1) +
      '%;background:var(--' + (tone || 'success') + ')"></div></div>' +
    '<div class="meter-legend"><span>' + leftLabel + '</span><span>' + rightLabel + '</span></div>' +
  '</div></div>';
}

function customerLink(c) {
  return '<a href="#/musteri/' + c.id + '" class="cell-main">' +
    '<span class="avatar">' + esc(initials(c)) + '</span>' +
    '<span style="min-width:0"><span class="cell-title">' + esc(customerName(c)) + '</span>' +
    '<span class="cell-sub" style="display:block">' + esc(typeLabel(c.type)) + '</span></span></a>';
}

function actionBtn(ic, title, attrs) {
  return '<button class="btn btn-ghost btn-sm btn-icon" title="' + esc(title) +
         '" aria-label="' + esc(title) + '"' + (attrs || '') + '>' + icon(ic) + '</button>';
}

/* --------------------------------------------------------------------------
   Ortak satış tablosu
   -------------------------------------------------------------------------- */
function salesTable(rows, compact) {
  if (compact) {
    return table([
      { key:'no', label:t('c_invoice'), render:(s) =>
        '<span class="invoice-no">' + esc(s.no) + '</span>' +
        '<span class="cell-sub" style="display:block;white-space:normal">' +
        esc(customerName(customerById(s.customerId))) + '</span>' },
      { key:'date', label:t('c_date'), render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
      { key:'total', label:t('c_total'), align:'right', render:(s) =>
        '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
      { key:'rem', label:t('c_remaining'), align:'right', render:(s) => {
          const x = saleTotals(s);
          return '<span class="num ' + (x.remaining > 0 ? 'text-danger' : 'text-dim') + '">' +
                 money(x.remaining) + '</span>'; } },
      { key:'st', label:t('c_status'), render:(s) => statusBadge(saleStatus(s)) }
    ], rows, { empty:t('e_no_sales') });
  }

  return table([
    { key:'no', label:t('c_invoice_no'), render:(s) =>
      '<a href="#/musteri/' + s.customerId + '"><span class="invoice-no">' + esc(s.no) + '</span>' +
      '<span class="cell-sub" style="display:block">' + esc(customerName(customerById(s.customerId))) +
      '</span></a>' },
    { key:'date', label:t('c_date'), render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
    { key:'prod', label:t('c_product'), render:(s) => {
        const first = productById(s.items[0].pid);
        return '<span style="display:block">' +
          '<span class="cell-title" style="font-weight:500">' + esc(first ? first.name : '—') + '</span>' +
          (s.items.length > 1 ? '<span class="cell-sub" style="display:block">+' +
            num(s.items.length - 1) + ' ' + esc(t('c_lines')) + '</span>' : '') + '</span>'; } },
    { key:'qty', label:t('c_qty'), align:'right', render:(s) =>
      '<span class="num">' + num(s.items.reduce((a, i) => a + i.qty, 0)) + '</span>' },
    { key:'total', label:t('c_total'), align:'right', render:(s) =>
      '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
    { key:'paid', label:t('c_paid'), align:'right', render:(s) => {
        const x = saleTotals(s);
        return '<span class="num ' + (x.paid > 0 ? 'text-success' : 'text-dim') + '">' + money(x.paid) + '</span>'; } },
    { key:'rem', label:t('c_remaining'), align:'right', render:(s) => {
        const x = saleTotals(s);
        return '<span class="num ' + (x.remaining > 0 ? 'text-danger' : 'text-dim') + '">' +
               money(x.remaining) + '</span>'; } },
    { key:'st', label:t('c_status'), render:(s) => statusBadge(saleStatus(s)) },
    { key:'_actions', label:t('c_action'), align:'right', render:(s) =>
      '<div class="actions">' +
        '<button class="btn btn-info btn-sm" data-act="doc-invoice" data-id="' + s.id + '">' +
        icon('invoice') + t('btn_invoice') + '</button></div>' }
  ], rows, { empty: SALES.length ? t('e_no_sales') : t('e_start_sales', { b:t('btn_new_sale') }), wide:true });
}

/* ==========================================================================
   Sayfalar
   ========================================================================== */

const PAGES = {};

/* --- Dashboard --- */
PAGES.dashboard = function () {
  const k = kpis();
  const s12 = monthlySeries(12);
  const investTrend = (function () {
    const out = [];
    for (let back = 11; back >= 0; back--) {
      const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - back, 1);
      const n = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      out.push(PURCHASES.filter((p) => p.date >= d && p.date < n).reduce((s, p) => s + p.total, 0));
    }
    return out;
  })();

  const saleMoM = momChange('sale');
  const profitMoM = momChange('profit');
  const openBal = openBalances();
  const lateCount = SALES.filter((s) => saleStatus(s).key === 'late').length;

  const stats = [
    statCard({
      icon:'truck', tone:'info', label:t('kpi_invest'), value:money(k.invest),
      desc:esc(t('kpi_invest_d')),
      trend:{ tone:'flat', text:esc(t('n_purchases', { n:num(PURCHASES.length) })), icon:'archive' },
      spark:sparkline(investTrend, '#3B82F6')
    }),
    statCard({
      icon:'cart', tone:'accent', label:t('kpi_sales'), value:money(k.sales),
      desc:esc(t('kpi_sales_d')),
      trend: saleMoM === null ? null : { tone: saleMoM >= 0 ? 'up' : 'down',
        text: t('this_month', { p: pct(saleMoM) }), icon: saleMoM >= 0 ? 'trendUp' : 'trendDown' },
      spark:sparkline(s12.map((m) => m.sale), SERIES_1)
    }),
    statCard({
      icon:'coins', tone:'success', label:t('kpi_profit'), value:money(k.profit),
      desc:esc(t('kpi_profit_d', { n: pctPlain(k.margin * 100, 1) })),
      trend: profitMoM === null ? null : { tone: profitMoM >= 0 ? 'up' : 'down',
        text: t('this_month', { p: pct(profitMoM) }), icon: profitMoM >= 0 ? 'trendUp' : 'trendDown' },
      spark:sparkline(s12.map((m) => m.profit), SERIES_2)
    }),
    statCard({
      icon:'boxes', label:t('kpi_stock'),
      value: num(k.stockUnits) + ' <span style="font-size:15px;color:var(--text-3);font-weight:600">' +
             esc(t('unit_pcs')) + '</span>',
      desc:esc(t('kpi_stock_d', { v: money(k.stockValue) })),
      meter: meter(1 - ratio(k.lowCount, PRODUCTS.length),
        '<span class="text-muted">' + esc(t('n_products_ok', { n:num(PRODUCTS.length - k.lowCount) })) + '</span>',
        '<span class="text-warning">' + esc(t('n_critical', { n:num(k.lowCount) })) + '</span>', 'success')
    }),
    statCard({
      icon:'alert', tone:'warning', label:t('kpi_low'), value:num(k.lowCount),
      desc:esc(t('kpi_low_d')),
      trend:{ tone:'warn', text:esc(t('n_running_out', { n:num(k.outOfRisk) })), icon:'alert' }
    }),
    statCard({
      icon:'staff', tone:'accent', label:t('kpi_staff'), value:num(k.staffCount),
      desc:esc(t('kpi_staff_d', { a:num(k.staffCount), t:num(k.staffTotal) })),
      meter: meter(ratio(k.staffCount, k.staffTotal),
        '<span class="text-muted">' + esc(t('active_n', { n:num(k.staffCount) })) + '</span>',
        '<span class="text-dim">' + esc(t('passive_n', { n:num(k.staffTotal - k.staffCount) })) + '</span>', 'accent')
    })
  ].join('');

  let alerts = '';
  if (lateCount || k.lowCount) {
    const parts = [];
    if (lateCount) parts.push(
      '<div class="alert alert-danger">' + icon('alert') +
      '<div><strong>' + esc(t('al_late_title', { n:num(lateCount) })) + '</strong>' +
      '<span class="alert-text">' +
        esc(t('al_late_text', { v: money(openBal.reduce((s, r) => s + r.sum.overdue, 0)) })) + ' ' +
        t('al_late_link', { l:'<a href="#/borc" style="color:var(--danger);text-decoration:underline">' +
          esc(t('nav_debt')) + '</a>' }) +
      '</span></div></div>');
    if (k.lowCount) parts.push(
      '<div class="alert alert-warning">' + icon('alert') +
      '<div><strong>' + esc(t('al_low_title', { n:num(k.lowCount) })) + '</strong>' +
      '<span class="alert-text">' + k.low.slice(0, 3).map((p) => esc(p.name)).join(', ') +
      (k.lowCount > 3 ? ' ' + esc(t('al_low_more', { n:num(k.lowCount - 3) })) : '') + '. ' +
      t('al_low_link', { l:'<a href="#/stok" style="color:var(--warning);text-decoration:underline">' +
        esc(t('nav_stock')) + '</a>' }) +
      '</span></div></div>');
    alerts = '<div class="grid grid-2" style="margin-bottom:16px">' + parts.join('') + '</div>';
  }

  return {
    html:
      '<div class="page-head">' +
        '<div><h2>' + esc(t('p_overview')) + '</h2>' +
        '<p class="sub">' + esc(t('p_overview_sub', { d: fmtDate(TODAY) })) + '</p></div>' +
        '<div class="head-actions">' +
          '<button class="btn btn-ghost" data-act="export">' + icon('download') + t('btn_export') + '</button>' +
          '<button class="btn btn-primary" data-act="new-sale">' + icon('plus') + t('btn_new_sale') + '</button>' +
        '</div>' +
      '</div>' + alerts +

      '<div class="grid grid-stats" style="margin-bottom:16px">' + stats + '</div>' +

      '<div class="grid grid-main" style="margin-bottom:16px">' +
        '<section class="card">' +
          '<div class="card-head">' +
            '<div><h3>' + esc(t('h_trend')) + '</h3><p class="sub">' + esc(t('h_trend_sub')) + '</p></div>' +
            '<div class="head-actions chart-legend">' +
              '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_1 + '"></span>' + esc(t('series_sales')) + '</span>' +
              '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_2 + '"></span>' + esc(t('c_profit')) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="card-body"><div id="trendChart"></div></div>' +
        '</section>' +

        '<section class="card">' +
          '<div class="card-head"><div><h3>' + esc(t('h_collection')) + '</h3>' +
          '<p class="sub">' + esc(t('h_collection_sub')) + '</p></div></div>' +
          '<div class="card-body">' +
            '<div style="font-size:26px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums">' +
              money(k.paid) + '</div>' +
            '<p class="text-dim" style="font-size:12px;margin-top:2px">' +
              esc(t('f_collected_of', { v: money(k.sales) })) + '</p>' +
            '<div class="meter" style="margin-top:16px">' +
              '<div class="meter-track" style="height:8px"><div class="meter-fill" style="width:' +
                (ratio(k.paid, k.sales) * 100).toFixed(1) + '%;background:var(--success)"></div></div>' +
              '<div class="meter-legend">' +
                '<span class="text-success">' + esc(t('f_paid_pct', { n: pctPlain(ratio(k.paid, k.sales) * 100) })) + '</span>' +
                '<span class="text-danger">' + esc(t('f_remaining_v', { v: money(k.receivable) })) + '</span>' +
              '</div>' +
            '</div>' +
            '<div style="border-top:1px solid var(--border);margin-top:18px;padding-top:16px">' +
              '<h4 style="font-size:12.5px;color:var(--text-2);margin-bottom:13px">' + esc(t('h_by_category')) + '</h4>' +
              '<div id="catBars"></div>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<div class="grid grid-main">' +
        '<section class="card">' +
          '<div class="card-head"><div><h3>' + esc(t('h_recent_sales')) + '</h3>' +
          '<p class="sub">' + esc(t('h_recent_sub')) + '</p></div>' +
          '<div class="head-actions"><a class="btn btn-ghost btn-sm" href="#/satislar">' +
            esc(t('btn_all')) + icon('chevronRight') + '</a></div></div>' +
          '<div class="card-body flush">' + salesTable(SALES.slice(0, 6), true) + '</div>' +
        '</section>' +

        '<section class="card">' +
          '<div class="card-head"><div><h3>' + esc(t('h_recent_pay')) + '</h3>' +
          '<p class="sub">' + esc(t('h_recent_pay_sub')) + '</p></div></div>' +
          '<div class="card-body flush"><div class="timeline">' +
            PAYMENTS.slice(0, 6).map((p) => {
              const c = customerById(p.customerId), s = saleById(p.saleId);
              return '<div class="tl-item">' +
                '<div class="tl-rail"><span class="tl-dot success">' + icon('handCoins') + '</span></div>' +
                '<div class="tl-body"><div class="tl-row">' +
                  '<span class="tl-title">' + esc(customerName(c)) + '</span>' +
                  '<span class="tl-amount text-success">' + signedMoney(p.amount) + '</span>' +
                '</div><p class="tl-meta">' + fmtDate(p.date) + ' · ' + esc(methodLabel(p.method)) +
                (s ? ' · ' + esc(s.no) : '') + '</p></div></div>';
            }).join('') +
          '</div></div>' +
        '</section>' +
      '</div>',

    mount: function () {
      lineChart(document.getElementById('trendChart'), {
        data: s12,
        series: [{ key:'sale', name:t('series_sales'), color:SERIES_1 },
                 { key:'profit', name:t('c_profit'), color:SERIES_2 }],
        aria: t('h_trend')
      });
      hBars(document.getElementById('catBars'),
        categoryTotals().slice(0, 5).map((r) => ({ name: catLabel(r.key), value: r.value })));
    }
  };
};

/* --- Satışlar --- */
PAGES.satislar = function () {
  const filter = STATE.filter || 'all';
  const rows = SALES.filter((s) => filter === 'all' || saleStatus(s).key === filter);
  const counts = { all: SALES.length };
  ['paid','partial','pending','late'].forEach((k) => {
    counts[k] = SALES.filter((s) => saleStatus(s).key === k).length;
  });
  const tot = rows.reduce((a, s) => {
    const x = saleTotals(s); a.total += x.total; a.paid += x.paid; a.rem += x.remaining; return a;
  }, { total:0, paid:0, rem:0 });

  const segs = [['all', t('btn_all')], ['paid', t('st_paid')], ['partial', t('st_partial')],
                ['pending', t('st_pending')], ['late', t('st_late')]];

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_sales')) + '</h2>' +
      '<p class="sub">' + esc(t('p_sales_sub', { n:num(rows.length), v:money(tot.total) })) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + t('btn_export') + '</button>' +
        '<button class="btn btn-primary" data-act="new-sale">' + icon('plus') + t('btn_new_sale') + '</button>' +
      '</div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'cart', tone:'accent', label:t('k_sel_revenue'), value:money(tot.total),
                   desc:esc(t('k_n_invoices', { n:num(rows.length) })) }) +
        statCard({ icon:'handCoins', tone:'success', label:t('k_collected'), value:money(tot.paid),
                   desc:esc(t('k_collected_d')) }) +
        statCard({ icon:'scale', tone:'danger', label:t('k_open_balance'), value:money(tot.rem),
                   desc:esc(t('k_not_collected')) }) +
      '</div>' +

      '<div class="toolbar"><div class="seg" data-seg="filter">' +
        segs.map(([k, l]) => '<button data-val="' + k + '"' + (filter === k ? ' class="on"' : '') + '>' +
             esc(l) + ' <span class="num">(' + num(counts[k]) + ')</span></button>').join('') +
      '</div></div>' +

      '<section class="card"><div class="card-body flush">' + salesTable(rows) + '</div></section>'
  };
};

/* --- Faturalar --- */
PAGES.faturalar = function () {
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_invoices')) + '</h2>' +
      '<p class="sub">' + esc(t('p_invoices_sub', { n:num(SALES.length) })) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-primary" data-act="new-invoice">' + icon('plus') + t('btn_new_invoice') + '</button>' +
      '</div></div>' +
      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'no', label:t('c_invoice_no'), render:(s) => '<span class="invoice-no">' + esc(s.no) + '</span>' },
        { key:'cust', label:t('c_customer'), render:(s) =>
          '<a href="#/musteri/' + s.customerId + '" class="cell-title">' +
          esc(customerName(customerById(s.customerId))) + '</a>' },
        { key:'date', label:t('c_date'), render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
        { key:'due', label:t('c_due'), render:(s) => {
            const x = saleTotals(s), tone = dueTone(s.due, x.remaining);
            return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') +
                   '">' + fmtDate(s.due) + '</span>'; } },
        { key:'total', label:t('c_amount'), align:'right', render:(s) =>
          '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
        { key:'st', label:t('c_status'), render:(s) => statusBadge(saleStatus(s)) },
        { key:'_actions', label:t('c_action'), align:'right', render:(s) =>
          '<div class="actions">' +
            '<button class="btn btn-info btn-sm" data-act="doc-invoice" data-id="' + s.id + '">' +
            icon('invoice') + t('btn_invoice') + '</button>' +
            actionBtn('printer', t('btn_print'), ' data-act="doc-invoice" data-id="' + s.id + '"') +
          '</div>' }
      ], SALES, { wide:true, empty:t('e_start_sales', { b:t('btn_new_invoice') }) }) + '</div></section>'
  };
};

/* --- Ürünler --- */
PAGES.urunler = function () {
  const totalValue = PRODUCTS.reduce((s, p) => s + p.stock * p.buy, 0);
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_products')) + '</h2>' +
      '<p class="sub">' + esc(t('p_products_sub', { n:num(PRODUCTS.length), v:money(totalValue) })) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + t('btn_export') + '</button>' +
        '<button class="btn btn-primary" data-act="new-product">' + icon('plus') + t('btn_new_product') + '</button>' +
      '</div></div>' +
      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:t('c_product'), render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
          '<span><span class="cell-title">' + esc(p.name) + '</span>' +
          '<span class="cell-sub">' + esc(p.sku) + ' · ' + esc(supplierName(p.sup)) + '</span></span></span>' },
        { key:'cat', label:t('c_category'), render:(p) => badge('muted', catLabel(p.cat)) },
        { key:'buy', label:t('c_buy'), align:'right', render:(p) => '<span class="num">' + money(p.buy) + '</span>' },
        { key:'sell', label:t('c_sell'), align:'right', render:(p) => '<span class="num strong">' + money(p.sell) + '</span>' },
        { key:'margin', label:t('c_margin'), align:'right', render:(p) =>
          '<span class="num text-success">' + pctPlain(ratio(p.sell - p.buy, p.sell) * 100) + (lang() === 'fa' ? '٪' : '%') + '</span>' },
        { key:'stock', label:t('c_stock'), align:'right', render:(p) =>
          '<span class="num ' + (p.stock <= p.min ? 'text-warning strong' : '') + '">' + num(p.stock) + '</span>' },
        { key:'_actions', label:t('c_action'), align:'right', render:(p) =>
          '<div class="actions">' +
            actionBtn('edit', t('btn_edit'), ' data-act="edit-product" data-id="' + p.id + '"') +
            actionBtn('trash', t('btn_delete'), ' data-act="delete-product" data-id="' + p.id + '"') +
          '</div>' }
      ], PRODUCTS, { wide:true, empty:t('e_start_products', { b:t('btn_new_product') }) }) + '</div></section>'
  };
};

/* --- Stok --- */
PAGES.stok = function () {
  const k = kpis();
  const sorted = PRODUCTS.slice().sort((a, b) => (a.stock / a.min) - (b.stock / b.min));
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('p_stock')) + '</h2>' +
      '<p class="sub">' + esc(t('p_stock_sub', { n:num(k.stockUnits), v:money(k.stockValue) })) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="stock-in">' +
      icon('plus') + t('btn_stock_in') + '</button></div></div>' +

      (k.lowCount ? '<div class="alert alert-warning" style="margin-bottom:16px">' + icon('alert') +
        '<div><strong>' + esc(t('al_low_stock', { n:num(k.lowCount) })) + '</strong>' +
        '<span class="alert-text">' + esc(t('al_low_stock_t')) + '</span></div></div>' : '') +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'boxes', label:t('k_total_pcs'), value:num(k.stockUnits), desc:esc(t('k_total_pcs_d')) }) +
        statCard({ icon:'euro', tone:'info', label:t('k_wh_value'), value:money(k.stockValue), desc:esc(t('k_wh_value_d')) }) +
        statCard({ icon:'alert', tone:'warning', label:t('k_critical'), value:num(k.lowCount), desc:esc(t('k_critical_d')) }) +
      '</div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:t('c_product'), render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
          '<span><span class="cell-title">' + esc(p.name) + '</span>' +
          '<span class="cell-sub">' + esc(p.sku) + ' · ' + esc(supplierName(p.sup)) + '</span></span></span>' },
        { key:'stock', label:t('c_current'), align:'right', render:(p) => {
            const ratio = Math.min(1, p.stock / (p.min * 2.5));
            const col = p.stock <= p.min ? 'var(--danger)' : p.stock <= p.min * 1.6 ? 'var(--warning)' : 'var(--success)';
            return '<span class="num strong">' + num(p.stock) + '</span>' +
                   '<span class="stock-bar"><span style="width:' + (ratio * 100).toFixed(0) +
                   '%;background:' + col + '"></span></span>'; } },
        { key:'min', label:t('c_min'), align:'right', render:(p) => '<span class="num text-dim">' + num(p.min) + '</span>' },
        { key:'value', label:t('c_value'), align:'right', render:(p) => '<span class="num">' + money(p.stock * p.buy) + '</span>' },
        { key:'st', label:t('c_status'), render:(p) =>
          p.stock <= p.min ? badge('danger', t('b_critical'), 'alert')
          : p.stock <= p.min * 1.6 ? badge('warning', t('b_running_low'), 'clock')
          : badge('success', t('b_sufficient'), 'check') },
        { key:'_actions', label:t('c_action'), align:'right', render:(p) =>
          '<div class="actions"><button class="btn btn-ghost btn-sm" data-act="stock-in" data-id="' + p.id + '">' +
          icon('plus') + t('btn_entry') + '</button></div>' }
      ], sorted, { wide:true }) + '</div></section>'
  };
};

/* --- Alışlar --- */
PAGES.alislar = function () {
  const total = PURCHASES.reduce((s, p) => s + p.total, 0);
  const paid = PURCHASES.reduce((s, p) => s + p.paid, 0);
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_purchases')) + '</h2>' +
      '<p class="sub">' + esc(t('p_purchases_sub', { n:num(PURCHASES.length), v:money(total) })) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-purchase">' +
      icon('plus') + t('btn_new_purchase') + '</button></div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'truck', tone:'info', label:t('kpi_invest'), value:money(total), desc:esc(t('kpi_invest_d')) }) +
        statCard({ icon:'check', tone:'success', label:t('k_paid_sup'), value:money(paid), desc:esc(t('k_paid_sup_d')) }) +
        statCard({ icon:'scale', tone:'danger', label:t('k_sup_debt'), value:money(total - paid), desc:esc(t('k_sup_debt_d')) }) +
      '</div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'no', label:t('c_purchase_no'), render:(p) => '<span class="invoice-no">' + esc(p.no) + '</span>' },
        { key:'sup', label:t('c_supplier'), render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('building') + '</span>' +
          '<span class="cell-title">' + esc(supplierName(p.supplier)) + '</span></span>' },
        { key:'date', label:t('c_date'), render:(p) => '<span class="num">' + fmtDate(p.date) + '</span>' },
        { key:'lines', label:t('c_lines'), align:'right', render:(p) => '<span class="num">' + num(p.items.length) + '</span>' },
        { key:'total', label:t('c_amount'), align:'right', render:(p) => '<span class="num strong">' + money(p.total) + '</span>' },
        { key:'st', label:t('c_status'), render:(p) => p.paid >= p.total
          ? badge('success', t('b_settled'), 'check') : badge('warning', t('st_partial'), 'clock') }
      ], PURCHASES, { wide:true, empty:t('e_start_purchases', { b:t('btn_new_purchase') }) }) + '</div></section>'
  };
};

/* --- Müşteriler --- */
PAGES.musteriler = function () {
  const rows = CUSTOMERS.map((c) => ({ c:c, s:customerSummary(c.id) }))
                        .sort((a, b) => b.s.remaining - a.s.remaining || b.s.total - a.s.total);
  const totalRem = rows.reduce((s, r) => s + r.s.remaining, 0);

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_customers')) + '</h2>' +
      '<p class="sub">' + esc(t('p_customers_sub', { n:num(rows.length), v:money(totalRem) })) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-customer">' +
      icon('plus') + t('btn_new_customer') + '</button></div></div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:t('c_customer'), render:(r) => customerLink(r.c) },
        { key:'phone', label:t('c_phone'), render:(r) => ltr(r.c.phone) },
        { key:'total', label:t('c_total_sales'), align:'right', render:(r) => '<span class="num strong">' + money(r.s.total) + '</span>' },
        { key:'paid', label:t('c_paid'), align:'right', render:(r) =>
          '<span class="num ' + (r.s.paid > 0 ? 'text-success' : 'text-dim') + '">' + money(r.s.paid) + '</span>' },
        { key:'rem', label:t('c_debt'), align:'right', render:(r) =>
          '<span class="num ' + (r.s.remaining > 0 ? 'text-danger strong' : 'text-dim') + '">' + money(r.s.remaining) + '</span>' },
        { key:'due', label:t('c_due'), render:(r) => {
            if (!r.s.dueDate) return '<span class="text-dim">—</span>';
            const tone = dueTone(r.s.dueDate, r.s.remaining);
            return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') +
                   '">' + fmtDate(r.s.dueDate) + '</span>'; } },
        { key:'st', label:t('c_status'), render:(r) =>
          r.s.remaining <= 0 ? badge('success', t('b_no_debt'), 'check')
          : r.s.isLate ? badge('danger', t('st_late'), 'alert')
          : badge('warning', t('b_open_balance'), 'clock') },
        { key:'_actions', label:t('c_action'), align:'right', render:(r) =>
          '<div class="actions"><a class="btn btn-ghost btn-sm" href="#/musteri/' + r.c.id + '">' +
          icon('eye') + t('btn_detail') + '</a></div>' }
      ], rows, { wide:true, empty:t('e_start_customers', { b:t('btn_new_customer') }) }) + '</div></section>'
  };
};

/* --- Müşteri detayı --- */
PAGES.musteri = function (id) {
  const c = customerById(id);
  if (!c) return { html:'<div class="empty">' + icon('users') + '<p>' + esc(t('e_no_customer')) + '</p></div>' };

  const s = customerSummary(id);
  const ledger = customerLedger(id);
  const dTone = dueTone(s.dueDate, s.remaining);
  const dueText = s.dueDate ? fmtDate(s.dueDate) : '—';
  const dueNote = !s.dueDate ? t('f_no_due')
    : s.daysToDue < 0 ? t('f_days_late', { n:num(Math.abs(s.daysToDue)) })
    : s.daysToDue === 0 ? t('f_today_last')
    : t('f_days_left', { n:num(s.daysToDue) });

  const msg = t('msg_balance', { name: customerName(c), v: money(s.remaining), d: dueText });
  const waLink = 'https://wa.me/' + c.phone.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(msg);
  const mailLink = 'mailto:' + c.email + '?subject=' + encodeURIComponent(t('msg_subject')) +
                   '&body=' + encodeURIComponent(msg);

  return {
    html:
      '<div class="page-head">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<a class="btn btn-ghost btn-sm btn-icon nav-back" href="#/musteriler" aria-label="' + esc(t('aria_back')) + '">' +
            icon('arrowLeft') + '</a>' +
          '<div><h2>' + esc(customerName(c)) + '</h2>' +
          '<p class="sub">' + esc(t('p_customer_sub', { type: typeLabel(c.type), n: num(s.sales.length),
            d: fmtDate(new Date(c.since)) })) + '</p></div>' +
        '</div>' +
        '<div class="head-actions">' +
          '<button class="btn btn-ghost" data-act="edit-customer" data-id="' + c.id + '">' + icon('edit') + t('btn_edit') + '</button>' +
          '<button class="btn btn-success" data-act="add-payment" data-id="' + c.id + '">' +
            icon('handCoins') + t('btn_add_payment') + '</button>' +
        '</div>' +
      '</div>' +

      (s.isLate ? '<div class="alert alert-danger" style="margin-bottom:16px">' + icon('alert') +
        '<div><strong>' + esc(t('al_overdue_bal', { v: money(s.overdue) })) + '</strong>' +
        '<span class="alert-text">' + esc(t('al_overdue_txt')) + '</span></div></div>' : '') +

      '<div class="grid grid-detail">' +

        '<div class="grid" style="gap:16px">' +
          '<section class="card">' +
            '<div class="profile-card">' +
              '<div class="profile-avatar">' + esc(initials(c)) + '</div>' +
              '<div class="profile-name">' + esc(customerName(c)) + '</div>' +
              '<div class="profile-tag">' + esc(c.id.toUpperCase()) + ' · ' + esc(typeLabel(c.type)) + '</div>' +
              '<div class="profile-badges">' +
                (s.remaining > 0
                  ? (s.isLate ? badge('danger', t('b_late_debt'), 'alert') : badge('warning', t('b_open_balance'), 'clock'))
                  : badge('success', t('b_no_debt'), 'check')) +
                badge('muted', t('b_n_invoices', { n:num(s.sales.length) })) +
              '</div>' +
            '</div>' +
            '<div class="info-list">' +
              infoRow('phone', t('f_phone'), ltr(c.phone)) +
              infoRow('mail', t('f_email'), '<a href="mailto:' + esc(c.email) + '" style="color:var(--info)">' + esc(c.email) + '</a>') +
              infoRow('mapPin', t('f_address'), esc(L(c.addr))) +
              infoRow('calendar', t('f_since'), fmtDate(new Date(c.since))) +
            '</div>' +
          '</section>' +

          '<section class="card"><div class="card-head"><h3>' + esc(t('h_quick')) + '</h3></div>' +
            '<div class="card-body"><div class="action-row">' +
              '<button class="btn btn-success" data-act="add-payment" data-id="' + c.id + '">' +
                icon('handCoins') + t('btn_add_payment') + '</button>' +
              '<button class="btn btn-primary" data-act="new-sale" data-id="' + c.id + '">' +
                icon('plus') + t('btn_new_sale') + '</button>' +
              (s.sales.length ? '<button class="btn btn-info" data-act="doc-invoice" data-id="' + s.sales[0].id + '">' +
                icon('invoice') + t('btn_invoice') + '</button>' : '') +
              '<a class="btn btn-whatsapp" href="' + waLink + '" target="_blank" rel="noopener">' +
                icon('whatsapp') + t('btn_whatsapp') + '</a>' +
              '<a class="btn btn-primary" href="' + mailLink + '">' + icon('mail') + t('btn_email') + '</a>' +
              '<button class="btn btn-ghost" data-act="print">' + icon('printer') + t('btn_statement') + '</button>' +
              '<button class="btn btn-danger" data-act="delete-customer" data-id="' + c.id + '">' + icon('trash') + t('btn_delete_cust') + '</button>' +
            '</div></div>' +
          '</section>' +
        '</div>' +

        '<div class="grid" style="gap:16px">' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>' + esc(t('h_balance')) + '</h3>' +
            '<p class="sub">' + esc(t('h_balance_sub')) + '</p></div></div>' +
            '<div class="card-body">' +
              '<div class="balance-grid">' +
                balanceCell(t('f_total_sales'), money(s.total), 'var(--text)', t('b_n_invoices', { n:num(s.sales.length) })) +
                balanceCell(t('f_total_paid'), money(s.paid), 'var(--success)',
                  t('f_n_payments', { n:num(s.pays.length), p: pctPlain(isFinite(s.ratio) ? s.ratio * 100 : 0) })) +
                balanceCell(t('f_remaining'), money(s.remaining),
                  s.remaining > 0 ? 'var(--danger)' : 'var(--text-3)',
                  s.remaining > 0 ? t('f_awaiting') : t('f_closed')) +
                balanceCell(t('f_due_date'), dueText,
                  dTone === 'danger' ? 'var(--danger)' : dTone === 'warning' ? 'var(--warning)' : 'var(--text-3)',
                  dueNote) +
              '</div>' +
              '<div class="meter" style="margin-top:18px">' +
                '<div class="meter-track" style="height:8px"><div class="meter-fill" style="width:' +
                  (isFinite(s.ratio) ? s.ratio * 100 : 0).toFixed(1) + '%;background:var(--success)"></div></div>' +
                '<div class="meter-legend">' +
                  '<span class="text-success">' + esc(t('f_paid_v', { v: money(s.paid) })) + '</span>' +
                  '<span class="' + (s.remaining > 0 ? 'text-danger' : 'text-dim') + '">' +
                    esc(t('f_remaining_v', { v: money(s.remaining) })) + '</span>' +
                '</div>' +
              '</div>' +
              (s.lastPayment ? '<p class="text-dim" style="font-size:12px;margin-top:14px">' +
                esc(t('f_last_payment', { d: fmtDate(s.lastPayment.date), v: money(s.lastPayment.amount),
                  m: methodLabel(s.lastPayment.method) })) + '</p>' : '') +
            '</div>' +
          '</section>' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>' + esc(t('h_ledger')) + '</h3>' +
            '<p class="sub">' + esc(t('h_ledger_sub')) + '</p></div>' +
            '<div class="head-actions"><button class="btn btn-success btn-sm" data-act="add-payment" data-id="' + c.id + '">' +
            icon('plus') + t('btn_payment') + '</button></div></div>' +
            '<div class="card-body flush"><div class="timeline">' +
              (ledger.length ? ledger.map((r) => {
                const isPay = r.kind === 'payment';
                return '<div class="tl-item">' +
                  '<div class="tl-rail"><span class="tl-dot ' + (isPay ? 'success' : 'accent') + '">' +
                    icon(isPay ? 'handCoins' : 'receipt') + '</span></div>' +
                  '<div class="tl-body"><div class="tl-row">' +
                    '<span class="tl-title">' + esc(r.title) + '</span>' +
                    '<span class="tl-amount ' + (isPay ? 'text-success' : 'text-muted') + '">' +
                      (isPay ? signedMoney(r.amount) : money(r.amount)) + '</span>' +
                  '</div><p class="tl-meta">' + fmtDate(r.date) + ' · ' + esc(r.note) + '</p></div></div>';
              }).join('') : '<div class="empty">' + icon('wallet') + '<p>' + esc(t('e_no_moves')) + '</p></div>') +
            '</div></div>' +
          '</section>' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>' + esc(t('h_sale_history')) + '</h3>' +
            '<p class="sub">' + esc(t('b_n_invoices', { n:num(s.sales.length) })) + '</p></div></div>' +
            '<div class="card-body flush">' + salesTable(s.sales, true) + '</div>' +
          '</section>' +

        '</div>' +
      '</div>'
  };
};

function infoRow(ic, label, value) {
  return '<div class="info-row">' + icon(ic) +
    '<div style="min-width:0"><div class="info-label">' + esc(label) + '</div>' +
    '<div class="info-value">' + value + '</div></div></div>';
}
function balanceCell(label, value, color, note) {
  return '<div class="balance-cell"><div class="balance-label">' + esc(label) + '</div>' +
    '<div class="balance-value" style="color:' + color + '">' + value + '</div>' +
    '<div class="balance-note">' + esc(note) + '</div></div>';
}

/* --- Tahsilatlar --- */
PAGES.tahsilatlar = function () {
  const total = PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const thisMonth = PAYMENTS.filter((p) =>
    p.date.getMonth() === TODAY.getMonth() && p.date.getFullYear() === TODAY.getFullYear());
  const byMethod = {};
  PAYMENTS.forEach((p) => { byMethod[p.method] = (byMethod[p.method] || 0) + p.amount; });

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_payments')) + '</h2>' +
      '<p class="sub">' + esc(t('p_payments_sub', { n:num(PAYMENTS.length), v:money(total) })) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-success" data-act="add-payment">' +
      icon('handCoins') + t('btn_add_payment') + '</button></div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'handCoins', tone:'success', label:t('k_total_pay'), value:money(total), desc:esc(t('k_all_time')) }) +
        statCard({ icon:'calendar', tone:'accent', label:t('k_this_month'),
                   value:money(thisMonth.reduce((s, p) => s + p.amount, 0)),
                   desc:esc(t('k_n_moves', { n:num(thisMonth.length) })) }) +
        statCard({ icon:'scale', tone:'danger', label:t('k_pending_rec'), value:money(kpis().receivable),
                   desc:esc(t('k_not_collected')) }) +
      '</div>' +

      '<div class="grid grid-main">' +
        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_pay_moves')) + '</h3>' +
        '<p class="sub">' + esc(t('h_pay_moves_sub')) + '</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'cust', label:t('c_customer'), render:(p) => customerLink(customerById(p.customerId)) },
          { key:'date', label:t('c_date'), render:(p) => '<span class="num">' + fmtDate(p.date) + '</span>' },
          { key:'inv', label:t('c_invoice'), render:(p) => {
              const s = saleById(p.saleId);
              return '<span class="invoice-no" style="font-weight:500">' + esc(s ? s.no : '—') + '</span>'; } },
          { key:'method', label:t('c_method'), render:(p) => badge('muted', methodLabel(p.method)) },
          { key:'amount', label:t('c_amount'), align:'right', render:(p) =>
            '<span class="num text-success strong">' + signedMoney(p.amount) + '</span>' },
          { key:'_actions', label:t('c_action'), align:'right', render:(p) =>
            '<div class="actions"><button class="btn btn-ghost btn-sm" data-act="doc-receipt" data-id="' + p.id + '">' +
            icon('receipt') + t('inv_receipt') + '</button></div>' }
        ], PAYMENTS.slice(0, 40), { wide:true }) + '</div></section>' +

        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_pay_method')) + '</h3>' +
        '<p class="sub">' + esc(t('h_pay_method_sub')) + '</p></div></div>' +
        '<div class="card-body"><div id="methodBars"></div></div></section>' +
      '</div>',

    mount: function () {
      hBars(document.getElementById('methodBars'),
        Object.keys(byMethod).map((k) => ({ name: methodLabel(k), value: byMethod[k] }))
              .sort((a, b) => b.value - a.value));
    }
  };
};

/* --- Borç / Alacak --- */
PAGES.borc = function () {
  const rows = openBalances();
  const aging = agingBuckets();
  const totalRem = rows.reduce((s, r) => s + r.sum.remaining, 0);
  const overdue = rows.reduce((s, r) => s + r.sum.overdue, 0);
  const purchaseDebt = PURCHASES.reduce((s, p) => s + (p.total - p.paid), 0);

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_debt')) + '</h2>' +
      '<p class="sub">' + esc(t('p_debt_sub', { n:num(rows.length) })) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + t('btn_report') + '</button>' +
        '<button class="btn btn-success" data-act="add-payment">' + icon('handCoins') + t('btn_add_payment') + '</button>' +
      '</div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'scale', tone:'danger', label:t('k_total_rec'), value:money(totalRem), desc:esc(t('k_total_rec_d')) }) +
        statCard({ icon:'alert', tone:'warning', label:t('k_overdue_rec'), value:money(overdue),
                   desc:esc(t('k_overdue_rec_d')),
                   trend:{ tone:'warn', text:esc(t('k_share', { n: pctPlain(ratio(overdue, totalRem) * 100) })), icon:'alert' } }) +
        statCard({ icon:'truck', tone:'info', label:t('k_sup_debt'), value:money(purchaseDebt), desc:esc(t('k_biz_debt_d')) }) +
      '</div>' +

      '<section class="card" style="margin-bottom:16px">' +
        '<div class="card-head"><div><h3>' + esc(t('h_aging')) + '</h3>' +
        '<p class="sub">' + esc(t('h_aging_sub')) + '</p></div></div>' +
        '<div class="card-body"><div id="agingBar"></div></div></section>' +

      '<div class="grid">' +
        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_balances')) + '</h3>' +
        '<p class="sub">' + esc(t('h_balances_sub')) + '</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'cust', label:t('c_customer'), render:(r) => customerLink(r.customer) },
          { key:'total', label:t('c_total_sales'), align:'right', render:(r) => '<span class="num">' + money(r.sum.total) + '</span>' },
          { key:'paid', label:t('c_paid'), align:'right', render:(r) => '<span class="num text-success">' + money(r.sum.paid) + '</span>' },
          { key:'rem', label:t('c_debt'), align:'right', render:(r) => '<span class="num text-danger strong">' + money(r.sum.remaining) + '</span>' },
          { key:'due', label:t('c_last_due'), render:(r) => {
              const tone = dueTone(r.sum.dueDate, r.sum.remaining);
              return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') +
                     '">' + (r.sum.dueDate ? fmtDate(r.sum.dueDate) : '—') + '</span>'; } },
          { key:'st', label:t('c_status'), render:(r) => r.sum.isLate
              ? badge('danger', t('b_days_late', { n:num(Math.abs(r.sum.daysToDue)) }), 'alert')
              : r.sum.daysToDue <= 7 ? badge('warning', t('b_due_soon'), 'clock')
              : badge('muted', t('b_on_due'), 'clock') },
          { key:'_actions', label:t('c_action'), align:'right', render:(r) =>
            '<div class="actions"><button class="btn btn-success btn-sm" data-act="add-payment" data-id="' +
            r.customer.id + '">' + icon('handCoins') + t('btn_payment') + '</button></div>' }
        ], rows, { empty:t('e_no_open_bal'), wide:true }) + '</div></section>' +
      '</div>',

    mount: function () {
      stackedBar(document.getElementById('agingBar'), [
        { name:t('ag_current'), value:aging.current, color:'#475569' },
        { name:t('ag_30'),      value:aging.d30,     color:'#F59E0B' },
        { name:t('ag_60'),      value:aging.d60,     color:'#EA580C' },
        { name:t('ag_90'),      value:aging.d90,     color:'#EF4444' }
      ]);
    }
  };
};

/* --- Raporlar --- */
PAGES.raporlar = function () {
  const k = kpis();
  const s12 = monthlySeries(12);

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_reports')) + '</h2>' +
      '<p class="sub">' + esc(t('p_reports_sub')) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="print">' + icon('printer') + t('btn_print') + '</button>' +
        '<button class="btn btn-primary" data-act="export">' + icon('download') + t('btn_export') + '</button>' +
      '</div></div>' +

      '<div class="grid grid-stats" style="margin-bottom:16px">' +
        statCard({ icon:'cart', tone:'accent', label:t('k_revenue'), value:money(k.sales),
                   desc:esc(t('k_revenue_d')), spark:sparkline(s12.map((m) => m.sale), SERIES_1) }) +
        statCard({ icon:'coins', tone:'success', label:t('k_gross_profit'), value:money(k.profit),
                   desc:esc(t('k_avg_margin', { n: pctPlain(k.margin * 100, 1) })),
                   spark:sparkline(s12.map((m) => m.profit), SERIES_2) }) +
        statCard({ icon:'truck', tone:'info', label:t('k_investment'), value:money(k.invest), desc:esc(t('k_investment_d')) }) +
      '</div>' +

      '<div class="grid grid-main" style="margin-bottom:16px">' +
        '<section class="card">' +
          '<div class="card-head"><div><h3>' + esc(t('h_monthly')) + '</h3><p class="sub">' + esc(t('h_last12')) + '</p></div>' +
          '<div class="head-actions chart-legend">' +
            '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_1 + '"></span>' + esc(t('series_sales')) + '</span>' +
            '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_2 + '"></span>' + esc(t('c_profit')) + '</span>' +
          '</div></div>' +
          '<div class="card-body"><div id="repChart"></div></div>' +
        '</section>' +
        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_category_rev')) + '</h3>' +
        '<p class="sub">' + esc(t('h_all_time')) + '</p></div></div>' +
        '<div class="card-body"><div id="repCat"></div></div></section>' +
      '</div>' +

      '<div class="grid grid-2">' +
        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_top_products')) + '</h3>' +
        '<p class="sub">' + esc(t('h_top_sub')) + '</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'p', label:t('c_product'), render:(r) => {
              const p = productById(r.pid);
              return '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
                '<span><span class="cell-title">' + esc(p ? p.name : '—') + '</span>' +
                '<span class="cell-sub">' + esc(p ? catLabel(p.cat) : '') + '</span></span></span>'; } },
          { key:'qty', label:t('c_qty'), align:'right', render:(r) => '<span class="num">' + num(r.qty) + '</span>' },
          { key:'rev', label:t('c_revenue'), align:'right', render:(r) => '<span class="num strong">' + money(r.revenue) + '</span>' }
        ], topProducts(6)) + '</div></section>' +

        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_monthly_break')) + '</h3>' +
        '<p class="sub">' + esc(t('h_monthly_b_sub')) + '</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'m', label:t('c_month'), render:(m) =>
            '<span class="cell-title">' + esc(monthShort(m.ref) + ' ' + calYear(m.ref)) + '</span>' },
          { key:'s', label:t('series_sales'), align:'right', render:(m) => '<span class="num">' + money(m.sale) + '</span>' },
          { key:'p', label:t('c_profit'), align:'right', render:(m) => '<span class="num text-success">' + money(m.profit) + '</span>' },
          { key:'mg', label:t('c_margin'), align:'right', render:(m) =>
            '<span class="num text-dim">' + (m.sale ? pctPlain(ratio(m.profit, m.sale) * 100) + (lang() === 'fa' ? '٪' : '%') : '—') + '</span>' }
        ], s12.slice().reverse()) + '</div></section>' +
      '</div>',

    mount: function () {
      lineChart(document.getElementById('repChart'), {
        data: s12,
        series: [{ key:'sale', name:t('series_sales'), color:SERIES_1 },
                 { key:'profit', name:t('c_profit'), color:SERIES_2 }]
      });
      hBars(document.getElementById('repCat'),
        categoryTotals().map((r) => ({ name: catLabel(r.key), value: r.value })));
    }
  };
};

/* --- Personel --- */
PAGES.personel = function () {
  const k = kpis();
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_staff')) + '</h2>' +
      '<p class="sub">' + esc(t('p_staff_sub', { a:num(k.staffCount), t:num(k.staffTotal) })) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-staff">' +
      icon('plus') + t('btn_new_staff') + '</button></div></div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:t('c_staff'), render:(r) => {
            const s = staffById(r.staffId);
            return '<span class="cell-main"><span class="avatar">' + esc(staffInitials(s)) + '</span>' +
              '<span><span class="cell-title">' + esc(staffName(s)) + '</span>' +
              '<span class="cell-sub">' + esc(roleLabel(s.role)) + '</span></span></span>'; } },
        { key:'phone', label:t('c_phone'), render:(r) => ltr(staffById(r.staffId).phone) },
        { key:'start', label:t('c_start'), render:(r) => '<span class="num">' + fmtDate(new Date(staffById(r.staffId).start)) + '</span>' },
        { key:'count', label:t('c_sale_count'), align:'right', render:(r) => '<span class="num">' + num(r.count) + '</span>' },
        { key:'rev', label:t('c_revenue'), align:'right', render:(r) => '<span class="num strong">' + money(r.revenue) + '</span>' },
        { key:'st', label:t('c_status'), render:(r) => staffById(r.staffId).active
            ? badge('success', t('b_active'), 'check') : badge('muted', t('b_passive')) },
        { key:'_actions', label:t('c_action'), align:'right', render:(r) =>
          '<div class="actions">' +
          actionBtn('edit', t('btn_edit'), ' data-act="edit-staff" data-id="' + r.staffId + '"') +
          '</div>' }
      ], staffPerformance(), { wide:true, empty:t('e_start_staff', { b:t('btn_new_staff') }) }) + '</div></section>'
  };
};

/* --- Ayarlar --- */
/* ==========================================================================
   İndir — kurulum yolları

   İki ayrı yol var ve ikisi de aynı uygulamayı verir:

   • Android — GitHub Releases'taki .apk dosyası. Bağlantı her zaman en son
     sürümü gösterir; ilk sürüm yayınlanana kadar 404 döner, sayfa bunu
     açıkça yazıyor.
   • Bilgisayar — kurulum dosyası yok, gerek de yok: Chrome/Edge uygulamayı
     kendi penceresinde masaüstüne kurar. Düğme, pwa.js'in yakaladığı
     kurulum olayını çalıştırır. Bu yol tarayıcının kendi motorunu
     kullandığı için Google girişi de sorunsuz çalışır.
   ========================================================================== */

const RELEASE_BASE = 'https://github.com/Ferhat-Yasinoglu/acik-defter/releases/latest/download/';
const ANDROID_FILE = 'NetStore.apk';

PAGES.indir = function () {
  const st = installState();

  /* Bilgisayar satırının açıklaması ve düğmesi kurulum durumuna göre değişir. */
  const deskSub = st === 'installed' ? t('dl_installed_sub')
    : st === 'ready' ? t('dl_desktop_sub')
    : t('dl_manual_sub');

  const deskBtn = st === 'installed'
    ? '<button class="btn dl-btn" disabled>' + icon('check') + esc(t('dl_installed')) + '</button>'
    : st === 'ready'
      ? '<button class="btn btn-primary dl-btn" data-act="install-app">' +
        icon('install') + esc(t('dl_install')) + '</button>'
      : '';

  const rows =
    '<div class="dl-row">' +
      '<span class="dl-icon">' + icon('smartphone') + '</span>' +
      '<div class="dl-text"><div class="dl-name">' + esc(t('dl_android')) + '</div>' +
      '<div class="dl-sub">' + esc(t('dl_android_sub')) + '</div></div>' +
      '<a class="btn btn-primary dl-btn" href="' + RELEASE_BASE + ANDROID_FILE + '">' +
        icon('download') + esc(t('dl_get')) + '</a>' +
    '</div>' +

    '<div class="dl-row">' +
      '<span class="dl-icon">' + icon('monitor') + '</span>' +
      '<div class="dl-text"><div class="dl-name">' + esc(t('dl_desktop')) + '</div>' +
      '<div class="dl-sub">' + esc(deskSub) + '</div></div>' +
      deskBtn +
    '</div>';

  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_download')) + '</h2>' +
      '<p class="sub">' + esc(t('p_download_sub')) + '</p></div></div>' +

      '<div class="grid grid-2" style="align-items:start">' +
        '<section class="card"><div class="card-body" style="padding-top:6px">' +
          rows +
        '</div></section>' +

        '<div class="grid" style="gap:16px;align-content:start">' +
          '<section class="card"><div class="card-head"><div><h3>' + esc(t('dl_iphone')) + '</h3></div></div>' +
          '<div class="card-body"><p class="hint" style="margin:0">' +
            esc(t('dl_iphone_sub')) + '</p></div></section>' +

          '<section class="card"><div class="card-body">' +
            '<div class="alert alert-info" style="margin:0">' + icon('info') +
            '<div><strong>' + esc(t('dl_note_head')) + '</strong>' +
            '<span class="alert-text">' + esc(t('dl_note')) + '</span></div></div>' +
          '</div></section>' +

          '<section class="card"><div class="card-body">' +
            '<div class="alert alert-info" style="margin:0">' + icon('info') +
            '<div><strong>' + esc(t('dl_apk_head')) + '</strong>' +
            '<span class="alert-text">' + esc(t('dl_apk')) + '</span></div></div>' +
          '</div></section>' +
        '</div>' +
      '</div>'
  };
};

PAGES.ayarlar = function () {
  return {
    html:
      '<div class="page-head"><div><h2>' + esc(t('nav_settings')) + '</h2>' +
      '<p class="sub">' + esc(t('p_settings_sub')) + '</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="save-settings">' +
      icon('check') + t('btn_save_set') + '</button></div></div>' +

      '<div class="grid grid-2">' +
        '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_business')) + '</h3>' +
        '<p class="sub">' + esc(t('h_business_sub')) + '</p></div></div>' +
        '<div class="card-body">' +
          field(t('s_biz_name'), 'text', t('inv_biz_name')) +
          field(t('s_tax_no'), 'text', 'AF-1234567890') +
          field(t('f_phone'), 'tel', '+93 20 210 00 00') +
          field(t('f_email'), 'email', 'info@netstore.af') +
          '<div class="field"><label>' + esc(t('f_address')) + '</label><textarea>' +
            esc(t('inv_biz_addr')) + '</textarea></div>' +
        '</div></section>' +

        '<div class="grid" style="gap:16px;align-content:start">' +
          '<section class="card"><div class="card-head"><div><h3>' + esc(t('s_language')) + '</h3>' +
          '<p class="sub">' + esc(t('s_lang_hint')) + '</p></div></div>' +
          '<div class="card-body"><div class="seg" data-seg="lang" style="width:100%">' +
            Object.keys(LANGS).map((k) => '<button data-val="' + k + '"' +
              (lang() === k ? ' class="on"' : '') + ' style="flex:1">' + esc(LANGS[k].name) + '</button>').join('') +
          '</div></div></section>' +

          '<section class="card"><div class="card-head"><div><h3>' + esc(t('s_calendar')) + '</h3>' +
          '<p class="sub">' + esc(t('s_cal_hint')) + '</p></div></div>' +
          '<div class="card-body"><div class="seg" data-seg="cal" style="width:100%">' +
            [['gregory', t('s_cal_greg')], ['persian', t('s_cal_persian')]].map(([k, l]) =>
              '<button data-val="' + k + '"' + (calendar() === k ? ' class="on"' : '') +
              ' style="flex:1">' + esc(l) + '</button>').join('') +
          '</div></div></section>' +

          '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_finance')) + '</h3>' +
          '<p class="sub">' + esc(t('h_finance_sub')) + '</p></div></div>' +
          '<div class="card-body">' +
            '<div class="field"><label>' + esc(t('s_currency')) + '</label>' +
            '<select><option selected>' + esc(t('s_currency_afn')) + '</option></select></div>' +
            field(t('s_default_due'), 'number', '30') +
            '<div class="field"><label>' + esc(t('s_late_alert')) + '</label><select>' +
            '<option selected>' + esc(t('s_on_due')) + '</option><option>' + esc(t('s_3_before')) +
            '</option><option>' + esc(t('s_7_before')) + '</option></select>' +
            '<p class="hint">' + esc(t('s_late_hint')) + '</p></div>' +
          '</div></section>' +

          '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_stock_set')) + '</h3>' +
          '<p class="sub">' + esc(t('h_stock_set_sub')) + '</p></div></div>' +
          '<div class="card-body">' +
            field(t('s_default_min'), 'number', '5') +
            '<div class="field"><label>' + esc(t('s_alert_channel')) + '</label><select>' +
            '<option selected>' + esc(t('s_in_app')) + '</option><option>' + esc(t('f_email')) +
            '</option><option>WhatsApp</option></select></div>' +
          '</div></section>' +

          cloudCard() +

          installCard() +

          (function () {
            const info = storageInfo();
            const cloud = cloudInfo().mode === 'cloud';
            /* Ortak modda localStorage boştur; “kaydedilmedi” demek yanıltıcı
               olurdu — kayıt sayısını defterin kendisinden gösteriyoruz. */
            const line = cloud ? t('st_records_cloud', { n: num(info.records) })
              : info.saved ? t('st_records', { n: num(info.records), s: fmtBytes(info.bytes) })
              : t('st_not_saved');

            return '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_data')) + '</h3>' +
              '<p class="sub">' + esc(cloud ? t('h_cloud_sub') : t('h_data_sub')) + '</p></div></div>' +
              '<div class="card-body">' +
                '<div class="alert alert-info" style="margin-bottom:14px">' + icon('archive') +
                  '<div><strong>' + esc(line) + '</strong>' +
                  '<span class="alert-text">' + esc(cloud ? t('st_cloud_hint') : t('st_empty_hint')) + '</span></div></div>' +
                '<div class="action-row">' +
                  '<button class="btn btn-ghost" data-act="backup">' + icon('download') + esc(t('st_backup')) + '</button>' +
                  '<button class="btn btn-ghost" data-act="restore">' + icon('refresh') + esc(t('st_restore')) + '</button>' +
                  '<button class="btn btn-warning" data-act="start-empty">' + icon('archive') + esc(t('st_empty')) + '</button>' +
                '</div>' +
              '</div></section>';
          })() +

          '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_danger')) + '</h3>' +
          '<p class="sub">' + esc(t('h_danger_sub')) + '</p></div></div>' +
          '<div class="card-body"><div class="action-row">' +
            '<button class="btn btn-danger" data-act="reset-data">' + icon('refresh') + t('btn_reset_data') + '</button>' +
            '<button class="btn btn-danger" data-act="delete-account">' + icon('trash') + t('btn_del_account') + '</button>' +
          '</div></div></section>' +
        '</div>' +
      '</div>'
  };
};

/* Ayarlar > Ortak Defter kartı: kim girmiş, kaç kişi kullanıyor, çıkış. */
function cloudCard() {
  const ci = cloudInfo();

  const body = ci.mode === 'local'
    ? '<div class="alert alert-info">' + icon('info') +
        '<div><strong>' + esc(t('cl_local_head')) + '</strong>' +
        '<span class="alert-text">' + esc(t('cl_local_sub')) + '</span></div></div>'
    : '<div class="alert alert-success" style="margin-bottom:14px">' + icon('check') +
        '<div><strong>' + esc(t('cl_signed_as', { n: ci.name })) + '</strong>' +
        '<span class="alert-text">' + esc(ci.email) + '</span></div></div>' +
      '<div class="action-row">' +
        '<button class="btn btn-ghost" data-act="sign-out">' +
          icon('logout') + esc(t('au_signout')) + '</button>' +
      '</div>' +
      '<p class="hint" style="margin-top:12px">' + esc(t('cl_synced')) + '</p>' +
      '<p class="hint">' + icon('shield') +
        esc(t(ci.guarded ? 'cl_guarded' : 'cl_unguarded')) + '</p>';

  return '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_cloud')) + '</h3>' +
    '<p class="sub">' + esc(t('h_cloud_sub')) + '</p></div></div>' +
    '<div class="card-body">' + body + '</div></section>';
}

/* Ayarlar > Uygulama kartı: kurulum durumu + çevrimdışı hazırlık. */
function installCard() {
  const st = installState();
  const off = offlineState();

  const head = st === 'installed' ? t('pw_installed')
    : st === 'ready' ? t('pw_install')
    : t('pw_manual');
  const sub = st === 'installed' ? t('pw_installed_sub')
    : st === 'ready' ? t('pw_ready_sub')
    : t('pw_manual_and') + ' ' + t('pw_manual_ios');

  const offText = off === 'on' ? t('pw_offline_on')
    : off === 'wait' ? t('pw_offline_wait')
    : t('pw_offline_none');

  return '<section class="card"><div class="card-head"><div><h3>' + esc(t('h_app')) + '</h3>' +
    '<p class="sub">' + esc(t('h_app_sub')) + '</p></div></div>' +
    '<div class="card-body">' +
      '<div class="alert alert-' + (st === 'installed' ? 'success' : 'info') + '" style="margin-bottom:14px">' +
        icon(st === 'installed' ? 'check' : 'smartphone') +
        '<div><strong>' + esc(head) + '</strong>' +
        '<span class="alert-text">' + esc(sub) + '</span></div></div>' +

      (st === 'ready'
        ? '<div class="action-row"><button class="btn btn-primary" data-act="install-app">' +
          icon('install') + esc(t('pw_install')) + '</button></div>'
        : '') +

      '<p class="hint" style="margin-top:' + (st === 'ready' ? '12px' : '0') + '">' +
        esc(offText) + '</p>' +
    '</div></section>';
}

function field(label, type, value) {
  return '<div class="field"><label>' + esc(label) + '</label>' +
    '<input type="' + type + '" value="' + esc(value) + '"></div>';
}

/* ==========================================================================
   Kabuk
   ========================================================================== */

const STATE = { route:'dashboard', param:null, filter:'all' };

function renderChrome() {
  /* marka */
  document.getElementById('brandName').textContent = t('app_name');
  document.getElementById('brandSub').textContent = t('app_sub');

  /* arama ve düğme etiketleri */
  const si = document.getElementById('searchInput');
  si.placeholder = t('search_ph');
  si.setAttribute('aria-label', t('aria_search'));
  document.getElementById('btnNotif').setAttribute('aria-label', t('aria_notif'));
  document.getElementById('btnHelp').setAttribute('aria-label', t('aria_help'));
  document.getElementById('btnBurger').setAttribute('aria-label', t('aria_menu_open'));
  document.getElementById('btnNavClose').setAttribute('aria-label', t('aria_menu_close'));

  /* Kullanıcı kartı. Ortak modda giriş yapan Google hesabı gösterilir;
     yerel modda personel listesinden. Liste boş olabilir (kullanıcı
     sıfırdan başlamış olabilir) — o durumda kart yer tutucuya düşer. */
  const ci = cloudInfo();
  const me = staffById('s1') || STAFF[0] || null;
  const nameEl = document.getElementById('meName');
  const roleEl = document.getElementById('meRole');
  const avEl = document.getElementById('meAvatar');

  if (ci.mode === 'cloud' && ci.email) {
    nameEl.textContent = ci.name;
    roleEl.textContent = ci.email;
    avEl.textContent = initialsOf(ci.name || ci.email);
  } else {
    nameEl.textContent = me ? staffName(me) : t('app_name');
    roleEl.textContent = me ? roleLabel(me.role) : t('app_sub');
    avEl.textContent = me ? staffInitials(me) : 'NS';
  }

  /* dil seçici */
  document.getElementById('langSwitch').innerHTML =
    '<div class="seg" data-seg="lang" aria-label="' + esc(t('aria_lang')) + '">' +
    Object.keys(LANGS).map((k) => '<button data-val="' + k + '"' +
      (lang() === k ? ' class="on"' : '') + ' title="' + esc(LANGS[k].name) + '">' +
      esc(LANGS[k].short) + '</button>').join('') + '</div>';
}

function renderSidebar() {
  let html = '';
  NAV.forEach((g) => {
    if (g.group) html += '<div class="nav-group-label">' + esc(t(g.group)) + '</div>';
    g.items.forEach((it) => {
      const active = STATE.route === it.id || (it.id === 'musteriler' && STATE.route === 'musteri');
      let b = '';
      if (it.id === 'borc') {
        const n = openBalances().filter((r) => r.sum.isLate).length;
        if (n) b = '<span class="nav-badge">' + num(n) + '</span>';
      }
      if (it.id === 'stok') {
        const n = kpis().lowCount;
        if (n) b = '<span class="nav-badge">' + num(n) + '</span>';
      }
      html += '<a class="nav-item' + (active ? ' active' : '') + '" href="#/' + it.id + '">' +
        icon(it.icon) + '<span>' + esc(t(it.key)) + '</span>' + b + '</a>';
    });
  });
  document.getElementById('sidebarNav').innerHTML = html;
}

function parseHash() {
  const h = (location.hash || '#/dashboard').replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  return { route: parts[0] || 'dashboard', param: parts[1] || null };
}

function render() {
  const r = parseHash();
  STATE.route = PAGES[r.route] ? r.route : 'dashboard';
  STATE.param = r.param;

  const meta = PAGE_META[STATE.route] || PAGE_META.dashboard;
  document.getElementById('pageTitle').textContent = t(meta.title);
  document.getElementById('pageCrumb').textContent = t(meta.crumb);
  document.title = t('app_name') + ' — ' + t(meta.title);

  /* rota değişince açık kalan katmanlar kapanır */
  closeDoc();
  closeModal();

  renderChrome();
  const out = PAGES[STATE.route](STATE.param);
  document.getElementById('page').innerHTML = out.html;
  window.scrollTo(0, 0);

  renderSidebar();
  if (out.mount) out.mount();
  bindSearch();
  closeNav();
}

/** Kaydı diske yazıp ekranı tazeler. Veriyi değiştiren her yol buradan geçer. */
function commit() {
  saveData();
  render();
}

function openNav()  { document.body.classList.add('nav-open'); }
function closeNav() { document.body.classList.remove('nav-open'); }

/* --- bildirim --- */
function toast(msg, tone) {
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast ' + (tone || 'success');
  el.innerHTML = icon(tone === 'warning' ? 'alert' : tone === 'info' ? 'info' : 'check') +
                 '<span>' + esc(msg) + '</span>';
  host.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transition = 'opacity 200ms';
    setTimeout(() => el.remove(), 220);
  }, 2600);
}

/* --- modal --- */
function openModal(html) {
  const host = document.getElementById('modalHost');
  host.innerHTML = '<div class="modal">' + html + '</div>';
  host.classList.add('on');
  const first = host.querySelector('input, select, textarea');
  if (first) first.focus();
}
function closeModal() {
  const host = document.getElementById('modalHost');
  host.classList.remove('on');
  host.innerHTML = '';
}

function paymentModal(custId) {
  const open = openBalances();
  if (!open.length) { toast(t('t_no_open'), 'info'); return; }

  const target = custId && customerById(custId) ? custId : open[0].customer.id;
  const sum = customerSummary(target);
  const openSales = sum.sales.filter((s) => saleTotals(s).remaining > 0);

  openModal(
    '<div class="card-head"><div><h3>' + esc(t('m_add_payment')) + '</h3>' +
    '<p class="sub">' + esc(t('m_add_pay_sub')) + '</p></div>' +
    '<div class="head-actions"><button class="btn btn-ghost btn-sm btn-icon" data-act="close-modal" aria-label="' +
    esc(t('aria_close')) + '">' + icon('x') + '</button></div></div>' +
    '<div class="card-body">' +
      '<div class="field"><label>' + esc(t('m_customer')) + '</label><select id="pmCust">' +
      open.map((r) => '<option value="' + r.customer.id + '"' + (r.customer.id === target ? ' selected' : '') + '>' +
        esc(t('m_opt_debt', { name: customerName(r.customer), v: money(r.sum.remaining) })) + '</option>').join('') +
      '</select></div>' +
      '<div class="field"><label>' + esc(t('m_invoice')) + '</label><select id="pmSale">' +
      openSales.map((s) => '<option value="' + s.id + '">' +
        esc(t('m_opt_rem', { no: s.no, v: money(saleTotals(s).remaining) })) + '</option>').join('') +
      '</select></div>' +
      '<div class="field"><label>' + esc(t('m_amount', { c: langMeta().currency })) + '</label>' +
      '<input type="number" id="pmAmount" min="1" step="1" value="' +
      (openSales.length ? Math.round(saleTotals(openSales[0]).remaining) : 0) + '">' +
      '<p class="hint">' + esc(t('m_hint_max')) + '</p></div>' +
      '<div class="field"><label>' + esc(t('m_method')) + '</label><select id="pmMethod">' +
      METHODS.map((m) => '<option value="' + m + '">' + esc(methodLabel(m)) + '</option>').join('') +
      '</select></div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-act="close-modal">' + esc(t('btn_cancel')) + '</button>' +
      '<button class="btn btn-success" data-act="save-payment">' + icon('handCoins') + t('btn_save_pay') + '</button>' +
    '</div>'
  );

  document.getElementById('pmCust').addEventListener('change', function () {
    const s2 = customerSummary(this.value);
    const list = s2.sales.filter((s) => saleTotals(s).remaining > 0);
    document.getElementById('pmSale').innerHTML = list.map((s) =>
      '<option value="' + s.id + '">' + esc(t('m_opt_rem', { no: s.no, v: money(saleTotals(s).remaining) })) +
      '</option>').join('');
    document.getElementById('pmAmount').value = list.length ? Math.round(saleTotals(list[0]).remaining) : 0;
  });
  document.getElementById('pmSale').addEventListener('change', function () {
    const s = saleById(this.value);
    if (s) document.getElementById('pmAmount').value = Math.round(saleTotals(s).remaining);
  });
}

function savePayment() {
  const custId = document.getElementById('pmCust').value;
  const saleId = document.getElementById('pmSale').value;
  const amount = parseFloat(document.getElementById('pmAmount').value);
  const method = document.getElementById('pmMethod').value;
  const sale = saleById(saleId);

  if (!sale) { toast(t('t_no_open_inv'), 'warning'); return; }
  if (!amount || amount <= 0) { toast(t('t_bad_amount'), 'warning'); return; }

  const final = Math.min(amount, saleTotals(sale).remaining);
  PAYMENTS.unshift({
    id:'pm' + (PAYMENTS.length + 1000), saleId:saleId, customerId:custId,
    date:new Date(TODAY), amount:final, method:method
  });
  PAYMENTS.sort((a, b) => b.date - a.date);

  closeModal();
  commit();
  toast(t('t_saved', { v: money(final) }));
}

/* --- olaylar --- */
document.addEventListener('click', function (ev) {
  const nav = ev.target.closest('[data-nav]');
  if (nav) { ev.preventDefault(); nav.dataset.nav === 'open' ? openNav() : closeNav(); return; }

  const seg = ev.target.closest('[data-seg] button');
  if (seg) {
    const group = seg.closest('[data-seg]').dataset.seg;
    if (group === 'lang') { setLang(seg.dataset.val); render(); return; }
    if (group === 'cal')  { setCalendar(seg.dataset.val); render(); return; }
    STATE.filter = seg.dataset.val; render(); return;
  }

  const a = ev.target.closest('[data-act]');
  if (!a) {
    if (ev.target.id === 'modalHost') closeModal();
    return;
  }

  const act = a.dataset.act;
  const id = a.dataset.id;

  /* --- belgeler --- */
  if (act === 'doc-invoice')  { invoiceDoc(id); return; }
  if (act === 'doc-receipt')  { receiptDoc(id); return; }
  if (act === 'close-doc')    { closeDoc(); return; }
  if (act === 'print-doc' || act === 'print') {
    window.print();
    /* Bazı mobil tarayıcılar JavaScript'ten gelen yazdırma isteğini sessizce
       yok sayıyor — hata da vermiyorlar, o yüzden tespit etmenin güvenilir
       yolu yok. Yazdırma stilleri doğru olduğu için tarayıcının kendi menüsü
       çalışıyor; dokunmatik cihazlarda yolu hatırlatıyoruz. */
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      toast(t('t_print_hint'), 'info');
    }
    return;
  }

  /* --- modal denetimi --- */
  if (act === 'close-modal')  { ACTIVE_FORM = null; PENDING_CONFIRM = null; closeModal(); return; }
  if (act === 'form-submit')  { submitActiveForm(); return; }
  if (act === 'confirm-yes')  { runPendingConfirm(); return; }

  /* --- kalem listesi --- */
  if (act === 'line-add')     { lineAdd(); return; }
  if (act === 'line-remove')  { lineRemove(Number(a.dataset.line)); return; }

  /* --- tahsilat --- */
  if (act === 'add-payment')  { paymentModal(id); return; }
  if (act === 'save-payment') { savePayment(); return; }

  /* --- kayıt formları --- */
  if (act === 'new-sale' || act === 'new-invoice') { newSaleForm(id); return; }
  if (act === 'new-product')    { productForm(); return; }
  if (act === 'edit-product')   { productForm(id); return; }
  if (act === 'delete-product') { deleteProduct(id); return; }
  if (act === 'new-customer')   { customerForm(); return; }
  if (act === 'edit-customer')  { customerForm(id || STATE.param); return; }
  if (act === 'delete-customer'){ deleteCustomer(id || STATE.param); return; }
  if (act === 'new-purchase')   { newPurchaseForm(); return; }
  if (act === 'new-staff')      { staffForm(); return; }
  if (act === 'edit-staff')     { staffForm(id); return; }
  if (act === 'stock-in')       { stockInForm(id); return; }

  /* --- dışa aktarma / yedek --- */
  if (act === 'export')  { exportCurrent(); return; }
  if (act === 'backup')  { exportBackup(); return; }
  if (act === 'restore') { importBackup(); return; }
  if (act === 'start-empty') {
    confirmModal({
      message: t('cf_empty'), note: t('cf_empty_note'),
      onConfirm: function () { startEmpty(); render(); toast(t('st_emptied')); }
    });
    return;
  }
  if (act === 'search-toggle') { toggleMobileSearch(); return; }

  /* --- ayarlar --- */
  if (act === 'install-app') { promptInstall(); return; }
  if (act === 'auth-in') { authSignIn(); return; }
  if (act === 'sign-out') {
    confirmModal({ message: t('cf_signout'), onConfirm: authSignOut });
    return;
  }
  if (act === 'save-settings') { toast(t('t_settings')); return; }
  if (act === 'reset-data') {
    confirmModal({
      message: t('cf_reset'), note: t('cf_reset_note'),
      /* Kaydı silip yeniden yükler; data.js açılışta örnek veriyi yeniden
         üretir. Yalnızca reload yetmez — kayıtlı veri geri gelirdi. */
      onConfirm: resetToDemo
    });
    return;
  }
  if (act === 'delete-account') { toast(t('t_danger'), 'warning'); return; }
});

/* kalem miktarı doğrudan alandan değişir */
document.addEventListener('input', function (ev) {
  const q = ev.target.closest('.line-qty');
  if (q) lineQty(Number(q.dataset.line), q.value);
});

document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape') {
    closeDoc(); ACTIVE_FORM = null; PENDING_CONFIRM = null; closeModal(); closeNav();
  }
  /* formda Enter kaydeder — çok satırlı alan hariç */
  if (ev.key === 'Enter' && ACTIVE_FORM && ev.target.tagName !== 'TEXTAREA' &&
      document.getElementById('modalHost').classList.contains('on')) {
    ev.preventDefault();
    submitActiveForm();
  }
});

window.addEventListener('hashchange', render);

document.addEventListener('DOMContentLoaded', function () {
  applyLangToDocument();
  hydrateIcons(document);
  captureSeed();        // örnek verinin kopyası — “demoya dön” için
  bootApp();
});

/**
 * Açılış.
 * Yerel mod: diskteki kaydı yükle, çiz.
 * Ortak mod: giriş ekranını göster; defter buluttan gelene kadar çizme.
 */
function bootApp() {
  if (!cloudEnabled()) {
    initStore();
    render();
    return;
  }

  showAuth('loading', {});
  cloudStart({
    onSignedOut: function () { showAuth('signed-out', {}); },
    onDenied: function (user) { showAuth('denied', { email: user.email }); },
    onReady: function () { hideAuth(); render(); },
    onData: render,
    onError: function (code) {
      /* Kural reddi ya da bağlantı hatası: kullanıcı boş ekranla
         karşılaşmasın, ne olduğunu görsün. */
      if (!cloudActive()) showAuth('signed-out', { failed: true });
      else toast(t('cl_read_failed', { e: code }), 'warning');
    }
  });
}

/** Bayt sayısını okunur biçime çevirir. */
function fmtBytes(b) {
  if (b < 1024) return num(b) + ' B';
  if (b < 1024 * 1024) return num(Math.round(b / 1024)) + ' KB';
  return num(Math.round(b / 104857.6) / 10) + ' MB';
}
