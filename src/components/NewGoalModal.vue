<script setup>
import { reactive, computed } from 'vue'
import { useGoalsStore } from '../stores/goals'
import { useUiStore } from '../stores/ui'
import BaseModal from './BaseModal.vue'

const goalsStore = useGoalsStore()
const ui = useUiStore()

const palette = ['#7C6FEE', '#37C871', '#2DD4BF', '#F5A623', '#F0576B', '#5B4FD1']

function emptyForm() {
  return {
    name: '',
    target_amount: null,
    deadline: '',
    color: palette[goalsStore.items.length % palette.length],
  }
}

const form = reactive(emptyForm())
const submitting = computed(() => goalsStore.loading)
const error = computed(() => (goalsStore.error && !goalsStore.isDemo ? goalsStore.error : null))

function close() {
  ui.goalModalOpen = false
}

async function submit() {
  try {
    await goalsStore.create({ ...form, target_amount: Number(form.target_amount), current_amount: 0 })
    Object.assign(form, emptyForm())
    close()
  } catch (e) {
    // error captured on the store; leave the modal open
  }
}
</script>

<template>
  <BaseModal title="New goal" @close="close">
    <form @submit.prevent="submit">
      <div class="field">
        <label>Goal name</label>
        <input v-model="form.name" placeholder="e.g. Emergency fund" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Target amount</label>
          <input v-model.number="form.target_amount" type="number" min="1" step="1" placeholder="0" required />
        </div>
        <div class="field">
          <label>Deadline</label>
          <input v-model="form.deadline" type="date" required />
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
          {{ submitting ? 'Saving…' : 'Create goal' }}
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
