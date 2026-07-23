<script setup>
import { reactive, computed, onMounted, watch } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useBudgetsStore } from '../stores/budgets'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import BaseModal from './BaseModal.vue'

const transactionsStore = useTransactionsStore()
const budgetsStore = useBudgetsStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()

onMounted(() => {
  if (accountsStore.items.length === 0) accountsStore.fetch()
})

watch(
  () => accountsStore.items.length,
  (len) => {
    if (len > 0 && !form.account_id) form.account_id = accountsStore.items[0].id
  },
)

function emptyForm() {
  return {
    type: 'expense',
    title: '',
    amount: null,
    category: '',
    account_id: accountsStore.items[0]?.id ?? null,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => transactionsStore.loading)
const error = computed(() => transactionsStore.error && !transactionsStore.isDemo ? transactionsStore.error : null)

const categorySuggestions = computed(() => {
  const fromBudgets = budgetsStore.items.map((b) => b.category)
  const fromTxns = transactionsStore.items.map((t) => t.category)
  return [...new Set([...fromBudgets, ...fromTxns])].sort()
})

function close() {
  ui.txnModalOpen = false
}

async function submit() {
  try {
    await transactionsStore.create({ ...form, amount: Number(form.amount) })
    Object.assign(form, emptyForm())
    close()
  } catch (e) {
    // error already captured on the store; keep the modal open so the
    // person can fix the input rather than losing what they typed
  }
}
</script>

<template>
  <BaseModal title="Add transaction" @close="close">
    <form @submit.prevent="submit">
      <div class="type-toggle">
        <button type="button" class="expense" :class="{ active: form.type === 'expense' }" @click="form.type = 'expense'">
          Expense
        </button>
        <button type="button" class="income" :class="{ active: form.type === 'income' }" @click="form.type = 'income'">
          Income
        </button>
      </div>

      <div class="field">
        <label>Title</label>
        <input v-model="form.title" placeholder="e.g. Whole Foods" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Amount</label>
          <input v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required />
        </div>
        <div class="field">
          <label>Date</label>
          <input v-model="form.date" type="date" required />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Category</label>
          <input v-model="form.category" list="category-options" placeholder="e.g. Groceries" required />
          <datalist id="category-options">
            <option v-for="c in categorySuggestions" :key="c" :value="c"></option>
          </datalist>
        </div>
        <div class="field">
          <label>Account</label>
          <select v-model.number="form.account_id" required>
            <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Note (optional)</label>
        <input v-model="form.note" placeholder="Anything worth remembering" />
      </div>

      <p v-if="error" class="field-error">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="close">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Save transaction' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.type-toggle {
  display: flex;
  border: 1px solid var(--line);
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 16px;
}
.type-toggle button {
  flex: 1;
  background: #fff;
  border: none;
  padding: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-soft);
}
.type-toggle button.active.expense {
  background: var(--rose-soft);
  color: var(--rose);
}
.type-toggle button.active.income {
  background: var(--mint-soft);
  color: var(--mint);
}
</style>
