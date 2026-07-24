<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useAccountsStore } from '../stores/accounts'
import { useBudgetsStore } from '../stores/budgets'
import { formatCurrency, formatDate } from '../utils/format'
import { transactionsToCsv, downloadCsv } from '../utils/csvExport'

const transactionsStore = useTransactionsStore()
const accountsStore = useAccountsStore()
const budgetsStore = useBudgetsStore()

onMounted(() => {
  if (transactionsStore.items.length === 0) transactionsStore.fetch()
  if (accountsStore.items.length === 0) accountsStore.fetch()
  if (budgetsStore.items.length === 0) budgetsStore.fetch()
})

const today = new Date().toISOString().slice(0, 10)
const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
const from = ref(monthAgo)
const to = ref(today)

const inRange = computed(() =>
  transactionsStore.items
    .filter((t) => t.date >= from.value && t.date <= to.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date)),
)

const income = computed(() => inRange.value.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0))
const expenses = computed(() => inRange.value.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0))

function accountName(accountId) {
  return accountsStore.items.find((a) => a.id === accountId)?.name ?? ''
}

function exportCsv() {
  const csv = transactionsToCsv(inRange.value, accountName)
  downloadCsv(`mypochi-transactions-${from.value}-to-${to.value}.csv`, csv)
}

function printReport() {
  window.print()
}
</script>

<template>
  <div class="view">
    <div class="section-head no-print">
      <div>
        <h2>Reports</h2>
        <p>Export a CSV, or print a summary as a PDF.</p>
      </div>
      <div class="actions">
        <button class="btn btn-ghost" @click="exportCsv">Export CSV</button>
        <button class="btn btn-primary" @click="printReport">Print / Save as PDF</button>
      </div>
    </div>

    <div class="card date-range no-print">
      <div class="field">
        <label>From</label>
        <input v-model="from" type="date" />
      </div>
      <div class="field">
        <label>To</label>
        <input v-model="to" type="date" />
      </div>
    </div>

    <div class="card printable">
      <h2 class="report-title">MyPochi — Financial report</h2>
      <p class="report-range">{{ formatDate(from) }} – {{ formatDate(to) }}</p>

      <div class="report-summary">
        <div>
          <span class="card-label">Income</span>
          <span class="mono positive">{{ formatCurrency(income) }}</span>
        </div>
        <div>
          <span class="card-label">Expenses</span>
          <span class="mono negative">{{ formatCurrency(expenses) }}</span>
        </div>
        <div>
          <span class="card-label">Net</span>
          <span class="mono">{{ formatCurrency(income - expenses) }}</span>
        </div>
      </div>

      <table class="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Account</th>
            <th style="text-align: right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in inRange" :key="t.id">
            <td class="txn-date">{{ formatDate(t.date) }}</td>
            <td class="txn-title">{{ t.title }}</td>
            <td class="txn-date">{{ t.category }}</td>
            <td class="txn-date">{{ accountName(t.account_id) }}</td>
            <td class="txn-amt mono" :class="t.type === 'income' ? 'positive' : 'negative'">
              {{ t.type === 'income' ? '+' : '−' }}{{ formatCurrency(t.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!inRange.length" class="empty">No transactions in this date range.</p>
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
.actions {
  display: flex;
  gap: 10px;
}
.date-range {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  width: fit-content;
}
.date-range .field {
  margin-bottom: 0;
}
.report-title {
  font-size: 19px;
  margin-bottom: 4px;
}
.report-range {
  font-size: 12.5px;
  color: var(--text-soft);
  margin-bottom: 20px;
}
.report-summary {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--line);
}
.report-summary > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.report-summary .mono {
  font-size: 19px;
  font-weight: 600;
}
.report-summary .positive {
  color: var(--mint);
}
.report-summary .negative {
  color: var(--rose);
}
</style>
