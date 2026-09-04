import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Settings2,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Moon,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Play,
} from 'lucide-react';
import { AppSettings, LanguageCode, PrayerNotificationSettings } from '../types';
import { PrayerService, CalculatedPrayers, CITIES_LIST } from '../services/prayerService';
import { NotificationService } from '../services/notificationService';
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
  const [permissionStatus, setPermissionStatus] = useState<string>(() =>
    NotificationService.getPermissionStatus()
  );
  const [testAlertTriggered, setTestAlertTriggered] = useState(false);

  const notifSettings: PrayerNotificationSettings = settings.prayerNotifications || {
    enabled: true,
    soundMode: 'chime',
    reminderTiming: 0,
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    jumuah: true,
  };

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

  const handleUpdateNotif = (partial: Partial<PrayerNotificationSettings>) => {
    const updated = { ...notifSettings, ...partial };
    onUpdateSettings({ prayerNotifications: updated });
  };

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
  };

  const handleTestAlert = () => {
    NotificationService.testNotification(settings, prayers.nextPrayerName);
    setTestAlertTriggered(true);
    setTimeout(() => setTestAlertTriggered(false), 2500);
  };

  const prayerRows = [
    { name: 'Fajr', labelKey: 'fajr', key: 'fajr' as const, time: prayers.fajr, icon: '🌅' },
    { name: 'Sunrise', labelKey: 'sunrise', key: 'sunrise' as const, time: prayers.sunrise, icon: '☀️' },
    { name: 'Dhuhr', labelKey: 'dhuhr', key: 'dhuhr' as const, time: prayers.dhuhr, icon: '☀️' },
    { name: 'Asr', labelKey: 'asr', key: 'asr' as const, time: prayers.asr, icon: '🌤️' },
    { name: 'Maghrib', labelKey: 'maghrib', key: 'maghrib' as const, time: prayers.maghrib, icon: '🌇' },
    { name: 'Isha', labelKey: 'isha', key: 'isha' as const, time: prayers.isha, icon: '🌙' },
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

      {/* 6 DAILY PRAYER ROWS */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider px-1">
          Today's Prayer Schedule
        </h3>

        <div className="space-y-2">
          {prayerRows.map((p) => {
            const isNext = prayers.nextPrayerName.toLowerCase().includes(p.labelKey.toLowerCase());
            const isAlertActive = notifSettings.enabled && notifSettings[p.key];

            return (
              <div
                key={p.name}
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  isNext
                    ? 'bg-emerald-600/10 dark:bg-emerald-500/15 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-white dark:bg-[#071d17] border-stone-200 dark:border-emerald-500/20 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {p.name}
                      </span>
                      {isNext && (
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          Next Salah
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {p.name === 'Sunrise' ? 'Prohibition ends' : 'Obligatory prayer'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100 block">
                      {PrayerService.formatTime(p.time)}
                    </span>
                  </div>

                  {/* Quick Individual Prayer Alert Toggle */}
                  <button
                    onClick={() => handleUpdateNotif({ [p.key]: !isAlertActive })}
                    title={`Toggle ${p.name} alert`}
                    className={`p-2 rounded-xl transition ${
                      isAlertActive
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                        : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 bg-stone-100 dark:bg-white/5'
                    }`}
                  >
                    {isAlertActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRAYER NOTIFICATIONS & SOUND SETTINGS (USER MANDATE) */}
      <div
        id="section_prayer_notifications"
        className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 sm:p-6 space-y-5 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Salah Notifications & Audio Mode
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Alerts, chime synthesis, and silent mode preferences
              </p>
            </div>
          </div>

          {/* Master Notification Toggle */}
          <button
            id="toggle_master_notifications"
            onClick={() => handleUpdateNotif({ enabled: !notifSettings.enabled })}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
              notifSettings.enabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                notifSettings.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Browser Permission Notice if not granted */}
        {permissionStatus !== 'granted' && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Browser notifications are currently {permissionStatus}.</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="py-1 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 shadow-sm"
            >
              Enable
            </button>
          </div>
        )}

        {/* Sound & Alert Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
            Audio & Silent Mode Style:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'adhan', label: 'Adhan Chime', desc: 'Melodic chord', icon: '🕌' },
              { id: 'chime', label: 'Gentle Bell', desc: '2-tone chime', icon: '🔔' },
              { id: 'silent', label: 'Silent Mode', desc: 'Visual + Haptic', icon: '🔕' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleUpdateNotif({ soundMode: mode.id as any })}
                className={`p-3 rounded-2xl text-left border transition space-y-1 ${
                  notifSettings.soundMode === mode.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{mode.icon}</span>
                  {notifSettings.soundMode === mode.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">{mode.label}</span>
                  <span className={`text-[10px] ${notifSettings.soundMode === mode.id ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {mode.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reminder Timing Offset */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
            Alert Advance Timing:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 0, label: 'At Adhan' },
              { val: 5, label: '5m Before' },
              { val: 10, label: '10m Before' },
              { val: 15, label: '15m Before' },
            ].map((timing) => (
              <button
                key={timing.val}
                onClick={() => handleUpdateNotif({ reminderTiming: timing.val as any })}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition ${
                  notifSettings.reminderTiming === timing.val
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300'
                }`}
              >
                {timing.label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Friday Jumu'ah Morning Reminder */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-800/10 dark:border-emerald-500/20 text-xs">
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block">
              Friday (Jumu'ah) Morning Notice
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Reminder for Surah Al-Kahf, Ghusl, and Salawat
            </span>
          </div>

          <button
            onClick={() => handleUpdateNotif({ jumuah: !notifSettings.jumuah })}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              notifSettings.jumuah ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                notifSettings.jumuah ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Test Alert Button */}
        <button
          onClick={handleTestAlert}
          className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-white/5 dark:hover:bg-white/10 border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-800 dark:text-stone-200 transition active:scale-95 flex items-center justify-center gap-2 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{testAlertTriggered ? 'Alert Sent! 🔔' : 'Send Test Prayer Alert (Test Sound & Banner)'}</span>
        </button>
      </div>

      {/* JURISTIC & LOCATION PARAMETERS */}
      <div className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
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
