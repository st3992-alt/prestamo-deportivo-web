
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function cargarDatos() {
    try {
      setLoading(true);
      setError('');

      const [usersResponse, loansResponse] = await Promise.all([
        apiFetch('/api/users'),
        apiFetch('/api/sports/loans'),
      ]);

      setUsers(
        Array.isArray(usersResponse)
          ? usersResponse
          : usersResponse.users || []
      );

      setLoans(
        Array.isArray(loansResponse)
          ? loansResponse
          : loansResponse.loans || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cambiarRol(userId, newRole) {
    try {
      setError('');
      setMessage('');

      await apiFetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ rol: newRole }),
      });

      setMessage('Rol actualizado correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return <p>Cargando panel de administración...</p>;

  return (
    <section>
      <h1>Panel de administración</h1>
      <p>Consulta usuarios y préstamos del sistema.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="summary-grid">
        <article className="summary-card">
          <h2>{users.length}</h2>
          <p>Usuarios registrados</p>
        </article>

        <article className="summary-card">
          <h2>{loans.length}</h2>
          <p>Préstamos registrados</p>
        </article>
      </div>

      <h2>Gestión de usuarios</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const id = user._id || user.id;

              return (
                <tr key={id}>
                  <td>{user.nombre || user.name || 'Sin nombre'}</td>
                  <td>{user.matricula || 'No disponible'}</td>
                  <td>{user.rol || user.role || 'USER'}</td>
                  <td>
                    <select
                      value={user.rol || user.role || 'USER'}
                      onChange={(event) =>
                        cambiarRol(id, event.target.value)
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p>No hay usuarios registrados.</p>}

      <h2>Préstamos registrados</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Material</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id || loan.id}>
                <td>
                  {loan.user?.nombre ||
                    loan.usuario?.nombre ||
                    loan.matricula ||
                    'No disponible'}
                </td>

                <td>
                  {loan.item?.nombre ||
                    loan.item?.name ||
                    loan.nombreMaterial ||
                    'No disponible'}
                </td>

                <td>{loan.estado || loan.status || 'No especificado'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Admin;
