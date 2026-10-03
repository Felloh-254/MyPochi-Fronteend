<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useGoalsStore } from '../stores/goals'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import { formatCurrency } from '../utils/format'
import BaseModal from './BaseModal.vue'

const goalsStore = useGoalsStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()

onMounted(() => {
  if (accountsStore.items.length === 0) accountsStore.fetch()
})

const goal = computed(() => goalsStore.items.find((g) => g.id === ui.contributeGoalId))
const submitting = ref(false)
const error = computed(() => goalsStore.error)

const form = reactive({
  amount: null,
  account_id: null,
  logTransaction: true,
})

function close() {
  ui.contributeModalOpen = false
  ui.contributeGoalId = null
}

async function submit() {
  if (submitting.value) return
  if (!goal.value) return close()
  submitting.value = true
  try {
    await goalsStore.contribute(goal.value.id, Number(form.amount), {
      accountId: form.logTransaction ? form.account_id : null,
      createTransaction: form.logTransaction,
    })
    form.amount = null
    close()
  } catch {
    // The store exposes the API error; keep the form open for correction.
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal v-if="goal" :title="`Add to “${goal.name}”`" @close="close">
    <form @submit.prevent="submit">
      <p class="progress-note">
        Currently <span class="mono">{{ formatCurrency(goal.current_amount) }}</span> of
        <span class="mono">{{ formatCurrency(goal.target_amount) }}</span>
      </p>

      <div class="field">
        <label>Amount to add</label>
        <input v-model.number="form.amount" type="number" min="1" step="1" placeholder="0" required />
      </div>

      <label class="checkbox-row">
        <input v-model="form.logTransaction" type="checkbox" />
        Also record this as a transaction
      </label>

      <div class="field" v-if="form.logTransaction">
        <label>From account</label>
        <select v-model.number="form.account_id" required>
          <option v-for="a in accountsStore.items" :key="a.id" :value="a.id">{{ a.name }}</option>
        </select>
      </div>

      <p v-if="error" class="field-error" role="alert">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" :disabled="submitting" @click="close">Cancel</button>
        <button type="submit" class="btn btn-primary submit-button" :disabled="submitting" :aria-busy="submitting">
          <span v-if="submitting" class="btn-spinner" aria-hidden="true"></span>
          {{ submitting ? 'Saving…' : 'Add contribution' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.progress-note {
  font-size: 13px;
  color: var(--text-soft);
  margin-bottom: 16px;
}
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-soft);
  margin-bottom: 14px;
}
</style>
