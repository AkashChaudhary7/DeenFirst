import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  ChevronLeft,
  Trash2,
  Share2,
  Volume2,
  BookOpen,
  Heart,
  CircleDot,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { BookmarkItem, NavigationTab } from '../types';
import { StorageService } from '../services/storageService';
import { GlobalAudio } from '../services/audioService';

interface BookmarksViewProps {
  onBack: () => void;
  onNavigateTab: (tab: NavigationTab, subTab?: any) => void;
}

type FilterCategory = 'all' | 'ayah' | 'dua' | 'hadith' | 'dhikr';

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onBack, onNavigateTab }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => StorageService.getBookmarks());
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(StorageService.getBookmarks());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.toggleBookmark({ id } as any);
    setBookmarks(updated);
  };

  const handleCopy = (item: BookmarkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${item.title}\n${item.arabic ? item.arabic + '\n' : ''}${item.content || ''}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.type === activeCategory;
  });

  const counts = {
    all: bookmarks.length,
    ayah: bookmarks.filter((b) => b.type === 'ayah' || b.type === 'quran').length,
    dua: bookmarks.filter((b) => b.type === 'dua').length,
    hadith: bookmarks.filter((b) => b.type === 'hadith').length,
    dhikr: bookmarks.filter((b) => b.type === 'dhikr').length,
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'ayah':
      case 'quran':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'dua':
        return <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case 'hadith':
        return <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'dhikr':
        return <CircleDot className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bookmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const handleNavigateToSource = (item: BookmarkItem) => {
    if (item.type === 'ayah' || item.type === 'quran') {
      onNavigateTab('quran');
    } else if (item.type === 'dua') {
      onNavigateTab('duas');
    } else if (item.type === 'hadith') {
      onNavigateTab('hadith');
    } else if (item.type === 'dhikr') {
      onNavigateTab('dhikr');
    }
  };

  return (
    <div id="deenfirst_bookmarks_page" className="space-y-6 animate-fade-in pb-24">
      {/* Top Navigation Bar with Single "Back" label */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-emerald-500/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 py-1.5 px-3 rounded-xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-emerald-200">
          <Bookmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Saved Bookmarks</span>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'All Saved', count: counts.all },
          { key: 'ayah', label: "Qur'an Verses", count: counts.ayah },
          { key: 'dua', label: 'Duas', count: counts.dua },
          { key: 'hadith', label: 'Hadith', count: counts.hadith },
          { key: 'dhikr', label: 'Adhkar', count: counts.dhikr },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as FilterCategory)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeCategory === tab.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-3.5">
          {filteredBookmarks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigateToSource(item)}
              className="p-5 rounded-2xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 shadow-sm hover:border-emerald-500/40 transition cursor-pointer space-y-3 group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    {getCategoryIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <span className="text-[10px] text-stone-500 dark:text-stone-400">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleCopy(item, e)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-white/5 transition"
                    title="Copy Text"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => handleRemove(item.id, e)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Arabic Script */}
              {item.arabic && (
                <p
                  dir="rtl"
                  className="font-arabic text-xl sm:text-2xl text-right leading-relaxed text-stone-900 dark:text-emerald-100 py-1"
                >
                  {item.arabic}
                </p>
              )}

              {/* Translation / Content */}
              {item.content && (
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-ui">
                  "{item.content}"
                </p>
              )}

              {/* Footer with category and Open link */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-100 dark:border-white/5 text-stone-500 dark:text-stone-400">
                <span className="capitalize text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800/10 dark:border-emerald-500/20">
                  {item.type === 'ayah' ? "Qur'an" : item.type}
                </span>

                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>Open in {item.type === 'ayah' ? "Qur'an" : item.type}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#071d17] border border-emerald-800/15 dark:border-emerald-500/20 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No Bookmarks Saved Yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Tap the bookmark icon on any Qur'an Ayah, Supplication, Hadith, or Dhikr to save it here for quick daily reflection.
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTab('quran')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
            >
              Explore Qur'an
            </button>
            <button
              onClick={() => onNavigateTab('duas')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-emerald-800/15 dark:border-white/10 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition"
            >
              Browse Duas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
