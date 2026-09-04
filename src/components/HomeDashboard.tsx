import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Play,
  Flame,
  Shield,
  BookOpen,
  CircleDot,
  Compass,
  ArrowRight,
  Volume2,
  Moon,
  CheckCircle2,
  Bookmark,
  MapPin,
  Calendar,
} from 'lucide-react';
import { AppSettings, DigitalDisciplineStats, LanguageCode, NavigationTab } from '../types';
import { PrayerService, CalculatedPrayers } from '../services/prayerService';
import { QuranService } from '../services/quranService';
import { DuaService } from '../services/duaService';
import { HadithService } from '../services/hadithService';
import { QiblaService } from '../services/qiblaService';
import { StorageService } from '../services/storageService';
import { getEstimatedHijriDate } from '../content/islamicCalendarData';
import { DHIKR_ITEMS } from '../content/dhikrData';
import { GlobalAudio } from '../services/audioService';
import { getTranslation } from '../localization/i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeDashboardProps {
  settings: AppSettings;
  stats: DigitalDisciplineStats;
  lang: LanguageCode;
  onNavigateTab: (tab: NavigationTab, subTab?: any) => void;
  onLaunchPauseGate: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  settings,
  stats,
  lang,
  onNavigateTab,
  onLaunchPauseGate,
}) => {
  const [prayers, setPrayers] = useState<CalculatedPrayers>(() =>
    PrayerService.calculate(settings)
  );
  const [countdown, setCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [isPlayingAyahAudio, setIsPlayingAyahAudio] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(() => StorageService.getBookmarks().length);

  const hijri = getEstimatedHijriDate();
  const dailyAyah = QuranService.getDailyAyah();
  const dailyDhikr = DHIKR_ITEMS[0]; // SubhanAllah
  const qiblaData = QiblaService.calculateQibla(settings.latitude, settings.longitude);

  useEffect(() => {
    const updated = PrayerService.calculate(settings);
    setPrayers(updated);
  }, [settings]);

  useEffect(() => {
    setBookmarksCount(StorageService.getBookmarks().length);
  }, []);

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

  useEffect(() => {
    const audioUrl = dailyAyah.audioUrl || QuranService.getAyahAudioUrl(dailyAyah.surahNumber, dailyAyah.ayahNumber);
    const unsubscribe = GlobalAudio.subscribe((state) => {
      setIsPlayingAyahAudio(state.isPlaying && state.url === audioUrl);
    });
    return () => unsubscribe();
  }, [dailyAyah]);

  const handlePlayDailyAyah = () => {
    const audioUrl = dailyAyah.audioUrl || QuranService.getAyahAudioUrl(dailyAyah.surahNumber, dailyAyah.ayahNumber);
    if (isPlayingAyahAudio) {
      GlobalAudio.pause();
    } else if (audioUrl) {
      GlobalAudio.playAudio(audioUrl, `${dailyAyah.surahName} ${dailyAyah.ayahNumber}`);
    }
  };

  return (
    <div id="deenfirst_home_dashboard" className="space-y-6 animate-fade-in pb-24">
      {/* Top Welcome & Hijri Date Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => onNavigateTab('calendar')}
          className="cursor-pointer group"
          title="Open Islamic Lunar Calendar"
        >
          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>{hijri.day} {hijri.monthArabic} {hijri.year} AH</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
              (Calendar →)
            </span>
          </span>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
            {hijri.formatted}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('calendar')}
            className="flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:border-emerald-500/40 shadow-sm transition"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Hijri Calendar</span>
          </button>
          <PWAInstallButton compact />
        </div>
      </div>

      {/* Ramadan Mode Card (if active) */}
      {settings.ramadanModeActive && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 dark:from-emerald-950 dark:via-[#0a3528] dark:to-emerald-950 text-white border border-emerald-500/40 p-5 shadow-lg relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Moon className="w-4 h-4 text-emerald-300" />
              <span>Ramadan Mubarak 🌙</span>
            </span>
            <span className="text-[11px] text-emerald-200 bg-emerald-500/25 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-medium">
              Fasting Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-center">
            <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-300 block uppercase">Suhoor Ends (Fajr)</span>
              <span className="font-mono text-sm font-bold text-emerald-300">
                {PrayerService.formatTime(prayers.fajr)}
              </span>
            </div>
            <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-300 block uppercase">Iftar (Maghrib)</span>
              <span className="font-mono text-sm font-bold text-teal-300">
                {PrayerService.formatTime(prayers.maghrib)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Prayer Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#082920] to-[#041611] border border-emerald-500/30 p-6 sm:p-7 text-stone-100 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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

        <div className="mt-5 pt-4 border-t border-emerald-900/30 flex items-center justify-between text-xs text-stone-400">
          <span>Shafi'i / Hanafi calculation active</span>
          <button
            onClick={() => onNavigateTab('prayer')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 group"
          >
            <span>View All Times</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* QUICK-ACCESS CARD 1: DIGITAL DISCIPLINE */}
      <div
        id="card_quick_access_discipline"
        className="rounded-3xl bg-gradient-to-br from-[#07241c] to-[#041611] text-white border border-emerald-500/30 p-6 space-y-4 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                Digital Discipline
              </span>
              <h3 className="text-base font-bold text-white">
                Mindful App Interceptor
              </h3>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Shield Active
          </span>
        </div>

        {/* 3-Column Metrics (Score, Pauses, Go-Backs) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div
            onClick={() => onNavigateTab('discipline')}
            className="cursor-pointer bg-black/30 hover:bg-black/40 rounded-2xl p-2.5 border border-emerald-500/20 text-center transition"
          >
            <span className="text-[10px] text-stone-300 block uppercase">Discipline</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              {stats.disciplineScore || 84}/100
            </span>
          </div>

          <div
            onClick={() => onNavigateTab('discipline')}
            className="cursor-pointer bg-black/30 hover:bg-black/40 rounded-2xl p-2.5 border border-emerald-500/20 text-center transition"
          >
            <span className="text-[10px] text-stone-300 block uppercase">Today</span>
            <span className="text-base font-extrabold font-mono text-white">
              {stats.todayPausesCompleted}
            </span>
            <span className="text-[9px] text-stone-400 block">pauses</span>
          </div>

          <div
            onClick={() => onNavigateTab('discipline')}
            className="cursor-pointer bg-black/30 hover:bg-black/40 rounded-2xl p-2.5 border border-emerald-500/20 text-center transition"
          >
            <span className="text-[10px] text-stone-300 block uppercase">Go-Backs</span>
            <span className="text-base font-extrabold font-mono text-teal-300">
              {stats.goBacksToday || 0}
            </span>
            <span className="text-[9px] text-teal-400 block">mindful exits</span>
          </div>
        </div>

        <p className="text-xs text-stone-200 leading-relaxed max-w-sm">
          {getTranslation(lang, 'todays_pause_desc')}
        </p>

        {/* Action Buttons: Begin Pause & Open Discipline Page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            id="btn_begin_pause"
            onClick={onLaunchPauseGate}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3 px-4 shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>{getTranslation(lang, 'begin_pause')}</span>
          </button>

          <button
            id="btn_open_discipline_page"
            onClick={() => onNavigateTab('discipline')}
            className="w-full rounded-2xl bg-white/10 hover:bg-white/15 border border-emerald-500/30 text-emerald-200 hover:text-white font-bold py-3 px-4 transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
          >
            <span>Open Digital Discipline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DASHBOARD SHORTCUTS ROW: 1. QIBLA FINDER SHORTCUT & 2. BOOKMARKS SHORTCUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Qibla Finder Shortcut Card (Requirement 2) */}
        <div
          id="card_qibla_shortcut"
          onClick={() => onNavigateTab('qibla')}
          className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 shadow-sm hover:border-emerald-500/40 transition cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Qibla Direction
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Kaaba Finder
                </h4>
              </div>
            </div>

            <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              {qiblaData.bearing}°
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300">
            Interactive compass pointing directly towards Makkah ({qiblaData.distanceKm.toLocaleString()} km away).
          </p>

          <div className="flex items-center justify-between text-xs pt-1 text-emerald-700 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Open Qibla Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bookmarks Shortcut Card (Requirement 8) */}
        <div
          id="card_bookmarks_shortcut"
          onClick={() => onNavigateTab('bookmarks')}
          className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 shadow-sm hover:border-emerald-500/40 transition cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Saved Library
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Bookmarks
                </h4>
              </div>
            </div>

            <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              {bookmarksCount} Saved
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300">
            Categorized collection of your saved Qur'an Ayahs, Duas, Hadiths, and Adhkar.
          </p>

          <div className="flex items-center justify-between text-xs pt-1 text-emerald-700 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Open Bookmarks Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* AYAH OF THE DAY */}
      <div className="rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'ayah_of_the_day')}</span>
          </span>
          <button
            onClick={handlePlayDailyAyah}
            className="flex items-center gap-1 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs bg-stone-100 dark:bg-white/5 py-1 px-2.5 rounded-lg border border-stone-200 dark:border-white/5 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{isPlayingAyahAudio ? 'Pause' : 'Recite'}</span>
          </button>
        </div>

        <p
          dir="rtl"
          className="font-arabic text-2xl text-right leading-loose text-stone-900 dark:text-emerald-100 py-1"
        >
          {dailyAyah.arabic}
        </p>

        {dailyAyah.transliteration && (
          <p className="text-xs text-stone-500 dark:text-stone-400 italic">
            {dailyAyah.transliteration}
          </p>
        )}

        <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-ui">
          "{dailyAyah.translation}"
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-emerald-900/30">
          <span>{dailyAyah.surahName} ({dailyAyah.surahNumber}:{dailyAyah.ayahNumber})</span>
          <button
            onClick={() => onNavigateTab('quran')}
            className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Open Qur'an</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* DAILY DHIKR SNIPPET */}
      <div
        onClick={() => onNavigateTab('dhikr')}
        className="cursor-pointer rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-4 space-y-2 hover:border-emerald-500/40 transition group shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold">
            <CircleDot className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'todays_dhikr')}</span>
          </span>
          <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
        </div>
        <p dir="rtl" className="font-arabic text-xl text-stone-900 dark:text-emerald-200">
          {dailyDhikr.arabic}
        </p>
        <p className="text-xs text-stone-700 dark:text-stone-300">
          "{dailyDhikr.translation}"
        </p>
        <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 pt-1">
          <span>Target: {dailyDhikr.recommendedCount} times</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">Tap to count in Digital Tasbih →</span>
        </div>
      </div>

      {/* Quick Topic Explorer Grid */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider px-1">
          Quick Devotional Access
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onNavigateTab('duas')}
            className="p-3 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/40 text-left transition group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🤲</span>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                  Duas
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Supplications
                </span>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => onNavigateTab('hadith')}
            className="p-3 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/40 text-left transition group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📜</span>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                  Hadith
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Sunnah
                </span>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => onNavigateTab('qibla')}
            className="p-3 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/40 text-left transition group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🧭</span>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                  Qibla
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Compass
                </span>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => onNavigateTab('bookmarks')}
            className="p-3 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/40 text-left transition group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🔖</span>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                  Bookmarks
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Saved Items
                </span>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
