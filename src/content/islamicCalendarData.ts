import { IslamicEvent } from '../types';

export interface HijriMonthInfo {
  number: number;
  name: string;
  arabic: string;
  transliteration: string;
  isSacred: boolean; // Al-Ashhur al-Hurum (Muharram, Rajab, Dhul-Qi'dah, Dhul-Hijjah)
  significance: string;
}

export const HIJRI_MONTHS: HijriMonthInfo[] = [
  {
    number: 1,
    name: 'Muharram',
    arabic: 'مُحَرَّم',
    transliteration: 'Muḥarram',
    isSacred: true,
    significance: 'First month of the Islamic calendar. One of the four sacred months. Contains the Day of Ashura (10th Muharram).',
  },
  {
    number: 2,
    name: 'Safar',
    arabic: 'صَفَر',
    transliteration: 'Ṣafar',
    isSacred: false,
    significance: 'Second month. A normal month free of pre-Islamic superstitions as clarified by the Prophet (ﷺ).',
  },
  {
    number: 3,
    name: 'Rabi\' al-Awwal',
    arabic: 'رَبِيع الأَوَّل',
    transliteration: 'Rabīʿ al-Awwal',
    isSacred: false,
    significance: 'The blessed month in which the Messenger of Allah Muhammad (ﷺ) was born and immigrated (Hijrah) to Madinah.',
  },
  {
    number: 4,
    name: 'Rabi\' al-Thani',
    arabic: 'رَبِيع الآخِر',
    transliteration: 'Rabīʿ al-Thānī',
    isSacred: false,
    significance: 'Fourth month, also known as Rabi\' al-Akhir. A time of ongoing spiritual discipline and knowledge seeking.',
  },
  {
    number: 5,
    name: 'Jumada al-Awwal',
    arabic: 'جُمَادَى الأُولَى',
    transliteration: 'Jumādā al-Ūlā',
    isSacred: false,
    significance: 'Fifth month of the lunar calendar.',
  },
  {
    number: 6,
    name: 'Jumada al-Thani',
    arabic: 'جُمَادَى الآخِرَة',
    transliteration: 'Jumādā al-Ākhirah',
    isSacred: false,
    significance: 'Sixth month, also known as Jumada al-Akhirah.',
  },
  {
    number: 7,
    name: 'Rajab',
    arabic: 'رَجَب',
    transliteration: 'Rajab',
    isSacred: true,
    significance: 'One of the four sacred months. Month of Al-Isra\' wal-Mi\'raj. Gateway of preparation for Sha\'ban and Ramadan.',
  },
  {
    number: 8,
    name: 'Sha\'ban',
    arabic: 'شَعْبَان',
    transliteration: 'Shaʿbān',
    isSacred: false,
    significance: 'Month of heightened devotion in which deeds are raised to Allah. Contains Mid-Sha\'ban (15th) and frequent Sunnah fasting.',
  },
  {
    number: 9,
    name: 'Ramadan',
    arabic: 'رَمَضَان',
    transliteration: 'Ramaḍān',
    isSacred: false,
    significance: 'The holiest month of the year. Month of the Qur\'an, obligatory fasting (Sawm), Tarawih night prayers, and Laylat al-Qadr.',
  },
  {
    number: 10,
    name: 'Shawwal',
    arabic: 'شَوَّال',
    transliteration: 'Shawwāl',
    isSacred: false,
    significance: 'Tenth month. Begins with Eid al-Fitr. Highly recommended to fast 6 days during this month for the reward of fasting the whole year.',
  },
  {
    number: 11,
    name: 'Dhul-Qi\'dah',
    arabic: 'ذُو القَعْدَة',
    transliteration: 'Dhū al-Qaʿdah',
    isSacred: true,
    significance: 'One of the four sacred months. Month of peaceful travel and preparation for the major pilgrimage of Hajj.',
  },
  {
    number: 12,
    name: 'Dhul-Hijjah',
    arabic: 'ذُو الحِجَّة',
    transliteration: 'Dhū al-Ḥijjah',
    isSacred: true,
    significance: 'The month of Hajj. The first 10 days are the most virtuous days of the year, culminating in the Day of \'Arafah and Eid al-Adha.',
  },
];

export const MAJOR_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'event_start_ramadan',
    name: 'Beginning of Ramadan 🌙',
    arabicName: 'بداية شهر رمضان المبارك',
    hijriDay: 1,
    hijriMonth: 9,
    monthName: 'Ramadan',
    category: 'ramadan',
    description: 'The blessed month of obligatory fasting, intense Qur\'anic recitation, nocturnal prayers (Tarawih), and deep spiritual renewal.',
    observanceNote: 'Confirmed by physical or calculated sighting of the Ramadan crescent moon (Hilal).',
    sunnahActs: [
      'Intention (Niyyah) for fasting before Fajr',
      'Eating Suhoor and delaying it until near Fajr',
      'Hastening to break the fast (Iftar) with dates and water',
      'Daily Qur\'an recitation and completing a Khatam',
      'Performing Tarawih and Tahajjud prayers in congregation',
      'Giving generous charity and feeding fasting believers',
    ],
  },
  {
    id: 'event_last_ten_ramadan',
    name: 'Last 10 Nights of Ramadan',
    arabicName: 'العشر الأواخر من رمضان',
    hijriDay: 21,
    hijriMonth: 9,
    monthName: 'Ramadan',
    category: 'ramadan',
    description: 'The pinnacle of Ramadan where the Prophet (ﷺ) tightened his waist belt, stayed awake in prayer, and woke his family for I\'tikaf.',
    sunnahActs: [
      'Performing I\'tikaf (seclusion in the mosque)',
      'Seeking Laylat al-Qadr in the odd nights (21st, 23rd, 25th, 27th, 29th)',
      'Reciting the Dua: "Allahumma innaka \'afuwwun tuhibbul-\'afwa fa\'fu \'anni"',
      'Giving Sadaqah on odd nights',
    ],
  },
  {
    id: 'event_laylat_al_qadr',
    name: 'Laylat al-Qadr (Night of Power)',
    arabicName: 'ليلة القدر المباركة',
    hijriDay: 27,
    hijriMonth: 9,
    monthName: 'Ramadan',
    category: 'blessed_night',
    description: 'Better than a thousand months (83.3 years). The night the Qur\'an was first revealed from the Preserved Tablet to the lowest heaven.',
    observanceNote: 'Tradition emphasizes odd nights of the last 10 days, particularly the 27th night.',
    sunnahActs: [
      'Prolonged Qiyam al-Layl (night vigil prayers)',
      'Deep Istighfar (repentance) and heartfelt personal Dua',
      'Continuous Dhikr and Qur\'anic recitation until Fajr',
    ],
  },
  {
    id: 'event_eid_al_fitr',
    name: 'Eid al-Fitr (Festival of Breaking Fast)',
    arabicName: 'عيد الفطر المبارك',
    hijriDay: 1,
    hijriMonth: 10,
    monthName: 'Shawwal',
    category: 'eid',
    description: 'The joyous celebration marking the completion of Ramadan, celebrated with community prayer, Zakat al-Fitr, gratitude, and family unity.',
    sunnahActs: [
      'Paying Zakat al-Fitr before the Eid prayer',
      'Taking Ghusl (ritual bath) and wearing one\'s best clean clothes',
      'Eating an odd number of dates before leaving for the prayer',
      'Reciting Eid Takbeerat loudly on the way to the Musalla',
      'Taking alternate routes to and from the prayer ground',
      'Congratulating believers: "Taqabbal Allahu minna wa minkum"',
    ],
  },
  {
    id: 'event_six_days_shawwal',
    name: '6 Fasting Days of Shawwal',
    arabicName: 'صيام الست من شوال',
    hijriDay: 2,
    hijriMonth: 10,
    monthName: 'Shawwal',
    category: 'fasting',
    description: 'Fasting 6 voluntary days in Shawwal following Ramadan is equivalent to fasting an entire lifetime according to the Prophet (ﷺ) (Sahih Muslim).',
    sunnahActs: [
      'Fasting any 6 days throughout Shawwal (consecutive or scattered)',
      'Can be combined with Mondays and Thursdays for compounded reward',
    ],
  },
  {
    id: 'event_first_ten_dhul_hijjah',
    name: 'First 10 Days of Dhul-Hijjah',
    arabicName: 'عشر ذي الحجة المباركة',
    hijriDay: 1,
    hijriMonth: 12,
    monthName: 'Dhul-Hijjah',
    category: 'sacred_month',
    description: 'The best and most beloved 10 days in the entire year. Good deeds performed during these days surpass deeds in any other time.',
    sunnahActs: [
      'Fasting the first 9 days, especially the 9th (Day of Arafah)',
      'Abundant Takbeer (Allahu Akbar), Tahmeed (Alhamdulillah), and Tahleel (La ilaha illallah)',
      'Giving charity and reading Qur\'an frequently',
      'Refraining from cutting hair or nails if planning to sacrifice (Udhiyah/Qurbani)',
    ],
  },
  {
    id: 'event_day_of_arafah',
    name: 'Day of \'Arafah (Hajj Pinnacle)',
    arabicName: 'يوم عرفة',
    hijriDay: 9,
    hijriMonth: 12,
    monthName: 'Dhul-Hijjah',
    category: 'fasting',
    description: 'The greatest day of Hajj where millions gather on the plains of Arafat. Fasting for non-pilgrims expiates the sins of the preceding and succeeding year.',
    sunnahActs: [
      'Fasting the entire day for non-pilgrims',
      'Making abundant Dua: "La ilaha illallahu wahdahu la shareeka lah..."',
      'Repentance and seeking liberation from the Hellfire',
    ],
  },
  {
    id: 'event_eid_al_adha',
    name: 'Eid al-Adha (Festival of Sacrifice)',
    arabicName: 'عيد الأضحى المبارك',
    hijriDay: 10,
    hijriMonth: 12,
    monthName: 'Dhul-Hijjah',
    category: 'eid',
    description: 'Commemorates the ultimate devotion of Prophet Ibrahim (AS) and Prophet Ismail (AS). Observed with Eid prayer, animal sacrifice (Qurbani), and charity.',
    sunnahActs: [
      'Ghusl, wearing clean/best clothing, and reciting Takbeerat al-Tashreeq',
      'Delaying eating on Eid morning until after the Eid prayer',
      'Performing Qurbani/Udhiyah sacrifice and distributing meat to the poor, neighbors, and family',
      'Observing the Days of Tashreeq (11th, 12th, 13th) with gratitude and remembrance',
    ],
  },
  {
    id: 'event_islamic_new_year',
    name: 'Islamic New Year (1st Muharram)',
    arabicName: 'رأس السنة الهجرية',
    hijriDay: 1,
    hijriMonth: 1,
    monthName: 'Muharram',
    category: 'holiday',
    description: 'Marks the beginning of the Hijri year, commemorating the historic migration (Hijrah) of the Prophet (ﷺ) and Sahabah from Makkah to Madinah.',
    sunnahActs: [
      'Reflecting upon life, time, and setting spiritual resolutions for the new year',
      'Seeking forgiveness for the past year and blessings for the future',
      'Remembering that Muharram is one of the four sacred months',
    ],
  },
  {
    id: 'event_day_of_ashura',
    name: 'Day of Ashura (10th Muharram)',
    arabicName: 'يوم عاشوراء',
    hijriDay: 10,
    hijriMonth: 1,
    monthName: 'Muharram',
    category: 'fasting',
    description: 'Sunnah fasting day. Commemorates Allah saving Prophet Musa (AS) and the Children of Israel from Pharaoh. Expiates sins of the previous year.',
    sunnahActs: [
      'Fasting on the 10th of Muharram (Ashura)',
      'Fasting on the 9th (Tasu\'a) or 11th along with it to differ from other traditions',
      'Spending generously on one\'s family and dependents',
    ],
  },
  {
    id: 'event_mawlid',
    name: 'Mawlid an-Nabi (12th Rabi\' al-Awwal)',
    arabicName: 'ذكرى المولد النبوي الشريف',
    hijriDay: 12,
    hijriMonth: 3,
    monthName: 'Rabi\' al-Awwal',
    category: 'holiday',
    description: 'Commemoration of the birth and blessed life of the Prophet Muhammad (ﷺ), the mercy sent to all mankind.',
    observanceNote: 'Observance traditions vary regionally and across scholarly perspectives.',
    sunnahActs: [
      'Sending abundant Salawat upon the Prophet (ﷺ)',
      'Studying the Seerah (biography) and emulating his noble character and Sunnah',
      'Feeding the hungry and engaging in acts of kindness',
    ],
  },
  {
    id: 'event_isra_miraj',
    name: 'Al-Isra\' wal-Mi\'raj (27th Rajab)',
    arabicName: 'ذكرى الإسراء والمعراج',
    hijriDay: 27,
    hijriMonth: 7,
    monthName: 'Rajab',
    category: 'blessed_night',
    description: 'The miraculous Night Journey from Makkah to Al-Aqsa in Jerusalem and ascension through the heavens, where the 5 daily Salah prayers were commanded.',
    sunnahActs: [
      'Reflecting on the immense honor and gift of the five daily Salah',
      'Reconnecting with the sanctity of Masjid Al-Aqsa and Al-Quds',
      'Voluntary night prayer and Istighfar during the sacred month of Rajab',
    ],
  },
  {
    id: 'event_nisf_shaban',
    name: 'Mid-Sha\'ban (Laylat al-Bara\'ah)',
    arabicName: 'ليلة النصف من شعبان',
    hijriDay: 15,
    hijriMonth: 8,
    monthName: 'Sha\'ban',
    category: 'blessed_night',
    description: 'The 15th night of Sha\'ban. A night of seeking divine forgiveness, cleansing the heart of malice, and final spiritual preparation for Ramadan.',
    sunnahActs: [
      'Fasting during the day of 15th Sha\'ban (also a White Day)',
      'Night prayers and seeking forgiveness for oneself and loved ones',
      'Removing grudges, envy, and discord from one\'s heart',
    ],
  },
];

export const JUMUAH_SUNNAH_GUIDE = {
  title: 'Blessed Friday (Jumu\'ah) Observances',
  arabic: 'سُنَن وآداب يوم الجُمُعَة المبارك',
  description: 'Friday is the master of days (Sayyid al-Ayyam) and the weekly Eid of the Muslim Ummah.',
  sunnahActs: [
    {
      title: 'Taking Ghusl & Cleaning',
      desc: 'Performing full ritual bath (Ghusl), trimming nails, cleaning teeth with Miswak/brush, and wearing clean/white clothes.',
    },
    {
      title: 'Applying Fragrance (Itr)',
      desc: 'Applying pleasant non-alcoholic perfume before going to the mosque (for men).',
    },
    {
      title: 'Early Arrival at the Mosque',
      desc: 'Walking early to the Masjid with calmness and offering Tahiyyat al-Masjid before the Khutbah begins.',
    },
    {
      title: 'Reciting Surah Al-Kahf',
      desc: 'Whoever recites Surah Al-Kahf on Friday will have a light shining from beneath his feet to the clouds of the sky until the next Friday.',
    },
    {
      title: 'Abundant Salawat upon Prophet (ﷺ)',
      desc: 'Increasing blessings upon the Prophet: "Allahumma salli \'ala Muhammadin wa \'ala aali Muhammad".',
    },
    {
      title: 'The Hour of Acceptance (Sa\'at al-Ijabah)',
      desc: 'Seeking the special hour between Asr and Maghrib when Allah accepts every sincere supplication.',
    },
  ],
};

// Calculate accurate Hijri date using Intl API with fallback
export function getEstimatedHijriDate(date: Date = new Date()): {
  day: number;
  month: number;
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
} {
  try {
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

// Estimate Gregorian date for a given Hijri day/month relative to current reference date
export function estimateGregorianDateForHijri(
  targetDay: number,
  targetMonth: number,
  referenceDate: Date = new Date()
): { date: Date; daysDiff: number; formatted: string } {
  const currentHijri = getEstimatedHijriDate(referenceDate);

  // Approximate lunar month duration = 29.53059 days
  // Calculate difference in months and days
  let monthDiff = targetMonth - currentHijri.month;
  if (monthDiff < 0 || (monthDiff === 0 && targetDay < currentHijri.day)) {
    monthDiff += 12; // Next year's occurrence
  }

  const dayDiff = monthDiff * 29.53059 + (targetDay - currentHijri.day);
  const projectedTime = referenceDate.getTime() + Math.round(dayDiff) * 24 * 60 * 60 * 1000;
  const projectedDate = new Date(projectedTime);

  const formatted = projectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const daysRemaining = Math.max(0, Math.ceil((projectedDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    date: projectedDate,
    daysDiff: daysRemaining,
    formatted,
  };
}

// Retrieve upcoming major events sorted chronologically with countdowns
export function getUpcomingIslamicEvents(referenceDate: Date = new Date()): IslamicEvent[] {
  const enriched = MAJOR_ISLAMIC_EVENTS.map((event) => {
    const projection = estimateGregorianDateForHijri(event.hijriDay, event.hijriMonth, referenceDate);
    return {
      ...event,
      estimatedGregorian: projection.formatted,
      daysRemaining: projection.daysDiff,
    };
  });

  return enriched.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));
}

// Calculate the next Jumu'ah (Friday)
export function getNextJumuahDetails(referenceDate: Date = new Date()): {
  date: Date;
  formatted: string;
  daysRemaining: number;
  hijriFormatted: string;
} {
  const currentDay = referenceDate.getDay(); // 0 = Sunday, 5 = Friday
  let daysUntilFriday = (5 - currentDay + 7) % 7;
  if (daysUntilFriday === 0 && referenceDate.getHours() >= 18) {
    daysUntilFriday = 7; // If it's already Friday night, point to next Friday
  }

  const fridayDate = new Date(referenceDate.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
  const hijriAtFriday = getEstimatedHijriDate(fridayDate);

  return {
    date: fridayDate,
    formatted: fridayDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    daysRemaining: daysUntilFriday,
    hijriFormatted: hijriAtFriday.formatted,
  };
}

// Get White Fasting Days (Ayyam al-Beed: 13, 14, 15) for current or selected Hijri month
export function getWhiteDaysForHijriMonth(
  hijriMonth: number,
  referenceDate: Date = new Date()
): {
  days: number[];
  gregorianDates: string[];
  virtue: string;
} {
  const day13 = estimateGregorianDateForHijri(13, hijriMonth, referenceDate);
  const day14 = estimateGregorianDateForHijri(14, hijriMonth, referenceDate);
  const day15 = estimateGregorianDateForHijri(15, hijriMonth, referenceDate);

  return {
    days: [13, 14, 15],
    gregorianDates: [day13.formatted, day14.formatted, day15.formatted],
    virtue: 'Fasting the 3 White Days of each Islamic month is equivalent to fasting the entire year (Abu Dawud & Tirmidhi).',
  };
}
