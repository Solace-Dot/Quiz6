import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../actions/authActions';

const Layout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authLogin);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand-mark">
          ExpertHub
        </NavLink>
        <nav className="topnav">
          <NavLink to="/">Services</NavLink>
          <NavLink to="/subscriptions">Subscriptions</NavLink>
          <NavLink to="/chatbot">AI Chatbot</NavLink>
          {userInfo?.user.role === 'seller' && <NavLink to="/seller/dashboard">Seller Dashboard</NavLink>}
          {userInfo?.user.role === 'admin' && <NavLink to="/admin/users">Users</NavLink>}
          {userInfo?.user.role === 'admin' && <NavLink to="/admin/subscriptions">Subscription List</NavLink>}
          {userInfo ? (
            <>
              {userInfo.user.role === 'user' && <NavLink to="/apply-seller">Apply as Seller</NavLink>}
              <NavLink to="/profile">Profile</NavLink>
              <button type="button" className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin">Sign In</NavLink>
              <NavLink to="/signup">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
