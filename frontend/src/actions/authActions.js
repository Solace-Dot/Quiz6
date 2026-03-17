import api, { buildConfig, getErrorMessage } from '../utils/api';
import {
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER_FAIL,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  PROFILE_DETAILS_FAIL,
  PROFILE_DETAILS_REQUEST,
  PROFILE_DETAILS_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from '../constants/authConstants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    const { data } = await api.post('/users/login/', { email, password });
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({ type: AUTH_LOGIN_FAIL, payload: getErrorMessage(error) });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REGISTER_REQUEST });
    await api.post('/users/register/', formData);
    dispatch({ type: AUTH_REGISTER_SUCCESS });
    await dispatch(login(formData.email, formData.password));
  } catch (error) {
    dispatch({ type: AUTH_REGISTER_FAIL, payload: getErrorMessage(error) });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: AUTH_LOGOUT });
};

export const getUserProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_DETAILS_REQUEST });
    const { data } = await api.get('/users/profile/', buildConfig(getState));
    dispatch({ type: PROFILE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PROFILE_DETAILS_FAIL, payload: getErrorMessage(error) });
  }
};

export const updateUserProfile = (profile) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_UPDATE_REQUEST });
    const { data } = await api.put('/users/profile/', profile, buildConfig(getState));
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: data });
    const userInfo = { ...getState().authLogin.userInfo, user: data };
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: userInfo });
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    dispatch({ type: PROFILE_UPDATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const { data } = await api.get('/users/admin/users/', buildConfig(getState));
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_LIST_FAIL, payload: getErrorMessage(error) });
  }
};

export const updateUser = (id, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const { data } = await api.put(`/users/admin/users/${id}/`, formData, buildConfig(getState));
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    await api.delete(`/users/admin/users/${id}/`, buildConfig(getState));
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({ type: USER_DELETE_FAIL, payload: getErrorMessage(error) });
  }
};
