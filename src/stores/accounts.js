import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Balance comes straight from the backend.
    // The backend updates account_balances transactionally (with a version
    // column), so it is the single source of truth. Do NOT add transaction
    // netting here — that double-counts every ledger entry.
    balanceFor: (state) => (accountId) => {
      const items = Array.isArray(state.items) ? state.items : []
      const account = items.find((a) => a.id === accountId)
      if (!account) return 0
      return account.balance ?? account.starting_balance ?? 0
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
        const created = await api.createAccount(payload)
        this.items.push(created)
        return created
      } catch (e) {
        this.error = e.message || 'Could not create account.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const updated = await api.updateAccount(id, payload)
        const idx = this.items.findIndex((a) => a.id === id)
        if (idx > -1) this.items[idx] = updated
        return updated
      } catch (e) {
        this.error = e.message || 'Could not update account.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async remove(id) {
      await api.deleteAccount(id)
      this.items = this.items.filter((a) => a.id !== id)
    },
  },
})
