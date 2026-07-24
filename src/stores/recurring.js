import { defineStore } from 'pinia'
import { api } from '../services/api'
import { DEMO_RECURRING } from '../services/demoData'
import { advanceDate } from '../utils/recurring'
import { useTransactionsStore } from './transactions'

export const useRecurringStore = defineStore('recurring', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    isDemo: false,
  }),

  getters: {
    active: (state) => state.items.filter((r) => r.is_active),
    dueSoon: (state) => {
      const in7Days = new Date()
      in7Days.setDate(in7Days.getDate() + 7)
      return state.items.filter((r) => r.is_active && new Date(r.next_run) <= in7Days)
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.items = await api.getRecurring()
        this.isDemo = false
      } catch (e) {
        this.items = DEMO_RECURRING
        this.isDemo = true
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      if (this.isDemo) {
        const local = { id: Date.now(), is_active: true, ...payload }
        this.items.push(local)
        return local
      }
      const created = await api.createRecurring(payload)
      this.items.push(created)
      return created
    },

    async update(id, payload) {
      if (this.isDemo) {
        const idx = this.items.findIndex((r) => r.id === id)
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...payload }
        return this.items[idx]
      }
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
      if (!this.isDemo) await api.deleteRecurring(id)
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
