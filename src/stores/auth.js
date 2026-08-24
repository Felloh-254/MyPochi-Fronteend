import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('mypochi_token') || null,
    user: JSON.parse(localStorage.getItem('mypochi_user') || 'null'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    initials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    },
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const data = await api.login({ email, password })
        this._setSession(data)
      } catch (e) {
        this.error = e.message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    async register(email, password, name) {
      this.loading = true
      this.error = null
      try {
        const data = await api.register({ email, password, name })
        this._setSession(data)
      } catch (e) {
        this.error = e.message || 'Registration failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    async googleLogin(credential) {
      this.loading = true
      this.error = null
      try {
        const data = await api.googleLogin({ credential })
        this._setSession(data)
      } catch (e) {
        this.error = e.message || 'Google sign-in failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    clearSession(message = null) {
      this.token = null
      this.user = null
      this.error = message
      localStorage.removeItem('mypochi_token')
      localStorage.removeItem('mypochi_user')
    },

    logout() {
      this.clearSession()
    },

    handleUnauthorized(message = 'Your session has expired. Please sign in again.') {
      this.clearSession(message)
    },

    _setSession(data) {
      this.token = data.token
      this.user = data.user
      localStorage.setItem('mypochi_token', data.token)
      localStorage.setItem('mypochi_user', JSON.stringify(data.user))
    },
  },
})
