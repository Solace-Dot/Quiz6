import { Link } from 'react-router-dom';

import { formatCurrency } from '../utils/format';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services/${service.id}`} className="service-card">
      <div className="service-image-wrap">
        {service.sample_image ? (
          <img src={service.sample_image} alt={service.service_name} className="service-image" />
        ) : (
          <div className="service-image placeholder">No preview available</div>
        )}
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
