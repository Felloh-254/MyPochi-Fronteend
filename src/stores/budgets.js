import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
import { currentPeriod, shiftPeriod } from '../utils/period'

export const useBudgetsStore = defineStore('budgets', {
  state: () => ({
    items: [],
    period: currentPeriod(),
    loading: false,
    error: null,
    history: [],
    historyLoading: false,
  }),

  getters: {
    totalBudgeted: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items.reduce((s, b) => s + b.amount, 0)
    },
    totalSpent: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items.reduce((s, b) => s + b.spent, 0)
    },
  },

  actions: {
    async fetch(period = this.period) {
      this.period = period
      this.loading = true
      this.error = null
      try {
        this.items = await api.getBudgets(period)
        this.isDemo = false
      } catch (e) {
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
          this.items = []
          this.error = e.message
          throw e
        }
        this.items = []
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async fetchHistory(months = 6) {
      this.historyLoading = true
      try {
        this.history = await api.getBudgetHistory(months)
      } catch (e) {
        this.history = []
        this.error = e.message
      } finally {
        this.historyLoading = false
      }
    },

    async create(payload) {
      const body = { ...payload, period: this.period }
      const created = await api.createBudget(body)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      const updated = await api.updateBudget(id, payload)
      const idx = this.items.findIndex((b) => b.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      await api.deleteBudget(id)
      this.items = this.items.filter((b) => b.id !== id)
    },

    async copyFromPreviousMonth() {
      const previousPeriod = shiftPeriod(this.period, -1)
      this.items = await api.copyBudgets(previousPeriod, this.period)
    },
  },
})
