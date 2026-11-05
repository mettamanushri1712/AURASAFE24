import React, { useState } from 'react';
import { Shield, Lock, Mail, Phone, User, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../locales/translations';

interface AuthViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');
  const [fullName, setFullName] = useState<string>('Preethika P');
  const [email, setEmail] = useState<string>('pentapreethika@gmail.com');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [password, setPassword] = useState<string>('aurasafe2026');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'FORGOT') {
      setResetMessage(
        language === 'te'
          ? 'పాస్‌వర్డ్ రీసెట్ లింక్ మీ ఈమెయిల్‌కు పంపబడింది (డెమో మోడ్).'
          : 'Password reset instructions have been sent to your email.'
      );
      setTimeout(() => {
        setResetMessage(null);
        setMode('LOGIN');
      }, 3000);
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: fullName.trim() || 'User',
      email: email.trim(),
      phone: phone.trim(),
      preferredLanguage: preferredLang,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      locationSharingEnabled: true,
      discreetTriggerEnabled: false,
      autoAlertDangerZones: true,
      escalationMode: 'ALL',
      checkinFrequencyMinutes: 30,
    };

    onLoginSuccess(newUser);
  };

  const handleAdminQuickLogin = () => {
    const adminUser: UserProfile = {
      id: 'admin-01',
      name: 'Safety Admin',
      email: 'admin@aurasafe24.org',
      phone: '+91 98765 00000',
      preferredLanguage: language,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      createdAt: new Date().toISOString(),
      locationSharingEnabled: true,
      discreetTriggerEnabled: false,
      autoAlertDangerZones: true,
      escalationMode: 'ALL',
      checkinFrequencyMinutes: 30,
    };
    onLoginSuccess(adminUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Language switch */}
        <div className="flex justify-end mb-4">
          <div className="bg-white p-1 rounded-xl border border-purple-200 shadow-2xs flex">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-purple-800 text-white' : 'text-purple-800 hover:bg-purple-50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'te' ? 'bg-purple-800 text-white' : 'text-purple-800 hover:bg-purple-50'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-800/20 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-900 to-indigo-700 bg-clip-text text-transparent">
            AURASAFE24
          </h1>
          <p className="text-xs text-purple-700 font-bold mt-0.5">
            {t.appTagline}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-purple-900/5 sm:rounded-3xl border border-purple-100">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">
              {mode === 'LOGIN' ? t.login : mode === 'REGISTER' ? t.register : 'Reset Password'}
            </h2>
            <div className="flex gap-2 text-xs font-bold">
              {mode !== 'LOGIN' && (
                <button
                  onClick={() => setMode('LOGIN')}
                  className="text-purple-700 hover:underline"
                >
                  {t.login}
                </button>
              )}
              {mode !== 'REGISTER' && (
                <button
                  onClick={() => setMode('REGISTER')}
                  className="text-purple-700 hover:underline"
                >
                  {t.register}
                </button>
              )}
            </div>
          </div>

          {resetMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Preethika P"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.emailAddress}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.phoneNumber}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 font-mono"
                  />
                </div>
              </div>
            )}

            {mode !== 'FORGOT' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password / పాస్‌వర్డ్
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => setMode('FORGOT')}
                      className="text-[11px] text-purple-700 hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            )}

            {mode === 'REGISTER' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.preferredLanguageLabel}
                </label>
                <select
                  value={preferredLang}
                  onChange={(e: any) => setPreferredLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{mode === 'LOGIN' ? t.login : mode === 'REGISTER' ? t.register : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
              Quick Test Access
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors"
              >
                Sign in as User
              </button>
              <button
                type="button"
                onClick={handleAdminQuickLogin}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Sign in as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
