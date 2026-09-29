// Month strings are "YYYY-MM" — matching the backend `budgets.month` column
// and the ?month= query param on /api/budgets and /api/summary.
export function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function shiftMonth(month, deltaMonths) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + deltaMonths, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonthLabel(month) {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatMonthShort(month) {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' })
}

export function isCurrentMonth(month) {
  return month === currentMonth()
}

// ---- Backwards-compatible aliases ----
// Existing imports of currentPeriod/shiftPeriod/formatPeriodLabel etc. keep
// working, but the format they operate on is now "YYYY-MM" not "YYYY-MM-01".
export const currentPeriod = currentMonth
export const shiftPeriod = shiftMonth
export const formatPeriodLabel = formatMonthLabel
export const formatPeriodShort = formatMonthShort
export const isCurrentPeriod = isCurrentMonth