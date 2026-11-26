// DompetKeluarga router: hash routes for the five sections, one view module
// per section. Each view renders into #app and mounts its own controls and
// canvases. window.__shotReady tells a screenshot script the page is drawn.
//
//   #/                Overview
//   #/planner         Weekly Planner
//   #/transactions    Transactions
//   #/reports         Reports
//   #/savings         Savings

import { loadState, resetState, monthSpending, money, FAMILY } from './data.js';
import { render as renderOverview } from './overview.js';
import { render as renderPlanner } from './planner.js';
import { render as renderTransactions } from './transactions.js';
import { render as renderReports } from './reports.js';
import { render as renderSavings } from './savings.js';

const app = document.getElementById('app');
const titleEl = document.getElementById('page-title');
const subtitleEl = document.getElementById('page-subtitle');
const sideLeft = document.getElementById('side-left');

const ROUTES = {
  '': { title: 'Overview', render: renderOverview },
  planner: { title: 'Weekly Planner', render: renderPlanner },
  transactions: { title: 'Transactions', render: renderTransactions },
  reports: { title: 'Reports', render: renderReports },
  savings: { title: 'Savings', render: renderSavings },
};

let state = loadState();

function refreshSideCard() {
  const left = FAMILY.monthlyIncome - monthSpending(state, '2026-11');
  sideLeft.textContent = money(left);
}

function render() {
  window.__shotReady = false;
  const route = (location.hash.replace(/^#\/?/, '').split('/')[0] || '');
  const found = ROUTES[route];
  document.querySelectorAll('[data-route]').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  if (found) {
    titleEl.textContent = found.title;
    subtitleEl.textContent = FAMILY.name + ' · ' + FAMILY.monthLabel;
    document.title = found.title + ' — DompetKeluarga';
    found.render(app, state);
  } else {
    titleEl.textContent = 'Not found';
    subtitleEl.textContent = FAMILY.name + ' · ' + FAMILY.monthLabel;
    document.title = 'Not found — DompetKeluarga';
    app.innerHTML = '<section class="card"><h2>That page does not exist</h2><p class="muted">Try one of the sections in the navigation.</p><p><a href="#/">Back to Overview &rarr;</a></p></section>';
  }
  refreshSideCard();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

document.getElementById('reset-demo').addEventListener('click', () => {
  if (window.confirm('Reset all data back to the November demo figures?')) {
    state = resetState();
    render();
  }
});

window.addEventListener('hashchange', render);
render();
