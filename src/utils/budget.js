export function budgetPct(budget) {
  if (!budget.amount) return 0
  return Math.min(100, Math.round((budget.spent / budget.amount) * 100))
}

export function isOverBudget(budget) {
  return budget.spent >= budget.amount
}
