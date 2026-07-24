import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_GOALS } from '../services/demoData'
import { useTransactionsStore } from './transactions'

export const useGoalsStore = defineStore('goals', {
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
        this.items = await api.getGoals()
        this.isDemo = false
      } catch (e) {
        this.items = DEMO_GOALS
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      if (this.isDemo) {
        const local = { id: Date.now(), current_amount: 0, ...payload }
        this.items.push(local)
        return local
      }
      const created = await api.createGoal(payload)
      this.items.push(created)
      return created
    },

    async remove(id) {
      if (!this.isDemo) await api.deleteGoal(id)
      this.items = this.items.filter((g) => g.id !== id)
    },

    // Adds a contribution to a goal and, unless skipped, records it as a
    // real expense transaction so the money moving toward the goal shows
    // up in the ledger too — this is the "link contributions to
    // transactions" behavior.
    async contribute(id, amount, { accountId, createTransaction = true } = {}) {
      const goal = this.items.find((g) => g.id === id)
      if (!goal) return

      if (createTransaction && accountId) {
        const transactions = useTransactionsStore()
        await transactions.create({
          title: `Goal contribution: ${goal.name}`,
          amount,
          type: 'expense',
          category: 'Savings',
          account_id: accountId,
          date: new Date().toISOString().slice(0, 10),
          note: `Contribution toward "${goal.name}"`,
        })
      }

      if (this.isDemo) {
        goal.current_amount += amount
        return goal
      }
      const updated = await api.contributeToGoal(id, { amount })
      const idx = this.items.findIndex((g) => g.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },
  },
})
