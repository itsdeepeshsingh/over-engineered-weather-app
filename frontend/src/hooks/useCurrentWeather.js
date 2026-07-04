import { useEffect, useState } from 'react';
import { fetchCurrentWeather } from '../services/weatherApi';
import { fuzzCoordinates } from '../utils/locationPrivacy';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 300_000,
};

function getLocationErrorMessage(error) {
  const messages = {
    [error.PERMISSION_DENIED]: 'Allow location access to see your local weather.',
    [error.POSITION_UNAVAILABLE]: 'Your location is currently unavailable.',
    [error.TIMEOUT]: 'Finding your location took too long. Please refresh to retry.',
  };

  return messages[error.code] || 'We could not determine your location.';
}

export function useCurrentWeather() {
  const [state, setState] = useState({
    weather: null,
    units: {},
    approximateLocation: null,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    if (!navigator.geolocation) {
      setState((current) => ({
        ...current,
        error: 'Geolocation is not supported by this browser.',
      }));
      return () => controller.abort();
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        // Do not retain or transmit the precise browser-provided coordinate.
        const approximateLocation = fuzzCoordinates(coords);

        try {
          const data = await fetchCurrentWeather(
            approximateLocation,
            controller.signal
          );
          setState({
            weather: data.current,
            units: data.current_units || {},
            approximateLocation,
            error: '',
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            setState((current) => ({ ...current, error: error.message }));
          }
        }
      },
      (error) => {
        setState((current) => ({
          ...current,
          error: getLocationErrorMessage(error),
        }));
      },
      GEOLOCATION_OPTIONS
    );

    return () => controller.abort();
  }, []);

  return {
    ...state,
    isLoading: !state.weather && !state.error,
  };
}
