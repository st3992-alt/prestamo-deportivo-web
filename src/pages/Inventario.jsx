
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Inventario() {
  const [items, setItems] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deporte, setDeporte] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [canchaOActividad, setCanchaOActividad] = useState('');
  const [enviando, setEnviando] = useState(false);

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

  async function cargarDeportes() {
    try {
      const response = await apiFetch('/api/sports/items/sports');
      setDeportes(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message);
    }
  }

  function abrirFormulario(item) {
    setItemSeleccionado(item);
    setCantidad(1);
    setCanchaOActividad('');
    setError('');
    setMessage('');
  }

  function cerrarFormulario() {
    setItemSeleccionado(null);
    setCantidad(1);
    setCanchaOActividad('');
  }

  async function solicitarPrestamo(e) {
    e.preventDefault();

    if (!itemSeleccionado) return;

    if (!cantidad || cantidad < 1 || cantidad > itemSeleccionado.disponibles) {
      setError('La cantidad debe ser mayor que cero y no superar las unidades disponibles.');
      return;
    }

    if (!canchaOActividad.trim()) {
      setError('Debes indicar la cancha o actividad.');
      return;
    }

    try {
      setEnviando(true);
      setError('');
      setMessage('');

      await apiFetch('/api/sports/loans', {
        method: 'POST',
        body: JSON.stringify({
          itemId: itemSeleccionado.id,
          userId: user.id,
          cantidad: Number(cantidad),
          canchaOActividad: canchaOActividad.trim(),
        }),
      });

      setMessage('¡Solicitud de préstamo registrada correctamente!');
      cerrarFormulario();
      await cargarInventario();
    } catch (err) {
      if (err.message.includes('OUT_OF_STOCK')) {
        setError('No hay unidades disponibles de este material deportivo.');
      } else {
        setError(err.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
    cargarInventario();
    cargarDeportes();
  }, []);

  const itemsFiltrados = items.filter((item) => {
    const coincideDeporte = !deporte || item.deporte === deporte;

    const coincideDisponibilidad =
      disponibilidad === ''
        ? true
        : disponibilidad === 'true'
          ? item.disponibles > 0
          : item.disponibles <= 0;

    return coincideDeporte && coincideDisponibilidad;
  });

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <section className="page-content">
      <h1>Inventario deportivo</h1>
      <p>Consulta el material disponible para préstamo.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="filters-container">
        <select
          value={deporte}
          onChange={(e) => setDeporte(e.target.value)}
        >
          <option value="">Todos los deportes</option>
          {deportes.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <select
          value={disponibilidad}
          onChange={(e) => setDisponibilidad(e.target.value)}
        >
          <option value="">Todas las disponibilidades</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
      </div>

      <div className="cards-grid">
        {itemsFiltrados.map((item) => (
          <article className="data-card" key={item.id}>
            <h3>{item.nombre || 'Material deportivo'}</h3>
            <p><strong>Código:</strong> {item.codigo}</p>
            <p><strong>Deporte:</strong> {item.deporte}</p>
            <p><strong>Estado físico:</strong> {item.estadoFisico}</p>
            <p><strong>Cantidad disponible:</strong> {item.disponibles}</p>

            {user?.rol === 'USER' && (
              <button
                className="action-button"
                onClick={() => abrirFormulario(item)}
                disabled={item.disponibles <= 0}
              >
                Solicitar préstamo
              </button>
            )}
          </article>
        ))}
      </div>

      {itemsFiltrados.length === 0 && (
        <p>No hay artículos que coincidan con los filtros.</p>
      )}

      {itemSeleccionado && (
        <div className="loan-modal-overlay">
          <form className="loan-modal" onSubmit={solicitarPrestamo}>
            <h2>Solicitar préstamo</h2>

            <p><strong>Material:</strong> {itemSeleccionado.nombre}</p>
            <p><strong>Deporte:</strong> {itemSeleccionado.deporte}</p>
            <p>
              <strong>Unidades disponibles:</strong>{' '}
              {itemSeleccionado.disponibles}
            </p>

            <label htmlFor="cantidad">Cantidad solicitada</label>
            <input
              id="cantidad"
              type="number"
              min="1"
              max={itemSeleccionado.disponibles}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />

            <label htmlFor="canchaOActividad">
              Cancha o actividad
            </label>
            <input
              id="canchaOActividad"
              type="text"
              value={canchaOActividad}
              onChange={(e) => setCanchaOActividad(e.target.value)}
              placeholder="Ej. Cancha 2 - Torneo"
              required
            />

            <div className="loan-modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={cerrarFormulario}
                disabled={enviando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="action-button"
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Confirmar préstamo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Inventario;
