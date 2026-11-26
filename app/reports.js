// DompetKeluarga reports: six months of income vs spending on a bar chart,
// the month's biggest categories, a month-by-month table, and a plain-text
// summary the family can copy or download.

import { MONTHLY_HISTORY, money, money0, spendingByCategory, catById, monthIncome, monthSpending } from './data.js';
import { drawIncomeSpending } from './charts.js';

const MONTH = '2026-11';

function buildSummary(state) {
  const income = monthIncome(state, MONTH);
  const spending = monthSpending(state, MONTH);
  const cats = spendingByCategory(state, MONTH);
  const lines = [
    'DOMPETKELUARGA — MONTHLY SUMMARY — NOVEMBER 2026',
    'The Hartono Family (4 people)',
    '',
    'Income:   ' + money(income),
    'Spending: ' + money(spending),
    'Saved:    ' + money(income - spending) + ' (' + Math.round(((income - spending) / income) * 100) + '% savings rate)',
    '',
    'SPENDING BY CATEGORY',
  ];
  for (const c of cats) {
    lines.push('- ' + catById(c.id).label + ': ' + money(c.amount) + ' (' + Math.round((c.amount / spending) * 100) + '%)');
  }
  lines.push('', 'SIX-MONTH TREND (income vs spending)');
  for (const m of MONTHLY_HISTORY) {
    lines.push('- ' + m.month + ': ' + money0(m.income) + ' in, ' + money0(m.spending) + ' out, saved ' + money0(m.income - m.spending));
  }
  lines.push('', 'Savings jars: ' + state.jars.map((j) => j.name + ' ' + money(j.saved) + '/' + money(j.goal)).join('; '));
  return lines.join('\n');
}

export function render(app, state) {
  const spending = monthSpending(state, MONTH);
  const cats = spendingByCategory(state, MONTH);
  const summary = buildSummary(state);

  app.innerHTML = `
  <section class="card">
    <div class="row"><h2>Income vs spending — last 6 months</h2>
    <span class="legend"><span><i style="background:#14b8a6"></i>Income</span><span><i style="background:#0c1a2e"></i>Spending</span></span></div>
    <canvas class="chart" id="trend-chart" width="800" height="260"></canvas>
    <p class="small muted">November is the strongest month yet: $2,031 saved, a 42% savings rate. September was the weakest — the car service ($410) pushed spending to $4,350.</p>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Where November's money went</h2>
      ${cats.map((c) => {
        const pct = Math.round((c.amount / spending) * 100);
        return `<div style="margin-bottom:12px"><div class="row"><span><span class="cat-dot" style="background:${catById(c.id).color}"></span>${catById(c.id).label}</span><span class="strong">${money(c.amount)} · ${pct}%</span></div>
        <div class="bar-track" style="margin-top:5px"><div class="bar-fill" style="width:${pct}%;background:${catById(c.id).color}"></div></div></div>`;
      }).join('')}
    </div>
    <div class="card">
      <h2>Month by month</h2>
      <table>
        <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Saved</th></tr></thead>
        <tbody>
        ${MONTHLY_HISTORY.map((m) => `<tr><td>${m.month} 2026</td><td class="num">${money(m.income)}</td><td class="num">${money(m.spending)}</td><td class="num ${m.income - m.spending >= 0 ? 'pos' : 'neg'}">${money(m.income - m.spending)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="small muted" style="margin-top:10px">Six-month average saving: <b class="strong">${money(MONTHLY_HISTORY.reduce((s, m) => s + m.income - m.spending, 0) / MONTHLY_HISTORY.length)}</b> a month.</p>
    </div>
  </section>

  <section class="card">
    <h2>Export the summary</h2>
    <p class="muted small">Plain text, ready to paste into a message or print for the fridge door.</p>
    <textarea class="summary" id="summary-text" readonly>${summary}</textarea>
    <p style="margin-top:12px"><button class="btn btn-primary" id="copy-summary" type="button">Copy summary</button>
    <a class="btn" id="dl-summary" href="data:text/plain;charset=utf-8,${encodeURIComponent(summary)}" download="dompetkeluarga-november-2026.txt">Download .txt</a>
    <span class="small muted" id="copy-note"></span></p>
  </section>`;

  drawIncomeSpending(document.getElementById('trend-chart'), MONTHLY_HISTORY);
  app.querySelector('#copy-summary').addEventListener('click', () => {
    const ta = app.querySelector('#summary-text');
    const note = app.querySelector('#copy-note');
    const done = () => { note.textContent = 'Copied to clipboard.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); document.execCommand('copy'); done(); });
    } else {
      ta.select();
      document.execCommand('copy');
      done();
    }
  });
}
