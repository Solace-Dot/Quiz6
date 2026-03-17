import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { listApplications, submitSellerApplication } from '../actions/applicationActions';

const ApplySeller = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applicationList);
  const { loading: submitting, error: submitError, success } = useSelector((state) => state.applicationSubmit);
  const currentApplication = applications?.[0];

  useEffect(() => {
    dispatch(listApplications());
  }, [dispatch, success]);

  return (
    <section className="panel stack-md">
      <div>
        <span className="eyebrow">Seller Access</span>
        <h1>Apply to become a seller</h1>
        <p>
          Any standard user can apply. Admin approval is required before you can publish pressure washing
          packages and receive direct PayPal payments.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {submitError && <div className="error-banner">{submitError}</div>}
      {success && <div className="success-banner">Your seller application has been submitted.</div>}

      <div className="status-strip">
        <div>
          <strong>Current Status</strong>
          <span>{currentApplication?.status || 'No application submitted yet'}</span>
        </div>
        <div>
          <strong>Decline Reason</strong>
          <span>{currentApplication?.decline_reason || 'N/A'}</span>
        </div>
      </div>

      <button
        type="button"
        className="primary-button"
        disabled={loading || submitting || currentApplication?.status === 'pending'}
        onClick={() => dispatch(submitSellerApplication())}
      >
        {submitting ? 'Submitting...' : 'Apply as Seller'}
      </button>
    </section>
  );
};

export default ApplySeller;
