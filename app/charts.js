// DompetKeluarga charts: every chart is drawn on canvas with plain 2D calls,
// no library, no network. Colours match the site palette (navy + teal).

function fitCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return null;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function niceMax(v) {
  if (v <= 0) return 100;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Grouped bars: income (teal) vs spending (navy) for each month.
export function drawIncomeSpending(canvas, months) {
  const fit = fitCanvas(canvas);
  if (!fit) return;
  const { ctx, w, h } = fit;
  const padL = 46, padR = 10, padT = 22, padB = 28;
  const cw = w - padL - padR, ch = h - padT - padB;
  const max = niceMax(Math.max(...months.map((m) => Math.max(m.income, m.spending))));
  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#5b6b7d';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (max * i) / 4;
    const y = padT + ch - (ch * i) / 4;
    ctx.strokeStyle = '#e8eef3';
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillText('$' + Math.round(v).toLocaleString('en-US'), padL - 6, y + 4);
  }
  const slot = cw / months.length;
  const bw = Math.min(26, slot / 3.4);
  months.forEach((m, i) => {
    const cx = padL + slot * i + slot / 2;
    const ih = (m.income / max) * ch;
    const sh = (m.spending / max) * ch;
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(cx - bw - 2, padT + ch - ih, bw, ih);
    ctx.fillStyle = '#0c1a2e';
    ctx.fillRect(cx + 2, padT + ch - sh, bw, sh);
    ctx.fillStyle = '#16283f';
    ctx.textAlign = 'center';
    ctx.fillText(m.month, cx, h - 8);
    ctx.fillStyle = '#0f766e';
    ctx.fillText('$' + Math.round(m.income / 100) / 10 + 'k', cx - bw / 2 - 2, padT + ch - ih - 5);
    ctx.fillStyle = '#5b6b7d';
    ctx.fillText('$' + Math.round(m.spending / 100) / 10 + 'k', cx + bw / 2 + 2, padT + ch - sh - 5);
  });
}

// A progress ring: teal arc over a light track, percent in the middle.
export function drawRing(canvas, fraction, centerLabel) {
  const fit = fitCanvas(canvas);
  if (!fit) return;
  const { ctx, w, h } = fit;
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 12;
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 13;
  ctx.strokeStyle = '#e8eef3';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  const f = Math.max(0, Math.min(1, fraction));
  ctx.strokeStyle = '#14b8a6';
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); ctx.stroke();
  ctx.fillStyle = '#16283f';
  ctx.font = '800 24px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(f * 100) + '%', cx, cy + 2);
  ctx.fillStyle = '#5b6b7d';
  ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(centerLabel, cx, cy + 22);
}
