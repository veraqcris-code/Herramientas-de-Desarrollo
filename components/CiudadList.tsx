import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCiudades } from '../hooks/useCiudades';
import type { Ciudad } from '../models/ciudad.model';

export default function CiudadList() {
  const { ciudades, loading, error, eliminar } = useCiudades();
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');

  const ciudadesFiltradas = ciudades.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEliminar = (id?: number) => {
    if (!id || !window.confirm('¿Eliminar esta ciudad?')) return;
    eliminar(id);
  };

  return (
    <div className="container py-4">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">
            <i className="bi bi-cloud-sun me-2" style={{ color: "#20232A" }}></i>
            Ciudades
          </h2>
          <small className="text-muted">{ciudades.length} ciudades en total</small>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/nuevo')}>
          <i className="bi bi-plus-lg me-1"></i>Nueva Ciudad
        </button>
      </div>

      {/* Filtro */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Buscar ciudad..."
            />
          </div>
        </div>
      </div>

      {/* Spinner */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Conectando con el servidor...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          Error al conectar: {error}
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !error && ciudadesFiltradas.length === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox display-4 d-block mb-3"></i>
          <p className="fs-5">No hay ciudades que coincidan.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/nuevo')}>
            <i className="bi bi-plus-lg me-1"></i>Crear primera ciudad
          </button>
        </div>
      )}

      {/* Tarjetas */}
      {!loading && !error && ciudadesFiltradas.map((c: Ciudad) => (
        <div key={c.id} className="card border-0 shadow-sm mb-3">
          <div className="card-body d-flex align-items-center gap-3">

            {/* Info */}
            <div className="flex-grow-1">
              <span className="fw-semibold">{c.nombre}</span>
              <div className="text-muted small mt-1">
                <i className="bi bi-thermometer me-1"></i>{c.temperatura}°C
                <span className="mx-2">·</span>
                <i className="bi bi-droplet me-1"></i>Humedad: {c.humedad}%
                <span className="mx-2">·</span>
                <i className="bi bi-wind me-1"></i>Viento: {c.viento} km/h
                <span className="mx-2">·</span>
                <i className="bi bi-cloud me-1"></i>{c.descripcion}
              </div>
            </div>

            {/* Acciones */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate(`/editar/${c.id}`)}>
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleEliminar(c.id)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>

          </div>
        </div>
      ))}

      {/* Contador */}
      {!loading && ciudades.length > 0 && (
        <p className="text-center text-muted small mt-3">
          Mostrando <strong>{ciudadesFiltradas.length}</strong>
          {' de '}<strong>{ciudades.length}</strong> ciudades
        </p>
      )}

    </div>
  );
}