import { useState } from 'react';
import type { AlertaCiudad } from '../hooks/useAlertas';

interface Props {
  alertas:       AlertaCiudad[];
  onSeleccionar: (nombreCiudad: string) => void;
}

const colorNivel: Record<string, string> = {
  alto:  'danger',
  medio: 'warning',
  bajo:  'success',
};

const categoriaDe: Record<string, string> = {
  'Lluvia intensa':  'Lluvia',
  'Calor extremo':   'Temperatura',
  'UV elevado':      'UV',
  'Viento fuerte':   'Viento',
};

export default function AlertasPanel({ alertas, onSeleccionar }: Props) {
  const [filtro, setFiltro] = useState<string>('Todas');

  const tipos = Array.from(
    new Set(alertas.flatMap(item => item.alertas.map(a => categoriaDe[a.tipo] ?? a.tipo)))
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <p className="fw-semibold small text-muted text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
          <i className="bi bi-exclamation-triangle me-1"></i>Alertas activas
        </p>

        {/* Filtro por tipo */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <button
            className={`btn btn-sm ${filtro === 'Todas' ? 'btn-tempus' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro('Todas')}>
            Todas
          </button>
          {tipos.map(tipo => (
            <button
              key={tipo}
              className={`btn btn-sm ${filtro === tipo ? 'btn-tempus' : 'btn-outline-secondary'}`}
              onClick={() => setFiltro(tipo)}>
              {tipo}
            </button>
          ))}
        </div>

        <div className="d-flex flex-column gap-2">
          {alertas.map((item, i) =>
            item.alertas
              .filter(a => filtro === 'Todas' || (categoriaDe[a.tipo] ?? a.tipo) === filtro)
              .map((a, j) => (
                <div key={`${i}-${j}`}
                  className={`alert alert-${colorNivel[a.nivel]} d-flex gap-2 align-items-baseline mb-0 py-2`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSeleccionar(item.ciudad)}>
                  <span className="fw-bold text-nowrap">{a.tipo}</span>
                  <span className="fw-semibold text-nowrap">{item.ciudad}:</span>
                  <span className="small">{a.mensaje}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}