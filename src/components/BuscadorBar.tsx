interface Props {
    busqueda:      string;
    onBuscar:      (q: string) => void;
    onVerTodas:    () => void;
    onVerFavorita?: () => void;
  }
  
  export default function BuscadorBar({ busqueda, onBuscar, onVerTodas, onVerFavorita }: Props) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center">
            <div className="input-group flex-grow-1">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Buscar ciudad..."
                value={busqueda}
                onChange={e => onBuscar(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onBuscar(busqueda)}
              />
            </div>
            <button className="btn btn-tempus px-3 text-nowrap" onClick={onVerTodas}>
              Ver todas
            </button>
            {onVerFavorita && (
              <button className="btn btn-outline-secondary px-3 text-nowrap" onClick={onVerFavorita}>
                <i className="bi bi-star-fill me-1" style={{ color: "#61DAFB" }}></i>
                Favorita
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }