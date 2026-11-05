import React, { useState } from 'react';
import { 
  User, Mail, Phone, Globe, Shield, VolumeX, Save, 
  CheckCircle2, LogOut, ShieldAlert, Key
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../locales/translations';

interface ProfileSettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onOpenPermissions: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
  language,
  onLanguageChange,
  onLogout,
  onOpenPermissions,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [discreet, setDiscreet] = useState<boolean>(user.discreetTriggerEnabled);
  const [locationSharing, setLocationSharing] = useState<boolean>(user.locationSharingEnabled);
  const [autoAlertDanger, setAutoAlertDanger] = useState<boolean>(user.autoAlertDangerZones ?? true);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const t = translations[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      email,
      phone,
      preferredLanguage: language,
      discreetTriggerEnabled: discreet,
      locationSharingEnabled: locationSharing,
      autoAlertDangerZones: autoAlertDanger,
      avatarUrl: avatarUrl || undefined,
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.profileTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.profileSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.logout}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'te' ? 'మీ వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి!' : 'Profile and preferences successfully saved!'}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-purple-100 border-2 border-purple-300 overflow-hidden flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-purple-600" />
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {language === 'te' ? 'ప్రొఫైల్ ఫోటో లింక్' : 'Profile Photograph URL (Optional)'}
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.fullName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.emailAddress}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.phoneNumber}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.preferredLanguageLabel}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  language === 'en'
                    ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('te')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  language === 'te'
                    ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>
        </div>

        {/* Safety Preferences & Discreet Mode */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            {language === 'te' ? 'భద్రతా ప్రాధాన్యతలు' : 'Safety & Trigger Preferences'}
          </h3>

          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <VolumeX className="w-4 h-4 text-purple-700" />
                <span>{t.discreetModeTitle}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {t.discreetModeDesc}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={discreet}
                onChange={(e) => setDiscreet(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-700"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {language === 'te' ? 'ఆటోమేటిక్ లైవ్ లొకేషన్ షేరింగ్' : 'Automated Live Location Tracking'}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {language === 'te'
                  ? 'రెడ్ అలర్ట్ సమయంలో మీ కాంటాక్ట్స్‌కు లైవ్ GPS లింక్ నిరంతరం ప్రసారమవుతుంది.'
                  : 'Broadcast real-time coordinates to emergency contacts throughout an active emergency.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={locationSharing}
                onChange={(e) => setLocationSharing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-700"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-red-50/60 border border-red-200">
            <div>
              <div className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>{t.autoAlertDangerZonesTitle}</span>
              </div>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                {t.autoAlertDangerZonesDesc}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={autoAlertDanger}
                onChange={(e) => setAutoAlertDanger(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        {/* Permissions check shortcut */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenPermissions}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
          >
            {language === 'te' ? 'బ్రౌజర్ భద్రతా అనుమతులను సమీక్షించండి' : 'Review Browser Permissions (GPS, Mic)'}
          </button>

          <button
            type="submit"
            className="py-3 px-6 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveChangesBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
