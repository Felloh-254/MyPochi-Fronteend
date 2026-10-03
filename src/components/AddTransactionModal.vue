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
    type: '',
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
const directionError = ref(false)
const selectedAccount = computed(() => accountsStore.items.find((account) => account.id === (form.tab === 'transfer' ? form.from_account_id : form.account_id)))
const amountCurrency = computed(() => selectedAccount.value?.currency || 'KES')

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

function selectDirection(type) {
  form.type = type
  directionError.value = false
}

function close() {
  if (isBusy.value) return
  ui.txnModalOpen = false
}

async function submit() {
  if (form.tab === 'income-expense' && !form.type) {
    directionError.value = true
    return
  }

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
  <BaseModal
    title="Add transaction"
    subtitle="Record money coming in, going out, or moving between accounts."
    :prevent-close="isBusy"
    @close="close"
  >
    <form class="txn-form" @submit.prevent="submit">
      <p class="sr-only" role="status" aria-live="polite">{{ statusMessage }}</p>
      <fieldset class="txn-fieldset" :disabled="isBusy">
        <div class="form-label">Activity</div>
        <div class="kind-switch" role="tablist" aria-label="Transaction kind">
          <button
            type="button"
            role="tab"
            :aria-selected="form.tab === 'income-expense'"
            :class="{ active: form.tab === 'income-expense' }"
            @click="form.tab = 'income-expense'"
          >
            <Icon name="trending" size="16" />
            <span>Income or expense</span>
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="form.tab === 'transfer'"
            :class="{ active: form.tab === 'transfer' }"
            @click="form.tab = 'transfer'"
          >
            <Icon name="repeat" size="16" />
            <span>Transfer</span>
          </button>
        </div>

        <div v-if="form.tab === 'income-expense'" class="form-panel">
          <div class="direction-switch" aria-label="Income or expense">
            <button
              type="button"
              :aria-pressed="form.type === 'expense'"
              :class="{ active: form.type === 'expense' }"
              @click="selectDirection('expense')"
            >
              <span class="direction-mark expense-mark">−</span>
              <span>Expense</span>
            </button>
            <button
              type="button"
              :aria-pressed="form.type === 'income'"
              :class="{ active: form.type === 'income' }"
              @click="selectDirection('income')"
            >
              <span class="direction-mark income-mark">+</span>
              <span>Income</span>
            </button>
          </div>
          <p v-if="!form.type || directionError" class="direction-message" :class="{ 'direction-message--error': directionError }" role="status">
            {{ directionError ? 'Please select income or expense before saving.' : 'Select income or expense to continue.' }}
          </p>

          <div class="field">
            <label for="transaction-title">Description</label>
            <input id="transaction-title" v-model="form.title" placeholder="What was this transaction for?" autocomplete="off" required />
          </div>

          <div class="field-row">
            <div class="field amount-field">
              <label for="transaction-amount">Amount</label>
              <div class="amount-input-wrap">
                <span class="currency-prefix">{{ amountCurrency }}</span>
                <input id="transaction-amount" v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" inputmode="decimal" required />
              </div>
            </div>
            <div class="field">
              <label for="transaction-date">Date</label>
              <input id="transaction-date" v-model="form.date" type="date" required />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="transaction-category">Category</label>
              <input id="transaction-category" v-model="form.category" list="category-options" placeholder="Choose or enter a category" required />
              <datalist id="category-options">
                <option v-for="category in categorySuggestions" :key="category" :value="category"></option>
              </datalist>
            </div>
            <div class="field">
              <label for="transaction-account">Account</label>
              <select id="transaction-account" v-model.number="form.account_id" required>
                <option v-for="account in accountsStore.items" :key="account.id" :value="account.id">{{ account.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-else class="form-panel">
          <div class="field">
            <label for="transfer-title">Description</label>
            <input id="transfer-title" v-model="form.title" placeholder="e.g. Move money to savings" autocomplete="off" required />
          </div>

          <div class="field-row">
            <div class="field amount-field">
              <label for="transfer-amount">Amount</label>
              <div class="amount-input-wrap">
                <span class="currency-prefix">{{ amountCurrency }}</span>
                <input id="transfer-amount" v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" inputmode="decimal" required />
              </div>
            </div>
            <div class="field">
              <label for="transfer-date">Date</label>
              <input id="transfer-date" v-model="form.date" type="date" required />
            </div>
          </div>

          <div class="field-row account-transfer-row">
            <div class="field">
              <label for="transfer-from">From account</label>
              <select id="transfer-from" v-model.number="form.from_account_id" required>
                <option v-for="account in accountsStore.items" :key="account.id" :value="account.id">{{ account.name }}</option>
              </select>
            </div>
            <div class="field">
              <label for="transfer-to">To account</label>
              <select id="transfer-to" v-model.number="form.to_account_id" required>
                <option v-for="account in accountsStore.items" :key="account.id" :value="account.id">{{ account.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field note-field">
          <label for="transaction-note">Note <span>Optional</span></label>
          <input id="transaction-note" v-model="form.note" placeholder="Add a detail you may want later" />
        </div>

        <p v-if="error" class="field-error" role="alert">{{ error }}</p>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="close">Cancel</button>
          <button type="submit" class="btn btn-primary btn-submit" :disabled="isBusy" :aria-busy="status === 'submitting'">
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
.txn-form { padding-top: 2px; }
.txn-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.form-label, .field label {
  color: var(--ink-2);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.kind-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 8px 0 20px;
  padding: 5px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: #f7f7fb;
}
.kind-switch button {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--text-soft);
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.kind-switch button.active {
  border-color: #e9e8f5;
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 5px rgba(20, 20, 43, 0.06);
}
.kind-switch button.active :deep(svg) { color: var(--violet); }
.form-panel { animation: panel-in 0.16s ease-out; }
.direction-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.direction-switch button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px 7px 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.direction-mark {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 50%;
  font-size: 17px;
  line-height: 1;
}
.expense-mark { background: var(--rose-soft); color: var(--rose); }
.income-mark { background: var(--mint-soft); color: #168b49; }
.direction-switch button.active:first-child { border-color: #df6677; background: #fde8eb; color: #a92f43; box-shadow: 0 0 0 2px rgba(240, 87, 107, 0.12); }
.direction-switch button.active:last-child { border-color: #37a967; background: #e4f9ec; color: #176b3c; box-shadow: 0 0 0 2px rgba(55, 200, 113, 0.14); }
.direction-switch button.active .direction-mark { transform: scale(1.08); }
.direction-message { margin: -10px 0 15px; color: var(--text-soft); font-size: 12px; line-height: 1.4; }
.direction-message--error { color: #b92e43; font-weight: 650; }
.form-panel .field { margin-bottom: 15px; }
.field label { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.field label span { color: var(--text-faint); font-size: 11px; font-weight: 500; }
.field input, .field select {
  min-height: 44px;
  border-color: #dedeea;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
}
.field input::placeholder { color: #a3a3b6; }
.field input:focus, .field select:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124, 111, 238, 0.11); }
.amount-input-wrap {
  display: flex;
  min-height: 48px;
  align-items: center;
  border: 1px solid #d8d6ef;
  border-radius: 10px;
  background: #fbfaff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.amount-input-wrap:focus-within { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124, 111, 238, 0.11); background: #fff; }
.currency-prefix { padding-left: 13px; color: var(--text-soft); font-size: 12px; font-weight: 700; }
.amount-input-wrap input { width: 100%; min-width: 0; border: 0; background: transparent; box-shadow: none !important; font-size: 17px; font-weight: 650; font-variant-numeric: tabular-nums; }
.amount-input-wrap input:focus { outline: none; }
.note-field { margin-top: 2px; margin-bottom: 0; }
.field-error { margin-top: 12px; padding: 10px 12px; border: 1px solid #f7d1d7; border-radius: 9px; background: #fff7f8; color: #bf344a; font-size: 12px; }
.modal-actions { margin-top: 21px; padding-top: 18px; }
.btn-submit { min-width: 158px; min-height: 42px; justify-content: center; gap: 8px; border-radius: 10px; }
.btn-submit:disabled { cursor: not-allowed; opacity: 0.8; }
.txn-fieldset:disabled .field input, .txn-fieldset:disabled .field select, .txn-fieldset:disabled button { cursor: not-allowed; opacity: 0.65; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@keyframes panel-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 560px) {
  .kind-switch button { gap: 6px; font-size: 12px; }
  .field-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .modal-actions { gap: 8px; }
  .modal-actions .btn { flex: 1; justify-content: center; }
  .btn-submit { min-width: 0; }
}
@media (prefers-reduced-motion: reduce) { .form-panel { animation: none; } }
</style>
