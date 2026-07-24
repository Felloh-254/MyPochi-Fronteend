<script setup>
import { formatCurrency } from '../utils/format'
import { frequencyLabel, relativeDueLabel, isOverdue } from '../utils/recurring'
import { useRecurringStore } from '../stores/recurring'
import Icon from './Icon.vue'

const props = defineProps({
  item: { type: Object, required: true },
  accountName: { type: String, default: '' },
})

const recurringStore = useRecurringStore()
</script>

<template>
  <tr :class="{ inactive: !item.is_active }">
    <td class="txn-title">{{ item.title }}</td>
    <td class="txn-date">{{ item.category }}</td>
    <td class="txn-date">{{ accountName || '—' }}</td>
    <td class="txn-date">{{ frequencyLabel(item.frequency) }}</td>
    <td class="txn-date" :class="{ overdue: item.is_active && isOverdue(item.next_run) }">
      {{ item.is_active ? relativeDueLabel(item.next_run) : 'Paused' }}
    </td>
    <td class="txn-amt mono" :class="item.type === 'income' ? 'positive' : 'negative'">
      {{ item.type === 'income' ? '+' : '−' }}{{ formatCurrency(item.amount) }}
    </td>
    <td class="actions">
      <button class="icon-btn" :title="item.is_active ? 'Pause' : 'Resume'" @click="recurringStore.toggleActive(item.id)">
        <Icon :name="item.is_active ? 'pause' : 'play'" size="14" />
      </button>
      <button class="icon-btn" title="Post now" :disabled="!item.is_active" @click="recurringStore.postNow(item.id)">
        <Icon name="check" size="14" />
      </button>
      <button class="icon-btn danger" title="Delete" @click="recurringStore.remove(item.id)">
        <Icon name="trash" size="14" />
      </button>
    </td>
  </tr>
</template>

<style scoped>
tr.inactive {
  opacity: 0.5;
}
.overdue {
  color: var(--rose) !important;
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}
.icon-btn {
  background: none;
  border: none;
  color: var(--text-faint);
  padding: 5px;
  border-radius: 6px;
}
.icon-btn:hover {
  background: var(--canvas);
  color: var(--text);
}
.icon-btn.danger:hover {
  color: var(--rose);
}
.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
