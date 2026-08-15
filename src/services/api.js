const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem('mypochi_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr) {
    throw new ApiError(`Could not reach the API at ${BASE_URL}`, 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status)
  }
  return data
}

// Mirrors the routes registered in cmd/api/main.go of the budgetapp backend.
export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/api/me'),

  getBudgets: (period) => request(`/api/budgets${period ? `?period=${period}` : ''}`),
  createBudget: (payload) => request('/api/budgets', { method: 'POST', body: payload }),
  updateBudget: (id, payload) => request(`/api/budgets/${id}`, { method: 'PUT', body: payload }),
  deleteBudget: (id) => request(`/api/budgets/${id}`, { method: 'DELETE' }),
  getBudgetHistory: (months = 6) => request(`/api/budgets/history?months=${months}`),
  copyBudgets: (fromPeriod, toPeriod) =>
    request('/api/budgets/copy', { method: 'POST', body: { from_period: fromPeriod, to_period: toPeriod } }),

  getAccounts: () => request('/api/accounts'),
  createAccount: (payload) => request('/api/accounts', { method: 'POST', body: payload }),
  updateAccount: (id, payload) => request(`/api/accounts/${id}`, { method: 'PUT', body: payload }),
  deleteAccount: (id) => request(`/api/accounts/${id}`, { method: 'DELETE' }),

  getTransactions: (query = '') => request(`/api/transactions${query}`),
  createTransaction: (payload) => request('/api/transactions', { method: 'POST', body: payload }),
  updateTransaction: (id, payload) => request(`/api/transactions/${id}`, { method: 'PUT', body: payload }),
  deleteTransaction: (id) => request(`/api/transactions/${id}`, { method: 'DELETE' }),

  getRecurring: () => request('/api/recurring'),
  createRecurring: (payload) => request('/api/recurring', { method: 'POST', body: payload }),
  updateRecurring: (id, payload) => request(`/api/recurring/${id}`, { method: 'PUT', body: payload }),
  deleteRecurring: (id) => request(`/api/recurring/${id}`, { method: 'DELETE' }),

  getGoals: () => request('/api/goals'),
  createGoal: (payload) => request('/api/goals', { method: 'POST', body: payload }),
  updateGoal: (id, payload) => request(`/api/goals/${id}`, { method: 'PUT', body: payload }),
  deleteGoal: (id) => request(`/api/goals/${id}`, { method: 'DELETE' }),
  contributeToGoal: (id, payload) => request(`/api/goals/${id}/contribute`, { method: 'POST', body: payload }),

  getSummary: () => request('/api/summary'),
}
