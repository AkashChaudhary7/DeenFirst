import React, { useState, useEffect } from 'react';
import { Compass, ChevronLeft, MapPin, Navigation as NavIcon, Info, CheckCircle2, RotateCw } from 'lucide-react';
import { AppSettings } from '../types';
import { QiblaService } from '../services/qiblaService';
import { GlobalAudio } from '../services/audioService';

interface QiblaFinderViewProps {
  settings: AppSettings;
  onBack: () => void;
}

export const QiblaFinderView: React.FC<QiblaFinderViewProps> = ({ settings, onBack }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const qiblaData = QiblaService.calculateQibla(settings.latitude, settings.longitude);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHasCompassSupport(true);
        const heading =
          (e as any).webkitCompassHeading !== undefined
            ? (e as any).webkitCompassHeading
            : 360 - e.alpha;
        const roundedHeading = Math.round(heading);
        setDeviceHeading(roundedHeading);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const requestOrientationPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
        }
      } catch (err) {
        console.warn('Orientation permission error:', err);
      }
    }
  };

  const compassNeedleAngle =
    deviceHeading !== null
      ? (qiblaData.bearing - deviceHeading + 360) % 360
      : qiblaData.bearing;

  // Check if phone is pointing directly towards Qibla within ±5 degrees
  const isAligned =
    deviceHeading !== null &&
    Math.abs(((deviceHeading - qiblaData.bearing + 540) % 360) - 180) < 6;

  useEffect(() => {
    if (isAligned && settings.hapticFeedbackEnabled) {
      GlobalAudio.vibrate(40, true);
    }
  }, [isAligned, settings.hapticFeedbackEnabled]);

  return (
    <div id="deenfirst_qibla_page" className="space-y-6 animate-fade-in pb-24">
      {/* Top Bar with Single "Back" label */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Qibla Finder</span>
        </div>
      </div>

      {/* Hero Compass Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#082920] to-[#041611] text-white border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
        {/* Alignment Status Banner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-stone-300 text-xs bg-black/30 px-3 py-1 rounded-full border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[160px]">{settings.locationCity}</span>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border transition ${
              isAligned
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-black/30 text-stone-300 border-white/10'
            }`}
          >
            {isAligned ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Facing the Kaaba</span>
              </>
            ) : (
              <span>Rotate device</span>
            )}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Holy Kaaba Direction
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            Makkah al-Mukarramah • Masjid al-Haram
          </p>
        </div>

        {/* COMPASS VISUAL DIAL */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center select-none">
          {/* Outer glow ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
              isAligned
                ? 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.35)]'
                : 'border-emerald-500/25 shadow-inner'
            } bg-black/40`}
          />

          {/* Compass degree markings */}
          <div className="absolute inset-4 rounded-full border border-white/10 flex items-center justify-center">
            <span className="absolute top-2 text-xs font-extrabold text-emerald-400">N</span>
            <span className="absolute bottom-2 text-xs font-bold text-stone-500">S</span>
            <span className="absolute left-2 text-xs font-bold text-stone-500">W</span>
            <span className="absolute right-2 text-xs font-bold text-stone-500">E</span>
          </div>

          {/* Rotating Needle (Points to Qibla) */}
          <div
            className="w-full h-full absolute transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `rotate(${compassNeedleAngle}deg)` }}
          >
            <div className="flex flex-col items-center h-full justify-between py-6">
              {/* Top pointer to Kaaba */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform ${
                    isAligned
                      ? 'scale-110 bg-emerald-400 text-stone-950 ring-4 ring-emerald-400/40'
                      : 'bg-emerald-600/90 text-white'
                  }`}
                >
                  <span className="text-lg">🕋</span>
                </div>
                <div className="w-1 h-14 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full mt-1" />
              </div>

              {/* Bottom counter balance */}
              <div className="w-3.5 h-3.5 rounded-full bg-stone-600 border border-white/20" />
            </div>
          </div>

          {/* Center Hub */}
          <div className="w-8 h-8 rounded-full bg-stone-900 border-2 border-emerald-400 z-10 flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
          <div className="bg-black/35 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
              Qibla Bearing
            </span>
            <span className="text-xl font-bold font-mono text-emerald-300">
              {qiblaData.bearing}°
            </span>
          </div>

          <div className="bg-black/35 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
              Distance to Kaaba
            </span>
            <span className="text-xl font-bold font-mono text-stone-200">
              {qiblaData.distanceKm.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Permission / Sensor notice */}
        <div className="space-y-2 max-w-sm mx-auto">
          {typeof window !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function' &&
            permissionState === 'prompt' && (
              <button
                onClick={requestOrientationPermission}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Enable Compass Sensor (iOS)</span>
              </button>
            )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-300 bg-white/5 py-2 px-3.5 rounded-xl border border-white/5">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {hasCompassSupport
                ? 'Compass sensor active. Hold your device flat on your hand.'
                : 'Align your device with bearing degree (' + qiblaData.bearing + '°) facing North.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
