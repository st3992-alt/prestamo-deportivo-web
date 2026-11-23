
import { Routes, Route, Navigate } from 'react-router-dom';

function Login() {
  return <h1>Inicio de sesión</h1>;
}

function Registro() {
  return <h1>Registro de usuario</h1>;
}

function Inventario() {
  return <h1>Inventario deportivo</h1>;
}

function MisPrestamos() {
  return <h1>Mis préstamos</h1>;
}

function Admin() {
  return <h1>Panel de administración</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/mis-prestamos" element={<MisPrestamos />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
