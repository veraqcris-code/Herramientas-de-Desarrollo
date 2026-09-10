import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FormValues {
  usuario: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, estaAutenticado } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    defaultValues: { usuario: '', password: '' },
    mode: 'onChange',
  });

  // Después de todos los hooks para que esta wbada no de error
  if (estaAutenticado()) {
    return <Navigate to="/ciudades" replace />;
  }

  const onSubmit = async (data: FormValues) => {
    const ok = await login(data.usuario, data.password);
    if (ok) navigate('/ciudades', { replace: true });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ backgroundColor: '#f8f9fa' }}>
      <div className="col-11 col-sm-8 col-md-5 col-lg-4">

        {/* Brand */}
        <div className="text-center mb-4">
          <i className="bi bi-cloud-sun fs-1" style={{ color: '#61DAFB' }}></i>
          <h1 className="fw-bold mt-2 mb-0" style={{ color: '#20232A' }}>Tempus</h1>
          <p className="text-muted small">Panel de administración</p>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">

            <h5 className="fw-bold mb-4">
              <i className="bi bi-lock me-2" style={{ color: '#20232A' }}></i>
              Iniciar sesión
            </h5>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Usuario */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-person me-1"></i>Usuario
                </label>
                <input
                  className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu usuario..."
                  {...register('usuario', { required: 'El usuario es obligatorio.' })}
                />
                {errors.usuario && (
                  <div className="invalid-feedback d-block">{errors.usuario.message}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-key me-1"></i>Contraseña
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu contraseña..."
                  {...register('password', { required: 'La contraseña es obligatoria.' })}
                />
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 fw-bold"
                style={{ backgroundColor: '#20232A', color: '#61DAFB' }}
                disabled={!isValid || loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Verificando...</>
                ) : (
                  <><i className="bi bi-box-arrow-in-right me-2"></i>Ingresar</>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}