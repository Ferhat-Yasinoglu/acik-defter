/* ==========================================================================
   NetStore — veri katmanı
   Örnek veri seti + türetilmiş hesaplar. Tüm KPI'lar, durumlar ve grafikler
   aynı kayıtlardan hesaplanır; hiçbir yerde elle girilmiş "sahte toplam" yok.

   Çok dillilik: kayıtlarda ETİKET ANAHTARI tutulur ('phone', 'cash', …),
   ekranda i18n ile çevrilir. Özel adlar iki yazımda saklanır (Latin / فارسی).
   Para birimi: Afgani (AFN / افغانی).
   ========================================================================== */

/* --- bugünün tarihi (örnek verinin çapası) --- */
const TODAY = new Date(2026, 7, 19); // 19.08.2026

/** Çok yazımlı metin seçici: {en:'Ahmad', fa:'احمد'} → seçili dile göre. */
function L(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  return v[lang()] || v.en || v.fa || '';
}

function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

/* --- deterministik rastgelelik (her yüklemede aynı veri) --- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260819);
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function between(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

/* ==========================================================================
   Ana kayıtlar — fiyatlar Afgani (AFN)
   ========================================================================== */

const PRODUCTS = [
  { id:'p1',  sku:'NS-1001', name:'iPhone 15 Pro 256GB',        cat:'phone',     buy:62000, sell:77000, stock:14, min: 5, sup:'s_arel' },
  { id:'p2',  sku:'NS-1002', name:'Samsung Galaxy S24 128GB',   cat:'phone',     buy:45000, sell:56000, stock: 9, min: 5, sup:'s_arel' },
  { id:'p3',  sku:'NS-1003', name:'Xiaomi Redmi Note 13',       cat:'phone',     buy:12500, sell:17500, stock:38, min:10, sup:'s_mega' },
  { id:'p4',  sku:'NS-2001', name:'MacBook Air M3 13"',         cat:'computer',  buy:71000, sell:90000, stock: 4, min: 4, sup:'s_arel' },
  { id:'p5',  sku:'NS-2002', name:'Lenovo IdeaPad 15 i5',       cat:'computer',  buy:32000, sell:42000, stock:11, min: 4, sup:'s_mega' },
  { id:'p6',  sku:'NS-2003', name:'Asus TUF Gaming F15',        cat:'computer',  buy:55000, sell:66500, stock: 3, min: 4, sup:'s_nova' },
  { id:'p7',  sku:'NS-3001', name:'AirPods Pro 2',              cat:'accessory', buy:11500, sell:16000, stock:26, min:10, sup:'s_nova' },
  { id:'p8',  sku:'NS-3002', name:'Anker 20.000mAh Powerbank',  cat:'accessory', buy: 2000, sell: 3400, stock:62, min:20, sup:'s_mega' },
  { id:'p9',  sku:'NS-3003', name:'Baseus 65W Charger',         cat:'accessory', buy: 1000, sell: 2000, stock: 8, min:20, sup:'s_mega' },
  { id:'p10', sku:'NS-3004', name:'Logitech MX Master 3S',      cat:'accessory', buy: 5000, sell: 7600, stock:17, min: 8, sup:'s_nova' },
  { id:'p11', sku:'NS-4001', name:'Samsung 27" Curved',         cat:'display',   buy: 8200, sell:11400, stock: 6, min: 5, sup:'s_nova' },
  { id:'p12', sku:'NS-4002', name:'LG UltraGear 32" 165Hz',     cat:'display',   buy:22500, sell:30000, stock: 2, min: 4, sup:'s_nova' },
  { id:'p13', sku:'NS-5001', name:'Apple Watch Series 9',       cat:'wearable',  buy:22500, sell:30000, stock:12, min: 5, sup:'s_arel' },
  { id:'p14', sku:'NS-5002', name:'Xiaomi Smart Band 8',        cat:'wearable',  buy: 1500, sell: 3200, stock:41, min:15, sup:'s_mega' }
];

const SUPPLIER_NAMES = {
  s_arel: { en:'Arya Technology',   fa:'تکنالوژی آریا' },
  s_mega: { en:'Mega Distribution', fa:'توزیع مگا' },
  s_nova: { en:'Nova Electronics',  fa:'الکترونیک نوا' }
};

const CUSTOMERS = [
  { id:'c1',  first:{en:'Ahmad',   fa:'احمد'},   last:{en:'Rahimi',      fa:'رحیمی'},
    phone:'+93 70 412 22 07', email:'ahmad.rahimi@gmail.com', type:'personal', since:'2024-03-11',
    addr:{ en:'Shar-e Naw, Charahi Ansari, House 44, Kabul', fa:'شهر نو، چهارراهی انصاری، خانه ۴۴، کابل' } },

  { id:'c2',  first:{en:'Zahra',   fa:'زهرا'},   last:{en:'Hosseini',    fa:'حسینی'},
    phone:'+93 79 902 14 63', email:'zahra.hosseini@outlook.com', type:'personal', since:'2024-06-02',
    addr:{ en:'Karte Se, Street 3, Kabul', fa:'کارته سه، کوچه سوم، کابل' } },

  { id:'c3',  first:{en:'Kunduz',  fa:'کندز'},   last:{en:'Electronics', fa:'الکترونیک'},
    phone:'+93 20 640 18 90', email:'accounts@kunduzelectronics.af', type:'corporate', since:'2023-11-20',
    addr:{ en:'Spin Zar Market, Block B, Floor 3, Kunduz', fa:'مارکیت سپین زر، بلاک ب، منزل سوم، کندز' } },

  { id:'c4',  first:{en:'Fatima',  fa:'فاطمه'},  last:{en:'Nazari',      fa:'نظری'},
    phone:'+93 77 337 08 12', email:'fatima.nazari@gmail.com', type:'personal', since:'2025-01-14',
    addr:{ en:'Jada-e Maiwand, Herat', fa:'جادهٔ میوند، هرات' } },

  { id:'c5',  first:{en:'Mohammad',fa:'محمد'},   last:{en:'Ayubi',       fa:'ایوبی'},
    phone:'+93 78 774 55 21', email:'m.ayubi@yahoo.com', type:'personal', since:'2024-09-08',
    addr:{ en:'Darulaman Road, District 6, Kabul', fa:'سرک دارالامان، ناحیه ششم، کابل' } },

  { id:'c6',  first:{en:'Ariana',  fa:'آریانا'}, last:{en:'Systems',     fa:'سیستمز'},
    phone:'+93 20 505 33 74', email:'purchase@arianasystems.af', type:'corporate', since:'2023-05-30',
    addr:{ en:'Kabul Business Center, Floor 5, Kabul', fa:'مرکز تجارتی کابل، منزل پنجم، کابل' } },

  { id:'c7',  first:{en:'Maryam',  fa:'مریم'},   last:{en:'Sadat',       fa:'سادات'},
    phone:'+93 76 218 47 96', email:'maryam.sadat@gmail.com', type:'personal', since:'2025-04-19',
    addr:{ en:'Bagh-e Zanana Street, Mazar-i-Sharif', fa:'سرک باغ زنانه، مزار شریف' } },

  { id:'c8',  first:{en:'Omar',    fa:'عمر'},    last:{en:'Stanikzai',   fa:'ستانکزی'},
    phone:'+93 70 641 90 38', email:'omar.stanikzai@hotmail.com', type:'personal', since:'2024-12-03',
    addr:{ en:'Aino Mena, Block 12, Kandahar', fa:'عینو مینه، بلاک ۱۲، کندهار' } },

  { id:'c9',  first:{en:'Salma',   fa:'سلما'},   last:{en:'Karimi',      fa:'کریمی'},
    phone:'+93 74 806 27 55', email:'salma.karimi@gmail.com', type:'personal', since:'2025-02-27',
    addr:{ en:'Bandar Street, Jalalabad', fa:'سرک بندر، جلال‌آباد' } },

  { id:'c10', first:{en:'Bilal',   fa:'بلال'},   last:{en:'Ahmadzai',    fa:'احمدزی'},
    phone:'+93 72 195 62 40', email:'bilal.ahmadzai@gmail.com', type:'personal', since:'2025-06-11',
    addr:{ en:'Chowk-e Gulha, Kunduz', fa:'چوک گل‌ها، کندز' } }
];

const STAFF = [
  { id:'s1', name:{en:'Farhad Yaqoobi', fa:'فرهاد یعقوبی'}, role:'manager',    phone:'+93 70 000 11 22', email:'farhad@netstore.af',  active:true,  start:'2023-01-09' },
  { id:'s2', name:{en:'Elham Nuri',     fa:'الهام نوری'},    role:'sales',      phone:'+93 79 224 78 10', email:'elham@netstore.af',   active:true,  start:'2024-02-15' },
  { id:'s3', name:{en:'Karim Osmani',   fa:'کریم عثمانی'},   role:'sales',      phone:'+93 77 619 30 87', email:'karim@netstore.af',   active:true,  start:'2024-08-01' },
  { id:'s4', name:{en:'Diba Kohistani', fa:'دیبا کوهستانی'}, role:'warehouse',  phone:'+93 78 442 16 05', email:'diba@netstore.af',    active:true,  start:'2025-03-20' },
  { id:'s5', name:{en:'Nasir Baheer',   fa:'ناصر بهیر'},     role:'accounting', phone:'+93 76 738 92 41', email:'nasir@netstore.af',   active:true,  start:'2023-10-05' },
  { id:'s6', name:{en:'Sima Aktash',    fa:'سیما آکتاش'},    role:'sales',      phone:'+93 73 908 55 63', email:'sima@netstore.af',    active:false, start:'2024-05-12' }
];

const SUPPLIERS = ['s_arel', 's_mega', 's_nova'];
const METHODS = ['cash', 'transfer', 'card'];

/* ==========================================================================
   Satış & tahsilat kayıtları
   ========================================================================== */

const SALES = [];
const PAYMENTS = [];
const PURCHASES = [];

let _saleSeq = 1, _paySeq = 1, _purSeq = 1;

function invoiceNo(d, seq) {
  return 'FT-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') +
         '-' + String(seq).padStart(4, '0');
}

function addSale(dateStr, custId, staffId, items, dueDays, payPlan) {
  const d = new Date(dateStr);
  const sale = {
    id: 'sl' + _saleSeq,
    no: invoiceNo(d, _saleSeq),
    customerId: custId,
    staffId: staffId,
    date: d,
    due: addDays(d, dueDays),
    items: items.map((it) => ({ pid: it[0], qty: it[1], price: it[2] }))
  };
  _saleSeq++;
  SALES.push(sale);

  (payPlan || []).forEach((p) => {
    PAYMENTS.push({
      id: 'pm' + _paySeq++,
      saleId: sale.id,
      customerId: custId,
      date: addDays(d, p[0]),
      amount: p[1],
      method: p[2] || 'cash'
    });
  });
  return sale;
}

/* --- geçmiş 12 ay: otomatik üretilen hareketler --- */
(function seedHistory() {
  /* c1 örnek senaryonun sahibi: yalnızca elle tanımlı faturaları olsun,
     böylece yarısı tahsil edilmiş / vadesi yaklaşan örnek net kalır. */
  const cIds = CUSTOMERS.filter((c) => c.id !== 'c1').map((c) => c.id);
  const sIds = STAFF.filter((s) => s.active).map((s) => s.id);

  for (let back = 11; back >= 1; back--) {
    const base = new Date(TODAY.getFullYear(), TODAY.getMonth() - back, 1);
    const count = between(5, 8);

    for (let i = 0; i < count; i++) {
      const day = between(1, 26);
      const d = new Date(base.getFullYear(), base.getMonth(), day);
      const items = [];
      const lines = between(1, 3);
      for (let k = 0; k < lines; k++) {
        const pr = pick(PRODUCTS);
        if (items.some((it) => it[0] === pr.id)) continue;
        items.push([pr.id, between(1, pr.sell > 40000 ? 2 : 4), pr.sell]);
      }
      if (!items.length) continue;

      const total = items.reduce((s, it) => s + it[1] * it[2], 0);
      const r = rnd();
      let plan;
      if (r < 0.72)      plan = [[0, total, pick(METHODS)]];
      else if (r < 0.9)  plan = [[0, Math.round(total * 0.5), pick(METHODS)],
                                 [between(12, 30), total - Math.round(total * 0.5), pick(METHODS)]];
      else               plan = [[0, Math.round(total * 0.4), pick(METHODS)]];
      addSale(d, pick(cIds), pick(sIds), items, 30, plan);
    }
  }
})();

/* --- son haftalar: senaryoyu netleştiren sabit kayıtlar --- */

// Ahmad Rahimi — açık borç örneği: 35.000 satış, yarısı tahsil, vade 25.08.2026
addSale('2026-07-26', 'c1', 's2', [['p7', 1, 16000], ['p10', 1, 7600], ['p11', 1, 11400]], 30,
        [[6, 10500, 'transfer'], [19, 7000, 'cash']]);

// Ahmad Rahimi — kapanmış geçmiş satış
addSale('2026-05-14', 'c1', 's1', [['p3', 1, 17500], ['p8', 2, 3400]], 14,
        [[0, 24300, 'card']]);

// Kunduz Electronics — kurumsal, kısmi ödeme
addSale('2026-08-04', 'c3', 's1', [['p1', 3, 77000], ['p7', 4, 16000]], 30,
        [[2, 140000, 'transfer']]);

// Zahra Hosseini — gecikmiş
addSale('2026-06-18', 'c2', 's3', [['p4', 1, 90000]], 30,
        [[1, 35000, 'transfer']]);

// Ariana Systems — gecikmiş, büyük bakiye
addSale('2026-06-30', 'c6', 's1', [['p5', 4, 42000], ['p12', 2, 30000]], 30,
        [[3, 85000, 'transfer']]);

// Fatima Nazari — tamamlandı
addSale('2026-08-11', 'c4', 's2', [['p13', 1, 30000], ['p14', 2, 3200]], 15,
        [[0, 36400, 'card']]);

// Mohammad Ayubi — ödeme bekliyor (henüz hiç tahsilat yok)
addSale('2026-08-14', 'c5', 's3', [['p2', 1, 56000]], 21, []);

// Maryam Sadat — tamamlandı
addSale('2026-08-16', 'c7', 's2', [['p7', 2, 16000], ['p9', 1, 2000]], 7,
        [[0, 34000, 'cash']]);

// Omar Stanikzai — kısmi
addSale('2026-08-17', 'c8', 's3', [['p6', 1, 66500]], 30,
        [[0, 28000, 'card']]);

// Salma Karimi — tamamlandı
addSale('2026-08-18', 'c9', 's2', [['p10', 1, 7600], ['p8', 1, 3400]], 7,
        [[0, 11000, 'cash']]);

// Bilal Ahmadzai — ödeme bekliyor
addSale('2026-08-18', 'c10', 's1', [['p11', 2, 11400]], 14, []);

/* --- alışlar (tedarikçiden) --- */
(function seedPurchases() {
  for (let back = 11; back >= 0; back--) {
    const base = new Date(TODAY.getFullYear(), TODAY.getMonth() - back, 1);
    const count = between(1, 3);
    for (let i = 0; i < count; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), between(1, 25));
      if (d > TODAY) continue;
      const items = [];
      const lines = between(2, 4);
      for (let k = 0; k < lines; k++) {
        const pr = pick(PRODUCTS);
        if (items.some((it) => it.pid === pr.id)) continue;
        items.push({ pid: pr.id, qty: between(4, 20), price: pr.buy });
      }
      const total = items.reduce((s, it) => s + it.qty * it.price, 0);
      PURCHASES.push({
        id: 'pu' + _purSeq,
        no: 'AL-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') +
            '-' + String(_purSeq).padStart(4, '0'),
        supplier: pick(SUPPLIERS),
        date: d,
        items: items,
        total: total,
        paid: rnd() < 0.8 ? total : Math.round(total * 0.6)
      });
      _purSeq++;
    }
  }
  PURCHASES.sort((a, b) => b.date - a.date);
})();

SALES.sort((a, b) => b.date - a.date);
PAYMENTS.sort((a, b) => b.date - a.date);

/* ==========================================================================
   Türetilmiş hesaplar
   ========================================================================== */

const productById  = (id) => PRODUCTS.find((p) => p.id === id);
const customerById = (id) => CUSTOMERS.find((c) => c.id === id);
const staffById    = (id) => STAFF.find((s) => s.id === id);
const saleById     = (id) => SALES.find((s) => s.id === id);
const supplierName = (k) => L(SUPPLIER_NAMES[k] || k);

function customerName(c) { return c ? L(c.first) + ' ' + L(c.last) : '—'; }
function staffName(s) { return s ? L(s.name) : '—'; }

function initials(c) {
  if (!c) return '?';
  const f = L(c.first), l = L(c.last);
  return ((f[0] || '') + (l[0] || '')).toUpperCase();
}
function staffInitials(s) {
  const n = staffName(s).split(' ');
  return ((n[0] ? n[0][0] : '') + (n[1] ? n[1][0] : '')).toUpperCase();
}

/** Bir satışın toplam / maliyet / kâr / tahsil edilen / kalan değerleri. */
function saleTotals(sale) {
  let total = 0, cost = 0;
  sale.items.forEach((it) => {
    const p = productById(it.pid);
    total += it.qty * it.price;
    cost  += it.qty * (p ? p.buy : 0);
  });
  const paid = PAYMENTS.filter((p) => p.saleId === sale.id)
                       .reduce((s, p) => s + p.amount, 0);
  return { total, cost, profit: total - cost, paid, remaining: Math.max(0, total - paid) };
}

/**
 * Satış durumu — anahtar sabit, etiket dile göre çözülür.
 *  paid    → Tamamlandı     (yeşil)
 *  late    → Gecikti        (kırmızı)
 *  partial → Kısmi Ödeme    (turuncu)
 *  pending → Ödeme Bekliyor (turuncu)
 */
function saleStatus(sale) {
  const t2 = saleTotals(sale);
  if (t2.remaining <= 0.005) return { key:'paid',    label:t('st_paid'),    tone:'success', icon:'check' };
  if (sale.due < TODAY)      return { key:'late',    label:t('st_late'),    tone:'danger',  icon:'alert',
                                      days: daysBetween(sale.due, TODAY) };
  if (t2.paid > 0)           return { key:'partial', label:t('st_partial'), tone:'warning', icon:'clock' };
  return                            { key:'pending', label:t('st_pending'), tone:'warning', icon:'clock' };
}

/** Müşterinin borç / tahsilat özeti. */
function customerSummary(custId) {
  const sales = SALES.filter((s) => s.customerId === custId);
  const pays  = PAYMENTS.filter((p) => p.customerId === custId);

  let total = 0, paid = 0, profit = 0, overdue = 0;
  let lastDue = null;

  sales.forEach((s) => {
    const t2 = saleTotals(s);
    total += t2.total; paid += t2.paid; profit += t2.profit;
    if (t2.remaining > 0) {
      if (s.due < TODAY) overdue += t2.remaining;
      if (!lastDue || s.due < lastDue) lastDue = s.due;   // en yakın vade
    }
  });

  const remaining = Math.max(0, total - paid);
  const lastPayment = pays.length ? pays.reduce((a, b) => (a.date > b.date ? a : b)) : null;

  return {
    sales, pays, total, paid, remaining, profit, overdue,
    dueDate: lastDue,
    daysToDue: lastDue ? daysBetween(TODAY, lastDue) : null,
    isLate: overdue > 0,
    lastPayment,
    ratio: total > 0 ? paid / total : 1
  };
}

/** Vade durumunun renk tonu: geçti → kırmızı, 7 gün içinde → turuncu. */
function dueTone(due, remaining) {
  if (!due || remaining <= 0) return 'muted';
  const d = daysBetween(TODAY, due);
  if (d < 0) return 'danger';
  if (d <= 7) return 'warning';
  return 'muted';
}

/** Müşterinin tahsilat geçmişi — her ödeme ve her borç kaydı ayrı hareket. */
function customerLedger(custId) {
  const rows = [];
  SALES.filter((s) => s.customerId === custId).forEach((s) => {
    const t2 = saleTotals(s);
    rows.push({
      kind:'debt', date:s.date, amount:t2.total, saleNo:s.no, saleId:s.id,
      title: t('f_debt_created'),
      note: s.no + ' · ' + t('f_n_lines', { n: num(s.items.length) })
    });
  });
  PAYMENTS.filter((p) => p.customerId === custId).forEach((p) => {
    const s = saleById(p.saleId);
    rows.push({
      kind:'payment', date:p.date, amount:p.amount, saleNo:s ? s.no : '—', saleId:p.saleId,
      title: t('f_payment'),
      note: methodLabel(p.method) + (s ? ' · ' + s.no : '')
    });
  });
  rows.sort((a, b) => b.date - a.date || (a.kind === 'payment' ? -1 : 1));
  return rows;
}

/* --- işletme geneli KPI --- */
function kpis() {
  let sales = 0, profit = 0, paid = 0;
  SALES.forEach((s) => {
    const t2 = saleTotals(s);
    sales += t2.total; profit += t2.profit; paid += t2.paid;
  });

  const invest = PURCHASES.reduce((s, p) => s + p.total, 0);
  const stockUnits = PRODUCTS.reduce((s, p) => s + p.stock, 0);
  const stockValue = PRODUCTS.reduce((s, p) => s + p.stock * p.buy, 0);
  const low = PRODUCTS.filter((p) => p.stock <= p.min);
  const activeStaff = STAFF.filter((s) => s.active);

  return {
    invest, sales, profit, paid,
    receivable: Math.max(0, sales - paid),
    margin: sales > 0 ? profit / sales : 0,
    stockUnits, stockValue,
    low, lowCount: low.length,
    outOfRisk: PRODUCTS.filter((p) => p.stock <= Math.max(1, Math.floor(p.min / 2))).length,
    activeStaff, staffCount: activeStaff.length, staffTotal: STAFF.length
  };
}

/**
 * Son N ayın satış / kâr serisi.
 * Gruplama SEÇİLİ TAKVİME göre yapılır: hicri-şemsi seçiliyken kovalar da
 * şemsi aylardır, miladi ay sınırları değil. Etiket saklanmaz; her kova
 * kendi temsilci tarihini taşır, ad ve yıl ekranda çözülür.
 */
function monthlySeries(n) {
  const buckets = {}, order = [];
  const cur = new Date(TODAY);
  const floor = new Date(TODAY.getFullYear() - 3, 0, 1);

  while (order.length < n && cur >= floor) {
    const k = monthKey(cur);
    if (!buckets[k]) {
      buckets[k] = { key: k, ref: new Date(cur), sale: 0, profit: 0 };
      order.push(k);
    }
    cur.setDate(cur.getDate() - 1);
  }
  order.reverse();

  SALES.forEach((s) => {
    const b = buckets[monthKey(s.date)];
    if (!b) return;
    const t2 = saleTotals(s);
    b.sale += t2.total; b.profit += t2.profit;
  });

  return order.map((k) => buckets[k]);
}

/** Seçili takvimde, verilen tarihin ayının ilk günü. */
function calMonthStart(d) {
  const k = monthKey(d);
  const x = new Date(d);
  while (monthKey(new Date(x.getFullYear(), x.getMonth(), x.getDate() - 1)) === k) {
    x.setDate(x.getDate() - 1);
  }
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Kategori bazlı satış cirosu (anahtar döner, etiket ekranda çözülür). */
function categoryTotals() {
  const map = {};
  SALES.forEach((s) => s.items.forEach((it) => {
    const p = productById(it.pid);
    if (!p) return;
    map[p.cat] = (map[p.cat] || 0) + it.qty * it.price;
  }));
  return Object.keys(map).map((k) => ({ key: k, value: map[k] }))
               .sort((a, b) => b.value - a.value);
}

/** En çok satan ürünler. */
function topProducts(n) {
  const map = {};
  SALES.forEach((s) => s.items.forEach((it) => {
    if (!map[it.pid]) map[it.pid] = { pid: it.pid, qty: 0, revenue: 0 };
    map[it.pid].qty += it.qty;
    map[it.pid].revenue += it.qty * it.price;
  }));
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, n);
}

/** Personel satış performansı. */
function staffPerformance() {
  const map = {};
  SALES.forEach((s) => {
    if (!map[s.staffId]) map[s.staffId] = { staffId: s.staffId, count: 0, revenue: 0 };
    map[s.staffId].count++;
    map[s.staffId].revenue += saleTotals(s).total;
  });
  return STAFF.map((s) => Object.assign(
    { staffId: s.id, count: 0, revenue: 0 }, map[s.id] || {}
  )).sort((a, b) => b.revenue - a.revenue);
}

/** Açık bakiyesi olan müşteriler. */
function openBalances() {
  return CUSTOMERS
    .map((c) => ({ customer: c, sum: customerSummary(c.id) }))
    .filter((r) => r.sum.remaining > 0)
    .sort((a, b) => b.sum.remaining - a.sum.remaining);
}

/** Yaşlandırma: bakiyenin vade durumuna göre dağılımı. */
function agingBuckets() {
  const b = { current: 0, d30: 0, d60: 0, d90: 0 };
  SALES.forEach((s) => {
    const t2 = saleTotals(s);
    if (t2.remaining <= 0) return;
    const late = daysBetween(s.due, TODAY);
    if (late <= 0) b.current += t2.remaining;
    else if (late <= 30) b.d30 += t2.remaining;
    else if (late <= 60) b.d60 += t2.remaining;
    else b.d90 += t2.remaining;
  });
  return b;
}

/**
 * Önceki aya göre değişim.
 * İçinde bulunulan ay henüz bitmediği için, geçen ayın TAMAMIYLA değil
 * aynı gün aralığıyla (1–bugün) karşılaştırılır.
 */
function periodTotals(start, end, field) {
  let sale = 0, profit = 0;
  SALES.forEach((s) => {
    if (s.date >= start && s.date <= end) {
      const t2 = saleTotals(s);
      sale += t2.total; profit += t2.profit;
    }
  });
  return field === 'profit' ? profit : sale;
}

function momChange(field) {
  const curStart = calMonthStart(TODAY);
  const elapsed = daysBetween(curStart, TODAY);              // ayın kaçıncı gününde olduğumuz

  const prevEndDay = new Date(curStart); prevEndDay.setDate(prevEndDay.getDate() - 1);
  const prevStart = calMonthStart(prevEndDay);
  const prevEnd = addDays(prevStart, elapsed);
  prevEnd.setHours(23, 59, 59);

  const cur = periodTotals(curStart, TODAY, field);
  const prev = periodTotals(prevStart, prevEnd, field);
  if (!prev) return null;
  return (cur - prev) / prev;
}
