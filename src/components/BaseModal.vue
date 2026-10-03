<script setup>
import Icon from './Icon.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  // Block backdrop-click and the ✕ button from closing the modal — used
  // while a request is in flight so a stray click can't discard it.
  preventClose: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

function requestClose() {
  if (props.preventClose) return
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="requestClose">
    <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
      <div class="modal-head">
        <div class="modal-heading">
          <h3>{{ title }}</h3>
          <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
        </div>
        <button class="icon-btn" @click="requestClose" :disabled="preventClose" aria-label="Close">
          <Icon name="close" size="16" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 43, 0.48);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  overflow: hidden;
}
.modal {
  position: relative;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  width: min(520px, 100%);
  max-width: calc(100vw - 32px);
  min-width: 0;
  max-height: none;
  overflow: visible;
  padding: 24px;
  box-shadow: 0 20px 56px rgba(20, 20, 43, 0.2), 0 3px 10px rgba(20, 20, 43, 0.05);
  animation: modal-in 0.18s ease-out;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}
.modal-head h3 {
  font-size: 20px;
  line-height: 1.15;
  color: var(--ink);
}
.modal-heading { min-width: 0; }
.modal :deep(.field-row) { grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
.modal :deep(.field-row > *) { min-width: 0; }
.modal :deep(.field-row) { gap: 10px; }
.modal :deep(input), .modal :deep(select), .modal :deep(textarea) { max-width: 100%; min-width: 0; }
.modal :deep(.modal-actions) { flex-wrap: wrap; }
.modal-subtitle { margin-top: 7px; color: var(--text-soft); font-size: 13px; line-height: 1.5; }
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--canvas);
  border: 1px solid var(--line);
  color: var(--text-faint);
  padding: 0;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.icon-btn:hover {
  background: var(--rose-soft);
  border-color: transparent;
  color: var(--rose);
}
.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.icon-btn:disabled:hover {
  background: var(--canvas);
  border-color: var(--line);
  color: var(--text-faint);
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (max-height: 720px) {
  .modal { padding-top: 18px; padding-bottom: 18px; }
  .modal-head { margin-bottom: 12px; }
  .modal :deep(.field) { margin-bottom: 9px; gap: 4px; }
  .modal :deep(.field input), .modal :deep(.field select), .modal :deep(.field textarea) { min-height: 38px; padding-top: 8px; padding-bottom: 8px; }
  .modal :deep(.modal-actions) { margin-top: 12px; padding-top: 12px; }
}
@media (max-width: 520px) {
  .modal-overlay {
    padding: 12px;
  }
  .modal {
    width: 100%;
    max-width: calc(100vw - 24px);
    padding: 22px 18px 18px;
    border-radius: 14px;
  }
}
</style>
