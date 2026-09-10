import type { Ciudad } from '../models/ciudad.model';

interface Props {
  ciudad:          Ciudad;
  esFavorita:      boolean;
  onToggleFavorita: () => void;
}

export default function DetallePanel({ ciudad, esFavorita, onToggleFavorita }: Props) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderTop: '3px solid #61DAFB' }}>
      <div className="card-body p-4">

        {/* Top */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold mb-0">{ciudad.nombre}</h4>
            <span className="text-muted">{ciudad.descripcion}</span>
          </div>
          <div className="text-end">
            <div className="fw-bold" style={{ fontSize: '3rem', color: '#61DAFB', fontFamily: 'monospace', lineHeight: 1 }}>
              {ciudad.temperatura}°C
            </div>
            <small className="text-muted">Sensación {ciudad.sensacion}°C</small>
          </div>
        </div>

        {/* Botón favorita */}
        <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn btn-sm ${esFavorita ? 'btn-tempus' : 'btn-outline-secondary'}`}
            onClick={onToggleFavorita}>
            <i className={`bi me-1 ${esFavorita ? 'bi-star-fill' : 'bi-star'}`}
               style={{ color: esFavorita ? '#61DAFB' : undefined }}></i>
            {esFavorita ? 'Quitar favorita' : 'Guardar como favorita'}
          </button>
        </div>

        {/* Datos grid */}
        <div className="row row-cols-2 row-cols-md-3 g-2 mb-4">
          {[
            { val: `${ciudad.humedad}%`,          lbl: 'Humedad',       icon: 'bi-droplet'      },
            { val: `${ciudad.viento} km/h`,        lbl: 'Viento',        icon: 'bi-wind'         },
            { val: `${ciudad.precipitacion} mm`,   lbl: 'Precipitación', icon: 'bi-cloud-rain'   },
            { val: `${ciudad.presion} hPa`,        lbl: 'Presión',       icon: 'bi-speedometer2' },
            { val: `${ciudad.visibilidad} km`,     lbl: 'Visibilidad',   icon: 'bi-eye'          },
            { val: `${ciudad.uv}`,                 lbl: 'Índice UV',     icon: 'bi-sun'          },
          ].map((d, i) => (
            <div key={i} className="col">
              <div className="card border-0 bg-light h-100">
                <div className="card-body py-2 px-3">
                  <i className={`bi ${d.icon} text-muted small`}></i>
                  <div className="fw-bold" style={{ fontFamily: 'monospace' }}>{d.val}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {d.lbl}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pronóstico */}
        <p className="fw-semibold small text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          <i className="bi bi-calendar3 me-1"></i>Pronóstico 5 días
        </p>
        <div className="row row-cols-5 g-2">
          {ciudad.pronostico.map((d, i) => (
            <div key={i} className="col">
              <div className="card border-0 bg-light text-center">
                <div className="card-body py-2 px-1">
                  <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    {d.dia}
                  </div>
                  <div className="fw-bold small" style={{ color: '#61DAFB', fontFamily: 'monospace' }}>{d.max}°</div>
                  <div className="text-muted small" style={{ fontFamily: 'monospace' }}>/{d.min}°</div>
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>{d.descripcion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}