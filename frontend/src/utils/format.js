export const formatCurrency = (amount) => {
  const value = Number(amount || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (value) => {
  if (!value) {
    return 'N/A';
  }
  return new Date(value).toLocaleString();
};
