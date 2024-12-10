import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import * as JWT from 'jsonwebtoken';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    
  const { isAuthenticated, role } = useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token)
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;

  try {
    // const decoded = JWT.verify(
    //   token,
    //   "your_jwt_secret_key"
    // );
  
    // if (typeof decoded !== "string" && decoded.role) {
    //   if (requiredRole && decoded.role !== requiredRole) {
    //     return (
    //       <Navigate
    //         to="/login"
    //         replace
    //         state={{ from: window.location.pathname }}
    //       />
    //     );
    //   }
    // } else {
    //   return (
    //     <Navigate
    //       to="/login"
    //       replace
    //       state={{ from: window.location.pathname }}
    //     />
    //   );
    // }
  } catch (error) {
    console.error("JWT verification failed:", error);
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;