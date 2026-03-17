import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { createOrder } from '../actions/orderActions';
import { getServiceDetails } from '../actions/serviceActions';
import { PAYPAL_CLIENT_ID } from '../utils/paypal';
import { formatCurrency } from '../utils/format';

const DetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { service, loading, error } = useSelector((state) => state.serviceDetails);
  const { userInfo } = useSelector((state) => state.authLogin);
  const { success, error: orderError } = useSelector((state) => state.orderCreate);
  const [localMessage, setLocalMessage] = useState('');

  useEffect(() => {
    dispatch(getServiceDetails(id));
  }, [dispatch, id]);

  const canCheckout = useMemo(() => {
    return Boolean(userInfo && service?.seller_merchant_id && PAYPAL_CLIENT_ID);
  }, [service?.seller_merchant_id, userInfo]);

  if (loading) {
    return <div className="info-banner">Loading service details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!service) {
    return null;
  }

  return (
    <section className="detail-grid">
      <div className="detail-card media-panel">
        {service.sample_image ? (
          <img src={service.sample_image} alt={service.service_name} className="detail-image" />
        ) : (
          <div className="detail-image placeholder">No image uploaded</div>
        )}
      </div>
      <div className="detail-card stack-md">
        <span className="eyebrow">Service Detail</span>
        <div className="detail-header">
          <h1>{service.service_name}</h1>
          <span className="rating-pill large">{service.rating}★</span>
        </div>
        <p>{service.description}</p>
        <div className="detail-meta">
          <div>
            <strong>Price</strong>
            <span>{formatCurrency(service.price)}</span>
          </div>
          <div>
            <strong>Duration</strong>
            <span>{service.duration_of_service}</span>
          </div>
          <div>
            <strong>Expert</strong>
            <span>{service.name_of_the_expert}</span>
          </div>
        </div>

        {success && <div className="success-banner">Service order logged successfully.</div>}
        {(orderError || localMessage) && <div className="error-banner">{orderError || localMessage}</div>}

        {!userInfo && (
          <div className="info-banner">
            You need to <Link to="/signin">sign in</Link> before availing this service.
          </div>
        )}
        {userInfo && !service.seller_merchant_id && (
          <div className="info-banner">This seller has not been assigned a merchant ID yet, so checkout is unavailable.</div>
        )}
        {userInfo && !PAYPAL_CLIENT_ID && (
          <div className="info-banner">Set REACT_APP_PAYPAL_CLIENT_ID to enable PayPal checkout.</div>
        )}

        {canCheckout && (
          <div className="paypal-panel">
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'pill' }}
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    {
                      description: service.service_name,
                      amount: { value: String(service.price) },
                      payee: { merchant_id: service.seller_merchant_id },
                    },
                  ],
                })
              }
              onApprove={async (data, actions) => {
                setLocalMessage('');
                const details = await actions.order.capture();
                const transactionId =
                  details.id || details.purchase_units?.[0]?.payments?.captures?.[0]?.id || data.orderID;
                dispatch(
                  createOrder({
                    service: service.id,
                    paypal_transaction_id: transactionId,
                    price_paid: service.price,
                  })
                );
              }}
              onError={() => {
                setLocalMessage('PayPal checkout could not be completed.');
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailScreen;
