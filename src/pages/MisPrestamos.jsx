
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

function MisPrestamos() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function cargarPrestamos() {
    try {
      setLoading(true);
      setError('');

      const response = await apiFetch('/api/sports/loans');

      setLoans(Array.isArray(response) ? response : response.loans || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function devolverPrestamo(id) {
    try {
      setError('');
      setMessage('');

      await apiFetch(`/api/sports/loans/${id}/return`, {
        method: 'PATCH',
      });

      setMessage('Devolución registrada correctamente.');
      await cargarPrestamos();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    cargarPrestamos();
  }, []);

  if (loading) return <p>Cargando préstamos...</p>;

  return (
    <section>
      <h1>Mis préstamos</h1>
      <p>Consulta el estado de tus solicitudes y préstamos.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="cards-grid">
        {loans.map((loan) => {
          const id = loan._id || loan.id;
          const estado = loan.estado || loan.status;

          return (
            <article className="data-card" key={id}>
              <h3>
                {loan.item?.nombre ||
                  loan.item?.name ||
                  loan.nombreMaterial ||
                  'Préstamo'}
              </h3>

              <p>Estado: {estado || 'No especificado'}</p>

              <p>
                Fecha de solicitud:{' '}
                {loan.fechaSolicitud
                  ? new Date(loan.fechaSolicitud).toLocaleDateString()
                  : loan.createdAt
                    ? new Date(loan.createdAt).toLocaleDateString()
                    : 'No disponible'}
              </p>

              {estado === 'APROBADO' && (
                <button
                  className="action-button"
                  onClick={() => devolverPrestamo(id)}
                >
                  Registrar devolución
                </button>
              )}
            </article>
          );
        })}
      </div>

      {loans.length === 0 && <p>No tienes préstamos registrados.</p>}
    </section>
  );
}

export default MisPrestamos;
