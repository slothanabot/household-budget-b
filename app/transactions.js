// DompetKeluarga transactions: the full ledger for the month — add, edit and
// delete entries, search by note, filter by category, and watch the running
// balance move with every change.

import { CATEGORIES, catById, money, fmtDate, saveState, nextId } from './data.js';

let query = '';
let filterCat = 'all';
let editingId = null;

export function render(app, state) {
  const sorted = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const shown = sorted.filter((t) => {
    if (filterCat !== 'all' && t.category !== filterCat) return false;
    if (query && !t.note.toLowerCase().includes(query)) return false;
    return true;
  });
  const balance = state.transactions.reduce((s, t) => s + (t.category === 'income' ? t.amount : -t.amount), 0);
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;

  app.innerHTML = `
  <section class="card">
    <div class="row"><h2>Transactions — November 2026</h2><span class="small">Running balance: <b class="${balance >= 0 ? 'pos' : 'neg'}">${money(balance)}</b></span></div>
    <div class="toolbar" style="margin:12px 0">
      <div><label for="q">Search</label><input type="search" id="q" placeholder="Search notes, e.g. groceries" value="${query}"></div>
      <div><label for="fcat">Category</label><select id="fcat">
        <option value="all">All categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${filterCat === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
      </select></div>
    </div>
    <p class="small muted">${shown.length} of ${state.transactions.length} entries shown.</p>
    <table class="responsive">
      <thead><tr><th>Date</th><th>Category</th><th>Note</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>
      ${shown.map((t) => {
        const c = catById(t.category);
        const isIncome = t.category === 'income';
        return `<tr>
          <td>${fmtDate(t.date)}</td>
          <td><span class="cat-dot" style="background:${c.color}"></span>${c.label}</td>
          <td>${t.note}</td>
          <td class="num ${isIncome ? 'pos' : 'neg'}">${isIncome ? '+' : '−'}${money(t.amount)}</td>
          <td class="num"><button class="link-btn" data-edit="${t.id}" type="button">Edit</button> · <button class="link-btn" data-del="${t.id}" type="button">Delete</button></td>
        </tr>`;
      }).join('') || '<tr><td colspan="5" class="muted">Nothing matches — clear the search or pick another category.</td></tr>'}
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <form id="tx-form">
      <div class="form-grid">
        <div><label for="fdate">Date</label><input type="date" id="fdate" required value="${editing ? editing.date : '2026-11-26'}"></div>
        <div><label for="fcat2">Category</label><select id="fcat2">
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${editing && editing.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
        </select></div>
        <div><label for="famt">Amount ($)</label><input type="number" id="famt" min="0.01" step="0.01" required value="${editing ? editing.amount : ''}" placeholder="0.00"></div>
        <div class="wide"><label for="fnote">Note</label><input type="text" id="fnote" required maxlength="80" value="${editing ? editing.note.replace(/"/g, '&quot;') : ''}" placeholder="What was this for?"></div>
      </div>
      <p style="margin-top:12px"><button class="btn btn-primary" type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
      ${editing ? '<button class="btn" id="cancel-edit" type="button">Cancel</button>' : ''}</p>
    </form>
  </section>`;

  app.querySelector('#q').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); render(app, state); const q = app.querySelector('#q'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); });
  app.querySelector('#fcat').addEventListener('change', (e) => { filterCat = e.target.value; render(app, state); });
  app.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => { editingId = b.dataset.edit; render(app, state); }));
  app.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    const t = state.transactions.find((x) => x.id === b.dataset.del);
    if (t && window.confirm('Delete "' + t.note + '" (' + money(t.amount) + ')?')) {
      state.transactions = state.transactions.filter((x) => x.id !== b.dataset.del);
      if (editingId === b.dataset.del) editingId = null;
      saveState(state);
      render(app, state);
    }
  }));
  const cancel = app.querySelector('#cancel-edit');
  if (cancel) cancel.addEventListener('click', () => { editingId = null; render(app, state); });
  app.querySelector('#tx-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const row = {
      date: app.querySelector('#fdate').value,
      category: app.querySelector('#fcat2').value,
      amount: Math.round(Number(app.querySelector('#famt').value) * 100) / 100,
      note: app.querySelector('#fnote').value.trim(),
    };
    if (!row.date || !row.amount || !row.note) return;
    if (editing) {
      Object.assign(editing, row);
      editingId = null;
    } else {
      state.transactions.push({ id: nextId(state), ...row });
    }
    saveState(state);
    render(app, state);
  });
}
