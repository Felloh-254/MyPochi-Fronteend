<script setup>
import { onMounted, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useBudgetsStore } from '../stores/budgets'
import { useSummaryStore } from '../stores/summary'
import { formatCurrency } from '../utils/format'
import CashFlowChart from '../components/charts/CashFlowChart.vue'
import WeekdaySpendChart from '../components/charts/WeekdaySpendChart.vue'

const transactionsStore = useTransactionsStore()
const budgetsStore = useBudgetsStore()
const summaryStore = useSummaryStore()

onMounted(() => {
  if (transactionsStore.items.length === 0) transactionsStore.fetch()
  if (budgetsStore.items.length === 0) budgetsStore.fetch()
  if (summaryStore.monthlyData.length === 0) summaryStore.fetch()
})

// Savings rate = (income - expenses) / income
const savingsRate = computed(() => {
  if (!transactionsStore.totalIncome) return 0
  return Math.round((transactionsStore.balance / transactionsStore.totalIncome) * 100)
})

// Month-over-month change, from the same monthly data the cash flow chart uses
const monthOverMonth = computed(() => {
  const data = summaryStore.monthlyData
  if (data.length < 2) return null
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const pctChange = prev.expense ? Math.round(((latest.expense - prev.expense) / prev.expense) * 100) : 0
  return { latest, prev, pctChange }
})

// Highest spending categories, ranked
const topCategories = computed(() => {
  const totals = {}
  for (const t of transactionsStore.items) {
    if (t.type !== 'expense') continue
    totals[t.category] = (totals[t.category] || 0) + t.amount
  }
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
})
const maxCategoryTotal = computed(() => topCategories.value[0]?.total || 1)

// Spending by day of week
const byWeekday = computed(() => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const totals = Object.fromEntries(labels.map((l) => [l, 0]))
  for (const t of transactionsStore.items) {
    if (t.type !== 'expense') continue
    const day = labels[new Date(`${t.date}T00:00:00`).getDay()]
    totals[day] += t.amount
  }
  return totals
})
const biggestSpendDay = computed(() => {
  const entries = Object.entries(byWeekday.value)
  return entries.reduce((max, e) => (e[1] > max[1] ? e : max), entries[0])
})
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Insights</h2>
        <p>Spot patterns and make your next money move with confidence.</p>
      </div>
    </div>

    <div class="hero-row">
      <div class="card stat">
        <span class="card-label">Savings rate</span>
        <span class="figure mono" :class="savingsRate >= 0 ? 'positive' : 'negative'">{{ savingsRate }}%</span>
        <span class="sub-label">of income kept this period</span>
      </div>
      <div class="card stat" v-if="monthOverMonth">
        <span class="card-label">Spending vs. last month</span>
        <span class="figure mono" :class="monthOverMonth.pctChange <= 0 ? 'positive' : 'negative'">
          {{ monthOverMonth.pctChange > 0 ? '+' : '' }}{{ monthOverMonth.pctChange }}%
        </span>
        <span class="sub-label">{{ formatCurrency(monthOverMonth.latest.expense) }} vs {{ formatCurrency(monthOverMonth.prev.expense) }}</span>
      </div>
      <div class="card stat">
        <span class="card-label">Biggest spend day</span>
        <span class="figure mono">{{ biggestSpendDay?.[0] ?? '—' }}</span>
        <span class="sub-label">{{ formatCurrency(biggestSpendDay?.[1] ?? 0) }} typically</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card chart-card">
        <div class="card-head">
          <h3>Spending trend</h3>
          <span class="eyebrow">Last 6 months</span>
        </div>
        <CashFlowChart :monthly-data="summaryStore.monthlyData" />
      </div>
      <div class="card chart-card">
        <div class="card-head">
          <h3>Spending by day of week</h3>
          <span class="eyebrow">All transactions</span>
        </div>
        <WeekdaySpendChart :by-weekday="byWeekday" />
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Highest spending categories</h3>
        <span class="eyebrow">Ranked</span>
      </div>
      <div class="rank-list">
        <div class="rank-row" v-for="(c, i) in topCategories" :key="c.category">
          <span class="rank-index">{{ i + 1 }}</span>
          <span class="rank-name">{{ c.category }}</span>
          <div class="rank-track">
            <div class="rank-fill" :style="{ width: (c.total / maxCategoryTotal) * 100 + '%' }"></div>
          </div>
          <span class="rank-amount mono">{{ formatCurrency(c.total) }}</span>
        </div>
        <p v-if="!topCategories.length" class="empty">No expenses recorded yet.</p>
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
}
.hero-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.figure {
  font-size: 26px;
  font-weight: 600;
}
.figure.positive {
  color: var(--mint);
}
.figure.negative {
  color: var(--rose);
}
.sub-label {
  font-size: 11.5px;
  color: var(--text-soft);
  margin-top: 6px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rank-row {
  display: grid;
  grid-template-columns: 20px 110px 1fr 90px;
  align-items: center;
  gap: 12px;
}
.rank-index {
  color: var(--text-faint);
  font-size: 12px;
  font-weight: 600;
}
.rank-name {
  font-size: 13px;
  font-weight: 600;
}
.rank-track {
  height: 7px;
  border-radius: 20px;
  background: var(--canvas);
  overflow: hidden;
}
.rank-fill {
  height: 100%;
  background: var(--violet);
  border-radius: 20px;
}
.rank-amount {
  font-size: 12.5px;
  text-align: right;
}

@media (max-width: 980px) {
  .hero-row {
    grid-template-columns: 1fr;
  }
  .grid-2 {
    grid-template-columns: 1fr;
  }
  .rank-row {
    grid-template-columns: 20px 90px 1fr 80px;
  }
}
</style>
