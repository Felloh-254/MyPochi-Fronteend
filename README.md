# Coffer — frontend

A Vue 3 SPA for the Coffer budgeting app: dashboard, budgets, transactions,
and settings, wired to the Go/Postgres API built alongside it (see the
`budgetapp` backend project).

## Stack

- **Vue 3** — `<script setup>` SFCs throughout
- **Vue Router 4** — route-based views with an auth guard
- **Pinia** — one store per domain (`auth`, `budgets`, `transactions`, `summary`, `ui`)
- **Chart.js** + **vue-chartjs** — cash flow line chart, category donut chart
- **Vite** — dev server + build

## Project layout

```
src/
  main.js               app entrypoint
  App.vue                layout shell (sidebar + topbar + router-view) + global modal
  router/index.js         routes + auth guard
  stores/
    auth.js               login/register/logout, JWT persisted to localStorage
    budgets.js             CRUD against /api/budgets
    transactions.js        CRUD against /api/transactions, computed totals
    summary.js             monthly trend data from /api/summary
    ui.js                  modal visibility + shared search state
  services/
    api.js                 fetch wrapper — the only place that knows API routes
    demoData.js             fallback data shown if the API is unreachable
    chartSetup.js            Chart.js component registration
  components/
    AppSidebar.vue, AppTopbar.vue
    StatCard.vue, BudgetCard.vue, BudgetProgressRow.vue, TransactionRow.vue
    BaseModal.vue, AddTransactionModal.vue, NewBudgetModal.vue
    Icon.vue                inline SVG icon set
    charts/                 CashFlowChart.vue, CategoryDonutChart.vue
  views/
    LoginView.vue, DashboardView.vue, BudgetsView.vue, TransactionsView.vue, SettingsView.vue
  utils/
    format.js, budget.js
  styles/
    tokens.css               design tokens + shared primitives (:root vars, .card, .btn, table styles)
```

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your running Go backend
npm run dev
```

The app defaults `VITE_API_URL` to `http://localhost:8080`. If the API
can't be reached — e.g. you haven't started the Go backend yet — every
store falls back to realistic demo data automatically (see
`services/demoData.js`) so the UI is never just broken; a small banner
says so on the Dashboard and Budgets views. Login/registration still
require the real API, since there's nothing meaningful to fake there.

## Build

```bash
npm run build     # outputs to dist/
npm run preview    # serve the production build locally
```

## Notes on the design

- Colors, type, and the dashed "stitch" motif were pulled from the wallet
  logo — see the color tokens in `src/styles/tokens.css`.
- Every currency figure uses `JetBrains Mono` with tabular numerals
  (`formatCurrency` in `src/utils/format.js`) so amounts line up like a
  real ledger.
- Data shapes match the Go API responses 1:1 (`budget.spent`,
  `transaction.category`, etc.) — no client-side reshaping needed when you
  switch off demo data.
