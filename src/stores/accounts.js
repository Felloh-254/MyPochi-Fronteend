import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_ACCOUNTS } from '../services/demoData'
import { useTransactionsStore } from './transactions'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    isDemo: false,
  }),

  getters: {
    // Balance = starting balance + everything posted against this account.
    // Kept derived (not stored) so it's always consistent with the
    // transaction list, in both live and demo data.
    balanceFor: (state) => (accountId) => {
      const account = state.items.find((a) => a.id === accountId)
      if (!account) return 0
      const transactions = useTransactionsStore()
      const net = transactions.items
        .filter((t) => t.account_id === accountId)
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      return (account.starting_balance || 0) + net
    },

    totalBalance() {
      return this.items.reduce((sum, a) => sum + this.balanceFor(a.id), 0)
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.items = await api.getAccounts()
        this.isDemo = false
      } catch (e) {
        this.items = DEMO_ACCOUNTS
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      if (this.isDemo) {
        const local = { id: Date.now(), ...payload }
        this.items.push(local)
        return local
      }
      const created = await api.createAccount(payload)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      if (this.isDemo) {
        const idx = this.items.findIndex((a) => a.id === id)
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...payload }
        return this.items[idx]
      }
      const updated = await api.updateAccount(id, payload)
      const idx = this.items.findIndex((a) => a.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      if (!this.isDemo) await api.deleteAccount(id)
      this.items = this.items.filter((a) => a.id !== id)
    },
  },
})
