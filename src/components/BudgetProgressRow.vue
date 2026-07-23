<script setup>
import { formatCurrency } from '../utils/format'
import { budgetPct } from '../utils/budget'

const props = defineProps({
  budget: { type: Object, required: true },
})
</script>

<template>
  <div class="budget-mini">
    <div class="budget-mini-top">
      <span class="name">{{ budget.name }}</span>
      <span class="mono">
        {{ formatCurrency(budget.spent) }}
        <span class="text-faint" style="font-size: 12px">/ {{ formatCurrency(budget.amount) }}</span>
      </span>
    </div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: budgetPct(budget) + '%', background: budgetPct(budget) >= 100 ? 'var(--rose)' : budget.color }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.budget-mini {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.budget-mini-top {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
}
.budget-mini-top .name {
  font-weight: 600;
}
</style>
