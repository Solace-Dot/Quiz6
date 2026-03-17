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

export const authLoginReducer = (state = { userInfo: null }, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null };
    case AUTH_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case AUTH_LOGOUT:
      return { userInfo: null };
    default:
      return state;
  }
};

export const authRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH_REGISTER_REQUEST:
      return { loading: true };
    case AUTH_REGISTER_SUCCESS:
      return { loading: false, success: true };
    case AUTH_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const profileDetailsReducer = (state = { profile: null }, action) => {
  switch (action.type) {
    case PROFILE_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PROFILE_DETAILS_SUCCESS:
      return { loading: false, profile: action.payload };
    case PROFILE_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PROFILE_UPDATE_SUCCESS:
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

export const profileUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_REQUEST:
      return { loading: true };
    case PROFILE_UPDATE_SUCCESS:
      return { loading: false, success: true, profile: action.payload };
    case PROFILE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { ...state, loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, users: [], error: action.payload };
    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true, user: action.payload };
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
