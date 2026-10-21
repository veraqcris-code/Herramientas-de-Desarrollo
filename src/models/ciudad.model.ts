
/** Pronóstico meteorológico de un día. */
export interface Pronostico {
  dia: string;
  max: number;
  min: number;
  descripcion: string;
}

/** Información meteorológica de una ciudad. */
export interface Ciudad {
  id?: number;
  nombre: string;
  temperatura: number;
  sensacion: number;
  descripcion: string;
  humedad: number;
  viento: number;
  precipitacion: number;
  presion: number;
  visibilidad: number;
  uv: number;
  pronostico: Pronostico[];
}
