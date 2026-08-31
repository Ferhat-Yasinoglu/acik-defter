#!/usr/bin/env node
/* ==========================================================================
   Giriş bölümünün arkasındaki nokta dalgasını üretir → img/wave.svg

     node tools/make-wave.mjs

   Neden dosya, neden satır içi değil: ~2000 nokta var. Satır içi olsaydı
   her sayfanın HTML'ini şişirirdi; ayrı dosya bir kez indirilip önbellekte
   kalıyor. Neden SVG, neden PNG değil: her ekran çözünürlüğünde net ve
   sıkıştırılınca çok daha küçük.

   Noktalar üst üste binmiş iki sinüs eğrisini izliyor; sağa doğru hem
   parlaklık hem yoğunluk artıyor, sol kenar sıfıra iniyor ki metnin
   arkasında kalan bölge sakin olsun.
   ========================================================================== */

import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const W = 1600;
const H = 460;
const STRANDS = 24;     // yatay iplik sayısı
const STEP = 10;        // nokta aralığı

/* Opaklık kovaları: her nokta ayrı opacity taşımak yerine gruplanıyor.
   Dosya üçte bir boyuta iniyor. */
const BUCKETS = 6;

const buckets = Array.from({ length: BUCKETS }, () => []);

for (let s = 0; s < STRANDS; s++) {
  const t = s / (STRANDS - 1);              // 0 üstte, 1 altta
  const base = 120 + t * 300;
  const amp1 = 46 - t * 18;
  const amp2 = 20 - t * 8;
  const ph = t * 2.1;

  for (let x = 0; x <= W; x += STEP) {
    const u = x / W;                        // 0 solda, 1 sağda
    const y =
      base +
      amp1 * Math.sin(u * 5.1 + ph) +
      amp2 * Math.sin(u * 11.3 + ph * 1.7);

    if (y < 4 || y > H - 4) continue;

    /* Sola doğru sönüyor, sağa doğru güçleniyor. Tepe noktalarında biraz
       daha parlak: eğrinin türevi sıfıra yaklaştığı yerler. */
    const crest = 1 - Math.abs(Math.cos(u * 5.1 + ph));
    const fade = Math.pow(u, 0.85);
    const depth = 1 - t * 0.45;
    let a = fade * depth * (0.38 + crest * 0.72);
    if (a <= 0.04) continue;
    a = Math.min(1, a);

    const r = (1.0 + a * 1.25).toFixed(2);
    const bucket = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
    buckets[bucket].push(`<circle cx="${x}" cy="${y.toFixed(1)}" r="${r}"/>`);
  }
}

const groups = buckets
  .map((dots, i) =>
    dots.length ? `<g opacity="${(((i + 1) / BUCKETS) * 1).toFixed(2)}">${dots.join("")}</g>` : ""
  )
  .join("");

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" aria-hidden="true">` +
  `<defs><linearGradient id="w" x1="0" y1="1" x2="1" y2="0">` +
  `<stop offset="0" stop-color="#8b5cf6"/><stop offset=".55" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/>` +
  `</linearGradient></defs>` +
  `<g fill="url(#w)">${groups}</g></svg>`;

mkdirSync(join(ROOT, "img"), { recursive: true });
const out = join(ROOT, "img/wave.svg");
writeFileSync(out, svg);

const dots = buckets.reduce((n, b) => n + b.length, 0);
console.log(`img/wave.svg — ${dots} nokta, ${(statSync(out).size / 1024).toFixed(1)} KB`);
