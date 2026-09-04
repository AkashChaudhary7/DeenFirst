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
  RotateCcw,
  Sparkles,
  TrendingUp,
  BarChart3,
  Layers,
  Timer,
  Sliders,
  Check,
} from 'lucide-react';
import { ProtectedApp, DigitalDisciplineStats, LanguageCode, GateMode, CooldownDuration } from '../types';
import { AppGate } from '../services/gate/AppGateService';
import { StorageService } from '../services/storageService';
import { SmartGateService, WeeklyDisciplineInsights } from '../services/smartGateService';

interface DigitalDisciplineViewProps {
  lang: LanguageCode;
  onLaunchTestGate: (app?: ProtectedApp, customLevel?: 1 | 2 | 3 | 4) => void;
}

export const DigitalDisciplineView: React.FC<DigitalDisciplineViewProps> = ({
  lang,
  onLaunchTestGate,
}) => {
  const [apps, setApps] = useState<ProtectedApp[]>([]);
  const [stats, setStats] = useState<DigitalDisciplineStats>(StorageService.getDisciplineStats());
  const [insights, setInsights] = useState<WeeklyDisciplineInsights>(SmartGateService.generateWeeklyInsights());
  const [tempMinutesRemaining, setTempMinutesRemaining] = useState<number>(
    AppGate.getRemainingTemporaryAccessMinutes()
  );
  const [focusRemainingMinutes, setFocusRemainingMinutes] = useState<number>(
    SmartGateService.getRemainingFocusMinutes()
  );
  const [selectedGateMode, setSelectedGateMode] = useState<GateMode>(
    StorageService.getSettings().gateSettings?.mode || 'balanced'
  );
  const [selectedCooldown, setSelectedCooldown] = useState<CooldownDuration>(
    StorageService.getSettings().gateSettings?.cooldownMinutes || 5
  );
  const [activeTab, setActiveTab] = useState<'discipline' | 'modes' | 'insights'>('discipline');

  useEffect(() => {
    AppGate.getProtectedApps().then(setApps);
    const interval = setInterval(() => {
      setTempMinutesRemaining(AppGate.getRemainingTemporaryAccessMinutes());
      setFocusRemainingMinutes(SmartGateService.getRemainingFocusMinutes());
      setStats(StorageService.getDisciplineStats());
      setInsights(SmartGateService.generateWeeklyInsights());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleAppProtection = async (appId: string) => {
    const updated = apps.map((a) => (a.id === appId ? { ...a, isProtected: !a.isProtected } : a));
    setApps(updated);
    await AppGate.setProtectedApps(updated);
  };

  const handleGrantTempAccess = async (minutes: number) => {
    await AppGate.grantTemporaryAccess(minutes);
    setTempMinutesRemaining(minutes);
    setStats(StorageService.getDisciplineStats());
  };

  const handleStartFocusSession = (minutes: number) => {
    SmartGateService.startFocusSession(minutes);
    setFocusRemainingMinutes(minutes);
    setStats(StorageService.getDisciplineStats());
  };

  const handleStopFocusSession = () => {
    SmartGateService.stopFocusSession();
    setFocusRemainingMinutes(0);
    setStats(StorageService.getDisciplineStats());
  };

  const handleUpdateGateMode = (mode: GateMode) => {
    setSelectedGateMode(mode);
    const currentSettings = StorageService.getSettings();
    const updatedGate = {
      ...(currentSettings.gateSettings || {
        mode: 'balanced',
        cooldownMinutes: 5 as CooldownDuration,
        salahFirstEnabled: true,
        adaptiveIntensityEnabled: true,
        hapticTactileEnabled: true,
        defaultIntentionRequired: false,
      }),
      mode,
    };
    StorageService.saveSettings({ ...currentSettings, gateSettings: updatedGate });
  };

  const handleUpdateCooldown = (cooldownMinutes: CooldownDuration) => {
    setSelectedCooldown(cooldownMinutes);
    const currentSettings = StorageService.getSettings();
    const updatedGate = {
      ...(currentSettings.gateSettings || {
        mode: 'balanced' as GateMode,
        cooldownMinutes: 5 as CooldownDuration,
        salahFirstEnabled: true,
        adaptiveIntensityEnabled: true,
        hapticTactileEnabled: true,
        defaultIntentionRequired: false,
      }),
      cooldownMinutes,
    };
    StorageService.saveSettings({ ...currentSettings, gateSettings: updatedGate });
  };

  return (
    <div id="deenfirst_digital_discipline_view" className="space-y-6 animate-fade-in pb-20">
      {/* Top Segmented Selector */}
      <div className="flex bg-[#051712] p-1 rounded-2xl border border-emerald-500/20">
        <button
          onClick={() => setActiveTab('discipline')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'discipline'
              ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Discipline & Apps
        </button>
        <button
          onClick={() => setActiveTab('modes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'modes'
              ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Gate Modes
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'insights'
              ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Weekly Insights
        </button>
      </div>

      {activeTab === 'discipline' && (
        <>
          {/* Digital Discipline Score Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-[#082920] to-[#041611] border border-emerald-500/30 p-6 text-stone-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Digital Discipline Engine</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-300">
                <span>Score: {stats.disciplineScore || 84}/100</span>
              </div>
            </div>

            {/* Core 4-Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Today Pauses</span>
                <span className="text-xl font-extrabold font-mono text-emerald-400">
                  {stats.todayPausesCompleted}
                </span>
                <span className="text-[9px] text-stone-400 block">completed</span>
              </div>

              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Go Backs</span>
                <span className="text-xl font-extrabold font-mono text-teal-300">
                  {stats.goBacksToday || 0}
                </span>
                <span className="text-[9px] text-stone-400 block">disciplined exits</span>
              </div>

              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Streak</span>
                <span className="text-xl font-extrabold font-mono text-emerald-300">
                  {stats.streakDays}
                </span>
                <span className="text-[9px] text-stone-400 block">consecutive days</span>
              </div>

              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Gate Dhikr</span>
                <span className="text-xl font-extrabold font-mono text-stone-100">
                  {stats.gateDhikrTotal || 0}
                </span>
                <span className="text-[9px] text-stone-400 block">interception taps</span>
              </div>
            </div>

            {/* Active Focus Session Banner */}
            {focusRemainingMinutes > 0 && (
              <div className="bg-emerald-500/15 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold">Digital Fast / Focus Session Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{focusRemainingMinutes}m remaining</span>
                  <button
                    onClick={handleStopFocusSession}
                    className="text-[10px] underline text-stone-400 hover:text-white"
                  >
                    End
                  </button>
                </div>
              </div>
            )}

            {/* Temporary Pass Status */}
            {tempMinutesRemaining > 0 && (
              <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Temporary bypass pass active</span>
                </span>
                <span className="font-mono font-bold">{tempMinutesRemaining} mins remaining</span>
              </div>
            )}
          </div>

          {/* Practice / Test Gate Multi-Level Trigger */}
          <div className="bg-[#071d17] border border-emerald-500/20 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">
                  Test Adaptive Spiritual Gates
                </h4>
                <p className="text-[11px] text-stone-400">Experience the 4 conscious pause intensities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onLaunchTestGate(apps[0] || null, 1)}
                className="p-2.5 rounded-xl bg-black/30 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/40 text-left transition"
              >
                <span className="text-[10px] font-bold text-emerald-400 block">Level 1 (5s)</span>
                <span className="text-xs text-stone-200 font-semibold">Quick Pause</span>
              </button>

              <button
                onClick={() => onLaunchTestGate(apps[0] || null, 2)}
                className="p-2.5 rounded-xl bg-black/30 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/40 text-left transition"
              >
                <span className="text-[10px] font-bold text-emerald-400 block">Level 2 (11x)</span>
                <span className="text-xs text-stone-200 font-semibold">Tactile Dhikr</span>
              </button>

              <button
                onClick={() => onLaunchTestGate(apps[0] || null, 3)}
                className="p-2.5 rounded-xl bg-black/30 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/40 text-left transition"
              >
                <span className="text-[10px] font-bold text-emerald-400 block">Level 3 (15s)</span>
                <span className="text-xs text-stone-200 font-semibold">Ayah Reflection</span>
              </button>

              <button
                onClick={() => onLaunchTestGate(apps[0] || null, 4)}
                className="p-2.5 rounded-xl bg-black/30 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/40 text-left transition"
              >
                <span className="text-[10px] font-bold text-amber-400 block">Level 4 (25s)</span>
                <span className="text-xs text-stone-200 font-semibold">Intentional Delay</span>
              </button>
            </div>
          </div>

          {/* Protected Apps List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Protected Distraction Apps</span>
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
                      <h4 className="text-sm font-semibold text-stone-100">{app.name}</h4>
                      <p className="text-[11px] text-stone-400">
                        {app.pauseCount} pauses • {app.goBackCount || 0} go-backs • {app.urgentAccessCount} bypasses
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

          {/* Digital Fast / Quick Focus Launcher */}
          <div className="bg-[#071d17] rounded-2xl p-5 border border-emerald-500/20 space-y-3">
            <h4 className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Start a Digital Fast / Study Session</span>
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Enforces Level 3 (Quran Reflection) with heightened mindfulness during designated focus blocks:
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleStartFocusSession(mins)}
                  className="p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-emerald-400/40 text-xs font-mono font-medium text-stone-200 hover:text-emerald-300 transition text-center"
                >
                  {mins}m Fast
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'modes' && (
        <div className="space-y-5 animate-fade-in">
          {/* Gate Mode Selector */}
          <div className="bg-[#071d17] border border-emerald-500/20 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Spiritual Gate Mode</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Customize how strictly the Gate interacts when opening protected apps
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'gentle' as GateMode,
                  name: 'Gentle Mode',
                  time: '5 seconds',
                  desc: 'Quick, lightweight pause with verified ayah/dua. Ideal for beginner digital discipline.',
                },
                {
                  id: 'balanced' as GateMode,
                  name: 'Balanced Mode (Recommended)',
                  time: '10–12 seconds / 11x Dhikr',
                  desc: 'Adaptive pause that scales to Tactile Dhikr if an app is reopened frequently.',
                },
                {
                  id: 'deep' as GateMode,
                  name: 'Deep Reflection',
                  time: '15 seconds',
                  desc: 'Requires full Ayah reflection and contemplative breathing before entering.',
                },
                {
                  id: 'focus' as GateMode,
                  name: 'Digital Fast / Maximum Focus',
                  time: '25 seconds',
                  desc: 'Highest intervention. Pairs deep Ayah reflections with intentional delay.',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleUpdateGateMode(m.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    selectedGateMode === m.id
                      ? 'bg-emerald-500/15 border-emerald-400/60 shadow-sm'
                      : 'bg-black/25 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-100">{m.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      {m.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cooldown Settings */}
          <div className="bg-[#071d17] border border-emerald-500/20 rounded-3xl p-5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Gate Cooldown Window</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                After completing a pause, the app opens without re-triggering for this duration:
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {([1, 5, 15, 30] as CooldownDuration[]).map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdateCooldown(mins)}
                  className={`p-3 rounded-xl border font-mono text-xs font-bold transition text-center ${
                    selectedCooldown === mins
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-black/25 border-white/5 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4 animate-fade-in">
          {/* Weekly Summary Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#082920] to-[#041611] border border-emerald-500/30 p-6 text-stone-100 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Weekly Discipline Summary</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic bg-black/25 p-4 rounded-2xl border border-white/5">
              "{insights.insightSummary}"
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-stone-400 block uppercase">Go-Back Rate</span>
                <span className="text-2xl font-mono font-bold text-teal-300">
                  {insights.avoidanceRatePercent}%
                </span>
                <span className="text-[10px] text-stone-400 block">distractions redirected</span>
              </div>

              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-stone-400 block uppercase">Top Distraction</span>
                <span className="text-lg font-bold text-stone-100 truncate block">
                  {insights.topDistractionApp}
                </span>
                <span className="text-[10px] text-emerald-400 block">
                  {insights.topDistractionPercent}% of attempts
                </span>
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <span className="text-stone-400">Most mindful time window:</span>
              <span className="font-semibold text-emerald-300">{insights.strongestTimeOfDay}</span>
            </div>
          </div>
        </div>
      )}

      {/* Honest Architecture Disclosure (Layer A vs Layer B) */}
      <div className="bg-black/25 rounded-2xl p-4 border border-white/5 space-y-2 text-left">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>PWA & Native Interception Architecture</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          In web browser PWA mode, DeenFirst provides self-guided spiritual pauses, mindfulness trackers, and simulated
          gates. Full system-wide app interception across Android requires the companion native bridge module (utilizing
          Android AccessibilityService & UsageStatsManager), which is pre-architected in DeenFirst’s codebase.
        </p>
      </div>
    </div>
  );
};
