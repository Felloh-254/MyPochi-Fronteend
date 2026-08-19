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
  }),
  actions: {
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
