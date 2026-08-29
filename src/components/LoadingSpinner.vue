<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
  },
  label: {
    type: String,
    default: 'Loading...',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="['spinner-container', { fullscreen }]">
    <div :class="['spinner', size]">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="label" class="spinner-label">{{ label }}</p>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
}

.spinner-container.fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(245, 245, 250, 0.95);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

.spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner.small {
  width: 24px;
  height: 24px;
}

.spinner.large {
  width: 56px;
  height: 56px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--line);
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner.small .spinner-ring {
  border-width: 2px;
}

.spinner.large .spinner-ring {
  border-width: 4px;
}

.spinner-ring:nth-child(1) {
  border-color: var(--violet);
  border-right-color: transparent;
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  border-color: var(--teal);
  border-right-color: transparent;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  border-color: var(--mint);
  border-right-color: transparent;
  animation-delay: -0.15s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-label {
  font-size: 13px;
  color: var(--text-soft);
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>
