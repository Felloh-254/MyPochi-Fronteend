import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export const useGoalsStore = defineStore('goals', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const payload = await api.getGoals()
        this.items = Array.isArray(payload) ? payload : (payload?.items ?? [])
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
        const created = await api.createGoal(payload)
        this.items.push(created)
        return created
      } catch (e) {
        this.error = e.message || 'Could not create goal.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const updated = await api.updateGoal(id, payload)
        const idx = this.items.findIndex((g) => g.id === id)
        if (idx > -1) this.items[idx] = updated
        return updated
      } catch (e) {
        this.error = e.message || 'Could not update goal.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async remove(id) {
      await api.deleteGoal(id)
      this.items = this.items.filter((g) => g.id !== id)
    },

    // Pure counter increment. If a goal contribution should also appear as
    // a real transaction, do that as a separate user action — the backend
    // goal row has no ledger link, so silently creating one here would
    // double-count the money.
    async contribute(id, amount) {
      this.loading = true
      this.error = null
      try {
        const updated = await api.contributeToGoal(id, { amount })
        const idx = this.items.findIndex((g) => g.id === id)
        if (idx > -1) this.items[idx] = updated
        return updated
      } catch (e) {
        this.error = e.message || 'Could not add contribution.'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
