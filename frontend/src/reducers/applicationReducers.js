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

export const applicationSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case APPLICATION_SUBMIT_REQUEST:
      return { loading: true };
    case APPLICATION_SUBMIT_SUCCESS:
      return { loading: false, success: true, application: action.payload };
    case APPLICATION_SUBMIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const applicationListReducer = (state = { applications: [] }, action) => {
  switch (action.type) {
    case APPLICATION_LIST_REQUEST:
      return { ...state, loading: true };
    case APPLICATION_LIST_SUCCESS:
      return { loading: false, applications: action.payload };
    case APPLICATION_LIST_FAIL:
      return { loading: false, applications: [], error: action.payload };
    default:
      return state;
  }
};

export const applicationActionReducer = (state = {}, action) => {
  switch (action.type) {
    case APPLICATION_ACTION_REQUEST:
      return { loading: true };
    case APPLICATION_ACTION_SUCCESS:
      return { loading: false, success: true, application: action.payload };
    case APPLICATION_ACTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
