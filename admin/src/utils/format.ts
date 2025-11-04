export const formatCurrency = (value: number, currency = 'UZS') =>
  new Intl.NumberFormat('uz-UZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export const formatDate = (value: string) =>
  new Date(value).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
