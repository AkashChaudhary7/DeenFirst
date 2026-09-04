import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Settings as SettingsIcon,
  Shield,
  Heart,
  BookOpen,
  Volume2,
  ChevronLeft,
} from 'lucide-react';
import { AppSettings, DigitalDisciplineStats, NavigationTab, ProtectedApp } from './types';
import { StorageService } from './services/storageService';
import { isRTL, getTranslation } from './localization/i18n';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { QuranReader } from './components/QuranReader';
import { DhikrCounter } from './components/DhikrCounter';
import { PrayerTimesView } from './components/PrayerTimesView';
import { DigitalDisciplineView } from './components/DigitalDisciplineView';
import { DuasAndHadithView } from './components/DuasAndHadithView';
import { SettingsView } from './components/SettingsView';
import { QiblaFinderView } from './components/QiblaFinderView';
import { BookmarksView } from './components/BookmarksView';
import { DigitalGateModal } from './components/DigitalGateModal';
import { OnboardingModal } from './components/OnboardingModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [stats, setStats] = useState<DigitalDisciplineStats>(() => StorageService.getDisciplineStats());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [duasInitialTab, setDuasInitialTab] = useState<'duas' | 'hadith' | 'names' | 'seerah' | 'calendar'>('duas');
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateApp, setGateApp] = useState<ProtectedApp | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!settings.hasCompletedOnboarding);

  const handleNavigateTab = (tab: NavigationTab, subTab?: any) => {
    setCurrentTab(tab);
    if (subTab) {
      setDuasInitialTab(subTab);
    }
  };

  const rtl = isRTL(settings.appLanguage);

  // Sync Theme with root class (.dark / .light)
  useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme || 'dark';

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // system preference check
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [settings.theme]);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.appLanguage;
  }, [rtl, settings.appLanguage]);

  const handleUpdateSettings = (updated: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updated };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset your local stats and preferences?')) {
      localStorage.clear();
      setSettings(StorageService.getSettings());
      setStats(StorageService.getDisciplineStats());
      window.location.reload();
    }
  };

  const handleLaunchGate = (app?: ProtectedApp | null) => {
    setGateApp(app || null);
    setIsGateOpen(true);
  };

  const handleGateSuccess = () => {
    setStats(StorageService.getDisciplineStats());
  };

  return (
    <div
      className={`min-h-screen bg-[#f5f6f1] dark:bg-[#04120e] text-stone-900 dark:text-stone-100 font-ui selection:bg-emerald-600/30 selection:text-emerald-950 dark:selection:text-emerald-100 islamic-pattern transition-colors duration-200 ${
        rtl ? 'font-arabic' : ''
      }`}
    >
      <OfflineIndicator />

      {/* Main Container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative px-4 pt-4">
        {/* Top Header */}
        <header className="flex items-center justify-between py-3 mb-2 border-b border-stone-200 dark:border-emerald-500/15">
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-emerald-500/40 flex items-center justify-center p-1.5 shadow-md group-hover:border-emerald-400 transition">
              <img src="/icon.svg" alt="DeenFirst" className="w-full h-full" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white flex items-center gap-1">
                <span>{getTranslation(settings.appLanguage, 'app_name')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              </span>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-wide">
                {getTranslation(settings.appLanguage, 'tagline_secondary')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('profile')}
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-200/60 dark:hover:bg-white/5 transition"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 pb-16">
          {currentTab === 'home' && (
            <HomeDashboard
              settings={settings}
              stats={stats}
              lang={settings.appLanguage}
              onNavigateTab={(tab, subTab) => {
                if (tab === 'duas' && subTab) {
                  setDuasInitialTab(subTab);
                } else if (tab === 'duas') {
                  setDuasInitialTab('duas');
                } else if (tab === 'hadith') {
                  setDuasInitialTab('hadith');
                }
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLaunchPauseGate={() => handleLaunchGate(null)}
            />
          )}

          {currentTab === 'quran' && (
            <QuranReader
              lang={settings.quranLanguage}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {currentTab === 'dhikr' && (
            <DhikrCounter
              lang={settings.appLanguage}
              hapticEnabled={settings.hapticFeedbackEnabled}
              soundEnabled={settings.soundEffectsEnabled}
            />
          )}

          {currentTab === 'prayer' && (
            <PrayerTimesView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              lang={settings.appLanguage}
            />
          )}

          {/* DEDICATED DIGITAL DISCIPLINE PAGE */}
          {currentTab === 'discipline' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Digital Discipline</span>
                </div>
              </div>

              <DigitalDisciplineView
                lang={settings.appLanguage}
                onLaunchTestGate={handleLaunchGate}
              />
            </div>
          )}

          {/* DEDICATED DUAS PAGE */}
          {currentTab === 'duas' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
                  <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Supplications (Duas)</span>
                </div>
              </div>

              <DuasAndHadithView
                lang={settings.duaLanguage}
                settings={settings}
                initialTab={duasInitialTab || 'duas'}
              />
            </div>
          )}

          {/* DEDICATED HADITH PAGE */}
          {currentTab === 'hadith' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Prophetic Hadith</span>
                </div>
              </div>

              <DuasAndHadithView
                lang={settings.duaLanguage}
                settings={settings}
                initialTab="hadith"
              />
            </div>
          )}

          {/* DEDICATED QIBLA FINDER PAGE */}
          {currentTab === 'qibla' && (
            <QiblaFinderView
              settings={settings}
              onBack={() => setCurrentTab('home')}
            />
          )}

          {/* DEDICATED BOOKMARKS PAGE */}
          {currentTab === 'bookmarks' && (
            <BookmarksView
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab, subTab) => handleNavigateTab(tab, subTab)}
            />
          )}

          {/* DEDICATED PROFILE & SETTINGS PAGE (DISCIPLINE AND DUAS REMOVED) */}
          {currentTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
                  <SettingsIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Settings & Preferences</span>
                </div>
              </div>

              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
              />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          lang={settings.appLanguage}
          ramadanActive={settings.ramadanModeActive}
        />

        {/* Spiritual Pause Gate Modal */}
        {isGateOpen && (
          <DigitalGateModal
            app={gateApp}
            onClose={() => setIsGateOpen(false)}
            onSuccess={handleGateSuccess}
          />
        )}

        {/* First Launch Onboarding Experience */}
        {showOnboarding && (
          <OnboardingModal
            currentSettings={settings}
            onComplete={(newSettings) => {
              handleUpdateSettings(newSettings);
              setShowOnboarding(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
