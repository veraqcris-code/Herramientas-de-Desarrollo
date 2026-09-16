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
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      
      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ingresa una ciudad"
        />
        <button onClick={fetchWeather}>Buscar</button>
      </div>

      {loading && <div className="spinner"></div>}

      {error && !loading && (
        <p className="error-message">Ciudad no encontrada. Intenta con otra.</p>
      )}

      {weatherData && !loading && !error && (
        <div className="tarjeta-clima">
          <h2>{weatherData.name}</h2>
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
            alt={weatherData.weather[0].description} 
          />
          <h3 className="temperatura">{Math.round(weatherData.main.temp)}°C</h3>
          <p className="descripcion">{weatherData.weather[0].description}</p>
          <p className="humedad">Humedad: {weatherData.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;