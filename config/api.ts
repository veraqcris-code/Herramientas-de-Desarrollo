const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('Falta definir VITE_API_URL en el archivo .env');
}

export const API_URL = apiUrl.replace(/\/$/, '');
