const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export async function fetchCurrentWeather(coordinates, signal) {
  const params = new URLSearchParams({
    latitude: coordinates.latitude.toString(),
    longitude: coordinates.longitude.toString(),
  });
  const response = await fetch(
    `${API_ENDPOINT}/weather/currentlocation?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('The weather service could not load current conditions.');
  }

  return response.json();
}
