<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'error', // 'error', 'warning', 'info'
  },
  dismissible: {
    type: Boolean,
    default: true,
  },
  action: {
    type: Object,
    default: null, // { label: 'Retry', handler: () => {} }
  },
})

const emit = defineEmits(['dismiss'])
const dismissed = ref(false)

function handleDismiss() {
  dismissed.value = true
  emit('dismiss')
}

function handleAction() {
  if (props.action?.handler) {
    props.action.handler()
  }
}
</script>

<template>
  <div v-if="!dismissed" :class="['error-alert', type]" role="alert">
    <div class="alert-content">
      <div class="alert-icon">
        <Icon :name="type === 'error' ? 'alertCircle' : type === 'warning' ? 'alertTriangle' : 'info'" size="18" />
      </div>
      <div class="alert-message">
        <p class="alert-text">{{ message }}</p>
      </div>
      <div class="alert-actions">
        <button v-if="action" class="btn-action" @click="handleAction">
          {{ action.label }}
        </button>
        <button v-if="dismissible" class="btn-dismiss" @click="handleDismiss" aria-label="Dismiss alert">
          <Icon name="x" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-alert {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid;
  background: #fde8eb;
  border-color: #f5a6b4;
  animation: slideInDown 0.3s ease-out;
}

.error-alert.warning {
  background: #fff7e6;
  border-color: #f5d99a;
}

.error-alert.info {
  background: #e8f5ff;
  border-color: #a6d9f5;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
}

.alert-icon {
  flex-shrink: 0;
  color: var(--rose);
  display: flex;
  align-items: center;
}

.error-alert.warning .alert-icon {
  color: var(--amber);
}

.error-alert.info .alert-icon {
  color: var(--teal);
}

.alert-message {
  flex: 1;
  min-width: 0;
}

.alert-text {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #8a3a47;
  line-height: 1.4;
}

.error-alert.warning .alert-text {
  color: #8a6420;
}

.error-alert.info .alert-text {
  color: #2a5a7a;
}

.alert-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: var(--rose);
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-action:hover {
  background: #e64558;
}

.error-alert.warning .btn-action {
  background: var(--amber);
}

.error-alert.warning .btn-action:hover {
  background: #d89410;
}

.error-alert.info .btn-action {
  background: var(--teal);
}

.error-alert.info .btn-action:hover {
  background: #23b8a8;
}

.btn-dismiss {
  padding: 4px;
  border: none;
  background: none;
  color: var(--text-faint);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-dismiss:hover {
  background: rgba(0, 0, 0, 0.08);
  color: var(--text);
}
</style>
