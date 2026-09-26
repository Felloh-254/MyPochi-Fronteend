<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useBudgetsStore } from '../stores/budgets'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import BaseModal from './BaseModal.vue'
import Icon from './Icon.vue'

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
const error = computed(() => transactionsStore.error)

// Local, synchronous submission state. We don't rely solely on
// transactionsStore.loading here: that flag is only as fast as the store's
// own reactivity, and a fast double-click can slip through the gap before
// it flips. Setting this ref at the very top of submit(), before any
// await, closes that gap completely.
const status = ref('idle') // 'idle' | 'submitting' | 'success'
const isBusy = computed(() => status.value !== 'idle')
const statusMessage = computed(() => {
  if (status.value === 'submitting') return 'Saving transaction…'
  if (status.value === 'success') return 'Transaction saved'
  return ''
})

const categorySuggestions = computed(() => {
  const fromBudgets = budgetsStore.items.map((b) => b.category)
  const fromTxns = transactionsStore.items.map((t) => t.category).filter(Boolean)
  return [...new Set([...fromBudgets, ...fromTxns])].sort()
})

function close() {
  if (isBusy.value) return
  ui.txnModalOpen = false
}

async function submit() {
  // Guard clause: if a submission is already in flight (or just
  // succeeded), ignore any further clicks/Enter-presses until this one
  // finishes. This check happens synchronously, before any network call,
  // so a rapid double-click can never queue two requests.
  if (isBusy.value) return
  status.value = 'submitting'

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

    // Brief success confirmation so the person can see the save actually
    // went through, then close and reset for next time.
    status.value = 'success'
    setTimeout(() => {
      Object.assign(form, emptyForm())
      status.value = 'idle'
      ui.txnModalOpen = false
    }, 500)
  } catch (e) {
    // error already captured on the store; keep the modal open so the
    // person can fix the input rather than losing what they typed
    status.value = 'idle'
  }
}
</script>

<template>
  <BaseModal title="Add transaction" :prevent-close="isBusy" @close="close">
    <form @submit.prevent="submit">
      <p class="sr-only" role="status" aria-live="polite">{{ statusMessage }}</p>
      <fieldset class="txn-fieldset" :disabled="isBusy">
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
        <button type="submit" class="btn btn-primary btn-submit" :aria-busy="status === 'submitting'">
          <span v-if="status === 'submitting'" class="btn-spinner" aria-hidden="true"></span>
          <Icon v-else-if="status === 'success'" name="check" size="15" />
          <span>{{ status === 'submitting' ? 'Saving…' : status === 'success' ? 'Saved' : 'Save transaction' }}</span>
        </button>
      </div>
      </fieldset>
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

/* Reset native fieldset chrome so disabling the form during submit
   doesn't change its look, only its interactivity. */
.txn-fieldset {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}
.txn-fieldset:disabled .field input,
.txn-fieldset:disabled .field select,
.txn-fieldset:disabled .tab-btn,
.txn-fieldset:disabled .type-toggle button {
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 148px;
}
.btn-submit:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.btn-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: btn-spin 0.6s linear infinite;
  opacity: 0.85;
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
