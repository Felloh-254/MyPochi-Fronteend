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
    if (len > 0) {
      if (!form.account_id && !form.from_account_id) {
        form.account_id = accountsStore.items[0].id
        form.from_account_id = accountsStore.items[0].id
      }
    }
  },
)

function emptyForm() {
  return {
    tab: 'income-expense', // 'income-expense' or 'transfer'
    type: 'expense',
    title: '',
    amount: null,
    category: '',
    account_id: accountsStore.items[0]?.id ?? null,
    from_account_id: accountsStore.items[0]?.id ?? null,
    to_account_id: accountsStore.items.length > 1 ? accountsStore.items[1].id : accountsStore.items[0]?.id ?? null,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => transactionsStore.loading)
const error = computed(() => transactionsStore.error)

const categorySuggestions = computed(() => {
  const fromBudgets = budgetsStore.items.map((b) => b.category)
  const fromTxns = transactionsStore.items.map((t) => t.category).filter(Boolean)
  return [...new Set([...fromBudgets, ...fromTxns])].sort()
})

function close() {
  ui.txnModalOpen = false
}

async function submit() {
  try {
    const payload = form.tab === 'transfer'
      ? {
          type: 'transfer',
          title: form.title,
          amount: Number(form.amount),
          from_account_id: form.from_account_id,
          to_account_id: form.to_account_id,
          date: form.date,
          note: form.note,
        }
      : {
          type: form.type,
          title: form.title,
          amount: Number(form.amount),
          category: form.category,
          account_id: form.account_id,
          date: form.date,
          note: form.note,
        }

    await transactionsStore.create(payload)
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
      <div class="tab-toggle">
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: form.tab === 'income-expense' }" 
          @click="form.tab = 'income-expense'"
        >
          Income/Expense
        </button>
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: form.tab === 'transfer' }" 
          @click="form.tab = 'transfer'"
        >
          Transfer
        </button>
      </div>

      <!-- Income/Expense Tab -->
      <div v-if="form.tab === 'income-expense'">
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
      </div>

      <!-- Transfer Tab -->
      <div v-if="form.tab === 'transfer'">
        <div class="field">
          <label>Title</label>
          <input v-model="form.title" placeholder="e.g. Transfer to savings" required />
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
            <label>From Account</label>
            <select v-model.number="form.from_account_id" required>
              <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>To Account</label>
            <select v-model.number="form.to_account_id" required>
              <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>Note (optional)</label>
          <input v-model="form.note" placeholder="Anything worth remembering" />
        </div>
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
.tab-toggle {
  display: flex;
  border: 1px solid var(--line);
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 16px;
}
.tab-btn {
  flex: 1;
  background: #fff;
  border: none;
  padding: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-soft);
  cursor: pointer;
}
.tab-btn.active {
  background: var(--bg-soft);
  color: var(--text);
}

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
