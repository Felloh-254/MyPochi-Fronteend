export const ACCOUNT_TYPES = [
  { value: 'mpesa', label: 'M-Pesa', icon: 'mobile' },
  { value: 'bank', label: 'Bank', icon: 'bank' },
  { value: 'cash', label: 'Cash', icon: 'cash' },
  { value: 'savings', label: 'Savings', icon: 'wallet' },
  { value: 'other', label: 'Other', icon: 'wallet' },
]

export function accountTypeMeta(type) {
  return ACCOUNT_TYPES.find((t) => t.value === type) || ACCOUNT_TYPES[ACCOUNT_TYPES.length - 1]
}
