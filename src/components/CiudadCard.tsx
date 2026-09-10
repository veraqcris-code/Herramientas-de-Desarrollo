import type { Ciudad } from '../models/ciudad.model';

interface Props {
  ciudad:        Ciudad;
  onSeleccionar: (c: Ciudad) => void;
}

export default function CiudadCard({ ciudad, onSeleccionar }: Props) {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
      onClick={() => onSeleccionar(ciudad)}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div className="card-body">
        <div className="fw-semibold">{ciudad.nombre}</div>
        <div className="fw-bold my-1" style={{ fontSize: '2.2rem', color: '#61DAFB', fontFamily: 'monospace', lineHeight: 1 }}>
          {ciudad.temperatura}°C
        </div>
        <div className="text-muted small">{ciudad.descripcion}</div>
        <div className="d-flex gap-3 mt-3 pt-3 border-top">
          <div>
            <span className="d-block fw-semibold small">{ciudad.humedad}%</span>
            <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Humedad</span>
          </div>
          <div>
            <span className="d-block fw-semibold small">{ciudad.viento} km/h</span>
            <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Viento</span>
          </div>
          <div>
            <span className="d-block fw-semibold small">{ciudad.precipitacion} mm</span>
            <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Precipit.</span>
          </div>
        </div>
      </div>
    </div>
  );
}