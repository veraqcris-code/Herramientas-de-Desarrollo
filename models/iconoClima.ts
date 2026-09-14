// src/utils/iconoClima.ts
export function iconoClima(descripcion: string, esNoche = false): string {
  const d = descripcion.toLowerCase();

  if (d.includes('tormenta'))        return 'bi-cloud-lightning-rain-fill';
  if (d.includes('lluvia intensa'))  return 'bi-cloud-rain-heavy-fill';
  if (d.includes('lluvia moderada')) return 'bi-cloud-rain-fill';
  if (d.includes('lluvia ligera'))   return 'bi-cloud-drizzle-fill';
  if (d.includes('garúa'))           return 'bi-cloud-drizzle';
  if (d.includes('nieve'))           return 'bi-cloud-snow-fill';
  if (d.includes('neblina'))         return 'bi-cloud-fog2-fill';
  if (d.includes('ventoso'))         return 'bi-wind';
  if (d.includes('caluroso'))        return 'bi-sun-fill';
  if (d.includes('soleado'))         return esNoche ? 'bi-moon-stars-fill' : 'bi-sun-fill';
  if (d.includes('parcial'))         return 'bi-cloud-sun-fill';
  if (d.includes('nublado'))         return 'bi-clouds-fill';
  return 'bi-cloud';
}

export function colorIcono(descripcion: string): string {
  const d = descripcion.toLowerCase();
  if (d.includes('sol') || d.includes('caluroso')) return '#FFB300';
  if (d.includes('lluvia') || d.includes('tormenta')) return '#4FC3F7';
  if (d.includes('nieve'))                          return '#E1F5FE';
  if (d.includes('nublado') || d.includes('neblina')) return '#90A4AE';
  if (d.includes('parcial'))                        return '#FFD54F';
  return '#61DAFB';
} 
