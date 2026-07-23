<script setup>
import Icon from './Icon.vue'

defineProps({
  title: { type: String, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
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
  background: rgba(20, 20, 43, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 420px;
  max-width: 100%;
  padding: 26px;
  box-shadow: 0 20px 60px rgba(20, 20, 43, 0.25);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.modal-head h3 {
  font-size: 17px;
}
.icon-btn {
  background: none;
  border: none;
  color: var(--text-faint);
  padding: 4px;
  border-radius: 6px;
}
.icon-btn:hover {
  background: var(--canvas);
  color: var(--rose);
}
</style>
