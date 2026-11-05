import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, MapPin, Mic, Users, HeartPulse, 
  HelpCircle, History, Share2, Radio, AlertTriangle, ChevronRight,
  ExternalLink, Sparkles
} from 'lucide-react';
import { EmergencyContact, Language, RiskZone, SafetyStatus, UserProfile } from '../types';
import { translations } from '../locales/translations';

interface DashboardViewProps {
  user: UserProfile;
  language: Language;
  safetyStatus: SafetyStatus;
  onStatusChange: (status: SafetyStatus) => void;
  coords: { latitude: number; longitude: number; accuracy?: number; address?: string };
  isGpsActive: boolean;
  onTriggerSos: () => void;
  onNavigate: (view: string) => void;
  onShareLocation: () => void;
  currentRiskZone?: RiskZone | null;
  onTriggerCheckinPrompt: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  language,
  safetyStatus,
  onStatusChange,
  coords,
  isGpsActive,
  onTriggerSos,
  onNavigate,
  onShareLocation,
  currentRiskZone,
  onTriggerCheckinPrompt,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Risk Zone Alert Banner (If user is currently inside Caution or High-Risk zone) */}
      {currentRiskZone && (
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-md flex items-start gap-3.5 transition-all ${
            currentRiskZone.riskLevel === 'HIGH_RISK'
              ? 'bg-red-50 border-red-300 text-red-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl shrink-0 ${
              currentRiskZone.riskLevel === 'HIGH_RISK'
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-amber-500 text-white'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  currentRiskZone.riskLevel === 'HIGH_RISK'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {currentRiskZone.riskLevel === 'HIGH_RISK'
                  ? t.riskZoneHighRiskTitle
                  : t.riskZoneCautionTitle}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentRiskZone.dataSource}
              </span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base mt-1">
              {language === 'te' ? currentRiskZone.nameTe : currentRiskZone.name}
            </h4>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              {currentRiskZone.riskLevel === 'HIGH_RISK'
                ? t.riskZoneHighRiskMsg
                : t.riskZoneCautionMsg}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={onTriggerSos}
                className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.riskZoneSosPrompt}</span>
              </button>
              <button
                onClick={onShareLocation}
                className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.riskZoneSharePrompt}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A. Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-700/50 text-purple-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AURASAFE24 AI Guardian • 24/7 Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {t.welcomeGreeting}
            </h1>
            <p className="text-sm sm:text-base text-purple-200 mt-1 max-w-xl">
              {t.howAreYouFeeling}
            </p>
          </div>

          {/* C. Safety Status Control */}
          <div className="bg-purple-900/60 backdrop-blur-md p-2 rounded-2xl border border-purple-700/50 flex flex-col sm:flex-row gap-1.5">
            <button
              onClick={() => onStatusChange('SAFE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                safetyStatus === 'SAFE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-purple-200 hover:bg-purple-800/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              <span>{t.statusSafe}</span>
            </button>
            <button
              onClick={() => onStatusChange('NEED_ASSISTANCE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                safetyStatus === 'NEED_ASSISTANCE'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-purple-200 hover:bg-purple-800/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              <span>{t.statusNeedAssistance}</span>
            </button>
            <button
              onClick={() => {
                onStatusChange('EMERGENCY');
                onTriggerSos();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                safetyStatus === 'EMERGENCY'
                  ? 'bg-red-600 text-white shadow-sm animate-pulse'
                  : 'text-purple-200 hover:bg-purple-800/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-300"></span>
              <span>{t.statusEmergency}</span>
            </button>
          </div>
        </div>
      </div>

      {/* B. Large Emergency Button (Prominent Centerpiece) */}
      <div className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-3xl border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="text-center mb-6 max-w-md">
          <span className="text-[11px] font-black uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-50 border border-red-200">
            Emergency Lifeline
          </span>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {language === 'te' 
              ? 'ఆపదలో ఉన్నప్పుడు తాకండి. తక్షణమే లైవ్ GPS మరియు సహాయ సందేశం కాంటాక్ట్స్‌కు వెళ్తుంది.' 
              : 'Tap in distress. Broadcasts your live coordinates, map link, and SOS alert instantly.'}
          </p>
        </div>

        {/* Pulsing SOS Button */}
        <div className="relative p-6 flex items-center justify-center">
          {/* Subtle multiple outer pulse rings */}
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-red-500/10 animate-ping pointer-events-none"></div>
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-red-500/20 animate-pulse pointer-events-none"></div>

          <button
            onClick={onTriggerSos}
            className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white shadow-2xl shadow-red-600/50 border-4 border-white flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all focus:outline-hidden focus:ring-4 focus:ring-red-400 select-none animate-sos-pulse"
            aria-label="Trigger Red Alert SOS"
          >
            <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-white mb-2 group-hover:scale-110 transition-transform drop-shadow-md" />
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-white drop-shadow-sm">
              {t.sosButtonText}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-red-100 tracking-tight mt-1 opacity-90 text-center px-4">
              {t.sosSubtext}
            </span>
          </button>
        </div>
      </div>

      {/* D. Current Location Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.currentLocationTitle}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isGpsActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-xs text-slate-500 font-medium">
                  {isGpsActive ? t.gpsActive : t.gpsInactive} • {t.liveTrackingActive}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('map')}
              className="py-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'te' ? 'మ్యాప్‌లో చూడండి' : 'Open Live Map'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onShareLocation}
              className="py-2 px-3.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.shareLocationBtn}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/60">
            <span className="text-[11px] font-semibold text-purple-900 block">{t.address}</span>
            <p className="text-xs text-slate-700 font-medium mt-1 truncate">
              {coords.address || (language === 'te' ? 'బేగంపేట్, హైదరాబాద్, తెలంగాణ' : 'Begumpet Metro Station, Hyderabad, Telangana')}
            </p>
          </div>
          <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/60">
            <span className="text-[11px] font-semibold text-purple-900 block">{t.latitude}</span>
            <p className="text-xs font-mono font-bold text-slate-800 mt-1">
              {coords.latitude ? coords.latitude.toFixed(6) : '17.437500'}
            </p>
          </div>
          <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/60">
            <span className="text-[11px] font-semibold text-purple-900 block">{t.longitude}</span>
            <p className="text-xs font-mono font-bold text-slate-800 mt-1">
              {coords.longitude ? coords.longitude.toFixed(6) : '78.448200'}
            </p>
          </div>
        </div>
      </div>

      {/* E. Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
          {t.quickActionsTitle}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Voice Assistant */}
          <button
            onClick={() => onNavigate('voice')}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionVoice}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionVoiceDesc}</p>
          </button>

          {/* 2. Emergency Contacts */}
          <button
            onClick={() => onNavigate('contacts')}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionContacts}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionContactsDesc}</p>
          </button>

          {/* 3. Share Location */}
          <button
            onClick={() => onNavigate('map')}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionShareLocation}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionShareLocationDesc}</p>
          </button>

          {/* 4. Safety Check-in */}
          <button
            onClick={onTriggerCheckinPrompt}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionCheckin}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionCheckinDesc}</p>
          </button>

          {/* 5. Nearby Help */}
          <button
            onClick={() => onNavigate('nearby')}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionNearbyHelp}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionNearbyHelpDesc}</p>
          </button>

          {/* 6. Alert History */}
          <button
            onClick={() => onNavigate('history')}
            className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-purple-50/60 border border-purple-100 shadow-sm text-left transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-700 group-hover:text-white transition-colors">
              <History className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{t.actionHistory}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.actionHistoryDesc}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
