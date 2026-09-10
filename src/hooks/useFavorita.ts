import { useState } from 'react';

const CLAVE = 'tempus_favorita';

export function useFavorita() {
  const cargarIdGuardado = (): number | null => {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === null) return null;
    const parsed = JSON.parse(guardado);
    return parsed.id ?? null;
  };

  const [favoritaId, setFavoritaId] = useState<number | null>(cargarIdGuardado);

  const guardar = (id: number) => {
    localStorage.setItem(CLAVE, JSON.stringify({ id }));
    setFavoritaId(id);
  };

  const quitar = () => {
    localStorage.removeItem(CLAVE);
    setFavoritaId(null);
  };

  const esFavorita = (id: number): boolean => favoritaId === id;

  const toggleFavorita = (id: number) => {
    if (esFavorita(id)) {
      quitar();
    } else {
      guardar(id);
    }
  };

  return { favoritaId, esFavorita, toggleFavorita };
}