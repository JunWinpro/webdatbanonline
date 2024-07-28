import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLogin, accessToken } = useSelector((state) => state.auth);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLogin && accessToken) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/userInfos/me`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLogin, accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLogin || !userRole) {
    console.log('ProtectedRoute: User not logged in or no user info, redirecting to signin');
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute: User does not have required role, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute: Access granted');
  return <Outlet />;
};

export default ProtectedRoute;