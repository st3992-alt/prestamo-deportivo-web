
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

function MisPrestamos() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  async function cargarPrestamos() {
    try {
      setLoading(true);
      setError('');

      const response = await apiFetch('/api/sports/loans');

      const todosLosPrestamos = Array.isArray(response)
        ? response
        : response.loans || [];

      const prestamosUsuario = todosLosPrestamos.filter(
        (loan) => Number(loan.userId) === Number(user.id)
      );

      setLoans(prestamosUsuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPrestamos();
  }, []);

  function formatearFecha(fecha) {
    if (!fecha) return 'No disponible';

    return new Date(fecha).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  const prestamosActivos = loans.filter(
    (loan) => loan.estatus === 'ACTIVO'
  );

  const prestamosFinalizados = loans.filter(
    (loan) => loan.estatus === 'FINALIZADO'
  );

  function mostrarPrestamo(loan) {
    return (
      <article className="data-card" key={loan.loanId}>
        <h3>{loan.item}</h3>

        <p><strong>Código:</strong> {loan.codigo}</p>
        <p><strong>Deporte:</strong> {loan.deporte}</p>
        <p><strong>Cantidad:</strong> {loan.cantidad}</p>
        <p><strong>Cancha o actividad:</strong> {loan.canchaOActividad}</p>
        <p><strong>Hora de salida:</strong> {formatearFecha(loan.horaSalida)}</p>
        <p><strong>Hora de devolución:</strong> {formatearFecha(loan.horaDevolucion)}</p>
        <p>
          <strong>Estado:</strong>{' '}
          {loan.estatus === 'ACTIVO' ? 'Activo' : 'Finalizado'}
        </p>
      </article>
    );
  }

  if (loading) return <p>Cargando préstamos...</p>;

  return (
    <section className="page-content">
      <h1>Mis préstamos</h1>
      <p>Consulta tus préstamos activos y el historial de devoluciones.</p>

      {error && <p className="error-message">{error}</p>}

      <h2>Préstamos activos</h2>

      <div className="cards-grid">
        {prestamosActivos.map(mostrarPrestamo)}
      </div>

      {prestamosActivos.length === 0 && (
        <p>No tienes préstamos activos.</p>
      )}

      <h2>Historial de préstamos</h2>

      <div className="cards-grid">
        {prestamosFinalizados.map(mostrarPrestamo)}
      </div>

      {prestamosFinalizados.length === 0 && (
        <p>Aún no tienes préstamos finalizados.</p>
      )}
    </section>
  );
}

export default MisPrestamos;
