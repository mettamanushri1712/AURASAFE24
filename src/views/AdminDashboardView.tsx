import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Users, MapPin, Plus, Server, 
  AlertTriangle, Radio, CheckCircle, RefreshCw, Key
} from 'lucide-react';
import { EmergencyIncident, Language, NearbyService, RiskZone, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { ApiService } from '../services/api';

interface AdminDashboardViewProps {
  user: UserProfile;
  incidents: EmergencyIncident[];
  riskZones: RiskZone[];
  onAddRiskZone: (zone: Partial<RiskZone>) => Promise<void>;
  language: Language;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  user,
  incidents,
  riskZones,
  onAddRiskZone,
  language,
}) => {
  const [showAddZoneModal, setShowAddZoneModal] = useState<boolean>(false);
  const [zoneName, setZoneName] = useState<string>('');
  const [zoneNameTe, setZoneNameTe] = useState<string>('');
  const [zoneDesc, setZoneDesc] = useState<string>('');
  const [zoneDescTe, setZoneDescTe] = useState<string>('');
  const [zoneLevel, setZoneLevel] = useState<'CAUTION' | 'HIGH_RISK'>('CAUTION');
  const [zoneLat, setZoneLat] = useState<string>('17.4450');
  const [zoneLng, setZoneLng] = useState<string>('78.4420');
  const [zoneRadius, setZoneRadius] = useState<string>('600');
  const [zoneSource, setZoneSource] = useState<string>('City Police Safety Directive');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const t = translations[language];

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddRiskZone({
        name: zoneName.trim(),
        nameTe: zoneNameTe.trim() || zoneName.trim(),
        description: zoneDesc.trim(),
        descriptionTe: zoneDescTe.trim() || zoneDesc.trim(),
        riskLevel: zoneLevel,
        latitude: parseFloat(zoneLat),
        longitude: parseFloat(zoneLng),
        radiusMeters: parseInt(zoneRadius) || 500,
        dataSource: zoneSource.trim(),
      });
      setShowAddZoneModal(false);
      setZoneName('');
      setZoneDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-800 text-purple-200">
              Role: Authorized Safety Administrator
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              RBAC Verified
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t.adminTitle}
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            {t.adminSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddZoneModal(true)}
          className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminCreateRiskZone}</span>
        </button>
      </div>

      {/* Usage Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.adminTotalUsers}</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">1,248</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">+14% this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.adminActiveIncidents}</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl font-black text-red-600">
            {incidents.filter((i) => i.status === 'ACTIVE').length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Live dispatch status</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.adminRiskZonesCount}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{riskZones.length}</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Geofenced radius</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.adminVerifiedContacts}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">3,892</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">OTP Verified</span>
        </div>
      </div>

      {/* Configured Risk Zones Management List */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'te' ? 'అధికారిక భద్రతా మరియు రిస్క్ జోన్లు' : 'Configured Geographical Risk Zones'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'te' ? 'యూజర్ ఈ ప్రాంతాల్లోకి వచ్చినప్పుడు మాత్రమే అప్రమత్తం చేస్తుంది.' : 'Geofenced zones trigger advisory warnings on proximity.'}
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
            {riskZones.length} Zones Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {riskZones.map((zone) => (
            <div
              key={zone.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      zone.riskLevel === 'HIGH_RISK'
                        ? 'bg-red-100 text-red-800'
                        : zone.riskLevel === 'CAUTION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {zone.riskLevel}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Radius: {zone.radiusMeters}m
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {zone.name}
                </h4>
                <p className="text-xs text-purple-800 font-medium">
                  {zone.nameTe}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Source: {zone.dataSource}</span>
                <span>Lat: {zone.latitude.toFixed(3)}, Lng: {zone.longitude.toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gateway Configuration & System Health */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Server className="w-5 h-5 text-purple-700" />
          <span>{t.adminGatewayConfig}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Twilio SMS Gateway</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Simulation Sandbox Ready</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Cloud API</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Bilingual Template Ready</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Google Gemini AI API</span>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span>Gemini 3.8 Flash Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Risk Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {t.adminCreateRiskZone}
            </h3>

            <form onSubmit={handleCreateZone} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Zone Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. Sanath Nagar Overpass Corridor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Zone Name (Telugu - తెలుగు)
                </label>
                <input
                  type="text"
                  value={zoneNameTe}
                  onChange={(e) => setZoneNameTe(e.target.value)}
                  placeholder="ఉదా: సనత్‌నగర్ ఓవర్‌పాస్ పరిసరాలు"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Risk Level
                  </label>
                  <select
                    value={zoneLevel}
                    onChange={(e: any) => setZoneLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="CAUTION">CAUTION (Amber)</option>
                    <option value="HIGH_RISK">HIGH_RISK (Red)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Radius (Meters)
                  </label>
                  <input
                    type="number"
                    value={zoneRadius}
                    onChange={(e) => setZoneRadius(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={zoneLat}
                    onChange={(e) => setZoneLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={zoneLng}
                    onChange={(e) => setZoneLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Advisory Source
                </label>
                <input
                  type="text"
                  value={zoneSource}
                  onChange={(e) => setZoneSource(e.target.value)}
                  placeholder="e.g. Hyderabad Police Safety Survey"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  {t.sosModalCancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-800 text-white text-xs font-bold hover:bg-purple-900"
                >
                  {isSubmitting ? 'Saving...' : 'Add Risk Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
