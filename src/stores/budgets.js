import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
import { currentMonth } from '../utils/period'

export const useBudgetsStore = defineStore('budgets', {
  state: () => ({
    items: [],
    month: currentMonth(),   // "YYYY-MM"
    loading: false,
    error: null,
  }),

  getters: {
    totalBudgeted: (state) => state.items.reduce((s, b) => s + b.amount, 0),
    totalSpent: (state) => state.items.reduce((s, b) => s + b.spent, 0),
  },

  actions: {
    async fetch(month = this.month) {
      this.month = month
      this.loading = true
      this.error = null
      try {
        const payload = await api.getBudgets(month)
        this.items = Array.isArray(payload) ? payload : (payload?.items ?? [])
      } catch (e) {
        this.items = []
        this.error = e.message
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
          throw e
        }
        throw e
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const body = { ...payload, month: this.month }
        const created = await api.createBudget(body)
        this.items.push(created)
        return created
      } catch (e) {
        this.error = e.message || 'Could not create budget.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const updated = await api.updateBudget(id, { ...payload, month: this.month })
        const idx = this.items.findIndex((b) => b.id === id)
        if (idx > -1) this.items[idx] = updated
        return updated
      } catch (e) {
        this.error = e.message || 'Could not update budget.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async remove(id) {
      await api.deleteBudget(id)
      this.items = this.items.filter((b) => b.id !== id)
    },

    // Clones last month's budgets into the currently-viewed month and
    // reloads so the UI picks up the new rows.
    async copyFromPreviousMonth() {
      await api.copyBudgets(this.month)
      await this.fetch(this.month)
    },
  },
})
