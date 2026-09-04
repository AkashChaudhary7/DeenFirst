import { DUAS_LIST } from '../content/duasData';
import { DuaItem } from '../types';
import { StorageService } from './storageService';

export interface DuaCategoryMeta {
  id: string;
  label: string;
  count: number;
}

export class DuaService {
  /**
   * Retrieve all authentic Dua records
   */
  static getAllDuas(): DuaItem[] {
    return DUAS_LIST;
  }

  /**
   * Get single Dua by ID
   */
  static getDuaById(id: string): DuaItem | undefined {
    return DUAS_LIST.find((d) => d.id === id);
  }

  /**
   * Filter Duas by category
   */
  static getDuasByCategory(category: string): DuaItem[] {
    if (!category || category === 'all') {
      return DUAS_LIST;
    }
    return DUAS_LIST.filter((d) => d.category === category);
  }

  /**
   * Get dynamic list of available categories with item counts
   */
  static getCategories(): DuaCategoryMeta[] {
    const counts: Record<string, number> = {};
    DUAS_LIST.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });

    const categoryLabels: Record<string, string> = {
      morning: 'Morning Supplications',
      evening: 'Evening Supplications',
      anxiety: 'Anxiety & Relief',
      forgiveness: 'Forgiveness (Istighfar)',
      parents: 'Parents & Family',
      knowledge: 'Seeking Knowledge',
      travel: 'Travel & Journey',
      protection: 'Divine Protection',
      sleep: 'Before Sleep & Night',
      food: 'Meals & Fasting',
      daily: 'Daily Activities',
      illness: 'Health & Healing',
      gratitude: 'Gratitude & Praise',
    };

    const categories: DuaCategoryMeta[] = Object.keys(counts).map((catKey) => ({
      id: catKey,
      label: categoryLabels[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1),
      count: counts[catKey],
    }));

    return [
      { id: 'all', label: 'All Duas', count: DUAS_LIST.length },
      ...categories,
    ];
  }

  /**
   * Search through Dua titles, Arabic, transliteration, translation, or reference
   */
  static searchDuas(query: string, category: string = 'all'): DuaItem[] {
    const q = (query || '').trim().toLowerCase();
    const list = this.getDuasByCategory(category);

    if (!q) {
      return list;
    }

    return list.filter((d) => {
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchTrans = d.translation.toLowerCase().includes(q);
      const matchTranslit = d.transliteration ? d.transliteration.toLowerCase().includes(q) : false;
      const matchArabic = d.arabic.includes(q);
      const matchRef = d.reference.toLowerCase().includes(q);

      return matchTitle || matchTrans || matchTranslit || matchArabic || matchRef;
    });
  }

  /**
   * Get consistent Dua of the Day based on calendar date
   */
  static getDailyDua(): DuaItem {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = (dayOfYear + 1) % DUAS_LIST.length;
    return DUAS_LIST[index] || DUAS_LIST[0];
  }

  /**
   * Check if a Dua is bookmarked in persistent storage
   */
  static isBookmarked(id: string): boolean {
    const bookmarks = StorageService.getBookmarks();
    return bookmarks.some((b) => b.id === id);
  }

  /**
   * Toggle bookmark for a Dua item
   */
  static toggleBookmark(dua: DuaItem): boolean {
    const isCurrently = this.isBookmarked(dua.id);
    StorageService.toggleBookmark({
      id: dua.id,
      type: 'dua',
      title: dua.title,
      subtitle: dua.reference,
      content: dua.translation,
      arabic: dua.arabic,
    });
    return !isCurrently;
  }
}
