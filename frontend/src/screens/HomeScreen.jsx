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
          <span className="eyebrow">Pressure washing experts in one place.</span>
          <h1>Book trusted pressure washing professionals for homes and businesses.</h1>
          <p>
            Explore driveway, exterior wall, roof, fence, patio, and commercial surface cleaning offers. Compare
            ratings, turnaround time, and pricing, then book directly with seller PayPal destinations.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>Direct seller payouts</strong>
            <span>Multi-merchant PayPal checkout</span>
          </div>
          <div>
            <strong>Subscription-gated AI</strong>
            <span>Pressure-washing project questions only</span>
          </div>
          <div>
            <strong>Seller approval workflow</strong>
            <span>Admin review for every cleaning contractor</span>
          </div>
        </div>
      </section>

      <section className="section-header-row">
        <div>
          <span className="eyebrow">Available Pressure Washing Services</span>
          <h2>Find the exact wash package you need</h2>
        </div>
      </section>

      {loading && <div className="info-banner">Loading pressure washing services...</div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="service-grid">
        {services?.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {!loading && !services?.length && <div className="info-banner">No pressure washing services have been posted yet.</div>}
    </div>
  );
};

export default HomeScreen;
