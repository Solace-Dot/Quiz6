import api, { buildConfig, getErrorMessage } from '../utils/api';
import { CHAT_ASK_FAIL, CHAT_ASK_REQUEST, CHAT_ASK_SUCCESS } from '../constants/chatConstants';

export const askChatbot = (message) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT_ASK_REQUEST });
    const { data } = await api.post('/chat/ask/', { message }, buildConfig(getState));
    dispatch({ type: CHAT_ASK_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const messageText = getErrorMessage(error);
    dispatch({ type: CHAT_ASK_FAIL, payload: messageText });
    throw new Error(messageText);
  }
};
