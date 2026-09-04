import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Flame,
  Info,
  Smartphone,
  Plus,
} from 'lucide-react';
import { ProtectedApp, DigitalDisciplineStats, LanguageCode } from '../types';
import { AppGate } from '../services/gate/AppGateService';
import { StorageService } from '../services/storageService';

interface DigitalDisciplineViewProps {
  lang: LanguageCode;
  onLaunchTestGate: (app?: ProtectedApp) => void;
}

export const DigitalDisciplineView: React.FC<DigitalDisciplineViewProps> = ({
  lang,
  onLaunchTestGate,
}) => {
  const [apps, setApps] = useState<ProtectedApp[]>([]);
  const [stats, setStats] = useState<DigitalDisciplineStats>(StorageService.getDisciplineStats());
  const [tempMinutesRemaining, setTempMinutesRemaining] = useState<number>(
    AppGate.getRemainingTemporaryAccessMinutes()
  );

  useEffect(() => {
    AppGate.getProtectedApps().then(setApps);
    const interval = setInterval(() => {
      setTempMinutesRemaining(AppGate.getRemainingTemporaryAccessMinutes());
      setStats(StorageService.getDisciplineStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleAppProtection = async (appId: string) => {
    const updated = apps.map((a) =>
      a.id === appId ? { ...a, isProtected: !a.isProtected } : a
    );
    setApps(updated);
    await AppGate.setProtectedApps(updated);
  };

  const handleGrantTempAccess = async (minutes: number) => {
    await AppGate.grantTemporaryAccess(minutes);
    setTempMinutesRemaining(minutes);
    setStats(StorageService.getDisciplineStats());
  };

  return (
    <div id="deenfirst_digital_discipline_view" className="space-y-6 animate-fade-in pb-20">
      {/* Hero Stats Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#082920] to-[#041611] border border-emerald-500/30 p-6 text-stone-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Spiritual Discipline</span>
          </div>
          <span className="text-[11px] bg-emerald-400/10 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/20 font-medium">
            Active Journey
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Streak
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {stats.streakDays}
            </span>
            <span className="text-[10px] text-stone-400 block">days</span>
          </div>

          <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Today
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {stats.todayPausesCompleted}
            </span>
            <span className="text-[10px] text-stone-400 block">pauses</span>
          </div>

          <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Lifetime
            </span>
            <span className="text-2xl font-extrabold font-mono text-stone-100">
              {stats.totalPausesCompleted}
            </span>
            <span className="text-[10px] text-stone-400 block">remembrances</span>
          </div>
        </div>

        {/* Temporary Pass Status */}
        {tempMinutesRemaining > 0 && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Temporary pass active</span>
            </span>
            <span className="font-mono font-bold">
              {tempMinutesRemaining} mins remaining
            </span>
          </div>
        )}
      </div>

      {/* Interactive Test Pause CTA */}
      <div className="bg-[#071d17] border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <h4 className="text-sm font-semibold text-stone-100">
            Practice a Spiritual Pause Now
          </h4>
          <p className="text-xs text-stone-400 mt-0.5">
            Experience the 20-second remembrance gate
          </p>
        </div>
        <button
          onClick={() => onLaunchTestGate(apps[0] || null)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition active:scale-95 shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Test Gate</span>
        </button>
      </div>

      {/* Protected Apps List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Configured Digital Apps</span>
          </h3>
          <span className="text-xs text-stone-400">
            {apps.filter((a) => a.isProtected).length} Protected
          </span>
        </div>

        <div className="space-y-2">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#071d17] border border-emerald-500/15 hover:border-emerald-500/30 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    app.isProtected
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-100">
                    {app.name}
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    {app.pauseCount} pauses taken • {app.urgentAccessCount} quick passes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLaunchTestGate(app)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-400 hover:bg-white/5 transition text-xs"
                  title="Test gate for this app"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleAppProtection(app.id)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                    app.isProtected ? 'bg-emerald-500' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      app.isProtected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temporary Access Pass Granting */}
      <div className="bg-[#071d17] rounded-2xl p-5 border border-emerald-500/20 space-y-3">
        <h4 className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Grant Temporary Work / Focus Pass</span>
        </h4>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          Temporarily bypass spiritual pause gates during active work meetings or urgent study tasks:
        </p>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {[5, 15, 30, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleGrantTempAccess(mins)}
              className="p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-emerald-400/40 text-xs font-mono font-medium text-stone-200 hover:text-emerald-300 transition text-center"
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Honest Architecture Disclosure (Layer A vs Layer B) */}
      <div className="bg-black/25 rounded-2xl p-4 border border-white/5 space-y-2 text-left">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>PWA & Native Interception Architecture</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          In web browser PWA mode, DeenFirst provides self-guided spiritual pauses, mindfulness trackers, and demo gates. Full system-wide app interception across Android requires the companion native bridge module (utilizing Android AccessibilityService & UsageStatsManager), which is pre-architected in DeenFirst’s codebase.
        </p>
      </div>
    </div>
  );
};
