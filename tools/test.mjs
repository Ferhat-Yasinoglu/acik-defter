#!/usr/bin/env node
/* ==========================================================================
   Tarayıcı testleri.  `node tools/test.mjs`

   Gerekli:  npm i -D playwright && npx playwright install chromium

   check.mjs dosyaları okuyup tutarlılığa bakıyor; burası siteyi gerçekten
   açıp davranışa bakıyor: süzgeç, açılır bölümler, tema ve dilin sayfa
   geçişinde korunması, JavaScript kapalıyken okunabilirlik, klavye
   erişimi ve service worker'ın çevrimdışı gerçekten çalışması.

   Kendi statik sunucusunu açar; ayrıca bir şey çalıştırmak gerekmez.
   ========================================================================== */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, resolve, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  if (path.endsWith("/")) path += "index.html";
  // Kök dışına çıkan yollar reddedilir.
  const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": MIME[".html"] });
    res.end(await readFile(join(ROOT, "404.html")).catch(() => "404"));
  }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

let failed = 0;
const ok = (cond, msg) => {
  console.log((cond ? "  ✓ " : "  ✗ ") + msg);
  if (!cond) failed++;
};

const browser = await chromium.launch();

/* ------------------------------------------ süzgeç, ayrıntı, tema, dil */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE + "notlar.html", { waitUntil: "domcontentloaded" });
  const total = await page.locator("[data-cat]").count();

  ok((await page.locator("[data-cat]:visible").count()) === total, `süzgeçsiz ${total} not görünüyor`);
  await page.click('[data-filter="bot"]');
  const bots = await page.locator('[data-cat="bot"]').count();
  ok((await page.locator("[data-cat]:visible").count()) === bots, `Botlar süzgeci ${bots} not bırakıyor`);
  ok((await page.locator(".filter-count .num").textContent()) === String(bots), "sayaç doğru");
  await page.click('[data-filter="all"]');
  ok((await page.locator("[data-cat]:visible").count()) === total, "Tümü'ne dönünce hepsi geri geliyor");

  const det = page.locator("details.disclosure").first();
  ok(!(await det.locator(".points").isVisible()), "ayrıntı başta kapalı");
  await det.locator("summary").click();
  ok(await det.locator(".points").isVisible(), "tıklayınca açılıyor");

  const before = await page.getAttribute("html", "data-theme");
  await page.click(".theme-toggle");
  const after = await page.getAttribute("html", "data-theme");
  ok(before !== after, `tema değişiyor (${before} → ${after})`);
  ok((await page.locator(".theme-toggle svg:visible").count()) === 1, "tema düğmesinde tek ikon görünüyor");

  await page.click('.langs [data-lang="de"]');
  await page.waitForTimeout(200);
  ok((await page.getAttribute("html", "lang")) === "de", "dil Almanca'ya geçiyor");
  ok((await page.title()).includes("Offenes Heft"), "sekme başlığı da çevriliyor");

  await page.goto(BASE + "projeler.html", { waitUntil: "domcontentloaded" });
  ok((await page.getAttribute("html", "lang")) === "de", "dil sayfa geçişinde korunuyor");
  ok((await page.getAttribute("html", "data-theme")) === after, "tema sayfa geçişinde korunuyor");
  ok(
    (await page.evaluate(() => document.documentElement.dataset.theme)) === after,
    "tercihler sayfa boyanmadan önce uygulanmış"
  );

  await page.click('.langs [data-lang="fa"]');
  await page.waitForTimeout(200);
  ok((await page.getAttribute("html", "dir")) === "rtl", "Farsça'da yön rtl oluyor");

  ok(errors.length === 0, "konsolda JavaScript hatası yok" + (errors.length ? ": " + errors[0] : ""));
  await ctx.close();
}

/* ------------------------------------------------- JavaScript kapalıyken */
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + "notlar.html", { waitUntil: "domcontentloaded" });

  ok((await page.locator("[data-cat]").count()) > 0, "JS'siz notlar sayfada duruyor");
  const det = page.locator("details.disclosure").first();
  await det.locator("summary").click();
  ok(await det.locator(".points").isVisible(), "JS'siz ayrıntı yine açılıyor");
  ok((await page.locator(".nav a").count()) === 5, "JS'siz gezinme çalışıyor");
  await ctx.close();
}

/* ------------------------------------------ dil seçici ekranda kalıyor mu

   Bir kez ters gitti: açılır menü dar ekranda ekranın dışına taşıyor, dil
   adları yarım görünüyordu. Menü kaldırıldı, yerine dört düğme kondu; yine
   de başlık çubuğu sardığında düğmelerin görünür alanda kaldığını her
   genişlikte ve her dilde doğruluyoruz. */
{
  const WIDTHS = [1280, 1024, 900, 820, 760, 700, 640, 600, 560, 480, 430, 390, 360, 320];
  const LANGS = ["tr", "en", "de", "fa"];
  const spills = [];

  /* Dil başına tek sayfa açıp yalnızca pencereyi yeniden boyutlandırıyoruz:
     her genişlik için ayrı bağlam açmak testi dakikalarca sürdürüyordu. */
  for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: WIDTHS[0], height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate((l) => localStorage.setItem("ad-lang", l), lang);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(".langs");

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      const box = await page.locator(".langs").boundingBox();

      if (box.x < -0.5) spills.push(`${lang} ${width}px: soldan ${Math.round(-box.x)}px`);
      else if (box.x + box.width > width + 0.5) spills.push(`${lang} ${width}px: sağdan ${Math.round(box.x + box.width - width)}px`);
    }

    await ctx.close();
  }

  ok(
    spills.length === 0,
    `dil seçici 4 dil × ${WIDTHS.length} genişlikte ekranda kalıyor` +
      (spills.length ? ` — taşanlar: ${spills.slice(0, 4).join(", ")}` : "")
  );
}

/* --------------------------- başlık sırası ve dokunma hedefleri

   Kayıt başlıkları h1'in hemen altında h3'tü: ekran okuyucuda arada bir
   seviye eksik görünüyordu. Bölüm başlıklarındaki "tümü" bağlantısı da 22
   piksel yüksekliğindeydi, WCAG'ın 24×24 alt sınırının altında; altbilgi ve
   proje bağlantıları da eşiğe değip geçmiyordu.

   İkisi de gözle fark edilmiyor, o yüzden ölçüyoruz. */
{
  const PAGES = ["index.html", "yolculugum.html", "projeler.html", "notlar.html", "hakkimda.html", "gizlilik.html"];
  const headingIssues = [];
  const smallTargets = [];

  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });

    const m = await page.evaluate(() => {
      const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
      const bad = [];
      const h1s = levels.filter((l) => l === 1).length;
      if (h1s !== 1) bad.push(`${h1s} adet h1`);
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) bad.push(`h${levels[i - 1]} -> h${levels[i]}`);
      }

      const tiny = [];
      for (const el of document.querySelectorAll("a, button")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.width < 24 || r.height < 24) {
          tiny.push(`${el.textContent.trim().slice(0, 14)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return { bad, tiny: [...new Set(tiny)] };
    });

    if (m.bad.length) headingIssues.push(`${path}: ${m.bad.join(", ")}`);
    if (m.tiny.length) smallTargets.push(`${path}: ${m.tiny.slice(0, 3).join(", ")}`);
  }

  await ctx.close();

  ok(
    headingIssues.length === 0,
    `başlık seviyeleri ${PAGES.length} sayfada da atlamasız` +
      (headingIssues.length ? ` — bozuklar: ${headingIssues.join("; ")}` : "")
  );
  ok(
    smallTargets.length === 0,
    "bütün bağlantı ve düğmeler en az 24×24 piksel" +
      (smallTargets.length ? ` — küçükler: ${smallTargets.slice(0, 3).join("; ")}` : "")
  );
}

/* ----------------------------------------- metin kontrastı AA'yı geçiyor mu

   İkincil metinler (--ink-3) iki temada da eşiğin hemen altındaydı: açık
   temada 4.20:1, koyuda 3.58:1 ile 4.29:1 arası. Bir belirteç kaydırmak
   bütün siteyi etkilediği için sessizce geri kayabilir; ölçüp bağlıyoruz.

   Ölçüm gradyanla boyanmış yazıyı ve gradyan zeminleri atlıyor: onların
   oranı tek bir renk çiftinden çıkmıyor, göze bakmak gerekiyor. */
{
  const PAGES = ["index.html", "yolculugum.html", "projeler.html", "notlar.html", "hakkimda.html", "gizlilik.html"];
  const fails = [];

  const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, colorScheme: scheme });
    const page = await ctx.newPage();

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded" });

      const rows = await page.evaluate(() => {
        /* rgb() 0-255 verir, color(srgb ...) 0-1 — ikincisini ölçeklendir */
        const rgba = (s) => {
          if (!s) return null;
          const n = (s.match(/[\d.]+/g) || []).map(Number);
          if (!n.length) return null;
          const k = /^color\(\s*srgb/i.test(s) ? 255 : 1;
          return [n[0] * k, n[1] * k, n[2] * k, n.length > 3 ? n[3] : 1];
        };
        const out = [];
        for (const el of document.querySelectorAll("body *")) {
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") continue;
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;

          const fg = rgba(cs.color);
          if (!fg || fg[3] === 0) continue; /* gradyanla boyanmış yazı */

          /* zemin: html'den elemana kadar bütün katmanları alfa ile bindir */
          const chain = [];
          for (let n = el; n; n = n.parentElement) chain.push(n);
          chain.reverse();
          let bg = [255, 255, 255], gradient = false;
          for (const n of chain) {
            const s = getComputedStyle(n);
            if (s.backgroundImage && s.backgroundImage !== "none") gradient = true;
            const c = rgba(s.backgroundColor);
            if (!c || c[3] === 0) continue;
            bg = [0, 1, 2].map((i) => c[i] * c[3] + bg[i] * (1 - c[3]));
          }
          if (gradient) continue;

          const a = fg[3];
          out.push({
            tag: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : ""),
            fg: [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)),
            bg, size: parseFloat(cs.fontSize), weight: +cs.fontWeight,
          });
        }
        return out;
      });

      for (const t of rows) {
        const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
        const need = large ? 3 : 4.5;
        const r = ratio(t.fg, t.bg);
        if (r < need) fails.push(`${scheme} ${path} ${t.tag} ${t.size}px: ${r.toFixed(2)}:1`);
      }
    }

    await ctx.close();
  }

  ok(
    fails.length === 0,
    `metin kontrastı iki temada da AA eşiğini geçiyor` +
      (fails.length ? ` — kalanlar: ${[...new Set(fails)].slice(0, 4).join(", ")}` : "")
  );
}

/* ------------------------------------- sayfa yatay kaymıyor mu

   Bir kez ters gitti ve testler kaçırdı: başlık çubuğu iki satıra
   indirilirken dil/tema düğmeleri en dar ekranda grid hücresine sığmayıp
   sağa taştı, sayfa 320px'de 332 piksele çıktı. O sıradaki testler yalnızca
   tek tek öğelerin yerine bakıyordu; sayfanın kendi genişliğini kimse
   ölçmüyordu. Ayrıca bölüm başlıkları uzun dillerde ve boşluksuz etiket
   dizileri ("TypeScript·Node.js·...") dar ekranda taşıyordu.

   Burada tek bir şey soruluyor: gövde, görünen alandan geniş mi. */
{
  const PAGES = ["index.html", "yolculugum.html", "projeler.html", "notlar.html", "hakkimda.html", "gizlilik.html"];
  const WIDTHS = [320, 375, 430];
  const LANGS = ["tr", "en", "de", "fa"];
  const spills = [];

  for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: WIDTHS[0], height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate((l) => localStorage.setItem("ad-lang", l), lang);

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 });
        const over = await page.evaluate(() => {
          const de = document.documentElement;
          return de.scrollWidth - de.clientWidth;
        });
        if (over > 1) spills.push(`${lang} ${path} ${width}px: ${over}px`);
      }
    }

    await ctx.close();
  }

  ok(
    spills.length === 0,
    `${LANGS.length} dil × ${PAGES.length} sayfa × ${WIDTHS.length} genişlikte yatay kayma yok` +
      (spills.length ? ` — taşanlar: ${spills.slice(0, 4).join(", ")}` : "")
  );
}

/* --------------------------------- etkin sayfa çizgisi doğru satırda mı

   Bir kez ters gitti: menü dar ekranda iki satıra sarınca "Ana Sayfa"nın
   altındaki çizgi alt satıra düşüyor, "Notlar"ı işaretliyor gibi
   görünüyordu. Sarma noktası dile göre 390px ile 520px arasında değiştiği
   için kırılma noktasına bakmıyoruz; çizginin altıyla bir sonraki satırın
   üstü arasında boşluk kaldığını ölçüyoruz. */
{
  const WIDTHS = [1280, 900, 700, 600, 520, 480, 430, 390, 360, 320];
  const LANGS = ["tr", "en", "de", "fa"];
  const collisions = [];

  for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: WIDTHS[0], height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate((l) => localStorage.setItem("ad-lang", l), lang);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(".nav a[aria-current='page']");

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      const gap = await page.evaluate(() => {
        const cur = document.querySelector(".nav a[aria-current='page']");
        const tops = [...document.querySelectorAll(".nav a")]
          .map((a) => Math.round(a.getBoundingClientRect().top))
          .sort((a, b) => a - b);
        const next = tops.find((t) => t > Math.round(cur.getBoundingClientRect().top));
        if (next === undefined) return null; /* menü tek satır, çizginin altında satır yok */

        const line = getComputedStyle(cur, "::after");
        const lineBottom =
          cur.getBoundingClientRect().bottom +
          Math.abs(parseFloat(line.bottom)) +
          parseFloat(line.height);
        return Math.round(next - lineBottom);
      });

      if (gap !== null && gap < 2) collisions.push(`${lang} ${width}px: ${gap}px`);
    }

    await ctx.close();
  }

  ok(
    collisions.length === 0,
    `etkin sayfa çizgisi 4 dil × ${WIDTHS.length} genişlikte kendi satırında kalıyor` +
      (collisions.length ? ` — çakışanlar: ${collisions.slice(0, 4).join(", ")}` : "")
  );
}

/* ----------------------------- başlık çubuğu dar ekranda yol açıyor mu

   Çubuk telefonda üç satıra çıkıp 200 pikseli geçiyor; yapışık kalsaydı
   ekranın dörtte biri kaydırma boyunca kaybolurdu. Dar ekranda sayfayla
   akıp gitmesi, geniş ekranda yapışık kalması gerekiyor. */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });

  const bottomAfterScroll = async () => {
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" }));
    return page.evaluate(() => document.querySelector(".masthead").getBoundingClientRect().bottom);
  };

  ok((await bottomAfterScroll()) <= 0, "telefonda çubuk kaydırınca ekranı bırakıyor");

  await page.setViewportSize({ width: 1280, height: 800 });
  ok((await bottomAfterScroll()) > 0, "geniş ekranda çubuk yapışık kalıyor");

  /* "Şu sıralar" şeridi dar ekranda etiketin altına geçiyor mu: yan yana
     kalırsa etiket genişliğin neredeyse yarısını alıyordu. */
  await page.setViewportSize({ width: 390, height: 800 });
  const share = await page.evaluate(() => {
    const band = document.querySelector(".now-band");
    const text = band.querySelector("p");
    return Math.round((text.getBoundingClientRect().width / band.getBoundingClientRect().width) * 100);
  });
  ok(share >= 75, `telefonda "şu sıralar" metni şeridin %${share}'ini kullanıyor`);

  await ctx.close();
}

/* ------------------------------- dar ekranda başlık çubuğu iki satır kalıyor

   Çubuk telefonda üç satırdı: ad, iki satıra sarmış menü, düğmeler — 205px.
   Düğmeler adın yanına alındı, menü kendi satırında yatay kayan tek sıraya
   indi. Üçüncü satır geri gelirse yükseklik yeniden yüz elliyi aşar; sınırı
   oradan koyuyoruz.

   380px'in altı bunun dışında: orada düğmeler adın yanına sığmıyor (177px
   istiyorlar, 320px'lik ekranda 112px kalıyor) ve zorlanınca sayfayı yatay
   kaydırıyorlardı. O genişlikte üçüncü satır bilinçli bir seçim; yine de
   başıboş değil, aşağıda ayrı bir sınırla ölçülüyor. */
{
  const WIDTHS = [380, 390, 430, 520, 660];
  const NARROW = [320, 360, 375];
  const LANGS = ["tr", "en", "de", "fa"];
  const tall = [];
  const split = [];
  const tooTall = [];

  for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: WIDTHS[0], height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate((l) => localStorage.setItem("ad-lang", l), lang);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(".masthead");

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      const m = await page.evaluate(() => {
        const box = (sel) => document.querySelector(sel).getBoundingClientRect();
        const wordmark = box(".wordmark");
        const tools = box(".tools");
        return {
          height: Math.round(box(".masthead").height),
          /* Ad ile düğmeler aynı satırda mı: ayrılırlarsa üçüncü satır demek */
          together: Math.abs(wordmark.top - tools.top) < 6,
        };
      });

      if (m.height > 130) tall.push(`${lang} ${width}px: ${m.height}px`);
      if (!m.together) split.push(`${lang} ${width}px`);
    }

    /* 380px altı: üç satıra izin var ama dördüncüsüne yok. Menü hâlâ tek
       sıra olduğu sürece çubuk 160 pikseli aşmamalı. */
    for (const width of NARROW) {
      await page.setViewportSize({ width, height: 800 });
      const h = await page.evaluate(() => Math.round(document.querySelector(".masthead").getBoundingClientRect().height));
      if (h > 160) tooTall.push(`${lang} ${width}px: ${h}px`);
    }

    await ctx.close();
  }

  ok(
    tall.length === 0,
    `çubuk 380px üstünde 4 dil × ${WIDTHS.length} genişlikte iki satırda kalıyor` +
      (tall.length ? ` — taşanlar: ${tall.slice(0, 4).join(", ")}` : "")
  );
  ok(
    split.length === 0,
    "380px üstünde ad ile dil/tema düğmeleri aynı satırda" +
      (split.length ? ` — ayrılanlar: ${split.slice(0, 4).join(", ")}` : "")
  );
  ok(
    tooTall.length === 0,
    `380px altında çubuk üç satırı aşmıyor (4 dil × ${NARROW.length} genişlik)` +
      (tooTall.length ? ` — taşanlar: ${tooTall.slice(0, 4).join(", ")}` : "")
  );
}

/* ------------------------ etkin sekme dar ekranda görünür kalıyor mu

   Menü dar ekranda sığmadığı için yatay kayıyor; sondaki sayfalardayken
   etkin bağlantı ekranın dışında başlıyor ve "hangi sayfadayım" işareti hiç
   görünmüyordu. site.js menüyü o bağlantı görünecek kadar kaydırıyor.

   Altındaki çizgi de taşma kutusunun içinde kalmalı: menüye alt boşluk
   verilmeseydi kırpılıp yok olurdu. */
{
  const PAGES = ["index.html", "yolculugum.html", "projeler.html", "notlar.html", "hakkimda.html"];
  const hidden = [];
  const clipped = [];

  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".nav [aria-current='page']");

    const m = await page.evaluate(() => {
      const nav = document.querySelector(".nav");
      const current = nav.querySelector("[aria-current='page']");
      const navBox = nav.getBoundingClientRect();
      const itemBox = current.getBoundingClientRect();

      const line = getComputedStyle(current, "::after");
      const lineBottom =
        itemBox.bottom + Math.abs(parseFloat(line.bottom)) + parseFloat(line.height);

      return {
        name: current.textContent.trim(),
        visible: itemBox.left >= navBox.left - 1 && itemBox.right <= navBox.right + 1,
        /* Kırpma dolgu kenarında olur: clientHeight dolgu kutusunun boyu */
        lineInside: lineBottom <= navBox.top + nav.clientHeight + 1,
      };
    });

    if (!m.visible) hidden.push(`${path} (${m.name})`);
    if (!m.lineInside) clipped.push(`${path} (${m.name})`);
  }

  await ctx.close();

  ok(
    hidden.length === 0,
    `etkin sekme ${PAGES.length} sayfanın hepsinde telefonda görünüyor` +
      (hidden.length ? ` — görünmeyenler: ${hidden.join(", ")}` : "")
  );
  ok(
    clipped.length === 0,
    "etkin sekmenin çizgisi kırpılmıyor" +
      (clipped.length ? ` — kırpılanlar: ${clipped.join(", ")}` : "")
  );
}

/* ----------------------------------------------------------- klavye */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  ok(
    (await page.evaluate(() => document.activeElement.className)).includes("skip-link"),
    "ilk Tab 'içeriğe geç' bağlantısına gidiyor"
  );
  ok(
    (await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth)) !== "0px",
    "odaklanan öğenin görünür çerçevesi var"
  );
  await ctx.close();
}

/* --------------------------------------------------------- çevrimdışı */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page
    .waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 10000 })
    .catch(() => {});
  ok(await page.evaluate(() => !!navigator.serviceWorker.controller), "service worker sayfayı devraldı");

  await page.waitForTimeout(1500); // kabuğun önbelleğe yazılmasını bekle
  await ctx.setOffline(true);
  const res = await page.goto(BASE + "notlar.html", { waitUntil: "domcontentloaded" }).catch(() => null);
  ok(!!res, "ağ kapalıyken sayfa yine açılıyor");
  if (res) ok((await page.locator("[data-cat]").count()) > 0, "çevrimdışı içerik eksiksiz geliyor");
  await ctx.close();
}

await browser.close();
server.close();

console.log(failed ? `\n✗ ${failed} test düştü\n` : "\n✓ Bütün testler geçti\n");
process.exit(failed ? 1 : 0);
