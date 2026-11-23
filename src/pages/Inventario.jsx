
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Inventario() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function cargarInventario() {
    try {
      setLoading(true);
      setError('');

      const response = await apiFetch('/api/sports/items');

      setItems(Array.isArray(response) ? response : response.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function solicitarPrestamo(item) {
    try {
      setError('');
      setMessage('');

      await apiFetch('/api/sports/loans', {
        method: 'POST',
        body: JSON.stringify({
          itemId: item._id || item.id,
        }),
      });

      setMessage('Solicitud de préstamo enviada.');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    cargarInventario();
  }, []);

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <section>
      <h1>Inventario deportivo</h1>
      <p>Consulta el material disponible para préstamo.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="cards-grid">
        {items.map((item) => (
          <article className="data-card" key={item._id || item.id}>
            <h3>{item.nombre || item.name || 'Material deportivo'}</h3>

            <p>Tipo: {item.tipo || item.type || 'No especificado'}</p>

            <p>
              Cantidad: {item.cantidad ?? item.quantity ?? 'No disponible'}
            </p>

            <p>Estado: {item.estado || item.status || 'No especificado'}</p>

            {user?.rol === 'USER' && (
              <button
                className="action-button"
                onClick={() => solicitarPrestamo(item)}
              >
                Solicitar préstamo
              </button>
            )}
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p>No hay artículos disponibles para mostrar.</p>
      )}
    </section>
  );
}

export default Inventario;
 