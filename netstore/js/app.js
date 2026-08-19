/* ==========================================================================
   NetStore — uygulama kabuğu, yönlendirme ve sayfalar
   ========================================================================== */

/* --------------------------------------------------------------------------
   Menü tanımı — sıra brifingteki sırayla birebir
   -------------------------------------------------------------------------- */
const NAV = [
  { group: null, items: [
    { id:'dashboard', label:'Dashboard', icon:'dashboard' }
  ]},
  { group: 'Envanter', items: [
    { id:'urunler', label:'Ürünler', icon:'package' },
    { id:'stok',    label:'Stok',    icon:'boxes' }
  ]},
  { group: 'İşlemler', items: [
    { id:'satislar',  label:'Satışlar',  icon:'cart' },
    { id:'alislar',   label:'Alışlar',   icon:'truck' },
    { id:'musteriler',label:'Müşteriler',icon:'users' },
    { id:'faturalar', label:'Faturalar', icon:'invoice' }
  ]},
  { group: 'Finans', items: [
    { id:'tahsilatlar', label:'Tahsilatlar',   icon:'wallet' },
    { id:'borc',        label:'Borç / Alacak', icon:'scale' },
    { id:'raporlar',    label:'Raporlar',      icon:'chart' }
  ]},
  { group: 'Yönetim', items: [
    { id:'personel', label:'Personel', icon:'staff' },
    { id:'ayarlar',  label:'Ayarlar',  icon:'settings' }
  ]}
];

const PAGE_META = {
  dashboard:  { title:'Dashboard',     crumb:'Genel bakış' },
  urunler:    { title:'Ürünler',       crumb:'Envanter' },
  stok:       { title:'Stok',          crumb:'Envanter' },
  satislar:   { title:'Satışlar',      crumb:'İşlemler' },
  alislar:    { title:'Alışlar',       crumb:'İşlemler' },
  musteriler: { title:'Müşteriler',    crumb:'İşlemler' },
  musteri:    { title:'Müşteri Detayı',crumb:'İşlemler · Müşteriler' },
  faturalar:  { title:'Faturalar',     crumb:'İşlemler' },
  tahsilatlar:{ title:'Tahsilatlar',   crumb:'Finans' },
  borc:       { title:'Borç / Alacak', crumb:'Finans' },
  raporlar:   { title:'Raporlar',      crumb:'Finans' },
  personel:   { title:'Personel',      crumb:'Yönetim' },
  ayarlar:    { title:'Ayarlar',       crumb:'Yönetim' }
};

/* --------------------------------------------------------------------------
   Küçük görünüm yardımcıları
   -------------------------------------------------------------------------- */

function badge(tone, label, ic) {
  return '<span class="badge badge-' + tone + '">' +
    (ic ? icon(ic) : '<span class="bullet"></span>') + esc(label) + '</span>';
}

function statusBadge(st) {
  return badge(st.tone, st.label, st.icon);
}

/**
 * Tablo üretici.
 * cols: [{key,label,align,render,cls}]  — ilk sütun mobilde kart başlığı olur.
 * Her hücre data-label taşır: 720px altında tablo kart görünümüne döner.
 */
function table(cols, rows, opts) {
  opts = opts || {};
  if (!rows.length) {
    return '<div class="empty">' + icon('archive') + '<p>' + (opts.empty || 'Kayıt bulunamadı.') + '</p></div>';
  }

  const head = cols.map((c) =>
    '<th class="' + (c.align === 'right' ? 'right' : '') + '">' + esc(c.label) + '</th>').join('');

  const body = rows.map((r, ri) => {
    const tds = cols.map((c, ci) => {
      const cls = [];
      if (c.align === 'right') cls.push('right');
      if (ci === 0) cls.push('card-title-cell');
      if (c.key === '_actions') cls.push('actions-cell');
      if (c.cls) cls.push(c.cls);
      return '<td class="' + cls.join(' ') + '" data-label="' + esc(c.label) + '">' +
             c.render(r, ri) + '</td>';
    }).join('');
    return '<tr' + (opts.rowAttr ? ' ' + opts.rowAttr(r) : '') + '>' + tds + '</tr>';
  }).join('');

  return '<div class="table-wrap"><table class="data as-cards' + (opts.wide ? ' wide' : '') +
         '"><thead><tr>' + head +
         '</tr></thead><tbody>' + body + '</tbody></table></div>';
}

function statCard(o) {
  const trend = o.trend
    ? '<span class="trend ' + o.trend.tone + '">' +
      (o.trend.icon ? icon(o.trend.icon) : '') + esc(o.trend.text) + '</span>'
    : '';
  const right = o.spark || '';
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
        '<div style="min-width:0">' + trend +
          '<div class="stat-desc">' + o.desc + '</div>' +
        '</div>' + right +
      '</div>') +
  '</article>';
}

/** Ödenen / kalan oranını gösteren mini ölçek (grafik yerine oran göstergesi). */
function meter(paidRatio, leftLabel, rightLabel, tone) {
  const p = Math.max(0, Math.min(1, paidRatio));
  return '<div class="stat-foot"><div class="meter">' +
    '<div class="meter-track">' +
      '<div class="meter-fill" style="width:' + (p * 100).toFixed(1) + '%;background:var(--' + (tone || 'success') + ')"></div>' +
    '</div>' +
    '<div class="meter-legend"><span>' + leftLabel + '</span><span>' + rightLabel + '</span></div>' +
  '</div></div>';
}

function customerLink(c) {
  return '<a href="#/musteri/' + c.id + '" class="cell-main">' +
    '<span class="avatar">' + esc(initials(c)) + '</span>' +
    '<span style="min-width:0"><span class="cell-title">' + esc(customerName(c)) + '</span>' +
    '<span class="cell-sub" style="display:block">' + esc(c.type) + '</span></span></a>';
}

function actionBtn(ic, title, attrs) {
  return '<button class="btn btn-ghost btn-sm btn-icon" title="' + esc(title) +
         '" aria-label="' + esc(title) + '"' + (attrs || '') + '>' + icon(ic) + '</button>';
}

/* --------------------------------------------------------------------------
   Sayfalar
   -------------------------------------------------------------------------- */

const PAGES = {};

/* --- Dashboard --- */
PAGES.dashboard = function () {
  const k = kpis();
  const series12 = monthlySeries(12);
  const saleTrend = series12.map((m) => m.sale);
  const profitTrend = series12.map((m) => m.profit);
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

  /* 6 KPI kartı: küçük ikon + büyük rakam + açıklama + mini gösterge */
  const stats = [
    statCard({
      icon:'truck', tone:'info', label:'Toplam Yatırım', value: money(k.invest),
      desc:'Tedarikçi alışlarının toplam maliyeti',
      trend:{ tone:'flat', text:PURCHASES.length + ' alış', icon:'archive' },
      spark: sparkline(investTrend, '#3B82F6')
    }),
    statCard({
      icon:'cart', tone:'accent', label:'Toplam Satış', value: money(k.sales),
      desc:'Son 12 ay · geçen ayın aynı dönemine göre',
      trend: saleMoM === null ? null : { tone: saleMoM >= 0 ? 'up' : 'down',
              text: pct(saleMoM) + ' bu ay', icon: saleMoM >= 0 ? 'trendUp' : 'trendDown' },
      spark: sparkline(saleTrend, SERIES_1)
    }),
    statCard({
      icon:'coins', tone:'success', label:'Gerçekleşen Kâr', value: money(k.profit),
      desc:'Satış − maliyet · marj %' + (k.margin * 100).toFixed(1).replace('.', ','),
      trend: profitMoM === null ? null : { tone: profitMoM >= 0 ? 'up' : 'down',
              text: pct(profitMoM) + ' bu ay', icon: profitMoM >= 0 ? 'trendUp' : 'trendDown' },
      spark: sparkline(profitTrend, SERIES_2)
    }),
    statCard({
      icon:'boxes', label:'Toplam Stok', value: num(k.stockUnits) + ' <span style="font-size:15px;color:var(--text-3);font-weight:600">adet</span>',
      desc:'Depo değeri ' + money(k.stockValue),
      meter: meter(
        1 - (k.lowCount / PRODUCTS.length),
        '<span class="text-muted">' + (PRODUCTS.length - k.lowCount) + ' ürün yeterli</span>',
        '<span class="text-warning">' + k.lowCount + ' kritik</span>',
        'success'
      )
    }),
    statCard({
      icon:'alert', tone:'warning', label:'Azalan Ürünler', value: String(k.lowCount),
      desc:'Minimum stok seviyesinin altında',
      trend:{ tone:'warn', text: k.outOfRisk + ' ürün tükenmek üzere', icon:'alert' },
      spark:''
    }),
    statCard({
      icon:'staff', tone:'accent', label:'Aktif Personel', value: String(k.staffCount),
      desc: k.staffTotal + ' kayıtlı personelin ' + k.staffCount + ' tanesi aktif',
      meter: meter(k.staffCount / k.staffTotal,
        '<span class="text-muted">Aktif ' + k.staffCount + '</span>',
        '<span class="text-dim">Pasif ' + (k.staffTotal - k.staffCount) + '</span>', 'accent')
    })
  ].join('');

  /* uyarı şeridi — yalnızca gerçekten sorun varsa */
  let alerts = '';
  if (lateCount || k.lowCount) {
    const parts = [];
    if (lateCount) parts.push(
      '<div class="alert alert-danger">' + icon('alert') +
      '<div><strong>' + lateCount + ' fatura gecikmiş durumda</strong>' +
      '<span class="alert-text">Vadesi geçen toplam alacak ' +
      money(openBal.reduce((s, r) => s + r.sum.overdue, 0)) +
      '. <a href="#/borc" style="color:var(--danger);text-decoration:underline">Borç / Alacak</a> sayfasından takip edin.</span></div></div>');
    if (k.lowCount) parts.push(
      '<div class="alert alert-warning">' + icon('alert') +
      '<div><strong>' + k.lowCount + ' üründe stok kritik seviyede</strong>' +
      '<span class="alert-text">' + k.low.slice(0, 3).map((p) => esc(p.name)).join(', ') +
      (k.lowCount > 3 ? ' ve ' + (k.lowCount - 3) + ' ürün daha' : '') +
      '. <a href="#/stok" style="color:var(--warning);text-decoration:underline">Stok</a> sayfasına gidin.</span></div></div>');
    alerts = '<div class="grid grid-2" style="margin-bottom:16px">' + parts.join('') + '</div>';
  }

  const recent = SALES.slice(0, 6);

  return {
    html:
      '<div class="page-head">' +
        '<div><h2>Genel Bakış</h2>' +
        '<p class="sub">' + fmtDate(TODAY) + ' · son 12 ayın özeti</p></div>' +
        '<div class="head-actions">' +
          '<button class="btn btn-ghost" data-act="export">' + icon('download') + 'Dışa Aktar</button>' +
          '<button class="btn btn-primary" data-act="new-sale">' + icon('plus') + 'Yeni Satış</button>' +
        '</div>' +
      '</div>' +

      alerts +

      '<div class="grid grid-stats" style="margin-bottom:16px">' + stats + '</div>' +

      '<div class="grid grid-main" style="margin-bottom:16px">' +
        '<section class="card">' +
          '<div class="card-head">' +
            '<div><h3>Satış ve Kâr Eğilimi</h3><p class="sub">Son 12 ay · aylık toplam</p></div>' +
            '<div class="head-actions chart-legend">' +
              '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_1 + '"></span>Satış</span>' +
              '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_2 + '"></span>Kâr</span>' +
            '</div>' +
          '</div>' +
          '<div class="card-body"><div id="trendChart"></div></div>' +
        '</section>' +

        '<section class="card">' +
          '<div class="card-head"><div><h3>Tahsilat Durumu</h3>' +
          '<p class="sub">Toplam ciroya göre</p></div></div>' +
          '<div class="card-body">' +
            '<div style="font-size:29px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums">' +
              money(k.paid) + '</div>' +
            '<p class="text-dim" style="font-size:12px;margin-top:2px">tahsil edildi · toplam ' + money(k.sales) + '</p>' +
            '<div class="meter" style="margin-top:16px">' +
              '<div class="meter-track" style="height:8px">' +
                '<div class="meter-fill" style="width:' + ((k.paid / k.sales) * 100).toFixed(1) + '%;background:var(--success)"></div>' +
              '</div>' +
              '<div class="meter-legend">' +
                '<span class="text-success">Ödenen %' + ((k.paid / k.sales) * 100).toFixed(0) + '</span>' +
                '<span class="text-danger">Kalan ' + money(k.receivable) + '</span>' +
              '</div>' +
            '</div>' +
            '<div style="border-top:1px solid var(--border);margin-top:18px;padding-top:16px">' +
              '<h4 style="font-size:12.5px;color:var(--text-2);margin-bottom:13px">Kategori Bazlı Ciro</h4>' +
              '<div id="catBars"></div>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<div class="grid grid-main">' +
        '<section class="card">' +
          '<div class="card-head"><div><h3>Son Satışlar</h3>' +
          '<p class="sub">En güncel 6 işlem</p></div>' +
          '<div class="head-actions"><a class="btn btn-ghost btn-sm" href="#/satislar">Tümü' + icon('chevronRight') + '</a></div></div>' +
          '<div class="card-body flush">' + salesTable(recent, true) + '</div>' +
        '</section>' +

        '<section class="card">' +
          '<div class="card-head"><div><h3>Son Tahsilatlar</h3>' +
          '<p class="sub">Kasaya giren son hareketler</p></div></div>' +
          '<div class="card-body flush"><div class="timeline">' +
            PAYMENTS.slice(0, 6).map((p) => {
              const c = customerById(p.customerId);
              const s = saleById(p.saleId);
              return '<div class="tl-item">' +
                '<div class="tl-rail"><span class="tl-dot success">' + icon('handCoins') + '</span></div>' +
                '<div class="tl-body"><div class="tl-row">' +
                  '<span class="tl-title">' + esc(customerName(c)) + '</span>' +
                  '<span class="tl-amount text-success">' + signedMoney(p.amount) + '</span>' +
                '</div><p class="tl-meta">' + fmtDate(p.date) + ' · ' + esc(p.method) +
                (s ? ' · ' + esc(s.no) : '') + '</p></div></div>';
            }).join('') +
          '</div></div>' +
        '</section>' +
      '</div>',

    mount: function () {
      lineChart(document.getElementById('trendChart'), {
        data: series12,
        series: [
          { key:'sale',   name:'Satış', color: SERIES_1 },
          { key:'profit', name:'Kâr',   color: SERIES_2 }
        ],
        aria:'Son 12 ayın satış ve kâr eğilimi'
      });
      hBars(document.getElementById('catBars'), categoryTotals().slice(0, 5));
    }
  };
};

/* --- ortak satış tablosu ---
   compact: dar sütunlarda (dashboard, müşteri detayı) yalnızca kritik sütunlar. */
function salesTable(rows, compact) {
  if (compact) {
    return table([
      { key:'no', label:'Fatura', render:(s) =>
        '<span class="invoice-no">' + esc(s.no) + '</span>' +
        '<span class="cell-sub" style="display:block;white-space:normal">' +
        esc(customerName(customerById(s.customerId))) + '</span>' },
      { key:'date', label:'Tarih', render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
      { key:'total', label:'Toplam', align:'right', render:(s) =>
        '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
      { key:'rem', label:'Kalan', align:'right', render:(s) => {
          const t = saleTotals(s);
          return '<span class="num ' + (t.remaining > 0 ? 'text-danger' : 'text-dim') + '">' +
                 money(t.remaining) + '</span>'; } },
      { key:'st', label:'Durum', render:(s) => statusBadge(saleStatus(s)) }
    ], rows, { empty:'Bu aralıkta satış yok.' });
  }

  return table([
    { key:'no',    label:'Fatura No', render:(s) =>
      '<a href="#/musteri/' + s.customerId + '"><span class="invoice-no">' + esc(s.no) + '</span>' +
      '<span class="cell-sub" style="display:block">' + esc(customerName(customerById(s.customerId))) + '</span></a>' },
    { key:'date',  label:'Tarih', render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
    { key:'prod',  label:'Ürün', render:(s) => {
        const first = productById(s.items[0].pid);
        /* iki satır tek sarmalayıcıda: mobil kart görünümünde yan yana kaymasın */
        return '<span style="display:block;text-align:inherit">' +
          '<span class="cell-title" style="font-weight:500">' + esc(first ? first.name : '—') + '</span>' +
          (s.items.length > 1 ? '<span class="cell-sub" style="display:block">+' + (s.items.length - 1) +
            ' kalem daha</span>' : '') + '</span>'; } },
    { key:'qty',   label:'Adet', align:'right', render:(s) =>
      '<span class="num">' + s.items.reduce((a, i) => a + i.qty, 0) + '</span>' },
    { key:'total', label:'Toplam', align:'right', render:(s) =>
      '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
    { key:'paid',  label:'Ödenen', align:'right', render:(s) => {
        const t = saleTotals(s);
        return '<span class="num ' + (t.paid > 0 ? 'text-success' : 'text-dim') + '">' + money(t.paid) + '</span>'; } },
    { key:'rem',   label:'Kalan', align:'right', render:(s) => {
        const t = saleTotals(s);
        return '<span class="num ' + (t.remaining > 0 ? 'text-danger' : 'text-dim') + '">' + money(t.remaining) + '</span>'; } },
    { key:'st',    label:'Durum', render:(s) => statusBadge(saleStatus(s)) }
  ], rows, { empty:'Bu aralıkta satış yok.', wide:true });
}

/* --- Satışlar --- */
PAGES.satislar = function () {
  const filter = STATE.filter || 'all';
  const rows = SALES.filter((s) => filter === 'all' || saleStatus(s).key === filter);
  const counts = { all: SALES.length };
  ['paid','partial','pending','late'].forEach((k) => {
    counts[k] = SALES.filter((s) => saleStatus(s).key === k).length;
  });
  const totals = rows.reduce((a, s) => {
    const t = saleTotals(s);
    a.total += t.total; a.paid += t.paid; a.rem += t.remaining; return a;
  }, { total:0, paid:0, rem:0 });

  return {
    html:
      '<div class="page-head"><div><h2>Satışlar</h2>' +
      '<p class="sub">' + rows.length + ' işlem · ' + money(totals.total) + ' ciro</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + 'Dışa Aktar</button>' +
        '<button class="btn btn-primary" data-act="new-sale">' + icon('plus') + 'Yeni Satış</button>' +
      '</div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'cart', tone:'accent', label:'Seçili Ciro', value: money(totals.total),
                   desc: rows.length + ' fatura', trend:null, spark:'' }) +
        statCard({ icon:'handCoins', tone:'success', label:'Tahsil Edilen', value: money(totals.paid),
                   desc:'Kasaya giren tutar', trend:null, spark:'' }) +
        statCard({ icon:'scale', tone:'danger', label:'Açık Bakiye', value: money(totals.rem),
                   desc:'Henüz tahsil edilmedi', trend:null, spark:'' }) +
      '</div>' +

      '<div class="toolbar"><div class="seg" data-seg="filter">' +
        [['all','Tümü'],['paid','Tamamlandı'],['partial','Kısmi'],['pending','Bekliyor'],['late','Gecikti']]
          .map(([k, l]) => '<button data-val="' + k + '"' + (filter === k ? ' class="on"' : '') + '>' +
               l + ' <span class="num">(' + counts[k] + ')</span></button>').join('') +
      '</div></div>' +

      '<section class="card"><div class="card-body flush">' + salesTable(rows) + '</div></section>'
  };
};

/* --- Faturalar --- */
PAGES.faturalar = function () {
  const rows = SALES.slice();
  return {
    html:
      '<div class="page-head"><div><h2>Faturalar</h2>' +
      '<p class="sub">' + rows.length + ' fatura kesildi</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="print">' + icon('printer') + 'Yazdır</button>' +
        '<button class="btn btn-primary" data-act="new-invoice">' + icon('plus') + 'Fatura Oluştur</button>' +
      '</div></div>' +
      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'no', label:'Fatura No', render:(s) => '<span class="invoice-no">' + esc(s.no) + '</span>' },
        { key:'cust', label:'Müşteri', render:(s) => {
            const c = customerById(s.customerId);
            return '<a href="#/musteri/' + s.customerId + '" class="cell-title">' + esc(customerName(c)) + '</a>'; } },
        { key:'date', label:'Tarih', render:(s) => '<span class="num">' + fmtDate(s.date) + '</span>' },
        { key:'due', label:'Vade', render:(s) => {
            const t = saleTotals(s);
            const tone = dueTone(s.due, t.remaining);
            return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') + '">' +
                   fmtDate(s.due) + '</span>'; } },
        { key:'total', label:'Tutar', align:'right', render:(s) => '<span class="num strong">' + money(saleTotals(s).total) + '</span>' },
        { key:'st', label:'Durum', render:(s) => statusBadge(saleStatus(s)) },
        { key:'_actions', label:'İşlem', align:'right', render:(s) =>
          '<div class="actions">' +
            '<button class="btn btn-info btn-sm" data-act="invoice" data-id="' + s.id + '">' + icon('invoice') + 'Fatura</button>' +
            actionBtn('printer','Yazdır',' data-act="print"') +
          '</div>' }
      ], rows, { wide:true }) + '</div></section>'
  };
};

/* --- Ürünler --- */
PAGES.urunler = function () {
  const rows = PRODUCTS.slice();
  const totalValue = rows.reduce((s, p) => s + p.stock * p.buy, 0);
  return {
    html:
      '<div class="page-head"><div><h2>Ürünler</h2>' +
      '<p class="sub">' + rows.length + ' ürün · envanter değeri ' + money(totalValue) + '</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + 'Dışa Aktar</button>' +
        '<button class="btn btn-primary" data-act="new-product">' + icon('plus') + 'Yeni Ürün</button>' +
      '</div></div>' +
      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:'Ürün', render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
          '<span><span class="cell-title">' + esc(p.name) + '</span>' +
          '<span class="cell-sub">' + esc(p.sku) + '</span></span></span>' },
        { key:'cat', label:'Kategori', render:(p) => badge('muted', p.cat) },
        { key:'buy', label:'Alış', align:'right', render:(p) => '<span class="num">' + money(p.buy) + '</span>' },
        { key:'sell', label:'Satış', align:'right', render:(p) => '<span class="num strong">' + money(p.sell) + '</span>' },
        { key:'margin', label:'Marj', align:'right', render:(p) =>
          '<span class="num text-success">%' + (((p.sell - p.buy) / p.sell) * 100).toFixed(0) + '</span>' },
        { key:'stock', label:'Stok', align:'right', render:(p) =>
          '<span class="num ' + (p.stock <= p.min ? 'text-warning strong' : '') + '">' + p.stock + '</span>' },
        { key:'_actions', label:'İşlem', align:'right', render:(p) =>
          '<div class="actions">' + actionBtn('edit','Düzenle') + actionBtn('trash','Sil') + '</div>' }
      ], rows) + '</div></section>'
  };
};

/* --- Stok --- */
PAGES.stok = function () {
  const k = kpis();
  const sorted = PRODUCTS.slice().sort((a, b) => (a.stock / a.min) - (b.stock / b.min));
  return {
    html:
      '<div class="page-head"><div><h2>Stok Durumu</h2>' +
      '<p class="sub">' + num(k.stockUnits) + ' adet · ' + money(k.stockValue) + ' depo değeri</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-primary" data-act="stock-in">' + icon('plus') + 'Stok Girişi</button>' +
      '</div></div>' +

      (k.lowCount ? '<div class="alert alert-warning" style="margin-bottom:16px">' + icon('alert') +
        '<div><strong>' + k.lowCount + ' ürün minimum seviyenin altında</strong>' +
        '<span class="alert-text">Tedarikçiye sipariş açmanız önerilir.</span></div></div>' : '') +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'boxes', label:'Toplam Adet', value: num(k.stockUnits), desc:'Tüm ürünlerin toplamı', spark:'' }) +
        statCard({ icon:'euro', tone:'info', label:'Depo Değeri', value: money(k.stockValue), desc:'Alış maliyeti üzerinden', spark:'' }) +
        statCard({ icon:'alert', tone:'warning', label:'Kritik Ürün', value: String(k.lowCount), desc:'Minimum stok altında', spark:'' }) +
      '</div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:'Ürün', render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
          '<span><span class="cell-title">' + esc(p.name) + '</span>' +
          '<span class="cell-sub">' + esc(p.sku) + ' · ' + esc(p.sup) + '</span></span></span>' },
        { key:'stock', label:'Mevcut', align:'right', render:(p) => {
            const ratio = Math.min(1, p.stock / (p.min * 2.5));
            const col = p.stock <= p.min ? 'var(--danger)' : p.stock <= p.min * 1.6 ? 'var(--warning)' : 'var(--success)';
            return '<span class="num strong">' + p.stock + '</span>' +
                   '<span class="stock-bar" style="margin-left:auto"><span style="width:' +
                   (ratio * 100).toFixed(0) + '%;background:' + col + '"></span></span>'; } },
        { key:'min', label:'Min.', align:'right', render:(p) => '<span class="num text-dim">' + p.min + '</span>' },
        { key:'value', label:'Değer', align:'right', render:(p) => '<span class="num">' + money(p.stock * p.buy) + '</span>' },
        { key:'st', label:'Durum', render:(p) =>
          p.stock <= p.min ? badge('danger','Kritik','alert')
          : p.stock <= p.min * 1.6 ? badge('warning','Azalıyor','clock')
          : badge('success','Yeterli','check') },
        { key:'_actions', label:'İşlem', align:'right', render:(p) =>
          '<div class="actions"><button class="btn btn-ghost btn-sm" data-act="stock-in">' +
          icon('plus') + 'Giriş</button></div>' }
      ], sorted) + '</div></section>'
  };
};

/* --- Alışlar --- */
PAGES.alislar = function () {
  const total = PURCHASES.reduce((s, p) => s + p.total, 0);
  const paid = PURCHASES.reduce((s, p) => s + p.paid, 0);
  return {
    html:
      '<div class="page-head"><div><h2>Alışlar</h2>' +
      '<p class="sub">' + PURCHASES.length + ' alış · ' + money(total) + ' toplam yatırım</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-purchase">' +
      icon('plus') + 'Yeni Alış</button></div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'truck', tone:'info', label:'Toplam Yatırım', value: money(total), desc:'Tedarikçilere ödenen mal bedeli', spark:'' }) +
        statCard({ icon:'check', tone:'success', label:'Ödenen', value: money(paid), desc:'Kapatılan tedarikçi bakiyesi', spark:'' }) +
        statCard({ icon:'scale', tone:'danger', label:'Tedarikçi Borcu', value: money(total - paid), desc:'Ödenmeyi bekleyen tutar', spark:'' }) +
      '</div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'no', label:'Alış No', render:(p) => '<span class="invoice-no">' + esc(p.no) + '</span>' },
        { key:'sup', label:'Tedarikçi', render:(p) =>
          '<span class="cell-main"><span class="thumb">' + icon('building') + '</span>' +
          '<span class="cell-title">' + esc(p.supplier) + '</span></span>' },
        { key:'date', label:'Tarih', render:(p) => '<span class="num">' + fmtDate(p.date) + '</span>' },
        { key:'lines', label:'Kalem', align:'right', render:(p) => '<span class="num">' + p.items.length + '</span>' },
        { key:'total', label:'Tutar', align:'right', render:(p) => '<span class="num strong">' + money(p.total) + '</span>' },
        { key:'st', label:'Durum', render:(p) => p.paid >= p.total
          ? badge('success','Ödendi','check') : badge('warning','Kısmi Ödeme','clock') }
      ], PURCHASES) + '</div></section>'
  };
};

/* --- Müşteriler --- */
PAGES.musteriler = function () {
  const rows = CUSTOMERS.map((c) => ({ c: c, s: customerSummary(c.id) }))
                        .sort((a, b) => b.s.remaining - a.s.remaining || b.s.total - a.s.total);
  const totalRem = rows.reduce((s, r) => s + r.s.remaining, 0);

  return {
    html:
      '<div class="page-head"><div><h2>Müşteriler</h2>' +
      '<p class="sub">' + rows.length + ' müşteri · ' + money(totalRem) + ' toplam alacak</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-customer">' +
      icon('plus') + 'Yeni Müşteri</button></div></div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:'Müşteri', render:(r) => customerLink(r.c) },
        { key:'phone', label:'Telefon', render:(r) => '<span class="num">' + esc(r.c.phone) + '</span>' },
        { key:'total', label:'Toplam Satış', align:'right', render:(r) => '<span class="num strong">' + money(r.s.total) + '</span>' },
        { key:'paid', label:'Ödenen', align:'right', render:(r) =>
          '<span class="num ' + (r.s.paid > 0 ? 'text-success' : 'text-dim') + '">' + money(r.s.paid) + '</span>' },
        { key:'rem', label:'Kalan Borç', align:'right', render:(r) =>
          '<span class="num ' + (r.s.remaining > 0 ? 'text-danger strong' : 'text-dim') + '">' + money(r.s.remaining) + '</span>' },
        { key:'due', label:'Vade', render:(r) => {
            if (!r.s.dueDate) return '<span class="text-dim">—</span>';
            const tone = dueTone(r.s.dueDate, r.s.remaining);
            return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') +
                   '">' + fmtDate(r.s.dueDate) + '</span>'; } },
        { key:'st', label:'Durum', render:(r) =>
          r.s.remaining <= 0 ? badge('success','Borcu Yok','check')
          : r.s.isLate ? badge('danger','Gecikti','alert')
          : badge('warning','Açık Bakiye','clock') },
        { key:'_actions', label:'İşlem', align:'right', render:(r) =>
          '<div class="actions"><a class="btn btn-ghost btn-sm" href="#/musteri/' + r.c.id + '">' +
          icon('eye') + 'Detay</a></div>' }
      ], rows, { wide:true }) + '</div></section>'
  };
};

/* --- Müşteri detayı --- */
PAGES.musteri = function (id) {
  const c = customerById(id);
  if (!c) return { html: '<div class="empty">' + icon('users') + '<p>Müşteri bulunamadı.</p></div>' };

  const s = customerSummary(id);
  const ledger = customerLedger(id);
  const dTone = dueTone(s.dueDate, s.remaining);

  const dueText = s.dueDate ? fmtDate(s.dueDate) : '—';
  const dueNote = !s.dueDate ? 'Açık vade yok'
    : s.daysToDue < 0 ? Math.abs(s.daysToDue) + ' gün gecikti'
    : s.daysToDue === 0 ? 'Bugün son gün'
    : s.daysToDue + ' gün kaldı';

  const waMsg = encodeURIComponent(
    'Sayın ' + customerName(c) + ', NetStore hesabınızda ' + money(s.remaining) +
    ' tutarında açık bakiye görünmektedir. Son ödeme tarihi: ' + dueText + '.');
  const waLink = 'https://wa.me/' + c.phone.replace(/[^0-9]/g, '') + '?text=' + waMsg;
  const mailLink = 'mailto:' + c.email + '?subject=' +
    encodeURIComponent('NetStore — Hesap Ekstresi') + '&body=' + waMsg;

  return {
    html:
      '<div class="page-head">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<a class="btn btn-ghost btn-sm btn-icon" href="#/musteriler" aria-label="Geri">' + icon('arrowLeft') + '</a>' +
          '<div><h2>' + esc(customerName(c)) + '</h2>' +
          '<p class="sub">' + esc(c.type) + ' müşteri · ' + s.sales.length + ' fatura · ' +
          fmtDate(new Date(c.since)) + ' tarihinden beri</p></div>' +
        '</div>' +
        '<div class="head-actions">' +
          '<button class="btn btn-ghost" data-act="edit-customer">' + icon('edit') + 'Düzenle</button>' +
          '<button class="btn btn-success" data-act="add-payment" data-id="' + c.id + '">' +
            icon('handCoins') + 'Tahsilat Ekle</button>' +
        '</div>' +
      '</div>' +

      (s.isLate ? '<div class="alert alert-danger" style="margin-bottom:16px">' + icon('alert') +
        '<div><strong>Gecikmiş bakiye: ' + money(s.overdue) + '</strong>' +
        '<span class="alert-text">Vadesi geçmiş fatura(lar) mevcut. Müşteriyi bilgilendirmeniz önerilir.</span></div></div>' : '') +

      '<div class="grid grid-detail">' +

        /* --- sol sütun: kimlik + iletişim + eylemler --- */
        '<div class="grid" style="gap:16px">' +
          '<section class="card">' +
            '<div class="profile-card">' +
              '<div class="profile-avatar">' + esc(initials(c)) + '</div>' +
              '<div class="profile-name">' + esc(c.first) + ' ' + esc(c.last) + '</div>' +
              '<div class="profile-tag">' + esc(c.id.toUpperCase()) + ' · ' + esc(c.type) + '</div>' +
              '<div class="profile-badges">' +
                (s.remaining > 0
                  ? (s.isLate ? badge('danger','Gecikmiş Borç','alert') : badge('warning','Açık Bakiye','clock'))
                  : badge('success','Borcu Yok','check')) +
                badge('muted', s.sales.length + ' fatura') +
              '</div>' +
            '</div>' +
            '<div class="info-list">' +
              infoRow('phone','Telefon', esc(c.phone)) +
              infoRow('mail','E-posta','<a href="mailto:' + esc(c.email) + '" style="color:var(--info)">' + esc(c.email) + '</a>') +
              infoRow('mapPin','Adres', esc(c.addr)) +
              infoRow('calendar','Müşteri Olma Tarihi', fmtDate(new Date(c.since))) +
            '</div>' +
          '</section>' +

          '<section class="card"><div class="card-head"><h3>Hızlı İşlemler</h3></div>' +
            '<div class="card-body"><div class="action-row">' +
              '<button class="btn btn-success" data-act="add-payment" data-id="' + c.id + '">' +
                icon('handCoins') + 'Tahsilat Ekle</button>' +
              '<button class="btn btn-info" data-act="invoice">' + icon('invoice') + 'Fatura Oluştur</button>' +
              '<a class="btn btn-whatsapp" href="' + waLink + '" target="_blank" rel="noopener">' +
                icon('whatsapp') + 'WhatsApp Gönder</a>' +
              '<a class="btn btn-primary" href="' + mailLink + '">' + icon('mail') + 'E-posta Gönder</a>' +
              '<button class="btn btn-ghost" data-act="print">' + icon('printer') + 'Ekstre Yazdır</button>' +
              '<button class="btn btn-danger" data-act="delete-customer">' + icon('trash') + 'Müşteriyi Sil</button>' +
            '</div></div>' +
          '</section>' +
        '</div>' +

        /* --- sağ sütun: bakiye + hareketler --- */
        '<div class="grid" style="gap:16px">' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>Borç ve Tahsilat Özeti</h3>' +
            '<p class="sub">Tüm faturaların toplamı</p></div></div>' +
            '<div class="card-body">' +
              '<div class="balance-grid">' +
                balanceCell('Toplam Satış', money(s.total), 'var(--text)', s.sales.length + ' fatura') +
                balanceCell('Toplam Ödenen', money(s.paid), 'var(--success)',
                  s.pays.length + ' tahsilat · %' + (s.ratio * 100).toFixed(0)) +
                balanceCell('Kalan Borç', money(s.remaining),
                  s.remaining > 0 ? 'var(--danger)' : 'var(--text-3)',
                  s.remaining > 0 ? 'Tahsil edilmeyi bekliyor' : 'Bakiye kapandı') +
                balanceCell('Son Ödeme Tarihi', dueText,
                  dTone === 'danger' ? 'var(--danger)' : dTone === 'warning' ? 'var(--warning)' : 'var(--text-3)',
                  dueNote) +
              '</div>' +

              '<div class="meter" style="margin-top:18px">' +
                '<div class="meter-track" style="height:8px">' +
                  '<div class="meter-fill" style="width:' + (s.ratio * 100).toFixed(1) + '%;background:var(--success)"></div>' +
                '</div>' +
                '<div class="meter-legend">' +
                  '<span class="text-success">Ödenen ' + money(s.paid) + '</span>' +
                  '<span class="' + (s.remaining > 0 ? 'text-danger' : 'text-dim') + '">Kalan ' + money(s.remaining) + '</span>' +
                '</div>' +
              '</div>' +

              (s.lastPayment ? '<p class="text-dim" style="font-size:12px;margin-top:14px">' +
                'Son tahsilat: ' + fmtDate(s.lastPayment.date) + ' · ' + money(s.lastPayment.amount) +
                ' · ' + esc(s.lastPayment.method) + '</p>' : '') +
            '</div>' +
          '</section>' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>Tahsilat Geçmişi</h3>' +
            '<p class="sub">Her ödeme ve borç kaydı ayrı hareket</p></div>' +
            '<div class="head-actions"><button class="btn btn-success btn-sm" data-act="add-payment" data-id="' + c.id + '">' +
            icon('plus') + 'Tahsilat</button></div></div>' +
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
              }).join('') : '<div class="empty">' + icon('wallet') + '<p>Henüz hareket yok.</p></div>') +
            '</div></div>' +
          '</section>' +

          '<section class="card">' +
            '<div class="card-head"><div><h3>Satış Geçmişi</h3>' +
            '<p class="sub">' + s.sales.length + ' fatura</p></div></div>' +
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
      '<div class="page-head"><div><h2>Tahsilatlar</h2>' +
      '<p class="sub">' + PAYMENTS.length + ' hareket · ' + money(total) + ' toplam</p></div>' +
      '<div class="head-actions"><button class="btn btn-success" data-act="add-payment">' +
      icon('handCoins') + 'Tahsilat Ekle</button></div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'handCoins', tone:'success', label:'Toplam Tahsilat', value: money(total),
                   desc:'Tüm zamanlar', spark:'' }) +
        statCard({ icon:'calendar', tone:'accent', label:'Bu Ay', value: money(thisMonth.reduce((s, p) => s + p.amount, 0)),
                   desc: thisMonth.length + ' hareket', spark:'' }) +
        statCard({ icon:'scale', tone:'danger', label:'Bekleyen Alacak', value: money(kpis().receivable),
                   desc:'Henüz tahsil edilmedi', spark:'' }) +
      '</div>' +

      '<div class="grid grid-main">' +
        '<section class="card"><div class="card-head"><div><h3>Tahsilat Hareketleri</h3>' +
        '<p class="sub">En yeniden eskiye</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'cust', label:'Müşteri', render:(p) => customerLink(customerById(p.customerId)) },
          { key:'date', label:'Tarih', render:(p) => '<span class="num">' + fmtDate(p.date) + '</span>' },
          { key:'inv', label:'Fatura', render:(p) => {
              const s = saleById(p.saleId);
              return '<span class="invoice-no" style="font-weight:500">' + esc(s ? s.no : '—') + '</span>'; } },
          { key:'method', label:'Yöntem', render:(p) => badge('muted', p.method) },
          { key:'amount', label:'Tutar', align:'right', render:(p) =>
            '<span class="num text-success strong">' + signedMoney(p.amount) + '</span>' }
        ], PAYMENTS.slice(0, 40)) + '</div></section>' +

        '<section class="card"><div class="card-head"><div><h3>Ödeme Yöntemi</h3>' +
        '<p class="sub">Tahsilatların dağılımı</p></div></div>' +
        '<div class="card-body"><div id="methodBars"></div></div></section>' +
      '</div>',

    mount: function () {
      hBars(document.getElementById('methodBars'),
        Object.keys(byMethod).map((k) => ({ name: k, value: byMethod[k] }))
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
      '<div class="page-head"><div><h2>Borç / Alacak</h2>' +
      '<p class="sub">' + rows.length + ' müşteride açık bakiye</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="export">' + icon('download') + 'Rapor Al</button>' +
        '<button class="btn btn-success" data-act="add-payment">' + icon('handCoins') + 'Tahsilat Ekle</button>' +
      '</div></div>' +

      '<div class="grid grid-3" style="margin-bottom:16px">' +
        statCard({ icon:'scale', tone:'danger', label:'Toplam Alacak', value: money(totalRem),
                   desc:'Müşterilerden tahsil edilecek', spark:'' }) +
        statCard({ icon:'alert', tone:'warning', label:'Gecikmiş Alacak', value: money(overdue),
                   desc:'Vadesi geçmiş tutar',
                   trend:{ tone:'warn', text:'%' + ((overdue / (totalRem || 1)) * 100).toFixed(0) + ' payı', icon:'alert' }, spark:'' }) +
        statCard({ icon:'truck', tone:'info', label:'Tedarikçi Borcu', value: money(purchaseDebt),
                   desc:'İşletmenin ödeyeceği tutar', spark:'' }) +
      '</div>' +

      '<section class="card" style="margin-bottom:16px">' +
        '<div class="card-head"><div><h3>Alacak Yaşlandırma</h3>' +
        '<p class="sub">Açık bakiyenin vade durumuna göre dağılımı</p></div></div>' +
        '<div class="card-body"><div id="agingBar"></div></div></section>' +

      '<div class="grid">' +
        '<section class="card"><div class="card-head"><div><h3>Müşteri Bakiyeleri</h3>' +
        '<p class="sub">Bakiyesi en yüksekten başlayarak</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'cust', label:'Müşteri', render:(r) => customerLink(r.customer) },
          { key:'total', label:'Toplam Satış', align:'right', render:(r) => '<span class="num">' + money(r.sum.total) + '</span>' },
          { key:'paid', label:'Ödenen', align:'right', render:(r) => '<span class="num text-success">' + money(r.sum.paid) + '</span>' },
          { key:'rem', label:'Kalan Borç', align:'right', render:(r) => '<span class="num text-danger strong">' + money(r.sum.remaining) + '</span>' },
          { key:'due', label:'Son Ödeme', render:(r) => {
              const tone = dueTone(r.sum.dueDate, r.sum.remaining);
              return '<span class="num ' + (tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-muted') +
                     '">' + (r.sum.dueDate ? fmtDate(r.sum.dueDate) : '—') + '</span>'; } },
          { key:'st', label:'Durum', render:(r) => r.sum.isLate
              ? badge('danger', Math.abs(r.sum.daysToDue) + ' gün gecikti', 'alert')
              : r.sum.daysToDue <= 7 ? badge('warning','Vade yaklaştı','clock')
              : badge('muted','Vadesinde','clock') },
          { key:'_actions', label:'İşlem', align:'right', render:(r) =>
            '<div class="actions">' +
            '<button class="btn btn-success btn-sm" data-act="add-payment" data-id="' + r.customer.id + '">' +
            icon('handCoins') + 'Tahsilat</button></div>' }
        ], rows, { empty:'Açık bakiyesi olan müşteri yok.', wide:true }) + '</div></section>' +
      '</div>',

    mount: function () {
      stackedBar(document.getElementById('agingBar'), [
        { name:'Vadesi gelmemiş', value: aging.current, color:'#475569' },
        { name:'1–30 gün gecikmiş', value: aging.d30, color:'#F59E0B' },
        { name:'31–60 gün gecikmiş', value: aging.d60, color:'#EA580C' },
        { name:'60+ gün gecikmiş', value: aging.d90, color:'#EF4444' }
      ]);
    }
  };
};

/* --- Raporlar --- */
PAGES.raporlar = function () {
  const k = kpis();
  const s12 = monthlySeries(12);
  const top = topProducts(6);

  return {
    html:
      '<div class="page-head"><div><h2>Raporlar</h2>' +
      '<p class="sub">Son 12 ayın performans özeti</p></div>' +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost" data-act="print">' + icon('printer') + 'Yazdır</button>' +
        '<button class="btn btn-primary" data-act="export">' + icon('download') + 'Dışa Aktar</button>' +
      '</div></div>' +

      '<div class="grid grid-stats" style="margin-bottom:16px">' +
        statCard({ icon:'cart', tone:'accent', label:'Ciro', value: money(k.sales), desc:'12 aylık toplam satış',
                   spark: sparkline(s12.map((m) => m.sale), SERIES_1) }) +
        statCard({ icon:'coins', tone:'success', label:'Brüt Kâr', value: money(k.profit),
                   desc:'Ortalama marj %' + (k.margin * 100).toFixed(1).replace('.', ','),
                   spark: sparkline(s12.map((m) => m.profit), SERIES_2) }) +
        statCard({ icon:'truck', tone:'info', label:'Yatırım', value: money(k.invest), desc:'Toplam alış maliyeti', spark:'' }) +
      '</div>' +

      '<div class="grid grid-main" style="margin-bottom:16px">' +
        '<section class="card">' +
          '<div class="card-head"><div><h3>Aylık Satış ve Kâr</h3><p class="sub">Son 12 ay</p></div>' +
          '<div class="head-actions chart-legend">' +
            '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_1 + '"></span>Satış</span>' +
            '<span class="legend-key"><span class="legend-swatch" style="background:' + SERIES_2 + '"></span>Kâr</span>' +
          '</div></div>' +
          '<div class="card-body"><div id="repChart"></div></div>' +
        '</section>' +
        '<section class="card"><div class="card-head"><div><h3>Kategori Cirosu</h3>' +
        '<p class="sub">Tüm dönem</p></div></div>' +
        '<div class="card-body"><div id="repCat"></div></div></section>' +
      '</div>' +

      '<div class="grid grid-2">' +
        '<section class="card"><div class="card-head"><div><h3>En Çok Satan Ürünler</h3>' +
        '<p class="sub">Ciroya göre ilk 6</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'p', label:'Ürün', render:(r) => {
              const p = productById(r.pid);
              return '<span class="cell-main"><span class="thumb">' + icon('package') + '</span>' +
                '<span><span class="cell-title">' + esc(p ? p.name : '—') + '</span>' +
                '<span class="cell-sub">' + esc(p ? p.cat : '') + '</span></span></span>'; } },
          { key:'qty', label:'Adet', align:'right', render:(r) => '<span class="num">' + r.qty + '</span>' },
          { key:'rev', label:'Ciro', align:'right', render:(r) => '<span class="num strong">' + money(r.revenue) + '</span>' }
        ], top) + '</div></section>' +

        '<section class="card"><div class="card-head"><div><h3>Aylık Döküm</h3>' +
        '<p class="sub">Satış, kâr ve marj</p></div></div>' +
        '<div class="card-body flush">' +
        table([
          { key:'m', label:'Ay', render:(m) => '<span class="cell-title">' + esc(m.label + ' ' + m.year) + '</span>' },
          { key:'s', label:'Satış', align:'right', render:(m) => '<span class="num">' + money(m.sale) + '</span>' },
          { key:'p', label:'Kâr', align:'right', render:(m) => '<span class="num text-success">' + money(m.profit) + '</span>' },
          { key:'mg', label:'Marj', align:'right', render:(m) =>
            '<span class="num text-dim">' + (m.sale ? '%' + ((m.profit / m.sale) * 100).toFixed(0) : '—') + '</span>' }
        ], s12.slice().reverse()) + '</div></section>' +
      '</div>',

    mount: function () {
      lineChart(document.getElementById('repChart'), {
        data: s12,
        series: [{ key:'sale', name:'Satış', color: SERIES_1 },
                 { key:'profit', name:'Kâr', color: SERIES_2 }]
      });
      hBars(document.getElementById('repCat'), categoryTotals());
    }
  };
};

/* --- Personel --- */
PAGES.personel = function () {
  const perf = staffPerformance();
  const k = kpis();
  return {
    html:
      '<div class="page-head"><div><h2>Personel</h2>' +
      '<p class="sub">' + k.staffCount + ' aktif · ' + k.staffTotal + ' kayıtlı</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="new-staff">' +
      icon('plus') + 'Personel Ekle</button></div></div>' +

      '<section class="card"><div class="card-body flush">' +
      table([
        { key:'name', label:'Personel', render:(r) => {
            const s = staffById(r.staffId);
            return '<span class="cell-main"><span class="avatar">' +
              esc(s.name.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()) + '</span>' +
              '<span><span class="cell-title">' + esc(s.name) + '</span>' +
              '<span class="cell-sub">' + esc(s.role) + '</span></span></span>'; } },
        { key:'phone', label:'Telefon', render:(r) => '<span class="num">' + esc(staffById(r.staffId).phone) + '</span>' },
        { key:'start', label:'Başlangıç', render:(r) => '<span class="num">' + fmtDate(new Date(staffById(r.staffId).start)) + '</span>' },
        { key:'count', label:'Satış Adedi', align:'right', render:(r) => '<span class="num">' + r.count + '</span>' },
        { key:'rev', label:'Ciro', align:'right', render:(r) => '<span class="num strong">' + money(r.revenue) + '</span>' },
        { key:'st', label:'Durum', render:(r) => staffById(r.staffId).active
            ? badge('success','Aktif','check') : badge('muted','Pasif') },
        { key:'_actions', label:'İşlem', align:'right', render:() =>
          '<div class="actions">' + actionBtn('edit','Düzenle') + '</div>' }
      ], perf) + '</div></section>'
  };
};

/* --- Ayarlar --- */
PAGES.ayarlar = function () {
  return {
    html:
      '<div class="page-head"><div><h2>Ayarlar</h2>' +
      '<p class="sub">İşletme ve uygulama tercihleri</p></div>' +
      '<div class="head-actions"><button class="btn btn-primary" data-act="save-settings">' +
      icon('check') + 'Değişiklikleri Kaydet</button></div></div>' +

      '<div class="grid grid-2">' +
        '<section class="card"><div class="card-head"><div><h3>İşletme Bilgileri</h3>' +
        '<p class="sub">Faturalarda görünen bilgiler</p></div></div>' +
        '<div class="card-body">' +
          field('İşletme Adı','text','NetStore Elektronik') +
          field('Vergi No','text','1234567890') +
          field('Telefon','tel','+90 212 000 00 00') +
          field('E-posta','email','info@netstore.com') +
          '<div class="field"><label>Adres</label><textarea>Perpa Ticaret Merkezi A Blok Kat:5 No:312, Şişli / İstanbul</textarea></div>' +
        '</div></section>' +

        '<div class="grid" style="gap:16px;align-content:start">' +
          '<section class="card"><div class="card-head"><div><h3>Finans</h3>' +
          '<p class="sub">Para birimi ve vade tercihleri</p></div></div>' +
          '<div class="card-body">' +
            '<div class="field"><label>Para Birimi</label><select>' +
            '<option selected>Euro (€)</option><option>Türk Lirası (₺)</option><option>Dolar ($)</option>' +
            '</select></div>' +
            field('Varsayılan Vade (gün)','number','30') +
            '<div class="field"><label>Gecikme Uyarısı</label><select>' +
            '<option selected>Vade gününde</option><option>3 gün önce</option><option>7 gün önce</option>' +
            '</select><p class="hint">Vadesi yaklaşan faturalar dashboard\'da turuncu uyarı olarak gösterilir.</p></div>' +
          '</div></section>' +

          '<section class="card"><div class="card-head"><div><h3>Stok</h3>' +
          '<p class="sub">Kritik seviye uyarıları</p></div></div>' +
          '<div class="card-body">' +
            field('Varsayılan Minimum Stok','number','5') +
            '<div class="field"><label>Uyarı Kanalı</label><select>' +
            '<option selected>Uygulama içi</option><option>E-posta</option><option>WhatsApp</option>' +
            '</select></div>' +
          '</div></section>' +

          '<section class="card"><div class="card-head"><div><h3>Tehlikeli Bölge</h3>' +
          '<p class="sub">Bu işlemler geri alınamaz</p></div></div>' +
          '<div class="card-body"><div class="action-row">' +
            '<button class="btn btn-danger" data-act="reset-data">' + icon('refresh') + 'Verileri Sıfırla</button>' +
            '<button class="btn btn-danger" data-act="delete-account">' + icon('trash') + 'Hesabı Sil</button>' +
          '</div></div></section>' +
        '</div>' +
      '</div>'
  };
};

function field(label, type, value) {
  return '<div class="field"><label>' + esc(label) + '</label>' +
    '<input type="' + type + '" value="' + esc(value) + '"></div>';
}

/* ==========================================================================
   Kabuk: yönlendirme, menü, modal, bildirim
   ========================================================================== */

const STATE = { route:'dashboard', param:null, filter:'all' };

function renderSidebar() {
  let html = '';
  NAV.forEach((g) => {
    if (g.group) html += '<div class="nav-group-label">' + esc(g.group) + '</div>';
    g.items.forEach((it) => {
      const active = STATE.route === it.id ||
        (it.id === 'musteriler' && STATE.route === 'musteri');
      let badgeHtml = '';
      if (it.id === 'borc') {
        const n = openBalances().filter((r) => r.sum.isLate).length;
        if (n) badgeHtml = '<span class="nav-badge">' + n + '</span>';
      }
      if (it.id === 'stok') {
        const n = kpis().lowCount;
        if (n) badgeHtml = '<span class="nav-badge">' + n + '</span>';
      }
      html += '<a class="nav-item' + (active ? ' active' : '') + '" href="#/' + it.id + '">' +
        icon(it.icon) + '<span>' + esc(it.label) + '</span>' + badgeHtml + '</a>';
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
  document.getElementById('pageTitle').textContent = meta.title;
  document.getElementById('pageCrumb').textContent = meta.crumb;
  document.title = 'NetStore — ' + meta.title;

  const out = PAGES[STATE.route](STATE.param);
  const host = document.getElementById('page');
  host.innerHTML = out.html;
  host.scrollIntoView({ block:'start' });
  window.scrollTo(0, 0);

  renderSidebar();
  if (out.mount) out.mount();
  closeNav();
}

/* --- mobil çekmece --- */
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
    el.style.opacity = '0';
    el.style.transition = 'opacity 200ms';
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

/** Tahsilat ekleme — gerçekten kayıt oluşturur ve ekranı tazeler. */
function paymentModal(custId) {
  const open = openBalances();
  if (!open.length) { toast('Açık bakiyesi olan müşteri yok.', 'info'); return; }

  const target = custId && customerById(custId) ? custId : open[0].customer.id;
  const sum = customerSummary(target);
  const openSales = sum.sales.filter((s) => saleTotals(s).remaining > 0);

  openModal(
    '<div class="card-head"><div><h3>Tahsilat Ekle</h3>' +
    '<p class="sub">Ödeme, müşterinin bakiyesinden düşülür</p></div>' +
    '<div class="head-actions"><button class="btn btn-ghost btn-sm btn-icon" data-act="close-modal" aria-label="Kapat">' +
    icon('x') + '</button></div></div>' +
    '<div class="card-body">' +
      '<div class="field"><label>Müşteri</label><select id="pmCust">' +
      open.map((r) => '<option value="' + r.customer.id + '"' + (r.customer.id === target ? ' selected' : '') + '>' +
        esc(customerName(r.customer)) + ' — ' + money(r.sum.remaining) + ' borç</option>').join('') +
      '</select></div>' +
      '<div class="field"><label>Fatura</label><select id="pmSale">' +
      openSales.map((s) => '<option value="' + s.id + '">' + esc(s.no) + ' — ' +
        money(saleTotals(s).remaining) + ' kalan</option>').join('') +
      '</select></div>' +
      '<div class="field"><label>Tutar (€)</label>' +
      '<input type="number" id="pmAmount" min="1" step="1" value="' +
      (openSales.length ? Math.round(saleTotals(openSales[0]).remaining) : 0) + '">' +
      '<p class="hint">Kalan borçtan fazlası girilemez.</p></div>' +
      '<div class="field"><label>Ödeme Yöntemi</label><select id="pmMethod">' +
      '<option>Nakit</option><option>Havale/EFT</option><option>Kredi Kartı</option></select></div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-act="close-modal">Vazgeç</button>' +
      '<button class="btn btn-success" data-act="save-payment">' + icon('handCoins') + 'Tahsilatı Kaydet</button>' +
    '</div>'
  );

  /* müşteri değişince fatura listesi güncellenir */
  document.getElementById('pmCust').addEventListener('change', function () {
    const s2 = customerSummary(this.value);
    const list = s2.sales.filter((s) => saleTotals(s).remaining > 0);
    document.getElementById('pmSale').innerHTML = list.map((s) =>
      '<option value="' + s.id + '">' + esc(s.no) + ' — ' + money(saleTotals(s).remaining) + ' kalan</option>').join('');
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

  if (!sale) { toast('Kapatılacak açık fatura yok.', 'warning'); return; }
  if (!amount || amount <= 0) { toast('Geçerli bir tutar girin.', 'warning'); return; }

  const rem = saleTotals(sale).remaining;
  const final = Math.min(amount, rem);

  PAYMENTS.unshift({
    id: 'pm' + (PAYMENTS.length + 1000),
    saleId: saleId, customerId: custId,
    date: new Date(TODAY), amount: final, method: method
  });
  PAYMENTS.sort((a, b) => b.date - a.date);

  closeModal();
  render();
  toast(money(final) + ' tahsilat kaydedildi.');
}

/* --- olaylar --- */
document.addEventListener('click', function (ev) {
  const nav = ev.target.closest('[data-nav]');
  if (nav) { ev.preventDefault(); nav.dataset.nav === 'open' ? openNav() : closeNav(); return; }

  const seg = ev.target.closest('[data-seg] button');
  if (seg) { STATE.filter = seg.dataset.val; render(); return; }

  const a = ev.target.closest('[data-act]');
  if (!a) {
    if (ev.target.id === 'modalHost') closeModal();
    return;
  }

  const act = a.dataset.act;

  if (act === 'add-payment')   { paymentModal(a.dataset.id); return; }
  if (act === 'save-payment')  { savePayment(); return; }
  if (act === 'close-modal')   { closeModal(); return; }
  if (act === 'print')         { window.print(); return; }

  /* Bu ekranlar tasarım şablonu olarak hazır; kayıt formları veri katmanına
     bağlandığında aynı modal düzeni kullanılacak. */
  const messages = {
    'new-sale':'Yeni satış ekranı', 'new-invoice':'Fatura oluşturma ekranı',
    'new-product':'Yeni ürün formu', 'new-customer':'Yeni müşteri formu',
    'new-purchase':'Yeni alış formu', 'new-staff':'Personel ekleme formu',
    'stock-in':'Stok giriş formu', 'invoice':'Fatura önizleme',
    'edit-customer':'Müşteri düzenleme formu', 'export':'Dışa aktarma'
  };
  if (messages[act]) { toast(messages[act] + ' henüz bağlanmadı.', 'info'); return; }

  if (act === 'delete-customer' || act === 'reset-data' || act === 'delete-account') {
    toast('Tehlikeli işlem — onay adımı gerekiyor.', 'warning');
    return;
  }
  if (act === 'save-settings') { toast('Ayarlar kaydedildi.'); return; }
});

document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape') { closeModal(); closeNav(); }
});

window.addEventListener('hashchange', render);

document.addEventListener('DOMContentLoaded', function () {
  hydrateIcons(document);
  render();
});
