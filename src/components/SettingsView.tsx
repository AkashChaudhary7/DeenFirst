import React from 'react';
import {
  Globe,
  Settings,
  Compass,
  Volume2,
  Smartphone,
  Moon,
  Sun,
  Laptop,
  Type,
  Shield,
  RotateCcw,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';
import { AppSettings, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../localization/i18n';
import { CITIES_LIST } from '../services/prayerService';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const currentTheme = settings.theme || 'dark';
  const currentArabicSize = settings.arabicFontSize || 'medium';
  const currentTransSize = settings.translationFontSize || 'medium';

  const arabicSizeStyles: Record<string, string> = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
  };

  const transSizeStyles: Record<string, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg',
  };

  return (
    <div id="deenfirst_settings_view" className="space-y-6 animate-fade-in pb-24">
      {/* Title & PWA Install Banner */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>App Settings</span>
        </h2>
        <PWAInstallButton compact />
      </div>

      {/* 1. APPEARANCE & THEME - PERFECTLY ALIGNED 3-OPTION SELECTOR */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Appearance & Theme</span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 capitalize">
            Active: {currentTheme}
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Select your preferred sanctuary aesthetics. Seamlessly aligned across your reading and meditation views.
        </p>

        {/* 3-Column Aligned Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition text-center group ${
              currentTheme === 'light'
                ? 'bg-emerald-600/10 border-emerald-600 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-semibold shadow-sm'
                : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-emerald-500/50'
            }`}
          >
            {currentTheme === 'light' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition ${
              currentTheme === 'light'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-200 dark:bg-white/5 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-600/20'
            }`}>
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block">Light</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 whitespace-nowrap">
              Sunlit Marble
            </span>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition text-center group ${
              currentTheme === 'dark'
                ? 'bg-emerald-600/10 border-emerald-600 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-semibold shadow-sm'
                : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-emerald-500/50'
            }`}
          >
            {currentTheme === 'dark' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition ${
              currentTheme === 'dark'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-200 dark:bg-white/5 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-600/20'
            }`}>
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block">Dark</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 whitespace-nowrap">
              Night Mosque
            </span>
          </button>

          {/* System Auto Card */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'system' })}
            className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition text-center group ${
              currentTheme === 'system'
                ? 'bg-emerald-600/10 border-emerald-600 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-semibold shadow-sm'
                : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-emerald-500/50'
            }`}
          >
            {currentTheme === 'system' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition ${
              currentTheme === 'system'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-200 dark:bg-white/5 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-600/20'
            }`}>
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block">Auto</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 whitespace-nowrap">
              Match Device
            </span>
          </button>
        </div>
      </div>

      {/* 2. TYPOGRAPHY & TEXT SIZE ADJUSTMENT */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <Type className="w-4 h-4" />
          <span>Text Size & Typography</span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400">
          Scale Arabic calligraphy and translation text for maximum legibility and comfort.
        </p>

        {/* Arabic Font Size Stepper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-200">
              Arabic Script Size:
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium capitalize">
              {currentArabicSize}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSettings({ arabicFontSize: size })}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition ${
                  currentArabicSize === size
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-600 font-bold shadow-sm'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-emerald-500'
                }`}
              >
                {size === 'small' && 'Small'}
                {size === 'medium' && 'Medium'}
                {size === 'large' && 'Large'}
                {size === 'xlarge' && 'X-Large'}
              </button>
            ))}
          </div>

          {/* Live Arabic Preview */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/5 text-right mt-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1 text-left">
              Arabic Preview:
            </span>
            <p
              dir="rtl"
              className={`font-arabic text-emerald-800 dark:text-emerald-200 transition-all ${
                arabicSizeStyles[currentArabicSize]
              }`}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>

        {/* Translation Font Size Stepper */}
        <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-200">
              Translation & Reading Text Size:
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium capitalize">
              {currentTransSize}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSettings({ translationFontSize: size })}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition ${
                  currentTransSize === size
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-600 font-bold shadow-sm'
                    : 'bg-stone-50 dark:bg-[#041410] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-emerald-500'
                }`}
              >
                {size === 'small' && 'Small'}
                {size === 'medium' && 'Medium'}
                {size === 'large' && 'Large'}
                {size === 'xlarge' && 'X-Large'}
              </button>
            ))}
          </div>

          {/* Live Translation Preview */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/5 mt-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
              Translation Preview:
            </span>
            <p
              className={`text-stone-800 dark:text-stone-200 leading-relaxed font-ui transition-all ${
                transSizeStyles[currentTransSize]
              }`}
            >
              "In the name of Allah, the Entirely Merciful, the Especially Merciful."
            </p>
          </div>
        </div>

        {/* Transliteration Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              Show Phonetic Transliteration
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Display Latin phonetic pronunciation alongside Arabic text
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ showTransliteration: !settings.showTransliteration })
            }
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.showTransliteration !== false ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.showTransliteration !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. LANGUAGE PREFERENCES SECTION */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Independent Language Settings</span>
        </div>

        {/* App UI Language */}
        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            Application Interface Language:
          </label>
          <select
            value={settings.appLanguage}
            onChange={(e) => onUpdateSettings({ appLanguage: e.target.value as LanguageCode })}
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Quran Translation Language */}
        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            Qur'an Translation Language:
          </label>
          <select
            value={settings.quranLanguage}
            onChange={(e) => onUpdateSettings({ quranLanguage: e.target.value as LanguageCode })}
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Dua Translation Language */}
        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            Dua & Hadith Translation Language:
          </label>
          <select
            value={settings.duaLanguage}
            onChange={(e) => onUpdateSettings({ duaLanguage: e.target.value as LanguageCode })}
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. PRAYER & LOCATION CALCULATION */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Prayer Times & Location</span>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            City & Coordinates:
          </label>
          <select
            value={settings.locationCity}
            onChange={(e) => {
              const city = CITIES_LIST.find((c) => c.name === e.target.value);
              if (city) {
                onUpdateSettings({
                  locationCity: city.name,
                  latitude: city.lat,
                  longitude: city.lng,
                  calculationMethod: (city.method as any) || 'MWL',
                });
              }
            }}
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            {CITIES_LIST.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            Calculation Convention:
          </label>
          <select
            value={settings.calculationMethod}
            onChange={(e) =>
              onUpdateSettings({ calculationMethod: e.target.value as any })
            }
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            <option value="MWL">Muslim World League (MWL)</option>
            <option value="ISNA">Islamic Society of North America (ISNA)</option>
            <option value="Egypt">Egyptian General Authority of Survey</option>
            <option value="Makkah">Umm al-Qura University, Makkah</option>
            <option value="Karachi">University of Islamic Sciences, Karachi</option>
            <option value="Tehran">Institute of Geophysics, University of Tehran</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
            Asr Juristic Madhab:
          </label>
          <select
            value={settings.asrMethod}
            onChange={(e) =>
              onUpdateSettings({ asrMethod: e.target.value as any })
            }
            className="w-full bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-600"
          >
            <option value="Shafi">Standard (Shafi'i, Maliki, Hanbali)</option>
            <option value="Hanafi">Hanafi (Shadow 2x)</option>
          </select>
        </div>
      </div>

      {/* 5. SPIRITUAL GATE & DISCIPLINE CONFIG */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Spiritual Gate & Discipline Intelligence</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Salah-First Priority
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Transform pauses into Salah alerts when prayer time is near
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const currentGate = settings.gateSettings || {
                mode: 'balanced',
                cooldownMinutes: 5,
                salahFirstEnabled: true,
                adaptiveIntensityEnabled: true,
                hapticTactileEnabled: true,
                defaultIntentionRequired: false,
              };
              onUpdateSettings({
                gateSettings: {
                  ...currentGate,
                  salahFirstEnabled: !currentGate.salahFirstEnabled,
                },
              });
            }}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.gateSettings?.salahFirstEnabled !== false
                ? 'bg-emerald-600'
                : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.gateSettings?.salahFirstEnabled !== false
                  ? 'translate-x-5'
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Adaptive Pause Intensity
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Automatically escalate to Tactile Dhikr upon rapid reopening
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const currentGate = settings.gateSettings || {
                mode: 'balanced',
                cooldownMinutes: 5,
                salahFirstEnabled: true,
                adaptiveIntensityEnabled: true,
                hapticTactileEnabled: true,
                defaultIntentionRequired: false,
              };
              onUpdateSettings({
                gateSettings: {
                  ...currentGate,
                  adaptiveIntensityEnabled: !currentGate.adaptiveIntensityEnabled,
                },
              });
            }}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.gateSettings?.adaptiveIntensityEnabled !== false
                ? 'bg-emerald-600'
                : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.gateSettings?.adaptiveIntensityEnabled !== false
                  ? 'translate-x-5'
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 6. RAMADAN MODE & FEEDBACK */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <Moon className="w-4 h-4" />
          <span>Experience & Feedback</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Ramadan Mode 🌙
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Show Suhoor & Iftar countdowns and fasting logs
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ ramadanModeActive: !settings.ramadanModeActive })
            }
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.ramadanModeActive ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.ramadanModeActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Haptic Feedback
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Gentle vibration on Tasbih taps and countdowns
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ hapticFeedbackEnabled: !settings.hapticFeedbackEnabled })
            }
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.hapticFeedbackEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.hapticFeedbackEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Acoustic Tap Sound
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Soothing wooden click during Dhikr
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ soundEffectsEnabled: !settings.soundEffectsEnabled })
            }
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.soundEffectsEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 6. RESET & OFFLINE CACHE */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 space-y-3 shadow-sm">
        <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          Data & Local Storage
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          DeenFirst works 100% offline. All settings, bookmarks, and digital discipline streaks are stored securely on your device.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Stats & Preferences</span>
          </button>
        </div>
      </div>

      {/* App Identity Footer */}
      <div className="text-center py-4 space-y-2">
        <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center p-2">
          <img src="/icon.svg" alt="DeenFirst" className="w-full h-full" />
        </div>
        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">DeenFirst PWA</h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium italic">
          "Deen First. Then the Digital World."
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-400">
          Crafted with love for the Ummah • Version 2.0.0
        </p>
      </div>
    </div>
  );
};
