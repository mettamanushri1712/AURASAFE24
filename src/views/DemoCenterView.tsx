import React, { useState } from 'react';
import { 
  Beaker, Play, ShieldAlert, MapPin, Mic, Users, HeartPulse, 
  CheckCircle2, AlertTriangle, Send, Sparkles, Smartphone, Eye
} from 'lucide-react';
import { Language, RiskZone } from '../types';
import { translations } from '../locales/translations';

interface DemoCenterViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTriggerSos: () => void;
  onSimulateRiskZone: (zone: RiskZone) => void;
  onResetRiskZone: () => void;
  onSetSimulatedCoords: (coords: { latitude: number; longitude: number; address: string }) => void;
  onOpenCheckinPrompt: () => void;
  onNavigate: (view: string) => void;
  riskZones: RiskZone[];
  onTriggerDangerZoneAlert: (zone: RiskZone) => void;
}

export const DemoCenterView: React.FC<DemoCenterViewProps> = ({
  language,
  onLanguageChange,
  onTriggerSos,
  onSimulateRiskZone,
  onResetRiskZone,
  onSetSimulatedCoords,
  onOpenCheckinPrompt,
  onNavigate,
  riskZones,
  onTriggerDangerZoneAlert,
}) => {
  const [notificationPreview, setNotificationPreview] = useState<{
    channel: 'SMS' | 'WHATSAPP';
    recipient: string;
    message: string;
  } | null>(null);

  const t = translations[language];

  // Simulated Locations in Telangana / Andhra Pradesh
  const locations = [
    {
      name: 'Begumpet Metro Station (Safe Urban Corridor)',
      nameTe: 'బేగంపేట్ మెట్రో స్టేషన్ (సురక్షిత ప్రాంతం)',
      latitude: 17.4375,
      longitude: 78.4482,
      address: 'Near Begumpet Metro Station, Hyderabad, Telangana',
    },
    {
      name: 'Sanath Nagar Industrial Overpass (Caution Zone)',
      nameTe: 'సనత్‌నగర్ ఇండస్ట్రియల్ ఓవర్‌పాస్ (జాగ్రత్త ప్రాంతం)',
      latitude: 17.4520,
      longitude: 78.4350,
      address: 'Sanath Nagar Industrial Corridor, Hyderabad',
    },
    {
      name: 'Miyapur Outer Ring Road (High-Risk Advisory Zone)',
      nameTe: 'మియాపూర్ ఔటర్ రింగ్ రోడ్ (హై-రిస్క్ సలహా ప్రాంతం)',
      latitude: 17.4980,
      longitude: 78.3560,
      address: 'Isolated Stretch near Miyapur ORR Junction, Hyderabad',
    },
  ];

  const handleSimulateSms = () => {
    const mapsLink = 'https://maps.google.com/?q=17.4375,78.4482';
    const msg = language === 'te'
      ? `అత్యవసర హెచ్చరిక! Preethika P ప్రమాదంలో ఉండే అవకాశం ఉంది. దయచేసి వెంటనే సహాయం చేయండి. ప్రస్తుత లొకేషన్: ${mapsLink}. సమయం: ${new Date().toLocaleTimeString()}.`
      : `EMERGENCY ALERT! Preethika P may be in danger and needs assistance. Current location: ${mapsLink}. Time: ${new Date().toLocaleTimeString()}. Please contact her immediately.`;

    setNotificationPreview({
      channel: 'SMS',
      recipient: '+91 98765 11111 (Sunita - Mother)',
      message: msg,
    });
  };

  const handleSimulateWhatsApp = () => {
    const mapsLink = 'https://maps.google.com/?q=17.4375,78.4482';
    const msg = language === 'te'
      ? `🚨 *AURASAFE24 అత్యవసర హెచ్చరిక*\n\nPreethika P ప్రమాదంలో ఉండే అవకాశం ఉంది.\n📍 *లైవ్ లొకేషన్:* ${mapsLink}\n⏰ *సమయం:* ${new Date().toLocaleTimeString()}\n\nదయచేసి వెంటనే ఆమెను సంప్రదించండి లేదా 112 కి కాల్ చేయండి.`
      : `🚨 *AURASAFE24 EMERGENCY ALERT*\n\nPreethika P may be in danger and needs immediate assistance.\n📍 *Live Location:* ${mapsLink}\n⏰ *Timestamp:* ${new Date().toLocaleTimeString()}\n\nPlease contact her immediately or dial 112.`;

    setNotificationPreview({
      channel: 'WHATSAPP',
      recipient: '+91 98765 22222 (Ravi - Father)',
      message: msg,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Simulation Lab Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
            Interactive Test & Evaluation Suite
          </span>
          <span className="text-xs text-purple-200">Sandbox v2.0</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'te' ? 'AURASAFE24 సిమ్యులేషన్ ల్యాబ్' : 'AURASAFE24 Testing & Simulation Lab'}
        </h2>
        <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
          {language === 'te'
            ? 'అన్ని భద్రతా ఫీచర్లు, తెలుగు వాయిస్ అసిస్టెంట్, GPS రిస్క్ జోన్లు మరియు అత్యవసర నోటిఫికేషన్లను నిజమైన ఛార్జీలు లేకుండా ఇక్కడ పరీక్షించవచ్చు.'
            : 'Effortlessly test every major workflow—English & Telugu voice AI, geofenced risk triggers, simulated SMS/WhatsApp dispatches, and check-ins.'}
        </p>
      </div>

      {/* Test Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario 1: Language & Voice Assistant Test */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                1. Test Bilingual Voice Assistant
              </h3>
              <p className="text-[11px] text-slate-500">
                English & Telugu intent recognition
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Switch language and test voice queries like "నాకు భయంగా ఉంది" or "I am feeling unsafe" to test immediate emergency bypass.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                onLanguageChange('te');
                onNavigate('voice');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200"
            >
              Test in Telugu (తెలుగు)
            </button>
            <button
              onClick={() => {
                onLanguageChange('en');
                onNavigate('voice');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold"
            >
              Test in English
            </button>
          </div>
        </div>

        {/* Scenario 2: Test SOS Red Alert Workflow */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                2. Test RED ALERT SOS System
              </h3>
              <p className="text-[11px] text-slate-500">
                5s countdown, GPS broadcast, dispatch
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Opens the emergency confirmation modal with 5-second countdown, discreet trigger option, and live tracking initialization.
          </p>
          <button
            onClick={onTriggerSos}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger Test Red Alert Modal</span>
          </button>
        </div>

        {/* Scenario 3: Simulate Moving GPS into Risk Zones */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                3. Simulate GPS Risk Zone Geofence
              </h3>
              <p className="text-[11px] text-slate-500">
                Caution & High-Risk geofencing
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Move simulated coordinates into verified danger zones to test instant advisory banners and prompt check-ins:
          </p>
          <div className="space-y-1.5">
            {locations.map((loc, i) => (
              <button
                key={i}
                onClick={() => {
                  onSetSimulatedCoords(loc);
                  const matched = riskZones.find(
                    (rz) => rz.latitude.toFixed(2) === loc.latitude.toFixed(2)
                  );
                  if (matched && matched.riskLevel === 'HIGH_RISK') {
                    onTriggerDangerZoneAlert(matched);
                  } else if (matched && matched.riskLevel !== 'NORMAL') {
                    onSimulateRiskZone(matched);
                    onNavigate('map');
                  } else {
                    onResetRiskZone();
                    onNavigate('map');
                  }
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs border font-semibold transition-all flex items-center justify-between ${
                  loc.name.includes('High-Risk')
                    ? 'bg-red-50 hover:bg-red-100/80 border-red-200 text-red-950 font-bold'
                    : 'bg-slate-50 hover:bg-purple-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {loc.name.includes('High-Risk') && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
                  )}
                  <span>{language === 'te' ? loc.nameTe : loc.name}</span>
                </div>
                <Play className="w-3 h-3 text-purple-600 shrink-0" />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const highRiskZone = riskZones.find((rz) => rz.riskLevel === 'HIGH_RISK') || {
                id: 'rz-02',
                name: 'Miyapur Outer Ring Road Isolated Junction',
                nameTe: 'మియాపూర్ ఔటర్ రింగ్ రోడ్ జంక్షన్',
                description: 'High-risk advisory zone due to frequent infrastructure work and reduced mobile signal coverage.',
                descriptionTe: 'మౌలిక సదుపాయాల పనులు మరియు మొబైల్ సిగ్నల్ తక్కువగా ఉండే అధిక-ప్రమాద హెచ్చరిక ప్రాంతం.',
                riskLevel: 'HIGH_RISK' as const,
                latitude: 17.4980,
                longitude: 78.3560,
                radiusMeters: 900,
                dataSource: 'Cyberabad Police She Teams Advisory Report',
                lastUpdated: '2026-11-01',
                active: true,
              };
              onSetSimulatedCoords({
                latitude: highRiskZone.latitude,
                longitude: highRiskZone.longitude,
                address: 'Miyapur Outer Ring Road Isolated Junction, Hyderabad',
              });
              onTriggerDangerZoneAlert(highRiskZone);
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>⚡ Test Automatic Danger Zone Red Alert Trigger</span>
          </button>
        </div>

        {/* Scenario 4: Automated Safety Check-in Test */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                4. Test Automated Safety Check-in
              </h3>
              <p className="text-[11px] text-slate-500">
                3 responses & missed escalation
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tests the periodic prompt: "Are you safe right now?" with responses for "YES, I AM SAFE", "I NEED HELP", and "I AM NOT SURE".
          </p>
          <button
            onClick={onOpenCheckinPrompt}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Launch Check-in Dialog</span>
          </button>
        </div>
      </div>

      {/* Simulated Notification Dispatch Viewer */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Simulated Emergency Notification Dispatches
            </h3>
            <p className="text-xs text-slate-500">
              Preview the exact bilingual payloads formatted for Twilio SMS and WhatsApp Cloud API.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSimulateSms}
              className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200"
            >
              Preview SMS
            </button>
            <button
              onClick={handleSimulateWhatsApp}
              className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200"
            >
              Preview WhatsApp
            </button>
          </div>
        </div>

        {notificationPreview ? (
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-bold text-amber-300">
                GATEWAY: {notificationPreview.channel} (SIMULATED SANDBOX)
              </span>
              <span>RECIPIENT: {notificationPreview.recipient}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
              {notificationPreview.message}
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
            Click "Preview SMS" or "Preview WhatsApp" to view generated emergency alert payload.
          </div>
        )}
      </div>
    </div>
  );
};
