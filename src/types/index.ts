export type LanguageCode = 
  | 'en' // English
  | 'ar' // العربية
  | 'ur' // اردو
  | 'hi' // हिन्दी
  | 'bn' // বাংলা
  | 'id' // Bahasa Indonesia
  | 'tr' // Türkçe
  | 'gu' // ગુજરાતી
  | 'mr' // मराठी
  | 'ta'; // தமிழ்

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export type NavigationTab = 'home' | 'quran' | 'dhikr' | 'prayer' | 'profile' | 'discipline' | 'duas' | 'hadith' | 'qibla' | 'bookmarks' | 'calendar';

export interface QuranSurah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  englishNameTranslation?: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juzStart: number;
}

export type SurahMeta = QuranSurah;

export interface QuranVerse {
  id: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  arabic: string;
  transliteration?: string;
  translation: string;
  translations?: Record<string, string>;
  audioUrl?: string;
  source: string;
  translationSource: string;
}

export interface DhikrItem {
  id: string;
  category: 'morning' | 'evening' | 'after_salah' | 'sleep' | 'protection' | 'gratitude' | 'repentance' | 'peace' | 'ramadan' | 'friday' | 'general';
  arabic: string;
  transliteration: string;
  translation: string;
  recommendedCount: number;
  benefit?: string;
  sourceReference?: string;
  audioUrl?: string;
}

export interface DuaItem {
  id: string;
  category: 'morning' | 'evening' | 'travel' | 'food' | 'sleep' | 'parents' | 'forgiveness' | 'protection' | 'knowledge' | 'anxiety' | 'gratitude' | 'rain' | 'illness' | 'ramadan' | 'hajj' | 'marriage' | 'family' | 'daily' | 'quranic';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  audioUrl?: string;
  benefit?: string;
  repeatCount?: number;
  isFavorite?: boolean;
}

export interface HadithItem {
  id: string;
  category: 'faith' | 'character' | 'patience' | 'charity' | 'family' | 'knowledge' | 'mercy' | 'prayer' | 'fasting' | 'gratitude' | 'deeds' | 'remembrance';
  arabic?: string;
  translation: string;
  transliteration?: string;
  narrator?: string;
  collection: string;
  book: string;
  hadithNumber: string;
  grade?: string;
  source: string;
  keyLesson?: string;
  isFavorite?: boolean;
}

export interface SeerahTopic {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  content: string[];
  category: 'prophets' | 'seerah' | 'companions' | 'manners';
}

export interface IslamicEvent {
  id: string;
  name: string;
  hijriDay: number;
  hijriMonth: number; // 1-12
  monthName: string;
  description: string;
  observanceNote?: string;
  category?: 'ramadan' | 'eid' | 'fasting' | 'blessed_night' | 'jumuah' | 'sacred_month' | 'holiday';
  estimatedGregorian?: string;
  daysRemaining?: number;
  sunnahActs?: string[];
  arabicName?: string;
}

export interface PrayerNotificationSettings {
  enabled: boolean;
  soundMode: 'adhan' | 'chime' | 'silent';
  reminderTiming: 0 | 5 | 10 | 15; // minutes before prayer (0 = exact time)
  fajr: boolean;
  sunrise: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  jumuah: boolean;
}

export interface ProtectedApp {
  id: string;
  name: string;
  packageName: string;
  iconName: string;
  category: 'social' | 'entertainment' | 'short_video' | 'gaming' | 'browsing';
  isProtected: boolean;
  pauseCount: number;
  urgentAccessCount: number;
  goBackCount?: number;
  lastIntercepted?: string;
}

export type GateMode = 'gentle' | 'balanced' | 'deep' | 'scheduled' | 'focus';
export type CooldownDuration = 1 | 5 | 15 | 30 | 60; // minutes

export interface GateLogEntry {
  id: string;
  timestamp: string;
  appId: string;
  appName: string;
  action: 'completed_pause' | 'go_back' | 'emergency_bypass' | 'salah_prepare';
  level: 1 | 2 | 3 | 4;
  durationSeconds: number;
  dhikrCount?: number;
  intention?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface FocusSession {
  isActive: boolean;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  targetAppIds?: string[];
  pausesCompleted: number;
  goBacksTriggered: number;
}

export interface DigitalDisciplineStats {
  streakDays: number;
  totalPausesCompleted: number;
  todayPausesCompleted: number;
  urgentAccessesToday: number;
  goBacksToday: number;
  totalGoBacks: number;
  lastPauseDate?: string;
  temporaryAccessUntil?: string | null;
  disciplineScore: number; // 0-100 calculated score
  gateDhikrTotal: number;
  voluntaryDhikrTotal: number;
  activeFocusSession?: FocusSession | null;
  recentLogs?: GateLogEntry[];
}

export interface GateSettings {
  mode: GateMode;
  cooldownMinutes: CooldownDuration;
  salahFirstEnabled: boolean;
  adaptiveIntensityEnabled: boolean;
  hapticTactileEnabled: boolean;
  defaultIntentionRequired: boolean;
}

export interface AppSettings {
  appLanguage: LanguageCode;
  quranLanguage: LanguageCode;
  duaLanguage: LanguageCode;
  theme: 'dark' | 'light' | 'system';
  arabicFontSize: 'small' | 'medium' | 'large' | 'xlarge';
  translationFontSize: 'small' | 'medium' | 'large' | 'xlarge';
  showTransliteration: boolean;
  calculationMethod: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran';
  asrMethod: 'Shafi' | 'Hanafi';
  highLatitudeRule: 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'TwilightAngle';
  manualOffsetMinutes: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  locationCity: string;
  latitude: number;
  longitude: number;
  ramadanModeActive: boolean;
  hapticFeedbackEnabled: boolean;
  soundEffectsEnabled: boolean;
  dailyReminderTime: string;
  hasCompletedOnboarding: boolean;
  prayerNotifications?: PrayerNotificationSettings;
  gateSettings?: GateSettings;
}

export interface RabbanaDua {
  id: number;
  surahNumber: number;
  surahName: string;
  ayahNumber: number | string;
  arabic: string;
  transliteration: string;
  translation: string;
  significance: string;
}

export interface AllahName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
  foundInQuran?: string;
}

export interface JuzInfo {
  juzNumber: number;
  nameArabic: string;
  nameTransliteration: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyahNumber: number;
  endSurahNumber: number;
  endSurahName: string;
  endAyahNumber: number;
}

export interface FastingLog {
  date: string; // YYYY-MM-DD
  status: 'completed' | 'missed' | 'optional';
  notes?: string;
}

export interface BookmarkItem {
  id: string;
  type: 'quran' | 'ayah' | 'dua' | 'dhikr' | 'hadith';
  title: string;
  subtitle?: string;
  content?: string;
  arabic?: string;
  referenceId?: string;
  addedAt: string;
}
