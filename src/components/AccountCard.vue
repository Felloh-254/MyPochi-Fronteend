<script setup>
import { computed, ref } from 'vue'
import { formatCurrency } from '../utils/format'
import { accountTypeMeta } from '../utils/accountTypes'
import { accountTheme } from '../utils/accountThemes'
import { useAccountsStore } from '../stores/accounts'
import Icon from './Icon.vue'

const props = defineProps({
  account: { type: Object, required: true },
})
const emit = defineEmits(['delete', 'edit'])

const accountsStore = useAccountsStore()
const showBalance = ref(true)
const balance = computed(() => accountsStore.balanceFor(props.account.id))
const meta = computed(() => accountTypeMeta(props.account.type))
const theme = computed(() => accountTheme(props.account))
const balanceSize = computed(() => {
  const absoluteBalance = Math.abs(balance.value)
  if (absoluteBalance >= 10000000) return 'balance-compact'
  if (absoluteBalance >= 1000000) return 'balance-small'
  return ''
})
</script>

<template>
  <div
    class="account-card"
    :style="{ '--card-start': theme.colors[0], '--card-end': theme.colors[1], '--card-ink': theme.ink }"
  >
    <div class="card-shine"></div>
    <div class="account-card-head">
      <span class="icon-badge">
        <Icon :name="meta.icon" size="16" />
      </span>
      <div class="account-names">
        <span class="account-name">{{ account.name }}</span>
        <span class="account-type">{{ theme.label }} · {{ account.currency || 'KES' }}</span>
      </div>
      <div class="card-actions">
        <button class="icon-btn" @click="emit('edit', account)" aria-label="Edit account" title="Edit account">
          <Icon name="edit" size="15" />
        </button>
        <button class="icon-btn" @click="emit('delete', account.id)" aria-label="Delete account" title="Delete account">
          <Icon name="trash" size="15" />
        </button>
      </div>
    </div>
    <div class="card-brand-row">
      <div class="card-chip" aria-hidden="true"><span></span><span></span><span></span></div>
      <span class="card-network" aria-label="Visa">VISA</span>
    </div>
    <div class="account-number mono">{{ account.account_number || 'No account number' }}</div>
    <div class="balance-block">
      <div class="balance-heading">
        <span class="balance-label">Available balance</span>
        <button
          type="button"
          class="balance-toggle"
          :aria-label="showBalance ? 'Hide balance' : 'Show balance'"
          :title="showBalance ? 'Hide balance' : 'Show balance'"
          @click="showBalance = !showBalance"
        >
          <Icon :name="showBalance ? 'eye' : 'eyeOff'" size="15" />
        </button>
      </div>
      <div class="account-balance mono" :class="[balanceSize, { negative: balance < 0 }]">
        {{ showBalance ? formatCurrency(balance) : '******' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  overflow: hidden;
  min-height: 178px;
  padding: 20px 22px;
  color: var(--card-ink);
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--card-start), var(--card-end));
  box-shadow: 0 8px 20px color-mix(in srgb, var(--card-start) 20%, transparent);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 11px 24px color-mix(in srgb, var(--card-start) 26%, transparent);
}
.card-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 94% 4%, rgba(255, 255, 255, 0.1), transparent 28%),
    linear-gradient(110deg, transparent 42%, rgba(255, 255, 255, 0.025) 50%, transparent 58%);
}
.account-card > *:not(.card-shine) {
  position: relative;
  z-index: 1;
}
.account-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.icon-badge {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--card-ink);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.account-names {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.3;
}
.account-name {
  overflow: hidden;
  font-weight: 600;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-type {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.76);
}
.card-actions {
  display: flex;
  gap: 3px;
  margin-left: auto;
}
.account-number {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  min-height: 18px;
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.72);
  padding: 4px;
  border-radius: 6px;
  align-self: flex-start;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}
.card-chip {
  display: flex;
  gap: 0;
  width: 39px;
  height: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 7px;
  background: linear-gradient(135deg, #f4d88d, #bb8d42);
  opacity: 0.82;
}
.card-chip span {
  width: 33.33%;
  border-right: 1px solid rgba(82, 53, 17, 0.3);
}
.card-chip span:last-child {
  border-right: 0;
}
.card-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
}
.card-network {
  color: rgba(255, 255, 255, 0.94);
  font-family: Arial, sans-serif;
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 800;
  letter-spacing: -0.08em;
}
.balance-block {
  width: 100%;
  min-width: 0;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.balance-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.balance-label {
  display: block;
  color: rgba(255, 255, 255, 0.68);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.balance-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.82);
}
.balance-toggle:hover {
  background: rgba(255, 255, 255, 0.13);
  color: #fff;
}
.account-balance {
  min-width: 0;
  color: var(--card-ink);
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.15;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.account-balance.balance-small {
  font-size: 1.12rem;
}
.account-balance.balance-compact {
  font-size: 0.98rem;
}
.account-balance.negative {
  color: var(--rose);
}

@media (max-width: 520px) {
  .account-card {
    min-height: 164px;
    padding: 17px 18px;
  }
}
</style>
