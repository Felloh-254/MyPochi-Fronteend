// Shown when the API can't be reached (e.g. the Go backend doesn't have
// these routes yet), so the UI is never just a blank/broken screen during
// development. Shaped identically to what the real API is expected to
// return. Amounts are in KES.

export const DEMO_ACCOUNTS = [
  { id: 1, name: 'M-Pesa', type: 'mpesa', color: '#37C871', starting_balance: 8400 },
  { id: 2, name: 'Equity Bank', type: 'bank', color: '#7C6FEE', starting_balance: 64000 },
  { id: 3, name: 'Cash', type: 'cash', color: '#F5A623', starting_balance: 2200 },
  { id: 4, name: 'Savings', type: 'savings', color: '#2DD4BF', starting_balance: 150000 },
]

export const DEMO_BUDGETS = [
  { id: 1, name: 'Groceries', category: 'Food', color: '#7C6FEE', amount: 18000, spent: 12400 },
  { id: 2, name: 'Dining out', category: 'Food', color: '#F0576B', amount: 8000, spent: 8650 },
  { id: 3, name: 'Transport', category: 'Travel', color: '#2DD4BF', amount: 6000, spent: 3900 },
  { id: 4, name: 'Entertainment', category: 'Leisure', color: '#F5A623', amount: 4000, spent: 1650 },
  { id: 5, name: 'Rent', category: 'Housing', color: '#5B4FD1', amount: 35000, spent: 35000 },
]

export const DEMO_TRANSACTIONS = [
  { id: 1, title: 'Salary — Nimbus Labs', amount: 120000, type: 'income', category: 'Salary', account_id: 2, date: '2026-07-01', note: '' },
  { id: 2, title: 'Naivas Supermarket', amount: 3450, type: 'expense', category: 'Food', account_id: 1, date: '2026-07-03', note: 'Weekly groceries' },
  { id: 3, title: 'Uber', amount: 620, type: 'expense', category: 'Travel', account_id: 1, date: '2026-07-04', note: '' },
  { id: 4, title: 'Freelance — logo design', amount: 18000, type: 'income', category: 'Freelance', account_id: 2, date: '2026-07-05', note: '' },
  { id: 5, title: 'Rent — July', amount: 35000, type: 'expense', category: 'Housing', account_id: 2, date: '2026-07-01', note: '' },
  { id: 6, title: 'Netflix', amount: 1100, type: 'expense', category: 'Leisure', account_id: 1, date: '2026-07-06', note: 'Monthly subscription' },
  { id: 7, title: 'Carrefour', amount: 2650, type: 'expense', category: 'Food', account_id: 3, date: '2026-07-08', note: '' },
  { id: 8, title: 'Java House', amount: 1840, type: 'expense', category: 'Food', account_id: 1, date: '2026-07-10', note: 'Dinner with friends' },
  { id: 9, title: 'Fuel — Shell', amount: 3200, type: 'expense', category: 'Travel', account_id: 3, date: '2026-07-11', note: '' },
  { id: 10, title: 'Cinema tickets', amount: 1400, type: 'expense', category: 'Leisure', account_id: 1, date: '2026-07-12', note: '' },
  { id: 11, title: 'Dividend — money market fund', amount: 2100, type: 'income', category: 'Investing', account_id: 4, date: '2026-07-13', note: '' },
  { id: 12, title: 'Matatu fare', amount: 800, type: 'expense', category: 'Travel', account_id: 1, date: '2026-07-14', note: 'Monthly pass' },
  { id: 13, title: 'Transfer to savings', amount: 10000, type: 'transfer', category: '', account_id: 2, from_account_id: 2, to_account_id: 4, date: '2026-07-15', note: 'Moving to emergency fund' },
]

export const DEMO_MONTHLY_DATA = [
  { month: '2026-02', income: 118000, expense: 82000 },
  { month: '2026-03', income: 121000, expense: 89000 },
  { month: '2026-04', income: 115000, expense: 76000 },
  { month: '2026-05', income: 138000, expense: 94000 },
  { month: '2026-06', income: 124000, expense: 85000 },
  { month: '2026-07', income: 140100, expense: 99310 },
]

export const DEMO_BUDGET_HISTORY = [
  { period: '2026-02-01', budgeted: 68000, spent: 61000 },
  { period: '2026-03-01', budgeted: 69000, spent: 72000 },
  { period: '2026-04-01', budgeted: 69000, spent: 58000 },
  { period: '2026-05-01', budgeted: 71000, spent: 76000 },
  { period: '2026-06-01', budgeted: 71000, spent: 65000 },
  { period: '2026-07-01', budgeted: 71000, spent: 61600 },
]

export const DEMO_RECURRING = [
  { id: 1, title: 'Rent', amount: 35000, type: 'expense', category: 'Housing', account_id: 2, frequency: 'monthly', next_run: '2026-08-01', is_active: true },
  { id: 2, title: 'Salary — Nimbus Labs', amount: 120000, type: 'income', category: 'Salary', account_id: 2, frequency: 'monthly', next_run: '2026-08-01', is_active: true },
  { id: 3, title: 'Netflix', amount: 1100, type: 'expense', category: 'Leisure', account_id: 1, frequency: 'monthly', next_run: '2026-07-28', is_active: true },
  { id: 4, title: 'Gym membership', amount: 4500, type: 'expense', category: 'Health', account_id: 1, frequency: 'monthly', next_run: '2026-08-03', is_active: true },
  { id: 5, title: 'Weekly savings top-up', amount: 2000, type: 'expense', category: 'Savings', account_id: 4, frequency: 'weekly', next_run: '2026-07-27', is_active: false },
]

export const DEMO_GOALS = [
  { id: 1, name: 'Emergency fund', target_amount: 200000, current_amount: 96000, deadline: '2026-12-31', color: '#37C871' },
  { id: 2, name: 'New laptop', target_amount: 130000, current_amount: 41000, deadline: '2026-10-15', color: '#7C6FEE' },
  { id: 3, name: 'Trip to Zanzibar', target_amount: 80000, current_amount: 80000, deadline: '2026-09-01', color: '#F5A623' },
]
