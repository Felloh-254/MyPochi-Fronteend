import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
import { advanceDate } from '../utils/recurring'
import { useTransactionsStore } from './transactions'

export const useRecurringStore = defineStore('recurring', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    active: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      return items.filter((r) => r.is_active)
    },
    dueSoon: (state) => {
      const items = Array.isArray(state.items) ? state.items : []
      const in7Days = new Date()
      in7Days.setDate(in7Days.getDate() + 7)
      return items.filter((r) => r.is_active && new Date(r.next_run) <= in7Days)
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const payload = await api.getRecurring()
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.recurring)
              ? payload.recurring
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
      const created = await api.createRecurring(payload)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      const updated = await api.updateRecurring(id, payload)
      const idx = this.items.findIndex((r) => r.id === id)
      if (idx > -1) this.items[idx] = updated
      return updated
    },

    toggleActive(id) {
      const item = this.items.find((r) => r.id === id)
      if (item) this.update(id, { is_active: !item.is_active })
    },

    async remove(id) {
      await api.deleteRecurring(id)
      this.items = this.items.filter((r) => r.id !== id)
    },

    // Posts a real transaction from this recurring template and rolls
    // next_run forward. In production this is what a backend cron job
    // would do on schedule — this button lets you trigger it manually,
    // which is also handy for testing/demoing without waiting for a date.
    async postNow(id) {
      const item = this.items.find((r) => r.id === id)
      if (!item) return

      const transactions = useTransactionsStore()
      await transactions.create({
        title: item.title,
        amount: item.amount,
        type: item.type,
        category: item.category,
        account_id: item.account_id,
        date: item.next_run,
        note: 'Posted from recurring',
      })

      await this.update(id, { next_run: advanceDate(item.next_run, item.frequency) })
    },
  },
})
