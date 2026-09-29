import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export const useSummaryStore = defineStore('summary', {
  state: () => ({
    monthlyData: [],
    budgetStats: [],
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetch(month) {
      this.loading = true
      this.error = null
      try {
        const data = await api.getSummary(month)
        // Backend returns the full Summary object:
        //   { total_income, total_expenses, balance, budget_stats, monthly_data }
        const monthlyData = Array.isArray(data?.monthly_data) ? data.monthly_data : []
        this.monthlyData = [...monthlyData].reverse()
        this.budgetStats = Array.isArray(data?.budget_stats) ? data.budget_stats : []
        this.totalIncome = data?.total_income ?? 0
        this.totalExpenses = data?.total_expenses ?? 0
        this.balance = data?.balance ?? 0
      } catch (e) {
        this.monthlyData = []
        this.budgetStats = []
        this.totalIncome = 0
        this.totalExpenses = 0
        this.balance = 0
        this.error = e.message
        if (e instanceof ApiError && (e.status === 401 || e.status === 403 || e.status === 404)) {
          throw e
        }
      } finally {
        this.loading = false
      }
    },
  },
})