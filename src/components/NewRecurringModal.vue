<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRecurringStore } from '../stores/recurring'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import { FREQUENCIES } from '../utils/recurring'
import BaseModal from './BaseModal.vue'

const recurringStore = useRecurringStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()

onMounted(() => {
  if (accountsStore.items.length === 0) accountsStore.fetch()
})

function emptyForm() {
  return {
    type: 'expense',
    title: '',
    amount: null,
    category: '',
    account_id: accountsStore.items[0]?.id ?? null,
    frequency: 'monthly',
    next_run: new Date().toISOString().slice(0, 10),
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => recurringStore.loading)
const error = computed(() => (recurringStore.error && !recurringStore.isDemo ? recurringStore.error : null))

function close() {
  ui.recurringModalOpen = false
}

async function submit() {
  try {
    await recurringStore.create({ ...form, amount: Number(form.amount) })
    Object.assign(form, emptyForm())
    close()
  } catch (e) {
    // error captured on the store; leave the modal open
  }
}
</script>

<template>
  <BaseModal title="New recurring transaction" @close="close">
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
        <input v-model="form.title" placeholder="e.g. Rent, Salary, Netflix" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Amount</label>
          <input v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required />
        </div>
        <div class="field">
          <label>Category</label>
          <input v-model="form.category" placeholder="e.g. Housing" required />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Frequency</label>
          <select v-model="form.frequency">
            <option v-for="f in FREQUENCIES" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </div>
        <div class="field">
          <label>Account</label>
          <select v-model.number="form.account_id" required>
            <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>First run date</label>
        <input v-model="form.next_run" type="date" required />
      </div>

      <p v-if="error" class="field-error">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="close">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Create' }}
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
