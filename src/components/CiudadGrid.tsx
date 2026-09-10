import type { Ciudad } from '../models/ciudad.model';
import CiudadCard from './CiudadCard';

interface Props {
  ciudades:       Ciudad[];
  onSeleccionar:  (c: Ciudad) => void;
}

export default function CiudadGrid({ ciudades, onSeleccionar }: Props) {
  if (ciudades.length === 0) return (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-inbox display-4 d-block mb-3"></i>
      <p className="fs-5">No se encontró ninguna ciudad.</p>
    </div>
  );

  return (
    <div>
      <p className="fw-semibold small text-muted text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
        <i className="bi bi-grid me-1"></i>Ciudades
      </p>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {ciudades.map(c => (
          <div key={c.id} className="col">
            <CiudadCard
              ciudad={c}
              onSeleccionar={onSeleccionar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}