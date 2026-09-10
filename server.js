// NOTA: LEAN LOS COMENTARIOS MRDS
const express = require('express');

const app = express();
const PORT = 3000;

// CORS para ambas apps
app.use((req, res, next) => {
  const allowed = ['http://localhost:5173', 'http://localhost:5174'];
  const origin  = req.headers.origin;
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Base de datos simulada de usuarios
const usuarios = [
  { id: 1, usuario: 'admin', password: 'tempus123' }
];

// Condiciones de clima válidas compartidas entre POST y PUT
const CONDICIONES_VALIDAS = [
  'Soleado', 'Parcialmente nublado', 'Nublado', 'Garúa',
  'Lluvia ligera', 'Lluvia moderada', 'Lluvia intensa',
  'Tormenta', 'Nieve', 'Neblina', 'Ventoso', 'Caluroso'
];

const TEMP_MIN = -30;
const TEMP_MAX = 50;

// Base de datos simulada de ciudades
let ciudades = [
  {
    id: 1,
    nombre: "Lima",
    temperatura: 32,
    sensacion: 20,
    descripcion: "Nublado",
    humedad: 85,
    viento: 12,
    precipitacion: 12,
    presion: 1013,
    visibilidad: 8,
    uv: 3,
    pronostico: [
      { dia: "Lunes", max: 23, min: 18, descripcion: "Nublado"},
      { dia: "Martes", max: 22, min: 17, descripcion: "Garúa"},
      { dia: "Miércoles", max: 24, min: 18, descripcion: "Nublado"},
      { dia: "Jueves", max: 25, min: 19, descripcion: "Nublado"},
      { dia: "Viernes", max: 24, min: 18, descripcion: "Nublado"}
    ]
  },
  {
    id: 2,
    nombre: "Cusco",
    temperatura: 18,
    sensacion: 14,
    descripcion: "Soleado",
    humedad: 60,
    viento: 8,
    precipitacion: 0,
    presion: 1008,
    visibilidad: 10,
    uv: 7,
    pronostico: [
      { dia: "Lunes", max: 19, min: 5, descripcion: "Soleado"},
      { dia: "Martes", max: 18, min: 4, descripcion: "Soleado"},
      { dia: "Miércoles", max: 17, min: 6, descripcion: "Parcialmente nublado"},
      { dia: "Jueves", max: 16, min: 5, descripcion: "Lluvia moderada"},
      { dia: "Viernes", max: 18, min: 4, descripcion: "Soleado"}
    ]
  }
];

let nextId = 3;

app.get('/', (req, res) => {
  res.send('Tempus API corriendo');
});

// POST login
app.post('/api/auth/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  const encontrado = usuarios.find(
    u => u.usuario === usuario && u.password === password
  );

  if (!encontrado) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }

  res.json({ mensaje: 'Login exitoso', usuario: encontrado.usuario });
});

// GET condiciones de clima válidas
app.get('/api/condiciones', (req, res) => {
  res.json(CONDICIONES_VALIDAS);
});

// GET todas las ciudades
app.get('/api/ciudades', (req, res) => {
  res.json(ciudades);
});

// GET ciudad por ID
app.get('/api/ciudades/:id', (req, res) => {
  const id     = parseInt(req.params.id);
  const ciudad = ciudades.find(c => c.id === id);

  if (!ciudad) {
    return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
  }

  res.json(ciudad);
});

// POST crear ciudad
app.post('/api/ciudades', (req, res) => {
  const { nombre, temperatura, sensacion, descripcion,
          humedad, viento, precipitacion, presion,
          visibilidad, uv, pronostico } = req.body;

  // Nombre
  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ mensaje: 'El nombre es obligatorio (mínimo 2 caracteres)' });
  }

  // Descripcion general
  if (!descripcion || !CONDICIONES_VALIDAS.includes(descripcion)) {
    return res.status(400).json({ mensaje: `Descripción de clima no válida: "${descripcion}"` });
  }

  // Temperatura general dentro de rango
  if (temperatura !== undefined && (temperatura > TEMP_MAX || temperatura < TEMP_MIN)) {
    return res.status(400).json({ mensaje: `La temperatura debe estar entre ${TEMP_MIN}° y ${TEMP_MAX}°` });
  }

  if (sensacion !== undefined && (sensacion > TEMP_MAX || sensacion < TEMP_MIN)) {
    return res.status(400).json({ mensaje: `La sensación térmica debe estar entre ${TEMP_MIN}° y ${TEMP_MAX}°` });
  }

  // Ciudad duplicada
  const existe = ciudades.find(
    c => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  if (existe) {
    return res.status(409).json({ mensaje: `Ya existe una ciudad con el nombre "${nombre.trim()}"` });
  }

  // Validar pronóstico
  if (pronostico && pronostico.length > 5) {
    return res.status(400).json({ mensaje: 'El pronóstico no puede tener más de 5 días' });
  }

  if (pronostico) {
    for (const dia of pronostico) {
      if (dia.max <= dia.min) {
        return res.status(400).json({
          mensaje: `La temperatura máxima debe ser mayor a la mínima (${dia.dia}: máx ${dia.max}° ≤ mín ${dia.min}°)`
        });
      }
      if (!dia.descripcion || !CONDICIONES_VALIDAS.includes(dia.descripcion)) {
        return res.status(400).json({
          mensaje: `Descripción no válida en pronóstico (${dia.dia}): "${dia.descripcion}"`
        });
      }
      if (dia.max > TEMP_MAX || dia.min < TEMP_MIN) {
        return res.status(400).json({
          mensaje: `Las temperaturas deben estar entre ${TEMP_MIN}° y ${TEMP_MAX}° (${dia.dia})`
        });
      }
    }
  }

  const nueva = {
    id: nextId++,
    nombre: nombre.trim(),
    temperatura: temperatura ?? 0,
    sensacion: sensacion ?? 0,
    descripcion: descripcion,
    humedad: humedad ?? 0,
    viento: viento ?? 0,
    precipitacion: precipitacion ?? 0,
    presion: presion ?? 1013,
    visibilidad: visibilidad ?? 10,
    uv: uv ?? 0,
    pronostico: pronostico ?? [],
  };

  ciudades.push(nueva);
  res.status(201).json(nueva);
});

// PUT actualizar ciudad
app.put('/api/ciudades/:id', (req, res) => {
  const id  = parseInt(req.params.id);
  const index = ciudades.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
  }

const { nombre, descripcion, pronostico, temperatura, sensacion } = req.body;

  // Validar nombre duplicado excluyendo la ciudad actual
  if (nombre) {
    const existe = ciudades.find(
      c => c.nombre.toLowerCase() === nombre.trim().toLowerCase() && c.id !== id
    );
    if (existe) {
      return res.status(409).json({ mensaje: `Ya existe una ciudad con el nombre "${nombre.trim()}"` });
    }
  }

  // Validar descripcion general
  if (descripcion && !CONDICIONES_VALIDAS.includes(descripcion)) {
    return res.status(400).json({ mensaje: `Descripción de clima no válida: "${descripcion}"` });
  }

  // Temperatura general dentro de rango
  if (temperatura !== undefined && (temperatura > TEMP_MAX || temperatura < TEMP_MIN)) {
    return res.status(400).json({ mensaje: `La temperatura debe estar entre ${TEMP_MIN}° y ${TEMP_MAX}°` });
  }

  if (sensacion !== undefined && (sensacion > TEMP_MAX || sensacion < TEMP_MIN)) {
    return res.status(400).json({ mensaje: `La sensación térmica debe estar entre ${TEMP_MIN}° y ${TEMP_MAX}°` });
  }
  
  // Validar pronóstico
  if (pronostico && pronostico.length > 5) {
    return res.status(400).json({ mensaje: 'El pronóstico no puede tener más de 5 días' });
  }

  if (pronostico) {
    for (const dia of pronostico) {
      if (dia.max <= dia.min) {
        return res.status(400).json({
          mensaje: `La temperatura máxima debe ser mayor a la mínima (${dia.dia}: máx ${dia.max}° es menor a mín ${dia.min}°)`
        });
      }
      if (!dia.descripcion || !CONDICIONES_VALIDAS.includes(dia.descripcion)) {
        return res.status(400).json({
          mensaje: `Descripción no válida en pronóstico (${dia.dia}): "${dia.descripcion}"`
        });
      }
      if (dia.max > TEMP_MAX || dia.min < TEMP_MIN) {
        return res.status(400).json({
          mensaje: `Las temperaturas deben estar entre ${TEMP_MIN}° y ${TEMP_MAX}° (${dia.dia})`
        });
      }
    }
  }

  ciudades[index] = { ...ciudades[index], ...req.body, id: ciudades[index].id };
  res.json(ciudades[index]);
});

// DELETE eliminar ciudad
app.delete('/api/ciudades/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = ciudades.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
  }

  const eliminada = ciudades[index];
  ciudades = ciudades.filter(c => c.id !== id);
  res.json(eliminada);
});

app.listen(PORT, () => {
  console.log(`Tempus API corriendo en http://localhost:${PORT}`);
});