<script setup>
import { onMounted } from 'vue'
import { useBudgetsStore } from '../stores/budgets'
import { useUiStore } from '../stores/ui'
import BudgetCard from '../components/BudgetCard.vue'
import NewBudgetModal from '../components/NewBudgetModal.vue'

const budgetsStore = useBudgetsStore()
const ui = useUiStore()

onMounted(() => {
  if (budgetsStore.items.length === 0) budgetsStore.fetch()
})

function handleDelete(id) {
  budgetsStore.remove(id)
}
</script>

<template>
  <div class="view">
    <p v-if="budgetsStore.isDemo" class="demo-banner">
      Showing demo data — changes here won't persist until the API is reachable.
    </p>

    <div class="section-head">
      <div>
        <h2>Budgets</h2>
        <p>Set a cap per category and watch it fill up as you spend.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openBudgetModal()">+ New budget</button>
    </div>

    <div class="budget-grid">
      <BudgetCard v-for="b in budgetsStore.items" :key="b.id" :budget="b" @delete="handleDelete" />
    </div>

    <p v-if="!budgetsStore.loading && budgetsStore.items.length === 0" class="empty">
      No budgets yet. Create one to start tracking spend by category.
    </p>
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
.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
