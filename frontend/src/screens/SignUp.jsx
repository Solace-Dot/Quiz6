import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { register } from '../actions/authActions';

const initialForm = {
  email: '',
  username: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  location: '',
  gender: '',
  password: '',
  confirm_password: '',
};

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.authRegister);
  const { userInfo } = useSelector((state) => state.authLogin);

  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (userInfo || success) {
      navigate('/');
    }
  }, [navigate, success, userInfo]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setValidationError('All registration fields are required.');
      return;
    }
    if (form.password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setValidationError('Password and confirm password must match.');
      return;
    }
    setValidationError('');
    dispatch(register(form));
  };

  return (
    <section className="auth-card wide-card">
      <div>
        <span className="eyebrow">Create account</span>
        <h1>Register as a platform user</h1>
      </div>
      {(validationError || error) && <div className="error-banner">{validationError || error}</div>}
      <form className="form-grid two-column" onSubmit={submitHandler}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={changeHandler} />
        </label>
        <label>
          Username
          <input name="username" value={form.username} onChange={changeHandler} />
        </label>
        <label>
          Phone Number
          <input name="phone_number" value={form.phone_number} onChange={changeHandler} />
        </label>
        <label>
          First Name
          <input name="first_name" value={form.first_name} onChange={changeHandler} />
        </label>
        <label>
          Last Name
          <input name="last_name" value={form.last_name} onChange={changeHandler} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={changeHandler} />
        </label>
        <label>
          Gender
          <select name="gender" value={form.gender} onChange={changeHandler}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={changeHandler} />
        </label>
        <label>
          Confirm Password
          <input name="confirm_password" type="password" value={form.confirm_password} onChange={changeHandler} />
        </label>
        <button type="submit" className="primary-button span-two" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="muted-copy">
        Already registered? <Link to="/signin">Sign in here.</Link>
      </p>
    </section>
  );
};

export default SignUp;
