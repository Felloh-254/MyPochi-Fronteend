export const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank', icon: 'bank' },
  { value: 'cash', label: 'Cash', icon: 'cash' },
  { value: 'mobile_money', label: 'Mobile money', icon: 'mobile' },
  { value: 'investment', label: 'Savings / investment', icon: 'wallet' },
]

export const MOBILE_MONEY_PROVIDERS = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'airtel_money', label: 'Airtel Money' },
]

export function accountTypeMeta(type, provider = '') {
  if (type === 'mpesa') return { value: 'mobile_money', label: 'M-Pesa', icon: 'mobile' }
  if (type === 'mobile_money') {
    const selected = MOBILE_MONEY_PROVIDERS.find((item) => item.value === provider)
    return { value: type, label: selected?.label || 'Mobile money', icon: 'mobile' }
  }
  if (type === 'savings') return { value: 'investment', label: 'Savings / investment', icon: 'wallet' }
  return ACCOUNT_TYPES.find((t) => t.value === type) || { value: 'other', label: 'Account', icon: 'wallet' }
}
