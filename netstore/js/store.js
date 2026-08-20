/* ==========================================================================
   NetStore — kalıcı depolama
   Kayıtlar tarayıcının localStorage'ında saklanır; sayfa yenilense de durur.
   İlk açılışta kayıt yoksa örnek veri seti yüklü gelir.

   Gerçek bir arka uç eklendiğinde değiştirilmesi gereken tek yer burasıdır:
   save/load/clear imzaları aynı kalabilir.
   ========================================================================== */

const STORE_KEY = 'netstore-data';
const STORE_VERSION = 1;

/* Tarih taşıyan alanlar — JSON'a yazarken ISO'ya, okurken Date'e çevrilir. */
const DATE_FIELDS = {
  sales: ['date', 'due'],
  payments: ['date'],
  purchases: ['date']
};

/** Bellekteki koleksiyonlar. Diziler yerinde değiştirilir (const oldukları
    için yeniden atanamazlar; data.js'teki referanslar korunmalı). */
function collections() {
  return {
    products:  PRODUCTS,
    customers: CUSTOMERS,
    staff:     STAFF,
    sales:     SALES,
    payments:  PAYMENTS,
    purchases: PURCHASES
  };
}

function replaceAll(arr, items) {
  arr.length = 0;
  items.forEach((x) => arr.push(x));
}

/* --------------------------------------------------------------------------
   Yazma / okuma
   -------------------------------------------------------------------------- */

function serialize() {
  const out = { v: STORE_VERSION, saved: new Date().toISOString() };
  const c = collections();
  Object.keys(c).forEach((key) => {
    out[key] = c[key].map((rec) => {
      const fields = DATE_FIELDS[key];
      if (!fields) return rec;
      const copy = Object.assign({}, rec);
      fields.forEach((f) => { if (copy[f] instanceof Date) copy[f] = copy[f].toISOString(); });
      return copy;
    });
  });
  return out;
}

/** Belleği diske yazar. Kota dolarsa sessizce vazgeçmez — kullanıcıyı uyarır. */
function saveData() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(serialize()));
    return true;
  } catch (e) {
    /* QuotaExceededError veya gizli sekmede erişim reddi */
    if (typeof toast === 'function') toast(t('st_save_failed'), 'warning');
    return false;
  }
}

/** Diskteki kaydı belleğe alır. Kayıt yoksa/bozuksa false döner. */
function loadData() {
  let raw;
  try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return false; }
  if (!raw) return false;

  let obj;
  try { obj = JSON.parse(raw); } catch (e) { return false; }
  if (!obj || obj.v !== STORE_VERSION) return false;

  const c = collections();
  /* Hepsi mevcut olmadan hiçbirini uygulamayız: yarım yüklenmiş bir durum,
     bozuk veriden daha kötüdür. */
  if (!Object.keys(c).every((k) => Array.isArray(obj[k]))) return false;

  Object.keys(c).forEach((key) => {
    const fields = DATE_FIELDS[key];
    replaceAll(c[key], obj[key].map((rec) => {
      if (!fields) return rec;
      const copy = Object.assign({}, rec);
      fields.forEach((f) => { if (copy[f]) copy[f] = new Date(copy[f]); });
      return copy;
    }));
  });

  SALES.sort((a, b) => b.date - a.date);
  PAYMENTS.sort((a, b) => b.date - a.date);
  PURCHASES.sort((a, b) => b.date - a.date);
  return true;
}

function clearData() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) {}
}

/** Kayıt boyutu — Ayarlar sayfasında gösterilir. */
function storageInfo() {
  let raw = '';
  try { raw = localStorage.getItem(STORE_KEY) || ''; } catch (e) {}
  const records = PRODUCTS.length + CUSTOMERS.length + STAFF.length +
                  SALES.length + PAYMENTS.length + PURCHASES.length;
  return { bytes: raw.length, records: records, saved: !!raw };
}

/* --------------------------------------------------------------------------
   Veri kaynağını değiştiren işlemler
   -------------------------------------------------------------------------- */

/** Her şeyi boşaltır — kendi verinizle sıfırdan başlamak için. */
function startEmpty() {
  const c = collections();
  Object.keys(c).forEach((k) => { c[k].length = 0; });
  saveData();
}

/** Örnek veri setine döner: kaydı silip sayfayı yeniden yükler (seed
    data.js'in yüklenme anında üretiliyor). */
function resetToDemo() {
  clearData();
  location.reload();
}

/* --------------------------------------------------------------------------
   Yedekleme
   -------------------------------------------------------------------------- */

function exportBackup() {
  const blob = new Blob([JSON.stringify(serialize(), null, 2)],
                        { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'netstore-yedek-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t('st_backup_done'));
}

/** Dosya seçtirir, doğrular ve içeri alır. */
function importBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.addEventListener('change', function () {
    const file = this.files && this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      let obj;
      try { obj = JSON.parse(String(reader.result)); }
      catch (e) { toast(t('st_import_bad'), 'warning'); return; }

      const c = collections();
      if (!obj || obj.v !== STORE_VERSION ||
          !Object.keys(c).every((k) => Array.isArray(obj[k]))) {
        toast(t('st_import_bad'), 'warning');
        return;
      }
      /* Önce diske yaz, sonra oku: tek bir doğrulama yolu kalsın. */
      try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }
      catch (e) { toast(t('st_save_failed'), 'warning'); return; }

      if (loadData()) {
        render();
        toast(t('st_import_done', { n: num(storageInfo().records) }));
      } else {
        toast(t('st_import_bad'), 'warning');
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

/* --------------------------------------------------------------------------
   Açılış
   -------------------------------------------------------------------------- */

/** data.js örnek veriyi ürettikten sonra çağrılır: kayıt varsa onu kullan. */
function initStore() {
  if (!loadData()) saveData();      // ilk açılış: örnek veri kaydedilir
}
