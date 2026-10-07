<script setup>
import { computed, ref } from 'vue'
import { formatCurrency } from '../utils/format'
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
      <div class="account-names">
        <span class="issuer-name">{{ theme.label }}</span>
        <span class="account-name">{{ account.name }}</span>
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
      <div class="card-contactless" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
    <div class="account-number mono">{{ account.account_number || '••••  ••••  ••••' }}</div>
    <div class="balance-block">
      <div class="balance-heading">
        <span class="balance-label">{{ account.currency || 'KES' }} · Available balance</span>
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
  aspect-ratio: 1.586 / 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  overflow: hidden;
  min-height: 205px;
  padding: 20px 22px 17px;
  color: var(--card-ink);
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 16px;
  background:
    radial-gradient(ellipse at 92% 8%, rgba(255, 255, 255, 0.2), transparent 34%),
    linear-gradient(132deg, var(--card-start), var(--card-end));
  box-shadow: 0 12px 24px color-mix(in srgb, var(--card-start) 23%, transparent), inset 0 1px rgba(255, 255, 255, 0.22);
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
  background: repeating-linear-gradient(145deg, transparent 0 23px, rgba(255, 255, 255, 0.035) 24px 25px, transparent 26px 47px);
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
.account-names {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.3;
}
.account-name {
  overflow: hidden;
  font-weight: 650;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.issuer-name {
  color: rgba(255, 255, 255, 0.78);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
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
  position: relative;
  display: flex;
  gap: 0;
  width: 39px;
  height: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 6px;
  background: linear-gradient(135deg, #f4d88d, #bb8d42);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.7), 0 1px 3px rgba(0, 0, 0, 0.12);
}
.card-chip span {
  width: 33.33%;
  border-right: 1px solid rgba(82, 53, 17, 0.3);
}
.card-chip span:last-child {
  border-right: 0;
}
.card-contactless {
  display: flex;
  align-items: center;
  gap: 0;
  height: 22px;
  transform: rotate(90deg);
}
.card-contactless i {
  width: 8px;
  height: 13px;
  margin-left: -4px;
  border-right: 1.5px solid rgba(255, 255, 255, 0.78);
  border-radius: 50%;
}
.card-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
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
    min-height: 190px;
    padding: 18px 18px 15px;
  }
}
</style>
