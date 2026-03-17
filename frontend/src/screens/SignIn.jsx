import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../actions/authActions';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, userInfo } = useSelector((state) => state.authLogin);
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, userInfo]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setValidationError('Email and password are required.');
      return;
    }
    setValidationError('');
    dispatch(login(form.email, form.password));
  };

  return (
    <section className="auth-card">
      <div>
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in with your email</h1>
      </div>
      {(validationError || error) && <div className="error-banner">{validationError || error}</div>}
      <form className="form-grid" onSubmit={submitHandler}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="jane@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter your password"
          />
        </label>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="muted-copy">
        Need an account? <Link to="/signup">Create one here.</Link>
      </p>
    </section>
  );
};

export default SignIn;
