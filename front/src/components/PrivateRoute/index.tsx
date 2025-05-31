import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

// impedir que o usuario acesse a pagina home sem estar autenticado
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 