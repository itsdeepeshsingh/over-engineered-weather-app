const EARTH_RADIUS_METERS = 6_371_000;
const MINIMUM_OFFSET_METERS = 750;
const MAXIMUM_OFFSET_METERS = 1_500;

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toDegrees = (radians) => (radians * 180) / Math.PI;

/**
 * Moves a coordinate to a random point 750–1,500 metres away.
 *
 * This runs in the browser so the precise coordinate is never sent to the
 * weather backend. `random` is injectable to keep the calculation testable.
 */
export function fuzzCoordinates(
  { latitude, longitude },
  random = Math.random
) {
  const distance =
    MINIMUM_OFFSET_METERS +
    random() * (MAXIMUM_OFFSET_METERS - MINIMUM_OFFSET_METERS);
  const bearing = random() * 2 * Math.PI;
  const angularDistance = distance / EARTH_RADIUS_METERS;
  const latitudeRadians = toRadians(latitude);
  const longitudeRadians = toRadians(longitude);

  const fuzzyLatitude = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(angularDistance) +
      Math.cos(latitudeRadians) *
        Math.sin(angularDistance) *
        Math.cos(bearing)
  );
  const fuzzyLongitude =
    longitudeRadians +
    Math.atan2(
      Math.sin(bearing) *
        Math.sin(angularDistance) *
        Math.cos(latitudeRadians),
      Math.cos(angularDistance) -
        Math.sin(latitudeRadians) * Math.sin(fuzzyLatitude)
    );

  return {
    latitude: Number(toDegrees(fuzzyLatitude).toFixed(4)),
    longitude: Number(toDegrees(fuzzyLongitude).toFixed(4)),
  };
}
