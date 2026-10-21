import { useState } from 'react';
import './index.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

function App() {
  const [isCelsius, setIsCelsius] = useState(true);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const popularCities = ['Madrid', 'Ciudad de México', 'Buenos Aires', 'Bogotá', 'Lima'];

  const getBgColor = (temp: number) => {
    if (temp < 15) return 'bg-info bg-opacity-10'; // Frío
    if (temp > 25) return 'bg-warning bg-opacity-10'; // Calor
    return 'bg-light'; // Templado
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes('lluvia')) return 'bi-cloud-rain';
    if (description.includes('nubes')) return 'bi-clouds';
    if (description.includes('despejado') || description.includes('soleado')) return 'bi-sun';
    if (description.includes('nieve')) return 'bi-snow';
    return 'bi-cloud-sun';
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(false);
    setWeatherData(null);

    try {
      const API_KEY = "0fbf9d04a911e31833ac9627ecaf78f1";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`);

      if (!response.ok) {
        throw new Error('Error');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Skyline</h1>

      <div className="city-suggestions mt-2">
        {popularCities.map(c => (
          <span key={c} className="badge bg-secondary me-1 cursor-pointer" onClick={() => { setCity(c); fetchWeather(); }}>
            {c}
          </span>
        ))}
      </div>

      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
          placeholder="Ingresa una ciudad"
        />
        <button onClick={fetchWeather}>Buscar</button>
      </div>

      {loading && <div className="spinner"></div>}

      {error && !loading && (
        <p className="error-message">Ciudad no encontrada. Intenta con otra.</p>
      )}

      {weatherData && !loading && !error && (
        <div className={`card p-4 shadow-sm ${getBgColor(weatherData.main.temp)}`}>
          <h2>{weatherData.name}</h2>
          <div className="my-3">
            <i
              className={`bi ${getWeatherIcon(weatherData.weather[0].description)}`}
              style={{ fontSize: '4rem', color: '#007bff' }}
            ></i>
          </div>
          <h3 className="temperatura">
            {isCelsius
              ? `${Math.round(weatherData.main.temp)}°C`
              : `${Math.round((weatherData.main.temp * 9) / 5 + 32)}°F`}
          </h3>
          <p className="descripcion">{weatherData.weather[0].description}</p>
          <p className="humedad">Humedad: {weatherData.main.humidity}%</p>
          <button className="unit-toggle" onClick={() => setIsCelsius(!isCelsius)}>
            Cambiar a {isCelsius ? '°F' : '°C'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;