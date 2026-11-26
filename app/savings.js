// DompetKeluarga savings: four jars with add-money controls, and the 52-week
// challenge — deposit the week number each week ($1, $2 ... $52) and watch
// $1,378 appear by the end of the year. Tap a week to mark it done.

import { money, CHALLENGE_TOTAL, weekOfYear, saveState } from './data.js';

export function render(app, state) {
  const jarsSaved = state.jars.reduce((s, j) => s + j.saved, 0);
  const jarsGoal = state.jars.reduce((s, j) => s + j.goal, 0);
  const currentWeek = weekOfYear(new Date());
  const done = state.challengeDone;
  const deposited = done.reduce((s, w) => s + w, 0);

  app.innerHTML = `
  <section class="card">
    <div class="row"><h2>Savings jars</h2><span class="small muted">${money(jarsSaved)} of ${money(jarsGoal)} saved (${Math.round((jarsSaved / jarsGoal) * 100)}%)</span></div>
    <div class="grid-2-even">
      ${state.jars.map((j) => {
        const pct = Math.min(100, Math.round((j.saved / j.goal) * 100));
        return `<div class="card jar" style="border:1px solid var(--line)">
          <div class="jar-head"><h3>${j.name}</h3><span class="jar-amt">${money(j.saved)} <span class="muted small">/ ${money(j.goal)}</span></span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <p class="small muted" style="margin:0">${j.note}</p>
          <p class="small" style="margin:0">${pct}% there — ${money(j.goal - j.saved)} to go.</p>
          <p style="margin:6px 0 0"><button class="btn btn-sm" data-jar="${j.id}" data-amt="25" type="button">+$25</button>
          <button class="btn btn-sm" data-jar="${j.id}" data-amt="50" type="button">+$50</button>
          <button class="btn btn-sm" data-jar="${j.id}" data-amt="100" type="button">+$100</button></p>
        </div>`;
      }).join('')}
    </div>
    <form id="jar-form" style="margin-top:16px">
      <div class="form-grid">
        <div><label for="jar-sel">Add to jar</label><select id="jar-sel">
          ${state.jars.map((j) => `<option value="${j.id}">${j.name} (${money(j.saved)} / ${money(j.goal)})</option>`).join('')}
        </select></div>
        <div><label for="jar-amt">Amount ($)</label><input type="number" id="jar-amt" min="1" step="1" required value="50"></div>
        <div style="align-self:end"><button class="btn btn-primary" type="submit">Add money</button></div>
      </div>
    </form>
  </section>

  <section class="card">
    <div class="row"><h2>The 52-week challenge</h2><span class="small muted">Week ${currentWeek} of 52</span></div>
    <p class="muted">Deposit the week number each week — $1 in week 1, $2 in week 2, all the way to $52 in week 52. Small at first, <b class="strong">$1,378</b> by New Year's Eve. Tap a week to mark it paid.</p>
    <p><b class="strong">${money(deposited)}</b> deposited so far of <b class="strong">${money(CHALLENGE_TOTAL)}</b> (${done.length} of 52 weeks done).</p>
    <div class="bar-track" style="margin-bottom:14px"><div class="bar-fill" style="width:${Math.round((deposited / CHALLENGE_TOTAL) * 100)}%"></div></div>
    <div class="challenge-grid">
      ${Array.from({ length: 52 }, (_, i) => {
        const w = i + 1;
        const isDone = done.includes(w);
        const cls = 'week-cell' + (isDone ? ' done' : '') + (w === currentWeek ? ' current' : '');
        return `<button type="button" class="${cls}" data-week="${w}" title="Week ${w} — deposit $${w}">${w}</button>`;
      }).join('')}
    </div>
    <p class="small muted" style="margin-top:12px">Weeks 1–${done.length} are done. This week (week ${currentWeek}) costs $${currentWeek} — the price of one takeaway coffee each.</p>
  </section>`;

  app.querySelectorAll('[data-jar]').forEach((b) => b.addEventListener('click', () => {
    const jar = state.jars.find((j) => j.id === b.dataset.jar);
    if (jar) { jar.saved += Number(b.dataset.amt); saveState(state); render(app, state); }
  }));
  app.querySelector('#jar-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const jar = state.jars.find((j) => j.id === app.querySelector('#jar-sel').value);
    const amt = Math.max(1, Math.round(Number(app.querySelector('#jar-amt').value) || 0));
    if (jar && amt > 0) { jar.saved += amt; saveState(state); render(app, state); }
  });
  app.querySelectorAll('[data-week]').forEach((b) => b.addEventListener('click', () => {
    const w = Number(b.dataset.week);
    const i = state.challengeDone.indexOf(w);
    if (i >= 0) state.challengeDone.splice(i, 1);
    else state.challengeDone.push(w);
    state.challengeDone.sort((a, b2) => a - b2);
    saveState(state);
    render(app, state);
  }));
}
