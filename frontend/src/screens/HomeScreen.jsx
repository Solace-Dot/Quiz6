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
    <div className="stack-lg landing-reference">
      <section className="hero-reference">
        <div className="hero-reference-copy">
          <span className="eyebrow">Prepared for pressure washing service leads</span>
          <h1>Professional exterior cleaning with clear business information.</h1>
          <p>
            PressureWash Pro helps users discover reliable pressure washing specialists for house washing, driveway
            restoration, and commercial exterior care with straightforward service listings and pricing.
          </p>
          <div className="hero-reference-actions">
            <button type="button" className="primary-button">Request service</button>
            <button type="button" className="ghost-button">View services</button>
          </div>
          <div className="hero-reference-tags">
            <span>Transparent policies</span>
            <span>No cloned branding</span>
            <span>Clear contact details</span>
          </div>
        </div>
        <article className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80"
            alt="Pressure washing team vehicle and equipment"
          />
          <p>Representative service image from a pressure washing package.</p>
        </article>
      </section>

      <section className="panel offer-reference">
        <div>
          <h2>What we offer</h2>
          <p className="muted-copy">A cleaner and simpler landing experience that lets users understand your service focus quickly.</p>
        </div>
        <div className="offer-grid">
          <article className="offer-item">
            <span>1</span>
            <h3>House washing</h3>
            <p>Soft wash and pressure washing for siding, trim, pathways, and curb appeal improvement.</p>
          </article>
          <article className="offer-item">
            <span>2</span>
            <h3>Driveway and concrete</h3>
            <p>Removal of built-up dirt, organic growth, and surface staining from concrete slabs.</p>
          </article>
          <article className="offer-item">
            <span>3</span>
            <h3>Commercial exterior care</h3>
            <p>Exterior cleaning for storefronts, common areas, building entrances, and property upkeep.</p>
          </article>
        </div>
      </section>

      <section className="trust-reference panel">
        <div className="trust-copy">
          <h2>Built for trust signals</h2>
          <p>This package highlights the details users and ad reviewers expect before choosing a provider.</p>
          <ul>
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Cookie policy</li>
            <li>Refund and cancellation policy</li>
            <li>Dedicated About and Contact pages</li>
          </ul>
        </div>
        <div className="trust-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1520052205864-92d242b3a76c?auto=format&fit=crop&w=1000&q=80"
            alt="Surface cleaning pressure washer in use"
          />
        </div>
      </section>

      <section className="section-header-row">
        <div>
          <span className="eyebrow">Live Service Listings</span>
          <h2>Browse available pressure washing cards</h2>
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

      <section className="contact-reference">
        <div>
          <h2>Contact us for more information</h2>
          <p>Business details and support links are available from the contact page.</p>
        </div>
        <button type="button" className="primary-button">Open contact page</button>
      </section>
    </div>
  );
};

export default HomeScreen;
