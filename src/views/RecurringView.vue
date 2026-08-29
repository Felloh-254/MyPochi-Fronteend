<script setup>
import { onMounted } from 'vue'
import { useRecurringStore } from '../stores/recurring'
import { useAccountsStore } from '../stores/accounts'
import { useUiStore } from '../stores/ui'
import RecurringRow from '../components/RecurringRow.vue'
import NewRecurringModal from '../components/NewRecurringModal.vue'

const recurringStore = useRecurringStore()
const accountsStore = useAccountsStore()
const ui = useUiStore()

onMounted(() => {
  if (recurringStore.items.length === 0) recurringStore.fetch()
  if (accountsStore.items.length === 0) accountsStore.fetch()
})

function accountName(accountId) {
  return accountsStore.items.find((a) => a.id === accountId)?.name ?? ''
}
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Recurring</h2>
        <p>Rent, salary, subscriptions — anything that happens on a schedule.</p>
      </div>
      <button class="btn btn-primary" @click="ui.openRecurringModal()">+ New recurring</button>
    </div>

    <div class="card content-enter" style="padding: 8px 22px 22px" v-if="recurringStore.items.length">
      <table class="txn-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Account</th>
            <th>Frequency</th>
            <th>Next run</th>
            <th style="text-align: right">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <RecurringRow
            v-for="r in recurringStore.items"
            :key="r.id"
            :item="r"
            :account-name="accountName(r.account_id)"
            class="table-row-enter-active"
          />
        </tbody>
      </table>
    </div>

    <p v-else class="empty content-enter">
      Nothing recurring yet. Add rent, salary, or a subscription to have it post automatically.
    </p>
  </div>

  <NewRecurringModal v-if="ui.recurringModalOpen" />
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
</style>
