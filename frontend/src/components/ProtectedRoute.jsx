import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.authLogin);

  if (!userInfo) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.includes(userInfo.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
