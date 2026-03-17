import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askChatbot } from '../actions/chatActions';
import { getCurrentSubscription } from '../actions/subscriptionActions';

const ChatbotScreen = () => {
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.currentSubscription);
  const { loading, error } = useSelector((state) => state.chatAsk);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask about platform services, seller applications, subscriptions, orders, or PayPal payment flow.',
    },
  ]);

  useEffect(() => {
    dispatch(getCurrentSubscription());
  }, [dispatch]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    const userMessage = { role: 'user', text: message };
    setMessages((previous) => [...previous, userMessage]);
    const currentText = message;
    setMessage('');

    try {
      const response = await dispatch(askChatbot(currentText));
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: `${response.reply} Usage left: ${response.usage_left}`,
        },
      ]);
      dispatch(getCurrentSubscription());
    } catch (requestError) {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: requestError.message,
        },
      ]);
    }
  };

  return (
    <section className="panel stack-md chatbot-shell">
      <div>
        <span className="eyebrow">AI Chatbot</span>
        <h1>Project-limited Q&amp;A</h1>
        <p>
          Active subscription: {subscription?.tier?.name || 'None'} | Usage left: {subscription?.usage_left ?? 0}
        </p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="chat-log">
        {messages.map((entry, index) => (
          <div key={`${entry.role}-${index}`} className={`chat-bubble ${entry.role}`}>
            {entry.text}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={submitHandler}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about services, sellers, subscriptions, orders, or PayPal flow..."
        />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </section>
  );
};

export default ChatbotScreen;
