import Papa from 'papaparse'

// M-Pesa statement exports use these column names (Safaricom's standard
// "Statement" CSV/Excel export). We detect it by header match and map it
// into the same shape as a generic import row.
const MPESA_HEADERS = ['Receipt No.', 'Completion Time', 'Details', 'Paid In', 'Withdrawn']

function looksLikeMpesa(fields) {
  return MPESA_HEADERS.every((h) => fields.includes(h))
}

function parseAmount(value) {
  if (!value) return 0
  return Number(String(value).replace(/,/g, '').trim()) || 0
}

// Returns { rows: [{ title, amount, type, category, date, note, include }], format: 'mpesa' | 'generic' }
export function parseTransactionsCsv(fileText) {
  const parsed = Papa.parse(fileText, { header: true, skipEmptyLines: true })
  const fields = parsed.meta.fields || []

  if (looksLikeMpesa(fields)) {
    return { format: 'mpesa', rows: parsed.data.map(mapMpesaRow).filter(Boolean) }
  }
  return { format: 'generic', rows: parsed.data.map(mapGenericRow).filter(Boolean) }
}

function mapMpesaRow(row) {
  const paidIn = parseAmount(row['Paid In'])
  const withdrawn = parseAmount(row['Withdrawn'])
  if (!paidIn && !withdrawn) return null

  const date = (row['Completion Time'] || '').split(' ')[0] // "2026-07-14 10:32:11" -> "2026-07-14"
  return {
    title: row['Details']?.trim() || 'M-Pesa transaction',
    amount: paidIn || withdrawn,
    type: paidIn ? 'income' : 'expense',
    category: 'M-Pesa',
    date: normalizeDate(date),
    note: row['Receipt No.'] ? `Receipt ${row['Receipt No.']}` : '',
    include: true,
  }
}

function mapGenericRow(row) {
  // Accepts common header variants case-insensitively.
  const get = (...keys) => {
    for (const k of Object.keys(row)) {
      if (keys.includes(k.trim().toLowerCase())) return row[k]
    }
    return ''
  }

  const title = get('title', 'description', 'name')
  const amountRaw = get('amount', 'value')
  if (!title || !amountRaw) return null

  const amount = parseAmount(amountRaw)
  const explicitType = get('type')?.toLowerCase()
  const type = explicitType === 'income' || explicitType === 'expense' ? explicitType : amount < 0 ? 'expense' : 'income'

  return {
    title: title.trim(),
    amount: Math.abs(amount),
    type,
    category: get('category') || 'Uncategorized',
    date: normalizeDate(get('date')),
    note: get('note', 'memo') || '',
    include: true,
  }
}

function normalizeDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  const d = new Date(value)
  if (isNaN(d)) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}
