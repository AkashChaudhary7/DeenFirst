import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Volume2, X } from 'lucide-react';
import { AppGate } from '../services/gate/AppGateService';
import { QURAN_VERSES } from '../content/quranData';
import { DHIKR_ITEMS } from '../content/dhikrData';
import { DUAS_LIST } from '../content/duasData';
import { GlobalAudio } from '../services/audioService';
import { ProtectedApp } from '../types';

interface DigitalGateModalProps {
  app?: ProtectedApp | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DigitalGateModal: React.FC<DigitalGateModalProps> = ({
  app,
  onClose,
  onSuccess,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [urgentAccessTaken, setUrgentAccessTaken] = useState(false);
  const [activeItem, setActiveItem] = useState<{
    type: 'ayah' | 'dhikr' | 'dua';
    title: string;
    arabic: string;
    translation: string;
    transliteration?: string;
    reference: string;
  }>({
    type: 'ayah',
    title: 'Ayah of Reflection',
    arabic: QURAN_VERSES[0].arabic,
    translation: QURAN_VERSES[0].translation,
    transliteration: QURAN_VERSES[0].transliteration,
    reference: `${QURAN_VERSES[0].surahName} (${QURAN_VERSES[0].surahNumber}:${QURAN_VERSES[0].ayahNumber})`,
  });

  useEffect(() => {
    // Pick a random devotional item (Ayah, Dhikr, or Dua)
    const options = [
      () => {
        const verse = QURAN_VERSES[Math.floor(Math.random() * QURAN_VERSES.length)];
        return {
          type: 'ayah' as const,
          title: 'Ayah of Reflection',
          arabic: verse.arabic,
          translation: verse.translation,
          transliteration: verse.transliteration,
          reference: `${verse.surahName} (${verse.surahNumber}:${verse.ayahNumber})`,
        };
      },
      () => {
        const dhikr = DHIKR_ITEMS[Math.floor(Math.random() * DHIKR_ITEMS.length)];
        return {
          type: 'dhikr' as const,
          title: 'Remembrance of Allah',
          arabic: dhikr.arabic,
          translation: dhikr.translation,
          transliteration: dhikr.transliteration,
          reference: dhikr.sourceReference,
        };
      },
      () => {
        const dua = DUAS_LIST[Math.floor(Math.random() * DUAS_LIST.length)];
        return {
          type: 'dua' as const,
          title: dua.title,
          arabic: dua.arabic,
          translation: dua.translation,
          transliteration: dua.transliteration,
          reference: dua.reference,
        };
      },
    ];

    const picker = options[Math.floor(Math.random() * options.length)];
    setActiveItem(picker());

    // Gentle countdown
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

  const handleCompletePause = async () => {
    await AppGate.requestUnlock(app?.id || 'demo_pause', 'complete_pause');
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleUrgentAccess = async () => {
    setUrgentAccessTaken(true);
    await AppGate.requestUnlock(app?.id || 'demo_pause', 'urgent');
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  const progressPercent = Math.round(((15 - secondsLeft) / 15) * 100);

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

        {/* State: Urgent Access Transition */}
        {urgentAccessTaken ? (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Heart className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-stone-100">
              Proceed With Peace
            </h3>
            <p className="text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
              Take this remembrance with you. DeenFirst is a loving reminder, never a punishment.
            </p>
          </div>
        ) : isCompleted ? (
          /* State: Completed Spiritual Pause */
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div>
              <p className="font-arabic text-2xl text-emerald-300 mb-1">
                الْحَمْدُ لِلَّهِ
              </p>
              <h3 className="text-2xl font-bold text-stone-100">
                Alhamdulillah
              </h3>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                Your spiritual pause is complete. Enter the digital world with presence, intention, and divine barakah.
              </p>
            </div>

            <div className="bg-black/25 rounded-2xl p-4 border border-white/5 text-left">
              <p className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                Reflected Reminder
              </p>
              <p className="text-sm text-stone-200 italic">
                "{activeItem.translation}"
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleCompletePause}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold py-3.5 px-6 shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue to {app?.name || 'Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-2xl border border-white/10 hover:bg-white/5 py-3 text-xs font-semibold text-stone-300 transition"
              >
                Stay in DeenFirst
              </button>
            </div>
          </div>
        ) : (
          /* State: Active Spiritual Pause */
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                    Spiritual Pause
                  </span>
                  <h3 className="text-sm font-semibold text-stone-200">
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
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {secondsLeft}s
                </span>
              </div>
            </div>

            {/* Sacred Devotional Content Box */}
            <div className="bg-[#051712] rounded-3xl p-6 border border-emerald-500/20 shadow-inner space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              
              <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {activeItem.title}
              </span>

              {/* Arabic */}
              <p
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl text-emerald-200 leading-loose py-2 font-normal selection:bg-emerald-500/30"
              >
                {activeItem.arabic}
              </p>

              {/* Transliteration */}
              {activeItem.transliteration && (
                <p className="text-xs text-stone-400 italic">
                  {activeItem.transliteration}
                </p>
              )}

              {/* Translation */}
              <p className="text-sm text-stone-200 leading-relaxed font-ui">
                "{activeItem.translation}"
              </p>

              {/* Reference */}
              <p className="text-[11px] text-emerald-400/80 font-medium">
                — {activeItem.reference}
              </p>
            </div>

            {/* Complete Early or Urgent Access */}
            <div className="space-y-3 pt-2">
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

              {/* Urgent Access Button */}
              <div className="text-center pt-1">
                <p className="text-[11px] text-stone-400 mb-1">
                  Need immediate access?
                </p>
                <button
                  onClick={handleUrgentAccess}
                  className="text-xs font-semibold text-stone-400 hover:text-stone-200 underline decoration-stone-600 underline-offset-4 transition"
                >
                  CONTINUE WITHOUT PAUSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
