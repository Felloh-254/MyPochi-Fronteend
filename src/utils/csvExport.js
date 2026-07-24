function csvEscape(value) {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export function transactionsToCsv(transactions, accountNameFor) {
  const header = ['Date', 'Title', 'Category', 'Account', 'Type', 'Amount', 'Note']
  const rows = transactions.map((t) => [
    t.date,
    t.title,
    t.category,
    accountNameFor ? accountNameFor(t.account_id) : '',
    t.type,
    t.amount,
    t.note || '',
  ])
  return [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
