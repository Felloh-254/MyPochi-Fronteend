import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_TRANSACTIONS } from '../services/demoData'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    isDemo: false,
  }),

  getters: {
    sorted: (state) => [...state.items].sort((a, b) => new Date(b.date) - new Date(a.date)),
    recent: (state) => [...state.items].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    totalIncome: (state) => state.items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    totalExpenses: (state) => state.items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
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
        this.items = DEMO_TRANSACTIONS
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      if (this.isDemo) {
        const local = { id: Date.now(), ...payload }
        this.items.unshift(local)
        return local
      }
      const created = await api.createTransaction(payload)
      this.items.unshift(created)
      return created
    },

    async update(id, payload) {
      if (this.isDemo) {
        const idx = this.items.findIndex((t) => t.id === id)
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...payload }
        return this.items[idx]
      }
      const updated = await api.updateTransaction(id, payload)
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      if (!this.isDemo) await api.deleteTransaction(id)
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
