<script setup>
import { formatCurrency, formatDate } from '../utils/format'

const props = defineProps({
  transaction: { type: Object, required: true },
  categoryColor: { type: String, default: '#9C9CB4' },
  accountName: { type: String, default: '' },
  showNote: { type: Boolean, default: false },
})
</script>

<template>
  <tr>
    <td class="txn-title">{{ transaction.title }}</td>
    <td>
      <span class="txn-cat"><span class="dot" :style="{ background: categoryColor }"></span>{{ transaction.category }}</span>
    </td>
    <td class="txn-date">{{ accountName || '—' }}</td>
    <td class="txn-date">{{ formatDate(transaction.date) }}</td>
    <td v-if="showNote" class="txn-date">{{ transaction.note || '—' }}</td>
    <td class="txn-amt mono" :class="transaction.type === 'income' ? 'positive' : 'negative'">
      {{ transaction.type === 'income' ? '+' : '−' }}{{ formatCurrency(transaction.amount) }}
    </td>
  </tr>
</template>

<style scoped>
.txn-title {
  font-weight: 600;
}
.txn-cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-soft);
}
.txn-cat .dot {
  width: 7px;
  height: 7px;
}
.txn-amt {
  font-weight: 600;
  text-align: right;
}
.txn-amt.positive {
  color: var(--mint);
}
.txn-amt.negative {
  color: var(--rose);
}
.txn-date {
  color: var(--text-soft);
}
</style>
