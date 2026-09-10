import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const appTitle = 'Tempus - Panel de Administrador';
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm"
         style={{ backgroundColor: "#20232A" }}>
      <div className="container">
        {/* Brand */}
        <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
                 to="/ciudades">
          <i className="bi bi-cloud-sun" style={{ color: "#61DAFB" }}></i>
          <span style={{ color: "#61DAFB" }}>{appTitle}</span>
        </NavLink>

        {/* Toggler para móviles */}
        <button className="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <button className="btn btn-sm px-3 fw-bold"
                style={{ backgroundColor: "#61DAFB", color: "#20232A" }}
                onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;