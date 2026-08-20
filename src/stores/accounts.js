import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
import { useTransactionsStore } from './transactions'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Balance = starting balance + everything posted against this account.
    // Kept derived (not stored) so it's always consistent with the
    // transaction list, in both live and demo data.
    balanceFor: (state) => (accountId) => {
      const items = Array.isArray(state.items) ? state.items : []
      const account = items.find((a) => a.id === accountId)
      if (!account) return 0
      const transactions = useTransactionsStore()
      const transactionItems = Array.isArray(transactions.items) ? transactions.items : []
      const net = transactionItems
        .filter((t) => t.account_id === accountId)
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      return (account.balance ?? account.starting_balance ?? 0) + net
    },

    totalBalance() {
      const items = Array.isArray(this.items) ? this.items : []
      return items.reduce((sum, a) => sum + this.balanceFor(a.id), 0)
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const payload = await api.getAccounts()
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.accounts)
              ? payload.accounts
              : []
        this.items = items
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
      const created = await api.createAccount(payload)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      const updated = await api.updateAccount(id, payload)
      const idx = this.items.findIndex((a) => a.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      await api.deleteAccount(id)
      this.items = this.items.filter((a) => a.id !== id)
    },
  },
})
