<script setup>
import { onMounted } from 'vue'
import { useAccountsStore } from '../stores/accounts'
import { useTransactionsStore } from '../stores/transactions'
import { useUiStore } from '../stores/ui'
import AccountCard from '../components/AccountCard.vue'
import NewAccountModal from '../components/NewAccountModal.vue'

const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const ui = useUiStore()

onMounted(() => {
  if (accountsStore.items.length === 0) accountsStore.fetch()
  if (transactionsStore.items.length === 0) transactionsStore.fetch()
})

function handleDelete(id) {
  accountsStore.remove(id)
}
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Accounts</h2>
        <p>M-Pesa, bank, cash, savings — every wallet your money moves through.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openAccountModal()">+ New account</button>
    </div>

    <div class="account-grid">
      <AccountCard v-for="a in accountsStore.items" :key="a.id" :account="a" @delete="handleDelete" />
    </div>

    <p v-if="!accountsStore.loading && accountsStore.items.length === 0" class="empty">
      No accounts yet. Add one to start linking transactions to where the money actually is.
    </p>
  </div>

  <NewAccountModal v-if="ui.accountModalOpen" />
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
</style>
