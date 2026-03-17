import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { logout } from '../actions/authActions';

const Layout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authLogin);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app-shell">
      <Navbar bg="light" expand="lg" className="topbar" sticky="top">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" className="brand-mark">
            PressureWash Pro
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto topnav">
              <Nav.Link as={NavLink} to="/">Pressure Washing Services</Nav.Link>
              <Nav.Link as={NavLink} to="/subscriptions">Subscriptions</Nav.Link>
              <Nav.Link as={NavLink} to="/chatbot">AI Chatbot</Nav.Link>
              {userInfo?.user.role === 'seller' && <Nav.Link as={NavLink} to="/seller/dashboard">Seller Dashboard</Nav.Link>}
              {userInfo?.user.role === 'admin' && <Nav.Link as={NavLink} to="/admin/users">Users</Nav.Link>}
              {userInfo?.user.role === 'admin' && <Nav.Link as={NavLink} to="/admin/subscriptions">Subscription List</Nav.Link>}
              {userInfo ? (
                <>
                  {userInfo.user.role === 'user' && <Nav.Link as={NavLink} to="/apply-seller">Apply as Seller</Nav.Link>}
                  <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                  <button type="button" className="nav-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/signin">Sign In</Nav.Link>
                  <Nav.Link as={NavLink} to="/signup">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
