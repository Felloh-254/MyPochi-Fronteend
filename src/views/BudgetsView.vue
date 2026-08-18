<script setup>
import { onMounted } from 'vue'
import { useBudgetsStore } from '../stores/budgets'
import { useUiStore } from '../stores/ui'
import { formatPeriodLabel, shiftPeriod, isCurrentPeriod } from '../utils/period'
import BudgetCard from '../components/BudgetCard.vue'
import NewBudgetModal from '../components/NewBudgetModal.vue'
import BudgetComparisonChart from '../components/charts/BudgetComparisonChart.vue'
import Icon from '../components/Icon.vue'

const budgetsStore = useBudgetsStore()
const ui = useUiStore()

onMounted(() => {
  budgetsStore.fetch(budgetsStore.period)
  budgetsStore.fetchHistory(6)
})

function goToPreviousMonth() {
  budgetsStore.fetch(shiftPeriod(budgetsStore.period, -1))
}
function goToNextMonth() {
  budgetsStore.fetch(shiftPeriod(budgetsStore.period, 1))
}

function handleDelete(id) {
  budgetsStore.remove(id)
}
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Budgets</h2>
        <p>Set a cap per category and watch it fill up as you spend.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openBudgetModal()">+ New budget</button>
    </div>

    <div class="period-switcher">
      <button class="period-arrow" @click="goToPreviousMonth" aria-label="Previous month">
        <Icon name="chevronLeft" size="16" />
      </button>
      <span class="period-label">
        {{ formatPeriodLabel(budgetsStore.period) }}
        <span v-if="isCurrentPeriod(budgetsStore.period)" class="period-tag">Current</span>
      </span>
      <button class="period-arrow" @click="goToNextMonth" aria-label="Next month">
        <Icon name="chevronRight" size="16" />
      </button>
    </div>

    <div v-if="!budgetsStore.loading && budgetsStore.items.length === 0" class="card empty-period">
      <p>No budgets for {{ formatPeriodLabel(budgetsStore.period) }} yet.</p>
      <div class="empty-period-actions">
        <button class="btn btn-ghost" @click="budgetsStore.copyFromPreviousMonth()">Copy last month's budgets</button>
        <button class="btn btn-primary" @click="ui.openBudgetModal()">+ New budget</button>
      </div>
    </div>

    <div class="budget-grid" v-else>
      <BudgetCard v-for="b in budgetsStore.items" :key="b.id" :budget="b" @delete="handleDelete" />
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Monthly comparison</h3>
        <span class="eyebrow">Budgeted vs. spent, last 6 months</span>
      </div>
      <BudgetComparisonChart :history="budgetsStore.history" />
    </div>
  </div>

  <NewBudgetModal v-if="ui.budgetModalOpen" />
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
}
.demo-banner {
  background: #fff7e6;
  border: 1px solid #f5d99a;
  color: #8a6420;
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 9px;
}
.period-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: flex-start;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px 8px;
}
.period-arrow {
  background: none;
  border: none;
  color: var(--text-soft);
  padding: 6px;
  border-radius: 7px;
  display: flex;
}
.period-arrow:hover {
  background: var(--canvas);
  color: var(--text);
}
.period-label {
  font-size: 13.5px;
  font-weight: 600;
  min-width: 140px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.period-tag {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mint);
  background: var(--mint-soft);
  padding: 2px 7px;
  border-radius: 20px;
}
.empty-period {
  text-align: center;
  padding: 40px 24px;
  color: var(--text-soft);
  font-size: 13.5px;
}
.empty-period-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
