<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { formatMonth } from '../../utils/format'

const props = defineProps({
  monthlyData: { type: Array, required: true },
})

const chartData = computed(() => ({
  labels: props.monthlyData.map((m) => formatMonth(m.month)),
  datasets: [
    {
      label: 'Income',
      data: props.monthlyData.map((m) => m.income),
      borderColor: '#37C871',
      backgroundColor: 'rgba(55,200,113,.08)',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#37C871',
    },
    {
      label: 'Expenses',
      data: props.monthlyData.map((m) => m.expense),
      borderColor: '#7C6FEE',
      backgroundColor: 'rgba(124,111,238,.08)',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#7C6FEE',
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
      ticks: { font: { family: 'JetBrains Mono', size: 10.5 }, color: '#9C9CB4', callback: (v) => '$' + v },
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
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
