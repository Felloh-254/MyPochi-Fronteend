export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export function frequencyLabel(freq) {
  return FREQUENCIES.find((f) => f.value === freq)?.label ?? freq
}

// Advances a "next_run" date (YYYY-MM-DD) forward by one occurrence.
export function advanceDate(dateStr, frequency) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (frequency === 'daily') d.setDate(d.getDate() + 1)
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7)
  else d.setMonth(d.getMonth() + 1) // monthly
  return d.toISOString().slice(0, 10)
}

// Human-friendly "in 3 days" / "today" / "2 days overdue"
export function relativeDueLabel(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${dateStr}T00:00:00`)
  const diffDays = Math.round((due - today) / 86400000)

  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays > 1) return `Due in ${diffDays} days`
  if (diffDays === -1) return '1 day overdue'
  return `${Math.abs(diffDays)} days overdue`
}

export function isOverdue(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${dateStr}T00:00:00`) < today
}
