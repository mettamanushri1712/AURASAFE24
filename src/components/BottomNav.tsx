import React from 'react';
import { Home, MapPin, Mic, Users, HeartHandshake, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onTriggerSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  language,
  onTriggerSos,
}) => {
  const t = translations[language];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-purple-100 shadow-lg px-2 py-1.5 flex items-center justify-around pb-safe">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentView === 'dashboard'
            ? 'text-purple-900 font-bold scale-105'
            : 'text-slate-500 hover:text-purple-700'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t.navHome}</span>
      </button>

      <button
        onClick={() => onNavigate('map')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentView === 'map'
            ? 'text-purple-900 font-bold scale-105'
            : 'text-slate-500 hover:text-purple-700'
        }`}
      >
        <MapPin className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t.navMap}</span>
      </button>

      {/* Floating Center SOS Quick Action on Mobile */}
      <button
        onClick={onTriggerSos}
        className="flex flex-col items-center -mt-5 group"
        aria-label="Red Alert SOS"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 border-4 border-white animate-pulse group-active:scale-95 transition-transform">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-extrabold text-red-600 mt-0.5">SOS</span>
      </button>

      <button
        onClick={() => onNavigate('voice')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentView === 'voice'
            ? 'text-purple-900 font-bold scale-105'
            : 'text-slate-500 hover:text-purple-700'
        }`}
      >
        <Mic className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t.navVoice}</span>
      </button>

      <button
        onClick={() => onNavigate('contacts')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentView === 'contacts'
            ? 'text-purple-900 font-bold scale-105'
            : 'text-slate-500 hover:text-purple-700'
        }`}
      >
        <Users className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t.navContacts}</span>
      </button>
    </div>
  );
};
