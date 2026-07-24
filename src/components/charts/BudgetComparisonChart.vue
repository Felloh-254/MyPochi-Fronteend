<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { formatPeriodShort } from '../../utils/period'

const props = defineProps({
  history: { type: Array, required: true }, // [{ period, budgeted, spent }]
})

const chartData = computed(() => ({
  labels: props.history.map((h) => formatPeriodShort(h.period)),
  datasets: [
    {
      label: 'Budgeted',
      data: props.history.map((h) => h.budgeted),
      backgroundColor: '#E4E1FC',
      borderRadius: 4,
    },
    {
      label: 'Spent',
      data: props.history.map((h) => h.spent),
      backgroundColor: (ctx) => {
        const h = props.history[ctx.dataIndex]
        return h && h.spent > h.budgeted ? '#F0576B' : '#7C6FEE'
      },
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 7, font: { family: 'Inter', size: 11.5 }, color: '#6C6C86' },
    },
  },
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
  <div style="height: 220px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
