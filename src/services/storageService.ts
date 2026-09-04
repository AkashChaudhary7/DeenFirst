import { AppSettings, BookmarkItem, DigitalDisciplineStats, FastingLog, ProtectedApp } from '../types';

const SETTINGS_KEY = 'deenfirst_settings';
const STATS_KEY = 'deenfirst_discipline_stats';
const PROTECTED_APPS_KEY = 'deenfirst_protected_apps';
const BOOKMARKS_KEY = 'deenfirst_bookmarks';
const FASTING_KEY = 'deenfirst_fasting_logs';

export const DEFAULT_SETTINGS: AppSettings = {
  appLanguage: 'en',
  quranLanguage: 'en',
  duaLanguage: 'en',
  theme: 'dark',
  arabicFontSize: 'medium',
  translationFontSize: 'medium',
  showTransliteration: true,
  calculationMethod: 'MWL',
  asrMethod: 'Shafi',
  highLatitudeRule: 'MiddleOfTheNight',
  manualOffsetMinutes: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  locationCity: 'Udaipur, India',
  latitude: 24.5854,
  longitude: 73.7125,
  ramadanModeActive: false,
  hapticFeedbackEnabled: true,
  soundEffectsEnabled: true,
  dailyReminderTime: '06:00',
  hasCompletedOnboarding: false,
};

export const INITIAL_PROTECTED_APPS: ProtectedApp[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    iconName: 'Camera',
    category: 'social',
    isProtected: true,
    pauseCount: 14,
    urgentAccessCount: 2,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    iconName: 'PlaySquare',
    category: 'entertainment',
    isProtected: true,
    pauseCount: 21,
    urgentAccessCount: 3,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    iconName: 'Video',
    category: 'short_video',
    isProtected: true,
    pauseCount: 9,
    urgentAccessCount: 1,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    packageName: 'com.facebook.katana',
    iconName: 'Share2',
    category: 'social',
    isProtected: false,
    pauseCount: 4,
    urgentAccessCount: 0,
  },
  {
    id: 'games',
    name: 'Games & Entertainment',
    packageName: 'com.gaming.generic',
    iconName: 'Gamepad2',
    category: 'gaming',
    isProtected: true,
    pauseCount: 8,
    urgentAccessCount: 1,
  },
  {
    id: 'twitter_x',
    name: 'X (Twitter)',
    packageName: 'com.twitter.android',
    iconName: 'MessageSquare',
    category: 'social',
    isProtected: false,
    pauseCount: 5,
    urgentAccessCount: 0,
  },
];

export const INITIAL_STATS: DigitalDisciplineStats = {
  streakDays: 7,
  totalPausesCompleted: 48,
  todayPausesCompleted: 2,
  urgentAccessesToday: 0,
  lastPauseDate: new Date().toISOString().split('T')[0],
  temporaryAccessUntil: null,
};

export class StorageService {
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed reading settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving settings to storage', e);
    }
  }

  static getDisciplineStats(): DigitalDisciplineStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const today = new Date().toISOString().split('T')[0];
        // Reset daily stats if date changed
        if (parsed.lastPauseDate !== today) {
          return {
            ...parsed,
            todayPausesCompleted: 0,
            urgentAccessesToday: 0,
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed reading stats', e);
    }
    return INITIAL_STATS;
  }

  static saveDisciplineStats(stats: DigitalDisciplineStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed saving stats', e);
    }
  }

  static recordCompletedPause(): DigitalDisciplineStats {
    const stats = this.getDisciplineStats();
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = stats.lastPauseDate !== today;

    const newStats: DigitalDisciplineStats = {
      ...stats,
      totalPausesCompleted: stats.totalPausesCompleted + 1,
      todayPausesCompleted: (isNewDay ? 0 : stats.todayPausesCompleted) + 1,
      streakDays: isNewDay ? stats.streakDays + 1 : stats.streakDays,
      lastPauseDate: today,
    };
    this.saveDisciplineStats(newStats);
    return newStats;
  }

  static recordUrgentAccess(): DigitalDisciplineStats {
    const stats = this.getDisciplineStats();
    const newStats: DigitalDisciplineStats = {
      ...stats,
      urgentAccessesToday: stats.urgentAccessesToday + 1,
    };
    this.saveDisciplineStats(newStats);
    return newStats;
  }

  static getProtectedApps(): ProtectedApp[] {
    try {
      const data = localStorage.getItem(PROTECTED_APPS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading protected apps', e);
    }
    return INITIAL_PROTECTED_APPS;
  }

  static saveProtectedApps(apps: ProtectedApp[]): void {
    try {
      localStorage.setItem(PROTECTED_APPS_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed saving protected apps', e);
    }
  }

  static getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading bookmarks', e);
    }
    return [];
  }

  static toggleBookmark(item: Omit<BookmarkItem, 'addedAt'>): BookmarkItem[] {
    const current = this.getBookmarks();
    const existsIndex = current.findIndex((b) => b.id === item.id);
    let updated: BookmarkItem[];
    if (existsIndex >= 0) {
      updated = current.filter((b) => b.id !== item.id);
    } else {
      updated = [...current, { ...item, addedAt: new Date().toISOString() }];
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving bookmark', e);
    }
    return updated;
  }

  static getFastingLogs(): FastingLog[] {
    try {
      const data = localStorage.getItem(FASTING_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading fasting logs', e);
    }
    return [];
  }

  static logFast(entry: FastingLog): FastingLog[] {
    const logs = this.getFastingLogs();
    const existing = logs.findIndex((l) => l.date === entry.date);
    let updated: FastingLog[];
    if (existing >= 0) {
      updated = [...logs];
      updated[existing] = entry;
    } else {
      updated = [...logs, entry];
    }
    try {
      localStorage.setItem(FASTING_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving fasting log', e);
    }
    return updated;
  }

  static getDhikrHistory(): Record<string, number> {
    try {
      const data = localStorage.getItem('deenfirst_dhikr_history');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading dhikr history', e);
    }
    // Seed sensible initial baseline if empty
    const today = new Date().toISOString().split('T')[0];
    const initial: Record<string, number> = {
      [today]: 99,
    };
    return initial;
  }

  static getDhikrStats(): { daily: number; weekly: number; lifetime: number; history: Record<string, number> } {
    const history = this.getDhikrHistory();
    const today = new Date().toISOString().split('T')[0];
    const daily = history[today] || 0;

    // Calculate past 7 days
    let weekly = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      weekly += history[dStr] || 0;
    }

    // Lifetime
    const lifetime = Object.values(history).reduce((acc, val) => acc + val, 0);

    return { daily, weekly, lifetime, history };
  }

  static recordDhikrIncrement(count: number = 1): { daily: number; weekly: number; lifetime: number; history: Record<string, number> } {
    const history = this.getDhikrHistory();
    const today = new Date().toISOString().split('T')[0];
    history[today] = (history[today] || 0) + count;

    try {
      localStorage.setItem('deenfirst_dhikr_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed saving dhikr history', e);
    }

    return this.getDhikrStats();
  }
}
