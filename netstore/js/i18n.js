/* ==========================================================================
   NetStore — çok dilli katman (فارسی / Türkçe / English)
   Dil seçimi yazı yönünü (RTL/LTR), sayı biçimini, tarih biçimini ve
   para birimi yazımını birlikte değiştirir.
   Para birimi: Afgani (AFN) — Farsça yazımı افغانی
   ========================================================================== */

const LANGS = {
  fa: { name:'دری',      short:'فا', dir:'rtl', locale:'fa-AF', currency:'افغانی', digits:'arabext' },
  tr: { name:'Türkçe',   short:'TR', dir:'ltr', locale:'tr-TR', currency:'AFN',    digits:'latn' },
  en: { name:'English',  short:'EN', dir:'ltr', locale:'en-GB', currency:'AFN',    digits:'latn' }
};

const LANG_KEY = 'netstore-lang';
const CAL_KEY  = 'netstore-cal';

const I18N = {

  /* ---------------- kimlik ve gezinme ---------------- */
  app_name:        { tr:'NetStore',            en:'NetStore',            fa:'نت‌ستور' },
  app_sub:         { tr:'Yönetim Paneli',      en:'Admin Panel',         fa:'پنل مدیریت' },

  nav_dashboard:   { tr:'Dashboard',           en:'Dashboard',           fa:'داشبورد' },
  nav_products:    { tr:'Ürünler',             en:'Products',            fa:'محصولات' },
  nav_stock:       { tr:'Stok',                en:'Stock',               fa:'موجودی' },
  nav_sales:       { tr:'Satışlar',            en:'Sales',               fa:'فروشات' },
  nav_purchases:   { tr:'Alışlar',             en:'Purchases',           fa:'خریدها' },
  nav_customers:   { tr:'Müşteriler',          en:'Customers',           fa:'مشتریان' },
  nav_invoices:    { tr:'Faturalar',           en:'Invoices',            fa:'فاکتورها' },
  nav_payments:    { tr:'Tahsilatlar',         en:'Payments',            fa:'دریافتی‌ها' },
  nav_debt:        { tr:'Borç / Alacak',       en:'Debt / Receivables',  fa:'بدهی / طلب' },
  nav_reports:     { tr:'Raporlar',            en:'Reports',             fa:'گزارش‌ها' },
  nav_staff:       { tr:'Personel',            en:'Staff',               fa:'کارمندان' },
  nav_settings:    { tr:'Ayarlar',             en:'Settings',            fa:'تنظیمات' },

  grp_inventory:   { tr:'Envanter',            en:'Inventory',           fa:'انبار' },
  grp_operations:  { tr:'İşlemler',            en:'Operations',          fa:'عملیات' },
  grp_finance:     { tr:'Finans',              en:'Finance',             fa:'مالی' },
  grp_management:  { tr:'Yönetim',             en:'Management',          fa:'مدیریت' },

  crumb_overview:  { tr:'Genel bakış',         en:'Overview',            fa:'نمای کلی' },
  page_customer:   { tr:'Müşteri Detayı',      en:'Customer Detail',     fa:'جزئیات مشتری' },

  /* ---------------- üst bar ---------------- */
  search_ph:       { tr:'Ürün, müşteri veya fatura ara…', en:'Search product, customer or invoice…', fa:'جستجوی جنس، مشتری یا فاکتور…' },
  aria_search:     { tr:'Ara',                 en:'Search',              fa:'جستجو' },
  aria_notif:      { tr:'Bildirimler',         en:'Notifications',       fa:'اعلان‌ها' },
  aria_help:       { tr:'Yardım',              en:'Help',                fa:'راهنما' },
  aria_menu_open:  { tr:'Menüyü aç',           en:'Open menu',           fa:'باز کردن منو' },
  aria_menu_close: { tr:'Menüyü kapat',        en:'Close menu',          fa:'بستن منو' },
  aria_lang:       { tr:'Dil seç',             en:'Select language',     fa:'انتخاب زبان' },
  aria_back:       { tr:'Geri',                en:'Back',                fa:'بازگشت' },
  aria_close:      { tr:'Kapat',               en:'Close',               fa:'بستن' },

  /* ---------------- KPI ---------------- */
  kpi_invest:      { tr:'Toplam Yatırım',      en:'Total Investment',    fa:'مجموع سرمایه‌گذاری' },
  kpi_invest_d:    { tr:'Tedarikçi alışlarının toplam maliyeti', en:'Total cost of supplier purchases', fa:'مجموع هزینهٔ خریدها از تأمین‌کنندگان' },
  kpi_sales:       { tr:'Toplam Satış',        en:'Total Sales',         fa:'مجموع فروش' },
  kpi_sales_d:     { tr:'Son 12 ay · geçen ayın aynı dönemine göre', en:'Last 12 months · vs. same period last month', fa:'۱۲ ماه اخیر · نسبت به همین دوره ماه گذشته' },
  kpi_profit:      { tr:'Gerçekleşen Kâr',     en:'Realised Profit',     fa:'سود تحقق‌یافته' },
  kpi_profit_d:    { tr:'Satış − maliyet · marj %{n}', en:'Sales − cost · margin {n}%', fa:'فروش − هزینه · حاشیهٔ {n}٪' },
  kpi_stock:       { tr:'Toplam Stok',         en:'Total Stock',         fa:'مجموع موجودی' },
  kpi_stock_d:     { tr:'Depo değeri {v}',     en:'Warehouse value {v}', fa:'ارزش انبار {v}' },
  kpi_low:         { tr:'Azalan Ürünler',      en:'Low Stock Items',     fa:'اجناس کم‌موجود' },
  kpi_low_d:       { tr:'Minimum stok seviyesinin altında', en:'Below minimum stock level', fa:'پایین‌تر از حد اقل موجودی' },
  kpi_staff:       { tr:'Aktif Personel',      en:'Active Staff',        fa:'کارمندان فعال' },
  kpi_staff_d:     { tr:'{t} kayıtlı personelin {a} tanesi aktif', en:'{a} of {t} registered staff are active', fa:'{a} نفر از {t} کارمند ثبت‌شده فعال است' },

  unit_pcs:        { tr:'adet',                en:'pcs',                 fa:'عدد' },
  n_purchases:     { tr:'{n} alış',            en:'{n} purchases',       fa:'{n} خرید' },
  n_products_ok:   { tr:'{n} ürün yeterli',    en:'{n} items sufficient',fa:'{n} جنس کافی' },
  n_critical:      { tr:'{n} kritik',          en:'{n} critical',        fa:'{n} بحرانی' },
  n_running_out:   { tr:'{n} ürün tükenmek üzere', en:'{n} items about to run out', fa:'{n} جنس رو به اتمام' },
  active_n:        { tr:'Aktif {n}',           en:'Active {n}',          fa:'فعال {n}' },
  passive_n:       { tr:'Pasif {n}',           en:'Inactive {n}',        fa:'غیرفعال {n}' },
  this_month:      { tr:'{p} bu ay',           en:'{p} this month',      fa:'{p} این ماه' },

  /* ---------------- durum ---------------- */
  st_paid:         { tr:'Tamamlandı',          en:'Completed',           fa:'تسویه‌شده' },
  st_partial:      { tr:'Kısmi Ödeme',         en:'Partial Payment',     fa:'پرداخت جزئی' },
  st_pending:      { tr:'Ödeme Bekliyor',      en:'Awaiting Payment',    fa:'در انتظار پرداخت' },
  st_late:         { tr:'Gecikti',             en:'Overdue',             fa:'معوق' },

  b_no_debt:       { tr:'Borcu Yok',           en:'No Debt',             fa:'بدون بدهی' },
  b_open_balance:  { tr:'Açık Bakiye',         en:'Open Balance',        fa:'مانده باز' },
  b_late_debt:     { tr:'Gecikmiş Borç',       en:'Overdue Debt',        fa:'بدهی معوق' },
  b_sufficient:    { tr:'Yeterli',             en:'Sufficient',          fa:'کافی' },
  b_running_low:   { tr:'Azalıyor',            en:'Running Low',         fa:'رو به کاهش' },
  b_critical:      { tr:'Kritik',              en:'Critical',            fa:'بحرانی' },
  b_active:        { tr:'Aktif',               en:'Active',              fa:'فعال' },
  b_passive:       { tr:'Pasif',               en:'Inactive',            fa:'غیرفعال' },
  b_on_due:        { tr:'Vadesinde',           en:'On Schedule',         fa:'در موعد' },
  b_due_soon:      { tr:'Vade yaklaştı',       en:'Due Soon',            fa:'نزدیک سررسید' },
  b_days_late:     { tr:'{n} gün gecikti',     en:'{n} days overdue',    fa:'{n} روز تأخیر' },
  b_settled:       { tr:'Ödendi',              en:'Paid',                fa:'پرداخت‌شده' },
  b_n_invoices:    { tr:'{n} fatura',          en:'{n} invoices',        fa:'{n} فاکتور' },

  /* ---------------- butonlar ---------------- */
  btn_export:      { tr:'Dışa Aktar',          en:'Export',              fa:'خروجی' },
  btn_report:      { tr:'Rapor Al',            en:'Get Report',          fa:'دریافت گزارش' },
  btn_print:       { tr:'Yazdır',              en:'Print',               fa:'چاپ' },
  btn_new_sale:    { tr:'Yeni Satış',          en:'New Sale',            fa:'فروش جدید' },
  btn_new_invoice: { tr:'Fatura Oluştur',      en:'Create Invoice',      fa:'ایجاد فاکتور' },
  btn_new_product: { tr:'Yeni Ürün',           en:'New Product',         fa:'جنس جدید' },
  btn_new_customer:{ tr:'Yeni Müşteri',        en:'New Customer',        fa:'مشتری جدید' },
  btn_new_purchase:{ tr:'Yeni Alış',           en:'New Purchase',        fa:'خرید جدید' },
  btn_new_staff:   { tr:'Personel Ekle',       en:'Add Staff',           fa:'افزودن کارمند' },
  btn_stock_in:    { tr:'Stok Girişi',         en:'Stock Entry',         fa:'ورود موجودی' },
  btn_entry:       { tr:'Giriş',               en:'Entry',               fa:'ورود' },
  btn_invoice:     { tr:'Fatura',              en:'Invoice',             fa:'فاکتور' },
  btn_add_payment: { tr:'Tahsilat Ekle',       en:'Add Payment',         fa:'ثبت دریافتی' },
  btn_payment:     { tr:'Tahsilat',            en:'Payment',             fa:'دریافتی' },
  btn_whatsapp:    { tr:'WhatsApp Gönder',     en:'Send via WhatsApp',   fa:'ارسال واتس‌اپ' },
  btn_email:       { tr:'E-posta Gönder',      en:'Send Email',          fa:'ارسال ایمیل' },
  btn_statement:   { tr:'Ekstre Yazdır',       en:'Print Statement',     fa:'چاپ صورت‌حساب' },
  btn_delete_cust: { tr:'Müşteriyi Sil',       en:'Delete Customer',     fa:'حذف مشتری' },
  btn_edit:        { tr:'Düzenle',             en:'Edit',                fa:'ویرایش' },
  btn_delete:      { tr:'Sil',                 en:'Delete',              fa:'حذف' },
  btn_detail:      { tr:'Detay',               en:'Detail',              fa:'جزئیات' },
  btn_all:         { tr:'Tümü',                en:'All',                 fa:'همه' },
  btn_save_set:    { tr:'Değişiklikleri Kaydet', en:'Save Changes',      fa:'ذخیرهٔ تغییرات' },
  btn_cancel:      { tr:'Vazgeç',              en:'Cancel',              fa:'انصراف' },
  btn_save_pay:    { tr:'Tahsilatı Kaydet',    en:'Save Payment',        fa:'ثبت دریافتی' },
  btn_reset_data:  { tr:'Verileri Sıfırla',    en:'Reset Data',          fa:'بازنشانی داده‌ها' },
  btn_del_account: { tr:'Hesabı Sil',          en:'Delete Account',      fa:'حذف حساب' },

  /* ---------------- tablo başlıkları ---------------- */
  c_invoice_no:    { tr:'Fatura No',           en:'Invoice No',          fa:'شماره فاکتور' },
  c_invoice:       { tr:'Fatura',              en:'Invoice',             fa:'فاکتور' },
  c_date:          { tr:'Tarih',               en:'Date',                fa:'تاریخ' },
  c_product:       { tr:'Ürün',                en:'Product',             fa:'جنس' },
  c_qty:           { tr:'Adet',                en:'Qty',                 fa:'تعداد' },
  c_total:         { tr:'Toplam',              en:'Total',               fa:'مجموع' },
  c_paid:          { tr:'Ödenen',              en:'Paid',                fa:'پرداخت‌شده' },
  c_remaining:     { tr:'Kalan',               en:'Remaining',           fa:'باقیمانده' },
  c_status:        { tr:'Durum',               en:'Status',              fa:'وضعیت' },
  c_customer:      { tr:'Müşteri',             en:'Customer',            fa:'مشتری' },
  c_phone:         { tr:'Telefon',             en:'Phone',               fa:'تلفن' },
  c_due:           { tr:'Vade',                en:'Due',                 fa:'سررسید' },
  c_last_due:      { tr:'Son Ödeme',           en:'Due Date',            fa:'سررسید' },
  c_action:        { tr:'İşlem',               en:'Action',              fa:'عملیات' },
  c_category:      { tr:'Kategori',            en:'Category',            fa:'دسته' },
  c_buy:           { tr:'Alış',                en:'Cost',                fa:'قیمت خرید' },
  c_sell:          { tr:'Satış',               en:'Price',               fa:'قیمت فروش' },
  c_margin:        { tr:'Marj',                en:'Margin',              fa:'حاشیه' },
  c_stock:         { tr:'Stok',                en:'Stock',               fa:'موجودی' },
  c_current:       { tr:'Mevcut',              en:'Current',             fa:'موجود' },
  c_min:           { tr:'Min.',                en:'Min.',                fa:'حداقل' },
  c_value:         { tr:'Değer',               en:'Value',               fa:'ارزش' },
  c_supplier:      { tr:'Tedarikçi',           en:'Supplier',            fa:'تأمین‌کننده' },
  c_purchase_no:   { tr:'Alış No',             en:'Purchase No',         fa:'شماره خرید' },
  c_lines:         { tr:'Kalem',               en:'Lines',               fa:'قلم' },
  c_amount:        { tr:'Tutar',               en:'Amount',              fa:'مبلغ' },
  c_method:        { tr:'Yöntem',              en:'Method',              fa:'روش' },
  c_start:         { tr:'Başlangıç',           en:'Start Date',          fa:'تاریخ شروع' },
  c_sale_count:    { tr:'Satış Adedi',         en:'Sales Count',         fa:'تعداد فروش' },
  c_revenue:       { tr:'Ciro',                en:'Revenue',             fa:'گردش مالی' },
  c_staff:         { tr:'Personel',            en:'Staff',               fa:'کارمند' },
  c_month:         { tr:'Ay',                  en:'Month',               fa:'ماه' },
  c_profit:        { tr:'Kâr',                 en:'Profit',              fa:'سود' },
  /* grafik serisi / tutar sütunu — ürün kartındaki birim satış fiyatından farklı */
  series_sales:    { tr:'Satış',               en:'Sales',               fa:'فروش' },
  c_total_sales:   { tr:'Toplam Satış',        en:'Total Sales',         fa:'مجموع فروش' },
  c_debt:          { tr:'Kalan Borç',          en:'Balance Due',         fa:'باقیمانده بدهی' },

  /* ---------------- sayfa başlıkları ---------------- */
  p_overview:      { tr:'Genel Bakış',         en:'Overview',            fa:'نمای کلی' },
  p_overview_sub:  { tr:'{d} · son 12 ayın özeti', en:'{d} · last 12 months summary', fa:'{d} · خلاصهٔ ۱۲ ماه اخیر' },
  p_products_sub:  { tr:'{n} ürün · envanter değeri {v}', en:'{n} products · inventory value {v}', fa:'{n} جنس · ارزش انبار {v}' },
  p_stock:         { tr:'Stok Durumu',         en:'Stock Status',        fa:'وضعیت موجودی' },
  p_stock_sub:     { tr:'{n} adet · {v} depo değeri', en:'{n} pcs · {v} warehouse value', fa:'{n} عدد · ارزش انبار {v}' },
  p_sales_sub:     { tr:'{n} işlem · {v} ciro', en:'{n} transactions · {v} revenue', fa:'{n} معامله · گردش {v}' },
  p_purchases_sub: { tr:'{n} alış · {v} toplam yatırım', en:'{n} purchases · {v} total investment', fa:'{n} خرید · مجموع سرمایه‌گذاری {v}' },
  p_customers_sub: { tr:'{n} müşteri · {v} toplam alacak', en:'{n} customers · {v} total receivable', fa:'{n} مشتری · مجموع طلب {v}' },
  p_invoices_sub:  { tr:'{n} fatura kesildi',  en:'{n} invoices issued', fa:'{n} فاکتور صادر شده' },
  p_payments_sub:  { tr:'{n} hareket · {v} toplam', en:'{n} transactions · {v} total', fa:'{n} تراکنش · مجموع {v}' },
  p_debt_sub:      { tr:'{n} müşteride açık bakiye', en:'{n} customers with open balance', fa:'{n} مشتری دارای مانده باز' },
  p_reports_sub:   { tr:'Son 12 ayın performans özeti', en:'Performance summary of last 12 months', fa:'خلاصهٔ عملکرد ۱۲ ماه اخیر' },
  p_staff_sub:     { tr:'{a} aktif · {t} kayıtlı', en:'{a} active · {t} registered', fa:'{a} فعال · {t} ثبت‌شده' },
  p_settings_sub:  { tr:'İşletme ve uygulama tercihleri', en:'Business and application preferences', fa:'تنظیمات کسب‌وکار و برنامه' },
  p_customer_sub:  { tr:'{type} müşteri · {n} fatura · {d} tarihinden beri', en:'{type} customer · {n} invoices · since {d}', fa:'مشتری {type} · {n} فاکتور · از {d}' },

  /* ---------------- kart başlıkları ---------------- */
  h_trend:         { tr:'Satış ve Kâr Eğilimi', en:'Sales & Profit Trend', fa:'روند فروش و سود' },
  h_trend_sub:     { tr:'Son 12 ay · aylık toplam', en:'Last 12 months · monthly total', fa:'۱۲ ماه اخیر · مجموع ماهانه' },
  h_collection:    { tr:'Tahsilat Durumu',     en:'Collection Status',   fa:'وضعیت دریافتی' },
  h_collection_sub:{ tr:'Toplam ciroya göre',  en:'Against total revenue', fa:'نسبت به کل گردش' },
  h_by_category:   { tr:'Kategori Bazlı Ciro', en:'Revenue by Category', fa:'گردش بر اساس دسته' },
  h_category_rev:  { tr:'Kategori Cirosu',     en:'Category Revenue',    fa:'گردش دسته‌ها' },
  h_recent_sales:  { tr:'Son Satışlar',        en:'Recent Sales',        fa:'فروشات اخیر' },
  h_recent_sub:    { tr:'En güncel 6 işlem',   en:'6 most recent transactions', fa:'۶ معاملهٔ اخیر' },
  h_recent_pay:    { tr:'Son Tahsilatlar',     en:'Recent Payments',     fa:'دریافتی‌های اخیر' },
  h_recent_pay_sub:{ tr:'Kasaya giren son hareketler', en:'Latest cash-in movements', fa:'آخرین ورودی‌های صندوق' },
  h_balance:       { tr:'Borç ve Tahsilat Özeti', en:'Debt & Payment Summary', fa:'خلاصهٔ بدهی و دریافتی' },
  h_balance_sub:   { tr:'Tüm faturaların toplamı', en:'Total of all invoices', fa:'مجموع همهٔ فاکتورها' },
  h_ledger:        { tr:'Tahsilat Geçmişi',    en:'Payment History',     fa:'تاریخچهٔ دریافتی' },
  h_ledger_sub:    { tr:'Her ödeme ve borç kaydı ayrı hareket', en:'Each payment and debt entry is a separate movement', fa:'هر پرداخت و بدهی یک تراکنش جداگانه' },
  h_sale_history:  { tr:'Satış Geçmişi',       en:'Sales History',       fa:'تاریخچهٔ فروش' },
  h_quick:         { tr:'Hızlı İşlemler',      en:'Quick Actions',       fa:'عملیات سریع' },
  h_pay_moves:     { tr:'Tahsilat Hareketleri', en:'Payment Movements',  fa:'تراکنش‌های دریافتی' },
  h_pay_moves_sub: { tr:'En yeniden eskiye',   en:'Newest first',        fa:'از جدید به قدیم' },
  h_pay_method:    { tr:'Ödeme Yöntemi',       en:'Payment Method',      fa:'روش پرداخت' },
  h_pay_method_sub:{ tr:'Tahsilatların dağılımı', en:'Distribution of payments', fa:'توزیع دریافتی‌ها' },
  h_balances:      { tr:'Müşteri Bakiyeleri',  en:'Customer Balances',   fa:'مانده‌های مشتریان' },
  h_balances_sub:  { tr:'Bakiyesi en yüksekten başlayarak', en:'Highest balance first', fa:'از بیشترین مانده' },
  h_aging:         { tr:'Alacak Yaşlandırma',  en:'Receivables Aging',   fa:'سن‌بندی مطالبات' },
  h_aging_sub:     { tr:'Açık bakiyenin vade durumuna göre dağılımı', en:'Open balance by due status', fa:'توزیع مانده باز بر اساس سررسید' },
  h_monthly:       { tr:'Aylık Satış ve Kâr',  en:'Monthly Sales & Profit', fa:'فروش و سود ماهانه' },
  h_last12:        { tr:'Son 12 ay',           en:'Last 12 months',      fa:'۱۲ ماه اخیر' },
  h_all_time:      { tr:'Tüm dönem',           en:'All time',            fa:'تمام دوره' },
  h_top_products:  { tr:'En Çok Satan Ürünler', en:'Best Selling Products', fa:'پرفروش‌ترین اجناس' },
  h_top_sub:       { tr:'Ciroya göre ilk 6',   en:'Top 6 by revenue',    fa:'۶ مورد برتر بر اساس گردش' },
  h_monthly_break: { tr:'Aylık Döküm',         en:'Monthly Breakdown',   fa:'تفکیک ماهانه' },
  h_monthly_b_sub: { tr:'Satış, kâr ve marj',  en:'Sales, profit and margin', fa:'فروش، سود و حاشیه' },
  h_business:      { tr:'İşletme Bilgileri',   en:'Business Details',    fa:'مشخصات کسب‌وکار' },
  h_business_sub:  { tr:'Faturalarda görünen bilgiler', en:'Information shown on invoices', fa:'اطلاعات نمایش‌داده‌شده در فاکتور' },
  h_finance:       { tr:'Finans',              en:'Finance',             fa:'مالی' },
  h_finance_sub:   { tr:'Para birimi ve vade tercihleri', en:'Currency and due date preferences', fa:'تنظیمات ارز و سررسید' },
  h_stock_set:     { tr:'Stok',                en:'Stock',               fa:'موجودی' },
  h_stock_set_sub: { tr:'Kritik seviye uyarıları', en:'Critical level alerts', fa:'هشدارهای سطح بحرانی' },
  h_danger:        { tr:'Tehlikeli Bölge',     en:'Danger Zone',         fa:'منطقهٔ خطر' },
  h_danger_sub:    { tr:'Bu işlemler geri alınamaz', en:'These actions cannot be undone', fa:'این عملیات قابل بازگشت نیست' },

  /* ---------------- KPI ikincil ---------------- */
  k_sel_revenue:   { tr:'Seçili Ciro',         en:'Selected Revenue',    fa:'گردش انتخاب‌شده' },
  k_collected:     { tr:'Tahsil Edilen',       en:'Collected',           fa:'دریافت‌شده' },
  k_collected_d:   { tr:'Kasaya giren tutar',  en:'Amount received',     fa:'مبلغ واردشده به صندوق' },
  k_open_balance:  { tr:'Açık Bakiye',         en:'Open Balance',        fa:'مانده باز' },
  k_not_collected: { tr:'Henüz tahsil edilmedi', en:'Not yet collected', fa:'هنوز دریافت نشده' },
  k_total_pcs:     { tr:'Toplam Adet',         en:'Total Units',         fa:'مجموع تعداد' },
  k_total_pcs_d:   { tr:'Tüm ürünlerin toplamı', en:'Sum of all products', fa:'مجموع همهٔ اجناس' },
  k_wh_value:      { tr:'Depo Değeri',         en:'Warehouse Value',     fa:'ارزش انبار' },
  k_wh_value_d:    { tr:'Alış maliyeti üzerinden', en:'At purchase cost', fa:'بر اساس قیمت خرید' },
  k_critical:      { tr:'Kritik Ürün',         en:'Critical Items',      fa:'اجناس بحرانی' },
  k_critical_d:    { tr:'Minimum stok altında', en:'Below minimum stock', fa:'زیر حداقل موجودی' },
  k_paid_sup:      { tr:'Ödenen',              en:'Paid',                fa:'پرداخت‌شده' },
  k_paid_sup_d:    { tr:'Kapatılan tedarikçi bakiyesi', en:'Settled supplier balance', fa:'مانده تسویه‌شدهٔ تأمین‌کننده' },
  k_sup_debt:      { tr:'Tedarikçi Borcu',     en:'Supplier Debt',       fa:'بدهی به تأمین‌کننده' },
  k_sup_debt_d:    { tr:'Ödenmeyi bekleyen tutar', en:'Amount awaiting payment', fa:'مبلغ در انتظار پرداخت' },
  k_biz_debt_d:    { tr:'İşletmenin ödeyeceği tutar', en:'Amount the business owes', fa:'مبلغ قابل پرداخت کسب‌وکار' },
  k_total_pay:     { tr:'Toplam Tahsilat',     en:'Total Payments',      fa:'مجموع دریافتی' },
  k_all_time:      { tr:'Tüm zamanlar',        en:'All time',            fa:'تمام دوره' },
  k_this_month:    { tr:'Bu Ay',               en:'This Month',          fa:'این ماه' },
  k_n_moves:       { tr:'{n} hareket',         en:'{n} movements',       fa:'{n} تراکنش' },
  k_pending_rec:   { tr:'Bekleyen Alacak',     en:'Pending Receivable',  fa:'طلب در انتظار' },
  k_total_rec:     { tr:'Toplam Alacak',       en:'Total Receivable',    fa:'مجموع طلب' },
  k_total_rec_d:   { tr:'Müşterilerden tahsil edilecek', en:'To be collected from customers', fa:'قابل دریافت از مشتریان' },
  k_overdue_rec:   { tr:'Gecikmiş Alacak',     en:'Overdue Receivable',  fa:'طلب معوق' },
  k_overdue_rec_d: { tr:'Vadesi geçmiş tutar', en:'Past due amount',     fa:'مبلغ گذشته از سررسید' },
  k_share:         { tr:'%{n} payı',           en:'{n}% share',          fa:'{n}٪ سهم' },
  k_revenue:       { tr:'Ciro',                en:'Revenue',             fa:'گردش مالی' },
  k_revenue_d:     { tr:'12 aylık toplam satış', en:'12-month total sales', fa:'مجموع فروش ۱۲ ماه' },
  k_gross_profit:  { tr:'Brüt Kâr',            en:'Gross Profit',        fa:'سود ناخالص' },
  k_avg_margin:    { tr:'Ortalama marj %{n}',  en:'Average margin {n}%', fa:'حاشیهٔ میانگین {n}٪' },
  k_investment:    { tr:'Yatırım',             en:'Investment',          fa:'سرمایه‌گذاری' },
  k_investment_d:  { tr:'Toplam alış maliyeti', en:'Total purchase cost', fa:'مجموع هزینهٔ خرید' },
  k_n_invoices:    { tr:'{n} fatura',          en:'{n} invoices',        fa:'{n} فاکتور' },

  /* ---------------- uyarılar ---------------- */
  al_late_title:   { tr:'{n} fatura gecikmiş durumda', en:'{n} invoices are overdue', fa:'{n} فاکتور معوق است' },
  al_late_text:    { tr:'Vadesi geçen toplam alacak {v}.', en:'Total past-due receivable {v}.', fa:'مجموع طلب گذشته از سررسید {v}.' },
  al_late_link:    { tr:'{l} sayfasından takip edin.', en:'Track it on the {l} page.', fa:'از صفحهٔ {l} پیگیری کنید.' },
  al_low_title:    { tr:'{n} üründe stok kritik seviyede', en:'{n} items at critical stock level', fa:'موجودی {n} جنس در سطح بحرانی است' },
  al_low_more:     { tr:'ve {n} ürün daha',    en:'and {n} more items',  fa:'و {n} جنس دیگر' },
  al_low_link:     { tr:'{l} sayfasına gidin.', en:'Go to the {l} page.', fa:'به صفحهٔ {l} بروید.' },
  al_low_stock:    { tr:'{n} ürün minimum seviyenin altında', en:'{n} items below minimum level', fa:'{n} جنس زیر حداقل سطح' },
  al_low_stock_t:  { tr:'Tedarikçiye sipariş açmanız önerilir.', en:'Placing a supplier order is recommended.', fa:'ثبت سفارش نزد تأمین‌کننده توصیه می‌شود.' },
  al_overdue_bal:  { tr:'Gecikmiş bakiye: {v}', en:'Overdue balance: {v}', fa:'مانده معوق: {v}' },
  al_overdue_txt:  { tr:'Vadesi geçmiş fatura(lar) mevcut. Müşteriyi bilgilendirmeniz önerilir.', en:'There are past-due invoices. Notifying the customer is recommended.', fa:'فاکتور(های) گذشته از سررسید وجود دارد. اطلاع‌رسانی به مشتری توصیه می‌شود.' },

  /* ---------------- müşteri detayı ---------------- */
  f_phone:         { tr:'Telefon',             en:'Phone',               fa:'تلفن' },
  f_email:         { tr:'E-posta',             en:'Email',               fa:'ایمیل' },
  f_address:       { tr:'Adres',               en:'Address',             fa:'آدرس' },
  f_since:         { tr:'Müşteri Olma Tarihi', en:'Customer Since',      fa:'تاریخ عضویت' },
  f_total_sales:   { tr:'Toplam Satış',        en:'Total Sales',         fa:'مجموع فروش' },
  f_total_paid:    { tr:'Toplam Ödenen',       en:'Total Paid',          fa:'مجموع پرداخت‌شده' },
  f_remaining:     { tr:'Kalan Borç',          en:'Balance Due',         fa:'باقیمانده بدهی' },
  f_due_date:      { tr:'Son Ödeme Tarihi',    en:'Due Date',            fa:'تاریخ سررسید' },
  f_n_payments:    { tr:'{n} tahsilat · %{p}', en:'{n} payments · {p}%', fa:'{n} دریافتی · {p}٪' },
  f_awaiting:      { tr:'Tahsil edilmeyi bekliyor', en:'Awaiting collection', fa:'در انتظار دریافت' },
  f_closed:        { tr:'Bakiye kapandı',      en:'Balance settled',     fa:'مانده تسویه شد' },
  f_no_due:        { tr:'Açık vade yok',       en:'No open due date',    fa:'سررسید بازی وجود ندارد' },
  f_days_late:     { tr:'{n} gün gecikti',     en:'{n} days overdue',    fa:'{n} روز تأخیر' },
  f_today_last:    { tr:'Bugün son gün',       en:'Today is the last day', fa:'امروز آخرین روز است' },
  f_days_left:     { tr:'{n} gün kaldı',       en:'{n} days left',       fa:'{n} روز باقی مانده' },
  f_paid_v:        { tr:'Ödenen {v}',          en:'Paid {v}',            fa:'پرداخت‌شده {v}' },
  f_remaining_v:   { tr:'Kalan {v}',           en:'Remaining {v}',       fa:'باقیمانده {v}' },
  f_last_payment:  { tr:'Son tahsilat: {d} · {v} · {m}', en:'Last payment: {d} · {v} · {m}', fa:'آخرین دریافتی: {d} · {v} · {m}' },
  f_debt_created:  { tr:'Borç oluşturuldu',    en:'Debt created',        fa:'بدهی ایجاد شد' },
  f_payment:       { tr:'Tahsilat',            en:'Payment',             fa:'دریافتی' },
  f_n_lines:       { tr:'{n} kalem',           en:'{n} lines',           fa:'{n} قلم' },
  f_paid_pct:      { tr:'Ödenen %{n}',         en:'Paid {n}%',           fa:'پرداخت‌شده {n}٪' },
  f_collected_of:  { tr:'tahsil edildi · toplam {v}', en:'collected · total {v}', fa:'دریافت شد · مجموع {v}' },

  /* ---------------- mesaj şablonu ---------------- */
  msg_balance:     {
    tr:'Sayın {name}, NetStore hesabınızda {v} tutarında açık bakiye görünmektedir. Son ödeme tarihi: {d}.',
    en:'Dear {name}, your NetStore account shows an open balance of {v}. Due date: {d}.',
    fa:'محترم {name}، در حساب شما در نت‌ستور مبلغ {v} مانده باز وجود دارد. تاریخ سررسید: {d}.'
  },
  msg_subject:     { tr:'NetStore — Hesap Ekstresi', en:'NetStore — Account Statement', fa:'نت‌ستور — صورت‌حساب' },

  /* ---------------- modal ---------------- */
  m_add_payment:   { tr:'Tahsilat Ekle',       en:'Add Payment',         fa:'ثبت دریافتی' },
  m_add_pay_sub:   { tr:'Ödeme, müşterinin bakiyesinden düşülür', en:'The payment is deducted from the customer balance', fa:'پرداخت از مانده مشتری کسر می‌شود' },
  m_customer:      { tr:'Müşteri',             en:'Customer',            fa:'مشتری' },
  m_invoice:       { tr:'Fatura',              en:'Invoice',             fa:'فاکتور' },
  m_amount:        { tr:'Tutar ({c})',         en:'Amount ({c})',        fa:'مبلغ ({c})' },
  m_method:        { tr:'Ödeme Yöntemi',       en:'Payment Method',      fa:'روش پرداخت' },
  m_hint_max:      { tr:'Kalan borçtan fazlası girilemez.', en:'Cannot exceed the remaining balance.', fa:'بیشتر از باقیمانده بدهی وارد نمی‌شود.' },
  m_opt_debt:      { tr:'{name} — {v} borç',   en:'{name} — {v} due',    fa:'{name} — {v} بدهی' },
  m_opt_rem:       { tr:'{no} — {v} kalan',    en:'{no} — {v} remaining', fa:'{no} — {v} باقیمانده' },

  /* ---------------- bildirim ---------------- */
  t_no_open:       { tr:'Açık bakiyesi olan müşteri yok.', en:'No customer has an open balance.', fa:'هیچ مشتری مانده باز ندارد.' },
  t_no_open_inv:   { tr:'Kapatılacak açık fatura yok.', en:'No open invoice to settle.', fa:'فاکتور بازی برای تسویه وجود ندارد.' },
  t_bad_amount:    { tr:'Geçerli bir tutar girin.', en:'Enter a valid amount.', fa:'مبلغ معتبر وارد کنید.' },
  t_saved:         { tr:'{v} tahsilat kaydedildi.', en:'Payment of {v} recorded.', fa:'دریافتی {v} ثبت شد.' },
  t_settings:      { tr:'Ayarlar kaydedildi.', en:'Settings saved.',     fa:'تنظیمات ذخیره شد.' },
  t_danger:        { tr:'Tehlikeli işlem — onay adımı gerekiyor.', en:'Dangerous action — confirmation required.', fa:'عملیات خطرناک — نیاز به تأیید دارد.' },


  /* ---------------- boş durumlar ---------------- */
  e_no_record:     { tr:'Kayıt bulunamadı.',   en:'No records found.',   fa:'رکوردی یافت نشد.' },
  e_no_sales:      { tr:'Bu aralıkta satış yok.', en:'No sales in this range.', fa:'در این بازه فروشی وجود ندارد.' },
  e_no_moves:      { tr:'Henüz hareket yok.',  en:'No movements yet.',   fa:'هنوز تراکنشی وجود ندارد.' },
  e_no_open_bal:   { tr:'Açık bakiyesi olan müşteri yok.', en:'No customer with an open balance.', fa:'مشتری با مانده باز وجود ندارد.' },
  e_no_balance:    { tr:'Açık bakiye yok.',    en:'No open balance.',    fa:'مانده بازی وجود ندارد.' },
  e_no_customer:   { tr:'Müşteri bulunamadı.', en:'Customer not found.', fa:'مشتری یافت نشد.' },

  /* ---------------- yaşlandırma ---------------- */
  ag_current:      { tr:'Vadesi gelmemiş',     en:'Not yet due',         fa:'سررسید نشده' },
  ag_30:           { tr:'1–30 gün gecikmiş',   en:'1–30 days overdue',   fa:'۱ تا ۳۰ روز تأخیر' },
  ag_60:           { tr:'31–60 gün gecikmiş',  en:'31–60 days overdue',  fa:'۳۱ تا ۶۰ روز تأخیر' },
  ag_90:           { tr:'60+ gün gecikmiş',    en:'60+ days overdue',    fa:'بیش از ۶۰ روز تأخیر' },

  /* ---------------- ayarlar ---------------- */
  s_biz_name:      { tr:'İşletme Adı',         en:'Business Name',       fa:'نام کسب‌وکار' },
  s_tax_no:        { tr:'Vergi No',            en:'Tax Number',          fa:'شماره مالیاتی' },
  s_currency:      { tr:'Para Birimi',         en:'Currency',            fa:'واحد پول' },
  s_currency_afn:  { tr:'Afgani (AFN)',        en:'Afghani (AFN)',       fa:'افغانی (AFN)' },
  s_default_due:   { tr:'Varsayılan Vade (gün)', en:'Default Due (days)', fa:'سررسید پیش‌فرض (روز)' },
  s_late_alert:    { tr:'Gecikme Uyarısı',     en:'Overdue Alert',       fa:'هشدار تأخیر' },
  s_on_due:        { tr:'Vade gününde',        en:'On due date',         fa:'در روز سررسید' },
  s_3_before:      { tr:'3 gün önce',          en:'3 days before',       fa:'۳ روز قبل' },
  s_7_before:      { tr:'7 gün önce',          en:'7 days before',       fa:'۷ روز قبل' },
  s_late_hint:     { tr:'Vadesi yaklaşan faturalar dashboard\'da turuncu uyarı olarak gösterilir.', en:'Invoices approaching their due date appear as an orange alert on the dashboard.', fa:'فاکتورهای نزدیک به سررسید در داشبورد به‌صورت هشدار نارنجی نمایش داده می‌شوند.' },
  s_default_min:   { tr:'Varsayılan Minimum Stok', en:'Default Minimum Stock', fa:'حداقل موجودی پیش‌فرض' },
  s_alert_channel: { tr:'Uyarı Kanalı',        en:'Alert Channel',       fa:'کانال هشدار' },
  s_in_app:        { tr:'Uygulama içi',        en:'In-app',              fa:'داخل برنامه' },
  s_language:      { tr:'Uygulama Dili',       en:'Application Language', fa:'زبان برنامه' },
  s_lang_hint:     { tr:'Seçilen dil arayüzün tamamını, faturaları ve fişleri kapsar.', en:'The selected language applies to the whole interface, invoices and receipts.', fa:'زبان انتخاب‌شده تمام رابط کاربری، فاکتورها و رسیدها را در بر می‌گیرد.' },

  /* ---------------- veri etiketleri ---------------- */
  cat_phone:       { tr:'Telefon',             en:'Phone',               fa:'تلفن' },
  cat_computer:    { tr:'Bilgisayar',          en:'Computer',            fa:'کمپیوتر' },
  cat_accessory:   { tr:'Aksesuar',            en:'Accessory',           fa:'لوازم جانبی' },
  cat_display:     { tr:'Ekran',               en:'Display',             fa:'مانیتور' },
  cat_wearable:    { tr:'Giyilebilir',         en:'Wearable',            fa:'پوشیدنی' },

  type_personal:   { tr:'Bireysel',            en:'Individual',          fa:'شخصی' },
  type_corporate:  { tr:'Kurumsal',            en:'Corporate',           fa:'شرکتی' },

  pay_cash:        { tr:'Nakit',               en:'Cash',                fa:'نقد' },
  pay_transfer:    { tr:'Havale/EFT',          en:'Bank Transfer',       fa:'حواله بانکی' },
  pay_card:        { tr:'Kredi Kartı',         en:'Credit Card',         fa:'کارت اعتباری' },

  role_manager:    { tr:'Mağaza Müdürü',       en:'Store Manager',       fa:'مدیر فروشگاه' },
  role_sales:      { tr:'Satış Danışmanı',     en:'Sales Advisor',       fa:'مشاور فروش' },
  role_warehouse:  { tr:'Depo Sorumlusu',      en:'Warehouse Officer',   fa:'مسئول انبار' },
  role_accounting: { tr:'Muhasebe',            en:'Accounting',          fa:'حسابدار' },

  /* ---------------- formlar ---------------- */
  form_new_sale:   { tr:'Yeni Satış',           en:'New Sale',            fa:'فروش جدید' },
  form_new_sale_s: { tr:'Kalem ekleyin, stok ve bakiye otomatik güncellenir', en:'Add line items; stock and balance update automatically', fa:'اقلام را اضافه کنید؛ موجودی و مانده خودکار به‌روز می‌شود' },
  form_new_prod:   { tr:'Yeni Ürün',            en:'New Product',         fa:'جنس جدید' },
  form_edit_prod:  { tr:'Ürünü Düzenle',        en:'Edit Product',        fa:'ویرایش جنس' },
  form_new_cust:   { tr:'Yeni Müşteri',         en:'New Customer',        fa:'مشتری جدید' },
  form_edit_cust:  { tr:'Müşteriyi Düzenle',    en:'Edit Customer',       fa:'ویرایش مشتری' },
  form_new_purch:  { tr:'Yeni Alış',            en:'New Purchase',        fa:'خرید جدید' },
  form_new_staff:  { tr:'Personel Ekle',        en:'Add Staff',           fa:'افزودن کارمند' },
  form_edit_staff: { tr:'Personeli Düzenle',    en:'Edit Staff',          fa:'ویرایش کارمند' },
  form_stock_in:   { tr:'Stok Girişi',          en:'Stock Entry',         fa:'ورود موجودی' },
  form_stock_in_s: { tr:'Girilen miktar mevcut stoğa eklenir', en:'The amount is added to current stock', fa:'مقدار واردشده به موجودی فعلی افزوده می‌شود' },

  fld_name:        { tr:'Ad Soyad',             en:'Full Name',           fa:'نام و تخلص' },
  fld_prod_name:   { tr:'Ürün Adı',             en:'Product Name',        fa:'نام جنس' },
  fld_sku:         { tr:'Stok Kodu',            en:'SKU',                 fa:'کد جنس' },
  fld_category:    { tr:'Kategori',             en:'Category',            fa:'دسته' },
  fld_buy:         { tr:'Alış Fiyatı ({c})',    en:'Cost Price ({c})',    fa:'قیمت خرید ({c})' },
  fld_sell:        { tr:'Satış Fiyatı ({c})',   en:'Sale Price ({c})',    fa:'قیمت فروش ({c})' },
  fld_stock:       { tr:'Başlangıç Stoğu',      en:'Opening Stock',       fa:'موجودی اولیه' },
  fld_min:         { tr:'Minimum Stok',         en:'Minimum Stock',       fa:'حداقل موجودی' },
  fld_supplier:    { tr:'Tedarikçi',            en:'Supplier',            fa:'تأمین‌کننده' },
  fld_type:        { tr:'Müşteri Tipi',         en:'Customer Type',       fa:'نوع مشتری' },
  fld_role:        { tr:'Görev',                en:'Role',                fa:'وظیفه' },
  fld_start:       { tr:'İşe Başlama',          en:'Start Date',          fa:'تاریخ شروع کار' },
  fld_active:      { tr:'Durum',                en:'Status',              fa:'وضعیت' },
  fld_staff:       { tr:'Satış Danışmanı',      en:'Sales Rep',           fa:'مسئول فروش' },
  fld_due_days:    { tr:'Vade (gün)',           en:'Payment Term (days)', fa:'مهلت پرداخت (روز)' },
  fld_prepay:      { tr:'Peşin Tahsilat ({c})', en:'Upfront Payment ({c})', fa:'پرداخت نقدی ({c})' },
  fld_prepay_h:    { tr:'0 bırakırsanız fatura “Ödeme Bekliyor” olur.', en:'Leave 0 and the invoice becomes “Awaiting Payment”.', fa:'اگر ۰ بماند، فاکتور «در انتظار پرداخت» می‌شود.' },
  fld_quantity:    { tr:'Miktar',               en:'Quantity',            fa:'مقدار' },
  fld_paid_amount: { tr:'Ödenen ({c})',         en:'Paid ({c})',          fa:'پرداخت‌شده ({c})' },

  ln_items:        { tr:'Kalemler',             en:'Line Items',          fa:'اقلام' },
  ln_add:          { tr:'Kalem Ekle',           en:'Add Item',            fa:'افزودن قلم' },
  ln_remove:       { tr:'Kalemi çıkar',         en:'Remove item',         fa:'حذف قلم' },
  ln_total:        { tr:'Toplam',               en:'Total',               fa:'مجموع' },
  ln_stock_left:   { tr:'stokta {n}',           en:'{n} in stock',        fa:'{n} در موجودی' },

  btn_save:        { tr:'Kaydet',               en:'Save',                fa:'ذخیره' },
  btn_create:      { tr:'Oluştur',              en:'Create',              fa:'ایجاد' },
  btn_confirm_del: { tr:'Evet, sil',            en:'Yes, delete',         fa:'بله، حذف کن' },

  cf_title:        { tr:'Silme onayı',          en:'Confirm deletion',    fa:'تأیید حذف' },
  cf_product:      { tr:'“{n}” ürünü silinecek. Bu işlem geri alınamaz.', en:'Product “{n}” will be deleted. This cannot be undone.', fa:'جنس «{n}» حذف می‌شود. این عمل قابل بازگشت نیست.' },
  cf_customer:     { tr:'“{n}” müşterisi ve {s} faturası silinecek. Bu işlem geri alınamaz.', en:'Customer “{n}” and {s} invoices will be deleted. This cannot be undone.', fa:'مشتری «{n}» و {s} فاکتور آن حذف می‌شود. این عمل قابل بازگشت نیست.' },
  cf_has_debt:     { tr:'Dikkat: bu müşterinin {v} açık bakiyesi var.', en:'Warning: this customer has an open balance of {v}.', fa:'هشدار: این مشتری {v} مانده باز دارد.' },

  /* --- doğrulama --- */
  v_required:      { tr:'“{f}” zorunlu.',        en:'“{f}” is required.',  fa:'«{f}» الزامی است.' },
  v_number:        { tr:'“{f}” geçerli bir sayı olmalı.', en:'“{f}” must be a valid number.', fa:'«{f}» باید عدد معتبر باشد.' },
  v_positive:      { tr:'“{f}” sıfırdan büyük olmalı.', en:'“{f}” must be greater than zero.', fa:'«{f}» باید بزرگ‌تر از صفر باشد.' },
  v_sell_lt_buy:   { tr:'Satış fiyatı alış fiyatından düşük — zararına satış.', en:'Sale price is below cost — selling at a loss.', fa:'قیمت فروش کمتر از قیمت خرید است — فروش با ضرر.' },
  v_no_items:      { tr:'En az bir kalem ekleyin.', en:'Add at least one line item.', fa:'حداقل یک قلم اضافه کنید.' },
  v_stock_short:   { tr:'“{p}” için yeterli stok yok (mevcut {n}).', en:'Not enough stock for “{p}” (available {n}).', fa:'موجودی «{p}» کافی نیست (موجود {n}).' },
  v_prepay_max:    { tr:'Peşin tahsilat toplamı aşamaz.', en:'Upfront payment cannot exceed the total.', fa:'پرداخت نقدی نمی‌تواند از مجموع بیشتر باشد.' },
  v_sku_dup:       { tr:'“{n}” stok kodu zaten kullanılıyor.', en:'SKU “{n}” is already in use.', fa:'کد جنس «{n}» قبلاً استفاده شده است.' },

  /* --- başarı bildirimleri --- */
  ok_sale:         { tr:'{no} numaralı satış oluşturuldu.', en:'Sale {no} created.', fa:'فروش {no} ایجاد شد.' },
  ok_product:      { tr:'Ürün kaydedildi.',     en:'Product saved.',      fa:'جنس ذخیره شد.' },
  ok_customer:     { tr:'Müşteri kaydedildi.',  en:'Customer saved.',     fa:'مشتری ذخیره شد.' },
  ok_purchase:     { tr:'{no} numaralı alış kaydedildi.', en:'Purchase {no} recorded.', fa:'خرید {no} ثبت شد.' },
  ok_staff:        { tr:'Personel kaydedildi.', en:'Staff member saved.', fa:'کارمند ذخیره شد.' },
  ok_stock_in:     { tr:'{p} için {n} adet giriş yapıldı.', en:'{n} units added to {p}.', fa:'{n} عدد به {p} افزوده شد.' },
  ok_deleted:      { tr:'Silindi.',             en:'Deleted.',            fa:'حذف شد.' },
  ok_export:       { tr:'{n} satır dışa aktarıldı.', en:'{n} rows exported.', fa:'{n} سطر خروجی گرفته شد.' },

  cf_reset:        { tr:'Tüm veriler örnek veri setine döndürülecek.', en:'All data will be reset to the sample dataset.', fa:'همهٔ داده‌ها به مجموعهٔ نمونه بازگردانده می‌شود.' },
  cf_reset_note:   { tr:'Bu oturumda eklediğiniz kayıtlar kaybolur.', en:'Records you added in this session will be lost.', fa:'رکوردهایی که در این نشست افزوده‌اید از بین می‌رود.' },

  /* --- takvim ayarı --- */
  s_calendar:      { tr:'Takvim',               en:'Calendar',            fa:'تقویم' },
  s_cal_greg:      { tr:'Miladi',               en:'Gregorian',           fa:'میلادی' },
  s_cal_persian:   { tr:'Hicri-şemsi',          en:'Solar Hijri',         fa:'هجری شمسی' },
  s_cal_hint:      { tr:'Seçim tüm ekranları, faturaları ve fişleri kapsar.', en:'Applies to all screens, invoices and receipts.', fa:'روی همهٔ صفحات، فاکتورها و رسیدها اعمال می‌شود.' },

  /* --- dışa aktarma --- */
  exp_products:    { tr:'urunler',              en:'products',            fa:'products' },
  exp_sales:       { tr:'satislar',             en:'sales',               fa:'sales' },
  exp_customers:   { tr:'musteriler',           en:'customers',           fa:'customers' },
  exp_debt:        { tr:'borc-alacak',          en:'receivables',         fa:'receivables' },

  /* ---------------- arama ---------------- */
  sr_none:         { tr:'“{q}” için sonuç yok.', en:'No results for “{q}”.', fa:'نتیجه‌ای برای «{q}» یافت نشد.' },
  sr_hint:         { tr:'↑ ↓ ile gezin · Enter ile aç · Esc ile kapat', en:'↑ ↓ to navigate · Enter to open · Esc to close', fa:'↑ ↓ برای حرکت · Enter برای باز کردن · Esc برای بستن' },
  aria_search_tgl: { tr:'Aramayı aç',            en:'Open search',         fa:'باز کردن جستجو' },

  /* ---------------- veri / depolama ---------------- */
  h_data:          { tr:'Veri',                  en:'Data',                fa:'داده‌ها' },
  h_data_sub:      { tr:'Kayıtlar bu tarayıcıda saklanır', en:'Records are stored in this browser', fa:'رکوردها در همین مرورگر ذخیره می‌شوند' },
  st_records:      { tr:'{n} kayıt · {s}',       en:'{n} records · {s}',   fa:'{n} رکورد · {s}' },
  st_not_saved:    { tr:'Henüz kaydedilmedi',    en:'Not saved yet',       fa:'هنوز ذخیره نشده' },
  st_records_cloud:{ tr:'{n} kayıt · ortak defterde', en:'{n} records · in the shared ledger', fa:'{n} رکورد · در دفتر مشترک' },
  st_cloud_hint:   { tr:'Kayıtlar bulutta; yedek dosyası yine de indirebilirsiniz.', en:'Records live in the cloud; you can still download a backup file.', fa:'رکوردها در ابر است؛ باز هم می‌توانید نسخهٔ پشتیبان بگیرید.' },
  st_save_failed:  { tr:'Kaydedilemedi — tarayıcı depolaması dolu veya kapalı.', en:'Could not save — browser storage is full or disabled.', fa:'ذخیره نشد — حافظهٔ مرورگر پر یا غیرفعال است.' },
  st_backup:       { tr:'Yedek Al',              en:'Download Backup',     fa:'دریافت نسخهٔ پشتیبان' },
  st_backup_done:  { tr:'Yedek dosyası indirildi.', en:'Backup file downloaded.', fa:'فایل پشتیبان دانلود شد.' },
  st_restore:      { tr:'Yedeği Geri Yükle',     en:'Restore Backup',      fa:'بازیابی پشتیبان' },
  st_import_done:  { tr:'{n} kayıt geri yüklendi.', en:'{n} records restored.', fa:'{n} رکورد بازیابی شد.' },
  st_import_bad:   { tr:'Dosya okunamadı — geçerli bir NetStore yedeği değil.', en:'Could not read the file — not a valid NetStore backup.', fa:'فایل خوانده نشد — نسخهٔ پشتیبان معتبر نت‌ستور نیست.' },
  st_empty:        { tr:'Sıfırdan Başla',        en:'Start Empty',         fa:'شروع از صفر' },
  st_empty_hint:   { tr:'Örnek veriyi silip kendi kayıtlarınızla başlayın.', en:'Clear the sample data and start with your own records.', fa:'داده‌های نمونه را پاک کنید و با رکوردهای خود شروع کنید.' },
  st_emptied:      { tr:'Tüm kayıtlar silindi. Artık kendi verinizi girebilirsiniz.', en:'All records cleared. You can now enter your own data.', fa:'همهٔ رکوردها پاک شد. حالا می‌توانید داده‌های خود را وارد کنید.' },
  cf_empty:        { tr:'Tüm kayıtlar silinecek ve uygulama boş açılacak.', en:'All records will be deleted and the app will start empty.', fa:'همهٔ رکوردها حذف می‌شود و برنامه خالی باز خواهد شد.' },
  cf_empty_note:   { tr:'Önce yedek almanız önerilir — bu işlem geri alınamaz.', en:'Taking a backup first is recommended — this cannot be undone.', fa:'ابتدا نسخهٔ پشتیبان بگیرید — این عمل قابل بازگشت نیست.' },

  /* ---------------- giriş / ortak defter ---------------- */
  au_sub:          { tr:'Ortak deftere Google hesabınızla girin', en:'Sign in to the shared ledger with Google', fa:'با حساب گوگل وارد دفتر مشترک شوید' },
  au_google:       { tr:'Google ile giriş yap',  en:'Sign in with Google', fa:'ورود با گوگل' },
  au_signing:      { tr:'Giriş yapılıyor…',      en:'Signing in…',         fa:'در حال ورود…' },
  au_loading:      { tr:'Defter yükleniyor…',    en:'Loading the ledger…', fa:'دفتر بارگیری می‌شود…' },
  au_failed:       { tr:'Giriş yapılamadı. Tekrar deneyin.', en:'Sign-in failed. Please try again.', fa:'ورود ناموفق بود. دوباره تلاش کنید.' },
  au_offline_note: { tr:'Bir kez girdikten sonra internetsiz de çalışır.', en:'Once signed in, it works offline too.', fa:'پس از یک بار ورود، بدون انترنت هم کار می‌کند.' },
  t_print_hint:    { tr:'Bir şey açılmadıysa tarayıcı menüsünden ⋮ → Yazdır deyin.', en:'If nothing opened, use the browser menu ⋮ → Print.', fa:'اگر چیزی باز نشد، از منوی مرورگر ⋮ ← چاپ استفاده کنید.' },
  au_denied_head:  { tr:'Bu hesabın erişimi yok', en:'This account has no access', fa:'این حساب دسترسی ندارد' },
  au_denied:       { tr:'{e} bu deftere ekli değil. Yetkili bir hesapla girin.', en:'{e} is not on this ledger. Sign in with an authorised account.', fa:'{e} در این دفتر نیست. با حساب مجاز وارد شوید.' },
  au_other:        { tr:'Başka hesapla gir',     en:'Use another account',  fa:'با حساب دیگر وارد شوید' },
  au_signout:      { tr:'Çıkış yap',             en:'Sign out',             fa:'خروج' },
  cf_signout:      { tr:'Çıkış yapılsın mı? Kayıtlar ortak defterde durur, silinmez.', en:'Sign out? Your records stay in the shared ledger.', fa:'خارج می‌شوید؟ رکوردها در دفتر مشترک باقی می‌ماند.' },

  h_cloud:         { tr:'Ortak Defter',          en:'Shared Ledger',        fa:'دفتر مشترک' },
  h_cloud_sub:     { tr:'Kayıtlar iki telefonda da aynı', en:'Records stay the same on both phones', fa:'رکوردها در هر دو موبایل یکسان می‌ماند' },
  cl_signed_as:    { tr:'{n} olarak girildi',    en:'Signed in as {n}',     fa:'وارد شده به نام {n}' },
  cl_guarded:      { tr:'App Check açık — istekler bu uygulamadan geldiği doğrulanarak kabul ediliyor.', en:'App Check on — requests are verified as coming from this app.', fa:'App Check فعال است — درخواست‌ها تأیید می‌شوند که از همین برنامه آمده‌اند.' },
  cl_unguarded:    { tr:'Erişimi Firestore kuralları koruyor. App Check ek koruma için açılabilir.', en:'Access is protected by Firestore rules. App Check can be enabled for an extra layer.', fa:'دسترسی با قوانین Firestore محافظت می‌شود. App Check را می‌توان برای لایهٔ بیشتر فعال کرد.' },
  cl_synced:       { tr:'Eşitlendi — değişiklikler anında karşı tarafa geçiyor.', en:'In sync — changes reach the other person instantly.', fa:'همگام شد — تغییرات فوراً به طرف مقابل می‌رسد.' },
  cl_write_failed: { tr:'Değişiklik buluta yazılamadı; internet gelince tekrar denenecek.', en:'Could not write to the cloud; it will retry when you are back online.', fa:'در ابر ذخیره نشد؛ با بازگشت انترنت دوباره تلاش می‌شود.' },
  cl_read_failed:  { tr:'Ortak deftere ulaşılamadı ({e}).', en:'Could not reach the shared ledger ({e}).', fa:'دسترسی به دفتر مشترک ممکن نشد ({e}).' },
  cl_local_head:   { tr:'Şu an yalnız bu cihazda', en:'Currently on this device only', fa:'فعلاً فقط روی همین دستگاه' },
  cl_local_sub:    { tr:'Ortak kullanım için js/firebase-config.js dosyasını doldurun; kurulum README’de anlatılıyor.', en:'Fill in js/firebase-config.js to share; setup is described in the README.', fa:'برای استفادهٔ مشترک js/firebase-config.js را پر کنید؛ راهنما در README است.' },

  /* ---------------- telefona kurulum (PWA) ---------------- */
  h_app:           { tr:'Uygulama',              en:'App',                 fa:'اپلیکیشن' },
  h_app_sub:       { tr:'Telefona kur, internetsiz kullan', en:'Install on your phone, use offline', fa:'روی موبایل نصب کنید، بدون انترنت کار می‌کند' },
  pw_install:      { tr:'Telefona Kur',          en:'Install App',         fa:'نصب روی موبایل' },
  pw_installed:    { tr:'Uygulama kurulu',       en:'App is installed',    fa:'اپلیکیشن نصب است' },
  pw_installed_sub:{ tr:'Ana ekrandaki simgeden tam ekran açılıyor.', en:'Opens full screen from the home-screen icon.', fa:'از آیکن صفحهٔ اصلی به‌صورت تمام‌صفحه باز می‌شود.' },
  pw_ready_sub:    { tr:'Ana ekrana simge eklenir, tarayıcı çubuğu görünmez.', en:'Adds a home-screen icon and hides the browser bar.', fa:'آیکن به صفحهٔ اصلی اضافه می‌شود و نوار مرورگر پنهان می‌گردد.' },
  pw_manual:       { tr:'Tarayıcı menüsünden kurun', en:'Install from the browser menu', fa:'از منوی مرورگر نصب کنید' },
  pw_manual_and:   { tr:'Android · Chrome: ⋮ menüsü → “Uygulamayı yükle” veya “Ana ekrana ekle”.', en:'Android · Chrome: ⋮ menu → “Install app” or “Add to Home screen”.', fa:'اندروید · کروم: منوی ⋮ ← «نصب برنامه» یا «افزودن به صفحهٔ اصلی».' },
  pw_manual_ios:   { tr:'iPhone · Safari: Paylaş → “Ana Ekrana Ekle”.', en:'iPhone · Safari: Share → “Add to Home Screen”.', fa:'آیفون · سافاری: اشتراک‌گذاری ← «افزودن به صفحهٔ اصلی».' },
  pw_offline_on:   { tr:'Çevrimdışı hazır — internet olmadan da açılır.', en:'Offline ready — opens without internet.', fa:'آمادهٔ کار بدون انترنت.' },
  pw_offline_wait: { tr:'Çevrimdışı kopya hazırlanıyor — sayfayı bir kez yenileyin.', en:'Preparing the offline copy — refresh the page once.', fa:'نسخهٔ آفلاین آماده می‌شود — یک بار صفحه را تازه کنید.' },
  pw_offline_none: { tr:'Çevrimdışı destek yok — uygulama https:// adresinden açılmalı.', en:'No offline support — open the app over https://.', fa:'پشتیبانی آفلاین نیست — برنامه باید از https:// باز شود.' },
  pw_install_done: { tr:'Uygulama ana ekrana eklendi.', en:'App added to your home screen.', fa:'اپلیکیشن به صفحهٔ اصلی اضافه شد.' },
  pw_install_no:   { tr:'Kurulum iptal edildi.',  en:'Installation dismissed.', fa:'نصب لغو شد.' },

  /* ---------------- boş durumlar ---------------- */
  e_start_products:{ tr:'Henüz ürün yok. “{b}” ile ilk ürününüzü ekleyin.', en:'No products yet. Add your first with “{b}”.', fa:'هنوز جنسی نیست. با «{b}» اولین جنس را اضافه کنید.' },
  e_start_customers:{ tr:'Henüz müşteri yok. “{b}” ile ilk müşterinizi ekleyin.', en:'No customers yet. Add your first with “{b}”.', fa:'هنوز مشتری نیست. با «{b}» اولین مشتری را اضافه کنید.' },
  e_start_sales:   { tr:'Henüz satış yok. “{b}” ile ilk satışınızı kaydedin.', en:'No sales yet. Record your first with “{b}”.', fa:'هنوز فروشی نیست. با «{b}» اولین فروش را ثبت کنید.' },
  e_start_purchases:{ tr:'Henüz alış yok. “{b}” ile ilk alışınızı kaydedin.', en:'No purchases yet. Record your first with “{b}”.', fa:'هنوز خریدی نیست. با «{b}» اولین خرید را ثبت کنید.' },
  e_start_staff:   { tr:'Henüz personel yok. “{b}” ile ekleyin.', en:'No staff yet. Add with “{b}”.', fa:'هنوز کارمندی نیست. با «{b}» اضافه کنید.' },
  e_need_products: { tr:'Önce ürün eklemelisiniz.', en:'You need to add a product first.', fa:'ابتدا باید جنسی اضافه کنید.' },
  e_need_customers:{ tr:'Önce müşteri eklemelisiniz.', en:'You need to add a customer first.', fa:'ابتدا باید مشتری اضافه کنید.' },
  e_need_staff:    { tr:'Önce aktif bir personel eklemelisiniz.', en:'You need an active staff member first.', fa:'ابتدا باید کارمند فعالی اضافه کنید.' },

  /* ---------------- fatura / fiş ---------------- */
  inv_title:       { tr:'FATURA',              en:'INVOICE',             fa:'فاکتور' },
  inv_receipt:     { tr:'TAHSİLAT FİŞİ',       en:'PAYMENT RECEIPT',     fa:'رسید دریافتی' },
  inv_no:          { tr:'Fatura No',           en:'Invoice No',          fa:'شماره فاکتور' },
  inv_date:        { tr:'Düzenleme Tarihi',    en:'Issue Date',          fa:'تاریخ صدور' },
  inv_due:         { tr:'Son Ödeme Tarihi',    en:'Due Date',            fa:'تاریخ سررسید' },
  inv_seller:      { tr:'SATICI',              en:'SELLER',              fa:'فروشنده' },
  inv_buyer:       { tr:'ALICI',               en:'BUYER',               fa:'خریدار' },
  inv_no_col:      { tr:'#',                   en:'#',                   fa:'#' },
  inv_desc:        { tr:'Açıklama',            en:'Description',         fa:'شرح' },
  inv_unit_price:  { tr:'Birim Fiyat',         en:'Unit Price',          fa:'قیمت واحد' },
  inv_line_total:  { tr:'Tutar',               en:'Amount',              fa:'مبلغ' },
  inv_subtotal:    { tr:'Ara Toplam',          en:'Subtotal',            fa:'جمع جزء' },
  inv_grand:       { tr:'GENEL TOPLAM',        en:'GRAND TOTAL',         fa:'مجموع کل' },
  inv_paid:        { tr:'Tahsil Edilen',       en:'Amount Paid',         fa:'مبلغ دریافت‌شده' },
  inv_balance:     { tr:'KALAN BORÇ',          en:'BALANCE DUE',         fa:'باقیمانده بدهی' },
  inv_payments:    { tr:'Tahsilat Hareketleri', en:'Payment Movements',  fa:'تراکنش‌های دریافتی' },
  inv_no_payments: { tr:'Bu fatura için henüz tahsilat yapılmamıştır.', en:'No payment has been received for this invoice yet.', fa:'برای این فاکتور هنوز دریافتی ثبت نشده است.' },
  inv_footer:      { tr:'Bu belge NetStore tarafından elektronik olarak düzenlenmiştir.', en:'This document was issued electronically by NetStore.', fa:'این سند به‌صورت الکترونیکی توسط نت‌ستور صادر شده است.' },
  inv_thanks:      { tr:'İş birliğiniz için teşekkür ederiz.', en:'Thank you for your business.', fa:'از همکاری شما سپاسگزاریم.' },
  inv_sign_seller: { tr:'Satıcı Kaşe / İmza',  en:'Seller Stamp / Signature', fa:'مهر و امضای فروشنده' },
  inv_sign_buyer:  { tr:'Alıcı İmza',          en:'Buyer Signature',     fa:'امضای خریدار' },
  inv_print:       { tr:'Yazdır / PDF',        en:'Print / PDF',         fa:'چاپ / پی‌دی‌اف' },
  inv_biz_name:    { tr:'NetStore Elektronik', en:'NetStore Electronics', fa:'الکترونیک نت‌ستور' },
  inv_biz_addr:    { tr:'Şar-e Naw, Kabil / Afganistan', en:'Shar-e Naw, Kabul / Afghanistan', fa:'شهر نو، کابل / افغانستان' },
  inv_tax:         { tr:'Vergi No',            en:'Tax No',              fa:'شماره مالیاتی' }
};

/* ==========================================================================
   Çalışma zamanı
   ========================================================================== */

let LANG = (function () {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && LANGS[saved]) return saved;
  const nav = (navigator.language || 'fa').slice(0, 2).toLowerCase();
  if (nav === 'fa' || nav === 'ps' || nav === 'prs') return 'fa';
  if (nav === 'tr') return 'tr';
  return 'en';
})();

function lang() { return LANG; }
function langMeta() { return LANGS[LANG]; }
function isRTL() { return LANGS[LANG].dir === 'rtl'; }

/** Çeviri. Eksik anahtar sessizce anahtarın kendisini döner. */
function t(key, vars) {
  const row = I18N[key];
  let s = row ? (row[LANG] || row.en || row.tr) : key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = s.split('{' + k + '}').join(vars[k]);
    });
  }
  return s;
}

/* --- takvim tercihi: miladi (gregory) veya hicri-şemsi (persian) --- */
let CAL = (function () {
  const saved = localStorage.getItem(CAL_KEY);
  return saved === 'persian' ? 'persian' : 'gregory';
})();

function calendar() { return CAL; }

function setCalendar(c) {
  CAL = (c === 'persian') ? 'persian' : 'gregory';
  localStorage.setItem(CAL_KEY, CAL);
  _dtfCache = {};
}

function setLang(code) {
  if (!LANGS[code]) return;
  LANG = code;
  localStorage.setItem(LANG_KEY, code);
  _fmtCache = {};
  _dtfCache = {};
  applyLangToDocument();
}

function applyLangToDocument() {
  const m = LANGS[LANG];
  document.documentElement.setAttribute('lang', LANG);
  document.documentElement.setAttribute('dir', m.dir);
}

/* --------------------------------------------------------------------------
   Sayı, para ve tarih — hepsi seçili dile göre
   -------------------------------------------------------------------------- */

let _fmtCache = {};
function _nf(opts) {
  const key = LANG + JSON.stringify(opts);
  if (!_fmtCache[key]) _fmtCache[key] = new Intl.NumberFormat(LANGS[LANG].locale, opts);
  return _fmtCache[key];
}

/** Sade sayı (adet, gün vb.) */
function num(v) { return _nf({ maximumFractionDigits: 0 }).format(v || 0); }

/**
 * Para. Birim her dilde Afgani'dir; yazımı dile göre değişir:
 *   dری   → ۱٬۲۳۴ افغانی
 *   tr/en → 1.234 AFN
 */
function money(v, exact) {
  const n = _nf(exact
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : { maximumFractionDigits: 0 }).format(v || 0);
  return n + ' ' + LANGS[LANG].currency;
}

/** İşaretli para — çift yönlü metinde bozulmasın diye <bdi> ile yalıtılır. */
function signedMoney(v) {
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return '<bdi>' + sign + money(Math.abs(v)) + '</bdi>';
}

/** Yüzde. */
function pct(v) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return '<bdi>' + sign + _nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .format(Math.abs(v * 100)) + (LANG === 'fa' ? '٪' : '%') + '</bdi>';
}

/** Ondalıksız yüzde metni (dize olarak, işaretsiz). */
function pctPlain(v, digits) {
  return _nf({ minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 })
    .format(v);
}

/**
 * Tarih. Miladi (Gregoryen) takvim tüm dillerde korunur; yalnızca rakam ve
 * sıralama biçimi dile göre değişir. Hicri-şemsi istenirse bu fonksiyonda
 * calendar:'persian' yeterlidir.
 */
let _dtfCache = {};
function _dtf(opts, locale) {
  const key = (locale || LANGS[LANG].locale) + CAL + JSON.stringify(opts);
  if (!_dtfCache[key]) {
    _dtfCache[key] = new Intl.DateTimeFormat(locale || LANGS[LANG].locale,
      Object.assign({ calendar: CAL }, opts));
  }
  return _dtfCache[key];
}
function _part(parts, type) {
  const p = parts.find((x) => x.type === type);
  return p ? p.value : '';
}

/**
 * Tarih. Sıra elle kurulur — ICU'nun fa-AF kalıbı AA/GG/YYYY üretiyor ve bu
 * Afganistan'da yanlış okunur. Her dilde GG/AA/YYYY (tr'de nokta ile),
 * rakamlar ve takvim seçili tercihe göre.
 */
function fmtDate(d) {
  const x = d instanceof Date ? d : new Date(d);
  const parts = _dtf({ day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(x);
  const sep = LANG === 'tr' ? '.' : '/';
  return _part(parts, 'day') + sep + _part(parts, 'month') + sep + _part(parts, 'year');
}

/** Uzun tarih. formatToParts ile kurulur: hicri-şemsi seçiliyken bazı
    yerel ayarlar başa "AP" çağ ekini koyuyor, ona yer yok. */
function fmtDateLong(d) {
  const x = d instanceof Date ? d : new Date(d);
  const p = _dtf({ day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(x);
  return _part(p, 'day') + ' ' + _part(p, 'month') + ' ' + _part(p, 'year');
}

/** Grafik ekseni için kısa ay adı — seçili takvimde. */
function monthShort(d) {
  const x = d instanceof Date ? d : new Date(2026, d, 1);
  return _dtf({ month: 'short' }).format(x);
}

/** Seçili takvimde yıl-ay anahtarı (gruplama için, dilden bağımsız). */
function monthKey(d) {
  const parts = _dtf({ year: 'numeric', month: '2-digit' }, 'en-US-u-nu-latn').formatToParts(d);
  return _part(parts, 'year') + '-' + _part(parts, 'month');
}

/** Seçili takvimde ayın yılı — tablo etiketlerinde. */
function calYear(d) {
  return _part(_dtf({ year: 'numeric' }).formatToParts(d), 'year');
}

/* --------------------------------------------------------------------------
   Veri etiketleri — kayıtlarda anahtar tutulur, ekranda çevrilir
   -------------------------------------------------------------------------- */
/** Latin rakamlı teknik dizileri (telefon, vergi no) yön yalıtımıyla sarar:
    RTL bağlamda "+93 20 210 00 00" aksi hâlde ters sırayla dizilir. */
function ltr(s) { return '<span class="ltr">' + esc(s) + '</span>'; }

const catLabel    = (k) => t('cat_' + k);
const typeLabel   = (k) => t('type_' + k);
const methodLabel = (k) => t('pay_' + k);
const roleLabel   = (k) => t('role_' + k);
