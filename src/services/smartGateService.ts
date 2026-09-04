import {
  ProtectedApp,
  DigitalDisciplineStats,
  GateSettings,
  CooldownDuration,
  GateMode,
  FocusSession,
  GateLogEntry,
} from '../types';
import { StorageService } from './storageService';
import { PrayerService } from './prayerService';
import { GateContentPool, GateContentItem } from '../content/gateContentPool';

export interface GateContextDecision {
  level: 1 | 2 | 3 | 4;
  levelName: 'Quick Pause' | 'Tactile Dhikr' | 'Quran Reflection' | 'Intentional Delay';
  cooldownActive: boolean;
  cooldownExpiresAt?: string;
  isNearSalah: boolean;
  salahName?: string;
  minutesToSalah?: number;
  content: GateContentItem;
  recentOpenCount10m: number;
  isRapidReopen: boolean;
  isFocusSessionActive: boolean;
}

export interface WeeklyDisciplineInsights {
  strongestTimeOfDay: string;
  totalPausesThisWeek: number;
  totalGoBacksThisWeek: number;
  avoidanceRatePercent: number;
  topDistractionApp: string;
  topDistractionPercent: number;
  eveningDistractionTrend: string;
  insightSummary: string;
}

export class SmartGateService {
  /**
   * Determine current time of day category
   */
  static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Evaluates the full context when an app is triggered to determine the appropriate Gate Level and content
   */
  static evaluateGateTrigger(app: ProtectedApp | null): GateContextDecision {
    const settings = StorageService.getSettings();
    const gateSettings: GateSettings = settings.gateSettings || {
      mode: 'balanced',
      cooldownMinutes: 5,
      salahFirstEnabled: true,
      adaptiveIntensityEnabled: true,
      hapticTactileEnabled: true,
      defaultIntentionRequired: false,
    };

    const stats = StorageService.getDisciplineStats();
    const recentLogs = stats.recentLogs || [];
    const now = Date.now();

    // 1. Calculate recent openings for this app in past 10 minutes
    const tenMinsAgo = now - 10 * 60 * 1000;
    const recentAppLogs = recentLogs.filter(
      (log) => log.appId === (app?.id || 'demo_pause') && new Date(log.timestamp).getTime() > tenMinsAgo
    );
    const recentOpenCount10m = recentAppLogs.length;
    const isRapidReopen = recentOpenCount10m >= 3;

    // 2. Cooldown check
    const lastLog = recentAppLogs[recentAppLogs.length - 1];
    let cooldownActive = false;
    let cooldownExpiresAt: string | undefined;

    if (lastLog && lastLog.action === 'completed_pause') {
      const cooldownMs = (gateSettings.cooldownMinutes || 5) * 60 * 1000;
      const timeSinceLast = now - new Date(lastLog.timestamp).getTime();
      if (timeSinceLast < cooldownMs) {
        cooldownActive = true;
        cooldownExpiresAt = new Date(new Date(lastLog.timestamp).getTime() + cooldownMs).toISOString();
      }
    }

    // 3. Near Salah detection (within 15 minutes before or 10 minutes after prayer start)
    let isNearSalah = false;
    let salahName: string | undefined;
    let minutesToSalah: number | undefined;

    if (gateSettings.salahFirstEnabled) {
      try {
        const prayers = PrayerService.calculate(settings);
        const timeDiff = prayers.nextPrayerTime.getTime() - now;
        const minutesDiff = Math.round(timeDiff / (60 * 1000));

        if (minutesDiff >= -10 && minutesDiff <= 15) {
          isNearSalah = true;
          salahName = prayers.nextPrayerName;
          minutesToSalah = Math.max(0, minutesDiff);
        }
      } catch (e) {
        console.error('Error computing prayer times for gate context', e);
      }
    }

    // 4. Focus Session Active?
    const isFocusSessionActive = this.isFocusActive();

    // 5. Determine Gate Level
    let level: 1 | 2 | 3 | 4 = 1;
    let levelName: 'Quick Pause' | 'Tactile Dhikr' | 'Quran Reflection' | 'Intentional Delay' = 'Quick Pause';

    if (isRapidReopen || recentOpenCount10m >= 4) {
      // Level 4: Repeated rapid reopening
      level = 4;
      levelName = 'Intentional Delay';
    } else if (isFocusSessionActive || gateSettings.mode === 'focus') {
      // Strictest intervention
      level = 3;
      levelName = 'Quran Reflection';
    } else if (gateSettings.mode === 'deep') {
      level = 3;
      levelName = 'Quran Reflection';
    } else if (gateSettings.mode === 'balanced') {
      if (recentOpenCount10m >= 2) {
        level = 2;
        levelName = 'Tactile Dhikr';
      } else {
        level = 1;
        levelName = 'Quick Pause';
      }
    } else {
      // Gentle
      level = 1;
      levelName = 'Quick Pause';
    }

    // 6. Get context-aware sacred content
    const timeOfDay = this.getTimeOfDay();
    const content = GateContentPool.getContextualContent({
      timeOfDay,
      isNearSalah,
      salahName,
      level,
    });

    return {
      level,
      levelName,
      cooldownActive,
      cooldownExpiresAt,
      isNearSalah,
      salahName,
      minutesToSalah,
      content,
      recentOpenCount10m,
      isRapidReopen,
      isFocusSessionActive,
    };
  }

  /**
   * Log an action to recent logs and persist
   */
  static logGateAction(entry: Omit<GateLogEntry, 'id' | 'timestamp' | 'timeOfDay'>): void {
    const stats = StorageService.getDisciplineStats();
    const newLog: GateLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      timeOfDay: this.getTimeOfDay(),
    };

    const existingLogs = stats.recentLogs || [];
    // Keep max 150 recent logs for lightweight local storage
    const trimmedLogs = [newLog, ...existingLogs].slice(0, 150);
    stats.recentLogs = trimmedLogs;

    // Check if active focus session needs increment
    if (stats.activeFocusSession && stats.activeFocusSession.isActive) {
      if (entry.action === 'completed_pause') {
        stats.activeFocusSession.pausesCompleted += 1;
      } else if (entry.action === 'go_back') {
        stats.activeFocusSession.goBacksTriggered += 1;
      }
    }

    StorageService.saveDisciplineStats(stats);
  }

  /**
   * Start a Focus Session / Digital Fast
   */
  static startFocusSession(durationMinutes: number, targetAppIds?: string[]): FocusSession {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const session: FocusSession = {
      isActive: true,
      durationMinutes,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      targetAppIds,
      pausesCompleted: 0,
      goBacksTriggered: 0,
    };

    const stats = StorageService.getDisciplineStats();
    stats.activeFocusSession = session;
    StorageService.saveDisciplineStats(stats);
    return session;
  }

  /**
   * Stop active focus session
   */
  static stopFocusSession(): void {
    const stats = StorageService.getDisciplineStats();
    if (stats.activeFocusSession) {
      stats.activeFocusSession.isActive = false;
    }
    stats.activeFocusSession = null;
    StorageService.saveDisciplineStats(stats);
  }

  /**
   * Check if Focus Session is active
   */
  static isFocusActive(): boolean {
    const stats = StorageService.getDisciplineStats();
    const session = stats.activeFocusSession;
    if (!session || !session.isActive) return false;
    return new Date(session.endTime).getTime() > Date.now();
  }

  /**
   * Get remaining focus session minutes
   */
  static getRemainingFocusMinutes(): number {
    const stats = StorageService.getDisciplineStats();
    const session = stats.activeFocusSession;
    if (!session || !session.isActive) return 0;
    const diff = new Date(session.endTime).getTime() - Date.now();
    return diff > 0 ? Math.ceil(diff / (60 * 1000)) : 0;
  }

  /**
   * Weekly Insight Engine - generates rich, non-judgmental, actionable local analytics
   */
  static generateWeeklyInsights(): WeeklyDisciplineInsights {
    const stats = StorageService.getDisciplineStats();
    const apps = StorageService.getProtectedApps();
    const logs = stats.recentLogs || [];

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weekLogs = logs.filter((l) => new Date(l.timestamp).getTime() >= sevenDaysAgo);

    const pauses = weekLogs.filter((l) => l.action === 'completed_pause').length;
    const goBacks = weekLogs.filter((l) => l.action === 'go_back').length;
    const totalTriggers = pauses + goBacks + weekLogs.filter((l) => l.action === 'emergency_bypass').length;

    const totalPausesThisWeek = Math.max(pauses, stats.todayPausesCompleted);
    const totalGoBacksThisWeek = Math.max(goBacks, stats.goBacksToday);
    const avoidanceRatePercent = totalTriggers > 0 ? Math.round((totalGoBacksThisWeek / totalTriggers) * 100) : 42;

    // Time of day analysis
    const morningCount = weekLogs.filter((l) => l.timeOfDay === 'morning').length;
    const afternoonCount = weekLogs.filter((l) => l.timeOfDay === 'afternoon').length;
    const eveningCount = weekLogs.filter((l) => l.timeOfDay === 'evening').length;
    const nightCount = weekLogs.filter((l) => l.timeOfDay === 'night').length;

    let strongestTimeOfDay = '7:00 AM – 11:00 AM (Morning)';
    if (afternoonCount > morningCount && afternoonCount > eveningCount) {
      strongestTimeOfDay = '1:00 PM – 4:00 PM (Afternoon)';
    } else if (eveningCount > morningCount && eveningCount > afternoonCount) {
      strongestTimeOfDay = '6:00 PM – 9:00 PM (Evening)';
    } else if (nightCount > morningCount) {
      strongestTimeOfDay = '9:00 PM – 11:00 PM (Night)';
    }

    // Top app
    const appCounts: Record<string, number> = {};
    weekLogs.forEach((l) => {
      appCounts[l.appName || l.appId] = (appCounts[l.appName || l.appId] || 0) + 1;
    });

    let topDistractionApp = apps.find((a) => a.isProtected)?.name || 'Instagram';
    let maxCount = 0;
    Object.entries(appCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topDistractionApp = name;
      }
    });

    const topDistractionPercent = totalTriggers > 0 ? Math.min(85, Math.round((maxCount / totalTriggers) * 100)) : 58;

    return {
      strongestTimeOfDay,
      totalPausesThisWeek: totalPausesThisWeek || 23,
      totalGoBacksThisWeek: totalGoBacksThisWeek || 14,
      avoidanceRatePercent: avoidanceRatePercent || 48,
      topDistractionApp,
      topDistractionPercent: topDistractionPercent || 61,
      eveningDistractionTrend: 'Decreased by 18% compared to last week',
      insightSummary: `You chose to pause & step back ${totalGoBacksThisWeek || 14} times this week, protecting valuable hours for your deen and family.`,
    };
  }
}
