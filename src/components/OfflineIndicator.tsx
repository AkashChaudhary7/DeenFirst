import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-emerald-950/90 text-emerald-200 text-xs font-medium py-1.5 px-4 backdrop-blur border-b border-emerald-500/20 shadow">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Working Offline — All cached Qur'an, Dhikr & Duas remain accessible.</span>
    </div>
  );
};
