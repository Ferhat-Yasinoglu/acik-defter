/* ==========================================================================
   NetStore — kayıt formları
   Tasarım şablonu olan ekranları veri katmanına bağlar. Her form doğrular,
   kaydı oluşturur/günceller, bağımlı alanları (stok, bakiye) tazeler ve
   ekranı yeniden çizer.

   Kayıtlar oturum belleğinde tutulur; sayfa yenilenince örnek veri seti
   yeniden üretilir. Kalıcılık, gerçek bir arka uca bağlanınca eklenecek.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Form kabuğu
   -------------------------------------------------------------------------- */

/**
 * Bildirimsel form modalı.
 * fields: [{ id, label, type, value, options, hint, min, step, half }]
 *   type: text | number | tel | email | date | select | textarea | custom
 * onSubmit(values) → true dönerse modal kapanır.
 */
function formModal(opts) {
  const fields = opts.fields.filter(Boolean);

  const body = fields.map((f) => {
    if (f.type === 'custom') return f.html;
    const id = 'f_' + f.id;
    let input;

    if (f.type === 'select') {
      input = '<select id="' + id + '">' + f.options.map((o) =>
        '<option value="' + esc(o.value) + '"' + (String(o.value) === String(f.value) ? ' selected' : '') +
        '>' + esc(o.label) + '</option>').join('') + '</select>';
    } else if (f.type === 'textarea') {
      input = '<textarea id="' + id + '">' + esc(f.value || '') + '</textarea>';
    } else {
      input = '<input type="' + f.type + '" id="' + id + '" value="' + esc(f.value === undefined ? '' : f.value) + '"' +
        (f.min !== undefined ? ' min="' + f.min + '"' : '') +
        (f.step !== undefined ? ' step="' + f.step + '"' : '') + '>';
    }

    return '<div class="field' + (f.half ? ' field-half' : '') + '">' +
      '<label for="' + id + '">' + esc(f.label) + '</label>' + input +
      (f.hint ? '<p class="hint">' + esc(f.hint) + '</p>' : '') + '</div>';
  }).join('');

  openModal(
    '<div class="card-head"><div><h3>' + esc(opts.title) + '</h3>' +
      (opts.sub ? '<p class="sub">' + esc(opts.sub) + '</p>' : '') + '</div>' +
    '<div class="head-actions"><button class="btn btn-ghost btn-sm btn-icon" data-act="close-modal" ' +
      'aria-label="' + esc(t('aria_close')) + '">' + icon('x') + '</button></div></div>' +
    '<div class="card-body"><div class="field-grid">' + body + '</div></div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-act="close-modal">' + esc(t('btn_cancel')) + '</button>' +
      '<button class="btn btn-' + (opts.tone || 'primary') + '" data-act="form-submit">' +
        icon(opts.icon || 'check') + esc(opts.submitLabel || t('btn_save')) + '</button>' +
    '</div>'
  );

  ACTIVE_FORM = {
    fields: fields,
    onSubmit: opts.onSubmit,
    onMount: opts.onMount
  };
  if (opts.onMount) opts.onMount();
}

let ACTIVE_FORM = null;

/** Form alanlarını okur. */
function readForm() {
  const v = {};
  ACTIVE_FORM.fields.forEach((f) => {
    if (f.type === 'custom') return;
    const el = document.getElementById('f_' + f.id);
    if (!el) return;
    v[f.id] = f.type === 'number' ? el.value.trim() : el.value.trim();
  });
  return v;
}

function submitActiveForm() {
  if (!ACTIVE_FORM) return;
  const values = readForm();
  if (ACTIVE_FORM.onSubmit(values) !== false) {
    ACTIVE_FORM = null;
    closeModal();
  }
}

/* --------------------------------------------------------------------------
   Doğrulama yardımcıları
   -------------------------------------------------------------------------- */

function vRequired(value, label) {
  if (!value || !String(value).trim()) { toast(t('v_required', { f: label }), 'warning'); return false; }
  return true;
}
function vNumber(value, label, opts) {
  const n = Number(value);
  if (value === '' || !isFinite(n)) { toast(t('v_number', { f: label }), 'warning'); return false; }
  if (opts && opts.positive && n <= 0) { toast(t('v_positive', { f: label }), 'warning'); return false; }
  if (opts && opts.min !== undefined && n < opts.min) { toast(t('v_number', { f: label }), 'warning'); return false; }
  return true;
}

/** Onay gerektiren yıkıcı işlem. */
function confirmModal(o) {
  openModal(
    '<div class="card-head"><div><h3>' + esc(t('cf_title')) + '</h3></div>' +
    '<div class="head-actions"><button class="btn btn-ghost btn-sm btn-icon" data-act="close-modal" ' +
      'aria-label="' + esc(t('aria_close')) + '">' + icon('x') + '</button></div></div>' +
    '<div class="card-body">' +
      '<div class="alert alert-danger">' + icon('alert') +
        '<div><strong>' + esc(o.message) + '</strong>' +
        (o.note ? '<span class="alert-text">' + esc(o.note) + '</span>' : '') + '</div></div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-act="close-modal">' + esc(t('btn_cancel')) + '</button>' +
      '<button class="btn btn-danger" data-act="confirm-yes">' + icon('trash') +
        esc(t('btn_confirm_del')) + '</button>' +
    '</div>'
  );
  PENDING_CONFIRM = o.onConfirm;
}
let PENDING_CONFIRM = null;

function runPendingConfirm() {
  const fn = PENDING_CONFIRM;
  PENDING_CONFIRM = null;
  closeModal();
  if (fn) fn();
}

/* --------------------------------------------------------------------------
   Seçenek listeleri
   -------------------------------------------------------------------------- */

const optCustomers = () => CUSTOMERS.map((c) => ({ value: c.id, label: customerName(c) }));
const optStaff     = () => STAFF.filter((s) => s.active).map((s) => ({ value: s.id, label: staffName(s) }));
const optProducts  = () => PRODUCTS.map((p) => ({
  value: p.id, label: p.name + ' — ' + t('ln_stock_left', { n: num(p.stock) })
}));
const optCategories = () => ['phone','computer','accessory','display','wearable']
  .map((k) => ({ value: k, label: catLabel(k) }));
const optSuppliers = () => SUPPLIERS.map((k) => ({ value: k, label: supplierName(k) }));
const optTypes     = () => ['personal','corporate'].map((k) => ({ value: k, label: typeLabel(k) }));
const optRoles     = () => ['manager','sales','warehouse','accounting']
  .map((k) => ({ value: k, label: roleLabel(k) }));
const optMethods   = () => METHODS.map((k) => ({ value: k, label: methodLabel(k) }));
const optActive    = () => [{ value:'1', label:t('b_active') }, { value:'0', label:t('b_passive') }];

function nextId(arr, prefix) {
  let n = 1;
  while (arr.some((x) => x.id === prefix + n)) n++;
  return prefix + n;
}

/* --------------------------------------------------------------------------
   Yeni satış — çok kalemli
   -------------------------------------------------------------------------- */

let SALE_LINES = [];

/** Kalem listesi satış fiyatı mı alış fiyatı mı gösteriyor. */
let LINE_MODE = 'sell';

/** Kalem birim fiyatı: satışta satış fiyatı, alışta maliyet. */
function linePrice(p) { return p ? (LINE_MODE === 'cost' ? p.buy : p.sell) : 0; }

function lineRowsHTML() {
  if (!SALE_LINES.length) {
    return '<p class="hint" style="margin:0">' + esc(t('v_no_items')) + '</p>';
  }
  let total = 0;
  const rows = SALE_LINES.map((ln, i) => {
    const p = productById(ln.pid);
    const amount = linePrice(p) * ln.qty;
    total += amount;
    return '<div class="line-row">' +
      '<span class="line-name">' + esc(p ? p.name : '—') +
        '<span class="line-sub">' + money(linePrice(p)) + ' · ' +
        esc(t('ln_stock_left', { n: num(p ? p.stock : 0) })) + '</span></span>' +
      '<input type="number" class="line-qty" data-line="' + i + '" min="1" step="1" value="' + ln.qty + '">' +
      '<span class="line-amount num">' + money(amount) + '</span>' +
      '<button class="btn btn-ghost btn-sm btn-icon" data-act="line-remove" data-line="' + i + '" ' +
        'aria-label="' + esc(t('ln_remove')) + '">' + icon('x') + '</button>' +
    '</div>';
  }).join('');

  return rows + '<footer class="line-total"><span>' + esc(t('ln_total')) + '</span>' +
         '<b class="num">' + money(total) + '</b></footer>';
}

function refreshLines() {
  const host = document.getElementById('lineHost');
  if (host) host.innerHTML = lineRowsHTML();
}

function saleLinesTotal() {
  return SALE_LINES.reduce((s, ln) => s + linePrice(productById(ln.pid)) * ln.qty, 0);
}

function newSaleForm(presetCustomerId) {
  /* Önkoşullar: bunlar olmadan form anlamsız bir kabuk olur. */
  if (!PRODUCTS.length)  { toast(t('e_need_products'), 'warning'); return; }
  if (!CUSTOMERS.length) { toast(t('e_need_customers'), 'warning'); return; }
  if (!STAFF.some((x) => x.active)) { toast(t('e_need_staff'), 'warning'); return; }

  SALE_LINES = [];
  LINE_MODE = 'sell';
  formModal({
    title: t('form_new_sale'),
    sub: t('form_new_sale_s'),
    submitLabel: t('btn_create'),
    icon: 'plus',
    fields: [
      { id:'customer', label:t('m_customer'), type:'select', options:optCustomers(),
        value: presetCustomerId || (CUSTOMERS[0] && CUSTOMERS[0].id), half:true },
      { id:'staff', label:t('fld_staff'), type:'select', options:optStaff(), half:true },
      { id:'_lines', type:'custom', html:
        '<div class="field field-full">' +
          '<label>' + esc(t('ln_items')) + '</label>' +
          '<div class="line-picker">' +
            '<select id="linePick">' + optProducts().map((o) =>
              '<option value="' + o.value + '">' + esc(o.label) + '</option>').join('') + '</select>' +
            '<button class="btn btn-ghost" data-act="line-add">' + icon('plus') + esc(t('ln_add')) + '</button>' +
          '</div>' +
          '<div class="line-host" id="lineHost"></div>' +
        '</div>' },
      { id:'due', label:t('fld_due_days'), type:'number', value:30, min:0, step:1, half:true },
      { id:'prepay', label:t('fld_prepay', { c: langMeta().currency }), type:'number', value:0, min:0, step:1,
        half:true, hint:t('fld_prepay_h') },
      { id:'method', label:t('m_method'), type:'select', options:optMethods() }
    ],
    onMount: refreshLines,
    onSubmit: function (v) {
      if (!SALE_LINES.length) { toast(t('v_no_items'), 'warning'); return false; }

      /* stok yeterliliği */
      for (const ln of SALE_LINES) {
        const p = productById(ln.pid);
        if (!p || ln.qty > p.stock) {
          toast(t('v_stock_short', { p: p ? p.name : '—', n: num(p ? p.stock : 0) }), 'warning');
          return false;
        }
      }
      if (!vNumber(v.due, t('fld_due_days'), { min: 0 })) return false;

      const total = saleLinesTotal();
      const prepay = Number(v.prepay) || 0;
      if (prepay < 0 || !isFinite(prepay)) { toast(t('v_number', { f:t('fld_prepay', { c:'' }) }), 'warning'); return false; }
      if (prepay > total) { toast(t('v_prepay_max'), 'warning'); return false; }

      const sale = createSale({
        customerId: v.customer,
        staffId: v.staff,
        items: SALE_LINES.map((ln) => {
          const p = productById(ln.pid);
          return { pid: ln.pid, qty: ln.qty, price: p.sell };
        }),
        dueDays: Number(v.due),
        prepay: prepay,
        method: v.method
      });

      commit();
      toast(t('ok_sale', { no: sale.no }));
      return true;
    }
  });
}

/** Satışı kaydeder, stoktan düşer, peşin tahsilatı işler. */
function createSale(o) {
  const d = new Date(TODAY);
  const seq = SALES.length + PAYMENTS.length + 1;
  const sale = {
    id: nextId(SALES, 'sl'),
    no: 'FT-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(1000 + seq).padStart(4, '0'),
    customerId: o.customerId,
    staffId: o.staffId,
    date: d,
    due: addDays(d, o.dueDays),
    items: o.items
  };
  SALES.unshift(sale);
  SALES.sort((a, b) => b.date - a.date);

  /* stok düşümü */
  o.items.forEach((it) => {
    const p = productById(it.pid);
    if (p) p.stock = Math.max(0, p.stock - it.qty);
  });

  if (o.prepay > 0) {
    PAYMENTS.unshift({
      id: nextId(PAYMENTS, 'pm'), saleId: sale.id, customerId: o.customerId,
      date: new Date(TODAY), amount: o.prepay, method: o.method || 'cash'
    });
    PAYMENTS.sort((a, b) => b.date - a.date);
  }
  return sale;
}

/* --------------------------------------------------------------------------
   Ürün
   -------------------------------------------------------------------------- */

function productForm(id) {
  const p = id ? productById(id) : null;
  formModal({
    title: p ? t('form_edit_prod') : t('form_new_prod'),
    submitLabel: p ? t('btn_save') : t('btn_create'),
    icon: p ? 'check' : 'plus',
    fields: [
      { id:'name', label:t('fld_prod_name'), type:'text', value:p ? p.name : '' },
      { id:'sku', label:t('fld_sku'), type:'text', value:p ? p.sku : '', half:true },
      { id:'cat', label:t('fld_category'), type:'select', options:optCategories(), value:p ? p.cat : 'phone', half:true },
      { id:'buy', label:t('fld_buy', { c: langMeta().currency }), type:'number', value:p ? p.buy : '', min:0, step:1, half:true },
      { id:'sell', label:t('fld_sell', { c: langMeta().currency }), type:'number', value:p ? p.sell : '', min:0, step:1, half:true },
      { id:'stock', label:t('fld_stock'), type:'number', value:p ? p.stock : 0, min:0, step:1, half:true },
      { id:'min', label:t('fld_min'), type:'number', value:p ? p.min : 5, min:0, step:1, half:true },
      { id:'sup', label:t('fld_supplier'), type:'select', options:optSuppliers(), value:p ? p.sup : SUPPLIERS[0] }
    ],
    onSubmit: function (v) {
      if (!vRequired(v.name, t('fld_prod_name'))) return false;
      if (!vRequired(v.sku, t('fld_sku'))) return false;
      if (PRODUCTS.some((x) => x.sku.toLowerCase() === v.sku.toLowerCase() && (!p || x.id !== p.id))) {
        toast(t('v_sku_dup', { n: v.sku }), 'warning'); return false;
      }
      if (!vNumber(v.buy, t('fld_buy', { c:'' }), { min: 0 })) return false;
      if (!vNumber(v.sell, t('fld_sell', { c:'' }), { positive: true })) return false;
      if (!vNumber(v.stock, t('fld_stock'), { min: 0 })) return false;
      if (!vNumber(v.min, t('fld_min'), { min: 0 })) return false;

      const rec = p || { id: nextId(PRODUCTS, 'p') };
      Object.assign(rec, {
        name: v.name, sku: v.sku, cat: v.cat, sup: v.sup,
        buy: Number(v.buy), sell: Number(v.sell),
        stock: Number(v.stock), min: Number(v.min)
      });
      if (!p) PRODUCTS.push(rec);

      commit();
      toast(t('ok_product'));
      /* zararına satış uyarısı — engellemez, bilgilendirir */
      if (rec.sell < rec.buy) toast(t('v_sell_lt_buy'), 'warning');
      return true;
    }
  });
}

function deleteProduct(id) {
  const p = productById(id);
  if (!p) return;
  confirmModal({
    message: t('cf_product', { n: p.name }),
    onConfirm: function () {
      const i = PRODUCTS.indexOf(p);
      if (i >= 0) PRODUCTS.splice(i, 1);
      commit();
      toast(t('ok_deleted'));
    }
  });
}

/* --------------------------------------------------------------------------
   Stok girişi
   -------------------------------------------------------------------------- */

function stockInForm(pid) {
  if (!PRODUCTS.length) { toast(t('e_need_products'), 'warning'); return; }
  formModal({
    title: t('form_stock_in'),
    sub: t('form_stock_in_s'),
    submitLabel: t('btn_save'),
    icon: 'plus',
    fields: [
      { id:'pid', label:t('c_product'), type:'select', options:optProducts(),
        value: pid || (PRODUCTS[0] && PRODUCTS[0].id) },
      { id:'qty', label:t('fld_quantity'), type:'number', value:10, min:1, step:1 }
    ],
    onSubmit: function (v) {
      if (!vNumber(v.qty, t('fld_quantity'), { positive: true })) return false;
      const p = productById(v.pid);
      if (!p) return false;
      p.stock += Number(v.qty);
      commit();
      toast(t('ok_stock_in', { n: num(Number(v.qty)), p: p.name }));
      return true;
    }
  });
}

/* --------------------------------------------------------------------------
   Müşteri
   -------------------------------------------------------------------------- */

function customerForm(id) {
  const c = id ? customerById(id) : null;
  formModal({
    title: c ? t('form_edit_cust') : t('form_new_cust'),
    submitLabel: c ? t('btn_save') : t('btn_create'),
    icon: c ? 'check' : 'plus',
    fields: [
      { id:'name', label:t('fld_name'), type:'text', value: c ? customerName(c) : '' },
      { id:'type', label:t('fld_type'), type:'select', options:optTypes(), value:c ? c.type : 'personal', half:true },
      { id:'phone', label:t('f_phone'), type:'tel', value:c ? c.phone : '+93 ', half:true },
      { id:'email', label:t('f_email'), type:'email', value:c ? c.email : '' },
      { id:'addr', label:t('f_address'), type:'textarea', value:c ? L(c.addr) : '' }
    ],
    onSubmit: function (v) {
      if (!vRequired(v.name, t('fld_name'))) return false;
      if (!vRequired(v.phone, t('f_phone'))) return false;

      const parts = v.name.trim().split(/\s+/);
      const first = parts.shift();
      const last = parts.join(' ');

      const rec = c || { id: nextId(CUSTOMERS, 'c'), since: new Date(TODAY).toISOString().slice(0, 10) };
      Object.assign(rec, {
        first: first, last: last, type: v.type,
        phone: v.phone, email: v.email, addr: v.addr
      });
      if (!c) CUSTOMERS.push(rec);

      commit();
      toast(t('ok_customer'));
      return true;
    }
  });
}

function deleteCustomer(id) {
  const c = customerById(id);
  if (!c) return;
  const sum = customerSummary(id);
  confirmModal({
    message: t('cf_customer', { n: customerName(c), s: num(sum.sales.length) }),
    note: sum.remaining > 0 ? t('cf_has_debt', { v: money(sum.remaining) }) : '',
    onConfirm: function () {
      /* müşteriye bağlı satış ve tahsilatlar da gider */
      for (let i = PAYMENTS.length - 1; i >= 0; i--) if (PAYMENTS[i].customerId === id) PAYMENTS.splice(i, 1);
      for (let i = SALES.length - 1; i >= 0; i--) if (SALES[i].customerId === id) SALES.splice(i, 1);
      const j = CUSTOMERS.indexOf(c);
      if (j >= 0) CUSTOMERS.splice(j, 1);

      location.hash = '#/musteriler';
      commit();
      toast(t('ok_deleted'));
    }
  });
}

/* --------------------------------------------------------------------------
   Alış — çok kalemli, stoğa ekler
   -------------------------------------------------------------------------- */

function newPurchaseForm() {
  if (!PRODUCTS.length) { toast(t('e_need_products'), 'warning'); return; }

  SALE_LINES = [];
  LINE_MODE = 'cost';
  formModal({
    title: t('form_new_purch'),
    submitLabel: t('btn_create'),
    icon: 'plus',
    fields: [
      { id:'supplier', label:t('fld_supplier'), type:'select', options:optSuppliers() },
      { id:'_lines', type:'custom', html:
        '<div class="field field-full">' +
          '<label>' + esc(t('ln_items')) + '</label>' +
          '<div class="line-picker">' +
            '<select id="linePick">' + PRODUCTS.map((p) =>
              '<option value="' + p.id + '">' + esc(p.name + ' — ' + money(p.buy)) + '</option>').join('') + '</select>' +
            '<button class="btn btn-ghost" data-act="line-add" data-cost="1">' + icon('plus') + esc(t('ln_add')) + '</button>' +
          '</div>' +
          '<div class="line-host" id="lineHost"></div>' +
        '</div>' },
      { id:'paid', label:t('fld_paid_amount', { c: langMeta().currency }), type:'number', value:0, min:0, step:1 }
    ],
    onMount: function () { LINE_MODE = 'cost'; refreshLines(); },
    onSubmit: function (v) {
      if (!SALE_LINES.length) { toast(t('v_no_items'), 'warning'); return false; }
      const total = saleLinesTotal();
      const paid = Number(v.paid) || 0;
      if (paid < 0 || paid > total) { toast(t('v_prepay_max'), 'warning'); return false; }

      const d = new Date(TODAY);
      const rec = {
        id: nextId(PURCHASES, 'pu'),
        no: 'AL-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(1000 + PURCHASES.length + 1).padStart(4, '0'),
        supplier: v.supplier, date: d,
        items: SALE_LINES.map((ln) => {
          const p = productById(ln.pid);
          return { pid: ln.pid, qty: ln.qty, price: p.buy };
        }),
        total: total, paid: paid
      };
      PURCHASES.unshift(rec);
      PURCHASES.sort((a, b) => b.date - a.date);

      /* alış stoğa girer */
      rec.items.forEach((it) => {
        const p = productById(it.pid);
        if (p) p.stock += it.qty;
      });

      commit();
      toast(t('ok_purchase', { no: rec.no }));
      return true;
    }
  });
}

/* --------------------------------------------------------------------------
   Personel
   -------------------------------------------------------------------------- */

function staffForm(id) {
  const s = id ? staffById(id) : null;
  formModal({
    title: s ? t('form_edit_staff') : t('form_new_staff'),
    submitLabel: s ? t('btn_save') : t('btn_create'),
    icon: s ? 'check' : 'plus',
    fields: [
      { id:'name', label:t('fld_name'), type:'text', value:s ? staffName(s) : '' },
      { id:'role', label:t('fld_role'), type:'select', options:optRoles(), value:s ? s.role : 'sales', half:true },
      { id:'active', label:t('fld_active'), type:'select', options:optActive(), value:s ? (s.active ? '1' : '0') : '1', half:true },
      { id:'phone', label:t('f_phone'), type:'tel', value:s ? s.phone : '+93 ', half:true },
      { id:'start', label:t('fld_start'), type:'date', value:s ? s.start : new Date(TODAY).toISOString().slice(0, 10), half:true },
      { id:'email', label:t('f_email'), type:'email', value:s ? s.email : '' }
    ],
    onSubmit: function (v) {
      if (!vRequired(v.name, t('fld_name'))) return false;
      const rec = s || { id: nextId(STAFF, 's') };
      Object.assign(rec, {
        name: v.name, role: v.role, phone: v.phone, email: v.email,
        start: v.start || new Date(TODAY).toISOString().slice(0, 10),
        active: v.active === '1'
      });
      if (!s) STAFF.push(rec);
      commit();
      toast(t('ok_staff'));
      return true;
    }
  });
}

/* --------------------------------------------------------------------------
   CSV dışa aktarma
   -------------------------------------------------------------------------- */

function csvEscape(v) {
  const s = String(v === undefined || v === null ? '' : v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function downloadCSV(name, header, rows) {
  /* BOM: Excel'in UTF-8'i doğru okuması için — Farsça ve Türkçe karakterler
     aksi hâlde bozuk görünür. Ayrıcı noktalı virgül: Excel yerel ayarları. */
  const csv = '﻿' + [header].concat(rows)
    .map((r) => r.map(csvEscape).join(';')).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'netstore-' + name + '-' + new Date(TODAY).toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t('ok_export', { n: num(rows.length) }));
}

/** Bulunulan sayfaya göre uygun veriyi dışa aktarır. */
function exportCurrent() {
  const route = STATE.route;

  if (route === 'urunler' || route === 'stok') {
    downloadCSV(t('exp_products'),
      [t('fld_sku'), t('c_product'), t('c_category'), t('c_buy'), t('c_sell'), t('c_stock'), t('c_min'), t('c_supplier')],
      PRODUCTS.map((p) => [p.sku, p.name, catLabel(p.cat), p.buy, p.sell, p.stock, p.min, supplierName(p.sup)]));
    return;
  }

  if (route === 'musteriler') {
    downloadCSV(t('exp_customers'),
      [t('c_customer'), t('fld_type'), t('c_phone'), t('f_email'), t('f_address'),
       t('c_total_sales'), t('c_paid'), t('c_debt'), t('c_last_due')],
      CUSTOMERS.map((c) => {
        const s = customerSummary(c.id);
        return [customerName(c), typeLabel(c.type), c.phone, c.email, L(c.addr),
                s.total, s.paid, s.remaining, s.dueDate ? fmtDate(s.dueDate) : ''];
      }));
    return;
  }

  if (route === 'borc') {
    downloadCSV(t('exp_debt'),
      [t('c_customer'), t('c_phone'), t('c_total_sales'), t('c_paid'), t('c_debt'), t('c_last_due'), t('c_status')],
      openBalances().map((r) => [
        customerName(r.customer), r.customer.phone, r.sum.total, r.sum.paid, r.sum.remaining,
        r.sum.dueDate ? fmtDate(r.sum.dueDate) : '',
        r.sum.isLate ? t('st_late') : t('b_on_due')
      ]));
    return;
  }

  /* varsayılan: satışlar */
  downloadCSV(t('exp_sales'),
    [t('c_invoice_no'), t('c_date'), t('c_customer'), t('c_due'), t('c_total'), t('c_paid'), t('c_remaining'), t('c_status')],
    SALES.map((s) => {
      const x = saleTotals(s);
      return [s.no, fmtDate(s.date), customerName(customerById(s.customerId)), fmtDate(s.due),
              x.total, x.paid, x.remaining, saleStatus(s).label];
    }));
}

/* --------------------------------------------------------------------------
   Kalem listesi etkileşimi
   -------------------------------------------------------------------------- */

function lineAdd() {
  const pick = document.getElementById('linePick');
  if (!pick) return;
  const pid = pick.value;
  const existing = SALE_LINES.find((ln) => ln.pid === pid);
  if (existing) existing.qty += 1;
  else SALE_LINES.push({ pid: pid, qty: 1 });
  refreshLines();
}

function lineRemove(i) {
  SALE_LINES.splice(i, 1);
  refreshLines();
}

function lineQty(i, value) {
  const q = Math.max(1, Math.floor(Number(value) || 1));
  if (SALE_LINES[i]) SALE_LINES[i].qty = q;
  refreshLines();
}
