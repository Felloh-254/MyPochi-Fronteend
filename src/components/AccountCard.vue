<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'
import { accountTypeMeta } from '../utils/accountTypes'
import { useAccountsStore } from '../stores/accounts'
import Icon from './Icon.vue'

const props = defineProps({
  account: { type: Object, required: true },
})
const emit = defineEmits(['delete'])

const accountsStore = useAccountsStore()
const balance = computed(() => accountsStore.balanceFor(props.account.id))
const meta = computed(() => accountTypeMeta(props.account.type))
</script>

<template>
  <div class="card account-card">
    <div class="account-card-head">
      <span class="icon-badge" :style="{ background: account.color + '22', color: account.color }">
        <Icon :name="meta.icon" size="16" />
      </span>
      <div class="account-names">
        <span class="account-name">{{ account.name }}</span>
        <span class="account-type">{{ meta.label }}</span>
      </div>
      <button class="icon-btn" @click="emit('delete', account.id)" aria-label="Delete account">
        <Icon name="trash" size="15" />
      </button>
    </div>
    <div class="account-balance mono" :class="{ negative: balance < 0 }">{{ formatCurrency(balance) }}</div>
  </div>
</template>

<style scoped>
.account-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.account-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.account-names {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.account-name {
  font-weight: 600;
  font-size: 14px;
}
.account-type {
  font-size: 11.5px;
  color: var(--text-soft);
}
.icon-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-faint);
  padding: 4px;
  border-radius: 6px;
  align-self: flex-start;
}
.icon-btn:hover {
  background: var(--canvas);
  color: var(--rose);
}
.account-balance {
  font-size: 24px;
  font-weight: 600;
}
.account-balance.negative {
  color: var(--rose);
}
</style>
