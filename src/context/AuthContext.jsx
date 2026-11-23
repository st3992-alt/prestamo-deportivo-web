
import { createContext, useContext, useState } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(credentials) {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token = response.token || response.user_jwt_token;
    const userData = response.user;

    if (!token || !userData) {
      throw new Error('La respuesta de inicio de sesión no contiene los datos esperados.');
    }

    localStorage.setItem('user_jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));

    setUser(userData);

    return userData;
  }

  async function register(userData) {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  function logout() {
    localStorage.removeItem('user_jwt_token');
    localStorage.removeItem('user_data');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
