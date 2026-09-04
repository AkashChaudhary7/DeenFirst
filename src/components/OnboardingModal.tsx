import React, { useState } from 'react';
import { Sparkles, Compass, Shield, Check, Globe, ChevronRight } from 'lucide-react';
import { AppSettings, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/i18n';
import { CITIES_LIST } from '../services/prayerService';

interface OnboardingModalProps {
  onComplete: (updatedSettings: Partial<AppSettings>) => void;
  currentSettings: AppSettings;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  currentSettings,
}) => {
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentSettings.appLanguage);
  const [selectedCity, setSelectedCity] = useState(currentSettings.locationCity);
  const [intentions, setIntentions] = useState<string[]>([
    'salah',
    'mindfulness',
    'dhikr',
  ]);

  const toggleIntention = (id: string) => {
    setIntentions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const cityData = CITIES_LIST.find((c) => c.name === selectedCity) || CITIES_LIST[0];
    onComplete({
      appLanguage: selectedLang,
      quranLanguage: selectedLang,
      duaLanguage: selectedLang,
      locationCity: cityData.name,
      latitude: cityData.lat,
      longitude: cityData.lng,
      calculationMethod: (cityData.method as any) || 'MWL',
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[#09261E] border border-emerald-500/30 p-6 sm:p-8 text-stone-100 shadow-2xl relative my-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-7 bg-emerald-400'
                    : s < step
                    ? 'w-3 bg-emerald-600'
                    : 'w-3 bg-stone-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Step {step} of 5
          </span>
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-800/60 to-emerald-950/80 border border-emerald-500/30 flex items-center justify-center p-3 shadow-inner">
              <img src="/icon.svg" alt="DeenFirst" className="w-12 h-12" />
            </div>
            <div>
              <p className="font-arabic text-2xl text-emerald-300 mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-stone-100">
                Assalamu Alaikum
              </h2>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                Welcome to <strong className="text-emerald-400">DeenFirst</strong> — a quiet, sacred sanctuary and digital discipline companion designed for the modern Muslim.
              </p>
            </div>
            <div className="bg-black/25 rounded-2xl p-4 border border-white/5 text-left">
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "Whoever seeks the pleasure of Allah first, Allah will suffice them against the worries of the world."
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold py-3.5 px-6 shadow-lg shadow-emerald-900/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Begin With Bismillah</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Philosophy */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Core Philosophy
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-1">
                Deen First. Then the Digital World.
              </h2>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                Before opening distracting feeds or apps, DeenFirst invites you to take a brief 20-second spiritual pause.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Pause', desc: 'Break the unconscious phone reflex' },
                { title: 'Remember Allah', desc: 'Recite an Ayah, Dua, or Dhikr' },
                { title: 'Reflect', desc: 'Renew your intention and presence' },
                { title: 'Proceed', desc: 'Continue with clarity and barakah' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-200">{item.title}</h4>
                    <p className="text-xs text-stone-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-400 text-center italic">
              A loving reminder, never a punitive blocker.
            </p>

            <button
              onClick={() => setStep(3)}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold py-3.5 px-6 shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>I Understand</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Spiritual Intentions */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Personal Growth
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-1">
                What are your daily intentions?
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Select areas where you seek spiritual consistency:
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'salah', label: 'Pray all 5 Salah on time', icon: '🕌' },
                { id: 'quran', label: 'Daily Qur\'an recitation & reflection', icon: '📖' },
                { id: 'dhikr', label: 'Consistent morning & evening Dhikr', icon: '📿' },
                { id: 'mindfulness', label: 'Mindful phone habits & less doomscrolling', icon: '📱' },
                { id: 'ramadan', label: 'Ramadan preparation & fasting tracking', icon: '🌙' },
              ].map((item) => {
                const active = intentions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIntention(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-stone-100'
                        : 'bg-black/20 border-white/5 text-stone-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        active
                          ? 'bg-emerald-400 border-emerald-400 text-stone-950'
                          : 'border-stone-600'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold py-3.5 px-6 shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Language & Location */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Localization & Accuracy
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-1">
                Language & City
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Ensures exact prayer times, Qibla compass, and your preferred native language.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Choose App Language:</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                        selectedLang === lang.code
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-black/20 border-white/5 text-stone-300 hover:border-white/10'
                      }`}
                    >
                      <div>{lang.name}</div>
                      <div className="text-[10px] text-stone-400">{lang.nativeName}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Select Your City (for Prayer Times):</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#051410] border border-white/10 rounded-xl p-3 text-sm text-stone-200 focus:outline-none focus:border-emerald-500"
                >
                  {CITIES_LIST.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold py-3.5 px-6 shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Next: Digital Discipline</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 5: Digital Discipline Setup */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Digital Discipline
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-1">
                Protect Your Time & Heart
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                DeenFirst can prompt a spiritual pause before distracting apps. You can also test this gate anytime inside the app.
              </p>
            </div>

            <div className="bg-black/25 rounded-2xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-stone-200">
                  Ready to Start
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                You can configure protected apps, test the spiritual pause gate, and track your daily streak anytime in the app.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold py-3.5 px-6 shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Enter DeenFirst</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
