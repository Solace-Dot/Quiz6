import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';

import {
  applicationActionReducer,
  applicationListReducer,
  applicationSubmitReducer,
} from './reducers/applicationReducers';
import {
  authLoginReducer,
  authRegisterReducer,
  profileDetailsReducer,
  profileUpdateReducer,
  userDeleteReducer,
  userListReducer,
  userUpdateReducer,
} from './reducers/authReducers';
import { chatAskReducer } from './reducers/chatReducers';
import { orderCreateReducer, orderHistoryReducer } from './reducers/orderReducers';
import {
  sellerServiceListReducer,
  serviceCreateReducer,
  serviceDeleteReducer,
  serviceDetailsReducer,
  serviceListReducer,
  serviceUpdateReducer,
} from './reducers/serviceReducers';
import {
  currentSubscriptionReducer,
  subscriptionCreateReducer,
  subscriptionListReducer,
  subscriptionTierListReducer,
} from './reducers/subscriptionReducers';

const reducer = combineReducers({
  authLogin: authLoginReducer,
  authRegister: authRegisterReducer,
  profileDetails: profileDetailsReducer,
  profileUpdate: profileUpdateReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,
  serviceList: serviceListReducer,
  serviceDetails: serviceDetailsReducer,
  sellerServiceList: sellerServiceListReducer,
  serviceCreate: serviceCreateReducer,
  serviceUpdate: serviceUpdateReducer,
  serviceDelete: serviceDeleteReducer,
  applicationSubmit: applicationSubmitReducer,
  applicationList: applicationListReducer,
  applicationAction: applicationActionReducer,
  orderCreate: orderCreateReducer,
  orderHistory: orderHistoryReducer,
  subscriptionTierList: subscriptionTierListReducer,
  subscriptionCreate: subscriptionCreateReducer,
  currentSubscription: currentSubscriptionReducer,
  subscriptionList: subscriptionListReducer,
  chatAsk: chatAskReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  authLogin: { userInfo: userInfoFromStorage },
};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
