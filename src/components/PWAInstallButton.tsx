import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-md transition active:scale-95 ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
        }`}
        title="Install DeenFirst PWA"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-full border border-emerald-600/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/10 transition active:scale-95 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#09261E] border border-emerald-500/30 p-6 text-stone-100 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-emerald-300">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-stone-300">
                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                  <Share className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>1. Tap the <strong>Share</strong> button in Safari\'s bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <p>Open <strong>DeenFirst</strong> anytime offline from your home screen.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/30 transition"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
