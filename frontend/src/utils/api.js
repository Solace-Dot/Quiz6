import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
});

export const getErrorMessage = (error) => {
  if (!error?.response) {
    return 'Cannot connect to backend API. Make sure Django server is running at http://127.0.0.1:8000.';
  }
  const data = error?.response?.data;
  if (typeof data === 'string') {
    return data;
  }
  if (data?.detail) {
    return data.detail;
  }
  if (data && typeof data === 'object') {
    const [firstKey] = Object.keys(data);
    const value = data[firstKey];
    if (Array.isArray(value)) {
      return value[0];
    }
    if (typeof value === 'string') {
      return value;
    }
  }
  return error.message || 'Something went wrong.';
};

export const buildConfig = (getState, isMultipart = false) => {
  const token = getState()?.authLogin?.userInfo?.access;
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return { headers };
};

export default api;
