import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { createSubscription, getCurrentSubscription, listSubscriptionTiers } from '../actions/subscriptionActions';
import { formatCurrency } from '../utils/format';
import { PAYPAL_CLIENT_ID, getPlanIdForTier } from '../utils/paypal';

const SubscriptionScreen = () => {
  const dispatch = useDispatch();
  const { tiers, loading, error } = useSelector((state) => state.subscriptionTierList);
  const subscriptionCreate = useSelector((state) => state.subscriptionCreate);
  const { subscription } = useSelector((state) => state.currentSubscription);

  useEffect(() => {
    dispatch(listSubscriptionTiers());
    dispatch(getCurrentSubscription());
  }, [dispatch, subscriptionCreate.success]);

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Subscriptions</span>
          <h1>Choose a chatbot usage tier</h1>
          <p>Tier 1 gives 3 usages, Tier 2 gives 5 usages, and Tier 3 gives 10 usages.</p>
        </div>
        {subscription && (
          <div className="success-banner">
            Active subscription: {subscription.tier.name} with {subscription.usage_left} usages left.
          </div>
        )}
        {(error || subscriptionCreate.error) && <div className="error-banner">{error || subscriptionCreate.error}</div>}
      </section>

      {loading && <div className="info-banner">Loading subscription tiers...</div>}

      <div className="tier-grid">
        {tiers?.map((tier) => {
          const planId = getPlanIdForTier(tier.name);
          return (
            <section key={tier.id} className="tier-card">
              <span className="eyebrow">{tier.name}</span>
              <h2>{formatCurrency(tier.price)}</h2>
              <p>{tier.max_usage} chatbot usages included per activation.</p>
              {!PAYPAL_CLIENT_ID && <div className="info-banner">Set REACT_APP_PAYPAL_CLIENT_ID to enable subscriptions.</div>}
              {PAYPAL_CLIENT_ID && !planId && (
                <div className="info-banner">Configure a PayPal plan ID for {tier.name} in your frontend environment.</div>
              )}
              {PAYPAL_CLIENT_ID && planId && (
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'pill' }}
                  fundingSource={undefined}
                  createSubscription={(data, actions) => actions.subscription.create({ plan_id: planId })}
                  onApprove={(data) => {
                    dispatch(createSubscription({ tier: tier.id, paypal_subscription_id: data.subscriptionID }));
                  }}
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionScreen;
