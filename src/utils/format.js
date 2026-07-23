const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount || 0);
}

export function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonth(monthStr) {
  // monthStr like "2026-07"
  const [year, month] = monthStr.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-KE",
    { month: "short" },
  );
}
