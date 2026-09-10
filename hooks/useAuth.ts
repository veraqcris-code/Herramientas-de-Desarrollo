import { useState } from 'react';

const API = 'http://localhost:3000/api/auth';
const SESSION_KEY = 'tempus_admin_usuario';

export function useAuth() {
  const [usuario, setUsuario] = useState<string | null>(
    sessionStorage.getItem(SESSION_KEY)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const login = (usuarioInput: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    return fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: usuarioInput, password }),
    })
      .then(res =>
        res.json().then(data => {
          if (!res.ok) {
            setError(data.mensaje ?? 'Error al iniciar sesión');
            return false;
          }
          sessionStorage.setItem(SESSION_KEY, data.usuario);
          setUsuario(data.usuario);
          return true;
        })
      )
      .catch(() => {
        setError('No se pudo conectar con el servidor');
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  };

  const estaAutenticado = (): boolean => {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  };

  return { usuario, loading, error, login, logout, estaAutenticado };
}