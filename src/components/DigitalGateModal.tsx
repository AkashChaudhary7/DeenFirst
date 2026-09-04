import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Volume2,
  X,
  RotateCcw,
  CheckCircle2,
  Flame,
  Clock,
  Radio,
  BookOpen,
  Check,
} from 'lucide-react';
import { AppGate } from '../services/gate/AppGateService';
import { GlobalAudio } from '../services/audioService';
import { ProtectedApp } from '../types';
import { SmartGateService, GateContextDecision } from '../services/smartGateService';
import { StorageService } from '../services/storageService';

interface DigitalGateModalProps {
  app?: ProtectedApp | null;
  onClose: () => void;
  onSuccess?: () => void;
  customLevel?: 1 | 2 | 3 | 4;
}

export const DigitalGateModal: React.FC<DigitalGateModalProps> = ({
  app,
  onClose,
  onSuccess,
  customLevel,
}) => {
  // Context Decision from SmartGateService
  const decision: GateContextDecision = useMemo(() => {
    const base = SmartGateService.evaluateGateTrigger(app || null);
    if (customLevel) {
      base.level = customLevel;
    }
    return base;
  }, [app, customLevel]);

  // Duration seconds based on Gate level
  const initialDuration = useMemo(() => {
    switch (decision.level) {
      case 1:
        return 5; // Level 1: 5s Quick Pause
      case 2:
        return 12; // Level 2: 12s Tactile Dhikr (or 11 taps)
      case 3:
        return 15; // Level 3: 15s Quran Reflection
      case 4:
        return 25; // Level 4: 25s Intentional Delay / Rapid reopen intervention
      default:
        return 10;
    }
  }, [decision.level]);

  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [urgentAccessTaken, setUrgentAccessTaken] = useState(false);
  const [goBackTaken, setGoBackTaken] = useState(false);
  const [dhikrTaps, setDhikrTaps] = useState(0);
  const targetDhikrCount = decision.content.recommendedDhikrCount || 11;
  const [intentionSelected, setIntentionSelected] = useState<string>('');

  const intentionsList = [
    'Checking work or urgent communication',
    'Quick message to family / friends',
    'Conscious leisure with a 10m limit',
    'Just reflex / mindless habit',
  ];

  // Cooldown / Countdown management
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          GlobalAudio.playTasbihClick(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dhikr tactile tap handler (Level 2 & accessible in all levels)
  const handleDhikrTap = () => {
    const nextCount = dhikrTaps + 1;
    setDhikrTaps(nextCount);
    GlobalAudio.playTasbihClick(nextCount % 11 === 0);

    // Save in storage as gate dhikr
    StorageService.recordDhikrIncrement(1, true);

    if (decision.level === 2 && nextCount >= targetDhikrCount) {
      setIsCompleted(true);
    }
  };

  // Complete and continue into protected app
  const handleCompletePause = async () => {
    const appId = app?.id || 'demo_pause';
    await AppGate.requestUnlock(appId, 'complete_pause', {
      dhikrCount: dhikrTaps,
      level: decision.level,
      intention: intentionSelected || undefined,
    });
    SmartGateService.logGateAction({
      appId,
      appName: app?.name || 'Protected App',
      action: 'completed_pause',
      level: decision.level,
      durationSeconds: initialDuration - secondsLeft,
      dhikrCount: dhikrTaps,
      intention: intentionSelected || undefined,
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  // Intentional Go Back (The signature disciplined choice)
  const handleGoBack = async () => {
    setGoBackTaken(true);
    const appId = app?.id || 'demo_pause';
    await AppGate.requestUnlock(appId, 'go_back');
    SmartGateService.logGateAction({
      appId,
      appName: app?.name || 'Protected App',
      action: 'go_back',
      level: decision.level,
      durationSeconds: initialDuration - secondsLeft,
      dhikrCount: dhikrTaps,
    });
    GlobalAudio.playTasbihClick(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Emergency Bypass / Urgent Access
  const handleUrgentAccess = async () => {
    setUrgentAccessTaken(true);
    const appId = app?.id || 'demo_pause';
    await AppGate.requestUnlock(appId, 'urgent');
    SmartGateService.logGateAction({
      appId,
      appName: app?.name || 'Protected App',
      action: 'emergency_bypass',
      level: decision.level,
      durationSeconds: 0,
    });
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1100);
  };

  const progressPercent = Math.round(((initialDuration - secondsLeft) / initialDuration) * 100);

  return (
    <div
      id="deenfirst_digital_gate_modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020d0a]/90 backdrop-blur-lg p-4 animate-fade-in overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0a2c22] to-[#041611] border border-emerald-500/40 p-6 sm:p-8 text-stone-100 shadow-2xl relative my-auto">
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* State: Go Back Celebration (Intentional Decision) */}
        {goBackTaken ? (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <p className="font-arabic text-xl text-emerald-300">بَارَكَ اللَّهُ فِيكَ</p>
            <h3 className="text-xl font-bold text-stone-100">Choice Made Consciously</h3>
            <p className="text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
              You chose to step back and preserve your time for what truly matters. May Allah bless your hours with barakah.
            </p>
          </div>
        ) : urgentAccessTaken ? (
          /* State: Urgent Access Transition */
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Heart className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-stone-100">Proceed With Peace</h3>
            <p className="text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
              Take this remembrance with you. DeenFirst is a loving reminder, never a barrier or punishment.
            </p>
          </div>
        ) : isCompleted ? (
          /* State: Completed Spiritual Pause */
          <div className="text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div>
              <p className="font-arabic text-2xl text-emerald-300 mb-1">الْحَمْدُ لِلَّهِ</p>
              <h3 className="text-2xl font-bold text-stone-100">Pause Complete</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Enter the digital world with presence, intention, and divine barakah.
              </p>
            </div>

            {/* Reflection snippet */}
            <div className="bg-black/25 rounded-2xl p-4 border border-white/5 text-left">
              <p className="text-[11px] text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                Reflected Reminder
              </p>
              <p className="text-xs sm:text-sm text-stone-200 italic">"{decision.content.translation}"</p>
              <p className="text-[10px] text-stone-400 mt-1 text-right">— {decision.content.reference}</p>
            </div>

            {/* Optional Intention Selector */}
            <div className="space-y-2 text-left">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                What is your intention? (Optional)
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {intentionsList.map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setIntentionSelected(intent)}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition border ${
                      intentionSelected === intent
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold'
                        : 'bg-white/5 border-white/5 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleCompletePause}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold py-3.5 px-6 shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue to {app?.name || 'Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGoBack}
                className="w-full rounded-2xl bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 py-3 text-xs font-bold text-emerald-300 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>I changed my mind — Go Back</span>
              </button>
            </div>
          </div>
        ) : (
          /* State: Active Gate Interception (Levels 1-4) */
          <div className="space-y-4">
            {/* Header with Level & Salah context badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Level {decision.level}: {decision.levelName}
                    </span>
                    {decision.isNearSalah && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        {decision.salahName} Approaching
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-stone-200 mt-0.5">
                    Before opening {app?.name || 'the app'}
                  </h3>
                </div>
              </div>

              {/* Countdown circle */}
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 -rotate-90">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-stone-700"
                      fill="transparent"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-emerald-400 transition-all duration-1000"
                      fill="transparent"
                      strokeDasharray="50"
                      strokeDashoffset={50 - (50 * progressPercent) / 100}
                    />
                  </svg>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300">{secondsLeft}s</span>
              </div>
            </div>

            {/* Rapid Reopening Warning (Level 4 Context) */}
            {decision.isRapidReopen && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-200">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  You opened {app?.name || 'this app'} {decision.recentOpenCount10m} times in the last 10 minutes. Pause
                  and ask: is this intentional?
                </span>
              </div>
            )}

            {/* Sacred Devotional Content Box */}
            <div className="bg-[#051712] rounded-3xl p-5 border border-emerald-500/20 shadow-inner space-y-3.5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {decision.content.title}
              </span>

              {/* Arabic text */}
              {decision.content.arabic && (
                <p
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl text-emerald-200 leading-loose py-1 font-normal selection:bg-emerald-500/30"
                >
                  {decision.content.arabic}
                </p>
              )}

              {/* Transliteration */}
              {decision.content.transliteration && (
                <p className="text-xs text-stone-400 italic">{decision.content.transliteration}</p>
              )}

              {/* Translation */}
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-ui">
                "{decision.content.translation}"
              </p>

              {/* Reference */}
              <p className="text-[10px] text-emerald-400/80 font-medium">— {decision.content.reference}</p>
            </div>

            {/* Tactile Dhikr Counter Pad for Level 2 & All Levels */}
            {decision.level === 2 ? (
              <div className="bg-black/30 rounded-2xl p-4 border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="font-semibold text-emerald-400">Tactile Dhikr Tap</span>
                  <span className="font-mono">
                    {dhikrTaps} / {targetDhikrCount} completed
                  </span>
                </div>
                <button
                  onClick={handleDhikrTap}
                  className="w-full py-4 rounded-2xl bg-gradient-to-b from-emerald-600 to-teal-800 active:scale-95 transition text-white font-bold text-base shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tap to Count Dhikr ({dhikrTaps})</span>
                </button>
              </div>
            ) : (
              /* Quick Mini Tasbih Tap */
              <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl border border-white/5 text-xs">
                <span className="text-stone-400">Quick Dhikr during pause:</span>
                <button
                  onClick={handleDhikrTap}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold transition active:scale-95"
                >
                  +1 Tasbih ({dhikrTaps})
                </button>
              </div>
            )}

            {/* Primary Choices: Reflect Complete vs Go Back */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setIsCompleted(true);
                  GlobalAudio.playTasbihClick(true);
                }}
                className="w-full rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 py-3 px-4 text-xs font-bold text-emerald-200 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>I have finished reflecting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleGoBack}
                className="w-full rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 py-2.5 px-4 text-xs font-semibold text-stone-300 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Don't open app — Go Back</span>
              </button>

              {/* Emergency Non-Coercive Bypass Button */}
              <div className="text-center pt-2">
                <button
                  onClick={handleUrgentAccess}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-300 underline decoration-stone-700 underline-offset-4 transition"
                >
                  Emergency / Urgent Access (Bypass)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
