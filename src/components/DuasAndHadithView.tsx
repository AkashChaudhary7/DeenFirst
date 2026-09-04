import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  BookOpen,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Search,
  Sparkles,
  Info,
  Crown,
  Share2,
  Check,
} from 'lucide-react';
import { DuaService } from '../services/duaService';
import { HadithService } from '../services/hadithService';
import { SEERAH_TOPICS } from '../content/seerahData';
import { NAMES_OF_ALLAH } from '../content/namesOfAllahData';
import { MAJOR_ISLAMIC_EVENTS, getEstimatedHijriDate } from '../content/islamicCalendarData';
import { DuaItem, HadithItem, LanguageCode, AppSettings } from '../types';
import { StorageService } from '../services/storageService';

interface DuasAndHadithViewProps {
  lang: LanguageCode;
  settings?: AppSettings;
  initialTab?: 'duas' | 'hadith' | 'names' | 'seerah' | 'calendar';
}

export const DuasAndHadithView: React.FC<DuasAndHadithViewProps> = ({
  settings,
  initialTab,
}) => {
  const [subTab, setSubTab] = useState<'duas' | 'hadith' | 'names' | 'seerah' | 'calendar'>(
    initialTab || 'duas'
  );

  useEffect(() => {
    if (initialTab) {
      setSubTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string>('all');
  const [selectedHadithCategory, setSelectedHadithCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    StorageService.getBookmarks().map((b) => b.id)
  );

  const hijri = getEstimatedHijriDate();

  const arabicSize = settings?.arabicFontSize || 'medium';
  const transSize = settings?.translationFontSize || 'medium';

  const arabicSizeClass: Record<string, string> = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
  };

  const transSizeClass: Record<string, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg',
  };

  const handleCopy = (id: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleDuaBookmark = (dua: DuaItem) => {
    DuaService.toggleBookmark(dua);
    setBookmarkedIds(StorageService.getBookmarks().map((b) => b.id));
  };

  const toggleHadithBookmark = (hadith: HadithItem) => {
    HadithService.toggleBookmark(hadith);
    setBookmarkedIds(StorageService.getBookmarks().map((b) => b.id));
  };

  const duaCategories = useMemo(() => DuaService.getCategories(), []);
  const hadithCategories = useMemo(() => HadithService.getCategories(), []);

  const filteredDuas = useMemo(() => {
    return DuaService.searchDuas(searchQuery, selectedDuaCategory);
  }, [searchQuery, selectedDuaCategory]);

  const filteredHadith = useMemo(() => {
    return HadithService.searchHadiths(searchQuery, selectedHadithCategory);
  }, [searchQuery, selectedHadithCategory]);

  const filteredNames = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return NAMES_OF_ALLAH;
    return NAMES_OF_ALLAH.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.arabic.includes(q)
    );
  }, [searchQuery]);

  return (
    <div id="deenfirst_devotional_explore_view" className="space-y-6 animate-fade-in pb-24">
      {/* Sub Tabs Navigation */}
      <div className="grid grid-cols-5 gap-1 bg-stone-100 dark:bg-[#051712] p-1.5 rounded-2xl border border-stone-200 dark:border-emerald-500/20 shadow-sm">
        {[
          { id: 'duas', label: 'Duas', icon: Heart },
          { id: 'hadith', label: 'Hadith', icon: BookOpen },
          { id: 'names', label: '99 Names', icon: Crown },
          { id: 'seerah', label: 'Learn', icon: Sparkles },
          { id: 'calendar', label: 'Hijri', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id as any);
                setSearchQuery('');
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                isActive
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DUAS SECTION */}
      {subTab === 'duas' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search authentic Duas (morning, sleep, anxiety, ease)..."
              className="w-full bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {duaCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedDuaCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedDuaCategory === cat.id
                    ? 'bg-emerald-800 dark:bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#071d17] text-stone-700 dark:text-stone-300 border-emerald-800/10 dark:border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredDuas.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-[#071d17] rounded-2xl border border-dashed border-stone-300 dark:border-emerald-500/20">
                No supplications match "{searchQuery}".
              </div>
            ) : (
              filteredDuas.map((dua) => {
                const isBookmarked = bookmarkedIds.includes(dua.id);
                return (
                  <div
                    key={dua.id}
                    className="rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 space-y-3 transition hover:border-emerald-500/30 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {dua.title}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/15 dark:border-emerald-500/20 capitalize">
                          {dua.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(dua.id, `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}\n\n[${dua.reference}]`)}
                          className="text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-1.5 transition rounded-lg"
                          title="Copy supplication"
                        >
                          {copiedId === dua.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleDuaBookmark(dua)}
                          className="text-stone-400 hover:text-emerald-600 p-1.5 transition rounded-lg"
                          title="Bookmark supplication"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p
                      dir="rtl"
                      className={`font-arabic text-right text-stone-900 dark:text-emerald-100 py-1 leading-loose ${
                        arabicSizeClass[arabicSize]
                      }`}
                    >
                      {dua.arabic}
                    </p>

                    {dua.transliteration && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                        {dua.transliteration}
                      </p>
                    )}

                    <p
                      className={`text-stone-800 dark:text-stone-200 leading-relaxed font-ui ${
                        transSizeClass[transSize]
                      }`}
                    >
                      "{dua.translation}"
                    </p>

                    <p className="text-[11px] text-emerald-800 dark:text-emerald-400/90 font-medium pt-1 border-t border-stone-100 dark:border-white/5">
                      — {dua.reference}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. HADITH SECTION */}
      {subTab === 'hadith' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search authentic Hadith (intentions, character, mercy)..."
              className="w-full bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {hadithCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedHadithCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedHadithCategory === cat.id
                    ? 'bg-emerald-800 dark:bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#071d17] text-stone-700 dark:text-stone-300 border-emerald-800/10 dark:border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredHadith.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-[#071d17] rounded-2xl border border-dashed border-stone-300 dark:border-emerald-500/20">
                No Hadiths match "{searchQuery}".
              </div>
            ) : (
              filteredHadith.map((hadith) => {
                const isBookmarked = bookmarkedIds.includes(hadith.id);
                return (
                  <div
                    key={hadith.id}
                    className="rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 space-y-3 shadow-sm transition hover:border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                        {hadith.collection} #{hadith.hadithNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        {hadith.grade && (
                          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/20">
                            {hadith.grade}
                          </span>
                        )}
                        <button
                          onClick={() => handleCopy(hadith.id, `${hadith.narrator ? hadith.narrator + ':\n' : ''}${hadith.arabic ? hadith.arabic + '\n\n' : ''}"${hadith.translation}"\n\n— ${hadith.source}`)}
                          className="text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-1 transition rounded-lg"
                          title="Copy Hadith"
                        >
                          {copiedId === hadith.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleHadithBookmark(hadith)}
                          className="text-stone-400 hover:text-emerald-600 p-1 transition rounded-lg"
                          title="Bookmark Hadith"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {hadith.narrator && (
                      <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        {hadith.narrator}
                      </p>
                    )}

                    {hadith.arabic && (
                      <p
                        dir="rtl"
                        className={`font-arabic text-right text-stone-900 dark:text-emerald-100 py-1 leading-loose ${
                          arabicSizeClass[arabicSize]
                        }`}
                      >
                        {hadith.arabic}
                      </p>
                    )}

                    <p
                      className={`text-stone-800 dark:text-stone-200 leading-relaxed font-ui ${
                        transSizeClass[transSize]
                      }`}
                    >
                      "{hadith.translation}"
                    </p>

                    {hadith.keyLesson && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-800/10 dark:border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{hadith.keyLesson}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-white/5">
                      {hadith.source}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. 99 NAMES OF ALLAH (ASMA-UL-HUSNA) */}
      {subTab === 'names' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Names of Allah (Ar-Rahman, peace, forgiver)..."
              className="w-full bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
            <strong>Asma-ul-Husna (The 99 Beautiful Names):</strong> Rasulullah (ﷺ) said: "Allah has ninety-nine names; whoever enumerates and reflects upon them will enter Paradise." (Bukhari & Muslim)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNames.map((name) => (
              <div
                key={name.number}
                className="p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                    {name.number}
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                    {name.arabic}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {name.transliteration}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {name.meaning}
                  </p>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {name.explanation}
                </p>

                {name.foundInQuran && (
                  <p className="text-[10px] text-stone-400">
                    Reference: {name.foundInQuran}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SEERAH & ISLAMIC LEARNING SECTION */}
      {subTab === 'seerah' && (
        <div className="space-y-4">
          {SEERAH_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                <span className="uppercase tracking-wider text-[10px]">
                  {topic.category}
                </span>
                <span className="text-stone-500 dark:text-stone-400 font-normal">{topic.readTime}</span>
              </div>

              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {topic.title}
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {topic.subtitle}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-white/5">
                {topic.content.map((para, idx) => (
                  <p key={idx} className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-ui">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ISLAMIC CALENDAR SECTION */}
      {subTab === 'calendar' && (
        <div className="space-y-4">
          {/* Hijri Today Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 dark:from-[#082920] dark:to-[#041611] text-white border border-emerald-500/30 p-6 text-center space-y-2 shadow-xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold block">
              Estimated Hijri Date
            </span>
            <h2 className="text-2xl font-extrabold">
              {hijri.formatted}
            </h2>
            <p className="font-arabic text-2xl text-emerald-200">
              {hijri.day} {hijri.monthArabic} {hijri.year} هـ
            </p>
          </div>

          {/* Sighting disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/5 text-xs text-stone-600 dark:text-stone-300">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Islamic dates may vary slightly according to confirmed local moon sighting and regional calculation conventions.
            </p>
          </div>

          {/* Major Islamic Events */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider px-1">
              Major Islamic Observances & Holy Days
            </h3>

            {MAJOR_ISLAMIC_EVENTS.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/15 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {event.name}
                  </h4>
                  <span className="text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {event.hijriDay} {event.monthName}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {event.description}
                </p>
                {event.observanceNote && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    *{event.observanceNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
