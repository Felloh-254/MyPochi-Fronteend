import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    txnModalOpen: false,
    budgetModalOpen: false,
    accountModalOpen: false,
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
  },
})
