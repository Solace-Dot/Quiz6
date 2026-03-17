import { CHAT_ASK_FAIL, CHAT_ASK_REQUEST, CHAT_ASK_SUCCESS } from '../constants/chatConstants';

export const chatAskReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT_ASK_REQUEST:
      return { loading: true };
    case CHAT_ASK_SUCCESS:
      return { loading: false, success: true, reply: action.payload };
    case CHAT_ASK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
