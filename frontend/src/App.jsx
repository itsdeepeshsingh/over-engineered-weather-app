import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Typography from '@mui/material/Typography';
import { useCurrentWeather } from './hooks/useCurrentWeather';
import './App.css';

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail',
};

function App() {
  const { weather, units, approximateLocation, error, isLoading } =
    useCurrentWeather();

  return (
    <div className="App">
      <header className="App-header">
        <WbSunnyIcon className="weather-logo" />
        <Typography variant="h3">
          Over-Engineered Weather App
        </Typography>
      </header>

      <main className="weather-content" aria-live="polite">
        {isLoading && (
          <section className="status-card">
            <div className="spinner" aria-hidden="true" />
            <p>Finding your local weather…</p>
          </section>
        )}

        {error && (
          <section className="status-card error-card">
            <h2>Weather unavailable</h2>
            <p>{error}</p>
          </section>
        )}

        {weather && (
          <section className="weather-card">
            <p className="eyebrow">Current conditions</p>
            <div className="temperature-row">
              <strong>
                {Math.round(weather.temperature_2m)}
                <span>{units.temperature_2m}</span>
              </strong>
              <div>
                <h1>{weatherDescriptions[weather.weather_code] || 'Current weather'}</h1>
                <p>
                  Feels like {Math.round(weather.apparent_temperature)}
                  {units.apparent_temperature}
                </p>
              </div>
            </div>

            <div className="weather-details">
              <div>
                <span>Humidity</span>
                <strong>{weather.relative_humidity_2m}{units.relative_humidity_2m}</strong>
              </div>
              <div>
                <span>Wind</span>
                <strong>{Math.round(weather.wind_speed_10m)} {units.wind_speed_10m}</strong>
              </div>
              <div>
                <span>Updated</span>
                <strong>
                  {new Date(weather.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>
            </div>

            {approximateLocation && (
              <p className="location">
                Approximate area: {approximateLocation.latitude.toFixed(2)}°,&nbsp;
                {approximateLocation.longitude.toFixed(2)}°
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
