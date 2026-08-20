<script setup>
import Icon from './Icon.vue'

defineProps({
  title: { type: String, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
      <div class="modal-head">
        <h3>{{ title }}</h3>
        <button class="icon-btn" @click="emit('close')" aria-label="Close">
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
  background: rgba(20, 20, 43, 0.58);
  backdrop-filter: blur(7px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 24px;
}
.modal {
  position: relative;
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  width: 480px;
  max-width: 100%;
  max-height: min(720px, calc(100vh - 48px));
  overflow-y: auto;
  padding: 28px;
  box-shadow: 0 28px 80px rgba(20, 20, 43, 0.3), 0 4px 16px rgba(20, 20, 43, 0.08);
  animation: modal-in 0.18s ease-out;
}
.modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 28px;
  right: 28px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(90deg, var(--violet), var(--teal));
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.modal-head h3 {
  font-size: 21px;
  line-height: 1.15;
  color: var(--ink);
}
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
@media (max-width: 520px) {
  .modal-overlay {
    padding: 14px;
  }
  .modal {
    padding: 24px 20px;
    max-height: calc(100vh - 28px);
  }
  .modal::before {
    left: 20px;
    right: 20px;
  }
}
</style>
