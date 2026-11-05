import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ShieldAlert, X, VolumeX, CheckCircle, Radio, Users, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discreet: boolean) => Promise<void>;
  language: Language;
  discreetDefault?: boolean;
  dangerZoneName?: string;
  dangerZoneLevel?: string;
  specifiedContactNames?: string[];
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language,
  discreetDefault = false,
  dangerZoneName,
  dangerZoneLevel,
  specifiedContactNames = [],
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isDiscreet, setIsDiscreet] = useState<boolean>(discreetDefault);
  const audioPlayedRef = useRef<boolean>(false);
  const intervalRef = useRef<any>(null);
  const t = translations[language];

  // Play synthetic web audio siren beep when opened for danger zone or manual SOS
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsSending(false);
      audioPlayedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (typeof window !== 'undefined' && !audioPlayedRef.current && !isDiscreet) {
      audioPlayedRef.current = true;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }
      } catch (e) {}
    }

    // 5-second countdown timer
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isSending) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSending(true);
    try {
      await onConfirm(isDiscreet);
    } finally {
      setIsSending(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-500 overflow-hidden text-center">
        {/* Urgent pulsing background ring */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-red-100/50 animate-ping pointer-events-none"></div>

        {/* Top Close Cancel Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Cancel"
          disabled={isSending}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-bounce">
          {dangerZoneName ? (
            <AlertTriangle className="w-10 h-10 text-red-600" />
          ) : (
            <ShieldAlert className="w-10 h-10 text-red-600" />
          )}
        </div>

        {dangerZoneName && (
          <div className="mb-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {language === 'te' ? 'డేంజర్ జోన్ ఆటోమేటిక్ అలర్ట్' : 'DANGER ZONE AUTO-TRIGGER'}
            </span>
            <div className="text-xs font-bold text-red-700 mt-1">
              {dangerZoneName}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-black text-red-700 tracking-tight mb-2">
          {dangerZoneName
            ? (language === 'te' ? 'ప్రమాదకర ప్రాంతం గుర్తించబడింది!' : 'Automatic Red Alert Triggered!')
            : t.sosModalTitle}
        </h2>

        <p className="text-sm sm:text-base font-bold text-slate-800 mb-4 leading-relaxed">
          {dangerZoneName
            ? (language === 'te'
                ? `మీరు ప్రమాదకర ప్రాంతంలోకి ప్రవేశించారు. తక్షణమే మీ కాంటాక్ట్స్‌కు రెడ్ అలర్ట్ పంపబడుతోంది.`
                : `You entered an active danger zone. Emergency Red Alert is being automatically broadcasted to all your specified contacts.`)
            : t.sosModalQuestion}
        </p>

        {/* Specified Contacts to be Notified */}
        <div className="mb-4 p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-left text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-950 mb-1">
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>
              {language === 'te' 
                ? `అలర్ట్ అందుకునే కాంటాక్ట్స్ (${specifiedContactNames.length}):` 
                : `Alerting Specified Contacts (${specifiedContactNames.length}):`}
            </span>
          </div>
          <p className="text-slate-600 text-[11px] truncate">
            {specifiedContactNames.length > 0
              ? specifiedContactNames.join(', ')
              : 'All 5 registered trusted contacts'}
          </p>
        </div>

        {/* Countdown Indicator */}
        <div className="mb-5 p-3.5 bg-red-50 rounded-2xl border border-red-200">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-red-800">
            <Radio className="w-4 h-4 animate-spin text-red-600" />
            <span>{t.sosModalCountdown}</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-extrabold text-base">
              {countdown}s
            </span>
          </div>
          <div className="w-full bg-red-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Discreet Trigger Toggle */}
        <div className="mb-5 flex items-center justify-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={isDiscreet}
              onChange={(e) => setIsDiscreet(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
            />
            <VolumeX className="w-4 h-4 text-slate-500" />
            <span>{t.sosModalDiscreetLabel}</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleConfirm}
            disabled={isSending}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-lg tracking-wide shadow-lg shadow-red-600/40 hover:from-red-700 hover:to-rose-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t.sosSending}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>{t.sosModalConfirmBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSending}
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm tracking-wide transition-colors cursor-pointer"
          >
            {t.sosModalCancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
