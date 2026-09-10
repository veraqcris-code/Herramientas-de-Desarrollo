import { Navigate, Outlet } from 'react-router-dom';

export default function RutaProtegida() {
  const autenticado = sessionStorage.getItem('tempus_admin_usuario') !== null;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}