import { defineStore } from 'pinia'
import { useBudgetsStore } from './budgets'
import { useRecurringStore } from './recurring'
import { useGoalsStore } from './goals'
import { budgetPct } from '../utils/budget'
import { relativeDueLabel, isOverdue } from '../utils/recurring'
import { daysRemaining, goalPct } from '../utils/goals'

// Every alert here is computed from data already in other stores — no
// dedicated notifications table/endpoint needed. If the backend later adds
// real push notifications, this store's `alerts` getter is the natural
// place to merge server-sent ones in alongside these derived ones.
export const useNotificationsStore = defineStore('notifications', {
  getters: {
    alerts() {
      const budgets = useBudgetsStore()
      const recurring = useRecurringStore()
      const goals = useGoalsStore()
      const list = []

      for (const b of budgets.items) {
        const pct = budgetPct(b)
        if (pct >= 100) {
          list.push({ id: `budget-over-${b.id}`, severity: 'danger', icon: 'budgets', text: `${b.name} is over budget (${pct}% used)` })
        } else if (pct >= 90) {
          list.push({ id: `budget-warn-${b.id}`, severity: 'warning', icon: 'budgets', text: `${b.name} is at ${pct}% of its limit` })
        }
      }

      for (const r of recurring.items) {
        if (!r.is_active) continue
        const days = Math.round((new Date(r.next_run) - new Date().setHours(0, 0, 0, 0)) / 86400000)
        if (days <= 3) {
          list.push({
            id: `recurring-${r.id}`,
            severity: isOverdue(r.next_run) ? 'danger' : 'info',
            icon: 'repeat',
            text: `${r.title} — ${relativeDueLabel(r.next_run)}`,
          })
        }
      }

      for (const g of goals.items) {
        const days = daysRemaining(g.deadline)
        const pct = goalPct(g)
        if (pct < 100 && days <= 14 && days >= 0) {
          list.push({ id: `goal-${g.id}`, severity: days <= 3 ? 'danger' : 'warning', icon: 'budgets', text: `${g.name} deadline in ${days} days — ${pct}% funded` })
        }
      }

      return list
    },

    count() {
      return this.alerts.length
    },
  },
})
