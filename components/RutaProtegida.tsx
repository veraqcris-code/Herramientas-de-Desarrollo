import { Navigate, Outlet } from 'react-router-dom';
import { SESSION_KEY } from '../config/auth';

export default function RutaProtegida() {
  const autenticado = sessionStorage.getItem(SESSION_KEY) !== null;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
