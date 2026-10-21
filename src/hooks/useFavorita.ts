
import { useState } from 'react';

const CLAVE = 'tempus_favorita';

interface FavoritaGuardada {
  id: number;
}

/** Recupera el ID de la ciudad favorita desde el almacenamiento local. */
function cargarIdGuardado(): number | null {
  try {
    const guardado = localStorage.getItem(CLAVE);

    if (guardado === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(guardado);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('id' in parsed) ||
      typeof parsed.id !== 'number' ||
      !Number.isFinite(parsed.id)
    ) {
      return null;
    }

    return parsed.id;
  } catch {
    return null;
  }
}

export function useFavorita() {
  const [favoritaId, setFavoritaId] = useState<number | null>(
    cargarIdGuardado
  );

  /** Guarda una ciudad como favorita. */
  const guardar = (id: number) => {
    if (!Number.isFinite(id)) {
      return;
    }

    try {
      const favorita: FavoritaGuardada = { id };
      localStorage.setItem(CLAVE, JSON.stringify(favorita));
      setFavoritaId(id);
    } catch {
      console.error('No se pudo guardar la ciudad favorita.');
    }
  };

  /** Elimina la ciudad favorita guardada. */
  const quitar = () => {
    try {
      localStorage.removeItem(CLAVE);
      setFavoritaId(null);
    } catch {
      console.error('No se pudo eliminar la ciudad favorita.');
    }
  };

  /** Comprueba si una ciudad es la favorita actual. */
  const esFavorita = (id: number): boolean => favoritaId === id;

  /** Activa o desactiva una ciudad favorita. */
  const toggleFavorita = (id: number) => {
    if (!Number.isFinite(id)) {
      return;
    }

    if (esFavorita(id)) {
      quitar();
    } else {
      guardar(id);
    }
  };

  return {
    favoritaId,
    esFavorita,
    toggleFavorita,
  };
}