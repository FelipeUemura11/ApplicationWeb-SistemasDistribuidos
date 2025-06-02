import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../context/authContext";
import LoadingModal from '../LoadingModal';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingModal visible={true} message="Verificando sessão..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login-register" replace />;
  }

  return <>{children}</>;
}