import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserProfile, updateUserProfile } from '../actions/authActions';
import { listMyOrders } from '../actions/orderActions';
import { getCurrentSubscription } from '../actions/subscriptionActions';
import { formatCurrency, formatDate } from '../utils/format';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profileDetails);
  const profileUpdate = useSelector((state) => state.profileUpdate);
  const { orders } = useSelector((state) => state.orderHistory);
  const { subscription } = useSelector((state) => state.currentSubscription);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    location: '',
    gender: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(listMyOrders());
    dispatch(getCurrentSubscription());
  }, [dispatch, profileUpdate.success]);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        location: profile.location || '',
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUserProfile(form));
  };

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Your Profile</span>
          <h1>Account details and order history</h1>
        </div>
        {(error || profileUpdate.error) && <div className="error-banner">{error || profileUpdate.error}</div>}
        {profileUpdate.success && <div className="success-banner">Profile updated successfully.</div>}
        {loading && <div className="info-banner">Loading profile...</div>}
        {profile && (
          <div className="profile-grid">
            <div className="profile-summary">
              <div>
                <strong>Name</strong>
                <span>{profile.name}</span>
              </div>
              <div>
                <strong>Email</strong>
                <span>{profile.email}</span>
              </div>
              <div>
                <strong>Role</strong>
                <span>{profile.role}</span>
              </div>
              <div>
                <strong>Subscription</strong>
                <span>{subscription?.tier?.name || 'No active subscription'}</span>
              </div>
              <div>
                <strong>Chat Usage Left</strong>
                <span>{subscription?.usage_left ?? 0}</span>
              </div>
            </div>
            <form className="form-grid" onSubmit={submitHandler}>
              <label>
                First Name
                <input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} />
              </label>
              <label>
                Last Name
                <input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} />
              </label>
              <label>
                Phone Number
                <input value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
              </label>
              <label>
                Gender
                <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
              <button type="submit" className="primary-button">
                Save Profile
              </button>
            </form>
          </div>
        )}
      </section>

      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Orders</span>
          <h2>Your service transactions</h2>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Expert</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>{order.service.service_name}</td>
                  <td>{order.service.name_of_the_expert}</td>
                  <td>{formatCurrency(order.price_paid)}</td>
                  <td>{formatDate(order.date_purchased)}</td>
                </tr>
              ))}
              {!orders?.length && (
                <tr>
                  <td colSpan="4">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
