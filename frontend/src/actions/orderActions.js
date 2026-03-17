import api, { buildConfig, getErrorMessage } from '../utils/api';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_HISTORY_FAIL,
  ORDER_HISTORY_REQUEST,
  ORDER_HISTORY_SUCCESS,
} from '../constants/orderConstants';

export const createOrder = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    const { data } = await api.post('/orders/create/', payload, buildConfig(getState));
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: getErrorMessage(error) });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_HISTORY_REQUEST });
    const { data } = await api.get('/orders/history/', buildConfig(getState));
    dispatch({ type: ORDER_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ORDER_HISTORY_FAIL, payload: getErrorMessage(error) });
  }
};
