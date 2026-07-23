<script setup>
import { reactive, computed } from 'vue'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import { ACCOUNT_TYPES } from '../utils/accountTypes'
import BaseModal from './BaseModal.vue'

const accountsStore = useAccountsStore()
const ui = useUiStore()

const palette = ['#7C6FEE', '#37C871', '#2DD4BF', '#F5A623', '#F0576B', '#5B4FD1']

function emptyForm() {
  return {
    name: '',
    type: 'bank',
    starting_balance: null,
    color: palette[accountsStore.items.length % palette.length],
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => accountsStore.loading)
const error = computed(() => (accountsStore.error && !accountsStore.isDemo ? accountsStore.error : null))

function close() {
  ui.accountModalOpen = false
}

async function submit() {
  try {
    await accountsStore.create({ ...form, starting_balance: Number(form.starting_balance) || 0 })
    Object.assign(form, emptyForm())
    close()
  } catch (e) {
    // error captured on the store; leave the modal open
  }
}
</script>

<template>
  <BaseModal title="New account" @close="close">
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
          <label>Starting balance</label>
          <input v-model.number="form.starting_balance" type="number" step="0.01" placeholder="0.00" />
        </div>
      </div>

      <div class="field">
        <label>Color</label>
        <div class="swatches">
          <button
            v-for="c in palette"
            :key="c"
            type="button"
            class="swatch"
            :class="{ selected: form.color === c }"
            :style="{ background: c }"
            :aria-label="'Choose ' + c"
            @click="form.color = c"
          ></button>
        </div>
      </div>

      <p v-if="error" class="field-error">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="close">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Create account' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.swatches {
  display: flex;
  gap: 8px;
}
.swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
}
.swatch.selected {
  border-color: var(--ink);
}
</style>
