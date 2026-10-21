const API_KEY =
  localStorage.getItem("openweather_api_key") ||
  window.prompt("Ingresa tu clave de OpenWeather") ||
  "";

if (API_KEY) {
  localStorage.setItem("openweather_api_key", API_KEY);
}
