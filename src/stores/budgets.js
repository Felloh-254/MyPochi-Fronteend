import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_BUDGETS } from '../services/demoData'

export const useBudgetsStore = defineStore('budgets', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    isDemo: false,
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.items = await api.getBudgets()
        this.isDemo = false
      } catch (e) {
        this.items = DEMO_BUDGETS
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      if (this.isDemo) {
        // No live API to persist to — keep the demo interactive anyway.
        const local = { id: Date.now(), spent: 0, ...payload }
        this.items.push(local)
        return local
      }
      const created = await api.createBudget(payload)
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
  },
})
