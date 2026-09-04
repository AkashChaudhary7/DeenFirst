import { AppSettings, PrayerNotificationSettings } from '../types';
import { CalculatedPrayers, PrayerService } from './prayerService';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  prayerName?: string;
  timeFormatted: string;
  type: 'prayer_alert' | 'jumuah_reminder' | 'test_alert';
  timestamp: number;
}

type NotificationListener = (notification: InAppNotification) => void;

class NotificationManager {
  private listeners: Set<NotificationListener> = new Set();
  private notifiedTracker: Set<string> = new Set(); // prayer_date_key to prevent duplicate triggers
  private audioContext: AudioContext | null = null;

  // Check if browser notifications are supported
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission status
  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  // Request browser notification permission
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // Subscribe to in-app notification alerts
  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Synthesize pleasant prayer chime or gentle bell tones using Web Audio API
  public playAlertSound(mode: 'adhan' | 'chime' | 'silent' = 'chime') {
    if (mode === 'silent') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext || this.audioContext.state === 'suspended') {
        this.audioContext = new AudioCtx();
      }
      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (mode === 'adhan') {
        // Melodic 4-note ascending chord representing gentle Adhan opening notes (C4, E4, G4, C5)
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.4);

          gain.gain.setValueAtTime(0, now + index * 0.4);
          gain.gain.linearRampToValueAtTime(0.25, now + index * 0.4 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.4 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + index * 0.4);
          osc.stop(now + index * 0.4 + 1.3);
        });
      } else {
        // Gentle 2-tone chime (E5, B5)
        const tones = [659.25, 987.77];
        tones.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + index * 0.25);

          gain.gain.setValueAtTime(0, now + index * 0.25);
          gain.gain.linearRampToValueAtTime(0.2, now + index * 0.25 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.25 + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + index * 0.25);
          osc.stop(now + index * 0.25 + 1.0);
        });
      }
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // Trigger notification both natively and in-app
  public dispatchNotification(payload: {
    title: string;
    message: string;
    prayerName?: string;
    timeFormatted: string;
    type?: 'prayer_alert' | 'jumuah_reminder' | 'test_alert';
    soundMode?: 'adhan' | 'chime' | 'silent';
  }) {
    const {
      title,
      message,
      prayerName,
      timeFormatted,
      type = 'prayer_alert',
      soundMode = 'chime',
    } = payload;

    // 1. Play sound
    this.playAlertSound(soundMode);

    // 2. Trigger haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // 3. Emit in-app banner toast
    const inAppPayload: InAppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      prayerName,
      timeFormatted,
      type,
      timestamp: Date.now(),
    };
    this.listeners.forEach((listener) => listener(inAppPayload));

    // 4. Send native browser notification if granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: prayerName || 'deenfirst_prayer_alert',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch {
        // Handle mobile notification constraints
      }
    }
  }

  // Background prayer check loop (checks if any prayer is approaching or has arrived)
  public checkPrayerTimes(settings: AppSettings, prayers: CalculatedPrayers) {
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

    if (!notifSettings.enabled) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const reminderOffsetMs = (notifSettings.reminderTiming || 0) * 60 * 1000;

    const prayerList: Array<{
      key: keyof Omit<PrayerNotificationSettings, 'enabled' | 'soundMode' | 'reminderTiming'>;
      name: string;
      time: Date;
    }> = [
      { key: 'fajr', name: 'Fajr (Dawn Prayer)', time: prayers.fajr },
      { key: 'sunrise', name: 'Sunrise (Shurooq)', time: prayers.sunrise },
      { key: 'dhuhr', name: now.getDay() === 5 ? 'Jumu\'ah / Dhuhr Prayer' : 'Dhuhr (Noon Prayer)', time: prayers.dhuhr },
      { key: 'asr', name: 'Asr (Afternoon Prayer)', time: prayers.asr },
      { key: 'maghrib', name: 'Maghrib (Sunset Prayer)', time: prayers.maghrib },
      { key: 'isha', name: 'Isha (Night Prayer)', time: prayers.isha },
    ];

    prayerList.forEach((prayer) => {
      // Check if this prayer alert is enabled
      const isEnabled = notifSettings[prayer.key];
      if (!isEnabled) return;

      const triggerTime = new Date(prayer.time.getTime() - reminderOffsetMs);
      const diffMs = now.getTime() - triggerTime.getTime();

      // Trigger if we are within a 45-second window of the trigger time
      if (diffMs >= 0 && diffMs < 45000) {
        const trackerKey = `${todayStr}_${prayer.key}_${notifSettings.reminderTiming}`;
        if (!this.notifiedTracker.has(trackerKey)) {
          this.notifiedTracker.add(trackerKey);

          const timeFormatted = PrayerService.formatTime(prayer.time);
          const isAdvance = notifSettings.reminderTiming > 0;

          const title = isAdvance
            ? `⏳ ${prayer.name} in ${notifSettings.reminderTiming} minutes`
            : `🕌 Time for ${prayer.name}`;

          const message = isAdvance
            ? `${prayer.name} begins at ${timeFormatted}. Prepare for Wudu and Salah.`
            : `Hayya 'ala as-Salah. ${prayer.name} time has entered (${timeFormatted}).`;

          this.dispatchNotification({
            title,
            message,
            prayerName: prayer.name,
            timeFormatted,
            type: prayer.key === 'dhuhr' && now.getDay() === 5 ? 'jumuah_reminder' : 'prayer_alert',
            soundMode: notifSettings.soundMode,
          });
        }
      }
    });

    // Special Friday Morning Jumu'ah reminder (e.g. Friday at 10:00 AM)
    if (notifSettings.jumuah && now.getDay() === 5) {
      const jumuahFridayKey = `${todayStr}_jumuah_morning`;
      if (now.getHours() === 10 && now.getMinutes() === 0 && !this.notifiedTracker.has(jumuahFridayKey)) {
        this.notifiedTracker.add(jumuahFridayKey);
        this.dispatchNotification({
          title: '✨ Jumu\'ah Mubarak!',
          message: 'Don\'t forget Surah Al-Kahf recitation, Ghusl, and making Dua during the hour of acceptance.',
          timeFormatted: 'Today',
          type: 'jumuah_reminder',
          soundMode: notifSettings.soundMode,
        });
      }
    }
  }

  // Trigger instant test notification
  public testNotification(settings: AppSettings, prayerName: string = 'Asr') {
    const notifSettings = settings.prayerNotifications || {
      enabled: true,
      soundMode: 'chime' as const,
      reminderTiming: 0 as const,
      fajr: true,
      sunrise: false,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
      jumuah: true,
    };

    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.dispatchNotification({
      title: `🔔 Test Alert: ${prayerName} Prayer`,
      message: `Sound Mode: ${notifSettings.soundMode.toUpperCase()} • Notification service is active and working properly.`,
      prayerName,
      timeFormatted,
      type: 'test_alert',
      soundMode: notifSettings.soundMode,
    });
  }
}

export const NotificationService = new NotificationManager();
