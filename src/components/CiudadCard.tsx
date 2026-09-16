import type { Ciudad } from '../models/ciudad.model';

interface Props {
  ciudad: Ciudad;
  onSeleccionar: (c: Ciudad) => void;
}

export default function CiudadCard({ ciudad, onSeleccionar }: Props) {
  return (
    <div
      className="card border-0 h-100 ciudad-card"
      onClick={() => onSeleccionar(ciudad)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body p-4">
        
        <div className="fw-semibold fs-5">
          {ciudad.nombre}
        </div>

        <div className="temperatura-card">
          {ciudad.temperatura}°C
        </div>

        <div className="text-muted small">
          {ciudad.descripcion}
        </div>

        <div className="d-flex gap-3 mt-3 pt-3 border-top">
          <div className="dato-clima">
            <span className="d-block fw-semibold small">
              {ciudad.humedad}%
            </span>
            <span className="text-muted">
              Humedad
            </span>
          </div>

          <div className="dato-clima">
            <span className="d-block fw-semibold small">
              {ciudad.viento} km/h
            </span>
            <span className="text-muted">
              Viento
            </span>
          </div>

          <div className="dato-clima">
            <span className="d-block fw-semibold small">
              {ciudad.precipitacion} mm
            </span>
            <span className="text-muted">
              Precipit.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}