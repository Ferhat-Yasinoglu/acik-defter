/* ==========================================================================
   NetStore — grafikler
   Bağımlılıksız SVG. İnce marklar, hairline (kesiksiz) grid, seçici etiket,
   iki seriden itibaren daima legend, hover'da crosshair + tooltip.
   Seri renkleri CVD ve kontrast açısından doğrulanmıştır.
   ========================================================================== */

const SERIES_1 = '#8B5CF6';  /* Satış */
const SERIES_2 = '#16A34A';  /* Kâr   */
const GRID     = 'rgba(148,163,184,0.13)';
const AXIS_INK = '#64748B';
const SURFACE  = '#111827';

/* --- yardımcılar --- */
function niceCeil(v) {
  if (v <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * mag;
}
function shortMoney(v) {
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1).replace('.', ',') + 'k';
  return String(Math.round(v));
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------------------
   Sparkline — KPI kartlarındaki küçük eğilim göstergesi.
   Tek seri, eksen yok: kartın rakamı zaten değeri söylüyor.
   -------------------------------------------------------------------------- */
function sparkline(values, color, w, h) {
  w = w || 96; h = h || 30;
  if (!values || values.length < 2) return '';

  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const span = (max - min) || 1;
  const pad = 3;
  const step = (w - pad * 2) / (values.length - 1);

  const pts = values.map((v, i) => [
    pad + i * step,
    h - pad - ((v - min) / span) * (h - pad * 2)
  ]);

  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + h + ' L' + pts[0][0].toFixed(1) + ' ' + h + ' Z';
  const last = pts[pts.length - 1];
  const gid = 'sp' + Math.random().toString(36).slice(2, 8);

  return '<svg class="spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h +
         '" fill="none" aria-hidden="true">' +
    '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.22"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/>' +
    '</linearGradient></defs>' +
    '<path d="' + area + '" fill="url(#' + gid + ')"/>' +
    '<path d="' + line + '" stroke="' + color + '" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    /* uç nokta: 2px yüzey halkası ile ayrışır */
    '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.6" fill="' + color +
      '" stroke="' + SURFACE + '" stroke-width="2"/>' +
  '</svg>';
}

/* --------------------------------------------------------------------------
   Çizgi/alan grafiği — aylık satış ve kâr.
   Tek y ekseni (iki ölçek asla yan yana çizilmez).
   -------------------------------------------------------------------------- */
function lineChart(host, opts) {
  const data = opts.data;
  const series = opts.series;                 // [{key, name, color}]
  if (!host || !data || !data.length) return;

  const W = 760, H = 250;
  const m = { t: 14, r: 16, b: 30, l: 46 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;

  let max = 0;
  data.forEach((d) => series.forEach((s) => { if (d[s.key] > max) max = d[s.key]; }));
  const top = niceCeil(max * 1.12) || 10;

  const x = (i) => m.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v) => m.t + ih - (v / top) * ih;

  const TICKS = 4;
  let grid = '', yLabels = '';
  for (let i = 0; i <= TICKS; i++) {
    const v = (top / TICKS) * i, gy = y(v);
    grid += '<line x1="' + m.l + '" y1="' + gy.toFixed(1) + '" x2="' + (W - m.r) +
            '" y2="' + gy.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    yLabels += '<text x="' + (m.l - 9) + '" y="' + (gy + 3.5).toFixed(1) +
               '" text-anchor="end" font-size="10.5" fill="' + AXIS_INK + '">' + shortMoney(v) + '</text>';
  }

  let xLabels = '';
  const skip = data.length > 8 ? 2 : 1;
  data.forEach((d, i) => {
    if (i % skip !== 0 && i !== data.length - 1) return;
    xLabels += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 9) +
               '" text-anchor="middle" font-size="10.5" fill="' + AXIS_INK + '">' +
               esc(d.m !== undefined ? monthShort(d.m) : d.label) + '</text>';
  });

  let paths = '', dots = '';
  series.forEach((s, si) => {
    const pts = data.map((d, i) => [x(i), y(d[s.key])]);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const gid = 'lc' + si + Math.random().toString(36).slice(2, 7);

    if (si === 0) {
      paths += '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + s.color + '" stop-opacity="0.16"/>' +
        '<stop offset="100%" stop-color="' + s.color + '" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="' + line + ' L' + x(data.length - 1).toFixed(1) + ' ' + (m.t + ih) +
        ' L' + x(0).toFixed(1) + ' ' + (m.t + ih) + ' Z" fill="url(#' + gid + ')"/>';
    }
    paths += '<path d="' + line + '" stroke="' + s.color + '" stroke-width="2" fill="none" ' +
             'stroke-linecap="round" stroke-linejoin="round"/>';

    /* seçici etiket: yalnızca son nokta işaretlenir */
    const last = pts[pts.length - 1];
    dots += '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) +
            '" r="4" fill="' + s.color + '" stroke="' + SURFACE + '" stroke-width="2"/>';
  });

  /* hover katmanı */
  let hover = '<g class="lc-hover" style="opacity:0">' +
    '<line class="lc-cross" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="' + AXIS_INK +
    '" stroke-width="1" stroke-opacity="0.55"/>';
  series.forEach((s) => {
    hover += '<circle class="lc-mk" r="4.5" fill="' + s.color + '" stroke="' + SURFACE + '" stroke-width="2"/>';
  });
  hover += '</g>';

  host.innerHTML =
    '<div class="chart-wrap ltr">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" preserveAspectRatio="none" ' +
        'style="height:250px" aria-label="' + esc(opts.aria || 'Aylık satış ve kâr grafiği') + '">' +
        grid + yLabels + xLabels + paths + dots + hover +
        '<rect class="lc-catch" x="' + m.l + '" y="' + m.t + '" width="' + iw + '" height="' + ih +
        '" fill="transparent" style="cursor:crosshair"/>' +
      '</svg>' +
      '<div class="chart-tip"></div>' +
    '</div>';

  /* --- etkileşim --- */
  const svg   = host.querySelector('svg');
  const wrap  = host.querySelector('.chart-wrap');
  const tip   = host.querySelector('.chart-tip');
  const hoverG= host.querySelector('.lc-hover');
  const cross = host.querySelector('.lc-cross');
  const marks = host.querySelectorAll('.lc-mk');
  const catch_= host.querySelector('.lc-catch');

  function locate(ev) {
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * W;
    let best = 0, bd = Infinity;
    data.forEach((d, i) => { const dd = Math.abs(x(i) - px); if (dd < bd) { bd = dd; best = i; } });
    return best;
  }

  function show(ev) {
    const i = locate(ev);
    const d = data[i];
    const cx = x(i);

    hoverG.style.opacity = '1';
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx);
    series.forEach((s, si) => {
      marks[si].setAttribute('cx', cx);
      marks[si].setAttribute('cy', y(d[s.key]));
    });

    let rows = '';
    series.forEach((s) => {
      rows += '<div class="tip-row"><span class="legend-swatch" style="background:' + s.color + '"></span>' +
              '<span class="tip-name">' + esc(s.name) + '</span>' +
              '<span class="tip-val">' + money(d[s.key]) + '</span></div>';
    });
    tip.innerHTML = '<div class="tip-title">' +
      esc((d.m !== undefined ? monthShort(d.m) : d.label) + ' ' + (d.year ? num(d.year) : '')) +
      '</div>' + rows;
    tip.classList.add('on');

    const wr = wrap.getBoundingClientRect();
    const rel = (cx / W) * wr.width;
    const tw = tip.offsetWidth;
    let left = rel - tw / 2;
    left = Math.max(4, Math.min(wr.width - tw - 4, left));
    tip.style.left = left + 'px';
    tip.style.top  = '6px';
  }

  function hide() {
    hoverG.style.opacity = '0';
    tip.classList.remove('on');
  }

  catch_.addEventListener('pointermove', show);
  catch_.addEventListener('pointerdown', show);
  catch_.addEventListener('pointerleave', hide);
}

/* --------------------------------------------------------------------------
   Yığılmış çubuk — alacak yaşlandırması.
   Parça-bütün ilişkisi; segmentler 2px yüzey boşluğu ile ayrılır.
   -------------------------------------------------------------------------- */
function stackedBar(host, segments) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!host) return;

  if (total <= 0) {
    host.innerHTML = '<div class="empty">' + icon('check') + '<p>Açık bakiye yok.</p></div>';
    return;
  }

  let bars = '';
  segments.forEach((s) => {
    if (s.value <= 0) return;
    bars += '<div style="width:' + ((s.value / total) * 100).toFixed(2) + '%;background:' + s.color +
            ';height:100%;border-radius:3px" title="' + esc(s.name) + '"></div>';
  });

  let legend = '';
  segments.forEach((s) => {
    legend += '<div class="hbar-row" style="grid-template-columns:auto 1fr auto;gap:0 10px">' +
      '<span class="legend-swatch" style="background:' + s.color + '"></span>' +
      '<span class="hbar-name" style="font-size:12.5px;font-weight:500">' + esc(s.name) + '</span>' +
      '<span class="hbar-val strong" style="color:var(--text);font-weight:650">' + money(s.value) + '</span>' +
      '</div>';
  });

  host.innerHTML =
    '<div style="display:flex;gap:2px;height:12px;border-radius:4px;overflow:hidden;background:var(--surface-3)">' +
      bars + '</div>' +
    '<div class="hbar aging-legend" style="gap:11px;margin-top:16px">' + legend + '</div>';
}

/* --------------------------------------------------------------------------
   Yatay çubuklar — kategori / ürün kırılımı. Tek seri, tek renk.
   -------------------------------------------------------------------------- */
function hBars(host, rows, color) {
  if (!host) return;
  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
  host.innerHTML = '<div class="hbar">' + rows.map((r) =>
    '<div class="hbar-row">' +
      '<span class="hbar-name">' + esc(r.name) + '</span>' +
      '<span class="hbar-val">' + (r.display || money(r.value)) + '</span>' +
      '<span class="hbar-track"><span class="hbar-fill" style="width:' +
        ((r.value / max) * 100).toFixed(1) + '%;background:' + (r.color || color || SERIES_1) + '"></span></span>' +
    '</div>'
  ).join('') + '</div>';
}
