import { useState, useEffect } from 'react';
import type { Ciudad } from '../models/ciudad.model';

const API = 'http://localhost:3000/api/ciudades';

interface Estado {
  ciudades: Ciudad[];
  loading: boolean;
  error: string | null;
}

export function useCiudades() {
  const [estado, setEstado] = useState<Estado>({
    ciudades: [],
    loading: true,
    error: null
  });
  const [recargar, setRecargar] = useState(0);
  const refrescar = () => setRecargar(n => n + 1);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCiudades = async () => {
      try {
        setEstado(prev => ({ ...prev, loading: true }));

        const response = await fetch(API, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

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
  }, [recargar]);

  // Obtener ciudad por ID
  const getById = (id: number): Promise<Ciudad> =>
    fetch(`${API}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(msg);
      });

  // Crear ciudad
  const crear = (d: Omit<Ciudad, 'id'>): Promise<void> =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    })
    .then(async res => {
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.mensaje ?? `Error: ${res.status}`);
      }
      refrescar();
    })
    .catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(msg);
    });

  // Actualizar ciudad
  const actualizar = (id: number, d: Partial<Ciudad>): Promise<void> =>
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    })
      .then(async res => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.mensaje ?? `Error: ${res.status}`);
        }
        refrescar();
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(msg);
      });

  // Eliminar ciudad
  const eliminar = (id: number) =>
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        refrescar();
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(msg);
      });

  return { ...estado, getById, crear, actualizar, eliminar };
}