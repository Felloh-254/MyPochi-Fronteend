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
      return items
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + (t.amount || 0), 0)
    },
    totalExpenses: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + (t.amount || 0), 0)
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
        const payload = await api.getTransactions('?limit=200')
        let items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.transactions)
              ? payload.transactions
              : []
        
        // Transform each transaction to ensure it has the required fields for UI display
        items = items.map((t) => {
          // If this is a full TransactionDetail response (with entries), enrich with convenience fields
          if (t.entries && Array.isArray(t.entries) && t.entries.length > 0) {
            return {
              ...t,
              // Add convenience fields for UI compatibility
              account_id: t.entries[0].account_id,
              amount: Math.abs(t.entries[0].amount || 0),
              category: t.categories && t.categories.length > 0 ? t.categories[0].name : '',
            }
          }
          // If this is a basic transaction (from /api/transactions list), 
          // ensure it has the fields the UI expects, using fallback values
          return {
            ...t,
            account_id: t.account_id ?? null,
            amount: t.amount ?? 0,
            category: t.category ?? '',
            entries: t.entries || [],
            categories: t.categories || [],
          }
        })
        
        this.items = items
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
      const { type, ...rest } = payload
      const idempotencyKey = crypto.randomUUID()
      
      let created
      if (type === 'income') {
        created = await api.createIncome({ ...rest, idempotency_key: idempotencyKey })
      } else if (type === 'expense') {
        created = await api.createExpense({ ...rest, idempotency_key: idempotencyKey })
      } else if (type === 'transfer') {
        created = await api.createTransfer({ ...rest, idempotency_key: idempotencyKey })
      } else {
        throw new ApiError('Unknown transaction type', 400)
      }
      
      // Enrich the response with convenience fields for UI compatibility
      const enriched = {
        ...created,
        account_id: created.entries?.[0]?.account_id ?? null,
        amount: Math.abs(created.entries?.[0]?.amount ?? 0),
        category: created.categories && created.categories.length > 0 ? created.categories[0].name : '',
      }
      
      this.items.unshift(enriched)
      return enriched
    },

    async remove(id) {
      await api.deleteTransaction(id)
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
