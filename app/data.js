// DompetKeluarga data: the Hartono family's seed figures, categories, bills,
// savings jars and the 52-week challenge. State lives in localStorage so a
// household's edits survive a reload; "Reset demo data" restores this seed.

export const FAMILY = {
  name: 'The Hartono Family',
  members: 4,
  monthLabel: 'November 2026',
  monthlyIncome: 4850,
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#14b8a6' },
  { id: 'rent', label: 'Rent & Housing', color: '#3b82f6' },
  { id: 'utilities', label: 'Utilities', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', color: '#8b5cf6' },
  { id: 'dining', label: 'Dining Out', color: '#ef4444' },
  { id: 'kids', label: 'Kids & School', color: '#ec4899' },
  { id: 'health', label: 'Health', color: '#10b981' },
  { id: 'fun', label: 'Fun & Leisure', color: '#f97316' },
  { id: 'income', label: 'Income', color: '#22c55e' },
  { id: 'other', label: 'Other', color: '#64748b' },
];

export function catById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export const MONTHLY_HISTORY = [
  { month: 'Jun', income: 4700, spending: 3980 },
  { month: 'Jul', income: 4850, spending: 4210 },
  { month: 'Aug', income: 4850, spending: 3890 },
  { month: 'Sep', income: 4920, spending: 4350 },
  { month: 'Oct', income: 4850, spending: 4120 },
  { month: 'Nov', income: 4850, spending: 2819 }, // matches the live November ledger ($2,818.55)
];

export const BILLS = [
  { name: 'Rent — 2-bed apartment', amount: 1450, day: 1 },
  { name: 'Phone plans (2 lines)', amount: 96, day: 8 },
  { name: 'Electricity', amount: 132, day: 12 },
  { name: 'Internet & TV', amount: 89, day: 15 },
  { name: 'Water', amount: 54, day: 18 },
  { name: 'Health insurance', amount: 310, day: 25 },
  { name: 'Car insurance', amount: 118, day: 28 },
];

export const SEED_JARS = [
  { id: 'emergency', name: 'Emergency Fund', saved: 2400, goal: 5000, note: '6 months of essentials, kept in a separate account.' },
  { id: 'holiday', name: 'Holiday Trip', saved: 850, goal: 1500, note: 'Beach week in December — flights already watched.' },
  { id: 'car', name: 'New Car', saved: 1200, goal: 8000, note: 'Replacing the 2012 hatchback next year.' },
  { id: 'education', name: 'Kids\u2019 Education', saved: 3100, goal: 10000, note: 'School fees and the eldest\u2019s piano lessons.' },
];

// Deposit the week number each week: $1 in week 1, $2 in week 2 ... $52 in week 52.
export const CHALLENGE_TOTAL = (52 * 53) / 2; // $1,378

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', category: 'income', amount: 4200, note: 'Salary — Dad (Rudi)' },
  { id: 't02', date: '2026-11-01', category: 'rent', amount: 1450, note: 'Rent — November' },
  { id: 't03', date: '2026-11-02', category: 'groceries', amount: 96.4, note: 'Weekly shop — supermarket' },
  { id: 't04', date: '2026-11-03', category: 'transport', amount: 42, note: 'Fuel — family car' },
  { id: 't05', date: '2026-11-04', category: 'kids', amount: 58, note: 'School books — Maya' },
  { id: 't06', date: '2026-11-05', category: 'dining', amount: 34.5, note: 'Pizza night' },
  { id: 't07', date: '2026-11-06', category: 'groceries', amount: 73.2, note: 'Fruit & veg market' },
  { id: 't08', date: '2026-11-07', category: 'fun', amount: 28, note: 'Cinema tickets (2 kids)' },
  { id: 't09', date: '2026-11-08', category: 'utilities', amount: 96, note: 'Phone plans (2 lines)' },
  { id: 't10', date: '2026-11-09', category: 'groceries', amount: 112.75, note: 'Weekly shop — supermarket' },
  { id: 't11', date: '2026-11-10', category: 'health', amount: 24.9, note: 'Pharmacy — vitamins' },
  { id: 't12', date: '2026-11-12', category: 'utilities', amount: 132, note: 'Electricity bill' },
  { id: 't13', date: '2026-11-13', category: 'transport', amount: 18.5, note: 'Bus passes — kids' },
  { id: 't14', date: '2026-11-14', category: 'income', amount: 650, note: 'Freelance design — Mum (Sari)' },
  { id: 't15', date: '2026-11-14', category: 'dining', amount: 47.8, note: 'Birthday dinner out' },
  { id: 't16', date: '2026-11-15', category: 'utilities', amount: 89, note: 'Internet & TV' },
  { id: 't17', date: '2026-11-16', category: 'groceries', amount: 88.6, note: 'Weekly shop — supermarket' },
  { id: 't18', date: '2026-11-17', category: 'kids', amount: 35, note: 'Football boots — Dimas' },
  { id: 't19', date: '2026-11-18', category: 'utilities', amount: 54, note: 'Water bill' },
  { id: 't20', date: '2026-11-19', category: 'transport', amount: 45, note: 'Fuel — family car' },
  { id: 't21', date: '2026-11-20', category: 'groceries', amount: 64.3, note: 'Mid-week top-up' },
  { id: 't22', date: '2026-11-21', category: 'fun', amount: 22, note: 'Board game for family night' },
  { id: 't23', date: '2026-11-23', category: 'groceries', amount: 104.2, note: 'Weekly shop — supermarket' },
  { id: 't24', date: '2026-11-24', category: 'kids', amount: 41, note: 'School lunch money — week' },
  { id: 't25', date: '2026-11-25', category: 'dining', amount: 29.9, note: 'Lunch with grandparents' },
  { id: 't26', date: '2026-11-26', category: 'health', amount: 31.5, note: 'Dentist check-up — Maya' },
];

export const SEED_WEEK_TARGETS = [70, 60, 80, 55, 90, 120, 65]; // Mon..Sun

const STORE_KEY = 'dompetkeluarga-v1';

function seedState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    jars: SEED_JARS.map((j) => ({ ...j })),
    weekTargets: [...SEED_WEEK_TARGETS],
    // Weeks 1-46 of the 52-week challenge are done; week 47 is this week.
    challengeDone: Array.from({ length: 46 }, (_, i) => i + 1),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.jars)) return seedState();
    return parsed;
  } catch (e) {
    return seedState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) { /* private mode: edits still work for the session */ }
}

export function resetState() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
  return seedState();
}

// --- money helpers ---------------------------------------------------------

export function money(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  const v = Number(n) || 0;
  return '$' + Math.round(v).toLocaleString('en-US');
}

// --- date helpers ----------------------------------------------------------

export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function fmtDate(s) {
  return parseDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Monday of the week containing `d`.
export function weekStart(d) {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const shift = (out.getDay() + 6) % 7; // Monday = 0
  out.setDate(out.getDate() - shift);
  return out;
}

export function dayKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ISO week number (1-53) for the 52-week challenge.
export function weekOfYear(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);
  const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const fday = (first.getUTCDay() + 6) % 7;
  first.setUTCDate(first.getUTCDate() - fday + 3);
  return 1 + Math.round((t - first) / (7 * 86400000));
}

// --- aggregates ------------------------------------------------------------

export function monthSpending(state, monthPrefix) {
  return state.transactions
    .filter((t) => t.category !== 'income' && t.date.startsWith(monthPrefix))
    .reduce((s, t) => s + t.amount, 0);
}

export function monthIncome(state, monthPrefix) {
  return state.transactions
    .filter((t) => t.category === 'income' && t.date.startsWith(monthPrefix))
    .reduce((s, t) => s + t.amount, 0);
}

export function spendingByCategory(state, monthPrefix) {
  const totals = new Map();
  for (const t of state.transactions) {
    if (t.category === 'income' || !t.date.startsWith(monthPrefix)) continue;
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// Bills whose next due date falls within `days` days from `now`.
export function upcomingBills(now, days) {
  const limit = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return BILLS.map((b) => {
    let due = new Date(now.getFullYear(), now.getMonth(), b.day);
    if (due < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      due = new Date(now.getFullYear(), now.getMonth() + 1, b.day);
    }
    return { ...b, due };
  })
    .filter((b) => b.due <= limit)
    .sort((a, b) => a.due - b.due);
}

export function nextId(state) {
  let n = state.transactions.length + 1;
  let id = 'u' + n;
  while (state.transactions.some((t) => t.id === id)) { n += 1; id = 'u' + n; }
  return id;
}
