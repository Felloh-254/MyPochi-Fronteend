<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useAccountsStore } from '../stores/accounts'
import ErrorAlert from '../components/ErrorAlert.vue'
import { useErrorHandler } from '../utils/useErrorHandler'
import { parseTransactionsCsv } from '../utils/csvImport'
import { formatCurrency, formatDate } from '../utils/format'

const transactionsStore = useTransactionsStore()
const accountsStore = useAccountsStore()
const { errors, addError, dismissError } = useErrorHandler()

const rows = ref([])
const format = ref(null)
const fileName = ref('')
const targetAccountId = ref(null)
const importing = ref(false)
const importedCount = ref(0)

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    const result = parseTransactionsCsv(reader.result)
    rows.value = result.rows
    format.value = result.format
    importedCount.value = 0
  }
  reader.readAsText(file)
}

const includedRows = computed(() => rows.value.filter((r) => r.include))
const totalIncome = computed(() => includedRows.value.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0))
const totalExpense = computed(() => includedRows.value.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0))

async function runImport() {
  if (!targetAccountId.value || !includedRows.value.length) return
  importing.value = true
  // Real bulk-import would ideally hit one backend endpoint; looping
  // client-side keeps this working today against the same per-transaction
  // POST /api/transactions route everything else already uses.
  for (const row of includedRows.value) {
    await transactionsStore.create({ ...row, account_id: targetAccountId.value })
  }
  importedCount.value = includedRows.value.length
  rows.value = []
  importing.value = false
}
</script>

<template>
  <div class="view">
    <ErrorAlert
      v-for="error in errors"
      :key="error.id"
      :message="error.message"
      :type="error.type"
      @dismiss="dismissError(error.id)"
    />

    <div class="section-head">
      <div>
        <h2>Import</h2>
        <p>Bring in transactions from a CSV file or an M-Pesa statement export.</p>
      </div>
    </div>

    <div class="card upload-card content-enter">
      <label class="upload-zone">
        <input type="file" accept=".csv" @change="handleFile" hidden />
        <span class="upload-title">{{ fileName || 'Choose a CSV file' }}</span>
        <span class="upload-sub">Generic CSV (title, amount, type, category, date) or an M-Pesa statement export</span>
      </label>
    </div>

    <p v-if="importedCount" class="success-banner content-enter">Imported {{ importedCount }} transactions.</p>

    <template v-if="rows.length">
      <div class="card preview-head content-enter content-enter--delay-1">
        <div>
          <span class="format-tag">{{ format === 'mpesa' ? 'M-Pesa statement detected' : 'Generic CSV' }}</span>
          <p class="preview-summary">
            {{ includedRows.length }} of {{ rows.length }} rows selected —
            <span class="mono positive">{{ formatCurrency(totalIncome) }}</span> in,
            <span class="mono negative">{{ formatCurrency(totalExpense) }}</span> out
          </p>
        </div>
        <div class="preview-actions">
          <select v-model.number="targetAccountId">
            <option :value="null" disabled>Import into account…</option>
            <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
          <button class="btn btn-primary" :disabled="!targetAccountId || importing" @click="runImport">
            {{ importing ? 'Importing…' : `Import ${includedRows.length} transactions` }}
          </button>
        </div>
      </div>

      <div class="card content-enter content-enter--delay-2" style="padding: 8px 22px 22px">
        <table class="txn-table">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th style="text-align: right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rows" :key="i" class="table-row-enter-active">
              <td><input type="checkbox" v-model="r.include" /></td>
              <td class="txn-date">{{ formatDate(r.date) }}</td>
              <td class="txn-title">{{ r.title }}</td>
              <td class="txn-date"><input class="mini-input" v-model="r.category" /></td>
              <td class="txn-date">{{ r.type }}</td>
              <td class="txn-amt mono" :class="r.type === 'income' ? 'positive' : 'negative'">
                {{ r.type === 'income' ? '+' : '−' }}{{ formatCurrency(r.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
}
.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  padding: 30px;
  border: 1px dashed var(--line);
  border-radius: 12px;
  cursor: pointer;
}
.upload-zone:hover {
  border-color: var(--violet);
}
.upload-title {
  font-weight: 600;
  font-size: 14px;
}
.upload-sub {
  font-size: 12px;
  color: var(--text-soft);
}
.success-banner {
  background: var(--mint-soft);
  color: #1d7a44;
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 9px;
}
.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.format-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--violet);
  background: #eef0ff;
  padding: 3px 8px;
  border-radius: 20px;
}
.preview-summary {
  font-size: 12.5px;
  color: var(--text-soft);
  margin-top: 8px;
}
.preview-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.preview-actions select {
  padding: 9px 12px;
  border-radius: 9px;
  border: 1px solid var(--line);
  font-size: 13px;
}
.mini-input {
  border: 1px solid transparent;
  background: transparent;
  font-size: 12.5px;
  color: var(--text-soft);
  width: 100px;
  padding: 3px 5px;
  border-radius: 5px;
}
.mini-input:hover,
.mini-input:focus {
  border-color: var(--line);
  background: #fff;
}
</style>
