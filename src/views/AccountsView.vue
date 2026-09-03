<script setup>
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import AccountCard from '../components/AccountCard.vue'
import NewAccountModal from '../components/NewAccountModal.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import { useErrorHandler } from '../utils/useErrorHandler'
import { ref } from 'vue'

const accountsStore = useAccountsStore()
const ui = useUiStore()
const editingAccount = ref(null)
const { errors, addError, dismissError } = useErrorHandler()

function handleDelete(id) {
  accountsStore.remove(id)
}

function openNewAccount() {
  editingAccount.value = null
  ui.openAccountModal()
}

function openEditAccount(account) {
  editingAccount.value = account
  ui.openAccountModal()
}

function closeAccountModal() {
  editingAccount.value = null
}
</script>

<template>
  <div class="view">
    <ErrorAlert
      v-for="error in errors"
      :key="error.id"
      :message="error.message"
      :type="error.type"
      :action="error.action"
      @dismiss="dismissError(error.id)"
    />

    <div class="section-head">
      <div>
        <h2>Accounts</h2>
        <p>M-Pesa, bank, cash, savings — every wallet your money moves through.</p>
      </div>
      <button class="btn btn-primary" @click="openNewAccount">+ New account</button>
    </div>

    <LoadingSpinner v-if="accountsStore.loading" label="Loading your accounts..." />

    <div v-show="!accountsStore.loading" class="account-grid">
      <AccountCard
        v-for="a in accountsStore.items"
        :key="a.id"
        :account="a"
        class="card-grid-enter-active"
        @delete="handleDelete"
        @edit="openEditAccount"
      />
    </div>

    <p v-if="!accountsStore.loading && accountsStore.items.length === 0" class="empty">
      No accounts yet. Add one to start linking transactions to where the money actually is.
    </p>
  </div>

  <NewAccountModal v-if="ui.accountModalOpen" :account="editingAccount" @close="closeAccountModal" />
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
}

.demo-banner {
  background: #fff7e6;
  border: 1px solid #f5d99a;
  color: #8a6420;
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 9px;
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.account-grid .card-grid-enter-active {
  animation: fadeInUp 0.5s ease-out both;
}

.account-grid .card-grid-enter-active:nth-child(1) {
  animation-delay: 0s;
}

.account-grid .card-grid-enter-active:nth-child(2) {
  animation-delay: 0.08s;
}

.account-grid .card-grid-enter-active:nth-child(3) {
  animation-delay: 0.16s;
}

.account-grid .card-grid-enter-active:nth-child(4) {
  animation-delay: 0.24s;
}

.account-grid .card-grid-enter-active:nth-child(5) {
  animation-delay: 0.32s;
}

.account-grid .card-grid-enter-active:nth-child(6) {
  animation-delay: 0.4s;
}

.account-grid .card-grid-enter-active:nth-child(n + 7) {
  animation-delay: 0.48s;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-soft);
  font-size: 15px;
  animation: fadeIn 0.3s ease-out;
}
</style>
