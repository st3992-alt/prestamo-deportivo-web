
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-layout">
      <header className="navbar">
        <h2>Préstamo Deportivo</h2>

        <nav>
          <NavLink to="/inventario">
            Inventario
          </NavLink>

          <NavLink to="/mis-prestamos">
            Mis préstamos
          </NavLink>

          {user?.rol === 'ADMIN' && (
            <NavLink to="/admin">
              Administración
            </NavLink>
          )}
        </nav>

        <div className="navbar-user">
          <span>
            {user?.nombre || user?.email || user?.matricula}
          </span>

          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
