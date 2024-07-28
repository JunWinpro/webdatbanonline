import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLogin, role } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute: Current path', location.pathname);
  console.log('ProtectedRoute: Is Login', isLogin);
  console.log('ProtectedRoute: User Role', role);
  console.log('ProtectedRoute: Allowed Roles', allowedRoles);

  if (!isLogin || !role) {
    console.log('ProtectedRoute: User not logged in or no role, redirecting to signin');
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    console.log('ProtectedRoute: User does not have required role, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute: Access granted');
  return <Outlet />;
};

export default ProtectedRoute;