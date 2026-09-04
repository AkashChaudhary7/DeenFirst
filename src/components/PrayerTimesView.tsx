import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Settings2, CheckCircle2, ChevronDown, Calendar, Moon } from 'lucide-react';
import { AppSettings, LanguageCode } from '../types';
import { PrayerService, CalculatedPrayers, CITIES_LIST } from '../services/prayerService';
import { getTranslation } from '../localization/i18n';

interface PrayerTimesViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  lang: LanguageCode;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  settings,
  onUpdateSettings,
  lang,
}) => {
  const [prayers, setPrayers] = useState<CalculatedPrayers>(() =>
    PrayerService.calculate(settings)
  );
  const [countdown, setCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });

  // Recalculate prayers when settings change
  useEffect(() => {
    const updated = PrayerService.calculate(settings);
    setPrayers(updated);
  }, [settings]);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, prayers.nextPrayerTime.getTime() - now);
      setCountdown(PrayerService.formatCountdown(diff));

      if (diff <= 0) {
        setPrayers(PrayerService.calculate(settings));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayers.nextPrayerTime, settings]);

  const prayerRows = [
    { name: 'Fajr', labelKey: 'fajr', time: prayers.fajr, icon: '🌅' },
    { name: 'Sunrise', labelKey: 'sunrise', time: prayers.sunrise, icon: '☀️' },
    { name: 'Dhuhr', labelKey: 'dhuhr', time: prayers.dhuhr, icon: '☀️' },
    { name: 'Asr', labelKey: 'asr', time: prayers.asr, icon: '🌤️' },
    { name: 'Maghrib', labelKey: 'maghrib', time: prayers.maghrib, icon: '🌇' },
    { name: 'Isha', labelKey: 'isha', time: prayers.isha, icon: '🌙' },
  ];

  return (
    <div id="deenfirst_prayer_times_view" className="space-y-6 animate-fade-in pb-24">
      {/* Hero: Next Prayer Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#082920] to-[#041611] border border-emerald-500/30 p-6 sm:p-7 text-stone-100 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between text-xs text-stone-300 mb-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'next_prayer')}</span>
          </div>
          <div className="flex items-center gap-1 text-stone-300 bg-black/40 px-3 py-1 rounded-full border border-white/10 font-medium">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{settings.locationCity}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {prayers.nextPrayerName}
            </h2>
            <p className="text-sm text-stone-300 font-medium mt-1">
              at {PrayerService.formatTime(prayers.nextPrayerTime)}
            </p>
          </div>

          {/* Countdown Ticker */}
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Time Remaining
            </span>
            <div className="flex items-center gap-1 font-mono text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5">
              <span>{countdown.hours}</span>:
              <span>{countdown.minutes}</span>:
              <span>{countdown.seconds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Prayers Daily Schedule */}
      <div className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 divide-y divide-stone-100 dark:divide-emerald-900/30 overflow-hidden shadow-sm">
        {prayerRows.map((row) => {
          const isNext = prayers.nextPrayerName.toLowerCase() === row.name.toLowerCase();
          return (
            <div
              key={row.name}
              className={`flex items-center justify-between p-4 transition ${
                isNext
                  ? 'bg-emerald-50 dark:bg-emerald-500/10'
                  : 'hover:bg-stone-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{row.icon}</span>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isNext
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {getTranslation(lang, row.labelKey, row.name)}
                  </h4>
                  {isNext && (
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Upcoming Prayer
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`font-mono text-sm ${
                  isNext
                    ? 'text-emerald-700 dark:text-emerald-300 font-extrabold text-base'
                    : 'text-stone-700 dark:text-stone-300 font-semibold'
                }`}
              >
                {PrayerService.formatTime(row.time)}
              </span>
            </div>
          );
        })}
      </div>

      {/* FIXED CITY & ASR SELECTION (THEME-ALIGNED) */}
      <div className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Location & Juristic Parameters
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Customized for your coordinates and calculation school
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-800/15 dark:border-emerald-500/20">
            {settings.calculationMethod}
          </span>
        </div>

        <div className="space-y-4">
          {/* 1. City Selection */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Select City:</span>
            </label>
            <div className="relative">
              <select
                id="select_prayer_city"
                value={settings.locationCity}
                onChange={(e) => {
                  const found = CITIES_LIST.find((c) => c.name === e.target.value);
                  if (found) {
                    onUpdateSettings({
                      locationCity: found.name,
                      latitude: found.lat,
                      longitude: found.lng,
                      calculationMethod: (found.method as any) || 'MWL',
                    });
                  }
                }}
                className="w-full appearance-none bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-emerald-500/25 rounded-2xl px-4 py-3 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c.name} value={c.name} className="dark:bg-[#071d17]">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Asr Juristic Method Pills */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Asr Calculation Method:</span>
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                {settings.asrMethod === 'Shafi' ? 'Standard' : 'Hanafi'}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn_asr_standard"
                onClick={() => onUpdateSettings({ asrMethod: 'Shafi' })}
                className={`py-3 px-3 rounded-2xl text-xs font-semibold border transition text-left space-y-0.5 ${
                  settings.asrMethod === 'Shafi'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300 hover:border-emerald-500/40'
                }`}
              >
                <div className="font-bold">Standard (Shafi'i)</div>
                <div className={`text-[10px] ${settings.asrMethod === 'Shafi' ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'}`}>
                  Shadow ratio 1x (Shafi'i, Maliki, Hanbali)
                </div>
              </button>

              <button
                type="button"
                id="btn_asr_hanafi"
                onClick={() => onUpdateSettings({ asrMethod: 'Hanafi' })}
                className={`py-3 px-3 rounded-2xl text-xs font-semibold border transition text-left space-y-0.5 ${
                  settings.asrMethod === 'Hanafi'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300 hover:border-emerald-500/40'
                }`}
              >
                <div className="font-bold">Hanafi</div>
                <div className={`text-[10px] ${settings.asrMethod === 'Hanafi' ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'}`}>
                  Shadow ratio 2x (Later Asr time)
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Coordinates Summary */}
        <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span>
            Lat: {settings.latitude.toFixed(4)}°, Lng: {settings.longitude.toFixed(4)}°
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            Astronomical Algorithm Active
          </span>
        </div>
      </div>
    </div>
  );
};
