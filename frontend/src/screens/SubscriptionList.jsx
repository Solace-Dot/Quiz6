import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { listSubscriptions } from '../actions/subscriptionActions';
import { formatDate } from '../utils/format';

const SubscriptionList = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.subscriptionList);

  useEffect(() => {
    dispatch(listSubscriptions());
  }, [dispatch]);

  return (
    <section className="panel stack-md">
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Subscription Transactions</h1>
      </div>
      {loading && <div className="info-banner">Loading subscriptions...</div>}
      {error && <div className="error-banner">{error}</div>}
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Tier</th>
              <th>Subscription Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((subscriptionItem) => (
              <tr key={subscriptionItem.id}>
                <td>{subscriptionItem.user}</td>
                <td>{subscriptionItem.tier.name}</td>
                <td>{formatDate(subscriptionItem.created_at || subscriptionItem.subscribed_at)}</td>
              </tr>
            ))}
            {!subscriptions?.length && !loading && (
              <tr>
                <td colSpan="3">No subscription records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SubscriptionList;
