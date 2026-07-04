import { fuzzCoordinates } from './locationPrivacy';

describe('fuzzCoordinates', () => {
  it('moves the location before returning it', () => {
    const original = { latitude: 28.6139, longitude: 77.209 };
    const randomValues = [0, 0];
    const fuzzy = fuzzCoordinates(original, () => randomValues.shift());

    expect(fuzzy).not.toEqual(original);
    expect(fuzzy.latitude).toBeGreaterThan(original.latitude);
  });

  it('does not mutate the precise coordinate', () => {
    const original = { latitude: 28.6139, longitude: 77.209 };

    fuzzCoordinates(original, () => 0.5);

    expect(original).toEqual({ latitude: 28.6139, longitude: 77.209 });
  });
});
