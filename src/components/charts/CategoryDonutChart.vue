<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'

const props = defineProps({
  budgets: { type: Array, required: true },
})

const chartData = computed(() => ({
  labels: props.budgets.map((b) => b.name),
  datasets: [
    {
      data: props.budgets.map((b) => b.spent),
      backgroundColor: props.budgets.map((b) => b.color),
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: { legend: { display: false } },
}
</script>

<template>
  <div style="height: 200px">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
