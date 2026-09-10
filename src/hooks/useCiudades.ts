import { useState, useEffect } from 'react';
import type { Ciudad } from '../models/ciudad.model';

const API = 'http://localhost:3000/api/ciudades';

interface Estado {
  ciudades: Ciudad[];
  loading:  boolean;
  error:    string | null;
}

export function useCiudades() {
  const [estado, setEstado] = useState<Estado>({
    ciudades: [],
    loading:  true,
    error:    null,
  });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCiudades = async () => {
      try {
        setEstado(prev => ({ ...prev, loading: true }));
        const response = await fetch(API, { signal: abortController.signal });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: Ciudad[] = await response.json();
        setEstado({ ciudades: data, loading: false, error: null });
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setEstado({ ciudades: [], loading: false, error: err.message });
        }
      }
    };

    fetchCiudades();
    return () => { abortController.abort(); };
  }, []);

  return { ...estado };
}