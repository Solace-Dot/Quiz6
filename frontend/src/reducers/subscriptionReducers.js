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

export const subscriptionTierListReducer = (state = { tiers: [] }, action) => {
  switch (action.type) {
    case SUBSCRIPTION_TIER_LIST_REQUEST:
      return { ...state, loading: true };
    case SUBSCRIPTION_TIER_LIST_SUCCESS:
      return { loading: false, tiers: action.payload };
    case SUBSCRIPTION_TIER_LIST_FAIL:
      return { loading: false, tiers: [], error: action.payload };
    default:
      return state;
  }
};

export const subscriptionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_CREATE_REQUEST:
      return { loading: true };
    case SUBSCRIPTION_CREATE_SUCCESS:
      return { loading: false, success: true, subscription: action.payload };
    case SUBSCRIPTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const currentSubscriptionReducer = (state = { subscription: null }, action) => {
  switch (action.type) {
    case SUBSCRIPTION_CURRENT_REQUEST:
      return { ...state, loading: true };
    case SUBSCRIPTION_CURRENT_SUCCESS:
      return { loading: false, subscription: action.payload };
    case SUBSCRIPTION_CURRENT_FAIL:
      return { loading: false, subscription: null, error: action.payload };
    default:
      return state;
  }
};

export const subscriptionListReducer = (state = { subscriptions: [] }, action) => {
  switch (action.type) {
    case SUBSCRIPTION_LIST_REQUEST:
      return { ...state, loading: true };
    case SUBSCRIPTION_LIST_SUCCESS:
      return { loading: false, subscriptions: action.payload };
    case SUBSCRIPTION_LIST_FAIL:
      return { loading: false, subscriptions: [], error: action.payload };
    default:
      return state;
  }
};
