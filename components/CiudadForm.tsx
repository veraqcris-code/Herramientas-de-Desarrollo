import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useCiudades } from '../hooks/useCiudades';
import type { Ciudad } from '../models/ciudad.model';

type FormValues = Omit<Ciudad, 'id'>;

const TEMP_MIN = -30;
const TEMP_MAX = 50;

const obtenerProximosDias = (): string[] => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hoy = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    return dias[fecha.getDay()];
  });
};

export default function CiudadForm() {
  const { id }     = useParams<{ id?: string }>();
  const navigate   = useNavigate();
  const { getById, crear, actualizar, ciudades } = useCiudades();
  const editMode   = !!id;
  const [mensaje, setMensaje]       = useState<{ texto: string; tipo: 'success' | 'danger' } | null>(null);
  const [condiciones, setCondiciones] = useState<string[]>([]);

  // Carga las condiciones válidas desde el API
  useEffect(() => {
    fetch('http://localhost:3000/api/condiciones')
      .then(res => res.json())
      .then(setCondiciones);
  }, []);

  const pronosticoInicial = obtenerProximosDias().map(dia => ({
    dia,
    max: 0,
    min: 0,
    descripcion: '',
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    defaultValues: {
      nombre:        '',
      temperatura:   0,
      sensacion:     0,
      descripcion:   '',
      humedad:       0,
      viento:        0,
      precipitacion: 0,
      presion:       1013,
      visibilidad:   10,
      uv:            0,
      pronostico:    pronosticoInicial,
    },
    mode: 'onChange',
  });

  const { fields } = useFieldArray({
    control,
    name: 'pronostico',
  });

  useEffect(() => {
    if (id) {
      getById(+id).then(c => {
        setValue('nombre',        c.nombre);
        setValue('temperatura',   c.temperatura);
        setValue('sensacion',     c.sensacion);
        setValue('descripcion',   c.descripcion);
        setValue('humedad',       c.humedad);
        setValue('viento',        c.viento);
        setValue('precipitacion', c.precipitacion);
        setValue('presion',       c.presion);
        setValue('visibilidad',   c.visibilidad);
        setValue('uv',            c.uv);
        setValue('pronostico',    c.pronostico);
      });
    }
  }, [id]);

  const onSubmit = (data: FormValues) => {
    const operacion = editMode && id
      ? actualizar(+id, data)
      : crear(data);
  
    operacion
      .then(() => {
        setMensaje({ texto: editMode ? 'Ciudad actualizada.' : 'Ciudad creada.', tipo: 'success' });
        setTimeout(() => navigate('/ciudades'), 1200);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Error inesperado';
        setMensaje({ texto: msg, tipo: 'danger' });
      });
  };

  const nombreLen = watch('nombre')?.length ?? 0;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">

          {/* Breadcrumb */}
          <div className="mb-4">
            <NavLink to="/ciudades" className="text-decoration-none text-muted small">
              <i className="bi bi-arrow-left me-1"></i>Volver a ciudades
            </NavLink>
            <h2 className="fw-bold mt-2 mb-0">
              <i className={`bi me-2 ${editMode ? 'bi-pencil-square' : 'bi-plus-circle'}`}
                 style={{ color: '#20232A' }}></i>
              {editMode ? 'Editar Ciudad' : 'Nueva Ciudad'}
            </h2>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">

              {mensaje && (
                <div className={`alert alert-${mensaje.tipo} d-flex align-items-center gap-2 mb-4`}>
                  <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-geo-alt me-1"></i>Nombre de la ciudad
                  </label>
                  <input
                    className={`form-control form-control-lg
                      ${errors.nombre ? 'is-invalid' : nombreLen > 0 ? 'is-valid' : ''}`}
                    placeholder="Ej: Lima, Cusco, Arequipa..."
                    {...register('nombre', {
                      required:  'El nombre es obligatorio.',
                      minLength: { value: 2,   message: 'Mínimo 2 caracteres.'   },
                      maxLength: { value: 100, message: 'Máximo 100 caracteres.' },
                      validate: val => {
                        const existe = ciudades.find(
                          c => c.nombre.toLowerCase() === val.trim().toLowerCase() && c.id !== (id ? +id : undefined)
                        );
                        return !existe || `Ya existe una ciudad llamada "${val.trim()}"`;
                      }
                    })}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback d-block">{errors.nombre.message}</div>
                  )}
                  <div className="d-flex justify-content-end mt-1">
                    <small className={nombreLen > 90 ? 'text-danger' : 'text-muted'}>
                      {nombreLen} / 100
                    </small>
                  </div>
                </div>

                {/* Descripcion general */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-cloud me-1"></i>Descripción del clima
                  </label>
                  <select
                    className={`form-select ${errors.descripcion ? 'is-invalid' : ''}`}
                    {...register('descripcion', { required: 'La descripción es obligatoria.' })}
                  >
                    <option value="">Selecciona una descripción...</option>
                    {condiciones.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.descripcion && (
                    <div className="invalid-feedback d-block">{errors.descripcion.message}</div>
                  )}
                </div>

                {/* Temperatura y Sensacion */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-thermometer-half me-1"></i>Temperatura (°C)
                    </label>
                    <input type="number"
                      className={`form-control ${errors.temperatura ? 'is-invalid' : ''}`}
                      {...register('temperatura', {
                        required: 'Obligatorio.',
                        valueAsNumber: true,
                        min: { value: TEMP_MIN, message: `Mínimo ${TEMP_MIN}°.` },
                        max: { value: TEMP_MAX, message: `Máximo ${TEMP_MAX}°.` },
                      })}
                    />
                    {errors.temperatura && (
                      <div className="invalid-feedback d-block">{errors.temperatura.message}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-thermometer me-1"></i>Sensación (°C)
                    </label>
                    <input type="number"
                      className={`form-control ${errors.sensacion ? 'is-invalid' : ''}`}
                      {...register('sensacion', {
                        required: 'Obligatorio.',
                        valueAsNumber: true,
                        min: { value: TEMP_MIN, message: `Mínimo ${TEMP_MIN}°.` },
                        max: { value: TEMP_MAX, message: `Máximo ${TEMP_MAX}°.` },
                      })}
                    />
                    {errors.sensacion && (
                      <div className="invalid-feedback d-block">{errors.sensacion.message}</div>
                    )}
                  </div>
                </div>

                {/* Humedad y Viento */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-droplet me-1"></i>Humedad (%)
                    </label>
                    <input type="number" min="0" max="100"
                      className={`form-control ${errors.humedad ? 'is-invalid' : ''}`}
                      {...register('humedad', {
                        required: 'Obligatorio.',
                        min: { value: 0,   message: 'Mínimo 0.'   },
                        max: { value: 100, message: 'Máximo 100.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.humedad && (
                      <div className="invalid-feedback d-block">{errors.humedad.message}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-wind me-1"></i>Viento (km/h)
                    </label>
                    <input type="number" min="0"
                      className={`form-control ${errors.viento ? 'is-invalid' : ''}`}
                      {...register('viento', {
                        required: 'Obligatorio.',
                        min: { value: 0, message: 'No puede ser negativo.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.viento && (
                      <div className="invalid-feedback d-block">{errors.viento.message}</div>
                    )}
                  </div>
                </div>

                {/* Precipitacion y Presion */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-cloud-rain me-1"></i>Precipitación (mm)
                    </label>
                    <input type="number" min="0"
                      className={`form-control ${errors.precipitacion ? 'is-invalid' : ''}`}
                      {...register('precipitacion', {
                        required: 'Obligatorio.',
                        min: { value: 0, message: 'No puede ser negativo.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.precipitacion && (
                      <div className="invalid-feedback d-block">{errors.precipitacion.message}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-speedometer2 me-1"></i>Presión (hPa)
                    </label>
                    <input type="number"
                      className={`form-control ${errors.presion ? 'is-invalid' : ''}`}
                      {...register('presion', {
                        required: 'Obligatorio.',
                        min: { value: 870,  message: 'Mínimo 870 hPa.'  },
                        max: { value: 1084, message: 'Máximo 1084 hPa.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.presion && (
                      <div className="invalid-feedback d-block">{errors.presion.message}</div>
                    )}
                  </div>
                </div>

                {/* Visibilidad y UV */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-eye me-1"></i>Visibilidad (km)
                    </label>
                    <input type="number" min="0"
                      className={`form-control ${errors.visibilidad ? 'is-invalid' : ''}`}
                      {...register('visibilidad', {
                        required: 'Obligatorio.',
                        min: { value: 0, message: 'No puede ser negativo.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.visibilidad && (
                      <div className="invalid-feedback d-block">{errors.visibilidad.message}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-sun me-1"></i>Índice UV
                    </label>
                    <input type="number" min="0" max="11"
                      className={`form-control ${errors.uv ? 'is-invalid' : ''}`}
                      {...register('uv', {
                        required: 'Obligatorio.',
                        min: { value: 0,  message: 'Mínimo 0.'  },
                        max: { value: 11, message: 'Máximo 11.' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.uv && (
                      <div className="invalid-feedback d-block">{errors.uv.message}</div>
                    )}
                  </div>
                </div>

                {/* ── PRONÓSTICO ── */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3">
                    <i className="bi bi-calendar3 me-1"></i>Pronóstico 5 días
                  </label>

                  {fields.map((field, index) => (
                    <div key={field.id} className="card border-0 bg-light mb-2">
                      <div className="card-body p-3">
                        <div className="row g-2 align-items-end">

                          {/* Dia — solo lectura */}
                          <div className="col-3">
                            <label className="form-label small fw-semibold mb-1">Día</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              readOnly
                              style={{ backgroundColor: '#e9ecef' }}
                              {...register(`pronostico.${index}.dia`, { required: true })}
                            />
                          </div>

                          {/* Max de temperatura */}
                          <div className="col-2">
                            <label className="form-label small fw-semibold mb-1">Máx °C</label>
                            <input type="number"
                              className={`form-control form-control-sm ${errors.pronostico?.[index]?.max ? 'is-invalid' : ''}`}
                              {...register(`pronostico.${index}.max`, {
                                required: true,
                                valueAsNumber: true,
                                min: { value: TEMP_MIN, message: `Mín ${TEMP_MIN}°.` },
                                max: { value: TEMP_MAX, message: `Máx ${TEMP_MAX}°.` },
                                validate: val => {
                                  const min = watch(`pronostico.${index}.min`);
                                  return val > min || false;
                                }
                              })}
                            />
                            {errors.pronostico?.[index]?.max && (
                              <div className="invalid-feedback d-block">{errors.pronostico[index]?.max?.message}</div>
                            )}
                          </div>

                          {/* Min de temperatura */}
                          <div className="col-2">
                            <label className="form-label small fw-semibold mb-1">Mín °C</label>
                            <input type="number"
                              className={`form-control form-control-sm ${errors.pronostico?.[index]?.min ? 'is-invalid' : ''}`}
                              {...register(`pronostico.${index}.min`, {
                                required: true,
                                valueAsNumber: true,
                                min: { value: TEMP_MIN, message: `Mín ${TEMP_MIN}°.` },
                                max: { value: TEMP_MAX, message: `Máx ${TEMP_MAX}°.` },
                                validate: val => {
                                  const max = watch(`pronostico.${index}.max`);
                                  return val < max || false;
                                }
                              })}
                            />
                            {errors.pronostico?.[index]?.min && (
                              <div className="invalid-feedback d-block">{errors.pronostico[index]?.min?.message}</div>
                            )}
                          </div>

                          {/* Descripcion del pronostico */}
                          <div className="col-5">
                            <label className="form-label small fw-semibold mb-1">Descripción</label>
                            <select
                              className={`form-select form-select-sm ${errors.pronostico?.[index]?.descripcion ? 'is-invalid' : ''}`}
                              {...register(`pronostico.${index}.descripcion`, { required: true })}
                            >
                              <option value="">Clima...</option>
                              {condiciones.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones */}
                <div className="d-flex gap-2 pt-2">
                  <button type="submit"
                    className="btn btn-primary flex-grow-1 py-2"
                    disabled={!isValid || isSubmitting}>
                    {isSubmitting ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                    ) : (
                      <><i className={`bi me-1 ${editMode ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
                        {editMode ? 'Actualizar' : 'Crear ciudad'}</>
                    )}
                  </button>
                  <NavLink to="/ciudades" className="btn btn-outline-secondary py-2 px-4">
                    Cancelar
                  </NavLink>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}