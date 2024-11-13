import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  // If not authenticated, redirect to the login page
  if (!useAuthStore.getState().token) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the children (or Outlet for nested routes)
  return <Outlet />;
};
