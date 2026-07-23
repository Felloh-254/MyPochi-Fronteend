<script setup>
import { formatCurrency } from '../utils/format'
import { budgetPct } from '../utils/budget'
import Icon from './Icon.vue'

const props = defineProps({
  budget: { type: Object, required: true },
})
const emit = defineEmits(['delete'])
</script>

<template>
  <div class="card budget-card">
    <div class="budget-card-head">
      <span class="dot" :style="{ background: budget.color }"></span>
      <span class="budget-name">{{ budget.name }}</span>
      <button class="icon-btn" @click="emit('delete', budget.id)" aria-label="Delete budget">
        <Icon name="trash" size="15" />
      </button>
    </div>
    <div class="budget-amounts mono">
      {{ formatCurrency(budget.spent) }}<span class="text-faint"> / {{ formatCurrency(budget.amount) }}</span>
    </div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: budgetPct(budget) + '%', background: budgetPct(budget) >= 100 ? 'var(--rose)' : budget.color }"
      ></div>
    </div>
    <div class="budget-foot">
      <span>{{ budget.category }}</span>
      <span :class="{ over: budgetPct(budget) >= 100 }">{{ budgetPct(budget) }}% used</span>
    </div>
  </div>
</template>

<style scoped>
.budget-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.budget-card-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.budget-name {
  font-weight: 600;
  font-size: 14px;
}
.icon-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-faint);
  padding: 4px;
  border-radius: 6px;
}
.icon-btn:hover {
  background: var(--canvas);
  color: var(--rose);
}
.budget-amounts {
  font-size: 19px;
  font-weight: 600;
}
.budget-foot {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--text-soft);
}
.budget-foot .over {
  color: var(--rose);
  font-weight: 600;
}
</style>
