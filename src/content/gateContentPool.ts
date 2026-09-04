import { DhikrItem, DuaItem, QuranVerse } from '../types';
import { QURAN_VERSES } from './quranData';
import { DHIKR_ITEMS } from './dhikrData';
import { DUAS_LIST } from './duasData';

export interface GateContentItem {
  id: string;
  type: 'ayah' | 'dhikr' | 'dua' | 'reflection';
  contextCategory: 'morning' | 'evening' | 'salah_approaching' | 'night' | 'distraction_intervention' | 'general';
  arabic?: string;
  transliteration?: string;
  translation: string;
  title: string;
  reference: string;
  recommendedDhikrCount?: number;
}

// Additional verified reflection prompts & authentic reminders
export const REFLECTION_POOL: GateContentItem[] = [
  {
    id: 'ref_1',
    type: 'reflection',
    contextCategory: 'distraction_intervention',
    arabic: 'وَفِي أَنفُسِكُمْ أَفَلَا تُبْصِرُونَ',
    transliteration: 'Wa fī anfusikum afalā tubṣirūn',
    translation: 'And in yourselves [are signs]; then will you not see?',
    title: 'Conscious Awareness',
    reference: 'Surah Adh-Dhariyat 51:21',
  },
  {
    id: 'ref_2',
    type: 'reflection',
    contextCategory: 'distraction_intervention',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا',
    transliteration: 'Yā ayyuhalladhīna āmanudh-kurullāha dhikran kathīrā',
    translation: 'O you who have believed, remember Allah with much remembrance.',
    title: 'Mindful Heart',
    reference: 'Surah Al-Ahzab 33:41',
  },
  {
    id: 'ref_3',
    type: 'reflection',
    contextCategory: 'night',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: 'Alā bidhikrillāhi taṭma\'innul-qulūb',
    translation: 'Unquestionably, by the remembrance of Allah hearts find rest.',
    title: 'Peace in Remembrance',
    reference: 'Surah Ar-Ra\'d 13:28',
  },
  {
    id: 'ref_4',
    type: 'reflection',
    contextCategory: 'salah_approaching',
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    transliteration: 'Innaṣ-ṣalāta kānat \'alal-mu\'minīna kitābam mawqūtā',
    translation: 'Indeed, prayer has been decreed upon the believers a decree of specified times.',
    title: 'Salah is Approaching',
    reference: 'Surah An-Nisa 4:103',
  },
  {
    id: 'ref_5',
    type: 'reflection',
    contextCategory: 'morning',
    arabic: 'فَاصْبِرْ عَلَىٰ مَا يَقُولُونَ وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ',
    transliteration: 'Fasbir \'alā mā yaqūlūna wa sabbiḥ biḥamdi Rabbika qabla ṭulū\'ish-shams',
    translation: 'And glorify the praise of your Lord before the rising of the sun and before its setting.',
    title: 'Morning Remembrance',
    reference: 'Surah Qaf 50:39',
  },
];

export class GateContentPool {
  /**
   * Return verified content dynamically matched to current context
   */
  static getContextualContent(context: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    isNearSalah: boolean;
    salahName?: string;
    level: 1 | 2 | 3 | 4;
  }): GateContentItem {
    // 1. If near Salah, prioritize Salah awareness
    if (context.isNearSalah) {
      return {
        id: 'gate_salah_alert',
        type: 'reflection',
        contextCategory: 'salah_approaching',
        arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
        transliteration: 'Ḥāfiẓū \'alaṣ-ṣalawāti waṣ-ṣalātil-wusṭā wa qūmū lillāhi qānitīn',
        translation: `Maintain with care the [obligatory] prayers. ${context.salahName || 'Salah'} is approaching.`,
        title: `${context.salahName || 'Salah'} First`,
        reference: 'Surah Al-Baqarah 2:238',
      };
    }

    // 2. Level 2 (Dhikr focus)
    if (context.level === 2) {
      const dhikrList = DHIKR_ITEMS.filter((d) => d.recommendedCount <= 33);
      const selected = dhikrList[Math.floor(Math.random() * dhikrList.length)] || DHIKR_ITEMS[0];
      return {
        id: selected.id,
        type: 'dhikr',
        contextCategory: 'general',
        arabic: selected.arabic,
        transliteration: selected.transliteration,
        translation: selected.translation,
        title: 'Tactile Dhikr Pause',
        reference: selected.sourceReference || 'Authentic Dhikr',
        recommendedDhikrCount: 11, // Standard Level 2 tactile pause is 11x
      };
    }

    // 3. Level 3 (Quran Ayah focus)
    if (context.level === 3) {
      const verse = QURAN_VERSES[Math.floor(Math.random() * QURAN_VERSES.length)];
      return {
        id: verse.id,
        type: 'ayah',
        contextCategory: 'general',
        arabic: verse.arabic,
        transliteration: verse.transliteration,
        translation: verse.translation,
        title: `Surah ${verse.surahName} (${verse.surahNumber}:${verse.ayahNumber})`,
        reference: `${verse.surahName} [${verse.surahNumber}:${verse.ayahNumber}]`,
      };
    }

    // 4. Level 1 & Level 4: Time-of-day adaptive rotation
    if (context.timeOfDay === 'morning') {
      const morningDua = DUAS_LIST.find((d) => d.category === 'morning') || DUAS_LIST[0];
      return {
        id: morningDua.id,
        type: 'dua',
        contextCategory: 'morning',
        arabic: morningDua.arabic,
        transliteration: morningDua.transliteration,
        translation: morningDua.translation,
        title: 'Morning Intention & Barakah',
        reference: morningDua.reference,
      };
    }

    if (context.timeOfDay === 'night') {
      const nightDua = DUAS_LIST.find((d) => d.category === 'anxiety' || d.category === 'forgiveness') || DUAS_LIST[1];
      return {
        id: nightDua.id,
        type: 'dua',
        contextCategory: 'night',
        arabic: nightDua.arabic,
        transliteration: nightDua.transliteration,
        translation: nightDua.translation,
        title: 'Night Reflection & Peace',
        reference: nightDua.reference,
      };
    }

    // Default distraction reflection
    const pool = [...REFLECTION_POOL, ...DHIKR_ITEMS.map((d) => ({
      id: d.id,
      type: 'dhikr' as const,
      contextCategory: 'general' as const,
      arabic: d.arabic,
      transliteration: d.transliteration,
      translation: d.translation,
      title: 'Remembrance of Allah',
      reference: d.sourceReference || 'Sunnah',
      recommendedDhikrCount: 11,
    }))];

    return pool[Math.floor(Math.random() * pool.length)];
  }
}
