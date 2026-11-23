
const API_URL = import.meta.env.VITE_API_URL;
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export async function apiFetch(endpoint, options = {}) {
  const userToken = localStorage.getItem('user_jwt_token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': APP_TOKEN,
      ...(userToken && {
        Authorization: `Bearer ${userToken}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('user_jwt_token');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Inicia sesión nuevamente.');
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.');
  }

  if (!response.ok) {
    throw new Error(`Error en la solicitud: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
