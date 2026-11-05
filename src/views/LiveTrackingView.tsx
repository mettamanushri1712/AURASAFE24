import React, { useState } from 'react';
import { 
  MapPin, Share2, Shield, AlertTriangle, Radio, Navigation, 
  RefreshCw, Check, Copy, ExternalLink, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { Language, NearbyService, RiskZone } from '../types';
import { translations } from '../locales/translations';
import { InteractiveMap } from '../components/InteractiveMap';

interface LiveTrackingViewProps {
  coords: { latitude: number; longitude: number; accuracy?: number; address?: string };
  isGpsActive: boolean;
  onRefreshLocation: () => void;
  riskZones: RiskZone[];
  services: NearbyService[];
  language: Language;
  onTriggerSos: () => void;
  onTriggerCheckin: () => void;
  currentRiskZone?: RiskZone | null;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  coords,
  isGpsActive,
  onRefreshLocation,
  riskZones,
  services,
  language,
  onTriggerSos,
  onTriggerCheckin,
  currentRiskZone,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const t = translations[language];

  const shareLink = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleNativeShare = async () => {
    const textMsg = language === 'te'
      ? `నేను AURASAFE24 లైవ్ GPS రక్షణలో ఉన్నాను. నా ప్రస్తుత లొకేషన్: ${shareLink}`
      : `I am sharing my live GPS location protected by AURASAFE24: ${shareLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AURASAFE24 Live Location',
          text: textMsg,
          url: shareLink,
        });
      } catch (e) {}
    } else {
      handleCopyLink();
    }
  };

  const filteredServices = filterCategory === 'ALL'
    ? services
    : services.filter(s => s.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Risk Zone Active Advisory Alert */}
      {currentRiskZone && (
        <div
          className={`p-5 rounded-3xl border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            currentRiskZone.riskLevel === 'HIGH_RISK'
              ? 'bg-red-50 border-red-300 text-red-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                currentRiskZone.riskLevel === 'HIGH_RISK'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/80">
                  {currentRiskZone.riskLevel === 'HIGH_RISK' ? t.riskZoneHighRiskTitle : t.riskZoneCautionTitle}
                </span>
                <span className="text-[11px] text-slate-500">{t.riskLastUpdatedLabel}: {currentRiskZone.lastUpdated}</span>
              </div>
              <h4 className="font-extrabold text-base mt-1">
                {language === 'te' ? currentRiskZone.nameTe : currentRiskZone.name}
              </h4>
              <p className="text-xs text-slate-700 mt-0.5">
                {language === 'te' ? currentRiskZone.descriptionTe : currentRiskZone.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 self-stretch sm:self-center">
            <button
              onClick={onTriggerCheckin}
              className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {t.riskZoneCheckinPrompt}
            </button>
            <button
              onClick={onTriggerSos}
              className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {t.riskZoneSosPrompt}
            </button>
          </div>
        </div>
      )}

      {/* Top Controls Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === 'te' ? 'లైవ్ GPS మ్యాప్ & రక్షణ పర్యవేక్షణ' : 'Live GPS Map & Safety Advisories'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {coords.address || (language === 'te' ? 'బేగంపేట్, హైదరాబాద్, తెలంగాణ' : 'Begumpet Metro, Hyderabad')} • Lat: {coords.latitude.toFixed(4)}, Lng: {coords.longitude.toFixed(4)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRefreshLocation}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh GPS Fix"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{language === 'te' ? 'రీఫ్రెష్' : 'Refresh GPS'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.shareLocationBtn}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy Map Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Leaflet Map */}
      <div className="relative">
        <InteractiveMap
          userLocation={coords}
          riskZones={riskZones}
          services={filteredServices}
          height="520px"
          language={language}
        />
      </div>

      {/* Service Category Filters & Geofence Safety Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nearby Services Filtering Card */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>{language === 'te' ? 'మ్యాప్‌లో చూపించాల్సిన కేంద్రాలు:' : 'Map Service Layers:'}</span>
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`py-1.5 px-3 rounded-xl border transition-colors ${
                filterCategory === 'ALL'
                  ? 'bg-purple-800 text-white border-purple-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilterCategory('POLICE')}
              className={`py-1.5 px-3 rounded-xl border transition-colors ${
                filterCategory === 'POLICE'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              👮‍♀️ {t.filterPolice}
            </button>
            <button
              onClick={() => setFilterCategory('WOMEN_HELPLINE')}
              className={`py-1.5 px-3 rounded-xl border transition-colors ${
                filterCategory === 'WOMEN_HELPLINE'
                  ? 'bg-purple-700 text-white border-purple-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🛡️ {t.filterWomenHelpline}
            </button>
            <button
              onClick={() => setFilterCategory('HOSPITAL')}
              className={`py-1.5 px-3 rounded-xl border transition-colors ${
                filterCategory === 'HOSPITAL'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🏥 {t.filterHospital}
            </button>
          </div>
        </div>

        {/* Advisory Transparency Note */}
        <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-100">
          <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-purple-700" />
            <span>{language === 'te' ? 'భద్రతా సూచనల పారదర్శకత' : 'Verified Safety Standards'}</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'రిస్క్ జోన్లు మరియు సలహాలు అధికారిక పోలీసు హెచ్చరికలు, వెలుతురు లేని ప్రాంతాల సర్వేల ఆధారంగా మాత్రమే నమోదు చేయబడతాయి. ఎవరి అంచనాల ఆధారంగా ప్రాంతాలను నిర్ణయించము.'
              : 'Geographical risk advisories are strictly configured from authorized police safety audits and infrastructure advisories. Entering a zone never triggers an automatic alert without your consent.'}
          </p>
        </div>
      </div>
    </div>
  );
};
