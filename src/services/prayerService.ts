import {
  Coordinates,
  CalculationMethod,
  Madhab,
  PrayerTimes,
  HighLatitudeRule,
} from 'adhan';
import { AppSettings } from '../types';

export interface CalculatedPrayers {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  nextPrayerName: string;
  nextPrayerTime: Date;
  timeRemainingMs: number;
}

export const CITIES_LIST = [
  { name: 'Udaipur, India', lat: 24.5854, lng: 73.7125, method: 'Karachi' },
  { name: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262, method: 'Makkah' },
  { name: 'Madinah, Saudi Arabia', lat: 24.5247, lng: 39.5692, method: 'Makkah' },
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, method: 'Karachi' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, method: 'Karachi' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, method: 'MWL' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, method: 'ISNA' },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, method: 'MWL' },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, method: 'Egypt' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, method: 'MWL' },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, method: 'MWL' },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, method: 'MWL' },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, method: 'ISNA' },
];

export class PrayerService {
  static getParameters(settings: AppSettings) {
    let params;
    switch (settings.calculationMethod) {
      case 'ISNA':
        params = CalculationMethod.NorthAmerica();
        break;
      case 'Egypt':
        params = CalculationMethod.Egyptian();
        break;
      case 'Karachi':
        params = CalculationMethod.Karachi();
        break;
      case 'Makkah':
        params = CalculationMethod.UmmAlQura();
        break;
      case 'Tehran':
        params = CalculationMethod.Tehran();
        break;
      case 'MWL':
      default:
        params = CalculationMethod.MuslimWorldLeague();
        break;
    }

    params.madhab = settings.asrMethod === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

    if (settings.highLatitudeRule === 'SeventhOfTheNight') {
      params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
    } else if (settings.highLatitudeRule === 'TwilightAngle') {
      params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
    } else {
      params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
    }

    // Manual minute adjustments
    params.fajrAngle = params.fajrAngle;
    return params;
  }

  static calculate(settings: AppSettings, date: Date = new Date()): CalculatedPrayers {
    const coordinates = new Coordinates(settings.latitude, settings.longitude);
    const params = this.getParameters(settings);
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    // Apply manual minute offsets
    const fajr = new Date(prayerTimes.fajr.getTime() + (settings.manualOffsetMinutes?.fajr || 0) * 60000);
    const sunrise = new Date(prayerTimes.sunrise.getTime() + (settings.manualOffsetMinutes?.sunrise || 0) * 60000);
    const dhuhr = new Date(prayerTimes.dhuhr.getTime() + (settings.manualOffsetMinutes?.dhuhr || 0) * 60000);
    const asr = new Date(prayerTimes.asr.getTime() + (settings.manualOffsetMinutes?.asr || 0) * 60000);
    const maghrib = new Date(prayerTimes.maghrib.getTime() + (settings.manualOffsetMinutes?.maghrib || 0) * 60000);
    const isha = new Date(prayerTimes.isha.getTime() + (settings.manualOffsetMinutes?.isha || 0) * 60000);

    const now = date.getTime();
    let nextPrayerName = 'Fajr';
    let nextPrayerTime = fajr;

    if (now < fajr.getTime()) {
      nextPrayerName = 'Fajr';
      nextPrayerTime = fajr;
    } else if (now < sunrise.getTime()) {
      nextPrayerName = 'Sunrise';
      nextPrayerTime = sunrise;
    } else if (now < dhuhr.getTime()) {
      nextPrayerName = 'Dhuhr';
      nextPrayerTime = dhuhr;
    } else if (now < asr.getTime()) {
      nextPrayerName = 'Asr';
      nextPrayerTime = asr;
    } else if (now < maghrib.getTime()) {
      nextPrayerName = 'Maghrib';
      nextPrayerTime = maghrib;
    } else if (now < isha.getTime()) {
      nextPrayerName = 'Isha';
      nextPrayerTime = isha;
    } else {
      // Tomorrow's Fajr
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
      nextPrayerName = 'Fajr';
      nextPrayerTime = new Date(tomorrowPrayerTimes.fajr.getTime() + (settings.manualOffsetMinutes?.fajr || 0) * 60000);
    }

    const timeRemainingMs = Math.max(0, nextPrayerTime.getTime() - now);

    return {
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha,
      nextPrayerName,
      nextPrayerTime,
      timeRemainingMs,
    };
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  static formatCountdown(ms: number): { hours: string; minutes: string; seconds: string } {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  }
}
