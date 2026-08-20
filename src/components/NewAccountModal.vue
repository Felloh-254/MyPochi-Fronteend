<script setup>
import { reactive, computed, ref } from 'vue'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import { ACCOUNT_TYPES } from '../utils/accountTypes'
import { CURRENCIES } from '../utils/currencies'
import { BANKS } from '../utils/accountThemes'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  account: { type: Object, default: null },
})
const emit = defineEmits(['close'])
const accountsStore = useAccountsStore()
const ui = useUiStore()

function emptyForm(account = null) {
  return {
    name: account?.name || '',
    type: account?.type || 'bank',
    bank: account?.bank || '',
    account_number: account?.account_number || '',
    balance: account?.balance ?? account?.starting_balance ?? null,
    currency: account?.currency || 'KES',
  }
}

const form = reactive(emptyForm(props.account))
const editing = computed(() => Boolean(props.account))
const modalTitle = computed(() => (editing.value ? 'Edit account' : 'New account'))
const submitting = computed(() => accountsStore.loading)
const error = computed(() => (accountsStore.error && !accountsStore.isDemo ? accountsStore.error : null))
const currencyQuery = ref('')
const currencyOpen = ref(false)
const filteredCurrencies = computed(() => {
  const query = currencyQuery.value.trim().toLowerCase()
  if (!query) return CURRENCIES
  return CURRENCIES.filter(
    (currency) => currency.code.toLowerCase().includes(query) || currency.name.toLowerCase().includes(query),
  )
})

function selectedCurrency() {
  return CURRENCIES.find((currency) => currency.code === form.currency)
}

function openCurrencyPicker() {
  currencyQuery.value = ''
  currencyOpen.value = true
}

function chooseCurrency(currency) {
  form.currency = currency.code
  currencyQuery.value = ''
  currencyOpen.value = false
}

function close() {
  ui.accountModalOpen = false
  emit('close')
}

async function submit() {
  try {
    const payload = {
      name: form.name.trim(),
      type: form.type,
      account_number: form.account_number.trim() || null,
      balance: Number(form.balance) || 0,
      currency: form.currency,
      bank: form.type === 'bank' ? form.bank || null : null,
    }
    if (editing.value) {
      await accountsStore.update(props.account.id, payload)
    } else {
      await accountsStore.create(payload)
    }
    Object.assign(form, emptyForm())
    currencyQuery.value = ''
    currencyOpen.value = false
    close()
  } catch (e) {
    // error captured on the store; leave the modal open
  }
}
</script>

<template>
  <BaseModal :title="modalTitle" @close="close">
    <form @submit.prevent="submit">
      <div class="field">
        <label>Name</label>
        <input v-model="form.name" placeholder="e.g. M-Pesa" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Type</label>
          <select v-model="form.type">
            <option v-for="t in ACCOUNT_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="field">
          <label for="account-balance">Balance</label>
          <input id="account-balance" v-model.number="form.balance" type="number" step="0.01" placeholder="0.00" required />
        </div>
      </div>

      <div v-if="form.type === 'bank'" class="field">
        <label for="account-bank">Bank</label>
        <select id="account-bank" v-model="form.bank" required>
          <option value="" disabled>Select your bank</option>
          <option v-for="bank in BANKS.filter((item) => item.value !== 'mpesa')" :key="bank.value" :value="bank.value">
            {{ bank.label }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="account-number">Account number <span class="optional">Optional</span></label>
        <input id="account-number" v-model="form.account_number" inputmode="numeric" placeholder="e.g. 0712 345 678" />
      </div>

      <div class="field currency-field">
        <label for="account-currency">Currency</label>
        <div class="currency-picker">
          <button
            id="account-currency"
            type="button"
            class="currency-trigger"
            :aria-expanded="currencyOpen"
            @click="currencyOpen = !currencyOpen"
          >
            <span class="currency-code">{{ form.currency }}</span>
            <span class="currency-name">{{ selectedCurrency()?.name }}</span>
            <span class="currency-chevron">⌄</span>
          </button>
          <div v-if="currencyOpen" class="currency-menu">
            <input
              v-model="currencyQuery"
              class="currency-search"
              type="search"
              placeholder="Search currency or code"
              autofocus
              @click.stop
              @keydown.escape="currencyOpen = false"
            />
            <div class="currency-options">
              <button
                v-for="currency in filteredCurrencies"
                :key="currency.code"
                type="button"
                class="currency-option"
                :class="{ selected: form.currency === currency.code }"
                @click="chooseCurrency(currency)"
              >
                <span class="currency-code">{{ currency.code }}</span>
                <span>{{ currency.name }}</span>
              </button>
              <span v-if="filteredCurrencies.length === 0" class="currency-empty">No currencies found.</span>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="field-error">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="close">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving…' : editing ? 'Save changes' : 'Create account' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.optional {
  float: right;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.currency-picker {
  position: relative;
}
.currency-trigger {
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 9px;
  color: var(--text);
  text-align: left;
}
.currency-trigger:hover,
.currency-trigger:focus-visible {
  border-color: var(--violet);
}
.currency-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}
.currency-name {
  overflow: hidden;
  color: var(--text-soft);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.currency-chevron {
  margin-left: auto;
  color: var(--text-soft);
  font-size: 17px;
  line-height: 1;
}
.currency-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  padding: 8px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 14px 30px rgba(20, 20, 43, 0.16);
}
.currency-search {
  width: 100%;
  padding: 8px 9px;
  border: 1px solid var(--line);
  border-radius: 7px;
  font-size: 12px;
}
.currency-options {
  max-height: 190px;
  margin-top: 6px;
  overflow-y: auto;
}
.currency-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-soft);
  font-size: 12px;
  text-align: left;
}
.currency-option:hover,
.currency-option.selected {
  background: var(--canvas);
  color: var(--text);
}
.currency-empty {
  display: block;
  padding: 12px 9px;
  color: var(--text-soft);
  font-size: 12px;
}
</style>
