
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function Registro() {
  const [form, setForm] = useState({
  nombre: '',
  matricula: '',
  email: '',
  password: '',
  confirmarPassword: '',
});

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (Object.values(form).some((value) => !value.trim())) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);

      const { confirmarPassword, ...datosRegistro } = form;

        await register({
          ...datosRegistro,
          rol: 'USER',
        });

      setMessage('Registro realizado. Ya puedes iniciar sesión.');

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Registro de usuario</h1>
        <p>Crea tu cuenta para solicitar material deportivo.</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <Input
          label="Nombre completo"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
        />

        <Input
          label="Matrícula"
          name="matricula"
          value={form.matricula}
          onChange={handleChange}
          placeholder="Tu matrícula"
        />

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Crea una contraseña"
        />

        <Input
          label="Confirmar contraseña"
          name="confirmarPassword"
          type="password"
          value={form.confirmarPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </Button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
