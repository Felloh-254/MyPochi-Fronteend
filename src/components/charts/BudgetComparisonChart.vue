<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { formatPeriodShort } from '../../utils/period'

const props = defineProps({
  history: { type: Array, required: true }, // [{ month, income, expense }]
})

const chartData = computed(() => ({
  labels: props.history.map((h) => formatPeriodShort(h.month)),
  datasets: [
    {
      label: 'Income',
      data: props.history.map((h) => h.income),
      backgroundColor: '#E4F9EC',
      borderRadius: 4,
    },
    {
      label: 'Expenses',
      data: props.history.map((h) => h.expense),
      backgroundColor: '#7C6FEE',
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
