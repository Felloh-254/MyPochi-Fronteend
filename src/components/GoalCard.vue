<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'
import { goalPct, isGoalComplete, deadlineLabel } from '../utils/goals'
import { useGoalsStore } from '../stores/goals'
import { useUiStore } from '../stores/ui'
import Icon from './Icon.vue'

const props = defineProps({
  goal: { type: Object, required: true },
})

const goalsStore = useGoalsStore()
const ui = useUiStore()

const pct = computed(() => goalPct(props.goal))
const complete = computed(() => isGoalComplete(props.goal))
</script>

<template>
  <div class="card goal-card">
    <div class="goal-card-head">
      <span class="dot" :style="{ background: goal.color }"></span>
      <span class="goal-name">{{ goal.name }}</span>
      <span v-if="complete" class="goal-badge">Reached 🎉</span>
      <button class="icon-btn" @click="goalsStore.remove(goal.id)" aria-label="Delete goal">
        <Icon name="trash" size="15" />
      </button>
    </div>

    <div class="ring-row">
      <svg viewBox="0 0 64 64" class="ring">
        <circle cx="32" cy="32" r="27" fill="none" stroke="var(--canvas)" stroke-width="7" />
        <circle
          class="ring-progress"
          cx="32"
          cy="32"
          r="27"
          fill="none"
          :stroke="goal.color"
          stroke-width="7"
          stroke-linecap="round"
          :stroke-dasharray="2 * Math.PI * 27"
          :stroke-dashoffset="2 * Math.PI * 27 * (1 - pct / 100)"
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="37" text-anchor="middle" class="ring-text">{{ pct }}%</text>
      </svg>
      <div class="goal-amounts">
        <span class="mono">{{ formatCurrency(goal.current_amount) }}</span>
        <span class="text-faint">of {{ formatCurrency(goal.target_amount) }}</span>
        <span class="deadline">{{ deadlineLabel(goal.deadline) }}</span>
      </div>
    </div>

    <button class="btn btn-ghost" style="width: 100%; justify-content: center" @click="ui.openContributeModal(goal.id)">
      + Add contribution
    </button>
  </div>
</template>

<style scoped>
.goal-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.goal-card-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.goal-name {
  font-weight: 600;
  font-size: 14px;
}
.goal-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--mint);
  background: var(--mint-soft);
  padding: 2px 8px;
  border-radius: 20px;
}
.icon-btn {
  margin-left: auto;
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
.ring-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ring {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}
.ring-progress {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.2s ease;
}
.ring-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: var(--text);
}
.goal-amounts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 15px;
  font-weight: 600;
}
.goal-amounts .text-faint {
  font-size: 12px;
  font-weight: 500;
}
.deadline {
  font-size: 11.5px;
  color: var(--text-soft);
  margin-top: 4px;
}
</style>
