// Shown when the API can't be reached (e.g. the Go backend isn't running
// yet, or doesn't have these routes yet), so the UI is never just a
// blank/broken screen during development. Shaped identically to what the
// real API is expected to return.

export const DEMO_ACCOUNTS = [
  { id: 1, name: 'M-Pesa', type: 'mpesa', color: '#37C871', starting_balance: 420 },
  { id: 2, name: 'Equity Bank', type: 'bank', color: '#7C6FEE', starting_balance: 2100 },
  { id: 3, name: 'Cash', type: 'cash', color: '#F5A623', starting_balance: 60 },
  { id: 4, name: 'Savings', type: 'savings', color: '#2DD4BF', starting_balance: 5000 },
]

export const DEMO_BUDGETS = [
  { id: 1, name: 'Groceries', category: 'Food', color: '#7C6FEE', amount: 500, spent: 340 },
  { id: 2, name: 'Dining out', category: 'Food', color: '#F0576B', amount: 200, spent: 214 },
  { id: 3, name: 'Transport', category: 'Travel', color: '#2DD4BF', amount: 150, spent: 96 },
  { id: 4, name: 'Entertainment', category: 'Leisure', color: '#F5A623', amount: 100, spent: 41 },
  { id: 5, name: 'Rent', category: 'Housing', color: '#5B4FD1', amount: 1200, spent: 1200 },
]

export const DEMO_TRANSACTIONS = [
  { id: 1, title: 'Salary — Nimbus Labs', amount: 4200, type: 'income', category: 'Salary', account_id: 2, date: '2026-07-01', note: '' },
  { id: 2, title: 'Whole Foods Market', amount: 86.32, type: 'expense', category: 'Food', account_id: 1, date: '2026-07-03', note: 'Weekly groceries' },
  { id: 3, title: 'Uber', amount: 18.4, type: 'expense', category: 'Travel', account_id: 1, date: '2026-07-04', note: '' },
  { id: 4, title: 'Freelance — logo design', amount: 650, type: 'income', category: 'Freelance', account_id: 2, date: '2026-07-05', note: '' },
  { id: 5, title: 'Rent — July', amount: 1200, type: 'expense', category: 'Housing', account_id: 2, date: '2026-07-01', note: '' },
  { id: 6, title: 'Netflix', amount: 15.49, type: 'expense', category: 'Leisure', account_id: 1, date: '2026-07-06', note: 'Monthly subscription' },
  { id: 7, title: "Trader Joe's", amount: 52.1, type: 'expense', category: 'Food', account_id: 3, date: '2026-07-08', note: '' },
  { id: 8, title: 'The Local Bistro', amount: 74.0, type: 'expense', category: 'Food', account_id: 1, date: '2026-07-10', note: 'Dinner with friends' },
  { id: 9, title: 'Gas — Shell', amount: 44.6, type: 'expense', category: 'Travel', account_id: 3, date: '2026-07-11', note: '' },
  { id: 10, title: 'Movie tickets', amount: 26.0, type: 'expense', category: 'Leisure', account_id: 1, date: '2026-07-12', note: '' },
  { id: 11, title: 'Dividend — index fund', amount: 38.2, type: 'income', category: 'Investing', account_id: 4, date: '2026-07-13', note: '' },
  { id: 12, title: 'Metro pass', amount: 33.0, type: 'expense', category: 'Travel', account_id: 1, date: '2026-07-14', note: 'Monthly' },
]

export const DEMO_MONTHLY_DATA = [
  { month: '2026-02', income: 4650, expense: 3210 },
  { month: '2026-03', income: 4700, expense: 3480 },
  { month: '2026-04', income: 4200, expense: 2990 },
  { month: '2026-05', income: 5100, expense: 3620 },
  { month: '2026-06', income: 4830, expense: 3340 },
  { month: '2026-07', income: 4888, expense: 3891 },
]
