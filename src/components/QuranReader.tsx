import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Filter,
  Sparkles,
  Play,
  Pause,
  Type,
  Layers,
  HeartHandshake,
  Compass,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { QuranSurah, QuranVerse, LanguageCode, AppSettings } from '../types';
import { QuranService } from '../services/quranService';
import { GlobalAudio } from '../services/audioService';
import { StorageService } from '../services/storageService';

interface QuranReaderProps {
  lang: LanguageCode;
  settings?: AppSettings;
  onUpdateSettings?: (updated: Partial<AppSettings>) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  lang,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'rabbana' | 'sajdah'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    StorageService.getBookmarks().map((b) => b.id)
  );
  // Verse loading state for full 114 Surahs
  const [surahVerses, setSurahVerses] = useState<QuranVerse[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);

  // Font preferences
  const arabicSize = settings?.arabicFontSize || 'medium';
  const transSize = settings?.translationFontSize || 'medium';
  const showTransliteration = settings?.showTransliteration !== false;

  const arabicSizeClass: Record<string, string> = {
    small: 'text-xl sm:text-2xl leading-relaxed',
    medium: 'text-2xl sm:text-3xl leading-loose',
    large: 'text-3xl sm:text-4xl leading-loose',
    xlarge: 'text-4xl sm:text-5xl leading-loose',
  };

  const transSizeClass: Record<string, string> = {
    small: 'text-xs leading-relaxed',
    medium: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed',
    xlarge: 'text-lg leading-relaxed',
  };

  const surahs = useMemo(() => QuranService.getAllSurahs(), []);
  const juzList = useMemo(() => QuranService.getAllJuz(), []);
  const rabbanaDuas = useMemo(() => QuranService.getRabbanaDuas(), []);
  const sajdahVerses = useMemo(() => QuranService.getSajdahVerses(), []);

  // Filter Surahs
  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) => {
      const matchesFilter =
        filterType === 'all' || s.revelationType.toLowerCase() === filterType;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesFilter;

      const matchesQuery =
        s.englishName.toLowerCase().includes(query) ||
        s.englishTranslation.toLowerCase().includes(query) ||
        s.name.includes(query) ||
        s.arabicName.includes(query) ||
        s.number.toString() === query;

      return matchesFilter && matchesQuery;
    });
  }, [surahs, searchQuery, filterType]);

  // Load verses whenever a Surah is opened
  useEffect(() => {
    if (!selectedSurah) {
      setSurahVerses([]);
      return;
    }

    let isMounted = true;
    setIsLoadingVerses(true);

    QuranService.loadSurahVerses(selectedSurah.number, lang)
      .then((verses) => {
        if (isMounted) {
          setSurahVerses(verses);
          setIsLoadingVerses(false);
        }
      })
      .catch((err) => {
        console.error('Error loading Surah verses', err);
        if (isMounted) {
          setIsLoadingVerses(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah, lang]);

  const toggleBookmark = (verse: QuranVerse) => {
    const updated = StorageService.toggleBookmark({
      id: `verse_${verse.surahNumber}_${verse.ayahNumber}`,
      type: 'ayah',
      title: `${verse.surahName} (${verse.surahNumber}:${verse.ayahNumber})`,
      content: verse.translation,
      arabic: verse.arabic,
    });
    setBookmarkedIds(updated.map((b) => b.id));
  };

  const handlePlayAudio = (verse: QuranVerse) => {
    const id = `verse_${verse.surahNumber}_${verse.ayahNumber}`;
    if (isPlayingAudio === id) {
      GlobalAudio.pause();
      setIsPlayingAudio(null);
    } else {
      const audioUrl = verse.audioUrl || QuranService.getAyahAudioUrl(verse.surahNumber, verse.ayahNumber);
      GlobalAudio.playAudio(audioUrl, `${verse.surahName} ${verse.ayahNumber}`);
      setIsPlayingAudio(id);
    }
  };

  const openSurahByNumber = (num: number) => {
    const target = surahs.find((s) => s.number === num);
    if (target) {
      setSelectedSurah(target);
      setActiveTab('surahs');
    }
  };

  return (
    <div id="deenfirst_quran_reader" className="space-y-5 animate-fade-in pb-24">
      {selectedSurah ? (
        /* SURAH VERSES READING VIEW */
        <div className="space-y-5">
          {/* Header Controls with Single "Back" label */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSurah(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 py-2 px-3 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Surah Banner Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 dark:from-[#082920] dark:to-[#041712] text-white border border-emerald-500/30 p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase bg-black/25 px-3 py-0.5 rounded-full border border-emerald-400/30">
                Surah #{selectedSurah.number} • {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} Ayahs
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-arabic text-emerald-200">
              {selectedSurah.name || selectedSurah.arabicName}
            </h2>
            <h3 className="text-xl font-bold tracking-tight">
              {selectedSurah.englishName}
            </h3>
            <p className="text-xs text-stone-200 italic">
              "{selectedSurah.englishNameTranslation || selectedSurah.englishTranslation}"
            </p>

            {/* Bismillah Header (all except Surah 9) */}
            {selectedSurah.number !== 9 && (
              <div className="pt-3 border-t border-white/15">
                <p className="font-arabic text-2xl text-emerald-200 py-1">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-[11px] text-stone-300">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful
                </p>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {isLoadingVerses && (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 text-center space-y-3 shadow-sm">
              <Loader2 className="w-7 h-7 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                Loading authentic Arabic text & translation for {selectedSurah.englishName}...
              </p>
            </div>
          )}

          {/* Verses List */}
          <div className="space-y-4">
            {surahVerses.map((verse) => {
              const verseId = `verse_${verse.surahNumber}_${verse.ayahNumber}`;
              const isBookmarked = bookmarkedIds.includes(verseId);
              const isPlaying = isPlayingAudio === verseId;

              return (
                <div
                  key={verseId}
                  className="rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 p-5 space-y-4 transition hover:border-emerald-500/40 shadow-sm"
                >
                  {/* Verse Top Bar: Number & Actions */}
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-emerald-900/40 pb-2.5">
                    <span className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                      {verse.ayahNumber}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePlayAudio(verse)}
                        className={`p-2 rounded-lg transition ${
                          isPlaying
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                        }`}
                        title="Recitation audio"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => toggleBookmark(verse)}
                        className={`p-2 rounded-lg transition ${
                          isBookmarked
                            ? 'text-emerald-600 bg-emerald-500/10'
                            : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5'
                        }`}
                        title="Bookmark Ayah"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text with Scaled Font */}
                  <div
                    dir="rtl"
                    className={`font-arabic text-right text-stone-900 dark:text-emerald-100 py-2 selection:bg-emerald-500/30 ${
                      arabicSizeClass[arabicSize]
                    }`}
                  >
                    {verse.arabic}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono mr-2 align-middle">
                      {verse.ayahNumber}
                    </span>
                  </div>

                  {/* Phonetic Transliteration */}
                  {showTransliteration && verse.transliteration && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                      {verse.transliteration}
                    </p>
                  )}

                  {/* Translation with Scaled Font */}
                  <p className={`text-stone-800 dark:text-stone-200 font-ui leading-relaxed ${
                    transSizeClass[transSize]
                  }`}>
                    {verse.translation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* QURAN DIRECTORY NAVIGATION */
        <div className="space-y-4">
          {/* Top Tabs: Surahs | Juz | 40 Rabbana | Sajdah */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 dark:bg-[#051712] rounded-2xl border border-stone-200 dark:border-emerald-500/20">
            <button
              onClick={() => setActiveTab('surahs')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'surahs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Surahs</span>
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'juz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>30 Juz</span>
            </button>
            <button
              onClick={() => setActiveTab('rabbana')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'rabbana'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Rabbana</span>
            </button>
            <button
              onClick={() => setActiveTab('sajdah')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'sajdah'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sajdah</span>
            </button>
          </div>

          {/* Directory Count Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              {activeTab === 'surahs' && `${filteredSurahs.length} of 114 Chapters`}
              {activeTab === 'juz' && 'All 30 Sections of the Qur\'an'}
              {activeTab === 'rabbana' && '40 Quranic Supplications (Rabbana)'}
              {activeTab === 'sajdah' && '14 Prostration Ayahs (Sajdat at-Tilawah)'}
            </span>
          </div>

          {/* SUB-VIEW 1: ALL 114 SURAHS */}
          {activeTab === 'surahs' && (
            <div className="space-y-3">
              {/* Search & Filter Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Surah by name, number, or Arabic..."
                  className="w-full bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              {/* Revelation Filter Pills */}
              <div className="flex gap-2">
                {(['all', 'meccan', 'medinan'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold capitalize transition ${
                      filterType === type
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {type === 'all' ? 'All Surahs (114)' : type}
                  </button>
                ))}
              </div>

              {/* Surah List Grid */}
              <div className="space-y-2">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => setSelectedSurah(surah)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition shadow-sm group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-mono font-bold flex items-center justify-center text-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                        {surah.number}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                          {surah.englishName}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {surah.englishTranslation || surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-arabic text-xl font-bold text-emerald-700 dark:text-emerald-300 block">
                        {surah.name || surah.arabicName}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-400">
                        {surah.revelationType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: 30 JUZ (PARAS) */}
          {activeTab === 'juz' && (
            <div className="space-y-2.5">
              {juzList.map((juz) => (
                <div
                  key={juz.juzNumber}
                  onClick={() => openSurahByNumber(juz.startSurahNumber)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition shadow-sm group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Small Number Icon Badge */}
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-full h-full text-emerald-600/20 dark:text-emerald-400/25 group-hover:text-emerald-600 group-hover:scale-105 transition-all fill-current"
                      >
                        <path d="M18 2 L22.5 6.5 L28.5 6.5 L29.5 12.5 L34 16.5 L31.5 22.5 L33.5 28.5 L27.5 29.5 L23.5 34 L18 32 L12.5 34 L8.5 29.5 L2.5 28.5 L4.5 22.5 L2 16.5 L6.5 12.5 L7.5 6.5 L13.5 6.5 Z" />
                      </svg>
                      <span className="absolute font-mono font-extrabold text-xs text-emerald-800 dark:text-emerald-300 group-hover:text-white transition">
                        {juz.juzNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
                        Juz {juz.juzNumber} • {juz.nameTransliteration}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        From {juz.startSurahName} ({juz.startSurahNumber}:{juz.startAyahNumber}) to {juz.endSurahName} ({juz.endSurahNumber}:{juz.endAyahNumber})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {juz.nameArabic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW 3: 40 RABBANA DUAS */}
          {activeTab === 'rabbana' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>The 40 Rabbana Supplications:</strong> Timeless prayers uttered by prophets and righteous servants immortalized in the Holy Qur'an.
              </div>

              <div className="space-y-3">
                {rabbanaDuas.map((dua) => (
                  <div
                    key={dua.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-white/5 pb-2">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        Dua #{dua.id} • {dua.surahName} ({dua.surahNumber}:{dua.ayahNumber})
                      </span>
                      <button
                        onClick={() => openSurahByNumber(dua.surahNumber)}
                        className="text-[11px] text-stone-500 hover:text-emerald-600 transition"
                      >
                        Read in Context →
                      </button>
                    </div>

                    <div
                      dir="rtl"
                      className={`font-arabic text-right text-stone-900 dark:text-emerald-100 ${
                        arabicSizeClass[arabicSize]
                      }`}
                    >
                      {dua.arabic}
                    </div>

                    {showTransliteration && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                        {dua.transliteration}
                      </p>
                    )}

                    <p className={`text-stone-800 dark:text-stone-200 font-ui leading-relaxed ${
                      transSizeClass[transSize]
                    }`}>
                      {dua.translation}
                    </p>

                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      💡 {dua.significance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: SAJDAH VERSES (PROSTRATIONS) */}
          {activeTab === 'sajdah' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Sajdat at-Tilawah (Prostrations of Recitation):</strong> When reading or hearing these verses, prostrating once before Allah is a cherished Sunnah of Rasulullah (ﷺ).
              </div>

              <div className="space-y-3">
                {sajdahVerses.map((sajdah, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-white/5 pb-2">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        Surah {sajdah.surahName} ({sajdah.surahNumber}:{sajdah.ayahNumber})
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        sajdah.isObligatory
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {sajdah.isObligatory ? 'Wajib / Emphasized' : 'Sunnah Mu\'akkadah'}
                      </span>
                    </div>

                    <div
                      dir="rtl"
                      className={`font-arabic text-right text-stone-900 dark:text-emerald-100 ${
                        arabicSizeClass[arabicSize]
                      }`}
                    >
                      {sajdah.arabic} ۩
                    </div>

                    <p className={`text-stone-800 dark:text-stone-200 font-ui leading-relaxed ${
                      transSizeClass[transSize]
                    }`}>
                      {sajdah.translation}
                    </p>

                    <button
                      onClick={() => openSurahByNumber(sajdah.surahNumber)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open Surah {sajdah.surahName}</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
