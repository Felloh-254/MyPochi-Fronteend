import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    sorted: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return [...items].sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    recent: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return [...items].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
    },
    totalIncome: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    },
    totalExpenses: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    },
    balance() {
      return this.totalIncome - this.totalExpenses
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.items = await api.getTransactions('?limit=200')
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

    async create(payload) {
      const created = await api.createTransaction(payload)
      this.items.unshift(created)
      return created
    },

    async update(id, payload) {
      const updated = await api.updateTransaction(id, payload)
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      await api.deleteTransaction(id)
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
