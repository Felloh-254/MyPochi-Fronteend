<script setup>
import { reactive, computed } from 'vue'
import { useBudgetsStore } from '../stores/budgets'
import { useUiStore } from '../stores/ui'
import BaseModal from './BaseModal.vue'

const budgetsStore = useBudgetsStore()
const ui = useUiStore()

const palette = ['#7C6FEE', '#37C871', '#2DD4BF', '#F5A623', '#F0576B', '#5B4FD1']

function emptyForm() {
  return {
    name: '',
    category: '',
    amount: null,
    color: palette[budgetsStore.items.length % palette.length],
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => budgetsStore.loading)
const error = computed(() => (budgetsStore.error && !budgetsStore.isDemo ? budgetsStore.error : null))

function close() {
  ui.budgetModalOpen = false
}

async function submit() {
  try {
    await budgetsStore.create({ ...form, amount: Number(form.amount) })
    Object.assign(form, emptyForm())
    close()
  } catch (e) {
    // error captured on the store; leave the modal open
  }
}
</script>

<template>
  <BaseModal title="New budget" @close="close">
    <form @submit.prevent="submit">
      <div class="field">
        <label>Name</label>
        <input v-model="form.name" placeholder="e.g. Groceries" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Category</label>
          <input v-model="form.category" placeholder="e.g. Food" required />
        </div>
        <div class="field">
          <label>Monthly cap</label>
          <input v-model.number="form.amount" type="number" min="1" step="1" placeholder="0" required />
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
          {{ submitting ? 'Saving…' : 'Create budget' }}
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
