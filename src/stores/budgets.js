import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_BUDGETS, DEMO_BUDGET_HISTORY } from '../services/demoData'
import { currentPeriod, shiftPeriod } from '../utils/period'

export const useBudgetsStore = defineStore('budgets', {
  state: () => ({
    items: [],
    period: currentPeriod(),
    loading: false,
    error: null,
    isDemo: false,
    history: [],
    historyLoading: false,
  }),

  getters: {
    totalBudgeted: (state) => state.items.reduce((s, b) => s + b.amount, 0),
    totalSpent: (state) => state.items.reduce((s, b) => s + b.spent, 0),
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
        // Demo mode: only the real current month starts populated, so
        // browsing into other months shows the "copy last month" prompt
        // the way a first-time real user would see it.
        this.items = period === currentPeriod() ? DEMO_BUDGETS.map((b) => ({ ...b, period })) : []
        this.isDemo = true
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
        this.history = DEMO_BUDGET_HISTORY
      } finally {
        this.historyLoading = false
      }
    },

    async create(payload) {
      const body = { ...payload, period: this.period }
      if (this.isDemo) {
        const local = { id: Date.now(), spent: 0, ...body }
        this.items.push(local)
        return local
      }
      const created = await api.createBudget(body)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      if (this.isDemo) {
        const idx = this.items.findIndex((b) => b.id === id)
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...payload }
        return this.items[idx]
      }
      const updated = await api.updateBudget(id, payload)
      const idx = this.items.findIndex((b) => b.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      if (!this.isDemo) await api.deleteBudget(id)
      this.items = this.items.filter((b) => b.id !== id)
    },

    async copyFromPreviousMonth() {
      const previousPeriod = shiftPeriod(this.period, -1)
      if (this.isDemo) {
        // No real "previous month" to copy in demo mode — stand in with
        // the seed budgets so the flow still demonstrates itself.
        this.items = DEMO_BUDGETS.map((b) => ({ ...b, id: Date.now() + Math.random(), spent: 0, period: this.period }))
        return
      }
      this.items = await api.copyBudgets(previousPeriod, this.period)
    },
  },
})
