
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Admin() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [loans, setLoans] = useState([]);
  const [items, setItems] = useState([]);
  const [deportes, setDeportes] = useState([]);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [itemEditando, setItemEditando] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [deporte, setDeporte] = useState('');
  const [estadoFisico, setEstadoFisico] = useState('NUEVO');
  const [cantidadTotal, setCantidadTotal] = useState(1);

  const [devoluciones, setDevoluciones] = useState({});

  async function cargarDatos() {
    try {
      setLoading(true);
      setError('');

      const [usersResponse, loansResponse, itemsResponse, sportsResponse] =
        await Promise.all([
          apiFetch('/api/users'),
          apiFetch('/api/sports/loans'),
          apiFetch('/api/sports/items'),
          apiFetch('/api/sports/items/sports'),
        ]);

      setUsers(Array.isArray(usersResponse) ? usersResponse : usersResponse.users || []);
      setLoans(Array.isArray(loansResponse) ? loansResponse : loansResponse.loans || []);
      setItems(Array.isArray(itemsResponse) ? itemsResponse : itemsResponse.items || []);
      setDeportes(Array.isArray(sportsResponse) ? sportsResponse : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function limpiarFormulario() {
    setItemEditando(null);
    setCodigo('');
    setNombre('');
    setDeporte('');
    setEstadoFisico('NUEVO');
    setCantidadTotal(1);
  }

  function editarItem(item) {
    setItemEditando(item);
    setCodigo(item.codigo);
    setNombre(item.nombre);
    setDeporte(item.deporte);
    setEstadoFisico(item.estadoFisico);
    setCantidadTotal(item.cantidadTotal);
    setError('');
    setMessage('');
  }

  async function guardarItem(e) {
    e.preventDefault();

    try {
      setEnviando(true);
      setError('');
      setMessage('');

      if (itemEditando) {
        await apiFetch(`/api/sports/items/${itemEditando.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            estadoFisico,
            cantidadTotal: Number(cantidadTotal),
          }),
        });

        setMessage('Material actualizado correctamente.');
      } else {
        await apiFetch('/api/sports/items', {
          method: 'POST',
          body: JSON.stringify({
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            deporte,
            estadoFisico: estadoFisico.trim(),
            cantidadTotal: Number(cantidadTotal),
          }),
        });

        setMessage('Material registrado correctamente.');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function recibirMaterial(loan) {
    const datos = devoluciones[loan.loanId] || {
      estadoDevolucion: 'BUENO',
      notas: '',
    };

    if (!window.confirm(`¿Confirmas recibir ${loan.item}?`)) return;

    try {
      setEnviando(true);
      setError('');
      setMessage('');

      await apiFetch(`/api/sports/loans/${loan.loanId}/return`, {
        method: 'PATCH',
        body: JSON.stringify({
          estadoDevolucion: datos.estadoDevolucion,
          notas: datos.notas.trim(),
        }),
      });

      setMessage('Devolución registrada correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function cambiarRol(persona, nuevoRol) {
    try {
      setError('');
      setMessage('');

      await apiFetch(`/api/users/${persona.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ rol: nuevoRol }),
      });

      setMessage('Rol actualizado correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
      await cargarDatos();
    }
  }

  async function cambiarEstadoUsuario(persona) {
    const nuevoEstado = !persona.activo;

    try {
      setError('');
      setMessage('');

      await apiFetch(`/api/users/${persona.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      setMessage('Estado del usuario actualizado correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  function actualizarDevolucion(loanId, campo, valor) {
    setDevoluciones((prev) => ({
      ...prev,
      [loanId]: {
        estadoDevolucion: 'BUENO',
        notas: '',
        ...prev[loanId],
        [campo]: valor,
      },
    }));
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return <p>Cargando panel de administración...</p>;

  const prestamosActivos = loans.filter(
    (loan) => loan.estatus === 'ACTIVO'
  );

  const usuariosFiltrados = users.filter((persona) => {
  const busqueda = busquedaUsuario.toLowerCase().trim();

  return (
    String(persona.nombre || '').toLowerCase().includes(busqueda) ||
    String(persona.matricula || '').toLowerCase().includes(busqueda)
  );
});

  return (
    <section className="page-content">
      <h1>Panel de administración</h1>
      <p>Administra materiales, préstamos y usuarios del sistema.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="summary-grid">
        <article className="summary-card">
          <h2>{users.length}</h2>
          <p>Usuarios registrados</p>
        </article>

        <article className="summary-card">
          <h2>{items.length}</h2>
          <p>Materiales registrados</p>
        </article>

        <article className="summary-card">
          <h2>{prestamosActivos.length}</h2>
          <p>Préstamos activos</p>
        </article>
      </div>

      <h2>{itemEditando ? 'Editar material' : 'Registrar material'}</h2>

      <form className="data-card" onSubmit={guardarItem}>
        {!itemEditando && (
          <>
            <label htmlFor="codigo">Código</label>
            <input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. DEP-15"
              required
            />

            <label htmlFor="nombre">Nombre del material</label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del material"
              required
            />

            <label htmlFor="deporte">Deporte</label>
            <select
              id="deporte"
              value={deporte}
              onChange={(e) => setDeporte(e.target.value)}
              required
            >
              <option value="">Selecciona un deporte</option>
              {deportes.map((nombreDeporte) => (
                <option key={nombreDeporte} value={nombreDeporte}>
                  {nombreDeporte}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="estadoFisico">Estado físico</label>
        <input
          id="estadoFisico"
          value={estadoFisico}
          onChange={(e) => setEstadoFisico(e.target.value)}
          required
        />

        <label htmlFor="cantidadTotal">Cantidad total</label>
        <input
          id="cantidadTotal"
          type="number"
          min="1"
          value={cantidadTotal}
          onChange={(e) => setCantidadTotal(e.target.value)}
          required
        />

        <div className="loan-modal-actions">
          {itemEditando && (
            <button
              type="button"
              className="cancel-button"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </button>
          )}

          <button
            type="submit"
            className="action-button"
            disabled={enviando}
          >
            {enviando
              ? 'Guardando...'
              : itemEditando
                ? 'Actualizar material'
                : 'Registrar material'}
          </button>
        </div>
      </form>

      <h2>Inventario de materiales</h2>

      <div className="cards-grid">
        {items.map((item) => (
          <article className="data-card" key={item.id}>
            <h3>{item.nombre}</h3>
            <p><strong>Código:</strong> {item.codigo}</p>
            <p><strong>Deporte:</strong> {item.deporte}</p>
            <p><strong>Estado físico:</strong> {item.estadoFisico}</p>
            <p><strong>Cantidad total:</strong> {item.cantidadTotal}</p>
            <p><strong>Disponibles:</strong> {item.disponibles}</p>

            <button
              className="action-button"
              onClick={() => editarItem(item)}
            >
              Editar material
            </button>
          </article>
        ))}
      </div>

      <h2>Recepción de material</h2>
      <p>Registra la devolución de los préstamos activos.</p>

      <div className="cards-grid">
        {prestamosActivos.map((loan) => {
          const datos = devoluciones[loan.loanId] || {
            estadoDevolucion: 'BUENO',
            notas: '',
          };

          return (
            <article className="data-card" key={loan.loanId}>
              <h3>{loan.item}</h3>
              <p><strong>Usuario:</strong> {loan.usuario}</p>
              <p><strong>Matrícula:</strong> {loan.matricula}</p>
              <p><strong>Código:</strong> {loan.codigo}</p>
              <p><strong>Cantidad:</strong> {loan.cantidad}</p>
              <p><strong>Cancha o actividad:</strong> {loan.canchaOActividad}</p>

              <label htmlFor={`estado-${loan.loanId}`}>
                Estado de devolución
              </label>

              <select
                id={`estado-${loan.loanId}`}
                value={datos.estadoDevolucion}
                onChange={(e) =>
                  actualizarDevolucion(
                    loan.loanId,
                    'estadoDevolucion',
                    e.target.value
                  )
                }
              >
                <option value="BUENO">BUENO</option>
                <option value="DANADO">DAÑADO</option>
              </select>

              <label htmlFor={`notas-${loan.loanId}`}>
                Notas de devolución
              </label>

              <textarea
                id={`notas-${loan.loanId}`}
                value={datos.notas}
                onChange={(e) =>
                  actualizarDevolucion(
                    loan.loanId,
                    'notas',
                    e.target.value
                  )
                }
                placeholder="Observaciones del material..."
              />

              <button
                className="action-button"
                onClick={() => recibirMaterial(loan)}
                disabled={enviando}
              >
                Recibir material
              </button>
            </article>
          );
        })}
      </div>

      {prestamosActivos.length === 0 && (
        <p>No hay préstamos pendientes de devolución.</p>
      )}

      <h2>Gestión de usuarios</h2>

<label htmlFor="buscarUsuario">
  Buscar por nombre o matrícula
</label>

<input
  id="buscarUsuario"
  type="text"
  value={busquedaUsuario}
  onChange={(e) => setBusquedaUsuario(e.target.value)}
  placeholder="Escribe un nombre o matrícula"
/>

<div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((persona) => {
              const esUsuarioActual =
                Number(persona.id) === Number(user.id);

              return (
                <tr key={persona.id}>
                  <td>{persona.nombre}</td>
                  <td>{persona.matricula}</td>
                  <td>{persona.email}</td>
                  <td>
                    <select
                      value={persona.rol}
                      disabled={esUsuarioActual}
                      onChange={(e) =>
                        cambiarRol(persona, e.target.value)
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>{persona.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <button
                      className="action-button"
                      disabled={esUsuarioActual}
                      onClick={() => cambiarEstadoUsuario(persona)}
                    >
                      {persona.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {usuariosFiltrados.length === 0 && (
  <p>No se encontraron usuarios.</p>
)}
    </section>
  );
}

export default Admin;
