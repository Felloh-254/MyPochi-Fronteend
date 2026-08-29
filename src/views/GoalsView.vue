<script setup>
import { onMounted } from 'vue'
import { useGoalsStore } from '../stores/goals'
import { useUiStore } from '../stores/ui'
import GoalCard from '../components/GoalCard.vue'
import NewGoalModal from '../components/NewGoalModal.vue'
import ContributeGoalModal from '../components/ContributeGoalModal.vue'

const goalsStore = useGoalsStore()
const ui = useUiStore()

onMounted(() => {
  if (goalsStore.items.length === 0) goalsStore.fetch()
})
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Goals</h2>
        <p>Give your savings somewhere to go.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openGoalModal()">+ New goal</button>
    </div>

    <div class="goal-grid" v-if="goalsStore.items.length">
      <GoalCard v-for="g in goalsStore.items" :key="g.id" :goal="g" class="card-grid-enter-active" />
    </div>

    <p v-else class="empty content-enter">No goals yet. Set a target and start chipping away at it.</p>
  </div>

  <NewGoalModal v-if="ui.goalModalOpen" />
  <ContributeGoalModal v-if="ui.contributeModalOpen" />
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
}
.demo-banner {
  background: #fff7e6;
  border: 1px solid #f5d99a;
  color: #8a6420;
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 9px;
}
.goal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
