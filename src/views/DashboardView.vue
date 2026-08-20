<script setup>
import { onMounted } from 'vue'
import { useBudgetsStore } from '../stores/budgets'
import { useTransactionsStore } from '../stores/transactions'
import { useSummaryStore } from '../stores/summary'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import { formatCurrency } from '../utils/format'
import StatCard from '../components/StatCard.vue'
import BudgetProgressRow from '../components/BudgetProgressRow.vue'
import TransactionRow from '../components/TransactionRow.vue'
import CashFlowChart from '../components/charts/CashFlowChart.vue'
import CategoryDonutChart from '../components/charts/CategoryDonutChart.vue'

const budgetsStore = useBudgetsStore()
const transactionsStore = useTransactionsStore()
const summaryStore = useSummaryStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()

onMounted(() => {
  budgetsStore.fetch()
  transactionsStore.fetch()
  summaryStore.fetch()
  accountsStore.fetch()
})

function categoryColor(catName) {
  const b = budgetsStore.items.find((x) => x.category === catName || x.name === catName)
  return b ? b.color : '#9C9CB4'
}

function accountName(accountId) {
  return accountsStore.items.find((a) => a.id === accountId)?.name ?? ''
}
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Dashboard</h2>
        <p>A clear view of where your money stands today.</p>
      </div>
    </div>

    <div class="hero-row">
      <StatCard
        variant="hero"
        label="Total balance"
        :value="accountsStore.totalBalance"
        :delta="(transactionsStore.balance >= 0 ? '↑ ' : '↓ ') + formatCurrency(Math.abs(transactionsStore.balance)) + ' net this month'"
      />
      <StatCard variant="positive" label="Income this month" :value="transactionsStore.totalIncome" />
      <StatCard variant="negative" label="Expenses this month" :value="transactionsStore.totalExpenses" />
    </div>

    <div class="grid-2">
      <div class="card chart-card">
        <div class="card-head">
          <h3>Cash flow</h3>
          <span class="eyebrow">Last 6 months</span>
        </div>
        <CashFlowChart :monthly-data="summaryStore.monthlyData" />
      </div>
      <div class="card chart-card">
        <div class="card-head">
          <h3>Where it goes</h3>
          <span class="eyebrow">By category</span>
        </div>
        <CategoryDonutChart :budgets="budgetsStore.items" />
        <ul class="legend">
          <li v-for="b in budgetsStore.items" :key="b.id">
            <span class="dot" :style="{ background: b.color }"></span>
            {{ b.name }}
            <span class="amt mono">{{ formatCurrency(b.spent) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Accounts</h3>
        <router-link class="link-btn" to="/accounts">View all</router-link>
      </div>
      <ul class="legend accounts-legend">
        <li v-for="a in accountsStore.items" :key="a.id">
          <span class="dot" :style="{ background: a.color }"></span>
          {{ a.name }}
          <span class="amt mono">{{ formatCurrency(accountsStore.balanceFor(a.id)) }}</span>
        </li>
      </ul>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Budgets</h3>
        <router-link class="link-btn" to="/budgets">View all</router-link>
      </div>
      <div class="budget-mini-list">
        <BudgetProgressRow v-for="b in budgetsStore.items.slice(0, 4)" :key="b.id" :budget="b" />
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Recent transactions</h3>
        <router-link class="link-btn" to="/transactions">View all</router-link>
      </div>
      <div class="transaction-table-wrap">
        <table class="txn-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Category</th>
              <th>Account</th>
              <th>Date</th>
              <th style="text-align: right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <TransactionRow
              v-for="t in transactionsStore.recent"
              :key="t.id"
              :transaction="t"
              :category-color="categoryColor(t.category)"
              :account-name="accountName(t.account_id)"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
  min-width: 0;
  width: 100%;
}
.view > .card,
.grid-2 > .card,
.hero-row > * {
  min-width: 0;
}
.transaction-table-wrap {
  max-width: 100%;
  overflow-x: auto;
}
.demo-banner {
  background: #fff7e6;
  border: 1px solid #f5d99a;
  color: #8a6420;
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 9px;
}
.demo-banner code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
}
.hero-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 18px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 18px;
  align-items: start;
}
.budget-mini-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.legend {
  list-style: none;
  padding: 14px 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.legend li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-soft);
}
.legend .amt {
  margin-left: auto;
}

@media (max-width: 980px) {
  .hero-row {
    grid-template-columns: 1fr;
  }
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
