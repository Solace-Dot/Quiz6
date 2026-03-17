import api, { buildConfig, getErrorMessage } from '../utils/api';
import {
  APPLICATION_ACTION_FAIL,
  APPLICATION_ACTION_REQUEST,
  APPLICATION_ACTION_SUCCESS,
  APPLICATION_LIST_FAIL,
  APPLICATION_LIST_REQUEST,
  APPLICATION_LIST_SUCCESS,
  APPLICATION_SUBMIT_FAIL,
  APPLICATION_SUBMIT_REQUEST,
  APPLICATION_SUBMIT_SUCCESS,
} from '../constants/applicationConstants';

export const submitSellerApplication = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPLICATION_SUBMIT_REQUEST });
    const { data } = await api.post('/applications/apply/', {}, buildConfig(getState));
    dispatch({ type: APPLICATION_SUBMIT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPLICATION_SUBMIT_FAIL, payload: getErrorMessage(error) });
  }
};

export const listApplications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPLICATION_LIST_REQUEST });
    const { data } = await api.get('/applications/list/', buildConfig(getState));
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPLICATION_LIST_FAIL, payload: getErrorMessage(error) });
  }
};

export const approveApplication = (id, merchant_id) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPLICATION_ACTION_REQUEST });
    const { data } = await api.post(`/applications/${id}/approve/`, { merchant_id }, buildConfig(getState));
    dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: getErrorMessage(error) });
  }
};

export const declineApplication = (id, decline_reason) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPLICATION_ACTION_REQUEST });
    const { data } = await api.post(`/applications/${id}/decline/`, { decline_reason }, buildConfig(getState));
    dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: getErrorMessage(error) });
  }
};
