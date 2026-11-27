
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Inventario from './pages/Inventario';
import MisPrestamos from './pages/MisPrestamos';
import Admin from './pages/Admin';

function ProtectedRoute({ adminOnly = false }) {
  const { user } = useAuth();
  const token = localStorage.getItem('user_jwt_token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.rol !== 'ADMIN') {
    return <Navigate to="/inventario" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const { user } = useAuth();
  const token = localStorage.getItem('user_jwt_token');
  const authenticated = Boolean(token && user);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          authenticated
            ? <Navigate to={user.rol === 'ADMIN' ? '/admin' : '/inventario'} replace />
            : <Login />
        }
      />

      <Route
        path="/registro"
        element={<Registro />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/mis-prestamos" element={<MisPrestamos />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to={authenticated ? '/inventario' : '/login'} replace />}
      />

      <Route
        path="*"
        element={<Navigate to={authenticated ? '/inventario' : '/login'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
