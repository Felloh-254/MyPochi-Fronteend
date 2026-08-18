import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useSummaryStore = defineStore('summary', {
  state: () => ({
    monthlyData: [],
    loading: false,
    error: null,
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
        this.monthlyData = []
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
