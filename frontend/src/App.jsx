import { useEffect } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Typography from '@mui/material/Typography';
import './App.css';

function App() {
  useEffect(() => {
    console.log('Requesting geolocation...');
    console.log('navigator.geolocation:', navigator.geolocation); 
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('Got position:', position);
      const maxOffsetMeters = 1500;
      const distance = Math.random() * maxOffsetMeters;

      const angle = Math.random() * 2 * Math.PI;

      const deltaLat = (distance * Math.cos(angle)) / 111320;

      let lat = position.coords.latitude + deltaLat;
  
      const deltaLong =
        (distance * Math.sin(angle)) /
        (111320 * Math.cos((lat * Math.PI) / 180));

      let long = position.coords.longitude + deltaLong;
     

      console.log(`Latitude: ${lat}, Longitude: ${long}`);

      console.log(process.env.API_ENDPOINT)
      fetch(`http://localhost:8000/weather/currentlocation?lat=${lat}&long=${long}`)
      .then(res => console.log(res.json()))
    },
    (error) => {
      console.error('Geolocation error:', error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error('User denied location access');
          break;

        case error.POSITION_UNAVAILABLE:
          console.error('Location unavailable');
          break;

        case error.TIMEOUT:
          console.error('Location request timed out');
          break;

        default:
          console.error('Unknown geolocation error');
      }
    },{   enableHighAccuracy: false,
  timeout: 4000,
  maximumAge: Infinity }
);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <WbSunnyIcon style={{ fontSize: 60, color: '#FFD700', marginRight: 25 }} />
        <Typography variant="h3">
          Over-Engineered Weather App
        </Typography>
      </header>
      
    </div>
  );
}

export default App;
