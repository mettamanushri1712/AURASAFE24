import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, X, Clock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface CheckinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResponse: (response: 'SAFE' | 'NEED_HELP' | 'NOT_SURE' | 'MISSED') => void;
  language: Language;
}

export const CheckinPromptModal: React.FC<CheckinPromptModalProps> = ({
  isOpen,
  onClose,
  onResponse,
  language,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const t = translations[language];

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(60);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onResponse('MISSED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-200 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Check-in Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-purple-950 mb-1">
          {t.checkinTitle}
        </h3>

        <p className="text-base font-bold text-slate-800 mb-4">
          {t.checkinQuestion}
        </p>

        {/* Missed countdown alert */}
        <div className="mb-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Clock className="w-4 h-4 text-amber-600 animate-spin" />
          <span>
            {language === 'te' ? 'స్పందించేందుకు మిగిలిన సమయం:' : 'Response window closes in:'} {secondsLeft}s
          </span>
        </div>

        {/* Three distinct responses */}
        <div className="space-y-3">
          {/* 1. YES, I AM SAFE */}
          <button
            onClick={() => {
              onResponse('SAFE');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold text-sm text-left flex items-center gap-3 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-emerald-900 text-base">{t.checkinResponseSafe}</div>
              <div className="text-xs text-emerald-700 font-normal">{t.checkinResponseSafeDesc}</div>
            </div>
          </button>

          {/* 2. I NEED HELP */}
          <button
            onClick={() => {
              onResponse('NEED_HELP');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-red-50 hover:bg-red-100 border-2 border-red-500 text-red-950 font-bold text-sm text-left flex items-center gap-3 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-red-900 text-base">{t.checkinResponseNeedHelp}</div>
              <div className="text-xs text-red-700 font-normal">{t.checkinResponseNeedHelpDesc}</div>
            </div>
          </button>

          {/* 3. I AM NOT SURE */}
          <button
            onClick={() => {
              onResponse('NOT_SURE');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-400 text-amber-950 font-bold text-sm text-left flex items-center gap-3 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-amber-900 text-base">{t.checkinResponseNotSure}</div>
              <div className="text-xs text-amber-800 font-normal">{t.checkinResponseNotSureDesc}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
