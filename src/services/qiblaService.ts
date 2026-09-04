import { Qibla, Coordinates } from 'adhan';

export interface QiblaInfo {
  bearingDegrees: number;
  distanceKm: number;
  isSensorAvailable: boolean;
  compassHeading: number;
}

const MAKKAH_LAT = 21.422487;
const MAKKAH_LNG = 39.826206;

export class QiblaService {
  static calculateQibla(latitude: number, longitude: number): { bearing: number; distanceKm: number } {
    const coords = new Coordinates(latitude, longitude);
    const bearing = Qibla(coords);

    // Haversine distance
    const R = 6371; // Earth radius in km
    const dLat = ((MAKKAH_LAT - latitude) * Math.PI) / 180;
    const dLon = ((MAKKAH_LNG - longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((MAKKAH_LAT * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    return {
      bearing: Math.round(bearing * 10) / 10,
      distanceKm,
    };
  }
}
