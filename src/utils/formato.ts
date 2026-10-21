const formatoTemperatura = new Intl.NumberFormat('es-PE', {
  maximumFractionDigits: 1,
});

export function formatearTemperatura(valor: number): string {
  return `${formatoTemperatura.format(valor)} °C`;
}
