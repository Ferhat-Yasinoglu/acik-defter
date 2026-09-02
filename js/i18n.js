/* ==========================================================================
   Çeviriler — tr / en / de / fa

   Anahtar adı içeriğin nerede durduğunu söyler:
     nav_*     gezinme            home_*    ana sayfa
     p1_*..p5_*  projeler         n1_*..n9_*  notlar
     j1_*..j8_*  yolculuk         about_*   hakkımda
   Dört sözlük de aynı anahtarları taşımak zorunda; tools/check.mjs
   eksik ya da fazla anahtar bulursa CI'yı düşürür.
   ========================================================================== */

const translations = {

  /* ------------------------------------------------------------------ tr */
  tr: {
    /* çerçeve */
    skip: "İçeriğe geç",
    nav_home: "Ana Sayfa",
    nav_journey: "Yolculuğum",
    nav_projects: "Projeler",
    nav_notes: "Notlar",
    nav_about: "Hakkımda",
    aria_theme: "Temayı değiştir",
    aria_lang: "Dili değiştir",

    title_home: "Farhad Yaqoobi — Açık Defter",
    title_journey: "Yolculuğum — Açık Defter",
    title_projects: "Projeler — Açık Defter",
    title_notes: "Notlar — Açık Defter",
    title_about: "Hakkımda — Açık Defter",
    title_privacy: "Gizlilik — Açık Defter",

    footer_tagline: "Bir IT öğrencisinin açık defteri.",
    footer_built: "Çerçevesiz, derleme adımsız. Kaynağı açık.",
    footer_source: "Bu sitenin kaynağı",
    footer_email: "E-posta",

    /* ana sayfa */
    home_eyebrow: "NRW, Almanya",
    home_h1: "Öğrendiğimi unutmadan buraya yazıyorum.",
    home_lead: "Almanya'da IT okuyorum. Bu defteri Ağustos 2026'da açtım — o günden beri ne yaptıysam, nerede tökezlediysem burada duruyor.",
    home_cta_projects: "Projelere bak",
    home_cta_notes: "Notları oku",
    now_label: "Şu sıralar",
    now_text: "reply-bot'un WhatsApp tarafını ayağa kaldırdım. Sırada Node.js ile backend temellerini düzgün öğrenmek var: veritabanı, kimlik doğrulama, test.",
    home_work_title: "Yaptıklarım",
    home_notes_title: "Son notlar",

    /* ana sayfa kartı */
    hero_quote: "Öğren, yap, yaz. Sırası bu.",
    stat_projects: "Proje",
    stat_notes: "Not",
    stat_langs: "Dil",
    stat_since: "Başlangıç",
    stat_since_v: "Ağu 2026",

    aria_scroll: "Aşağı kaydır",
    band1_t: "Dört dilde", band1_s: "Türkçe, Almanca, İngilizce, Farsça",
    band2_t: "Çevrimdışı okunur", band2_s: "Service worker sayfaları önbelleğe alıyor",
    band3_t: "Kaynağı açık", band3_s: "MIT lisansı, GitHub'da",
    band4_t: "Çerçevesiz", band4_s: "Düz HTML, CSS ve JavaScript",
    home_notes_all: "Tüm notlar",
    home_projects_all: "Tüm projeler",

    /* projeler */
    projects_lead: "Hepsi öğrenmek için başladı, hepsi çalışıyor. Kaynakları açık.",
    proj_learned: "Öğrendiklerim",
    link_source: "Kaynak",
    link_live: "Canlı",
    detail_open: "Ayrıntı",

    p1_when: "19–28 Ağu 2026",
    p1_tag: "Çevrimdışı çalışan mağaza paneli",
    p1_desc: "İki kişinin aynı defteri Google hesabıyla paylaştığı bir satış ve stok paneli. Kayıtlar Firestore'da eşitleniyor, ağ gidince uygulama çalışmaya devam ediyor, telefona kurulabiliyor. Afgani desteği ve basılabilir fatura var.",
    p1_learn: "Firestore güvenlik kuralları, App Check, service worker önbellek stratejileri — ve izin listesinin istemcide durmayacağı.",

    p2_when: "29 Ağu 2026",
    p2_tag: "Instagram yorumlarına ve WhatsApp mesajlarına kendi başına cevap veriyor",
    p2_desc: "Meta'nın webhook'u imzalı geliyor. Tekrar eden sorulara bir kural dosyası cevap veriyor — neyle yazıldığı, kaynağın nerede olduğu, öğrenmeye nereden başlanacağı — kalanı Claude'a gidiyor ve Claude emin olmadığında susuyor. Dört dil, çünkü mesajlar dört dilde geliyor. Tek kural motoru, iki oda: bir yorum gizlenebilir, bir WhatsApp cevabının 24 saati vardır.",
    p2_learn: "HMAC webhook imzaları, Meta Graph API, ve webhook'a işi yapmadan önce cevap vermek.",

    p3_when: "23–29 Ağu 2026",
    p3_tag: "Telegram akışlarını panelden değil, modele anlatarak kuruyorsun",
    p3_desc: "Botu bağla, akışı düz adımlarla anlat; sunucu konuşmayı yürütüyor — soru soruyor, cevapları saklıyor, buton basışına göre dallanıyor, insanları etiketliyor ve o etiketlerden çıkan gruplara duyuru yapıyor. MCP konuştuğu için akışı baştan sona model sürüyor; Telegram'a uzun yoklamayla bağlandığından açık bir adrese gerek kalmıyor.",
    p3_learn: "Model Context Protocol, kaldığı yerden devam eden arka plan işleri, ve şemayı yerinde taşımak.",

    p4_when: "18 Ağu 2026'dan beri",
    p4_tag: "Bu site",
    p4_desc: "Çerçeve yok, derleme adımı yok — düz HTML, CSS ve JavaScript. Dört dil aynı arayüzde, Farsça'ya geçince yön sağdan sola dönüyor. Bir kez açtıktan sonra ağ olmadan da okunuyor.",
    p4_learn: "Mantıksal CSS ölçüleriyle RTL, tercihleri sayfa boyanmadan önce uygulamak, ve tekrar eden HTML'i bir denetim script'iyle hizada tutmak.",

    p5_when: "23 Ağu 2026'dan beri",
    p5_name: "Profil kartları",
    p5_tag: "GitHub profilimdeki grafikler",
    p5_desc: "Profilimin üstündeki başlık, terminal, dil grafiği ve katkı takvimi üçüncü parti bir servisten gelmiyor. Bir Node script'i GitHub API'sini sorguluyor, SVG'leri çizip depoya yazıyor; bir workflow altı saatte bir yeniliyor.",
    p5_learn: "GitHub API'siyle çalışmak, SVG'yi elle yazmak, zamanlanmış workflow'lar.",

    /* notlar */
    notes_lead: "Bir şeyi çözdüğümde ya da bir şeye takıldığımda buraya yazıyorum. Çoğu kısa; amaç altı ay sonra kendime hatırlatmak.",
    filter_all: "Tümü",
    filter_bot: "Botlar",
    filter_web: "Web",
    filter_data: "Veri & güvenlik",
    notes_count_one: "not",
    notes_count_many: "not",
    notes_empty: "Bu süzgeçte not yok.",

    n1_date: "29 Ağu 2026",
    n1_title: "Webhook'a önce cevap ver, işi sonra yap",
    n1_sum: "Meta'nın webhook'u yanıt bekliyor. Claude'a sorup beklersen aynı olay tekrar tekrar geliyor.",
    n1_p1: "İlk sürümde önce cevabı üretip sonra 200 dönüyordum. Meta zaman aşımına düşünce aynı yorumu tekrar gönderiyor, bot da aynı şeye iki kez cevap veriyordu.",
    n1_p2: "Doğrusu: imzayı doğrula, hemen 200 dön, işi ondan sonra yap. Ayrı bir kuyruk kurmak gerekmedi — işi await etmemek yetti.",

    n2_date: "28 Ağu 2026",
    n2_title: "İzin listesi istemcide durmaz",
    n2_sum: "Kimin girebileceğini tarayıcıdaki bir dizide tutuyordum. Kaynağa bakan herkes listeyi görüyor.",
    n2_p1: "Listeyi Firestore kurallarının içine taşıdım. Artık kararı sunucu veriyor, istemci sadece sonucu görüyor.",
    n2_p2: "Kuralları yazarken fark ettim: kural veri modelinden sonra yazılmıyor. Önce 'kim neyi okuyabilir' sorusunu cevaplayıp modeli ona göre kurmak gerekiyor.",

    n3_date: "29 Ağu 2026",
    n3_title: "HMAC imzasını ham gövde üzerinden doğrula",
    n3_sum: "Ayrıştırılmış JSON'u tekrar metne çevirip imzalarsan imza hiçbir zaman tutmaz.",
    n3_p1: "Express'in json() ara katmanı gövdeyi ayrıştırıyor. JSON.stringify ile geri ürettiğim metin, Meta'nın imzaladığı baytların aynısı değil — boşluk ve anahtar sırası değişebiliyor.",
    n3_p2: "Çözüm, ham gövdeyi ayrıştırma sırasında ayrıca saklamak ve karşılaştırmayı timingSafeEqual ile yapmak; normal eşitlik karşılaştırması imzayı harf harf sızdırabiliyor.",

    n4_date: "25 Ağu 2026",
    n4_title: "Bir MCP sunucusu başka bir sunucunun istemcisi olabiliyor",
    n4_sum: "botflow-mcp'ye dışarıdaki bir sunucunun araçlarını devraldırdım.",
    n4_p1: "MCP'de sunucu ve istemci ayrı roller, ama aynı süreç ikisini birden üstlenebiliyor.",
    n4_p2: "Böylece dışarıdan gelen araçlar kendi araçlarımın yanına diziliyor; modelin tarafından bakınca tek bir sunucu görünüyor.",

    n5_date: "23 Ağu 2026",
    n5_title: "Uzun işi arka plana al, hız sınırına saygı duy",
    n5_sum: "Bir duyuruyu tek istekte göndermeye çalışmak hem zaman aşımı hem 429 demek.",
    n5_p1: "Gönderimi, kaldığı yerden devam edebilen bir arka plan işine çevirdim; nereye kadar gittiği veritabanında duruyor, süreç yeniden başlasa da baştan almıyor.",
    n5_p2: "Telegram'ın saniyelik sınırına takılmamak için mesajların arasına bekleme koydum. Yavaş, ama bitiyor.",

    n6_date: "21 Ağu 2026",
    n6_title: "App Check: anahtarın görünmesi sorun değil",
    n6_sum: "Firebase yapılandırması istemcide açıkta duruyor — ve durması normal.",
    n6_p1: "Web API anahtarı bir parola değil, projeyi adresleyen bir kimlik. Asıl koruma güvenlik kurallarından geliyor.",
    n6_p2: "App Check bunun üstüne 'bu çağrı gerçekten benim sitemden mi geliyor' sorusunu ekliyor. Kuralların yerine geçmiyor, onlarla birlikte çalışıyor.",

    n7_date: "20 Ağu 2026",
    n7_title: "Service worker'da neyi önbelleğe alacağına önceden karar ver",
    n7_sum: "Her şeyi önbellekten verirsen güncelleme kullanıcıya hiç ulaşmıyor.",
    n7_p1: "HTML'i önce ağdan denemek, CSS/JS/font'u önbellekten vermek dengeyi kurdu: içerik taze kalıyor, sayfa yine de anında açılıyor.",
    n7_p2: "Önbelleğe bir sürüm adı verip eskisini activate sırasında silmek gerekiyor. Yoksa kullanıcının tarayıcısında iki sürüm birden birikiyor.",

    n8_date: "19 Ağu 2026",
    n8_title: "Dil değişince yön de değişiyor",
    n8_sum: "Farsça'ya geçince sayfa dağılıyordu. Sebep, her yere left ve right yazmamdı.",
    n8_p1: "margin-left yerine margin-inline-start, left yerine inset-inline-start yazınca RTL kendiliğinden çalıştı — tek tek düzeltmeye gerek kalmadı.",
    n8_p2: "Elle çevrilmesi gereken tek şey yön belirten ikonlar oldu; onlara scaleX(-1) veren tek bir sınıf yetti.",

    n9_date: "18 Ağu 2026",
    n9_title: "İlk yayın",
    n9_sum: "GitHub Pages'e ilk kez bir şey koydum.",
    n9_p1: "Depoyu Pages'e bağladıktan sonra dosyaları itmek yayınlamak demek oldu; ayrı bir dağıtım adımı yok.",
    n9_p2: "Proje sayfası kök adreste değil, depo adının altında duruyor. Bu yüzden bağlantıları göreli yazmak gerekiyor — kökten yazılan yollar burada kırılıyor.",

    /* yolculuk */
    journey_lead: "Aşağıdaki tarihler uydurma değil; depolarımın commit geçmişinden geliyor.",

    j1_date: "17 Ağustos 2026",
    j1_title: "Defteri açtım",
    j1_text: "acik-defter deposunu oluşturdum. O gün elimde bir index.html ve bir stil dosyası vardı, o kadar.",

    j2_date: "18 Ağustos 2026",
    j2_title: "İlk yayın",
    j2_text: "Site GitHub Pages'te yayına girdi. İlk kez kendi yazdığım bir şeyin adresi oldu.",

    j3_date: "19–20 Ağustos 2026",
    j3_title: "NetStore paneli",
    j3_text: "Bir mağaza yönetim paneli yazmaya başladım: gösterge paneli, üç dil, basılabilir fatura. Sonra Google girişi ve Firestore ile iki kişilik ortak kullanım ekledim; en sonunda telefona kurulabilir hale getirdim.",

    j4_date: "21 Ağustos 2026",
    j4_title: "Güvenliği ciddiye aldım",
    j4_text: "İzin listesini istemciden sunucuya taşıdım ve App Check'i devreye aldım. Bir şeyi çalışır hale getirmekle güvenli hale getirmenin ayrı işler olduğunu burada anladım.",

    j5_date: "23 Ağustos 2026",
    j5_title: "MCP ile tanışma",
    j5_text: "botflow-mcp'yi yazmaya başladım. Model Context Protocol'ü ilk kez burada kullandım — bir sunucu yazıp onu modelin sürmesini izlemek tuhaf bir histi.",

    j6_date: "28 Ağustos 2026",
    j6_title: "NetStore'u kendi evine taşıdım",
    j6_text: "NetStore bu deponun içinde büyümüştü. git subtree split ile geçmişiyle birlikte ayırıp kendi deposuna taşıdım; bu defter yeniden sadece defter oldu.",

    j7_date: "29 Ağustos 2026",
    j7_title: "reply-bot",
    j7_text: "Instagram yorumlarına cevap veren botu yazdım, sonra aynı kural motoruna WhatsApp'ı bağladım. Webhook imzaları ve Meta Graph API bu günün konusuydu.",

    j8_date: "Sırada",
    j8_title: "Backend temelleri",
    j8_text: "Node.js tarafını düzgün öğrenmek istiyorum: veritabanı, kimlik doğrulama, test. Bir de React'e bakacağım.",

    /* hakkımda */
    about_lead: "Kısaca: Almanya'da IT okuyan, çoğunlukla gece kod yazan biri.",
    about_p1: "Adım Farhad Yaqoobi. Almanya'nın Kuzey Ren-Vestfalya eyaletinde yaşıyorum ve IT okuyorum. Yazılıma yeni başladım; bu defteri de tam o yüzden açtım — öğrenirken tuttuğum notların bir yerde durmasını istedim.",
    about_p2: "Burada sadece bitmiş işler yok. Takıldığım yerler, yanlış kurduğum şeyler ve sonradan söktüğüm çözümler de var. Bence öğrenmenin görünen kısmı zaten o.",
    about_p3: "Şu an frontend tarafında rahatım, backend tarafını öğreniyorum. Uzun vadede tam yığın çalışmak istiyorum ama acelem yok; temelleri sağlam atmayı tercih ediyorum.",
    about_facts_title: "Kısa bilgiler",
    about_k_location: "Konum",
    about_v_location: "Kuzey Ren-Vestfalya, Almanya",
    about_k_langs: "Diller",
    about_v_langs: "Türkçe, Almanca, İngilizce, Farsça",
    about_k_now: "Şu an",
    about_v_now: "Frontend, biraz Node.js",
    about_k_next: "Sırada",
    about_v_next: "Backend temelleri, React",
    about_k_tools: "Alet çantası",
    about_v_tools: "JavaScript, TypeScript, Firebase, Git",

    /* gizlilik */
    footer_privacy: "Gizlilik",
    priv_title: "Gizlilik",
    priv_lead: "Bu sitenin ve Instagram/WhatsApp otomatik yanıt botunun hangi veriyi, neden işlediği.",
    priv_updated: "Son güncelleme: 29 Ağustos 2026",

    priv_h_who: "Kim",
    priv_who: "Bu siteyi ve aşağıda anlatılan otomatik yanıt botunu Farhad Yaqoobi kişisel olarak yürütüyor (Kuzey Ren-Vestfalya, Almanya). Bir şirket değil. Sorular için adres en altta.",

    priv_h_site: "Bu sitede",
    priv_site1: "Site, GitHub Pages üzerinde duran statik dosyalardan ibaret. Analitik yok, takip pikseli yok, reklam çerezi yok, hesap yok, form yok.",
    priv_site2: "Tarayıcının yerel deposunda yalnızca iki şey tutuluyor: seçtiğin tema ve dil. İkisi de cihazından çıkmıyor, bana ulaşmıyor. Sayfaları çevrimdışı okunur kılan service worker da her şeyi senin tarayıcında saklıyor.",
    priv_site3: "Sayfa açılırken yazı tipleri Google Fonts'tan (fonts.googleapis.com ve fonts.gstatic.com) çekiliyor; bu istek sırasında Google IP adresini ve tarayıcı bilgini görüyor. Siteyi yayınlayan GitHub da istekleri kendi kayıtlarında tutuyor. İkisi de kendi gizlilik politikalarına tabi.",

    priv_h_bot: "Otomatik yanıt botu",
    priv_bot_scope: "reply-bot yalnızca benim kendi Instagram hesabıma (@farhad___yaqoobi) gelen yorumlar ve bağlı WhatsApp numarasına gelen mesajlar için çalışıyor. Bu bölüm sadece onu anlatıyor.",
    priv_bot_collect: "Meta'nın webhook'u üzerinden şunlar geliyor:",
    priv_bot_i1: "Yorumun ya da mesajın metni.",
    priv_bot_i2: "Gönderenin platforma özgü kimliği ve Meta'nın ilettiği durumlarda görünen kullanıcı adı.",
    priv_bot_i3: "Mesajın kimliği, hangi kanaldan geldiği ve zamanı.",
    priv_bot_none: "İsim, e-posta, telefon numarası, konum ya da webhook olayının kendisinde zaten bulunmayan hiçbir bilgi toplanmıyor.",

    priv_h_use: "Nasıl kullanılıyor",
    priv_use1: "Gelen metin önce sunucu belleğindeki bir anahtar kelime listesiyle karşılaştırılıyor. Sık gelen sorular — neyle yazıldı, kaynak kod nerede, öğrenmeye nereden başlanır — doğrudan o listeden cevaplanıyor.",
    priv_use2: "Hiçbir kural uymazsa mesajın metni, gönderenin kullanıcı adı ve hangi kanal olduğu Anthropic'in Claude API'sine gönderilip bir cevap taslağı isteniyor; model emin olmadığında hiç cevap yazmıyor. Sonuç yorumun altına açık bir yanıt, bir Instagram mesajı, yorumun gizlenmesi ya da bir WhatsApp cevabı oluyor. Profil çıkarma, reklam ya da başka bir analiz yapılmıyor.",

    priv_h_keep: "Ne kadar saklanıyor",
    priv_keep1: "Veritabanı yok. Sunucunun tuttuğu tek şey, aynı mesaja iki kez cevap gitmesin diye bellekte duran en fazla 5000 mesaj kimliğinden oluşan bir liste. Sunucu her yeniden başladığında bu liste siliniyor.",
    priv_keep2: "Mesajın metni ve gönderenin adı, sunucunun çalışma günlüğünde görünüyor. Bu günlükleri barındırma sağlayıcısı sınırlı bir süre tutuyor, sonra döngüyle siliyor. Bunun dışında içerik hiçbir yere yazılmıyor.",

    priv_h_share: "Paylaşım",
    priv_share: "Veri yalnızca iki yere gidiyor: cevabı iletmek için Meta'nın Graph API'si, ve kural eşleşmediğinde cevap taslağı için Anthropic'in Claude API'si. Başka hiçbir üçüncü tarafla paylaşılmıyor, satılmıyor, kiralanmıyor.",

    priv_h_children: "Çocuklar",
    priv_children: "Ne site ne de bot çocuklara yönelik; bilerek çocuklardan veri işlemek için kullanılmıyor.",

    priv_h_rights: "Hakların",
    priv_rights: "Almanya'da yaşadığım için GDPR geçerli: hakkında işlenen veriye erişmeyi, silinmesini ya da işlenmesine itiraz etmeyi isteyebilirsin. Yukarıda anlatılan kısa ömürlü kayıtların dışında saklanan bir şey olmadığından çoğu zaman silinecek bir veri bulunmuyor. Otomatik yanıt almak istemiyorsan bana yazman yeterli.",

    priv_h_changes: "Değişiklikler",
    priv_changes: "Toplanan veri ya da kullanım şekli değişirse bu sayfa güncellenir ve yukarıdaki tarih değişir. Sayfanın geçmişi deponun commit kayıtlarında açık duruyor.",

    priv_h_contact: "İletişim",
    priv_contact: "Bu politikayla ya da belirli bir etkileşimle ilgili her soru için:",

    contact_title: "Bana yaz",
    contact_text: "Web, Firebase ya da bot işleriyle ilgili bir şey sormak istersen e-posta en hızlısı. Genellikle bir iki gün içinde dönüyorum.",
    contact_email: "E-posta gönder"
  },

  /* ------------------------------------------------------------------ en */
  en: {
    skip: "Skip to content",
    nav_home: "Home",
    nav_journey: "Journey",
    nav_projects: "Projects",
    nav_notes: "Notes",
    nav_about: "About",
    aria_theme: "Switch theme",
    aria_lang: "Change language",

    title_home: "Farhad Yaqoobi — Open Notebook",
    title_journey: "Journey — Open Notebook",
    title_projects: "Projects — Open Notebook",
    title_notes: "Notes — Open Notebook",
    title_about: "About — Open Notebook",
    title_privacy: "Privacy — Open Notebook",

    footer_tagline: "An IT student's open notebook.",
    footer_built: "No framework, no build step. Source is open.",
    footer_source: "Source of this site",
    footer_email: "Email",

    home_eyebrow: "NRW, Germany",
    home_h1: "I write things down before I forget them.",
    home_lead: "I study IT in Germany. I started this notebook in August 2026 — everything I've built since then, and every place I got stuck, is here.",
    home_cta_projects: "See the projects",
    home_cta_notes: "Read the notes",
    now_label: "Right now",
    now_text: "I just got the WhatsApp side of reply-bot running. Next up: learning backend properly with Node.js — databases, auth, tests.",
    home_work_title: "What I've built",
    home_notes_title: "Latest notes",

    /* home card */
    hero_quote: "Learn it, build it, write it down. In that order.",
    stat_projects: "Projects",
    stat_notes: "Notes",
    stat_langs: "Languages",
    stat_since: "Since",
    stat_since_v: "Aug 2026",

    aria_scroll: "Scroll down",
    band1_t: "Four languages", band1_s: "Turkish, German, English, Persian",
    band2_t: "Reads offline", band2_s: "A service worker caches the pages",
    band3_t: "Open source", band3_s: "MIT licensed, on GitHub",
    band4_t: "No framework", band4_s: "Plain HTML, CSS and JavaScript",
    home_notes_all: "All notes",
    home_projects_all: "All projects",

    projects_lead: "Each one started as a way to learn something. All of them run, and all of them are open source.",
    proj_learned: "What I learned",
    link_source: "Source",
    link_live: "Live",
    detail_open: "Details",

    p1_when: "19–28 Aug 2026",
    p1_tag: "A shop dashboard that keeps working offline",
    p1_desc: "A sales and stock dashboard two people share through their Google accounts. Records sync through Firestore, the app keeps working when the network drops, and it installs onto a phone. It handles Afghani and prints an invoice.",
    p1_learn: "Firestore security rules, App Check, service worker cache strategies — and that an allowlist has no business living in the client.",

    p2_when: "29 Aug 2026",
    p2_tag: "Answers Instagram comments and WhatsApp messages on its own",
    p2_desc: "Meta's webhook arrives signed. A rules file answers the questions that keep coming back — what it's built with, where the source is, where to start learning — and anything left over goes to Claude, which stays quiet when it isn't sure. Four languages, because the messages arrive in four. One rule engine, two rooms: a comment can be hidden, a WhatsApp reply has 24 hours to be sent.",
    p2_learn: "HMAC webhook signatures, the Meta Graph API, and answering a webhook before doing the work.",

    p3_when: "23–29 Aug 2026",
    p3_tag: "Telegram flows built by describing them to a model, not clicking a dashboard",
    p3_desc: "Connect a bot, describe a flow in plain steps, and the server runs the conversation — asking questions, keeping the answers, branching on button presses, tagging people and broadcasting to the segments those tags create. It speaks MCP, so a model drives the whole thing; Telegram is reached by long polling, so no public URL is needed.",
    p3_learn: "The Model Context Protocol, resumable background jobs, and migrating a schema in place.",

    p4_when: "Since 18 Aug 2026",
    p4_tag: "This site",
    p4_desc: "No framework, no build step — plain HTML, CSS and JavaScript. Four languages in one interface, and the whole layout flips when you switch to Persian. Once you've opened it, it reads with the network off.",
    p4_learn: "RTL through logical CSS properties, applying preferences before the page paints, and keeping repeated HTML in sync with a check script.",

    p5_when: "Since 23 Aug 2026",
    p5_name: "Profile cards",
    p5_tag: "The graphics on my GitHub profile",
    p5_desc: "The header, the terminal, the language chart and the contribution calendar on my profile don't come from a third-party service. A Node script queries the GitHub API, draws the SVGs and writes them into the repo; a workflow refreshes them every six hours.",
    p5_learn: "Working with the GitHub API, writing SVG by hand, scheduled workflows.",

    notes_lead: "I write here when I work something out, or when I get stuck. Most are short — the point is to remind myself six months from now.",
    filter_all: "All",
    filter_bot: "Bots",
    filter_web: "Web",
    filter_data: "Data & security",
    notes_count_one: "note",
    notes_count_many: "notes",
    notes_empty: "No notes match this filter.",

    n1_date: "29 Aug 2026",
    n1_title: "Answer the webhook first, do the work after",
    n1_sum: "Meta's webhook is waiting for a reply. Ask Claude and wait for it, and the same event keeps arriving.",
    n1_p1: "My first version generated the answer and then returned 200. Meta timed out, resent the same comment, and the bot replied to it twice.",
    n1_p2: "The fix: verify the signature, return 200 immediately, then do the work. No queue needed — not awaiting the job was enough.",

    n2_date: "28 Aug 2026",
    n2_title: "An allowlist doesn't belong in the client",
    n2_sum: "I was keeping the list of who may sign in in a browser-side array. Anyone reading the source can read the list.",
    n2_p1: "I moved the list into the Firestore rules. The server decides now; the client only sees the result.",
    n2_p2: "Writing those rules taught me they can't be bolted on after the data model. You answer 'who may read what' first, then shape the model around it.",

    n3_date: "29 Aug 2026",
    n3_title: "Verify the HMAC signature against the raw body",
    n3_sum: "Re-serialise the parsed JSON and sign that, and the signature will never match.",
    n3_p1: "Express's json() middleware parses the body. The string JSON.stringify hands back isn't the same bytes Meta signed — whitespace and key order can differ.",
    n3_p2: "The fix is to stash the raw body during parsing and compare with timingSafeEqual; a plain equality check can leak the signature one character at a time.",

    n4_date: "25 Aug 2026",
    n4_title: "An MCP server can be a client of another one",
    n4_sum: "I had botflow-mcp take over the tools of an external server.",
    n4_p1: "In MCP, server and client are separate roles — but one process can hold both at once.",
    n4_p2: "External tools now sit next to my own. From the model's side it all looks like a single server.",

    n5_date: "23 Aug 2026",
    n5_title: "Move long work to the background, respect the rate limit",
    n5_sum: "Trying to send a broadcast inside one request means both a timeout and a 429.",
    n5_p1: "I turned sending into a resumable background job. How far it got lives in the database, so a restart doesn't start it over.",
    n5_p2: "I added a wait between messages to stay under Telegram's per-second limit. It's slow, but it finishes.",

    n6_date: "21 Aug 2026",
    n6_title: "App Check: a visible key isn't the problem",
    n6_sum: "The Firebase config sits in the client in plain sight — and that's fine.",
    n6_p1: "A web API key isn't a password; it's an address for the project. The real protection comes from the security rules.",
    n6_p2: "App Check adds one more question on top: is this call really coming from my site? It doesn't replace the rules, it works alongside them.",

    n7_date: "20 Aug 2026",
    n7_title: "Decide up front what the service worker caches",
    n7_sum: "Serve everything from cache and updates never reach anyone.",
    n7_p1: "Trying the network first for HTML and the cache first for CSS, JS and fonts struck the balance: content stays fresh, the page still opens instantly.",
    n7_p2: "The cache needs a version name and the old one has to be deleted on activate. Otherwise two versions pile up in the user's browser.",

    n8_date: "19 Aug 2026",
    n8_title: "Changing the language changes the direction too",
    n8_sum: "Switching to Persian tore the layout apart. The cause was writing left and right everywhere.",
    n8_p1: "Replacing margin-left with margin-inline-start and left with inset-inline-start made RTL work by itself — nothing to fix case by case.",
    n8_p2: "The only things that needed flipping by hand were the directional icons; one class applying scaleX(-1) covered them.",

    n9_date: "18 Aug 2026",
    n9_title: "First deploy",
    n9_sum: "The first time I put something on GitHub Pages.",
    n9_p1: "Once the repo was connected to Pages, pushing files was publishing them — there's no separate deploy step.",
    n9_p2: "A project page doesn't live at the root, it lives under the repo name. So links have to be relative; root-absolute paths break here.",

    journey_lead: "These dates aren't invented — they come from the commit history of my repositories.",

    j1_date: "17 August 2026",
    j1_title: "Opened the notebook",
    j1_text: "I created the acik-defter repository. That day it held one index.html and one stylesheet, and that was all.",

    j2_date: "18 August 2026",
    j2_title: "First deploy",
    j2_text: "The site went live on GitHub Pages. For the first time something I'd written had an address.",

    j3_date: "19–20 August 2026",
    j3_title: "The NetStore dashboard",
    j3_text: "I started writing a shop management dashboard: an overview, three languages, a printable invoice. Then I added Google sign-in and Firestore so two people could share it, and finally made it installable on a phone.",

    j4_date: "21 August 2026",
    j4_title: "Took security seriously",
    j4_text: "I moved the allowlist from the client to the server and switched on App Check. This is where it landed that making something work and making it safe are two different jobs.",

    j5_date: "23 August 2026",
    j5_title: "Meeting MCP",
    j5_text: "I started writing botflow-mcp. It was my first time using the Model Context Protocol — writing a server and then watching a model drive it was a strange feeling.",

    j6_date: "28 August 2026",
    j6_title: "Moved NetStore into its own home",
    j6_text: "NetStore had grown up inside this repository. I split it out with its history using git subtree split and gave it its own repo, so this notebook went back to being just a notebook.",

    j7_date: "29 August 2026",
    j7_title: "reply-bot",
    j7_text: "I wrote the bot that answers Instagram comments, then connected WhatsApp to the same rule engine. Webhook signatures and the Meta Graph API were the subject of the day.",

    j8_date: "Next",
    j8_title: "Backend fundamentals",
    j8_text: "I want to learn the Node.js side properly: databases, authentication, tests. And I'll take a look at React.",

    about_lead: "Short version: an IT student in Germany who mostly writes code at night.",
    about_p1: "My name is Farhad Yaqoobi. I live in North Rhine-Westphalia, Germany, and I study IT. I'm new to software, which is exactly why this notebook exists — I wanted the notes I take while learning to live somewhere.",
    about_p2: "It isn't only finished work. The places I got stuck, the things I built wrong and later tore out are here too. That's the visible part of learning, as far as I can tell.",
    about_p3: "I'm comfortable on the frontend now and learning the backend. Long term I want to work full-stack, but I'm in no rush — I'd rather lay the foundations properly.",
    about_facts_title: "Quick facts",
    about_k_location: "Location",
    about_v_location: "North Rhine-Westphalia, Germany",
    about_k_langs: "Languages",
    about_v_langs: "Turkish, German, English, Persian",
    about_k_now: "Right now",
    about_v_now: "Frontend, some Node.js",
    about_k_next: "Next",
    about_v_next: "Backend fundamentals, React",
    about_k_tools: "Toolbox",
    about_v_tools: "JavaScript, TypeScript, Firebase, Git",

    /* privacy */
    footer_privacy: "Privacy",
    priv_title: "Privacy",
    priv_lead: "What data this site and the Instagram/WhatsApp auto-reply bot process, and why.",
    priv_updated: "Last updated: 29 August 2026",

    priv_h_who: "Who",
    priv_who: "This site and the auto-reply bot described below are run personally by Farhad Yaqoobi (North Rhine-Westphalia, Germany). Not a company. The contact address is at the bottom.",

    priv_h_site: "On this site",
    priv_site1: "The site is nothing but static files on GitHub Pages. No analytics, no tracking pixels, no advertising cookies, no accounts, no forms.",
    priv_site2: "Two things are kept in your browser's local storage: the theme and the language you picked. Neither leaves your device or reaches me. The service worker that makes the pages readable offline also stores everything in your own browser.",
    priv_site3: "When a page loads, the fonts are fetched from Google Fonts (fonts.googleapis.com and fonts.gstatic.com), and Google sees your IP address and browser details as part of that request. GitHub, which serves the site, also keeps request records of its own. Both are governed by their own privacy policies.",

    priv_h_bot: "The auto-reply bot",
    priv_bot_scope: "reply-bot runs only for comments on my own Instagram account (@farhad___yaqoobi) and messages to the connected WhatsApp number. This section is about that bot alone.",
    priv_bot_collect: "Meta's webhook delivers:",
    priv_bot_i1: "The text of the comment or message.",
    priv_bot_i2: "The sender's platform-scoped ID, and the visible username where Meta includes it.",
    priv_bot_i3: "The message ID, which channel it arrived on, and when.",
    priv_bot_none: "No names, email addresses, phone numbers, location data, or anything beyond what the webhook event itself already carries is collected.",

    priv_h_use: "How it is used",
    priv_use1: "The incoming text is first matched, in server memory, against a list of keywords. The questions that keep coming back — what it's built with, where the source is, where to start learning — are answered straight from that list.",
    priv_use2: "If no rule matches, the message text, the sender's username and which channel it is are sent to Anthropic's Claude API to draft a reply; the model stays silent when it isn't sure. The result is a public reply under the comment, an Instagram message, hiding the comment, or a WhatsApp reply. No profiling, no advertising, no other analysis.",

    priv_h_keep: "How long it is kept",
    priv_keep1: "There is no database. The only thing the server holds on to is an in-memory list of at most 5,000 message IDs, so the same message is never answered twice. That list is erased whenever the server restarts.",
    priv_keep2: "The message text and the sender's name do appear in the server's runtime log. The hosting provider keeps those logs for a limited time and then rotates them away. Beyond that, content is not written anywhere.",

    priv_h_share: "Sharing",
    priv_share: "Data goes to two places only: Meta's Graph API, to deliver the reply, and Anthropic's Claude API, to draft one when no rule matches. It is not shared with any other third party, and never sold or rented.",

    priv_h_children: "Children",
    priv_children: "Neither the site nor the bot is directed at children, and neither is knowingly used to process data from them.",

    priv_h_rights: "Your rights",
    priv_rights: "Because I live in Germany, the GDPR applies: you can ask what data about you is processed, ask for it to be deleted, or object to the processing. Since nothing is stored beyond the short-lived records described above, there is usually nothing to delete. If you would rather not receive automated replies, just write to me.",

    priv_h_changes: "Changes",
    priv_changes: "If what is collected or how it is used changes, this page is updated and the date above changes with it. The page's history is open in the repository's commit log.",

    priv_h_contact: "Contact",
    priv_contact: "Any question about this policy or about a specific interaction:",

    contact_title: "Write to me",
    contact_text: "If you want to ask something about the web, Firebase or bots, email is the fastest way. I usually reply within a day or two.",
    contact_email: "Send an email"
  },

  /* ------------------------------------------------------------------ de */
  de: {
    skip: "Zum Inhalt springen",
    nav_home: "Startseite",
    nav_journey: "Mein Weg",
    nav_projects: "Projekte",
    nav_notes: "Notizen",
    nav_about: "Über mich",
    aria_theme: "Design wechseln",
    aria_lang: "Sprache wechseln",

    title_home: "Farhad Yaqoobi — Offenes Heft",
    title_journey: "Mein Weg — Offenes Heft",
    title_projects: "Projekte — Offenes Heft",
    title_notes: "Notizen — Offenes Heft",
    title_about: "Über mich — Offenes Heft",
    title_privacy: "Datenschutz — Offenes Heft",

    footer_tagline: "Das offene Heft eines IT-Studenten.",
    footer_built: "Kein Framework, kein Build-Schritt. Quellcode offen.",
    footer_source: "Quellcode dieser Seite",
    footer_email: "E-Mail",

    home_eyebrow: "NRW, Deutschland",
    home_h1: "Ich schreibe auf, was ich lerne, bevor ich es vergesse.",
    home_lead: "Ich studiere IT in Deutschland. Dieses Heft habe ich im August 2026 angefangen — alles, was ich seitdem gebaut habe, und jede Stelle, an der ich hängen blieb, steht hier.",
    home_cta_projects: "Projekte ansehen",
    home_cta_notes: "Notizen lesen",
    now_label: "Gerade jetzt",
    now_text: "Die WhatsApp-Seite von reply-bot läuft seit Kurzem. Als Nächstes will ich das Backend mit Node.js richtig lernen: Datenbanken, Authentifizierung, Tests.",
    home_work_title: "Was ich gebaut habe",
    home_notes_title: "Neueste Notizen",

    /* Startseiten-Karte */
    hero_quote: "Lernen, bauen, aufschreiben. In dieser Reihenfolge.",
    stat_projects: "Projekte",
    stat_notes: "Notizen",
    stat_langs: "Sprachen",
    stat_since: "Seit",
    stat_since_v: "Aug. 2026",

    aria_scroll: "Nach unten scrollen",
    band1_t: "Vier Sprachen", band1_s: "Türkisch, Deutsch, Englisch, Persisch",
    band2_t: "Offline lesbar", band2_s: "Ein Service Worker legt die Seiten ab",
    band3_t: "Quelloffen", band3_s: "MIT-Lizenz, auf GitHub",
    band4_t: "Kein Framework", band4_s: "Schlichtes HTML, CSS und JavaScript",
    home_notes_all: "Alle Notizen",
    home_projects_all: "Alle Projekte",

    projects_lead: "Jedes davon hat als Lernprojekt angefangen. Alle laufen, und der Quellcode ist offen.",
    proj_learned: "Was ich gelernt habe",
    link_source: "Quellcode",
    link_live: "Live",
    detail_open: "Details",

    p1_when: "19.–28. Aug. 2026",
    p1_tag: "Ein Laden-Dashboard, das auch offline weiterläuft",
    p1_desc: "Ein Verkaufs- und Bestands-Dashboard, das sich zwei Personen über ihre Google-Konten teilen. Die Einträge werden über Firestore synchronisiert, die App läuft weiter, wenn das Netz weg ist, und lässt sich aufs Handy installieren. Afghani wird unterstützt, die Rechnung ist druckbar.",
    p1_learn: "Firestore-Sicherheitsregeln, App Check, Cache-Strategien im Service Worker — und dass eine Zugriffsliste nichts im Client zu suchen hat.",

    p2_when: "29. Aug. 2026",
    p2_tag: "Beantwortet Instagram-Kommentare und WhatsApp-Nachrichten von allein",
    p2_desc: "Metas Webhook kommt signiert an. Eine Regeldatei beantwortet die Fragen, die immer wiederkommen — womit es gebaut ist, wo der Quellcode liegt, wo man mit dem Lernen anfängt — der Rest geht an Claude, das schweigt, wenn es sich nicht sicher ist. Vier Sprachen, weil die Nachrichten in vier Sprachen ankommen. Eine Regel-Engine, zwei Räume: ein Kommentar lässt sich verbergen, eine WhatsApp-Antwort hat 24 Stunden Zeit.",
    p2_learn: "HMAC-Webhook-Signaturen, die Meta Graph API, und einem Webhook zu antworten, bevor man die Arbeit macht.",

    p3_when: "23.–29. Aug. 2026",
    p3_tag: "Telegram-Abläufe baut man, indem man sie einem Modell erklärt statt im Dashboard zu klicken",
    p3_desc: "Bot verbinden, den Ablauf in einfachen Schritten beschreiben — den Rest führt der Server: Er stellt Fragen, merkt sich Antworten, verzweigt bei Button-Klicks, versieht Leute mit Tags und schickt Rundnachrichten an die Gruppen, die daraus entstehen. Er spricht MCP, also steuert ein Modell das Ganze; Telegram wird per Long Polling erreicht, eine öffentliche URL braucht es nicht.",
    p3_learn: "Das Model Context Protocol, fortsetzbare Hintergrundjobs, und ein Schema im laufenden Betrieb zu migrieren.",

    p4_when: "Seit 18. Aug. 2026",
    p4_tag: "Diese Seite",
    p4_desc: "Kein Framework, kein Build-Schritt — schlichtes HTML, CSS und JavaScript. Vier Sprachen in einer Oberfläche, und beim Wechsel auf Persisch dreht sich das ganze Layout. Einmal geöffnet, lässt sie sich auch ohne Netz lesen.",
    p4_learn: "RTL über logische CSS-Eigenschaften, Einstellungen anzuwenden bevor die Seite gezeichnet wird, und wiederholtes HTML mit einem Prüfskript in Deckung zu halten.",

    p5_when: "Seit 23. Aug. 2026",
    p5_name: "Profilkarten",
    p5_tag: "Die Grafiken auf meinem GitHub-Profil",
    p5_desc: "Der Kopf, das Terminal, das Sprachdiagramm und der Beitragskalender auf meinem Profil kommen von keinem fremden Dienst. Ein Node-Skript fragt die GitHub-API ab, zeichnet die SVGs und schreibt sie ins Repository; ein Workflow erneuert sie alle sechs Stunden.",
    p5_learn: "Mit der GitHub-API arbeiten, SVG von Hand schreiben, geplante Workflows.",

    notes_lead: "Ich schreibe hier, wenn ich etwas herausgefunden habe oder wenn ich feststecke. Das meiste ist kurz — es geht darum, mich in einem halben Jahr daran zu erinnern.",
    filter_all: "Alle",
    filter_bot: "Bots",
    filter_web: "Web",
    filter_data: "Daten & Sicherheit",
    notes_count_one: "Notiz",
    notes_count_many: "Notizen",
    notes_empty: "Zu diesem Filter gibt es keine Notizen.",

    n1_date: "29. Aug. 2026",
    n1_title: "Erst dem Webhook antworten, dann die Arbeit machen",
    n1_sum: "Metas Webhook wartet auf eine Antwort. Wer erst Claude fragt und wartet, bekommt dasselbe Ereignis immer wieder.",
    n1_p1: "In der ersten Fassung habe ich die Antwort erzeugt und danach 200 zurückgegeben. Meta lief in den Timeout, schickte denselben Kommentar erneut, und der Bot antwortete zweimal darauf.",
    n1_p2: "Richtig ist: Signatur prüfen, sofort 200 zurückgeben, danach arbeiten. Eine eigene Queue war nicht nötig — es reichte, den Job nicht abzuwarten.",

    n2_date: "28. Aug. 2026",
    n2_title: "Eine Zugriffsliste gehört nicht in den Client",
    n2_sum: "Wer sich anmelden darf, stand in einem Array im Browser. Wer den Quellcode öffnet, liest die Liste mit.",
    n2_p1: "Ich habe die Liste in die Firestore-Regeln verschoben. Jetzt entscheidet der Server, der Client sieht nur noch das Ergebnis.",
    n2_p2: "Beim Schreiben der Regeln habe ich gemerkt: Man schreibt sie nicht nach dem Datenmodell. Erst beantwortet man 'wer darf was lesen', dann baut man das Modell danach.",

    n3_date: "29. Aug. 2026",
    n3_title: "Die HMAC-Signatur gegen den Rohkörper prüfen",
    n3_sum: "Wer das geparste JSON wieder zu Text macht und das signiert, bekommt nie eine passende Signatur.",
    n3_p1: "Die json()-Middleware von Express parst den Body. Der Text, den JSON.stringify zurückgibt, sind nicht dieselben Bytes, die Meta signiert hat — Leerzeichen und Schlüsselreihenfolge können abweichen.",
    n3_p2: "Die Lösung: den Rohkörper beim Parsen zusätzlich aufheben und mit timingSafeEqual vergleichen; ein normaler Vergleich kann die Signatur zeichenweise verraten.",

    n4_date: "25. Aug. 2026",
    n4_title: "Ein MCP-Server kann Client eines anderen sein",
    n4_sum: "Ich habe botflow-mcp die Werkzeuge eines fremden Servers übernehmen lassen.",
    n4_p1: "In MCP sind Server und Client getrennte Rollen — aber ein Prozess kann beide gleichzeitig ausfüllen.",
    n4_p2: "So stehen fremde Werkzeuge neben meinen eigenen. Von der Seite des Modells sieht das nach einem einzigen Server aus.",

    n5_date: "23. Aug. 2026",
    n5_title: "Lange Arbeit in den Hintergrund, Rate Limit respektieren",
    n5_sum: "Eine Rundnachricht in einem einzigen Request verschicken zu wollen heißt Timeout und 429 zugleich.",
    n5_p1: "Ich habe das Versenden in einen fortsetzbaren Hintergrundjob umgebaut. Wie weit er gekommen ist, steht in der Datenbank — ein Neustart fängt nicht von vorn an.",
    n5_p2: "Zwischen die Nachrichten habe ich eine Wartezeit gelegt, um unter Telegrams Sekundenlimit zu bleiben. Langsam, aber es läuft durch.",

    n6_date: "21. Aug. 2026",
    n6_title: "App Check: der sichtbare Schlüssel ist nicht das Problem",
    n6_sum: "Die Firebase-Konfiguration liegt offen im Client — und das ist in Ordnung.",
    n6_p1: "Ein Web-API-Schlüssel ist kein Passwort, sondern eine Adresse für das Projekt. Der eigentliche Schutz kommt aus den Sicherheitsregeln.",
    n6_p2: "App Check stellt darüber hinaus eine weitere Frage: Kommt dieser Aufruf wirklich von meiner Seite? Es ersetzt die Regeln nicht, es arbeitet mit ihnen zusammen.",

    n7_date: "20. Aug. 2026",
    n7_title: "Vorher entscheiden, was der Service Worker cacht",
    n7_sum: "Wer alles aus dem Cache ausliefert, bei dem kommt kein Update mehr an.",
    n7_p1: "Für HTML zuerst das Netz zu versuchen und CSS, JS und Schriften aus dem Cache zu geben, war die Balance: der Inhalt bleibt frisch, die Seite öffnet trotzdem sofort.",
    n7_p2: "Der Cache braucht einen Versionsnamen, und der alte muss beim activate gelöscht werden. Sonst sammeln sich zwei Versionen im Browser.",

    n8_date: "19. Aug. 2026",
    n8_title: "Mit der Sprache ändert sich auch die Richtung",
    n8_sum: "Beim Wechsel auf Persisch fiel das Layout auseinander. Der Grund war, dass ich überall left und right geschrieben hatte.",
    n8_p1: "margin-inline-start statt margin-left und inset-inline-start statt left — danach lief RTL von allein, ohne Einzelfallkorrekturen.",
    n8_p2: "Von Hand drehen musste ich nur die Richtungssymbole; dafür reichte eine einzige Klasse mit scaleX(-1).",

    n9_date: "18. Aug. 2026",
    n9_title: "Erste Veröffentlichung",
    n9_sum: "Das erste Mal, dass ich etwas auf GitHub Pages gestellt habe.",
    n9_p1: "Sobald das Repository mit Pages verbunden war, hieß Dateien pushen auch veröffentlichen — einen eigenen Deploy-Schritt gibt es nicht.",
    n9_p2: "Eine Projektseite liegt nicht auf der Wurzel, sondern unter dem Repository-Namen. Deshalb müssen Links relativ sein; absolute Pfade ab der Wurzel brechen hier.",

    journey_lead: "Die Daten hier sind nicht ausgedacht — sie stammen aus der Commit-Historie meiner Repositories.",

    j1_date: "17. August 2026",
    j1_title: "Das Heft aufgeschlagen",
    j1_text: "Ich habe das Repository acik-defter angelegt. An dem Tag lagen darin eine index.html und ein Stylesheet, mehr nicht.",

    j2_date: "18. August 2026",
    j2_title: "Erste Veröffentlichung",
    j2_text: "Die Seite ging auf GitHub Pages online. Zum ersten Mal hatte etwas, das ich geschrieben hatte, eine Adresse.",

    j3_date: "19.–20. August 2026",
    j3_title: "Das NetStore-Dashboard",
    j3_text: "Ich fing an, ein Laden-Dashboard zu schreiben: Übersicht, drei Sprachen, druckbare Rechnung. Danach kamen Google-Anmeldung und Firestore dazu, damit zwei Personen es teilen können — und zum Schluss ließ es sich aufs Handy installieren.",

    j4_date: "21. August 2026",
    j4_title: "Sicherheit ernst genommen",
    j4_text: "Ich habe die Zugriffsliste vom Client auf den Server verschoben und App Check eingeschaltet. Hier ist mir klar geworden, dass etwas zum Laufen zu bringen und es sicher zu machen zwei verschiedene Aufgaben sind.",

    j5_date: "23. August 2026",
    j5_title: "Begegnung mit MCP",
    j5_text: "Ich habe angefangen, botflow-mcp zu schreiben. Es war mein erstes Mal mit dem Model Context Protocol — einen Server zu schreiben und dann zuzusehen, wie ein Modell ihn steuert, war ein seltsames Gefühl.",

    j6_date: "28. August 2026",
    j6_title: "NetStore in ein eigenes Zuhause umgezogen",
    j6_text: "NetStore war innerhalb dieses Repositories groß geworden. Mit git subtree split habe ich es samt Historie herausgelöst und ihm ein eigenes Repository gegeben — damit wurde dieses Heft wieder nur ein Heft.",

    j7_date: "29. August 2026",
    j7_title: "reply-bot",
    j7_text: "Ich habe den Bot geschrieben, der Instagram-Kommentare beantwortet, und danach WhatsApp an dieselbe Regel-Engine gehängt. Webhook-Signaturen und die Meta Graph API waren das Thema des Tages.",

    j8_date: "Als Nächstes",
    j8_title: "Backend-Grundlagen",
    j8_text: "Ich will die Node.js-Seite richtig lernen: Datenbanken, Authentifizierung, Tests. Und ich werde mir React ansehen.",

    about_lead: "Kurz gesagt: ein IT-Student in Deutschland, der meistens nachts programmiert.",
    about_p1: "Ich heiße Farhad Yaqoobi. Ich lebe in Nordrhein-Westfalen und studiere IT. In der Softwareentwicklung bin ich neu — genau deshalb gibt es dieses Heft: Ich wollte, dass die Notizen, die ich beim Lernen mache, irgendwo liegen.",
    about_p2: "Hier steht nicht nur Fertiges. Auch die Stellen, an denen ich hängen blieb, die Dinge, die ich falsch gebaut und später wieder herausgerissen habe. Soweit ich das sehe, ist genau das der sichtbare Teil vom Lernen.",
    about_p3: "Im Frontend bin ich inzwischen zu Hause, das Backend lerne ich gerade. Langfristig will ich Full-Stack arbeiten, aber ich habe es nicht eilig — mir ist lieber, das Fundament stimmt.",
    about_facts_title: "Kurz und knapp",
    about_k_location: "Ort",
    about_v_location: "Nordrhein-Westfalen, Deutschland",
    about_k_langs: "Sprachen",
    about_v_langs: "Türkisch, Deutsch, Englisch, Persisch",
    about_k_now: "Gerade",
    about_v_now: "Frontend, etwas Node.js",
    about_k_next: "Als Nächstes",
    about_v_next: "Backend-Grundlagen, React",
    about_k_tools: "Werkzeuge",
    about_v_tools: "JavaScript, TypeScript, Firebase, Git",

    /* Datenschutz */
    footer_privacy: "Datenschutz",
    priv_title: "Datenschutz",
    priv_lead: "Welche Daten diese Seite und der Instagram/WhatsApp-Antwortbot verarbeiten, und warum.",
    priv_updated: "Zuletzt aktualisiert: 29. August 2026",

    priv_h_who: "Wer",
    priv_who: "Diese Seite und der unten beschriebene Antwortbot werden privat von Farhad Yaqoobi betrieben (Nordrhein-Westfalen, Deutschland). Kein Unternehmen. Die Kontaktadresse steht ganz unten.",

    priv_h_site: "Auf dieser Seite",
    priv_site1: "Die Seite besteht aus nichts als statischen Dateien auf GitHub Pages. Keine Analyse, keine Tracking-Pixel, keine Werbe-Cookies, keine Konten, keine Formulare.",
    priv_site2: "Im lokalen Speicher des Browsers liegen genau zwei Dinge: das gewählte Design und die gewählte Sprache. Beides verlässt dein Gerät nicht und erreicht mich nicht. Auch der Service Worker, der die Seiten offline lesbar macht, legt alles in deinem eigenen Browser ab.",
    priv_site3: "Beim Laden einer Seite werden die Schriften von Google Fonts (fonts.googleapis.com und fonts.gstatic.com) geholt; dabei sieht Google deine IP-Adresse und Browserangaben. GitHub, das die Seite ausliefert, führt ebenfalls eigene Zugriffsaufzeichnungen. Für beide gelten deren eigene Datenschutzerklärungen.",

    priv_h_bot: "Der Antwortbot",
    priv_bot_scope: "reply-bot läuft ausschließlich für Kommentare auf meinem eigenen Instagram-Konto (@farhad___yaqoobi) und Nachrichten an die verbundene WhatsApp-Nummer. Dieser Abschnitt betrifft nur diesen Bot.",
    priv_bot_collect: "Über Metas Webhook kommen an:",
    priv_bot_i1: "Der Text des Kommentars oder der Nachricht.",
    priv_bot_i2: "Die plattformbezogene Kennung der absendenden Person und, wo Meta sie mitliefert, der sichtbare Benutzername.",
    priv_bot_i3: "Die Kennung der Nachricht, über welchen Kanal sie kam und wann.",
    priv_bot_none: "Es werden keine Namen, E-Mail-Adressen, Telefonnummern, Standortdaten oder sonstigen Angaben erhoben, die nicht ohnehin im Webhook-Ereignis selbst enthalten sind.",

    priv_h_use: "Wie sie verwendet werden",
    priv_use1: "Der eingehende Text wird zuerst im Arbeitsspeicher des Servers mit einer Liste von Stichwörtern abgeglichen. Die Fragen, die immer wiederkommen — womit es gebaut ist, wo der Quellcode liegt, wo man mit dem Lernen anfängt — werden direkt aus dieser Liste beantwortet.",
    priv_use2: "Passt keine Regel, gehen der Nachrichtentext, der Benutzername der absendenden Person und der Kanal an die Claude-API von Anthropic, um eine Antwort zu entwerfen; ist sich das Modell nicht sicher, schweigt es. Das Ergebnis ist eine öffentliche Antwort unter dem Kommentar, eine Instagram-Nachricht, das Verbergen des Kommentars oder eine WhatsApp-Antwort. Kein Profiling, keine Werbung, keine weitere Auswertung.",

    priv_h_keep: "Wie lange sie bleiben",
    priv_keep1: "Es gibt keine Datenbank. Das Einzige, was der Server behält, ist eine Liste von höchstens 5.000 Nachrichtenkennungen im Arbeitsspeicher, damit dieselbe Nachricht nie zweimal beantwortet wird. Diese Liste wird bei jedem Neustart des Servers gelöscht.",
    priv_keep2: "Der Nachrichtentext und der Name der absendenden Person erscheinen im Laufzeitprotokoll des Servers. Der Hosting-Anbieter hält diese Protokolle eine begrenzte Zeit vor und rotiert sie dann weg. Darüber hinaus werden Inhalte nirgendwo gespeichert.",

    priv_h_share: "Weitergabe",
    priv_share: "Daten gehen an genau zwei Stellen: an Metas Graph-API, um die Antwort zuzustellen, und an die Claude-API von Anthropic, um eine zu entwerfen, wenn keine Regel greift. An keine weiteren Dritten, und niemals verkauft oder vermietet.",

    priv_h_children: "Kinder",
    priv_children: "Weder die Seite noch der Bot richten sich an Kinder, und beide werden nicht wissentlich dazu verwendet, Daten von Kindern zu verarbeiten.",

    priv_h_rights: "Deine Rechte",
    priv_rights: "Da ich in Deutschland lebe, gilt die DSGVO: Du kannst Auskunft über die zu dir verarbeiteten Daten verlangen, ihre Löschung fordern oder der Verarbeitung widersprechen. Da außer den oben beschriebenen kurzlebigen Aufzeichnungen nichts gespeichert wird, gibt es meistens nichts zu löschen. Wenn du keine automatischen Antworten möchtest, schreib mir einfach.",

    priv_h_changes: "Änderungen",
    priv_changes: "Ändert sich, was erhoben wird oder wie es verwendet wird, wird diese Seite aktualisiert und das Datum oben ändert sich mit. Die Historie der Seite liegt offen im Commit-Verlauf des Repositories.",

    priv_h_contact: "Kontakt",
    priv_contact: "Jede Frage zu dieser Erklärung oder zu einer bestimmten Interaktion:",

    contact_title: "Schreib mir",
    contact_text: "Wenn du etwas zu Web, Firebase oder Bots fragen möchtest, geht es per E-Mail am schnellsten. Meistens antworte ich innerhalb von ein bis zwei Tagen.",
    contact_email: "E-Mail schreiben"
  },

  /* ------------------------------------------------------------------ fa */
  fa: {
    skip: "رفتن به محتوا",
    nav_home: "خانه",
    nav_journey: "مسیر من",
    nav_projects: "پروژه‌ها",
    nav_notes: "یادداشت‌ها",
    nav_about: "درباره من",
    aria_theme: "تغییر پوسته",
    aria_lang: "تغییر زبان",

    title_home: "فرهاد یعقوبی — دفتر باز",
    title_journey: "مسیر من — دفتر باز",
    title_projects: "پروژه‌ها — دفتر باز",
    title_notes: "یادداشت‌ها — دفتر باز",
    title_about: "درباره من — دفتر باز",
    title_privacy: "حریم خصوصی — دفتر باز",

    footer_tagline: "دفتر بازِ یک دانشجوی آی‌تی.",
    footer_built: "بدون فریم‌ورک، بدون مرحله‌ی بیلد. کدش باز است.",
    footer_source: "کد این سایت",
    footer_email: "ایمیل",

    home_eyebrow: "ایالت نوردراین-وستفالن، آلمان",
    home_h1: "چیزی را که یاد می‌گیرم، پیش از فراموش‌شدن اینجا می‌نویسم.",
    home_lead: "در آلمان آی‌تی می‌خوانم. این دفتر را مرداد ۱۴۰۵ (اوت ۲۰۲۶) باز کردم — از آن روز هرچه ساخته‌ام و هر جا گیر کرده‌ام، همه اینجاست.",
    home_cta_projects: "دیدن پروژه‌ها",
    home_cta_notes: "خواندن یادداشت‌ها",
    now_label: "این روزها",
    now_text: "بخش واتس‌اپِ reply-bot را راه انداختم. قدم بعدی یادگیری درست‌وحسابی بک‌اند با Node.js است: پایگاه داده، احراز هویت، تست.",
    home_work_title: "چیزهایی که ساخته‌ام",
    home_notes_title: "آخرین یادداشت‌ها",

    /* کارت صفحه‌ی خانه */
    hero_quote: "یاد بگیر، بساز، بنویس. به همین ترتیب.",
    stat_projects: "پروژه",
    stat_notes: "یادداشت",
    stat_langs: "زبان",
    stat_since: "آغاز",
    stat_since_v: "اوت ۲۰۲۶",

    aria_scroll: "به پایین برو",
    band1_t: "چهار زبان", band1_s: "ترکی، آلمانی، انگلیسی، فارسی",
    band2_t: "آفلاین خوانده می‌شود", band2_s: "سرویس‌ورکر صفحه‌ها را نگه می‌دارد",
    band3_t: "کدِ باز", band3_s: "با مجوز MIT، روی گیت‌هاب",
    band4_t: "بدون فریم‌ورک", band4_s: "HTML و CSS و JavaScript ساده",
    home_notes_all: "همه‌ی یادداشت‌ها",
    home_projects_all: "همه‌ی پروژه‌ها",

    projects_lead: "همه‌شان برای یادگیری شروع شدند، همه‌شان کار می‌کنند و کدشان باز است.",
    proj_learned: "چه یاد گرفتم",
    link_source: "کد",
    link_live: "زنده",
    detail_open: "جزئیات",

    p1_when: "۱۹ تا ۲۸ اوت ۲۰۲۶",
    p1_tag: "پنل فروشگاهی که آفلاین هم کار می‌کند",
    p1_desc: "پنل فروش و موجودی که دو نفر با حساب گوگل خودشان در آن شریک‌اند. داده‌ها روی Firestore همگام می‌شوند، وقتی شبکه قطع شود برنامه به کارش ادامه می‌دهد و روی گوشی نصب می‌شود. از افغانی پشتیبانی می‌کند و فاکتور قابل چاپ دارد.",
    p1_learn: "قواعد امنیتی Firestore، App Check، راهبردهای کش در سرویس‌ورکر — و اینکه فهرست دسترسی جایش در سمت کاربر نیست.",

    p2_when: "۲۹ اوت ۲۰۲۶",
    p2_tag: "خودش به کامنت‌های اینستاگرام و پیام‌های واتس‌اپ جواب می‌دهد",
    p2_desc: "وب‌هوک متا امضاشده می‌رسد. یک فایل قواعد به پرسش‌های تکراری جواب می‌دهد — با چه ساخته شده، کدش کجاست، از کجا شروع کنم — و باقی به Claude می‌رود که وقتی مطمئن نیست ساکت می‌ماند. چهار زبان، چون پیام‌ها به چهار زبان می‌آیند. یک موتور قواعد و دو اتاق: یک کامنت را می‌شود پنهان کرد، جواب واتس‌اپ ۲۴ ساعت فرصت دارد.",
    p2_learn: "امضای HMAC وب‌هوک، Meta Graph API، و اینکه پیش از انجام کار به وب‌هوک جواب بدهی.",

    p3_when: "۲۳ تا ۲۹ اوت ۲۰۲۶",
    p3_tag: "جریان‌های تلگرام را به جای کلیک در پنل، با توضیح دادن به مدل می‌سازی",
    p3_desc: "ربات را وصل کن، جریان را با گام‌های ساده توضیح بده؛ سرور گفت‌وگو را پیش می‌برد — سؤال می‌پرسد، جواب‌ها را نگه می‌دارد، با فشردن دکمه شاخه می‌زند، به آدم‌ها برچسب می‌دهد و به گروه‌هایی که از آن برچسب‌ها ساخته می‌شوند پیام همگانی می‌فرستد. چون MCP حرف می‌زند، مدل کل کار را می‌راند؛ و چون با long polling به تلگرام وصل می‌شود، به آدرس عمومی نیازی نیست.",
    p3_learn: "پروتکل Model Context، کارهای پس‌زمینه‌ای که از سر گرفته می‌شوند، و مهاجرت اسکیمای در حال کار.",

    p4_when: "از ۱۸ اوت ۲۰۲۶",
    p4_tag: "همین سایت",
    p4_desc: "بدون فریم‌ورک، بدون مرحله‌ی بیلد — HTML و CSS و JavaScript ساده. چهار زبان در یک رابط، و با رفتن به فارسی کل چیدمان راست‌چین می‌شود. یک بار که بازش کنی، بی‌شبکه هم خوانده می‌شود.",
    p4_learn: "راست‌چینی با ویژگی‌های منطقی CSS، اعمال تنظیمات پیش از رسم صفحه، و هم‌راستا نگه داشتن HTML تکراری با یک اسکریپت بازرسی.",

    p5_when: "از ۲۳ اوت ۲۰۲۶",
    p5_name: "کارت‌های نمایه",
    p5_tag: "گرافیک‌های نمایه‌ی گیت‌هاب من",
    p5_desc: "سربرگ، ترمینال، نمودار زبان‌ها و تقویم مشارکت در نمایه‌ام از هیچ سرویس بیرونی نمی‌آیند. یک اسکریپت Node از GitHub API می‌پرسد، SVGها را می‌کشد و در مخزن می‌نویسد؛ یک workflow هر شش ساعت تازه‌شان می‌کند.",
    p5_learn: "کار با GitHub API، نوشتن دستی SVG، و workflowهای زمان‌بندی‌شده.",

    notes_lead: "وقتی چیزی را حل می‌کنم یا جایی گیر می‌کنم، اینجا می‌نویسم. بیشترشان کوتاه‌اند؛ هدف این است که شش ماه بعد به خودم یادآوری کنم.",
    filter_all: "همه",
    filter_bot: "ربات‌ها",
    filter_web: "وب",
    filter_data: "داده و امنیت",
    notes_count_one: "یادداشت",
    notes_count_many: "یادداشت",
    notes_empty: "با این فیلتر یادداشتی نیست.",

    n1_date: "۲۹ اوت ۲۰۲۶",
    n1_title: "اول به وب‌هوک جواب بده، بعد کار را انجام بده",
    n1_sum: "وب‌هوک متا منتظر جواب است. اگر از Claude بپرسی و منتظر بمانی، همان رویداد بارها می‌رسد.",
    n1_p1: "در نسخه‌ی اول اول جواب را می‌ساختم و بعد ۲۰۰ برمی‌گرداندم. متا به مهلت زمانی می‌خورد، همان کامنت را دوباره می‌فرستاد و ربات دو بار جواب می‌داد.",
    n1_p2: "درستش این است: امضا را بررسی کن، بی‌درنگ ۲۰۰ برگردان، بعد کار را انجام بده. صف جداگانه لازم نشد — همین که منتظر پایان کار نمانم کافی بود.",

    n2_date: "۲۸ اوت ۲۰۲۶",
    n2_title: "فهرست دسترسی جایش در سمت کاربر نیست",
    n2_sum: "اینکه چه کسی اجازه‌ی ورود دارد در آرایه‌ای در مرورگر بود. هر کسی کد را باز کند فهرست را می‌بیند.",
    n2_p1: "فهرست را به داخل قواعد Firestore بردم. حالا سرور تصمیم می‌گیرد و کاربر فقط نتیجه را می‌بیند.",
    n2_p2: "موقع نوشتن قواعد فهمیدم که قاعده را بعد از مدل داده نمی‌نویسند. اول باید جواب داد «چه کسی چه چیزی را می‌خواند» و بعد مدل را بر همان اساس ساخت.",

    n3_date: "۲۹ اوت ۲۰۲۶",
    n3_title: "امضای HMAC را روی بدنه‌ی خام بررسی کن",
    n3_sum: "اگر JSONِ تجزیه‌شده را دوباره به متن تبدیل کنی و آن را امضا کنی، امضا هرگز جور درنمی‌آید.",
    n3_p1: "میان‌افزار json() اکسپرس بدنه را تجزیه می‌کند. متنی که JSON.stringify برمی‌گرداند همان بایت‌هایی نیست که متا امضا کرده — فاصله‌ها و ترتیب کلیدها می‌تواند فرق کند.",
    n3_p2: "راه‌حل این است که بدنه‌ی خام را هنگام تجزیه جداگانه نگه داری و مقایسه را با timingSafeEqual انجام دهی؛ مقایسه‌ی معمولی می‌تواند امضا را نویسه‌به‌نویسه لو بدهد.",

    n4_date: "۲۵ اوت ۲۰۲۶",
    n4_title: "یک سرور MCP می‌تواند کلاینت سرور دیگری باشد",
    n4_sum: "کاری کردم botflow-mcp ابزارهای یک سرور بیرونی را تحویل بگیرد.",
    n4_p1: "در MCP سرور و کلاینت دو نقش جدا هستند — اما یک فرایند می‌تواند هر دو را با هم داشته باشد.",
    n4_p2: "حالا ابزارهای بیرونی کنار ابزارهای خودم می‌نشینند. از سمت مدل، همه‌اش یک سرور به نظر می‌رسد.",

    n5_date: "۲۳ اوت ۲۰۲۶",
    n5_title: "کار طولانی را به پس‌زمینه ببر و به محدودیت نرخ احترام بگذار",
    n5_sum: "فرستادن یک پیام همگانی در یک درخواست، هم مهلت زمانی می‌آورد هم خطای ۴۲۹.",
    n5_p1: "فرستادن را به کاری در پس‌زمینه تبدیل کردم که از سر گرفته می‌شود؛ اینکه تا کجا رفته در پایگاه داده است، پس راه‌اندازی دوباره از اول شروع نمی‌کند.",
    n5_p2: "بین پیام‌ها مکث گذاشتم تا زیر محدودیت ثانیه‌ای تلگرام بمانم. کند است، اما تمام می‌شود.",

    n6_date: "۲۱ اوت ۲۰۲۶",
    n6_title: "App Check: دیده‌شدن کلید مشکل نیست",
    n6_sum: "پیکربندی Firebase آشکارا در سمت کاربر است — و این طبیعی است.",
    n6_p1: "کلید API وب رمز عبور نیست، نشانی پروژه است. محافظت اصلی از قواعد امنیتی می‌آید.",
    n6_p2: "App Check روی آن یک پرسش دیگر می‌گذارد: آیا این فراخوانی واقعاً از سایت خودم می‌آید؟ جای قواعد را نمی‌گیرد، کنارشان کار می‌کند.",

    n7_date: "۲۰ اوت ۲۰۲۶",
    n7_title: "از پیش تصمیم بگیر سرویس‌ورکر چه چیزی را کش کند",
    n7_sum: "اگر همه چیز را از کش بدهی، هیچ به‌روزرسانی‌ای به دست کسی نمی‌رسد.",
    n7_p1: "برای HTML اول شبکه را امتحان کردن و CSS و JS و فونت را از کش دادن، تعادل را برقرار کرد: محتوا تازه می‌ماند و صفحه باز هم بی‌درنگ باز می‌شود.",
    n7_p2: "کش به یک نام نسخه نیاز دارد و نسخه‌ی قبلی باید هنگام activate پاک شود. وگرنه دو نسخه در مرورگر کاربر روی هم جمع می‌شوند.",

    n8_date: "۱۹ اوت ۲۰۲۶",
    n8_title: "با تغییر زبان، جهت هم عوض می‌شود",
    n8_sum: "با رفتن به فارسی چیدمان به هم می‌ریخت. علتش این بود که همه جا left و right نوشته بودم.",
    n8_p1: "به جای margin-left نوشتن margin-inline-start و به جای left نوشتن inset-inline-start باعث شد راست‌چینی خودبه‌خود کار کند — بدون اصلاح مورد به مورد.",
    n8_p2: "تنها چیزی که باید دستی برمی‌گشت آیکون‌های جهت‌دار بودند؛ یک کلاس با scaleX(-1) برایشان کافی بود.",

    n9_date: "۱۸ اوت ۲۰۲۶",
    n9_title: "اولین انتشار",
    n9_sum: "اولین باری که چیزی روی GitHub Pages گذاشتم.",
    n9_p1: "وقتی مخزن به Pages وصل شد، فرستادن فایل‌ها یعنی منتشر کردن — مرحله‌ی جداگانه‌ای برای استقرار نیست.",
    n9_p2: "صفحه‌ی پروژه روی ریشه نیست، زیر نام مخزن است. برای همین پیوندها باید نسبی باشند؛ مسیرهای مطلق از ریشه اینجا می‌شکنند.",

    journey_lead: "تاریخ‌های اینجا ساختگی نیستند؛ از تاریخچه‌ی کامیت‌های مخزن‌هایم می‌آیند.",

    j1_date: "۱۷ اوت ۲۰۲۶",
    j1_title: "دفتر را باز کردم",
    j1_text: "مخزن acik-defter را ساختم. آن روز فقط یک index.html و یک فایل استایل داشت، همین.",

    j2_date: "۱۸ اوت ۲۰۲۶",
    j2_title: "اولین انتشار",
    j2_text: "سایت روی GitHub Pages منتشر شد. برای اولین بار چیزی که خودم نوشته بودم یک نشانی داشت.",

    j3_date: "۱۹ تا ۲۰ اوت ۲۰۲۶",
    j3_title: "پنل NetStore",
    j3_text: "نوشتن یک پنل مدیریت فروشگاه را شروع کردم: داشبورد، سه زبان، فاکتور قابل چاپ. بعد ورود با گوگل و Firestore را اضافه کردم تا دو نفر بتوانند شریک شوند؛ و آخرش قابل نصب روی گوشی شد.",

    j4_date: "۲۱ اوت ۲۰۲۶",
    j4_title: "امنیت را جدی گرفتم",
    j4_text: "فهرست دسترسی را از سمت کاربر به سرور بردم و App Check را روشن کردم. همین‌جا فهمیدم که کار کردن یک چیز و امن بودنش چیز دیگری است.",

    j5_date: "۲۳ اوت ۲۰۲۶",
    j5_title: "آشنایی با MCP",
    j5_text: "نوشتن botflow-mcp را شروع کردم. اولین باری بود که از Model Context Protocol استفاده می‌کردم — سروری بنویسی و بعد ببینی مدل آن را می‌راند، حس عجیبی داشت.",

    j6_date: "۲۸ اوت ۲۰۲۶",
    j6_title: "NetStore را به خانه‌ی خودش بردم",
    j6_text: "NetStore داخل همین مخزن بزرگ شده بود. با git subtree split آن را همراه تاریخچه‌اش جدا کردم و به مخزن خودش بردم؛ این دفتر دوباره فقط یک دفتر شد.",

    j7_date: "۲۹ اوت ۲۰۲۶",
    j7_title: "reply-bot",
    j7_text: "رباتی را نوشتم که به کامنت‌های اینستاگرام جواب می‌دهد و بعد واتس‌اپ را به همان موتور قواعد وصل کردم. امضای وب‌هوک و Meta Graph API موضوع آن روز بود.",

    j8_date: "در ادامه",
    j8_title: "مبانی بک‌اند",
    j8_text: "می‌خواهم سمت Node.js را درست یاد بگیرم: پایگاه داده، احراز هویت، تست. سری هم به React خواهم زد.",

    about_lead: "کوتاهش: دانشجوی آی‌تی در آلمان که بیشتر شب‌ها کد می‌زند.",
    about_p1: "اسم من فرهاد یعقوبی است. در نوردراین-وستفالنِ آلمان زندگی می‌کنم و آی‌تی می‌خوانم. در برنامه‌نویسی تازه‌کارم؛ همین دفتر هم دقیقاً به همین دلیل هست — می‌خواستم یادداشت‌هایی که موقع یادگیری برمی‌دارم جایی بمانند.",
    about_p2: "اینجا فقط کارهای تمام‌شده نیست. جاهایی که گیر کرده‌ام، چیزهایی که اشتباه ساخته‌ام و بعد بیرونشان کشیده‌ام هم هست. تا جایی که می‌فهمم، بخش دیدنیِ یادگیری همین است.",
    about_p3: "الان در فرانت‌اند راحتم و بک‌اند را یاد می‌گیرم. در درازمدت می‌خواهم full-stack کار کنم، اما عجله‌ای ندارم — ترجیح می‌دهم پایه را درست بگذارم.",
    about_facts_title: "در یک نگاه",
    about_k_location: "مکان",
    about_v_location: "نوردراین-وستفالن، آلمان",
    about_k_langs: "زبان‌ها",
    about_v_langs: "ترکی، آلمانی، انگلیسی، فارسی",
    about_k_now: "الان",
    about_v_now: "فرانت‌اند، کمی Node.js",
    about_k_next: "در ادامه",
    about_v_next: "مبانی بک‌اند، React",
    about_k_tools: "جعبه‌ابزار",
    about_v_tools: "JavaScript، TypeScript، Firebase، Git",

    /* حریم خصوصی */
    footer_privacy: "حریم خصوصی",
    priv_title: "حریم خصوصی",
    priv_lead: "این سایت و ربات پاسخ خودکار اینستاگرام/واتس‌اپ چه داده‌ای را و چرا پردازش می‌کنند.",
    priv_updated: "آخرین به‌روزرسانی: ۲۹ اوت ۲۰۲۶",

    priv_h_who: "چه کسی",
    priv_who: "این سایت و ربات پاسخ خودکاری که پایین‌تر توضیح داده شده را شخصاً فرهاد یعقوبی اداره می‌کند (نوردراین-وستفالن، آلمان). شرکت نیست. نشانی تماس در پایین صفحه است.",

    priv_h_site: "در این سایت",
    priv_site1: "سایت چیزی جز فایل‌های ثابت روی GitHub Pages نیست. نه ابزار تحلیل، نه پیکسل ردیابی، نه کوکی تبلیغاتی، نه حساب کاربری، نه فرم.",
    priv_site2: "در حافظه‌ی محلی مرورگر فقط دو چیز نگه داشته می‌شود: پوسته و زبانی که انتخاب کرده‌ای. هیچ‌کدام از دستگاه تو بیرون نمی‌رود و به من نمی‌رسد. سرویس‌ورکری هم که صفحه‌ها را آفلاین خواندنی می‌کند، همه چیز را در مرورگر خودت نگه می‌دارد.",
    priv_site3: "هنگام باز شدن صفحه، فونت‌ها از Google Fonts (نشانی‌های fonts.googleapis.com و fonts.gstatic.com) گرفته می‌شوند و گوگل در جریان همین درخواست نشانی IP و مشخصات مرورگر تو را می‌بیند. گیت‌هاب هم که سایت را سرو می‌کند، سوابق درخواست‌ها را نزد خود نگه می‌دارد. هر دو تابع سیاست حریم خصوصی خودشان هستند.",

    priv_h_bot: "ربات پاسخ خودکار",
    priv_bot_scope: "reply-bot فقط برای کامنت‌های حساب اینستاگرام خودم (@farhad___yaqoobi) و پیام‌های شماره‌ی واتس‌اپ متصل کار می‌کند. این بخش تنها درباره‌ی همان ربات است.",
    priv_bot_collect: "از طریق وب‌هوک متا این‌ها می‌رسد:",
    priv_bot_i1: "متن کامنت یا پیام.",
    priv_bot_i2: "شناسه‌ی مخصوصِ پلتفرمِ فرستنده و، جایی که متا آن را می‌فرستد، نام کاربری قابل مشاهده.",
    priv_bot_i3: "شناسه‌ی پیام، اینکه از کدام کانال آمده و زمان آن.",
    priv_bot_none: "هیچ نام، نشانی ایمیل، شماره تلفن، داده‌ی مکانی یا چیزی فراتر از آنچه خودِ رویداد وب‌هوک دارد جمع‌آوری نمی‌شود.",

    priv_h_use: "چطور استفاده می‌شود",
    priv_use1: "متن ورودی نخست در حافظه‌ی سرور با فهرستی از کلیدواژه‌ها مقایسه می‌شود. پرسش‌هایی که مدام تکرار می‌شوند — با چه ساخته شده، کد کجاست، از کجا شروع کنم — مستقیم از همان فهرست پاسخ می‌گیرند.",
    priv_use2: "اگر هیچ قاعده‌ای جور نشود، متن پیام، نام کاربری فرستنده و اینکه کدام کانال است به Claude API شرکت Anthropic فرستاده می‌شود تا پیش‌نویس پاسخ ساخته شود؛ و مدل وقتی مطمئن نیست ساکت می‌ماند. نتیجه یک پاسخ عمومی زیر کامنت، یک پیام اینستاگرام، پنهان کردن کامنت یا یک پاسخ واتس‌اپ است. نه پروفایل‌سازی، نه تبلیغات، نه تحلیل دیگری.",

    priv_h_keep: "چه مدت نگه داشته می‌شود",
    priv_keep1: "پایگاه داده‌ای در کار نیست. تنها چیزی که سرور نگه می‌دارد فهرستی حداکثر ۵۰۰۰ شناسه‌ی پیام در حافظه است تا به یک پیام دو بار پاسخ داده نشود. این فهرست با هر بار راه‌اندازی دوباره‌ی سرور پاک می‌شود.",
    priv_keep2: "متن پیام و نام فرستنده در گزارش اجرای سرور دیده می‌شود. ارائه‌دهنده‌ی میزبانی این گزارش‌ها را مدت محدودی نگه می‌دارد و بعد می‌چرخاند و پاک می‌کند. جز این، محتوا هیچ‌جا نوشته نمی‌شود.",

    priv_h_share: "اشتراک‌گذاری",
    priv_share: "داده فقط به دو جا می‌رود: Graph API متا برای رساندن پاسخ، و Claude API شرکت Anthropic برای نوشتن پیش‌نویس وقتی هیچ قاعده‌ای جور نمی‌شود. با هیچ شخص ثالث دیگری به اشتراک گذاشته نمی‌شود و هرگز فروخته یا اجاره داده نمی‌شود.",

    priv_h_children: "کودکان",
    priv_children: "نه سایت و نه ربات برای کودکان نیست و هیچ‌کدام آگاهانه برای پردازش داده‌ی کودکان به کار نمی‌رود.",

    priv_h_rights: "حقوق تو",
    priv_rights: "چون در آلمان زندگی می‌کنم، GDPR اعمال می‌شود: می‌توانی بپرسی چه داده‌ای درباره‌ات پردازش شده، حذفش را بخواهی یا به پردازش اعتراض کنی. چون جز همان سوابق کوتاه‌مدتی که بالا گفته شد چیزی ذخیره نمی‌شود، معمولاً چیزی برای حذف کردن نیست. اگر ترجیح می‌دهی پاسخ خودکار نگیری، کافی است برایم بنویسی.",

    priv_h_changes: "تغییرات",
    priv_changes: "اگر آنچه جمع‌آوری می‌شود یا شیوه‌ی استفاده تغییر کند، این صفحه به‌روز می‌شود و تاریخ بالا هم با آن عوض می‌شود. تاریخچه‌ی صفحه در گزارش کامیت‌های مخزن باز است.",

    priv_h_contact: "تماس",
    priv_contact: "هر پرسشی درباره‌ی این سیاست یا درباره‌ی یک تعامل مشخص:",

    contact_title: "برایم بنویس",
    contact_text: "اگر درباره‌ی وب، Firebase یا ربات‌ها سؤالی داری، ایمیل سریع‌ترین راه است. معمولاً ظرف یکی دو روز جواب می‌دهم.",
    contact_email: "فرستادن ایمیل"
  }
};

/* Dil üstverisi — yön ve seçicide görünen kısa ad. */
const LANG_META = {
  tr: { dir: "ltr", short: "TR" },
  en: { dir: "ltr", short: "EN" },
  de: { dir: "ltr", short: "DE" },
  fa: { dir: "rtl", short: "FA" }
};

/* Rakamlar — Farsça'da tarihler sözlükten ۰۱۲ ile geliyor, ama sıra
   numaraları ve sayaçlar HTML'de elle yazılı olduğu için Latin kalıyordu:
   aynı ekranda iki rakam sistemi görünüyordu. Çeviriye tabi olmayan
   sayıları da diğer dillerde olduğu gibi bırakıp yalnız Farsça'da
   dönüştürüyoruz. */
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function localizeDigits(text, lang) {
  if (lang !== "fa") return String(text);
  return String(text).replace(/[0-9]/g, function (d) {
    return FA_DIGITS.charAt(Number(d));
  });
}

if (typeof module !== "undefined") {
  module.exports = { translations, LANG_META, localizeDigits };
}
