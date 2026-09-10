import type { Ciudad } from '../models/ciudad.model';

export interface Alerta {
  nivel: 'alto' | 'medio' | 'bajo';
  tipo: string;
  mensaje: string;
}

export interface AlertaCiudad {
  ciudad:  string;
  alertas: Alerta[];
}

export const evaluarAlerta = (ciudad: Ciudad): Alerta[] => {
  const alertas: Alerta[] = [];

  if (ciudad.precipitacion >= 10)
    alertas.push({
      nivel: 'alto',
      tipo: 'Lluvia intensa',
      mensaje: `Precipitaciones de ${ciudad.precipitacion} mm. Evite zonas de riesgo.`,
    });

  if (ciudad.temperatura >= 30)
    alertas.push({
      nivel: 'medio',
      tipo: 'Calor extremo',
      mensaje: `Temperatura de ${ciudad.temperatura}°C. Manténgase hidratado.`,
    });

  if (ciudad.uv >= 8)
    alertas.push({
      nivel: 'medio',
      tipo: 'UV elevado',
      mensaje: `Índice UV de ${ciudad.uv}. Se recomienda protector solar.`,
    });

  if (ciudad.viento >= 40)
    alertas.push({
      nivel: 'bajo',
      tipo: 'Viento fuerte',
      mensaje: `Vientos de ${ciudad.viento} km/h. Precaución en exteriores.`,
    });

  return alertas;
};

export const obtenerAlertas = (ciudades: Ciudad[]): AlertaCiudad[] =>
  ciudades
    .map(c => ({ ciudad: c.nombre, alertas: evaluarAlerta(c) }))
    .filter(item => item.alertas.length > 0);