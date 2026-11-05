import React, { useState } from 'react';
import { 
  HeartHandshake, Clock, ShieldCheck, AlertCircle, Bell, 
  CheckCircle2, AlertTriangle, HelpCircle, Send, Play
} from 'lucide-react';
import { Language, SafetyStatus } from '../types';
import { translations } from '../locales/translations';
import { ApiService } from '../services/api';

interface SafetyCheckinViewProps {
  language: Language;
  onStatusChange: (status: SafetyStatus) => void;
  onTriggerSos: () => void;
  onOpenCheckinModal: () => void;
  userCoords?: { latitude: number; longitude: number };
}

export const SafetyCheckinView: React.FC<SafetyCheckinViewProps> = ({
  language,
  onStatusChange,
  onTriggerSos,
  onOpenCheckinModal,
  userCoords,
}) => {
  const [frequency, setFrequency] = useState<number>(30); // in minutes
  const [reminderDelay, setReminderDelay] = useState<number>(3); // minutes
  const [notifyOnSafe, setNotifyOnSafe] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const t = translations[language];

  const handleTestSafe = async () => {
    try {
      await ApiService.submitCheckin({
        userId: 'user-01',
        response: 'SAFE',
        latitude: userCoords?.latitude,
        longitude: userCoords?.longitude,
      });
      onStatusChange('SAFE');
      setStatusMessage(
        language === 'te'
          ? 'మీరు క్షేమంగా ఉన్నట్లు విజయవంతంగా నమోదైంది! "నేను సురక్షితంగా ఉన్నాను" అని కాంటాక్ట్స్‌కు షేర్ చేయబడింది.'
          : 'Status confirmed: SAFE. Automated peace-of-mind confirmation sent to emergency contacts.'
      );
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.checkinTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'te'
                ? 'మీరు సురక్షితంగా ఉన్నారో లేదో క్రమం తప్పకుండా అడిగి మీ కుటుంబ సభ్యులకు భరోసా కల్పిస్తుంది.'
                : 'Automated periodic check-ins that give your family peace of mind without false emergency panic.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCheckinModal}
          className="py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>{language === 'te' ? 'ఇప్పుడే చెక్-ఇన్ చేయండి' : 'Trigger Prompt Now'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Quick Check-in Interaction Cards */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">
          {t.checkinQuestion}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'te'
            ? 'ఈ క్రింది ఎంపికలలో ఒకదాన్ని ఎంచుకోండి:'
            : 'Select one of the three responses based on your current situation:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* YES, I AM SAFE */}
          <button
            onClick={handleTestSafe}
            className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-400 text-left transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-black text-emerald-950 text-sm">{t.checkinResponseSafe}</h4>
            <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
              {t.checkinResponseSafeDesc}
            </p>
          </button>

          {/* I NEED HELP */}
          <button
            onClick={onTriggerSos}
            className="p-5 rounded-2xl bg-red-50 hover:bg-red-100/80 border-2 border-red-400 text-left transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-black text-red-950 text-sm">{t.checkinResponseNeedHelp}</h4>
            <p className="text-[11px] text-red-800 mt-1 leading-relaxed">
              {t.checkinResponseNeedHelpDesc}
            </p>
          </button>

          {/* I AM NOT SURE */}
          <button
            onClick={onOpenCheckinModal}
            className="p-5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-400 text-left transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-black text-amber-950 text-sm">{t.checkinResponseNotSure}</h4>
            <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
              {t.checkinResponseNotSureDesc}
            </p>
          </button>
        </div>
      </div>

      {/* Check-in Schedule Configurations */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
          {language === 'te' ? 'చెక్-ఇన్ సెట్టింగ్స్ & కాన్ఫిగరేషన్' : 'Automated Schedule & Escalation Rules'}
        </h3>

        {/* Frequency selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            {t.checkinFrequencyLabel}: <span className="text-purple-700 font-black">{frequency} {language === 'te' ? 'నిమిషాలు' : 'Minutes'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60, 120].map((mins) => (
              <button
                key={mins}
                onClick={() => setFrequency(mins)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  frequency === mins
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {mins === 60 ? '1 Hour' : mins === 120 ? '2 Hours' : `${mins} Mins`}
              </button>
            ))}
          </div>
        </div>

        {/* Missed check-in countdown window */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            {language === 'te' ? 'స్పందించేందుకు గడువు (రిమైండర్ వ్యవధి)' : 'Missed Response Grace Window'}:{' '}
            <span className="text-purple-700 font-black">{reminderDelay} {language === 'te' ? 'నిమిషాలు' : 'Minutes'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10].map((mins) => (
              <button
                key={mins}
                onClick={() => setReminderDelay(mins)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  reminderDelay === mins
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {mins} {language === 'te' ? 'నిమి' : 'Min'}
              </button>
            ))}
          </div>
        </div>

        {/* Missed Check-in Safeguard Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{t.checkinMissedWarning}</span>
          </div>
          <p>{t.checkinMissedDesc}</p>
        </div>
      </div>
    </div>
  );
};
