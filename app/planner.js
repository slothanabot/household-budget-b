// DompetKeluarga weekly planner: a daily spending target for each day of the
// current week, next to what the family actually spent that day. Targets are
// editable and saved; actuals come straight from the transactions.

import { money, weekStart, dayKey, saveState } from './data.js';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function render(app, state) {
  const now = new Date();
  const start = weekStart(now);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const actual = days.map((d) => state.transactions
    .filter((t) => t.category !== 'income' && t.date === dayKey(d))
    .reduce((s, t) => s + t.amount, 0));
  const totalTarget = state.weekTargets.reduce((s, v) => s + v, 0);
  const totalActual = actual.reduce((s, v) => s + v, 0);
  const remaining = totalTarget - totalActual;

  app.innerHTML = `
  <section class="card">
    <div class="row"><h2>Week of ${days[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${days[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
    <span class="small muted">Targets are editable — change a number and it saves.</span></div>
    <p class="muted">A household of four plans its spending a week at a time. Weekends cost more (family outings, the big shop), weekdays stay lean. Actuals are counted from the transactions you record.</p>
    ${days.map((d, i) => {
      const pct = state.weekTargets[i] ? Math.min(100, Math.round((actual[i] / state.weekTargets[i]) * 100)) : 0;
      const over = actual[i] > state.weekTargets[i];
      const isToday = dayKey(d) === dayKey(now);
      return `<div class="day-row">
        <span class="day-name">${DAY_SHORT[i]}${isToday ? ' ★' : ''}<span class="day-date">${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
        <span><span class="bar-track" style="display:block"><span class="bar-fill ${over ? 'over' : ''}" style="display:block;width:${pct}%"></span></span></span>
        <span class="num ${over ? 'neg' : ''}">${money(actual[i])} <span class="muted small">spent</span></span>
        <span class="num hide-phone muted small">of ${money(state.weekTargets[i])}</span>
        <span class="num"><label class="small muted" for="target-${i}" style="display:block">Target $</label><input type="number" id="target-${i}" min="0" step="5" value="${state.weekTargets[i]}" data-day="${i}"></span>
      </div>`;
    }).join('')}
    <div class="day-total" style="margin-top:14px"><span>Week total</span><span>Spent <b>${money(totalActual)}</b> of <b>${money(totalTarget)}</b> planned</span><span>${remaining >= 0 ? 'Left: <b>' + money(remaining) + '</b>' : 'Over by <b>' + money(-remaining) + '</b>'}</span></div>
  </section>

  <section class="grid-2-even">
    <div class="card">
      <h2>How the week is built</h2>
      <p><b>Groceries $310</b> — one big shop on Saturday, a top-up on Wednesday. The Saturday shop is the week's biggest single spend.</p>
      <p><b>Transport $105</b> — fuel on Monday and Friday, kids' bus passes on the 13th.</p>
      <p><b>Fun $50</b> — one family outing, usually Saturday afternoon. If the week runs over, fun is the first thing trimmed, never groceries.</p>
    </div>
    <div class="card callout">
      <h2>Planner tip</h2>
      <p>Last week the family spent <b>$486</b> against a $540 plan — <b>$54 under</b>. The leftover rolled straight into the Holiday jar. A plan that ends under budget is a win, not a failure to spend.</p>
      <p style="margin-bottom:0">Tip: set Sunday's target low. Sunday is a cook-at-home day, and the fridge is already full from Saturday.</p>
    </div>
  </section>`;

  app.querySelectorAll('input[data-day]').forEach((input) => {
    input.addEventListener('change', () => {
      const i = Number(input.dataset.day);
      const v = Math.max(0, Number(input.value) || 0);
      state.weekTargets[i] = v;
      saveState(state);
      render(app, state);
    });
  });
}
