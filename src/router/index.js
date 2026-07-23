import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Sign in' },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/AccountsView.vue'),
    meta: { title: 'Accounts', requiresAuth: true },
  },
  {
    path: '/budgets',
    name: 'budgets',
    component: () => import('../views/BudgetsView.vue'),
    meta: { title: 'Budgets', requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionsView.vue'),
    meta: { title: 'Transactions', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
