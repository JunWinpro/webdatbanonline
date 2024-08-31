import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles, isLoading }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userInfo || !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;