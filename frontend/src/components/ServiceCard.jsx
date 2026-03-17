import { Link } from 'react-router-dom';

import { formatCurrency } from '../utils/format';

const fallbackImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1520052205864-92d242b3a76c?auto=format&fit=crop&w=900&q=80',
];

const ServiceCard = ({ service }) => {
  const fallbackImage = fallbackImages[service.id % fallbackImages.length];
  const imageSource = service.sample_image || fallbackImage;

  return (
    <Link to={`/services/${service.id}`} className="service-card">
      <div className="service-image-wrap">
        <img src={imageSource} alt={service.service_name} className="service-image" />
        {!service.sample_image && <span className="image-fallback-tag">Sample pressure washing image</span>}
      </div>
      <div className="service-card-body">
        <div className="service-card-topline">
          <span className="rating-pill">{service.rating}★</span>
          <span className="tiny-label">{service.name_of_the_expert}</span>
        </div>
        <h3>{service.service_name}</h3>
        <p>{service.description}</p>
        <div className="service-card-footer">
          <span>{formatCurrency(service.price)}</span>
          <span>{service.duration_of_service}</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
