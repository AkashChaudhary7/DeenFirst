import React from 'react';
import { Home, BookOpen, CircleDot, Compass, User, Moon } from 'lucide-react';
import { NavigationTab, LanguageCode } from '../types';
import { getTranslation } from '../localization/i18n';

interface NavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  lang: LanguageCode;
  ramadanActive?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  lang,
  ramadanActive = false,
}) => {
  const tabs: { id: NavigationTab; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelKey: 'nav_home', icon: Home },
    { id: 'quran', labelKey: 'nav_quran', icon: BookOpen },
    { id: 'dhikr', labelKey: 'nav_dhikr', icon: CircleDot },
    { id: 'prayer', labelKey: 'nav_prayer', icon: Compass },
    { id: 'profile', labelKey: 'nav_profile', icon: User },
  ];

  return (
    <nav
      id="deenfirst_bottom_navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#061814]/95 backdrop-blur-md border-t border-stone-200 dark:border-emerald-500/20 safe-area-pb shadow-lg"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const label = getTranslation(lang, tab.labelKey);

          return (
            <button
              key={tab.id}
              id={`nav_btn_${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={isActive}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[50px] rounded-xl py-1 px-2 transition-all relative ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-emerald-600/15 dark:bg-emerald-400/20' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5 whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
