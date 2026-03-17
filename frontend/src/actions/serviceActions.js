import api, { buildConfig, getErrorMessage } from '../utils/api';
import {
  SELLER_SERVICE_LIST_FAIL,
  SELLER_SERVICE_LIST_REQUEST,
  SELLER_SERVICE_LIST_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_SUCCESS,
  SERVICE_DELETE_FAIL,
  SERVICE_DELETE_REQUEST,
  SERVICE_DELETE_SUCCESS,
  SERVICE_DETAILS_FAIL,
  SERVICE_DETAILS_REQUEST,
  SERVICE_DETAILS_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_UPDATE_FAIL,
  SERVICE_UPDATE_REQUEST,
  SERVICE_UPDATE_SUCCESS,
} from '../constants/serviceConstants';

export const listServices = () => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_LIST_REQUEST });
    const { data } = await api.get('/services/list/');
    dispatch({ type: SERVICE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SERVICE_LIST_FAIL, payload: getErrorMessage(error) });
  }
};

export const getServiceDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_DETAILS_REQUEST });
    const { data } = await api.get(`/services/${id}/`);
    dispatch({ type: SERVICE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SERVICE_DETAILS_FAIL, payload: getErrorMessage(error) });
  }
};

export const listSellerServices = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SELLER_SERVICE_LIST_REQUEST });
    const { data } = await api.get('/services/manage/', buildConfig(getState));
    dispatch({ type: SELLER_SERVICE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SELLER_SERVICE_LIST_FAIL, payload: getErrorMessage(error) });
  }
};

export const createService = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_CREATE_REQUEST });
    const { data } = await api.post('/services/manage/', formData, buildConfig(getState, true));
    dispatch({ type: SERVICE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SERVICE_CREATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const updateService = (id, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_UPDATE_REQUEST });
    const { data } = await api.put(`/services/manage/${id}/`, formData, buildConfig(getState, true));
    dispatch({ type: SERVICE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SERVICE_UPDATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const deleteService = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_DELETE_REQUEST });
    await api.delete(`/services/manage/${id}/`, buildConfig(getState));
    dispatch({ type: SERVICE_DELETE_SUCCESS });
  } catch (error) {
    dispatch({ type: SERVICE_DELETE_FAIL, payload: getErrorMessage(error) });
  }
};
