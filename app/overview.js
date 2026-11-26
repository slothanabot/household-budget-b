// DompetKeluarga overview: cash-flow summary, this week's spending,
// upcoming bills, savings ring and the latest transactions.

import { FAMILY, money, monthIncome, monthSpending, spendingByCategory, upcomingBills, weekStart, dayKey, catById } from './data.js';
import { drawRing } from './charts.js';

const MONTH = '2026-11';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function render(app, state) {
  const income = monthIncome(state, MONTH);
  const spending = monthSpending(state, MONTH);
  const saved = income - spending;
  const jarsSaved = state.jars.reduce((s, j) => s + j.saved, 0);
  const jarsGoal = state.jars.reduce((s, j) => s + j.goal, 0);

  const now = new Date();
  const start = weekStart(now);
  const weekDays = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const weekActual = weekDays.map((d) => state.transactions
    .filter((t) => t.category !== 'income' && t.date === dayKey(d))
    .reduce((s, t) => s + t.amount, 0));
  const weekSpent = weekActual.reduce((s, v) => s + v, 0);
  const weekTarget = state.weekTargets.reduce((s, v) => s + v, 0);
  const weekPct = weekTarget ? Math.min(100, Math.round((weekSpent / weekTarget) * 100)) : 0;

  const bills = upcomingBills(now, 14);
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 5);
  const topCats = spendingByCategory(state, MONTH).slice(0, 3);

  app.innerHTML = `
  <section class="grid-4">
    <div class="card"><p class="stat-label">Income in November</p><p class="stat-value pos">${money(income)}</p><p class="stat-sub">Salary $4,200 + freelance $650</p></div>
    <div class="card"><p class="stat-label">Spent so far</p><p class="stat-value">${money(spending)}</p><p class="stat-sub">${money(FAMILY.monthlyIncome - spending)} of income still unspent</p></div>
    <div class="card"><p class="stat-label">Saved this month</p><p class="stat-value teal">${money(saved)}</p><p class="stat-sub">${Math.round((saved / income) * 100)}% savings rate</p></div>
    <div class="card"><p class="stat-label">In savings jars</p><p class="stat-value">${money(jarsSaved)}</p><p class="stat-sub">across ${state.jars.length} jars, goal ${money(jarsGoal)}</p></div>
  </section>

  <section class="grid-2">
    <div class="card">
      <div class="row"><h2>This week</h2><span class="small muted">${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
      <p class="muted small">Spent <b class="strong">${money(weekSpent)}</b> of a <b class="strong">${money(weekTarget)}</b> weekly plan (${weekPct}%).</p>
      <div class="bar-track" style="margin:6px 0 14px"><div class="bar-fill ${weekPct > 100 ? 'over' : ''}" style="width:${weekPct}%"></div></div>
      ${weekDays.map((d, i) => `
        <div class="row"><span>${DAY_NAMES[i]} <span class="muted small">${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
        <span class="small">${money(weekActual[i])} <span class="muted">/ ${money(state.weekTargets[i])} planned</span></span></div>`).join('')}
      <p style="margin-top:14px"><a href="#/planner">Adjust the weekly plan &rarr;</a></p>
    </div>
    <div class="card">
      <h2>Upcoming bills</h2>
      ${bills.map((b) => {
        const dueIn = Math.round((b.due - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
        const label = dueIn === 0 ? 'Due today' : dueIn === 1 ? 'Due tomorrow' : 'Due in ' + dueIn + ' days';
        return `<div class="bill ${dueIn <= 3 ? 'soon' : ''}"><span>${b.name}</span><span class="due">${label}</span><span class="amt">${money(b.amount)}</span></div>`;
      }).join('')}
      <p class="small muted" style="margin-top:12px">Next 14 days: <b class="strong">${money(bills.reduce((s, b) => s + b.amount, 0))}</b> due. Rent lands on the 1st.</p>
    </div>
  </section>

  <section class="grid-2">
    <div class="card ring-wrap">
      <h2 style="text-align:left">Savings progress</h2>
      <canvas class="ring" id="savings-ring" width="150" height="150"></canvas>
      <p class="small muted" style="margin-top:10px">${money(jarsSaved)} of ${money(jarsGoal)} saved across all jars.</p>
      <p><a href="#/savings">Open the savings jars &rarr;</a></p>
    </div>
    <div class="card">
      <h2>Latest transactions</h2>
      ${recent.map((t) => {
        const c = catById(t.category);
        const sign = t.category === 'income' ? '+' : '−';
        return `<div class="row"><span><span class="cat-dot" style="background:${c.color}"></span>${t.note}</span><span class="${t.category === 'income' ? 'pos' : 'neg'} strong">${sign}${money(t.amount)}</span></div>`;
      }).join('')}
      <p style="margin-top:12px"><a href="#/transactions">See all transactions &rarr;</a></p>
      <p class="small muted">Top spending so far: ${topCats.map((c) => catById(c.id).label + ' ' + money(c.amount)).join(' · ')}.</p>
    </div>
  </section>`;
  drawRing(document.getElementById('savings-ring'), jarsSaved / jarsGoal, 'of goal');
}
