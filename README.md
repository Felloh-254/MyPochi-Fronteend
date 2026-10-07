# MyPochi — frontend

A Vue 3 SPA for MyPochi, a personal finance app: accounts, budgets (by
month), recurring transactions, savings goals, insights, reports, and CSV
import — wired to a Go/Postgres API (see the companion `budgetapp`
backend project). Currency is KES throughout.

## Stack

- **Vue 3** — `<script setup>` SFCs throughout
- **Vue Router 4** — route-based views with an auth guard
- **Pinia** — one store per domain
- **Chart.js** + **vue-chartjs** — line, doughnut, and bar charts
- **PapaParse** — CSV parsing for the Import view (generic + M-Pesa statement format)
- **Vite** — dev server + build

## Features

- **Accounts** — M-Pesa, bank, cash, savings wallets; balance derived from starting balance + linked transactions
- **Budgets** — assigned per month, with a period switcher, "copy last month" action, and a budgeted-vs-spent comparison chart
- **Recurring transactions** — daily/weekly/monthly schedules (rent, salary, subscriptions), with a "post now" action that creates a real transaction and rolls the next run date forward
- **Goals** — target amount + deadline, progress ring, contributions that optionally post as a real transaction
- **Transactions** — full ledger, filterable by type, searchable, linked to an account
- **Insights** — savings rate, month-over-month spend, highest categories, spending by weekday — all derived client-side from existing data, no extra endpoints needed
- **Reports** — date-range CSV export, and a print-friendly report view (Print → Save as PDF)
- **Notifications** — budget-limit, upcoming-bill, and goal-deadline alerts, derived from the same stores (bell icon in the topbar)
- **Import** — upload a CSV; auto-detects a generic format or an M-Pesa statement export, lets you review/edit rows before bulk-importing

## Project layout

```
src/
  main.js               app entrypoint
  App.vue                 layout shell (sidebar + topbar + router-view) + global modal
  router/index.js          routes + auth guard
  stores/
    auth.js, accounts.js, budgets.js, transactions.js, recurring.js,
    goals.js, summary.js, notifications.js, ui.js
  services/
    api.js                 fetch wrapper — the only place that knows API routes
    chartSetup.js             Chart.js component registration
  components/              cards, rows, modals, Icon set, charts/
  views/                   Dashboard, Accounts, Budgets, Recurring, Goals,
                            Transactions, Insights, Reports, Import, Settings, Login
  utils/                   format, budget, period, recurring, goals, csvExport, csvImport
  styles/
    tokens.css               design tokens + shared primitives + print rules
```

## Setup

```bash
npm install
# Set VITE_API_URL and VITE_GOOGLE_CLIENT_ID in .env
npm run dev
```

The app does not include or generate sample account, transaction, budget,
recurring, or goal records. It loads those records from the configured API.
When a data request fails, the affected store is cleared and the error is
shown; the app does not switch to dummy data. Login and registration also
require the API.

## Build

```bash
npm run build     # outputs to dist/
npm run preview    # serve the production build locally
```

## Backend routes this frontend expects

Beyond the original auth/budgets/transactions/summary routes, these views
assume the backend exposes:

```
POST       /api/auth/google   { credential }
```

```
GET/POST   /api/accounts
PUT/DELETE /api/accounts/:id

GET        /api/budgets?period=YYYY-MM-01
GET        /api/budgets/history?months=6
POST       /api/budgets/copy   { from_period, to_period }

GET/POST   /api/recurring
PUT/DELETE /api/recurring/:id

GET/POST   /api/goals
PUT/DELETE /api/goals/:id
POST       /api/goals/:id/contribute   { amount }
```

Transactions now also accept an `account_id` field.
