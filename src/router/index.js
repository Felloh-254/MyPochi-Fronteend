import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAccountsStore } from '../stores/accounts'
import { useBudgetsStore } from '../stores/budgets'
import { useGoalsStore } from '../stores/goals'
import { useRecurringStore } from '../stores/recurring'
import { useSummaryStore } from '../stores/summary'
import { useTransactionsStore } from '../stores/transactions'
import { useUiStore } from '../stores/ui'

const routeLoaders = {
  accounts: () => Promise.all([useAccountsStore().fetch(), useTransactionsStore().fetch()]),
  budgets: () => Promise.all([useBudgetsStore().fetch(), useBudgetsStore().fetchHistory(6)]),
  dashboard: () => Promise.all([
    useBudgetsStore().fetch(),
    useTransactionsStore().fetch(),
    useSummaryStore().fetch(),
    useAccountsStore().fetch(),
  ]),
  goals: () => useGoalsStore().fetch(),
  import: () => useAccountsStore().fetch(),
  insights: () => Promise.all([
    useTransactionsStore().fetch(),
    useBudgetsStore().fetch(),
    useSummaryStore().fetch(),
  ]),
  recurring: () => Promise.all([useRecurringStore().fetch(), useAccountsStore().fetch()]),
  reports: () => Promise.all([
    useTransactionsStore().fetch(),
    useAccountsStore().fetch(),
    useBudgetsStore().fetch(),
  ]),
  settings: () => useBudgetsStore().fetch(),
  transactions: () => Promise.all([
    useTransactionsStore().fetch(),
    useBudgetsStore().fetch(),
    useAccountsStore().fetch(),
  ]),
}

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Sign in' },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { title: 'Unauthorized' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true, loadData: 'dashboard' },
    alias: '/',
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/AccountsView.vue'),
    meta: { title: 'Accounts', requiresAuth: true, loadData: 'accounts' },
  },
  {
    path: '/budgets',
    name: 'budgets',
    component: () => import('../views/BudgetsView.vue'),
    meta: { title: 'Budgets', requiresAuth: true, loadData: 'budgets' },
  },
  {
    path: '/recurring',
    name: 'recurring',
    component: () => import('../views/RecurringView.vue'),
    meta: { title: 'Recurring', requiresAuth: true, loadData: 'recurring' },
  },
  {
    path: '/goals',
    name: 'goals',
    component: () => import('../views/GoalsView.vue'),
    meta: { title: 'Goals', requiresAuth: true, loadData: 'goals' },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionsView.vue'),
    meta: { title: 'Transactions', requiresAuth: true, loadData: 'transactions' },
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('../views/InsightsView.vue'),
    meta: { title: 'Insights', requiresAuth: true, loadData: 'insights' },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { title: 'Reports', requiresAuth: true, loadData: 'reports' },
  },
  {
    path: '/import',
    name: 'import',
    component: () => import('../views/ImportView.vue'),
    meta: { title: 'Import', requiresAuth: true, loadData: 'import' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true, loadData: 'settings' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.name === 'unauthorized') {
    return true
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

router.afterEach((to) => {
  const ui = useUiStore()
  ui.clearRouteDataError()

  if (!to.meta.requiresAuth || !authIsAuthenticated()) return

  const load = routeLoaders[to.meta.loadData]
  if (load) {
    load().catch((error) => {
      ui.setRouteDataError({
        status: error?.status || 0,
        message: error?.status === 404
          ? 'This page data endpoint was not found (404). Check that the backend route is available.'
          : error?.message || 'Could not load this page data.',
      })
    })
  }
})

function authIsAuthenticated() {
  return useAuthStore().isAuthenticated
}

export default router
