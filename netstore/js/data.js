/* ==========================================================================
   NetStore — veri katmanı
   Örnek veri seti + türetilmiş hesaplar. Tüm KPI'lar, durumlar ve grafikler
   aynı kayıtlardan hesaplanır; hiçbir yerde elle girilmiş "sahte toplam" yok.
   ========================================================================== */

/* --- bugünün tarihi (örnek verinin çapası) --- */
const TODAY = new Date(2026, 7, 19); // 19.08.2026

/* --- para / tarih biçimlendirme --- */
const _money = new Intl.NumberFormat('tr-TR', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0
});
const _money2 = new Intl.NumberFormat('tr-TR', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2
});
const _int = new Intl.NumberFormat('tr-TR');

function money(v, exact) { return (exact ? _money2 : _money).format(v || 0); }
function num(v) { return _int.format(v || 0); }
function signedMoney(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + money(Math.abs(v)); }

function fmtDate(d) {
  const x = d instanceof Date ? d : new Date(d);
  return String(x.getDate()).padStart(2, '0') + '.' +
         String(x.getMonth() + 1).padStart(2, '0') + '.' + x.getFullYear();
}
function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

const MONTHS_SHORT = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

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
   Ana kayıtlar
   ========================================================================== */

const PRODUCTS = [
  { id:'p1',  sku:'NS-1001', name:'iPhone 15 Pro 256GB',       cat:'Telefon',    buy: 890, sell:1099, stock: 14, min: 5,  sup:'Arel Teknoloji' },
  { id:'p2',  sku:'NS-1002', name:'Samsung Galaxy S24 128GB',  cat:'Telefon',    buy: 640, sell: 799, stock:  9, min: 5,  sup:'Arel Teknoloji' },
  { id:'p3',  sku:'NS-1003', name:'Xiaomi Redmi Note 13',      cat:'Telefon',    buy: 180, sell: 249, stock: 38, min:10,  sup:'Mega Dağıtım' },
  { id:'p4',  sku:'NS-2001', name:'MacBook Air M3 13"',        cat:'Bilgisayar', buy:1010, sell:1289, stock:  4, min: 4,  sup:'Arel Teknoloji' },
  { id:'p5',  sku:'NS-2002', name:'Lenovo IdeaPad 15 i5',      cat:'Bilgisayar', buy: 460, sell: 599, stock: 11, min: 4,  sup:'Mega Dağıtım' },
  { id:'p6',  sku:'NS-2003', name:'Asus TUF Gaming F15',       cat:'Bilgisayar', buy: 780, sell: 949, stock:  3, min: 4,  sup:'Nova Elektronik' },
  { id:'p7',  sku:'NS-3001', name:'AirPods Pro 2',             cat:'Aksesuar',   buy: 165, sell: 229, stock: 26, min:10,  sup:'Nova Elektronik' },
  { id:'p8',  sku:'NS-3002', name:'Anker 20.000mAh Powerbank', cat:'Aksesuar',   buy:  28, sell:  49, stock: 62, min:20,  sup:'Mega Dağıtım' },
  { id:'p9',  sku:'NS-3003', name:'Baseus 65W Hızlı Şarj',     cat:'Aksesuar',   buy:  14, sell:  29, stock:  8, min:20,  sup:'Mega Dağıtım' },
  { id:'p10', sku:'NS-3004', name:'Logitech MX Master 3S',     cat:'Aksesuar',   buy:  72, sell: 109, stock: 17, min: 8,  sup:'Nova Elektronik' },
  { id:'p11', sku:'NS-4001', name:'Samsung 27" Curved Monitör',cat:'Ekran',      buy: 175, sell: 239, stock:  6, min: 5,  sup:'Nova Elektronik' },
  { id:'p12', sku:'NS-4002', name:'LG UltraGear 32" 165Hz',    cat:'Ekran',      buy: 320, sell: 429, stock:  2, min: 4,  sup:'Nova Elektronik' },
  { id:'p13', sku:'NS-5001', name:'Apple Watch Series 9',      cat:'Giyilebilir',buy: 320, sell: 429, stock: 12, min: 5,  sup:'Arel Teknoloji' },
  { id:'p14', sku:'NS-5002', name:'Xiaomi Smart Band 8',       cat:'Giyilebilir',buy:  22, sell:  45, stock: 41, min:15,  sup:'Mega Dağıtım' }
];

const CUSTOMERS = [
  { id:'c1',  first:'Mehmet',  last:'Yılmaz',   phone:'+90 532 418 22 07', email:'mehmet.yilmaz@gmail.com',  addr:'Cumhuriyet Mah. Atatürk Cad. No:44 D:7, Kadıköy / İstanbul', since:'2024-03-11', type:'Bireysel' },
  { id:'c2',  first:'Ayşe',    last:'Demir',    phone:'+90 555 902 14 63', email:'ayse.demir@outlook.com',   addr:'Barbaros Bulvarı No:112, Beşiktaş / İstanbul', since:'2024-06-02', type:'Bireysel' },
  { id:'c3',  first:'Kunduz',  last:'Elektronik',phone:'+90 212 640 18 90',email:'muhasebe@kunduzelektronik.com', addr:'Perpa Ticaret Merkezi B Blok Kat:8 No:1204, Şişli / İstanbul', since:'2023-11-20', type:'Kurumsal' },
  { id:'c4',  first:'Fatma',   last:'Kaya',     phone:'+90 541 337 08 12', email:'fatma.kaya@gmail.com',     addr:'Kültür Mah. 1443 Sok. No:9, Konak / İzmir', since:'2025-01-14', type:'Bireysel' },
  { id:'c5',  first:'Ahmet',   last:'Şahin',    phone:'+90 536 774 55 21', email:'ahmet.sahin@yandex.com',   addr:'Yenişehir Mah. Gazi Cad. No:23, Çankaya / Ankara', since:'2024-09-08', type:'Bireysel' },
  { id:'c6',  first:'Nova',    last:'Bilişim',  phone:'+90 216 505 33 74', email:'satinalma@novabilisim.com',addr:'Ataşehir Bulvarı No:57 Kat:3, Ataşehir / İstanbul', since:'2023-05-30', type:'Kurumsal' },
  { id:'c7',  first:'Zeynep',  last:'Arslan',   phone:'+90 505 218 47 96', email:'zeynep.arslan@gmail.com',  addr:'Muradiye Mah. 210 Sok. No:5, Nilüfer / Bursa', since:'2025-04-19', type:'Bireysel' },
  { id:'c8',  first:'Emre',    last:'Doğan',    phone:'+90 533 641 90 38', email:'emre.dogan@hotmail.com',   addr:'Kızılay Mah. Menekşe Sok. No:16, Ankara', since:'2024-12-03', type:'Bireysel' },
  { id:'c9',  first:'Selin',   last:'Çelik',    phone:'+90 542 806 27 55', email:'selin.celik@gmail.com',    addr:'Alsancak Mah. Kıbrıs Şehitleri Cad. No:78, İzmir', since:'2025-02-27', type:'Bireysel' },
  { id:'c10', first:'Burak',   last:'Aydın',    phone:'+90 538 195 62 40', email:'burak.aydin@gmail.com',    addr:'Karşıyaka Mah. 1720 Sok. No:12, İzmir', since:'2025-06-11', type:'Bireysel' }
];

const STAFF = [
  { id:'s1', name:'Ferhat Yaqoobi', role:'Mağaza Müdürü',   phone:'+90 532 000 11 22', email:'ferhat@netstore.com',  active:true,  start:'2023-01-09' },
  { id:'s2', name:'Elif Yıldız',    role:'Satış Danışmanı', phone:'+90 535 224 78 10', email:'elif@netstore.com',    active:true,  start:'2024-02-15' },
  { id:'s3', name:'Kerem Öztürk',   role:'Satış Danışmanı', phone:'+90 544 619 30 87', email:'kerem@netstore.com',   active:true,  start:'2024-08-01' },
  { id:'s4', name:'Derya Koç',      role:'Depo Sorumlusu',  phone:'+90 507 442 16 05', email:'derya@netstore.com',   active:true,  start:'2025-03-20' },
  { id:'s5', name:'Onur Baş',       role:'Muhasebe',        phone:'+90 546 738 92 41', email:'onur@netstore.com',    active:true,  start:'2023-10-05' },
  { id:'s6', name:'Sinem Aktaş',    role:'Satış Danışmanı', phone:'+90 531 908 55 63', email:'sinem@netstore.com',   active:false, start:'2024-05-12' }
];

const SUPPLIERS = ['Arel Teknoloji', 'Mega Dağıtım', 'Nova Elektronik'];

/* ==========================================================================
   Satış & tahsilat kayıtları
   Son 12 ay üretilir; son haftalar örnek senaryolarla elle sabitlenir.
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
      method: p[2] || 'Nakit'
    });
  });
  return sale;
}

/* --- geçmiş 12 ay: otomatik üretilen hareketler --- */
(function seedHistory() {
  /* c1 örnek senaryonun sahibi: yalnızca elle tanımlı faturaları olsun,
     böylece 500 € satış / 250 € tahsilat / 25.08.2026 vade örneği net kalır. */
  const cIds = CUSTOMERS.filter((c) => c.id !== 'c1').map((c) => c.id);
  const sIds = STAFF.filter((s) => s.active).map((s) => s.id);
  const methods = ['Nakit', 'Havale/EFT', 'Kredi Kartı'];

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
        items.push([pr.id, between(1, pr.sell > 600 ? 2 : 4), pr.sell]);
      }
      if (!items.length) continue;

      const total = items.reduce((s, it) => s + it[1] * it[2], 0);
      const r = rnd();
      let plan;
      if (r < 0.72)      plan = [[0, total, pick(methods)]];                        // peşin
      else if (r < 0.9)  plan = [[0, Math.round(total * 0.5), pick(methods)],
                                 [between(12, 30), total - Math.round(total * 0.5), pick(methods)]];
      else               plan = [[0, Math.round(total * 0.4), pick(methods)]];      // açık kalan
      addSale(d, pick(cIds), pick(sIds), items, 30, plan);
    }
  }
})();

/* --- son haftalar: senaryoyu netleştiren sabit kayıtlar --- */

// Mehmet Yılmaz — açık borç örneği: 500 € satış, 250 € tahsil, vade 25.08.2026
addSale('2026-07-26', 'c1', 's2', [['p7', 1, 229], ['p10', 1, 109], ['p11', 1, 162]], 30,
        [[6, 150, 'Havale/EFT'], [19, 100, 'Nakit']]);

// Mehmet Yılmaz — kapanmış geçmiş satış
addSale('2026-05-14', 'c1', 's1', [['p3', 1, 249], ['p8', 2, 49]], 14,
        [[0, 347, 'Kredi Kartı']]);

// Kunduz Elektronik — kurumsal, kısmi ödeme
addSale('2026-08-04', 'c3', 's1', [['p1', 3, 1099], ['p7', 4, 229]], 30,
        [[2, 2000, 'Havale/EFT']]);

// Ayşe Demir — gecikmiş
addSale('2026-06-18', 'c2', 's3', [['p4', 1, 1289]], 30,
        [[1, 500, 'Havale/EFT']]);

// Nova Bilişim — gecikmiş, büyük bakiye
addSale('2026-06-30', 'c6', 's1', [['p5', 4, 599], ['p12', 2, 429]], 30,
        [[3, 1200, 'Havale/EFT']]);

// Fatma Kaya — tamamlandı
addSale('2026-08-11', 'c4', 's2', [['p13', 1, 429], ['p14', 2, 45]], 15,
        [[0, 519, 'Kredi Kartı']]);

// Ahmet Şahin — ödeme bekliyor (henüz hiç tahsilat yok)
addSale('2026-08-14', 'c5', 's3', [['p2', 1, 799]], 21, []);

// Zeynep Arslan — tamamlandı
addSale('2026-08-16', 'c7', 's2', [['p7', 2, 229], ['p9', 1, 29]], 7,
        [[0, 487, 'Nakit']]);

// Emre Doğan — kısmi
addSale('2026-08-17', 'c8', 's3', [['p6', 1, 949]], 30,
        [[0, 400, 'Kredi Kartı']]);

// Selin Çelik — tamamlandı
addSale('2026-08-18', 'c9', 's2', [['p10', 1, 109], ['p8', 1, 49]], 7,
        [[0, 158, 'Nakit']]);

// Burak Aydın — ödeme bekliyor
addSale('2026-08-18', 'c10', 's1', [['p11', 2, 239]], 14, []);

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

function customerName(c) { return c ? c.first + ' ' + c.last : '—'; }
function initials(c) {
  if (!c) return '?';
  return ((c.first[0] || '') + (c.last[0] || '')).toUpperCase();
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
 * Satış durumu.
 *  Tamamlandı    → yeşil   (bakiye kapandı)
 *  Gecikti       → kırmızı (vade geçti, bakiye var)
 *  Kısmi Ödeme   → turuncu (bir miktar tahsil edildi)
 *  Ödeme Bekliyor→ turuncu (hiç tahsilat yok, vade gelmedi)
 */
function saleStatus(sale) {
  const t = saleTotals(sale);
  if (t.remaining <= 0.005) return { key:'paid',    label:'Tamamlandı',    tone:'success', icon:'check' };
  if (sale.due < TODAY)     return { key:'late',    label:'Gecikti',       tone:'danger',  icon:'alert',
                                     days: daysBetween(sale.due, TODAY) };
  if (t.paid > 0)           return { key:'partial', label:'Kısmi Ödeme',   tone:'warning', icon:'clock' };
  return                           { key:'pending', label:'Ödeme Bekliyor',tone:'warning', icon:'clock' };
}

/** Müşterinin borç / tahsilat özeti. */
function customerSummary(custId) {
  const sales = SALES.filter((s) => s.customerId === custId);
  const pays  = PAYMENTS.filter((p) => p.customerId === custId);

  let total = 0, paid = 0, profit = 0, overdue = 0;
  let lastDue = null;

  sales.forEach((s) => {
    const t = saleTotals(s);
    total += t.total; paid += t.paid; profit += t.profit;
    if (t.remaining > 0) {
      if (s.due < TODAY) overdue += t.remaining;
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
    const t = saleTotals(s);
    rows.push({
      kind: 'debt', date: s.date, amount: t.total, saleNo: s.no, saleId: s.id,
      title: 'Borç oluşturuldu', note: s.no + ' · ' + s.items.length + ' kalem'
    });
  });
  PAYMENTS.filter((p) => p.customerId === custId).forEach((p) => {
    const s = saleById(p.saleId);
    rows.push({
      kind: 'payment', date: p.date, amount: p.amount, saleNo: s ? s.no : '—', saleId: p.saleId,
      title: 'Tahsilat', note: p.method + (s ? ' · ' + s.no : '')
    });
  });
  rows.sort((a, b) => b.date - a.date || (a.kind === 'payment' ? -1 : 1));
  return rows;
}

/* --- işletme geneli KPI --- */
function kpis() {
  let sales = 0, profit = 0, paid = 0;
  SALES.forEach((s) => {
    const t = saleTotals(s);
    sales += t.total; profit += t.profit; paid += t.paid;
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

/** Son N ayın satış / kâr serisi — grafikler bu diziden beslenir. */
function monthlySeries(n) {
  const out = [];
  for (let back = n - 1; back >= 0; back--) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - back, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    let sale = 0, profit = 0;
    SALES.forEach((s) => {
      if (s.date >= d && s.date < next) {
        const t = saleTotals(s);
        sale += t.total; profit += t.profit;
      }
    });
    out.push({ label: MONTHS_SHORT[d.getMonth()], year: d.getFullYear(), sale, profit });
  }
  return out;
}

/** Kategori bazlı satış cirosu. */
function categoryTotals() {
  const map = {};
  SALES.forEach((s) => s.items.forEach((it) => {
    const p = productById(it.pid);
    if (!p) return;
    map[p.cat] = (map[p.cat] || 0) + it.qty * it.price;
  }));
  return Object.keys(map).map((k) => ({ name: k, value: map[k] }))
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

/** Açık bakiyesi olan müşteriler — borç/alacak sayfası ve uyarılar için. */
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
    const t = saleTotals(s);
    if (t.remaining <= 0) return;
    const late = daysBetween(s.due, TODAY);
    if (late <= 0) b.current += t.remaining;
    else if (late <= 30) b.d30 += t.remaining;
    else if (late <= 60) b.d60 += t.remaining;
    else b.d90 += t.remaining;
  });
  return b;
}

/**
 * Önceki aya göre değişim.
 * İçinde bulunulan ay henüz bitmediği için, geçen ayın TAMAMIYLA değil
 * aynı gün aralığıyla (1–bugün) karşılaştırılır; aksi hâlde her ay
 * başında yapay bir düşüş görünürdü.
 */
function periodTotals(start, end, field) {
  let sale = 0, profit = 0;
  SALES.forEach((s) => {
    if (s.date >= start && s.date <= end) {
      const t = saleTotals(s);
      sale += t.total; profit += t.profit;
    }
  });
  return field === 'profit' ? profit : sale;
}

function momChange(field) {
  const day = TODAY.getDate();
  const curStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const prevStart = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1);
  const prevEnd = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, day, 23, 59, 59);

  const cur = periodTotals(curStart, TODAY, field);
  const prev = periodTotals(prevStart, prevEnd, field);
  if (!prev) return null;
  return (cur - prev) / prev;
}
function pct(v) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v * 100).toFixed(1).replace('.', ',') + '%';
}
