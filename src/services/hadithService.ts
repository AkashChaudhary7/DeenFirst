import { HADITH_ITEMS } from '../content/hadithData';
import { HadithItem } from '../types';
import { StorageService } from './storageService';

export interface HadithCategoryMeta {
  id: string;
  label: string;
  count: number;
}

export class HadithService {
  /**
   * Retrieve all authentic Hadith records
   */
  static getAllHadiths(): HadithItem[] {
    return HADITH_ITEMS;
  }

  /**
   * Get single Hadith by ID
   */
  static getHadithById(id: string): HadithItem | undefined {
    return HADITH_ITEMS.find((h) => h.id === id);
  }

  /**
   * Filter Hadiths by topical category
   */
  static getHadithsByCategory(category: string): HadithItem[] {
    if (!category || category === 'all') {
      return HADITH_ITEMS;
    }
    return HADITH_ITEMS.filter((h) => h.category === category);
  }

  /**
   * Get dynamic list of available categories with item counts
   */
  static getCategories(): HadithCategoryMeta[] {
    const counts: Record<string, number> = {};
    HADITH_ITEMS.forEach((h) => {
      counts[h.category] = (counts[h.category] || 0) + 1;
    });

    const categoryLabels: Record<string, string> = {
      faith: 'Faith & Intentions',
      character: 'Character & Manners',
      mercy: 'Mercy & Compassion',
      patience: 'Patience & Ease',
      charity: 'Charity & Generosity',
      knowledge: 'Sacred Knowledge',
      prayer: 'Salah & Worship',
      gratitude: 'Gratitude & Shukur',
      remembrance: 'Dhikr & Remembrance',
      deeds: 'Virtuous Deeds',
    };

    const categories: HadithCategoryMeta[] = Object.keys(counts).map((catKey) => ({
      id: catKey,
      label: categoryLabels[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1),
      count: counts[catKey],
    }));

    return [
      { id: 'all', label: 'All Traditions', count: HADITH_ITEMS.length },
      ...categories,
    ];
  }

  /**
   * Search through Hadith text, translation, collection, or narrator
   */
  static searchHadiths(query: string, category: string = 'all'): HadithItem[] {
    const q = (query || '').trim().toLowerCase();
    const list = this.getHadithsByCategory(category);

    if (!q) {
      return list;
    }

    return list.filter((h) => {
      const matchTrans = h.translation.toLowerCase().includes(q);
      const matchArabic = h.arabic ? h.arabic.includes(q) : false;
      const matchColl = h.collection.toLowerCase().includes(q);
      const matchNarr = h.narrator ? h.narrator.toLowerCase().includes(q) : false;
      const matchSource = h.source.toLowerCase().includes(q);
      const matchLesson = h.keyLesson ? h.keyLesson.toLowerCase().includes(q) : false;

      return matchTrans || matchArabic || matchColl || matchNarr || matchSource || matchLesson;
    });
  }

  /**
   * Get consistent Hadith of the Day based on the current calendar date
   */
  static getDailyHadith(): HadithItem {
    const now = new Date();
    // Compute day of year index for stable daily rotation
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % HADITH_ITEMS.length;
    return HADITH_ITEMS[index] || HADITH_ITEMS[0];
  }

  /**
   * Check if a Hadith is bookmarked in persistent storage
   */
  static isBookmarked(id: string): boolean {
    const bookmarks = StorageService.getBookmarks();
    return bookmarks.some((b) => b.id === id);
  }

  /**
   * Toggle bookmark for a Hadith item
   */
  static toggleBookmark(hadith: HadithItem): boolean {
    const isCurrently = this.isBookmarked(hadith.id);
    StorageService.toggleBookmark({
      id: hadith.id,
      type: 'hadith',
      title: `${hadith.collection} #${hadith.hadithNumber}`,
      subtitle: hadith.narrator || hadith.grade,
      content: hadith.translation,
      arabic: hadith.arabic,
    });
    return !isCurrently;
  }
}
