import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_MONTHLY_DATA } from '../services/demoData'

export const useSummaryStore = defineStore('summary', {
  state: () => ({
    monthlyData: [],
    loading: false,
    error: null,
    isDemo: false,
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const data = await api.getSummary()
        this.monthlyData = [...data.monthly_data].reverse() // API returns newest-first
        this.isDemo = false
      } catch (e) {
        this.monthlyData = DEMO_MONTHLY_DATA
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
