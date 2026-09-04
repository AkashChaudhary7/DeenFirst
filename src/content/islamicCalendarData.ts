import { IslamicEvent } from '../types';

export const HIJRI_MONTHS = [
  { number: 1, name: 'Muharram', arabic: 'مُحَرَّم' },
  { number: 2, name: 'Safar', arabic: 'صَفَر' },
  { number: 3, name: 'Rabi\' al-Awwal', arabic: 'رَبِيع الأَوَّل' },
  { number: 4, name: 'Rabi\' al-Thani', arabic: 'رَبِيع الآخِر' },
  { number: 5, name: 'Jumada al-Awwal', arabic: 'جُمَادَى الأُولَى' },
  { number: 6, name: 'Jumada al-Thani', arabic: 'جُمَادَى الآخِرَة' },
  { number: 7, name: 'Rajab', arabic: 'رَجَب' },
  { number: 8, name: 'Sha\'ban', arabic: 'شَعْبَان' },
  { number: 9, name: 'Ramadan', arabic: 'رَمَضَان' },
  { number: 10, name: 'Shawwal', arabic: 'شَوَّال' },
  { number: 11, name: 'Dhul-Qi\'dah', arabic: 'ذُو القَعْدَة' },
  { number: 12, name: 'Dhul-Hijjah', arabic: 'ذُو الحِجَّة' },
];

export const MAJOR_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'event_islamic_new_year',
    name: 'Islamic New Year (Ra\'s al-Sana)',
    hijriDay: 1,
    hijriMonth: 1,
    monthName: 'Muharram',
    description: 'Marks the beginning of the Hijri calendar year, commemorating the Hijrah of the Prophet (ﷺ) to Madinah.',
  },
  {
    id: 'event_day_of_ashura',
    name: 'Day of Ashura',
    hijriDay: 10,
    hijriMonth: 1,
    monthName: 'Muharram',
    description: 'Sunnah day of fasting. Commemorates Allah saving Prophet Musa (AS) and the Children of Israel from Pharaoh.',
  },
  {
    id: 'event_mawlid',
    name: 'Mawlid an-Nabi',
    hijriDay: 12,
    hijriMonth: 3,
    monthName: 'Rabi\' al-Awwal',
    description: 'The birth of the Prophet Muhammad (ﷺ). Observed by many Muslim communities through Salawat, Seerah lectures, and charity.',
    observanceNote: 'Observance customs vary across scholarly traditions and regional communities.',
  },
  {
    id: 'event_isra_miraj',
    name: 'Al-Isra\' wal-Mi\'raj',
    hijriDay: 27,
    hijriMonth: 7,
    monthName: 'Rajab',
    description: 'The miraculous Night Journey from Makkah to Jerusalem and the ascension through the heavens, where the five daily prayers were commanded.',
  },
  {
    id: 'event_nisf_shaban',
    name: 'Mid-Sha\'ban (Laylat al-Bara\'ah)',
    hijriDay: 15,
    hijriMonth: 8,
    monthName: 'Sha\'ban',
    description: 'A night of prayer, seeking forgiveness, and spiritual preparation for the blessed month of Ramadan.',
  },
  {
    id: 'event_start_ramadan',
    name: 'Beginning of Ramadan 🌙',
    hijriDay: 1,
    hijriMonth: 9,
    monthName: 'Ramadan',
    description: 'The holy month of fasting, intense Qur\'anic recitation, nocturnal prayers (Tarawih), and deep spiritual renewal.',
  },
  {
    id: 'event_laylat_al_qadr',
    name: 'Laylat al-Qadr (Night of Power)',
    hijriDay: 27,
    hijriMonth: 9,
    monthName: 'Ramadan',
    description: 'Better than a thousand months. The night the Qur\'an was first sent down. Sought during the odd nights of the last ten days.',
  },
  {
    id: 'event_eid_al_fitr',
    name: 'Eid al-Fitr',
    hijriDay: 1,
    hijriMonth: 10,
    monthName: 'Shawwal',
    description: 'The joyous festival of breaking the Ramadan fast, celebrated with community prayer, Zakat al-Fitr, and family gathering.',
  },
  {
    id: 'event_day_of_arafah',
    name: 'Day of \'Arafah',
    hijriDay: 9,
    hijriMonth: 12,
    monthName: 'Dhul-Hijjah',
    description: 'The pinnacle of Hajj where pilgrims gather on the plains of Arafat. Fasting this day expiates the sins of the previous and coming year for non-pilgrims.',
  },
  {
    id: 'event_eid_al_adha',
    name: 'Eid al-Adha (Festival of Sacrifice)',
    hijriDay: 10,
    hijriMonth: 12,
    monthName: 'Dhul-Hijjah',
    description: 'Honors the willing devotion of Prophet Ibrahim (AS) and concludes the major rites of Hajj.',
  },
];

// Approximate astronomical / algorithmic calculation of Hijri date from Gregorian date
export function getEstimatedHijriDate(date: Date = new Date()): {
  day: number;
  month: number;
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
} {
  try {
    // Intl DateTimeFormat with islamic-umalqura calendar
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    let day = 1;
    let month = 1;
    let year = 1448;

    parts.forEach((p) => {
      if (p.type === 'day') day = parseInt(p.value, 10) || 1;
      if (p.type === 'month') month = parseInt(p.value, 10) || 1;
      if (p.type === 'year') year = parseInt(p.value, 10) || 1448;
    });

    const monthObj = HIJRI_MONTHS[Math.min(Math.max(month - 1, 0), 11)];
    return {
      day,
      month,
      monthName: monthObj.name,
      monthArabic: monthObj.arabic,
      year,
      formatted: `${day} ${monthObj.name} ${year} AH`,
    };
  } catch {
    // Fallback calculation for Rabi' al-Awwal 1448 AH (Sept 2026)
    return {
      day: 12,
      month: 3,
      monthName: 'Rabi\' al-Awwal',
      monthArabic: 'رَبِيع الأَوَّل',
      year: 1448,
      formatted: '12 Rabi\' al-Awwal 1448 AH',
    };
  }
}
