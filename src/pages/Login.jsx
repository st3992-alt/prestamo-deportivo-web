
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function Login() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!matricula.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      setLoading(true);

      const loggedUser = await login({
        matricula,
        password,
      });

      navigate(
        loggedUser.rol === 'ADMIN' ? '/admin' : '/inventario'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Inicio de sesión</h1>
        <p>Ingresa tus datos para continuar.</p>

        {error && <p className="error-message">{error}</p>}

        <Input
          label="Matrícula"
          name="matricula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Ingresa tu matrícula"
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>

        <p className="auth-link">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
