export interface Pronostico {
    dia: string;
    max: number;
    min: number;
    descripcion: string;
  }
  
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