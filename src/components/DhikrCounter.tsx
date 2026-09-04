import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Calendar,
  X,
  Flame,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { DHIKR_ITEMS } from '../content/dhikrData';
import { DhikrItem, LanguageCode } from '../types';
import { GlobalAudio } from '../services/audioService';
import { StorageService } from '../services/storageService';

interface DhikrCounterProps {
  lang: LanguageCode;
  hapticEnabled?: boolean;
  soundEnabled?: boolean;
}

export const DhikrCounter: React.FC<DhikrCounterProps> = ({
  lang,
  hapticEnabled = true,
  soundEnabled = true,
}) => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(DHIKR_ITEMS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundActive, setSoundActive] = useState(soundEnabled);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  // Dhikr Statistics
  const [stats, setStats] = useState(() => StorageService.getDhikrStats());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Selected month for calendar view
  const [calendarDate, setCalendarDate] = useState(() => new Date());

  const handleIncrement = () => {
    if (soundActive) {
      GlobalAudio.playTasbihClick(true);
    }
    if (hapticEnabled) {
      GlobalAudio.vibrate(20, true);
    }

    // Persist to statistics
    const updatedStats = StorageService.recordDhikrIncrement(1);
    setStats(updatedStats);

    const nextCount = count + 1;
    if (nextCount >= target) {
      setCount(0);
      setRoundsCompleted((prev) => prev + 1);
      if (hapticEnabled) {
        GlobalAudio.vibrate(80, true);
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setRoundsCompleted(0);
    GlobalAudio.vibrate(30, hapticEnabled);
  };

  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  // Calendar generation helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleString('default', { month: 'long' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  return (
    <div id="deenfirst_dhikr_counter" className="space-y-5 animate-fade-in pb-24 w-full max-w-full">
      {/* 1. STAT BAR ABOVE (Daily, Week, Lifetime + Calendar Button) */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
        <div className="grid grid-cols-3 divide-x divide-stone-200 dark:divide-white/10 flex-1 text-center">
          {/* Daily */}
          <div className="px-1.5 sm:px-3">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              Today
            </span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
              {stats.daily.toLocaleString()}
            </span>
          </div>

          {/* Week */}
          <div className="px-1.5 sm:px-3">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              7 Days
            </span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-teal-700 dark:text-teal-300">
              {stats.weekly.toLocaleString()}
            </span>
          </div>

          {/* Lifetime */}
          <div className="px-1.5 sm:px-3">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              Lifetime
            </span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400">
              {stats.lifetime.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Little button for daily stats in calendar view */}
        <button
          id="btn_open_dhikr_calendar"
          onClick={() => setShowCalendarModal(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition flex items-center gap-1.5 shrink-0 shadow-sm"
          title="View Day-wise Calendar Stats"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold">History</span>
        </button>
      </div>

      {/* 2. MAIN DHIKR DISPLAY & BIG TACTILE COUNT BUTTON */}
      <div className="rounded-3xl bg-gradient-to-b from-[#082920] to-[#041611] border border-emerald-500/30 p-6 sm:p-7 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold text-emerald-400 tracking-wider uppercase text-[11px]">
            Target: {target}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundActive(!soundActive)}
              className={`p-1.5 rounded-lg border transition ${
                soundActive
                  ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
                  : 'text-stone-500 border-white/5'
              }`}
              title="Toggle Tap Sound"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-white/5 text-stone-400 hover:text-white hover:bg-white/5 transition"
              title="Reset Counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Arabic Display */}
        <div className="py-1">
          <p
            dir="rtl"
            className="font-arabic text-3xl sm:text-4xl text-emerald-200 leading-relaxed font-normal selection:bg-emerald-500/30 break-words"
          >
            {selectedDhikr.arabic}
          </p>
          <p className="text-xs text-stone-300 font-medium mt-1 italic">
            {selectedDhikr.transliteration}
          </p>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto font-ui">
            "{selectedDhikr.translation}"
          </p>
        </div>

        {/* BIG TACTILE COUNT BUTTON */}
        <div className="py-3 flex justify-center">
          <button
            id="btn_tap_dhikr_count"
            onClick={handleIncrement}
            className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c392c] to-[#051a14] border-4 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)] active:scale-95 transition-all duration-150 group select-none cursor-pointer"
            aria-label="Tap to count Dhikr"
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="4"
                className="text-stone-800/40"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="4"
                className="text-emerald-400 transition-all duration-150"
                fill="transparent"
                strokeDasharray="280"
                strokeDashoffset={280 - (280 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Counter number */}
            <span className="font-mono text-5xl font-extrabold tracking-tight text-white group-active:text-emerald-300 transition-colors">
              {count}
            </span>
            <span className="text-[11px] text-stone-400 uppercase tracking-widest mt-1 font-semibold group-active:text-stone-200">
              TAP TO COUNT
            </span>
          </button>
        </div>

        {/* Round Counter & Presets */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-emerald-900/30">
          <span className="font-medium text-stone-300">
            Rounds: <strong className="text-emerald-400 font-mono">{roundsCompleted}</strong>
          </span>

          <div className="flex gap-1.5">
            {[33, 100, 500].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setTarget(num);
                  setCount(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                  target === num
                    ? 'bg-emerald-400 text-stone-950 font-bold'
                    : 'bg-black/30 text-stone-400 hover:text-stone-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SELECT ADHKAR - POSITIONED BELOW WITH ZERO MOBILE OVERFLOW */}
      <div className="bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-3xl p-5 shadow-sm space-y-3 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Select Adhkar</span>
          </label>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            {DHIKR_ITEMS.length} Authentic Remembrance
          </span>
        </div>

        {/* Responsive Mobile-Perfect Select Dropdown (Truncated & Zero Overflow) */}
        <div className="relative w-full max-w-full">
          <select
            id="select_adhkar_mobile"
            value={selectedDhikr.id}
            onChange={(e) => {
              const found = DHIKR_ITEMS.find((d) => d.id === e.target.value);
              if (found) {
                setSelectedDhikr(found);
                setTarget(found.recommendedCount);
                setCount(0);
              }
            }}
            className="w-full appearance-none bg-stone-50 dark:bg-[#041410] border border-stone-200 dark:border-emerald-500/20 rounded-2xl px-4 py-3 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm truncate pr-10"
          >
            {DHIKR_ITEMS.map((d) => (
              <option key={d.id} value={d.id} className="dark:bg-[#071d17]">
                {d.transliteration} ({d.translation}) — {d.recommendedCount}x
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Quick Horizontal Scrollable Adhkar Chips for Seamless Mobile Selection */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          {DHIKR_ITEMS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDhikr(d);
                setTarget(d.recommendedCount);
                setCount(0);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedDhikr.id === d.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-[#041410] border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 hover:border-emerald-500/30'
              }`}
            >
              {d.transliteration}
            </button>
          ))}
        </div>
      </div>

      {/* 4. SPIRITUAL BENEFIT & HADITH REFERENCE */}
      <div className="bg-white dark:bg-[#071d17] rounded-3xl p-5 border border-emerald-800/15 dark:border-emerald-500/20 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Spiritual Benefit</span>
        </div>
        <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
          {selectedDhikr.benefit}
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-white/5">
          Source: <span className="text-stone-700 dark:text-stone-300 font-medium">{selectedDhikr.sourceReference}</span>
        </p>
      </div>

      {/* 5. DAY-WISE STATS CALENDAR MODAL */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/20 dark:border-emerald-500/30 shadow-2xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Dhikr Daily Activity Calendar
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Tracking daily counts and spiritual constancy
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Month Selector */}
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm font-bold text-stone-800 dark:text-emerald-200">
                {monthName} {year}
              </h4>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 uppercase">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty offset days */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 rounded-xl" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const mStr = String(month + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const dateKey = `${year}-${mStr}-${dStr}`;
                const dayCount = stats.history[dateKey] || 0;
                const isToday = dateKey === todayStr;

                return (
                  <div
                    key={dayNum}
                    className={`h-12 rounded-xl p-1 flex flex-col items-center justify-between text-xs border transition ${
                      isToday
                        ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                        : dayCount > 0
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-stone-100 dark:border-white/5 text-stone-400'
                    }`}
                  >
                    <span
                      className={`text-[10px] ${
                        isToday ? 'text-emerald-700 dark:text-emerald-300' : ''
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayCount > 0 ? (
                      <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-full">
                        {dayCount}
                      </span>
                    ) : (
                      <span className="text-[9px] text-stone-300 dark:text-stone-600">-</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="bg-stone-50 dark:bg-[#041410] p-4 rounded-2xl border border-stone-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  Total for {monthName}:
                </span>
                <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                  {Object.entries(stats.history)
                    .filter(([d]) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
                    .reduce((acc: number, [, v]) => acc + (Number(v) || 0), 0)
                    .toLocaleString()}{' '}
                  Tasbih
                </span>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
