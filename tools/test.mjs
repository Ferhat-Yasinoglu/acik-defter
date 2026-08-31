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
