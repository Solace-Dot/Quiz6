import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { approveApplication, declineApplication, listApplications } from '../actions/applicationActions';
import { deleteUser, listUsers, updateUser } from '../actions/authActions';
import Modal from '../components/Modal';

const UserScreen = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userList);
  const { applications } = useSelector((state) => state.applicationList);
  const userUpdateState = useSelector((state) => state.userUpdate);
  const userDeleteState = useSelector((state) => state.userDelete);
  const applicationAction = useSelector((state) => state.applicationAction);

  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });
  const [approveTarget, setApproveTarget] = useState(null);
  const [merchantId, setMerchantId] = useState('');
  const [declineTarget, setDeclineTarget] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    dispatch(listUsers());
    dispatch(listApplications());
  }, [dispatch, userUpdateState.success, userDeleteState.success, applicationAction.success]);

  const pendingApplications = useMemo(
    () => applications?.filter((application) => application.status === 'pending') || [],
    [applications]
  );

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const saveUserChanges = () => {
    dispatch(updateUser(editingUser.id, editForm));
    setEditingUser(null);
  };

  const approveSeller = () => {
    dispatch(approveApplication(approveTarget.id, merchantId));
    setApproveTarget(null);
    setMerchantId('');
  };

  const declineSeller = () => {
    dispatch(declineApplication(declineTarget.id, declineReason));
    setDeclineTarget(null);
    setDeclineReason('');
  };

  return (
    <section className="panel stack-md">
      <div>
        <span className="eyebrow">Admin Controls</span>
        <h1>User management</h1>
      </div>
      {(error || userUpdateState.error || userDeleteState.error || applicationAction.error) && (
        <div className="error-banner">{error || userUpdateState.error || userDeleteState.error || applicationAction.error}</div>
      )}
      <div className="tab-row">
        <button type="button" className={activeTab === 'users' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button
          type="button"
          className={activeTab === 'applications' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('applications')}
        >
          Seller Applications
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="ghost-button" onClick={() => openEditModal(user)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => dispatch(deleteUser(user.id))}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users?.length && !loading && (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map((application) => (
                <tr key={application.id}>
                  <td>{application.user.name}</td>
                  <td>{application.user.email}</td>
                  <td>{application.status}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="ghost-button" onClick={() => setApproveTarget(application)}>
                        Approve
                      </button>
                      <button type="button" className="danger-button" onClick={() => setDeclineTarget(application)}>
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pendingApplications.length && (
                <tr>
                  <td colSpan="4">No pending seller applications.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={Boolean(editingUser)} title="Edit User" onClose={() => setEditingUser(null)}>
        <div className="form-grid">
          <label>
            First Name
            <input value={editForm.first_name} onChange={(event) => setEditForm({ ...editForm, first_name: event.target.value })} />
          </label>
          <label>
            Last Name
            <input value={editForm.last_name} onChange={(event) => setEditForm({ ...editForm, last_name: event.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} />
          </label>
          <button type="button" className="primary-button" onClick={saveUserChanges}>
            Save Changes
          </button>
        </div>
      </Modal>

      <Modal isOpen={Boolean(approveTarget)} title="Approve Seller" onClose={() => setApproveTarget(null)}>
        <div className="form-grid">
          <label>
            Merchant ID
            <input value={merchantId} onChange={(event) => setMerchantId(event.target.value)} placeholder="PayPal merchant id" />
          </label>
          <button type="button" className="primary-button" onClick={approveSeller}>
            Approve Application
          </button>
        </div>
      </Modal>

      <Modal isOpen={Boolean(declineTarget)} title="Decline Seller" onClose={() => setDeclineTarget(null)}>
        <div className="form-grid">
          <label>
            Reason for declining
            <textarea value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} />
          </label>
          <button type="button" className="danger-button" onClick={declineSeller}>
            Decline Application
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default UserScreen;
