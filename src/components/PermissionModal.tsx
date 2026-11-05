import React from 'react';
import { MapPin, Mic, Bell, Shield, Check } from 'lucide-react';
import { Language } from '../types';

interface PermissionModalProps {
  isOpen: boolean;
  onGrantAll: () => void;
  onDismiss: () => void;
  language: Language;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onGrantAll,
  onDismiss,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-600 flex items-center justify-center text-white shadow-md">
          <Shield className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          {language === 'te' ? 'భద్రతా అనుమతులు అవసరం' : 'Permissions for Your Safety'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {language === 'te'
            ? 'ఆపద సమయంలో తక్షణ సహాయం అందించడానికి మరియు మీ వాయిస్ ఆదేశాలను గుర్తించడానికి ఈ క్రింది అనుమతులను AURASAFE24 కోరుతోంది:'
            : 'To provide fast emergency alerts, voice commands, and risk alerts, AURASAFE24 requests explicit permission for:'}
        </p>

        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'te' ? 'GPS లొకేషన్' : 'GPS Location'}
              </div>
              <div className="text-[11px] text-slate-600">
                {language === 'te'
                  ? 'రెడ్ అలర్ట్ సమయంలో మీ కాంటాక్ట్స్‌కు లైవ్ లొకేషన్ లింక్ పంపడానికి మరియు రిస్క్ జోన్లను గుర్తించడానికి.'
                  : 'To send live Google Maps links to emergency contacts during SOS and detect risk zones.'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'te' ? 'మైక్రోఫోన్ (వాయిస్ అసిస్టెంట్)' : 'Microphone (Voice Assistant)'}
              </div>
              <div className="text-[11px] text-slate-600">
                {language === 'te'
                  ? 'తెలుగు మరియు ఇంగ్లీషులో మాట్లాడే అత్యవసర ఆదేశాలను నేరుగా గుర్తించడానికి.'
                  : 'To understand spoken safety commands in English and Telugu.'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'te' ? 'నోటిఫికేషన్లు' : 'Notifications'}
              </div>
              <div className="text-[11px] text-slate-600">
                {language === 'te'
                  ? 'షెడ్యూల్ చేసిన సేఫ్టీ చెక్-ఇన్లు మరియు భద్రతా సలహాలు అందించడానికి.'
                  : 'To deliver automated safety check-in reminders and risk advisories.'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onGrantAll}
            className="w-full py-3.5 px-6 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'te' ? 'అనుమతించండి మరియు కొనసాగించండి' : 'Grant Permissions & Continue'}</span>
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            {language === 'te' ? 'తరువాత అనుమతిస్తాను' : 'Decide Later (Manual Mode)'}
          </button>
        </div>
      </div>
    </div>
  );
};
