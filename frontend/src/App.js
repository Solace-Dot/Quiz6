import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import './App.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ApplySeller from './screens/ApplySeller';
import ChatbotScreen from './screens/ChatbotScreen';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import SellerDashboard from './screens/SellerDashboard';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import SubscriptionList from './screens/SubscriptionList';
import SubscriptionScreen from './screens/SubscriptionScreen';
import UserProfile from './screens/UserProfile';
import UserScreen from './screens/UserScreen';
import { PAYPAL_CLIENT_ID } from './utils/paypal';

function App() {
  const appRoutes = (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="/services/:id" element={<DetailScreen />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/apply-seller" element={<ApplySeller />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/subscriptions" element={<SubscriptionScreen />} />
            <Route path="/chatbot" element={<ChatbotScreen />} />
          </Route>

          <Route element={<ProtectedRoute roles={['seller']} />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/users" element={<UserScreen />} />
            <Route path="/admin/subscriptions" element={<SubscriptionList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );

  if (!PAYPAL_CLIENT_ID) {
    return appRoutes;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
        vault: true,
        components: 'buttons',
      }}
    >
      {appRoutes}
    </PayPalScriptProvider>
  );
}

export default App;
