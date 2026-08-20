/* ==========================================================================
   NetStore — fatura ve tahsilat fişi
   Belge tamamen seçili dilde üretilir (فارسی / Türkçe / English), yazı yönü
   ve rakam biçimi dile göre; para birimi her dilde Afgani.
   Yazdırıldığında yalnızca belge basılır, arayüz basılmaz.
   ========================================================================== */

const BIZ = {
  phone: '+93 20 210 00 00',
  email: 'info@netstore.af',
  tax:   'AF-1234567890'
};

function docHost() { return document.getElementById('docHost'); }

function openDoc(html) {
  const host = docHost();
  host.innerHTML = html;
  host.classList.add('on');
  document.body.classList.add('doc-open');
  host.scrollTop = 0;
}

function closeDoc() {
  const host = docHost();
  host.classList.remove('on');
  host.innerHTML = '';
  document.body.classList.remove('doc-open');
}

/* --- belge kabuğu: araç çubuğu + A4 sayfa --- */
function docShell(inner) {
  return '<div class="doc-bar">' +
      '<button class="btn btn-ghost" data-act="close-doc">' + icon('x') + t('aria_close') + '</button>' +
      '<div class="spacer"></div>' +
      '<button class="btn btn-primary" data-act="print-doc">' + icon('printer') + t('inv_print') + '</button>' +
    '</div>' +
    '<div class="doc-scroll"><article class="sheet">' + inner + '</article></div>';
}

function sheetHeader(docTitle, meta) {
  return '<header class="sheet-head">' +
      '<div class="sheet-brand">' +
        '<span class="sheet-mark">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
          'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V5l14 14V5"/></svg>' +
        '</span>' +
        '<div>' +
          '<div class="sheet-biz">' + esc(t('inv_biz_name')) + '</div>' +
          '<div class="sheet-biz-sub">' + esc(t('inv_biz_addr')) + '</div>' +
          '<div class="sheet-biz-sub">' + ltr(BIZ.phone) + ' · ' + ltr(BIZ.email) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="sheet-meta">' +
        '<div class="sheet-doctype">' + esc(docTitle) + '</div>' +
        meta.map((m) =>
          '<div class="sheet-meta-row"><span>' + esc(m[0]) + '</span><b>' + m[1] + '</b></div>').join('') +
      '</div>' +
    '</header>';
}

function partyBlock(label, lines) {
  return '<div class="sheet-party">' +
    '<div class="sheet-party-label">' + esc(label) + '</div>' +
    lines.filter(Boolean).map((l, i) =>
      '<div class="' + (i === 0 ? 'sheet-party-name' : 'sheet-party-line') + '">' + l + '</div>').join('') +
  '</div>';
}

/* --------------------------------------------------------------------------
   FATURA
   -------------------------------------------------------------------------- */
function invoiceDoc(saleId) {
  const sale = saleById(saleId);
  if (!sale) { toast(t('e_no_record'), 'warning'); return; }

  const c  = customerById(sale.customerId);
  const st = saleTotals(sale);
  const status = saleStatus(sale);
  const pays = PAYMENTS.filter((p) => p.saleId === sale.id).slice().sort((a, b) => a.date - b.date);
  const staff = staffById(sale.staffId);

  const rows = sale.items.map((it, i) => {
    const p = productById(it.pid);
    return '<tr>' +
      '<td class="c">' + num(i + 1) + '</td>' +
      '<td><b>' + esc(p ? p.name : '—') + '</b>' +
        '<span class="sheet-sku">' + esc(p ? p.sku : '') + ' · ' + esc(p ? catLabel(p.cat) : '') + '</span></td>' +
      '<td class="e">' + num(it.qty) + '</td>' +
      '<td class="e">' + money(it.price) + '</td>' +
      '<td class="e"><b>' + money(it.qty * it.price) + '</b></td>' +
    '</tr>';
  }).join('');

  const payRows = pays.length
    ? pays.map((p) =>
        '<tr><td>' + fmtDate(p.date) + '</td><td>' + esc(methodLabel(p.method)) + '</td>' +
        '<td class="e"><b>' + money(p.amount) + '</b></td></tr>').join('')
    : '<tr><td colspan="3" class="sheet-empty">' + esc(t('inv_no_payments')) + '</td></tr>';

  openDoc(docShell(
    sheetHeader(t('inv_title'), [
      [t('inv_no'),   '<span class="mono">' + esc(sale.no) + '</span>'],
      [t('inv_date'), fmtDate(sale.date)],
      [t('inv_due'),  '<span class="' + (dueTone(sale.due, st.remaining) === 'danger' ? 'ink-danger'
                       : dueTone(sale.due, st.remaining) === 'warning' ? 'ink-warning' : '') + '">' +
                       fmtDate(sale.due) + '</span>']
    ]) +

    '<div class="sheet-parties">' +
      partyBlock(t('inv_seller'), [
        esc(t('inv_biz_name')),
        esc(t('inv_biz_addr')),
        esc(t('inv_tax')) + ': ' + ltr(BIZ.tax),
        ltr(BIZ.phone)
      ]) +
      partyBlock(t('inv_buyer'), [
        esc(customerName(c)),
        esc(L(c.addr)),
        ltr(c.phone),
        ltr(c.email)
      ]) +
    '</div>' +

    '<table class="sheet-table">' +
      '<thead><tr>' +
        '<th class="c">' + esc(t('inv_no_col')) + '</th>' +
        '<th>' + esc(t('inv_desc')) + '</th>' +
        '<th class="e">' + esc(t('c_qty')) + '</th>' +
        '<th class="e">' + esc(t('inv_unit_price')) + '</th>' +
        '<th class="e">' + esc(t('inv_line_total')) + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody>' +
    '</table>' +

    '<div class="sheet-summary">' +
      '<div class="sheet-notes">' +
        '<div class="sheet-sub-h">' + esc(t('inv_payments')) + '</div>' +
        '<table class="sheet-mini"><tbody>' + payRows + '</tbody></table>' +
      '</div>' +
      '<div class="sheet-totals">' +
        '<div class="stot"><span>' + esc(t('inv_subtotal')) + '</span><b>' + money(st.total) + '</b></div>' +
        '<div class="stot grand"><span>' + esc(t('inv_grand')) + '</span><b>' + money(st.total) + '</b></div>' +
        '<div class="stot"><span>' + esc(t('inv_paid')) + '</span><b class="ink-success">' + money(st.paid) + '</b></div>' +
        '<div class="stot balance"><span>' + esc(t('inv_balance')) + '</span>' +
          '<b class="' + (st.remaining > 0 ? 'ink-danger' : 'ink-success') + '">' + money(st.remaining) + '</b></div>' +
        '<div class="sheet-status ' + status.tone + '">' + esc(status.label) + '</div>' +
      '</div>' +
    '</div>' +

    '<footer class="sheet-foot">' +
      '<div class="sheet-signs">' +
        '<div class="sign"><span class="sign-line"></span>' + esc(t('inv_sign_seller')) +
          '<em>' + esc(staffName(staff)) + '</em></div>' +
        '<div class="sign"><span class="sign-line"></span>' + esc(t('inv_sign_buyer')) +
          '<em>' + esc(customerName(c)) + '</em></div>' +
      '</div>' +
      '<p class="sheet-thanks">' + esc(t('inv_thanks')) + '</p>' +
      '<p class="sheet-legal">' + esc(t('inv_footer')) + '</p>' +
    '</footer>'
  ));
}

/* --------------------------------------------------------------------------
   TAHSİLAT FİŞİ
   -------------------------------------------------------------------------- */
function receiptDoc(paymentId) {
  const p = PAYMENTS.find((x) => x.id === paymentId);
  if (!p) { toast(t('e_no_record'), 'warning'); return; }

  const c = customerById(p.customerId);
  const sale = saleById(p.saleId);
  const st = sale ? saleTotals(sale) : null;

  openDoc(docShell(
    sheetHeader(t('inv_receipt'), [
      [t('inv_no'),   '<span class="mono">' + esc(sale ? sale.no : '—') + '</span>'],
      [t('inv_date'), fmtDate(p.date)],
      [t('m_method'), esc(methodLabel(p.method))]
    ]) +

    '<div class="sheet-parties">' +
      partyBlock(t('inv_seller'), [esc(t('inv_biz_name')), esc(t('inv_biz_addr')), ltr(BIZ.phone)]) +
      partyBlock(t('inv_buyer'),  [esc(customerName(c)), esc(L(c.addr)), ltr(c.phone)]) +
    '</div>' +

    '<div class="receipt-amount">' +
      '<span>' + esc(t('inv_paid')) + '</span>' +
      '<strong>' + money(p.amount, true) + '</strong>' +
    '</div>' +

    (st ? '<table class="sheet-table"><tbody>' +
      '<tr><td>' + esc(t('inv_grand')) + '</td><td class="e"><b>' + money(st.total) + '</b></td></tr>' +
      '<tr><td>' + esc(t('inv_paid')) + '</td><td class="e"><b class="ink-success">' + money(st.paid) + '</b></td></tr>' +
      '<tr><td>' + esc(t('inv_balance')) + '</td><td class="e"><b class="' +
        (st.remaining > 0 ? 'ink-danger' : 'ink-success') + '">' + money(st.remaining) + '</b></td></tr>' +
      '</tbody></table>' : '') +

    '<footer class="sheet-foot">' +
      '<div class="sheet-signs">' +
        '<div class="sign"><span class="sign-line"></span>' + esc(t('inv_sign_seller')) + '</div>' +
        '<div class="sign"><span class="sign-line"></span>' + esc(t('inv_sign_buyer')) + '</div>' +
      '</div>' +
      '<p class="sheet-legal">' + esc(t('inv_footer')) + '</p>' +
    '</footer>'
  ));
}
