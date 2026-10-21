
import { useState } from 'react';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './index.css';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

function App() {
  const [isCelsius, setIsCelsius] = useState(true);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setError('Escribe el nombre de una ciudad para consultar el clima.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // La clave se configura en el archivo .env del proyecto.
      const API_KEY = (import.meta as ImportMeta & {
        env: { VITE_OPENWEATHER_API_KEY?: string };
      }).env.VITE_OPENWEATHER_API_KEY;

      if (!API_KEY) {
        throw new Error('Falta configurar la clave de OpenWeather.');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          searchCity
        )}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'No encontramos esa ciudad. Comprueba el nombre e inténtalo otra vez.'
            : 'No pudimos consultar el clima. Inténtalo nuevamente.'
        );
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      setCity(data.name);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al consultar el clima.'
      );
    } finally {
      setLoading(false);
    }
  };

  const condition = weatherData?.weather[0]?.main?.toLowerCase() ?? '';

  const weatherTheme = condition.includes('rain') ||
    condition.includes('drizzle') ||
    condition.includes('thunder')
      ? 'rainy'
      : condition.includes('cloud')
        ? 'cloudy'
        : condition.includes('snow')
          ? 'snowy'
          : condition.includes('clear')
            ? 'sunny'
            : 'default';

  const weatherEmoji = condition.includes('thunder')
    ? '⛈️'
    : condition.includes('rain') || condition.includes('drizzle')
      ? '🌧️'
      : condition.includes('snow')
        ? '❄️'
        : condition.includes('cloud')
          ? '🌥️'
          : condition.includes('clear')
            ? '☀️'
            : '🌤️';

  const toDisplayTemp = (temp: number) =>
    Math.round(isCelsius ? temp : (temp * 9) / 5 + 32);

  const unit = isCelsius ? '°C' : '°F';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Tempus, inicio">
          <span className="brand-icon">☀</span>
          <span>tempus<span className="brand-dot">.</span></span>
        </a>

        <p className="nav-label">MENÚ PRINCIPAL</p>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#inicio" className="nav-item active">
            <span>▦</span> Dashboard
          </a>
          <a href="#clima" className="nav-item">
            <span>🌦</span> Estado del clima
          </a>
          <a href="#estadisticas" className="nav-item">
            <span>▥</span> Estadísticas
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-weather">
            <span className="mini-sun">🌤️</span>
            <p>Un nuevo día,<br />una nueva perspectiva.</p>
          </div>
          <p className="sidebar-caption">TEMPUS WEATHER</p>
          <p className="sidebar-version">Panel meteorológico</p>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div>
            <p className="eyebrow">TU ESPACIO METEOROLÓGICO</p>
            <h1>Weather Dashboard<span>.</span></h1>
            <p className="topbar-subtitle">
              Descubre qué está pasando con el clima.
            </p>
          </div>

          <div className="unit-switch" aria-label="Unidad de temperatura">
            <button
              className={isCelsius ? 'unit-option selected' : 'unit-option'}
              onClick={() => setIsCelsius(true)}
              aria-pressed={isCelsius}
            >
              °C
            </button>
            <button
              className={!isCelsius ? 'unit-option selected' : 'unit-option'}
              onClick={() => setIsCelsius(false)}
              aria-pressed={!isCelsius}
            >
              °F
            </button>
          </div>
        </header>

        <section className="search-panel" aria-label="Buscar ciudad">
          <div className="search-copy">
            <span className="search-icon">⌕</span>
            <div>
              <h2>¿Qué clima hace hoy?</h2>
              <p>Busca una ciudad y descubre sus condiciones actuales.</p>
            </div>
          </div>

          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              void fetchWeather();
            }}
          >
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ej. Lima, Piura, Madrid..."
              aria-label="Nombre de la ciudad"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar clima →'}
            </button>
          </form>
        </section>

        {error && (
          <div className="feedback error-feedback" role="alert">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-panel" role="status">
            <span className="spinner" />
            <p>Consultando las condiciones meteorológicas...</p>
          </div>
        )}

        {!weatherData && !loading && !error && (
          <section className="welcome-panel">
            <div className="welcome-copy">
              <span className="welcome-badge">✦ BIENVENIDO A TEMPUS</span>
              <h2>El clima cambia.<br />Tu día sigue.</h2>
              <p>
                Consulta las condiciones meteorológicas actuales de cualquier
                ciudad y prepárate para lo que venga.
              </p>
              <button
                className="example-button"
                onClick={() => {
                  setCity('Lima');
                  void fetchWeather('Lima');
                }}
              >
                Explorar Lima <span>→</span>
              </button>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <span className="art-sun">☀️</span>
              <span className="art-cloud">☁️</span>
              <span className="art-sparkle sparkle-one">✦</span>
              <span className="art-sparkle sparkle-two">✧</span>
              <span className="art-circle" />
            </div>
          </section>
        )}

        {weatherData && !loading && (
          <>
            <section className={`weather-hero theme-${weatherTheme}`} id="clima">
              <div className="hero-copy">
                <span className="hero-badge">
                  <span className="live-dot" /> CLIMA ACTUAL
                </span>
                <p className="hero-location">
                  <span>⌖</span> {weatherData.name}, {weatherData.sys.country}
                </p>
                <h2 className="hero-temperature">
                  {toDisplayTemp(weatherData.main.temp)}<span>{unit}</span>
                </h2>
                <p className="hero-description">
                  {weatherData.weather[0].description}
                </p>
                <p className="hero-feels">
                  Sensación térmica de {toDisplayTemp(weatherData.main.feels_like)}
                  {unit}
                </p>
              </div>

              <div className="hero-art">
                <div className="hero-art-glow" />
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                />
                <span className="hero-art-sparkle">✦</span>
              </div>

              <div className="hero-decoration decoration-one" />
              <div className="hero-decoration decoration-two" />
            </section>

            <section className="stats-section" id="estadisticas">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">DATOS EN TIEMPO ACTUAL</p>
                  <h2>Detalles del clima</h2>
                </div>
                <span className="section-note">📍 {weatherData.name}</span>
              </div>

              <div className="stats-grid">
                <article className="stat-card humidity-card">
                  <div className="stat-top">
                    <span className="stat-icon">💧</span>
                    <span className="stat-label">Humedad</span>
                  </div>
                  <p className="stat-value">{weatherData.main.humidity}<span>%</span></p>
                  <p className="stat-description">Humedad del ambiente</p>
                  <div className="stat-progress">
                    <span style={{ width: `${weatherData.main.humidity}%` }} />
                  </div>
                </article>

                <article className="stat-card feels-card">
                  <div className="stat-top">
                    <span className="stat-icon">🌡️</span>
                    <span className="stat-label">Sensación térmica</span>
                  </div>
                  <p className="stat-value">
                    {toDisplayTemp(weatherData.main.feels_like)}<span>{unit}</span>
                  </p>
                  <p className="stat-description">Cómo se percibe la temperatura</p>
                </article>

                <article className="stat-card wind-card">
                  <div className="stat-top">
                    <span className="stat-icon">💨</span>
                    <span className="stat-label">Velocidad del viento</span>
                  </div>
                  <p className="stat-value">
                    {weatherData.wind.speed.toFixed(1)}<span> m/s</span>
                  </p>
                  <p className="stat-description">Velocidad actual del viento</p>
                </article>

                <article className="stat-card pressure-card">
                  <div className="stat-top">
                    <span className="stat-icon">◉</span>
                    <span className="stat-label">Presión atmosférica</span>
                  </div>
                  <p className="stat-value">
                    {weatherData.main.pressure}<span> hPa</span>
                  </p>
                  <p className="stat-description">Presión a nivel local</p>
                </article>
              </div>
            </section>
          </>
        )}

        <footer className="app-footer">
          <span><span className="footer-sun">☀</span> tempus.</span>
          <p>El tiempo, en una nueva perspectiva.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
