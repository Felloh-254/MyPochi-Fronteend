import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
// NOTE: no top-level import of './accounts' here — it's loaded lazily inside
// _refreshAccounts to avoid a circular dependency between the two stores.

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
        .reduce((total, t) => {
          const transactionCost = Number(t.transaction_cost) || 0
          if (t.type === 'expense') return total + (Number(t.amount) || 0) + transactionCost
          if (t.type === 'transfer') return total + transactionCost
          return total
        }, 0)
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

        // Normalize transaction details and list items for consistent display.
        items = items.map((t) => {
          const transaction = t.transaction ?? t
          const entries = t.entries ?? transaction.entries ?? []
          const categories = t.categories ?? transaction.categories ?? []
          return {
            ...t,
            ...transaction,
            account_id: transaction.account_id
              ?? transaction.from_account_id
              ?? entries[0]?.account_id
              ?? null,
            amount: transaction.amount ?? t.amount ?? Math.abs(entries[0]?.amount ?? 0),
            transaction_cost: Number(transaction.transaction_cost ?? t.transaction_cost) || 0,
            category: transaction.category ?? categories[0]?.name ?? '',
            entries,
            categories,
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

    // Call this after any mutation that changes account balances.
    // Lazy import avoids a top-level circular dependency with accounts.js.
    async _refreshAccounts() {
      try {
        const { useAccountsStore } = await import('./accounts')
        await useAccountsStore().fetch()
      } catch (e) {
        // Don't fail the transaction if the refresh fails — the write
        // already succeeded. Log it so the UI can retry if needed.
        console.error('[transactions] account refresh after mutation failed:', e)
      }
    },

    async create(payload) {
      this.loading = true
      this.error = null
      try {
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

        const transaction = created.transaction ?? created
        const entries = created.entries ?? transaction.entries ?? []
        const categories = created.categories ?? transaction.categories ?? []
        const enriched = {
          ...created,
          ...transaction,
          account_id: transaction.account_id
            ?? transaction.from_account_id
            ?? entries[0]?.account_id
            ?? null,
          amount: transaction.amount ?? Math.abs(entries[0]?.amount ?? 0),
          transaction_cost: Number(transaction.transaction_cost) || 0,
          category: transaction.category ?? categories[0]?.name ?? '',
          entries,
          categories,
        }

        this.items.unshift(enriched)

        await this._refreshAccounts()   // <-- auto-refetch balances
        return enriched
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async remove(id) {
      await api.deleteTransaction(id)
      this.items = this.items.filter((t) => t.id !== id)
      await this._refreshAccounts()   // <-- reversal changes balances
    },
  },
})