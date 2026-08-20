export const BANKS = [
  { value: 'kcb', label: 'KCB', matches: ['kcb', 'kenya commercial bank'], colors: ['#0066b3', '#00a9e0'], ink: '#fff' },
  { value: 'equity', label: 'Equity Bank', matches: ['equity'], colors: ['#7b1e3b', '#c63d5a'], ink: '#fff' },
  { value: 'coop', label: 'Co-op Bank', matches: ['coop', 'co-operative', 'cooperative'], colors: ['#007a53', '#72be44'], ink: '#fff' },
  { value: 'absa', label: 'Absa', matches: ['absa'], colors: ['#b7222b', '#e5534b'], ink: '#fff' },
  { value: 'stanbic', label: 'Stanbic', matches: ['stanbic'], colors: ['#003b70', '#00a9ce'], ink: '#fff' },
  { value: 'ncba', label: 'NCBA', matches: ['ncba'], colors: ['#e86f24', '#f7b733'], ink: '#fff' },
  { value: 'dtb', label: 'DTB', matches: ['dtb', 'diamond trust'], colors: ['#702283', '#b64bbd'], ink: '#fff' },
  { value: 'family', label: 'Family Bank', matches: ['family bank'], colors: ['#008b8b', '#43c6ac'], ink: '#fff' },
  { value: 'im', label: 'I&M Bank', matches: ['i&m', 'i and m'], colors: ['#006b54', '#49a942'], ink: '#fff' },
  { value: 'mpesa', label: 'M-Pesa', matches: ['mpesa', 'm-pesa'], colors: ['#00a651', '#008c95'], ink: '#fff' },
]

const FALLBACK_THEMES = {
  bank: { label: 'Bank', colors: ['#243b72', '#5869b8'], ink: '#fff' },
  savings: { label: 'Savings', colors: ['#5b4fd1', '#8d82f5'], ink: '#fff' },
  mpesa: { label: 'M-Pesa', colors: ['#00a651', '#008c95'], ink: '#fff' },
  cash: { label: 'Cash', colors: ['#d98324', '#f5b544'], ink: '#fff' },
  other: { label: 'Account', colors: ['#4c5475', '#8189a7'], ink: '#fff' },
}

export function accountTheme(account) {
  const selectedBank = BANKS.find((bank) => bank.value === account.bank)
  if (selectedBank) return selectedBank
  const searchText = `${account.name || ''} ${account.account_number || ''}`.toLowerCase()
  const bankTheme = BANKS.find((theme) => theme.matches.some((match) => searchText.includes(match)))
  return bankTheme || FALLBACK_THEMES[account.type] || FALLBACK_THEMES.other
}
