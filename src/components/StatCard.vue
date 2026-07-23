<script setup>
import { formatCurrency } from '../utils/format'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  variant: { type: String, default: 'default' }, // 'hero' | 'positive' | 'negative' | 'default'
  delta: { type: String, default: '' },
})
</script>

<template>
  <div class="card stat" :class="variant">
    <span class="card-label">{{ label }}</span>
    <span class="figure mono">{{ formatCurrency(value) }}</span>
    <span v-if="delta" class="delta" :class="value >= 0 ? 'up' : 'down'">{{ delta }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.figure {
  font-size: 26px;
  font-weight: 600;
}
.stat.positive .figure {
  color: var(--mint);
}
.stat.negative .figure {
  color: var(--rose);
}

.stat.hero {
  background: var(--ink);
  border-color: var(--ink);
}
.stat.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.14);
  margin-top: 64px;
  pointer-events: none;
}
.stat.hero .card-label {
  color: #a6a6d0;
}
.stat.hero .figure {
  font-size: 34px;
  color: #fff;
}
.delta {
  display: inline-block;
  margin-top: 10px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  width: fit-content;
}
.delta.up {
  background: rgba(55, 200, 113, 0.18);
  color: #5fe092;
}
.delta.down {
  background: rgba(240, 87, 107, 0.18);
  color: #f9899a;
}
</style>
