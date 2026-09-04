import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  Clock,
  Info,
  CheckCircle2,
  Share2,
  Bookmark,
  Sun,
  Star,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { IslamicEvent, LanguageCode } from '../types';
import {
  HIJRI_MONTHS,
  MAJOR_ISLAMIC_EVENTS,
  JUMUAH_SUNNAH_GUIDE,
  getEstimatedHijriDate,
  getUpcomingIslamicEvents,
  getNextJumuahDetails,
  getWhiteDaysForHijriMonth,
  estimateGregorianDateForHijri,
} from '../content/islamicCalendarData';

interface IslamicCalendarViewProps {
  onBack: () => void;
  lang?: LanguageCode;
}

export const IslamicCalendarView: React.FC<IslamicCalendarViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'months' | 'jumuah' | 'fasting'>('upcoming');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(() => {
    const today = getEstimatedHijriDate();
    return Math.max(0, today.month - 1);
  });
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const todayHijri = getEstimatedHijriDate();
  const upcomingEvents = getUpcomingIslamicEvents();
  const nextJumuah = getNextJumuahDetails();
  const currentMonthInfo = HIJRI_MONTHS[selectedMonthIndex];
  const whiteDays = getWhiteDaysForHijriMonth(selectedMonthIndex + 1);

  const filteredUpcoming = upcomingEvents.filter((ev) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'ramadan') return ev.category === 'ramadan' || ev.id.includes('ramadan') || ev.id.includes('qadr');
    if (filterCategory === 'eid') return ev.category === 'eid';
    if (filterCategory === 'fasting') return ev.category === 'fasting';
    if (filterCategory === 'blessed') return ev.category === 'blessed_night';
    return true;
  });

  const handleCopyEvent = (event: IslamicEvent) => {
    const text = `${event.name} (${event.hijriDay} ${event.monthName} AH)\nEstimated Gregorian: ${event.estimatedGregorian || 'TBD'}\n\n${event.description}\n\n*Dates may vary by ±1–2 days based on local moon sighting.`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div id="deenfirst_islamic_calendar" className="space-y-6 animate-fade-in pb-24">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-emerald-500/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
          <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Islamic Lunar Calendar</span>
        </div>
      </div>

      {/* PROMINENT MOON-SIGHTING DISCLAIMER BANNER (USER MANDATE) */}
      <div
        id="banner_moon_sighting_disclaimer"
        className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 p-4 sm:p-5 text-amber-950 dark:text-amber-200 shadow-sm relative overflow-hidden space-y-2"
      >
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            Moon-Sighting Variance Notice
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90 font-ui">
          Islamic months begin and end with the verified sighting of the crescent moon (<em>Hilal</em>). Projected Gregorian dates shown are calculated using standard astronomical models (Umm al-Qura) and may vary by <strong>±1 to 2 days</strong> depending on regional moon-sighting committees and local visibility.
        </p>
      </div>

      {/* TODAY'S HIJRI DATE HERO CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-[#082920] to-[#041611] text-white border border-emerald-500/30 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today in the Islamic Year</span>
          </span>
          {HIJRI_MONTHS[todayHijri.month - 1]?.isSacred && (
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Sacred Month (شهر حرام)
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <span className="text-xs text-stone-400 block font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-0.5">
              {todayHijri.day} {todayHijri.monthName} {todayHijri.year} AH
            </h2>
          </div>

          <div className="text-right">
            <span className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-300">
              {todayHijri.monthArabic}
            </span>
          </div>
        </div>

        {/* Next Jumu'ah Countdown Ticker */}
        <div className="mt-5 pt-4 border-t border-emerald-900/40 flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Next Jumu'ah:{' '}
              <strong className="text-white">
                {nextJumuah.daysRemaining === 0 ? 'Today (Friday) 🕌' : `in ${nextJumuah.daysRemaining} days`}
              </strong>
            </span>
          </div>
          <button
            onClick={() => setActiveTab('jumuah')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-xs"
          >
            Friday Sunnah Guide →
          </button>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-[#071d17] border border-stone-200 dark:border-emerald-500/20 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            activeTab === 'upcoming'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-700 dark:text-stone-300 hover:text-emerald-600'
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab('months')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            activeTab === 'months'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-700 dark:text-stone-300 hover:text-emerald-600'
          }`}
        >
          12 Months
        </button>

        <button
          onClick={() => setActiveTab('jumuah')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            activeTab === 'jumuah'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-700 dark:text-stone-300 hover:text-emerald-600'
          }`}
        >
          Jumu'ah
        </button>

        <button
          onClick={() => setActiveTab('fasting')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            activeTab === 'fasting'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-700 dark:text-stone-300 hover:text-emerald-600'
          }`}
        >
          White Days
        </button>
      </div>

      {/* TAB 1: UPCOMING MAJOR EVENTS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'ramadan', label: '🌙 Ramadan' },
              { id: 'eid', label: '🎉 Eid Days' },
              { id: 'fasting', label: '🥣 Sunnah Fasting' },
              { id: 'blessed', label: '✨ Blessed Nights' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`py-1.5 px-3 rounded-xl border whitespace-nowrap font-medium transition ${
                  filterCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-[#071d17] border-stone-200 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300 hover:border-emerald-500/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredUpcoming.map((event) => {
              const isClose = (event.daysRemaining || 0) <= 30;
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#071d17] border transition cursor-pointer shadow-sm hover:border-emerald-500/50 space-y-3 group ${
                    isClose
                      ? 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-stone-200 dark:border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {event.hijriDay} {event.monthName} AH
                        </span>
                        {event.category === 'ramadan' && (
                          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md">
                            Ramadan
                          </span>
                        )}
                        {event.category === 'eid' && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md">
                            Eid Mubarak
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                        {event.name}
                      </h4>
                      {event.arabicName && (
                        <p className="font-arabic text-sm text-stone-500 dark:text-stone-400">
                          {event.arabicName}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 block">
                        {event.estimatedGregorian}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {event.daysRemaining === 0 ? 'Today 🎉' : `in ${event.daysRemaining} days`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-100 dark:border-white/5 text-stone-500 dark:text-stone-400">
                    <span>Tap to view Sunnah acts & details</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 12 HIJRI MONTHS DIRECTORY */}
      {activeTab === 'months' && (
        <div className="space-y-4">
          {/* Month Selector Carousel / Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {HIJRI_MONTHS.map((month, idx) => {
              const isCurrent = todayHijri.month === month.number;
              const isSelected = selectedMonthIndex === idx;
              return (
                <button
                  key={month.number}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white dark:bg-[#071d17] border-stone-200 dark:border-emerald-500/20 text-stone-800 dark:text-stone-200 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                      #{month.number}
                    </span>
                    {month.isSacred && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        Sacred
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold block leading-tight">
                      {month.name}
                    </span>
                    <span className={`font-arabic text-sm ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                      {month.arabic}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className={`text-[9px] font-bold mt-1 inline-block ${isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Current Month
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Month Detail Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Month #{currentMonthInfo.number} of the Hijri Calendar
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {currentMonthInfo.name} ({currentMonthInfo.transliteration})
                </h3>
              </div>
              <span className="font-arabic text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {currentMonthInfo.arabic}
              </span>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {currentMonthInfo.significance}
            </p>

            {currentMonthInfo.isSacred && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sacred Month:</strong> One of the four sacred months in Islam (Muharram, Rajab, Dhul-Qi'dah, Dhul-Hijjah). Transgressions and good deeds carry amplified weight before Allah.
                </span>
              </div>
            )}

            {/* White Days for this month */}
            <div className="pt-2 border-t border-stone-100 dark:border-white/5 space-y-2">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                White Fasting Days (Ayyam al-Beed: 13, 14, 15):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {whiteDays.days.map((dayNum, i) => (
                  <div
                    key={dayNum}
                    className="p-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10"
                  >
                    <span className="text-[10px] text-stone-400 block">{currentMonthInfo.name}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      {dayNum}th Day
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      {whiteDays.gregorianDates[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FRIDAY (JUMU'AH) SUNNAH GUIDE */}
      {activeTab === 'jumuah' && (
        <div className="space-y-4">
          {/* Next Jumu'ah Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white border border-emerald-500/30 shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
                Weekly Congregation
              </span>
              <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                {nextJumuah.daysRemaining === 0 ? 'Today is Friday! 🕌' : `${nextJumuah.daysRemaining} days remaining`}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {nextJumuah.formatted}
            </h3>
            <p className="text-xs text-stone-200">
              Hijri Date: {nextJumuah.hijriFormatted}
            </p>
          </div>

          {/* Sunnah Acts Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Sunnah Acts of Friday (Sayyid al-Ayyam)
              </h4>
            </div>

            {JUMUAH_SUNNAH_GUIDE.sunnahActs.map((act, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 shadow-sm flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  {index + 1}
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {act.title}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-ui">
                    {act.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WHITE FASTING DAYS (AYYAM AL-BEED) */}
      {activeTab === 'fasting' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Sun className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Ayyam al-Beed (The White Days)
              </h3>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-ui">
              The 13th, 14th, and 15th nights of every lunar month when the full moon illuminates the sky. The Messenger of Allah (ﷺ) advised fasting these three days every month.
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-800/10 dark:border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>Hadith:</strong> "Fasting three days of each month is equivalent to fasting for a lifetime: the days of the full moon (13th, 14th, and 15th)." (Sunan an-Nasa'i)
            </div>
          </div>

          {/* Next 3 Months White Days Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider px-1">
              Upcoming White Days Schedule
            </h4>

            {[0, 1, 2].map((offset) => {
              const targetMonthIndex = (todayHijri.month - 1 + offset) % 12;
              const targetMonth = HIJRI_MONTHS[targetMonthIndex];
              const monthWhiteDays = getWhiteDaysForHijriMonth(targetMonthIndex + 1);
              return (
                <div
                  key={targetMonth.number}
                  className="p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-stone-200 dark:border-emerald-500/20 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {targetMonth.name} ({targetMonth.arabic})
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                        Month #{targetMonth.number}
                      </span>
                    </div>
                    {offset === 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        This Month
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {monthWhiteDays.days.map((dayNum, i) => (
                      <div
                        key={dayNum}
                        className="p-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10"
                      >
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs block">
                          {dayNum}th {targetMonth.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                          {monthWhiteDays.gregorianDates[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT DETAIL POPUP MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-500/40 p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {selectedEvent.hijriDay} {selectedEvent.monthName} AH
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {selectedEvent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 text-stone-500"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-white/5 p-3 rounded-2xl border border-stone-200 dark:border-white/10">
              <div>
                <span className="text-[10px] text-stone-400 block">Projected Gregorian Date</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {selectedEvent.estimatedGregorian || 'Calculated Soon'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
                {selectedEvent.daysRemaining === 0 ? 'Today!' : `in ${selectedEvent.daysRemaining} days`}
              </span>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-ui">
              {selectedEvent.description}
            </p>

            {selectedEvent.sunnahActs && selectedEvent.sunnahActs.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Recommended Sunnah Observances:
                </h5>
                <div className="space-y-1.5">
                  {selectedEvent.sunnahActs.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moon Sighting Reminder inside detail */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-950 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Please verify with your local Islamic authority as the exact day depends on local moon-sighting confirmation.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleCopyEvent(selectedEvent)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedNotice ? 'Copied to Clipboard!' : 'Share Event Info'}</span>
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="py-3 px-4 rounded-2xl bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
