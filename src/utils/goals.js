export function goalPct(goal) {
  if (!goal.target_amount) return 0
  return Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
}

export function isGoalComplete(goal) {
  return goal.current_amount >= goal.target_amount
}

export function daysRemaining(deadline) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${deadline}T00:00:00`)
  return Math.round((due - today) / 86400000)
}

export function deadlineLabel(deadline) {
  const days = daysRemaining(deadline)
  if (days < 0) return 'Deadline passed'
  if (days === 0) return 'Due today'
  if (days <= 60) return `${days} days left`
  return new Date(`${deadline}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
