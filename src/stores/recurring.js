import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export const useRecurringStore = defineStore('recurring', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    active: (state) => state.items.filter((r) => r.active),
    dueSoon: (state) => {
      const in7Days = new Date()
      in7Days.setDate(in7Days.getDate() + 7)
      return state.items.filter(
        (r) => r.active && new Date(r.next_run_at) <= in7Days,
      )
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const payload = await api.getRecurring()
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
      const created = await api.createRecurring(payload)
      this.items.push(created)
      return created
    },

    // Backend PUT expects the full rule body. Merge with the current item
    // so callers can pass partial patches like { amount: 12.99 }.
    async update(id, payload) {
      const current = this.items.find((r) => r.id === id)
      if (!current) return null
      const body = {
        type: current.type,
        title: current.title,
        amount: current.amount,
        note: current.note ?? '',
        category: current.category ?? '',
        account_id: current.account_id ?? 0,
        from_account_id: current.from_account_id ?? 0,
        to_account_id: current.to_account_id ?? 0,
        frequency: current.frequency,
        interval_count: current.interval_count ?? 1,
        start_date: current.start_date,
        end_date: current.end_date ?? '',
        ...payload,
      }
      const updated = await api.updateRecurring(id, body)
      const idx = this.items.findIndex((r) => r.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async pause(id) {
      const updated = await api.pauseRecurring(id)
      const idx = this.items.findIndex((r) => r.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async resume(id) {
      const updated = await api.resumeRecurring(id)
      const idx = this.items.findIndex((r) => r.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    async remove(id) {
      await api.deleteRecurring(id)
      this.items = this.items.filter((r) => r.id !== id)
    },

    // Delegates to the backend scheduler. Do NOT post a client-side
    // transaction here — the backend already creates the transaction when
    // the rule fires. Calling this just forces a run-now.
    async runDue() {
      return api.runRecurring()
    },
  },
})