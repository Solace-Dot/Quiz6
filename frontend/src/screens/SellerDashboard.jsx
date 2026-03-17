import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createService, deleteService, listSellerServices, updateService } from '../actions/serviceActions';
import { formatCurrency } from '../utils/format';

const emptyForm = {
  service_name: '',
  description: '',
  price: '',
  duration_of_service: '',
  sample_image: null,
};

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.sellerServiceList);
  const serviceCreate = useSelector((state) => state.serviceCreate);
  const serviceUpdate = useSelector((state) => state.serviceUpdate);
  const serviceDelete = useSelector((state) => state.serviceDelete);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(listSellerServices());
  }, [dispatch, serviceCreate.success, serviceUpdate.success, serviceDelete.success]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!form.service_name || !form.description || !form.price || !form.duration_of_service) {
      setValidationError('Service name, description, price, and duration are required.');
      return;
    }

    const payload = new FormData();
    payload.append('service_name', form.service_name);
    payload.append('description', form.description);
    payload.append('price', form.price);
    payload.append('duration_of_service', form.duration_of_service);
    if (form.sample_image) {
      payload.append('sample_image', form.sample_image);
    }

    setValidationError('');
    if (editingId) {
      dispatch(updateService(editingId, payload));
    } else {
      dispatch(createService(payload));
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm({
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      duration_of_service: service.duration_of_service,
      sample_image: null,
    });
  };

  return (
    <div className="dashboard-grid">
      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Seller Workspace</span>
          <h1>{editingId ? 'Edit service' : 'Add a new service'}</h1>
        </div>
        {(validationError || error || serviceCreate.error || serviceUpdate.error || serviceDelete.error) && (
          <div className="error-banner">
            {validationError || error || serviceCreate.error || serviceUpdate.error || serviceDelete.error}
          </div>
        )}
        {(serviceCreate.success || serviceUpdate.success || serviceDelete.success) && (
          <div className="success-banner">Seller service data has been updated.</div>
        )}
        <form className="form-grid" onSubmit={submitHandler}>
          <label>
            Service Name
            <input value={form.service_name} onChange={(event) => setForm({ ...form, service_name: event.target.value })} />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label>
            Price
            <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          </label>
          <label>
            Duration of Service
            <input value={form.duration_of_service} onChange={(event) => setForm({ ...form, duration_of_service: event.target.value })} />
          </label>
          <label>
            Sample Image
            <input type="file" accept="image/*" onChange={(event) => setForm({ ...form, sample_image: event.target.files?.[0] || null })} />
          </label>
          <div className="button-row">
            <button type="submit" className="primary-button">
              {editingId ? 'Update Service' : 'Add Service'}
            </button>
            {editingId && (
              <button type="button" className="ghost-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Published Services</span>
          <h2>Manage your current listings</h2>
        </div>
        {loading && <div className="info-banner">Loading your services...</div>}
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services?.map((service) => (
                <tr key={service.id}>
                  <td>{service.service_name}</td>
                  <td>{formatCurrency(service.price)}</td>
                  <td>{service.duration_of_service}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="ghost-button" onClick={() => startEdit(service)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => dispatch(deleteService(service.id))}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!services?.length && !loading && (
                <tr>
                  <td colSpan="4">No services found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
