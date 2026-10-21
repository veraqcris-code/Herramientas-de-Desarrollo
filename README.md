# Herramientas-de-Desarrollo

Aplicación web para consultar y administrar información meteorológica y pronósticos de distintas ciudades.

## Requisitos

- Node.js 20.6 o posterior y npm.
- Express para ejecutar la API (`server.js`).
- Para la interfaz: React, React DOM, React Router DOM, React Hook Form, Vite y TypeScript.
- Un navegador moderno.

## Instalación y ejecución de la API

1. Instala Express en el entorno Node.js del proyecto:

   ```bash
   npm install express
   ```

2. Copia `.env.example` como `.env` y ajusta las variables si es necesario. `PORT` define el puerto de la API y `VITE_API_URL` la dirección que utilizará la interfaz.

3. Inicia la API desde la carpeta del proyecto:

   ```bash
   node --env-file=.env server.js
   ```

   La API quedará disponible en `http://localhost:3000` de forma predeterminada.

## Interfaz

La interfaz debe ejecutarse con Vite en `http://localhost:5173`, origen permitido por la configuración CORS de la API. Asegúrate de tener instaladas las dependencias de interfaz indicadas arriba y configura `VITE_API_URL` con la dirección de la API, por ejemplo `http://localhost:3000/api`.

La API usa datos en memoria para esta demostración; las ciudades creadas o modificadas se reinician al detener el servidor.
