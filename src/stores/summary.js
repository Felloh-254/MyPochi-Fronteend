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
        const monthlyData = Array.isArray(data?.monthly_data)
          ? data.monthly_data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : []
        this.monthlyData = [...monthlyData].reverse()
      } catch (e) {
        this.monthlyData = []
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
