import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { listServices } from '../actions/serviceActions';
import ServiceCard from '../components/ServiceCard';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, services } = useSelector((state) => state.serviceList);

  useEffect(() => {
    dispatch(listServices());
  }, [dispatch]);

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Verified experts. Hard-to-find help.</span>
          <h1>Browse specialist services from people who actually know the work.</h1>
          <p>
            Discover expert-led offers, compare ratings, review service duration, and book directly with seller
            PayPal destinations while the platform tracks the transaction flow.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>Direct seller payouts</strong>
            <span>Multi-merchant PayPal checkout</span>
          </div>
          <div>
            <strong>Subscription-gated AI</strong>
            <span>Project-aware questions only</span>
          </div>
          <div>
            <strong>Seller approval workflow</strong>
            <span>Admin review before publishing</span>
          </div>
        </div>
      </section>

      <section className="section-header-row">
        <div>
          <span className="eyebrow">Available Services</span>
          <h2>Find the service you have been struggling to source</h2>
        </div>
      </section>

      {loading && <div className="info-banner">Loading services...</div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="service-grid">
        {services?.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {!loading && !services?.length && <div className="info-banner">No services have been posted yet.</div>}
    </div>
  );
};

export default HomeScreen;
