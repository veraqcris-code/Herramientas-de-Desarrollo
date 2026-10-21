
import type { Ciudad } from '../models/ciudad.model';

/** Niveles de gravedad de las alertas meteorológicas. */
export type NivelAlerta = 'alto' | 'medio' | 'bajo';

/** Estructura de una alerta individual. */
export interface Alerta {
  nivel: NivelAlerta;
  tipo: string;
  mensaje: string;
}

/** Alertas asociadas a una ciudad. */
export interface AlertaCiudad {
  ciudad: string;
  alertas: Alerta[];
}

/** Reglas utilizadas para evaluar las condiciones meteorológicas. */
interface ReglaAlerta {
  condicion: (ciudad: Ciudad) => boolean;
  nivel: NivelAlerta;
  tipo: string;
  mensaje: (ciudad: Ciudad) => string;
}

/** Catálogo centralizado de alertas meteorológicas. */
const REGLAS_ALERTA: ReglaAlerta[] = [
  {
    condicion: ciudad => ciudad.precipitacion >= 10,
    nivel: 'alto',
    tipo: 'Lluvia intensa',
    mensaje: ciudad =>
      `Precipitaciones de ${ciudad.precipitacion} mm. Evite zonas de riesgo.`,
  },
  {
    condicion: ciudad => ciudad.temperatura >= 30,
    nivel: 'medio',
    tipo: 'Calor extremo',
    mensaje: ciudad =>
      `Temperatura de ${ciudad.temperatura} °C. Manténgase hidratado y evite la exposición prolongada al sol.`,
  },
  {
    condicion: ciudad => ciudad.uv >= 8,
    nivel: 'medio',
    tipo: 'Radiación UV elevada',
    mensaje: ciudad =>
      `Índice UV de ${ciudad.uv}. Utilice protector solar y busque sombra.`,
  },
  {
    condicion: ciudad => ciudad.viento >= 40,
    nivel: 'bajo',
    tipo: 'Viento fuerte',
    mensaje: ciudad =>
      `Vientos de ${ciudad.viento} km/h. Tome precauciones al realizar actividades al aire libre.`,
  },
];

/** Evalúa una ciudad y devuelve las alertas que correspondan. */
export const evaluarAlerta = (ciudad: Ciudad): Alerta[] =>
  REGLAS_ALERTA
    .filter(regla => regla.condicion(ciudad))
    .map(regla => ({
      nivel: regla.nivel,
      tipo: regla.tipo,
      mensaje: regla.mensaje(ciudad),
    }));

/** Obtiene únicamente las ciudades que tienen alertas activas. */
export const obtenerAlertas = (ciudades: Ciudad[]): AlertaCiudad[] =>
  ciudades
    .map(ciudad => ({
      ciudad: ciudad.nombre,
      alertas: evaluarAlerta(ciudad),
    }))
    .filter(resultado => resultado.alertas.length > 0);
