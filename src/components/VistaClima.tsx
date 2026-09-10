import { useState } from 'react';
import { useCiudades } from '../hooks/useCiudades';
import { useFavorita } from '../hooks/useFavorita';
import { obtenerAlertas } from '../hooks/useAlertas';
import type { Ciudad } from '../models/ciudad.model';
import BuscadorBar from './BuscadorBar';
import AlertasPanel from './AlertasPanel';
import CiudadGrid from './CiudadGrid';
import DetallePanel from './DetallePanel';

export default function VistaClima() {
  const { ciudades, loading, error } = useCiudades();
  const { esFavorita, toggleFavorita, favoritaId } = useFavorita();
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<Ciudad | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const ciudadFavorita = ciudades.find(c => c.id === favoritaId) ?? null;

  const ciudadesFiltradas = busqueda.trim()
    ? ciudades.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : ciudades;

  const handleSeleccionar = (ciudad: Ciudad) => {
    setCiudadSeleccionada(ciudad);
  };

  const handleBuscar = (query: string) => {
    setBusqueda(query);
    if (query.trim()) {
      const encontrada = ciudades.find(c =>
        c.nombre.toLowerCase().includes(query.toLowerCase()));
      if (encontrada) {
        setCiudadSeleccionada(encontrada);
      } else {
        setCiudadSeleccionada(null);
      }
    }
  };

  const handleVerTodas = () => {
    setBusqueda('');
    setCiudadSeleccionada(null);
  };

  const handleVerFavorita = () => {
    if (ciudadFavorita) {
      setCiudadSeleccionada(ciudadFavorita);
    }
  };

  const alertas = obtenerAlertas(ciudades);

  // Spinner
  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: "#61DAFB" }} role="status"></div>
      <p className="mt-3 text-muted">Cargando ciudades...</p>
    </div>
  );

  // Error
  if (error) return (
    <div className="alert alert-danger d-flex align-items-center gap-2">
      <i className="bi bi-exclamation-triangle-fill"></i>
      Error al conectar con el servidor: {error}
    </div>
  );

  return (
    <div className="d-flex flex-column gap-4">

      {/* Buscador */}
      <BuscadorBar
        busqueda={busqueda}
        onBuscar={handleBuscar}
        onVerTodas={handleVerTodas}
        onVerFavorita={ciudadFavorita ? handleVerFavorita : undefined}
      />

      {/* Alertas */}
      {alertas.length > 0 && (
        <AlertasPanel
          alertas={alertas}
          onSeleccionar={(nombre) => {
            const ciudad = ciudades.find(c => c.nombre === nombre);
            if (ciudad) setCiudadSeleccionada(ciudad);
          }}
        />
      )}

      {/* Detalle */}
      {ciudadSeleccionada && (
        <DetallePanel
          ciudad={ciudadSeleccionada}
          esFavorita={esFavorita(ciudadSeleccionada.id!)}
          onToggleFavorita={() => toggleFavorita(ciudadSeleccionada.id!)}
        />
      )}

      {/* Grid de ciudades */}
      {!busqueda.trim() && (
        <CiudadGrid
          ciudades={ciudadesFiltradas}
          onSeleccionar={handleSeleccionar}
        />
      )}

    </div>
  );
}