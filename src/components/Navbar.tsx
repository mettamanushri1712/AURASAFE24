import React from 'react';
import { Shield, Volume2, Globe, AlertTriangle, User, Beaker } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../locales/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeIncident: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeIncident,
  currentView,
  onNavigate,
  user,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      {/* Active Incident Urgent Banner */}
      {activeIncident && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>{t.sosActiveAlertTitle}</span>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="underline hover:text-red-100 cursor-pointer"
          >
            {language === 'te' ? 'వివరాలు చూడండి →' : 'View Incident →'}
          </button>
        </div>
      )}

      {/* Demo Mode Notice Bar */}
      {isDemoMode && !activeIncident && (
        <div className="bg-purple-900 text-purple-100 px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <Beaker className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-semibold text-amber-300">DEMO MODE ACTIVE:</span>
            <span className="truncate">{language === 'te' ? 'నోటిఫికేషన్లు సురక్షితంగా అనుకరించబడతాయి.' : 'Real SMS/WhatsApp won\'t be charged; alerts simulated.'}</span>
          </div>
          <button
            onClick={() => onNavigate('demo')}
            className="text-[11px] bg-purple-800 hover:bg-purple-700 px-2 py-0.5 rounded text-white font-medium shrink-0 ml-2"
          >
            {language === 'te' ? 'సిమ్యులేషన్ ల్యాబ్' : 'Simulation Lab'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-purple-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-700 bg-clip-text text-transparent">
                AURASAFE24
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                AI
              </span>
            </div>
            <p className="text-[11px] text-purple-600 font-medium -mt-1 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'dashboard'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onNavigate('map')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'map'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navMap}
          </button>
          <button
            onClick={() => onNavigate('voice')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'voice'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navVoice}
          </button>
          <button
            onClick={() => onNavigate('contacts')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'contacts'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navContacts}
          </button>
          <button
            onClick={() => onNavigate('checkin')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'checkin'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navCheckin}
          </button>
          <button
            onClick={() => onNavigate('nearby')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'nearby'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navNearby}
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'history'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navHistory}
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'admin'
                ? 'bg-purple-100 text-purple-900'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50'
            }`}
          >
            {t.navAdmin}
          </button>
        </nav>

        {/* Right Tools: Bilingual Selector & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Language Switcher */}
          <div className="flex items-center bg-purple-50 p-1 rounded-xl border border-purple-200 shadow-2xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'te'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
              title="తెలుగు భాషకు మారండి"
            >
              తెలుగు
            </button>
          </div>

          {/* User Profile shortcut */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
              currentView === 'profile'
                ? 'border-purple-600 bg-purple-50 text-purple-900'
                : 'border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 overflow-hidden flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-purple-700" />
              )}
            </div>
            <span className="text-xs font-bold hidden lg:inline max-w-[100px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
