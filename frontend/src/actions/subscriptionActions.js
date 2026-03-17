import api, { buildConfig, getErrorMessage } from '../utils/api';
import {
  SUBSCRIPTION_CREATE_FAIL,
  SUBSCRIPTION_CREATE_REQUEST,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_CURRENT_FAIL,
  SUBSCRIPTION_CURRENT_REQUEST,
  SUBSCRIPTION_CURRENT_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_TIER_LIST_FAIL,
  SUBSCRIPTION_TIER_LIST_REQUEST,
  SUBSCRIPTION_TIER_LIST_SUCCESS,
} from '../constants/subscriptionConstants';

export const listSubscriptionTiers = () => async (dispatch) => {
  try {
    dispatch({ type: SUBSCRIPTION_TIER_LIST_REQUEST });
    const { data } = await api.get('/subscriptions/tiers/');
    dispatch({ type: SUBSCRIPTION_TIER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUBSCRIPTION_TIER_LIST_FAIL, payload: getErrorMessage(error) });
  }
};

export const createSubscription = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_CREATE_REQUEST });
    const { data } = await api.post('/subscriptions/subscribe/', payload, buildConfig(getState));
    dispatch({ type: SUBSCRIPTION_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUBSCRIPTION_CREATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const getCurrentSubscription = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_CURRENT_REQUEST });
    const { data } = await api.get('/subscriptions/current/', buildConfig(getState));
    dispatch({ type: SUBSCRIPTION_CURRENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUBSCRIPTION_CURRENT_FAIL, payload: getErrorMessage(error) });
  }
};

export const listSubscriptions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });
    const { data } = await api.get('/subscriptions/admin/list/', buildConfig(getState));
    dispatch({ type: SUBSCRIPTION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUBSCRIPTION_LIST_FAIL, payload: getErrorMessage(error) });
  }
};
