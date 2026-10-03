import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    sidebarCollapsed: false,
    txnModalOpen: false,
    budgetModalOpen: false,
    accountModalOpen: false,
    recurringModalOpen: false,
    goalModalOpen: false,
    contributeModalOpen: false,
    contributeGoalId: null,
    notificationsPanelOpen: false,
    searchQuery: '',
    routeDataError: null,
    toastMessage: "",
  }),

  actions: {
    showToast(message) {
      this.toastMessage = message
      clearTimeout(this._toastTimeout)
      this._toastTimeout = setTimeout(() => { this.toastMessage = ""; this._toastTimeout = null }, 3200)
    },
    setRouteDataError(error) {
      this.routeDataError = error
    },
    clearRouteDataError() {
      this.routeDataError = null
    },

    // ---- mobile nav ----
    openMobileNav() {
      this.mobileNavOpen = true
    },
    closeMobileNav() {
      this.mobileNavOpen = false
    },
    toggleMobileNav() {
      this.mobileNavOpen = !this.mobileNavOpen
    },

    openTxnModal() {
      this.txnModalOpen = true
    },
    openBudgetModal() {
      this.budgetModalOpen = true
    },
    openAccountModal() {
      this.accountModalOpen = true
    },
    openRecurringModal() {
      this.recurringModalOpen = true
    },
    openGoalModal() {
      this.goalModalOpen = true
    },
    openContributeModal(goalId) {
      this.contributeGoalId = goalId
      this.contributeModalOpen = true
    },
  },
})