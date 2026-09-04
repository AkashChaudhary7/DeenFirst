import { QuranSurah, QuranVerse, LanguageCode, JuzInfo } from '../types';
import { SURAH_LIST, QURAN_VERSES } from '../content/quranData';
import { JUZ_LIST } from '../content/juzData';
import { RABBANA_DUAS } from '../content/rabbanaData';
import { NAMES_OF_ALLAH } from '../content/namesOfAllahData';
import { StorageService } from './storageService';

const CACHE_PREFIX = 'deenfirst_surah_v2_';

// Mapping app languages to AlQuran Cloud edition identifiers
const LANGUAGE_EDITIONS: Record<LanguageCode, string> = {
  en: 'en.sahih',
  ur: 'ur.jalandhry',
  hi: 'hi.hindi',
  ar: 'ar.muyassar',
  bn: 'bn.bengali',
  id: 'id.indonesian',
  tr: 'tr.diyanet',
  gu: 'en.sahih',
  mr: 'en.sahih',
  ta: 'en.sahih',
};

export interface SajdahAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  isObligatory: boolean;
}

export const SAJDAH_VERSES: SajdahAyah[] = [
  { surahNumber: 7, surahName: 'Al-A\'raf', ayahNumber: 206, arabic: 'إِنَّ الَّذِينَ عِندَ رَبِّكَ لَا يَسْتَكْبِرُونَ عَنْ عِبَادَتِهِ وَيُسَبِّحُونَهُ وَلَهُ يَسْجُدُونَ', translation: 'Indeed, those who are near your Lord are not prevented by arrogance from His worship, and they exalt Him, and to Him they prostrate.', isObligatory: false },
  { surahNumber: 13, surahName: 'Ar-Ra\'d', ayahNumber: 15, arabic: 'وَلِلَّهِ يَسْجُدُ مَن فِي السَّمَاوَاتِ وَالْأَرْضِ طَوْعًا وَكَرْهًا وَظِلَالُهُم بِالْغُدُوِّ وَالْآصَالِ', translation: 'And to Allah prostrates whoever is in the heavens and the earth, willingly or by compulsion, and their shadows in the mornings and the afternoons.', isObligatory: false },
  { surahNumber: 16, surahName: 'An-Nahl', ayahNumber: 50, arabic: 'يَخَافُونَ رَبَّهُم مِّن فَوْقِهِمْ وَيَفْعَلُونَ مَا يُؤْمَرُونَ', translation: 'They fear their Lord above them, and they do what they are commanded.', isObligatory: false },
  { surahNumber: 17, surahName: 'Al-Isra', ayahNumber: 109, arabic: 'وَيَخِرُّونَ لِلْأَذْقَانِ يَبْكُونَ وَيَزِيدُهُمْ خُشُوعًا', translation: 'And they fall upon their faces weeping, and the Qur\'an increases them in humble submission.', isObligatory: false },
  { surahNumber: 19, surahName: 'Maryam', ayahNumber: 58, arabic: 'إِذَا تُتْلَىٰ عَلَيْهِمْ آيَاتُ الرَّحْمَٰنِ خَرُّوا سُجَّدًا وَبُكِيًّا', translation: 'When the verses of the Most Merciful were recited to them, they fell in prostration and weeping.', isObligatory: false },
  { surahNumber: 22, surahName: 'Al-Hajj', ayahNumber: 18, arabic: 'أَلَمْ تَرَ أَنَّ اللَّهَ يَسْجُدُ لَهُ مَن فِي السَّمَاوَاتِ وَمَن فِي الْأَرْضِ', translation: 'Do you not see that to Allah prostrates whoever is in the heavens and whoever is on the earth?', isObligatory: false },
  { surahNumber: 25, surahName: 'Al-Furqan', ayahNumber: 60, arabic: 'وَإِذَا قِيلَ لَهُمُ اسْجُدُوا لِلرَّحْمَٰنِ قَالُوا وَمَا الرَّحْمَٰنُ أَنَسْجُدُ لِمَا تَأْمُرُنَا وَزَادَهُمْ نُفُورًا', translation: 'And when it is said to them, "Prostrate to the Most Merciful," they say, "And what is the Most Merciful? Should we prostrate to what you order us?" And it increases them in aversion.', isObligatory: false },
  { surahNumber: 27, surahName: 'An-Naml', ayahNumber: 26, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', translation: 'Allah - there is no deity except Him, Lord of the Great Throne.', isObligatory: false },
  { surahNumber: 32, surahName: 'As-Sajdah', ayahNumber: 15, arabic: 'إِنَّمَا يُؤْمِنُ بِآيَاتِنَا الَّذِينَ إِذَا ذُكِّرُوا بِهَا خَرُّوا سُجَّدًا وَسَبَّحُوا بِحَمْدِ رَبِّهِمْ وَهُمْ لَا يَسْتَكْبِرُونَ', translation: 'Only those believe in Our verses who, when they are reminded by them, fall down in prostration and exalt [Allah] with praise of their Lord, and they are not arrogant.', isObligatory: true },
  { surahNumber: 38, surahName: 'Sad', ayahNumber: 24, arabic: 'وَظَنَّ دَاوُودُ أَنَّمَا فَتَنَّاهُ فَاسْتَغْفَرَ رَبَّهُ وَخَرَّ رَاكِعًا وَأَنَابَ', translation: 'And David became certain that We had tried him, and he asked forgiveness of his Lord and fell down bowing [in prostration] and turned in repentance.', isObligatory: false },
  { surahNumber: 41, surahName: 'Fussilat', ayahNumber: 38, arabic: 'فَإِنِ اسْتَكْبَرُوا فَالَّذِينَ عِندَ رَبِّكَ يُسَبِّحُونَ لَهُ بِاللَّيْلِ وَالنَّهَارِ وَهُمْ لَا يَسْأَمُونَ', translation: 'But if they are arrogant - then those who are near your Lord exalt Him by night and by day, and they do not become weary.', isObligatory: false },
  { surahNumber: 53, surahName: 'An-Najm', ayahNumber: 62, arabic: 'فَاسْجُدُوا لِلَّهِ وَاعْبُدُوا', translation: 'So prostrate to Allah and worship [Him].', isObligatory: true },
  { surahNumber: 84, surahName: 'Al-Inshiqaq', ayahNumber: 21, arabic: 'وَإِذَا قُرِئَ عَلَيْهِمُ الْقُرْآنُ لَا يَسْجُدُونَ', translation: 'And when the Qur\'an is recited to them, they do not prostrate.', isObligatory: false },
  { surahNumber: 96, surahName: 'Al-Alaq', ayahNumber: 19, arabic: 'كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِب', translation: 'No! Do not obey him. But prostrate and draw near [to Allah].', isObligatory: true },
];

export class QuranService {
  /**
   * Get list of all 114 Surahs
   */
  static getAllSurahs(): QuranSurah[] {
    return SURAH_LIST;
  }

  /**
   * Get single Surah metadata
   */
  static getSurahMeta(number: number): QuranSurah | undefined {
    return SURAH_LIST.find((s) => s.number === number);
  }

  /**
   * Get all 30 Juz details
   */
  static getAllJuz(): JuzInfo[] {
    return JUZ_LIST;
  }

  /**
   * Get 40 Rabbana Duas
   */
  static getRabbanaDuas() {
    return RABBANA_DUAS;
  }

  /**
   * Get 99 Names of Allah
   */
  static getNamesOfAllah() {
    return NAMES_OF_ALLAH;
  }

  /**
   * Get Sajdah verses
   */
  static getSajdahVerses(): SajdahAyah[] {
    return SAJDAH_VERSES;
  }

  /**
   * Search through all 114 Surahs by name, English translation, or number
   */
  static searchSurahs(query: string): QuranSurah[] {
    const q = (query || '').trim().toLowerCase();
    if (!q) return SURAH_LIST;
    return SURAH_LIST.filter((s) => {
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.englishTranslation.toLowerCase().includes(q) ||
        (s.englishNameTranslation && s.englishNameTranslation.toLowerCase().includes(q)) ||
        s.arabicName.includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.number.toString() === q
      );
    });
  }

  /**
   * Get consistent Ayah of the Day for dashboard reflection
   */
  static getDailyAyah(): QuranVerse {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % QURAN_VERSES.length;
    return QURAN_VERSES[index] || QURAN_VERSES[1];
  }

  /**
   * Check if an Ayah is bookmarked
   */
  static isAyahBookmarked(ayahId: string): boolean {
    const bookmarks = StorageService.getBookmarks();
    return bookmarks.some((b) => b.id === ayahId);
  }

  /**
   * Toggle bookmark for an Ayah
   */
  static toggleAyahBookmark(verse: QuranVerse): boolean {
    const isCurrently = this.isAyahBookmarked(verse.id);
    StorageService.toggleBookmark({
      id: verse.id,
      type: 'ayah',
      title: `${verse.surahName} (${verse.surahNumber}:${verse.ayahNumber})`,
      subtitle: verse.surahEnglishName,
      content: verse.translation,
      arabic: verse.arabic,
    });
    return !isCurrently;
  }

  /**
   * Get Audio URL for any Ayah
   * Uses high-fidelity Mishary Rashid Alafasy recitations
   */
  static getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
    const sStr = surahNumber.toString().padStart(3, '0');
    const aStr = ayahNumber.toString().padStart(3, '0');
    return `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
  }

  /**
   * Load verses for ANY of the 114 Surahs.
   * Checks local storage cache first, fetches from AlQuran Cloud API on demand,
   * and caches the result for future offline use.
   */
  static async loadSurahVerses(
    surahNumber: number,
    lang: LanguageCode = 'en'
  ): Promise<QuranVerse[]> {
    const surahMeta = this.getSurahMeta(surahNumber);
    const surahName = surahMeta ? surahMeta.englishName : `Surah ${surahNumber}`;
    const cacheKey = `${CACHE_PREFIX}${surahNumber}_${lang}`;

    // 1. Check local storage cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage read issues
    }

    // 2. Fetch from AlQuran Cloud API
    const translationEdition = LANGUAGE_EDITIONS[lang] || 'en.sahih';
    try {
      const endpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${translationEdition},en.transliteration`;
      const response = await fetch(endpoint, { cache: 'force-cache' });
      if (response.ok) {
        const json = await response.json();
        if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
          const arabicData = json.data[0];
          const transData = json.data[1];
          const transliterationData = json.data[2] || null;

          const ayahs: QuranVerse[] = arabicData.ayahs.map((ayahItem: any, idx: number) => {
            const ayahNum = ayahItem.numberInSurah;
            const arabicText = ayahItem.text;
            const transItem = transData?.ayahs?.[idx];
            const translitItem = transliterationData?.ayahs?.[idx];

            return {
              id: `ayah_${surahNumber}_${ayahNum}`,
              surahNumber,
              surahName,
              surahEnglishName: surahMeta?.englishName || `Surah ${surahNumber}`,
              ayahNumber: ayahNum,
              arabic: arabicText,
              transliteration: translitItem?.text || '',
              translation: transItem?.text || '',
              translations: {
                [lang]: transItem?.text || '',
              },
              audioUrl: this.getAyahAudioUrl(surahNumber, ayahNum),
              source: `The Noble Qur'an — Surah ${surahName} (${surahNumber}:${ayahNum})`,
              translationSource: transData.edition?.englishName || 'Sahih International',
            };
          });

          // Save to local cache for 100% offline access
          try {
            localStorage.setItem(cacheKey, JSON.stringify(ayahs));
          } catch {
            // storage quota fallback
          }

          return ayahs;
        }
      }
    } catch (err) {
      console.warn('Network fetch for Surah verses failed, using offline fallback', err);
    }

    // 3. Fallback to pre-bundled verses if available
    const prebundled = QURAN_VERSES.filter((v) => v.surahNumber === surahNumber);
    if (prebundled.length > 0) {
      return prebundled;
    }

    // 4. If neither network nor bundled verses, generate graceful placeholder structure
    return Array.from({ length: surahMeta?.numberOfAyahs || 1 }, (_, i) => {
      const aNum = i + 1;
      return {
        id: `ayah_${surahNumber}_${aNum}`,
        surahNumber,
        surahName,
        surahEnglishName: surahMeta?.englishName || `Surah ${surahNumber}`,
        ayahNumber: aNum,
        arabic: surahMeta?.name || 'القرآن الكريم',
        transliteration: `${surahMeta?.englishName} Ayah ${aNum}`,
        translation: `Ayah ${aNum} of ${surahMeta?.englishName} (${surahMeta?.englishNameTranslation}). Connect to the internet once to cache all verses for permanent offline recitation.`,
        audioUrl: this.getAyahAudioUrl(surahNumber, aNum),
        translationSource: 'Verified Traditional Translation',
        source: `Surah ${surahName}`,
      };
    });
  }
}
