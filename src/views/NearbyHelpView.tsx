import React, { useState } from 'react';
import { 
  PhoneCall, Navigation, Shield, HeartPulse, Building2, 
  MapPin, Clock, CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';
import { Language, NearbyService } from '../types';
import { translations } from '../locales/translations';

interface NearbyHelpViewProps {
  services: NearbyService[];
  userCoords: { latitude: number; longitude: number };
  language: Language;
}

export const NearbyHelpView: React.FC<NearbyHelpViewProps> = ({
  services,
  userCoords,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'POLICE' | 'WOMEN_HELPLINE' | 'HOSPITAL'>('ALL');
  const t = translations[language];

  // Calculate approximate distance in kilometers (Haversine Formula)
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const filtered = activeTab === 'ALL'
    ? services
    : services.filter((s) => s.category === activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Direct Emergency 112 Dial Shortcut */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-purple-700/80 text-purple-200">
              India Emergency Response Services
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              {t.nearbyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-lg">
              {t.nearbySubtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="tel:112"
              className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.callPolice112}</span>
            </a>
            <a
              href="tel:1091"
              className="py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.callWomenHelpline1091}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
          }`}
        >
          {t.filterAll}
        </button>
        <button
          onClick={() => setActiveTab('POLICE')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'POLICE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
          }`}
        >
          👮‍♀️ {t.filterPolice}
        </button>
        <button
          onClick={() => setActiveTab('WOMEN_HELPLINE')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'WOMEN_HELPLINE'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
          }`}
        >
          🛡️ {t.filterWomenHelpline}
        </button>
        <button
          onClick={() => setActiveTab('HOSPITAL')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'HOSPITAL'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
          }`}
        >
          🏥 {t.filterHospital}
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((service) => {
          const dist = getDistanceKm(
            userCoords.latitude,
            userCoords.longitude,
            service.latitude,
            service.longitude
          );

          let badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
          let categoryLabel = language === 'te' ? 'పోలీస్ స్టేషన్' : 'Police Station';

          if (service.category === 'HOSPITAL') {
            badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
            categoryLabel = language === 'te' ? 'ఆసుపత్రి & అత్యవసర విభాగం' : 'Hospital & Trauma Care';
          } else if (service.category === 'WOMEN_HELPLINE') {
            badgeBg = 'bg-purple-50 text-purple-700 border-purple-200';
            categoryLabel = language === 'te' ? 'సఖి మహిళా కేంద్రం' : 'Sakhi Women Crisis Center';
          } else if (service.category === 'EMERGENCY_AMBULANCE') {
            badgeBg = 'bg-orange-50 text-orange-700 border-orange-200';
            categoryLabel = language === 'te' ? 'అంబులెన్స్' : 'Emergency Ambulance';
          }

          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeBg}`}>
                    {categoryLabel}
                  </span>
                  <span className="text-xs font-extrabold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg font-mono">
                    {dist} {t.distanceKm}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {language === 'te' ? service.nameTe : service.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{language === 'te' ? service.addressTe : service.address}</span>
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 font-medium">
                  {service.is24x7 && (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {t.open24x7}
                    </span>
                  )}
                  {service.verified && (
                    <span className="flex items-center gap-1 text-purple-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Service
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                <a
                  href={`tel:${service.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{service.phone}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${service.latitude},${service.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.getDirections}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
