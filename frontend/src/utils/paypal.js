export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';

export const getPlanIdForTier = (tierName) => {
  const normalized = tierName?.toLowerCase();
  if (normalized === 'tier 1') {
    return process.env.REACT_APP_PAYPAL_PLAN_TIER_1 || '';
  }
  if (normalized === 'tier 2') {
    return process.env.REACT_APP_PAYPAL_PLAN_TIER_2 || '';
  }
  if (normalized === 'tier 3') {
    return process.env.REACT_APP_PAYPAL_PLAN_TIER_3 || '';
  }
  return '';
};
