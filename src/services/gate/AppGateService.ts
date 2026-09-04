import { ProtectedApp, DigitalDisciplineStats } from '../../types';
import { StorageService } from '../storageService';

export interface UnlockRequestResult {
  granted: boolean;
  reason?: 'pause_completed' | 'urgent_access' | 'temporary_pass_active';
  expiresAt?: string;
}

export interface IAppGateService {
  isSupported(): boolean;
  getImplementationType(): 'pwa_browser_simulated' | 'native_android_accessibility';
  getProtectedApps(): Promise<ProtectedApp[]>;
  setProtectedApps(apps: ProtectedApp[]): Promise<void>;
  requestUnlock(appId: string, type: 'complete_pause' | 'urgent'): Promise<UnlockRequestResult>;
  grantTemporaryAccess(minutes: number): Promise<void>;
  detectAttemptedApp(packageName: string): Promise<ProtectedApp | null>;
  getUsageStatus(): Promise<DigitalDisciplineStats>;
  isTemporaryAccessActive(): boolean;
  getRemainingTemporaryAccessMinutes(): number;
}

/**
 * Browser implementation (PWA Layer A):
 * Provides simulated demo gate, web-based digital discipline tracking,
 * and seamless UI testing for users to experience the spiritual pause.
 * Note: PWAs within browser sandboxes cannot intercept arbitrary external Android app launches.
 */
export class BrowserAppGateService implements IAppGateService {
  isSupported(): boolean {
    return true;
  }

  getImplementationType(): 'pwa_browser_simulated' {
    return 'pwa_browser_simulated';
  }

  async getProtectedApps(): Promise<ProtectedApp[]> {
    return StorageService.getProtectedApps();
  }

  async setProtectedApps(apps: ProtectedApp[]): Promise<void> {
    StorageService.saveProtectedApps(apps);
  }

  async requestUnlock(appId: string, type: 'complete_pause' | 'urgent'): Promise<UnlockRequestResult> {
    const apps = StorageService.getProtectedApps();
    const targetApp = apps.find((a) => a.id === appId);

    if (type === 'complete_pause') {
      StorageService.recordCompletedPause();
      if (targetApp) {
        targetApp.pauseCount += 1;
        targetApp.lastIntercepted = new Date().toISOString();
        StorageService.saveProtectedApps(apps);
      }
      return {
        granted: true,
        reason: 'pause_completed',
      };
    } else {
      StorageService.recordUrgentAccess();
      if (targetApp) {
        targetApp.urgentAccessCount += 1;
        targetApp.lastIntercepted = new Date().toISOString();
        StorageService.saveProtectedApps(apps);
      }
      return {
        granted: true,
        reason: 'urgent_access',
      };
    }
  }

  async grantTemporaryAccess(minutes: number): Promise<void> {
    const stats = StorageService.getDisciplineStats();
    const expires = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    stats.temporaryAccessUntil = expires;
    StorageService.saveDisciplineStats(stats);
  }

  isTemporaryAccessActive(): boolean {
    const stats = StorageService.getDisciplineStats();
    if (!stats.temporaryAccessUntil) return false;
    return new Date(stats.temporaryAccessUntil).getTime() > Date.now();
  }

  getRemainingTemporaryAccessMinutes(): number {
    const stats = StorageService.getDisciplineStats();
    if (!stats.temporaryAccessUntil) return 0;
    const diff = new Date(stats.temporaryAccessUntil).getTime() - Date.now();
    return diff > 0 ? Math.ceil(diff / (60 * 1000)) : 0;
  }

  async detectAttemptedApp(packageName: string): Promise<ProtectedApp | null> {
    const apps = await this.getProtectedApps();
    const match = apps.find((a) => a.packageName === packageName && a.isProtected);
    return match || null;
  }

  async getUsageStatus(): Promise<DigitalDisciplineStats> {
    return StorageService.getDisciplineStats();
  }
}

/**
 * Future Android Native implementation (Layer B - Capacitor / Native Plugin):
 * Outlines the exact native bridge contracts for Android AccessibilityService,
 * UsageStatsManager, and OverlayWindow (TYPE_APPLICATION_OVERLAY) for production Android wrapper.
 */
export class NativeAppGateService implements IAppGateService {
  isSupported(): boolean {
    // In future Capacitor / Cordova native build: return !!(window as any).Capacitor?.isNativePlatform();
    return typeof (window as any).DeenFirstNativeGate !== 'undefined';
  }

  getImplementationType(): 'native_android_accessibility' {
    return 'native_android_accessibility';
  }

  async getProtectedApps(): Promise<ProtectedApp[]> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.getProtectedApps();
    }
    return StorageService.getProtectedApps();
  }

  async setProtectedApps(apps: ProtectedApp[]): Promise<void> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.setProtectedApps(apps);
    }
    StorageService.saveProtectedApps(apps);
  }

  async requestUnlock(appId: string, type: 'complete_pause' | 'urgent'): Promise<UnlockRequestResult> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.requestUnlock(appId, type);
    }
    const fallback = new BrowserAppGateService();
    return fallback.requestUnlock(appId, type);
  }

  async grantTemporaryAccess(minutes: number): Promise<void> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.grantTemporaryAccess(minutes);
    }
    const fallback = new BrowserAppGateService();
    return fallback.grantTemporaryAccess(minutes);
  }

  isTemporaryAccessActive(): boolean {
    const fallback = new BrowserAppGateService();
    return fallback.isTemporaryAccessActive();
  }

  getRemainingTemporaryAccessMinutes(): number {
    const fallback = new BrowserAppGateService();
    return fallback.getRemainingTemporaryAccessMinutes();
  }

  async detectAttemptedApp(packageName: string): Promise<ProtectedApp | null> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.detectAttemptedApp(packageName);
    }
    const fallback = new BrowserAppGateService();
    return fallback.detectAttemptedApp(packageName);
  }

  async getUsageStatus(): Promise<DigitalDisciplineStats> {
    if (this.isSupported()) {
      return (window as any).DeenFirstNativeGate.getUsageStatus();
    }
    return StorageService.getDisciplineStats();
  }
}

// Export singleton instance defaulting to BrowserAppGateService for PWA runtime
export const AppGate = new BrowserAppGateService();
