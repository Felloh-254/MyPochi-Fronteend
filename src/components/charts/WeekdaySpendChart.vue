<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps({
  // { Mon: 1200, Tue: 300, ... }
  byWeekday: { type: Object, required: true },
})

const chartData = computed(() => ({
  labels: Object.keys(props.byWeekday),
  datasets: [
    {
      label: 'Spent',
      data: Object.values(props.byWeekday),
      backgroundColor: '#7C6FEE',
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: '#EFEFF6' },
      ticks: { font: { family: 'JetBrains Mono', size: 10.5 }, color: '#9C9CB4', callback: (v) => 'Ksh ' + v },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter', size: 11.5 }, color: '#6C6C86' },
    },
  },
}
</script>

<template>
  <div style="height: 200px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
