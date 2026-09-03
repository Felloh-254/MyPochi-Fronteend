<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useBudgetsStore } from '../stores/budgets'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import ErrorAlert from '../components/ErrorAlert.vue'
import { useErrorHandler } from '../utils/useErrorHandler'
import TransactionRow from '../components/TransactionRow.vue'

const transactionsStore = useTransactionsStore()
const budgetsStore = useBudgetsStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()
const { errors, addError, dismissError } = useErrorHandler()

const filter = ref('all')

const filtered = computed(() => {
  let list = transactionsStore.sorted
  if (filter.value !== 'all') list = list.filter((t) => t.type === filter.value)
  const q = ui.searchQuery.trim().toLowerCase()
  if (q) list = list.filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
  return list
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
    <ErrorAlert
      v-for="error in errors"
      :key="error.id"
      :message="error.message"
      :type="error.type"
      @dismiss="dismissError(error.id)"
    />

    <div class="section-head">
      <div>
        <h2>Transactions</h2>
        <p>Every dollar in and out, in one ledger.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openTxnModal()">+ Add transaction</button>
    </div>

    <div class="filter-row content-enter">
      <button v-for="f in ['all', 'income', 'expense']" :key="f" :class="{ active: filter === f }" @click="filter = f">
        {{ f }}
      </button>
    </div>

    <div class="card content-enter content-enter--delay-1" style="padding: 8px 22px 22px">
      <table class="txn-table" v-if="filtered.length">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Account</th>
            <th>Date</th>
            <th>Note</th>
            <th style="text-align: right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <TransactionRow
            v-for="t in filtered"
            :key="t.id"
            :transaction="t"
            :category-color="categoryColor(t.category)"
            :account-name="accountName(t.account_id)"
            show-note
            class="table-row-enter-active"
          />
        </tbody>
      </table>
      <p class="empty" v-else>No transactions match yet. Add one to get started.</p>
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
</style>
