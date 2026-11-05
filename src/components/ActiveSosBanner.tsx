import React, { useState } from 'react';
import { 
  ShieldAlert, PhoneCall, CheckCircle2, ChevronDown, ChevronUp, 
  MapPin, Send, AlertTriangle, MessageSquare, Phone, ExternalLink,
  RefreshCw, AlertCircle, Clock, Users, CheckCheck, XCircle
} from 'lucide-react';
import { EmergencyIncident, Language, ProviderNotificationStatus } from '../types';
import { translations } from '../locales/translations';

interface ActiveSosBannerProps {
  incident: EmergencyIncident;
  onResolve: (notes: string) => Promise<void>;
  onRetryFailed?: (contactId?: string) => Promise<void>;
  language: Language;
}

export const ActiveSosBanner: React.FC<ActiveSosBannerProps> = ({
  incident,
  onResolve,
  onRetryFailed,
  language,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isRetryingAll, setIsRetryingAll] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('Safe with family/friends');
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);

  const t = translations[language];

  const handleResolveClick = async () => {
    setIsResolving(true);
    try {
      await onResolve(notes);
      setShowNotesModal(false);
    } finally {
      setIsResolving(false);
    }
  };

  const handleRetryAll = async () => {
    if (!onRetryFailed) return;
    setIsRetryingAll(true);
    try {
      await onRetryFailed();
    } finally {
      setIsRetryingAll(false);
    }
  };

  const handleRetrySingle = async (contactId: string) => {
    if (!onRetryFailed) return;
    setRetryingId(contactId);
    try {
      await onRetryFailed(contactId);
    } finally {
      setRetryingId(null);
    }
  };

  const isDangerZoneTriggered = incident.incidentType === 'HIGH_RISK_ZONE' || Boolean(incident.triggerZoneName);

  // Terminology badge color & icon mapper
  const renderStatusBadge = (status: ProviderNotificationStatus | string) => {
    switch (status) {
      case 'Accepted by provider':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
            <CheckCheck className="w-3 h-3 text-emerald-300" />
            <span>Accepted by provider</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400">
            <CheckCheck className="w-3 h-3 text-emerald-200" />
            <span>Delivered</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40">
            <Clock className="w-3 h-3 text-amber-300 animate-spin" />
            <span>Pending</span>
          </span>
        );
      case 'Failed':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40">
            <XCircle className="w-3 h-3 text-rose-300" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const eligibleCount = incident.contactsNotifiedCount || incident.notifiedContacts?.length || 0;
  const acceptedCount = incident.acceptedCount ?? incident.notifiedContacts?.filter(c => c.status === 'Accepted by provider' || c.status === 'Delivered').length ?? 0;
  const failedCount = incident.failedCount ?? incident.notifiedContacts?.filter(c => c.status === 'Failed').length ?? 0;

  const formattedDate = incident.timestamp
    ? new Date(incident.timestamp).toLocaleString(language === 'te' ? 'te-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : new Date().toLocaleTimeString();

  const hasCoordinates = incident.latitude !== null && incident.longitude !== null && !incident.locationUnavailable;
  const mapsUrl = incident.googleMapsUrl || (hasCoordinates ? `https://maps.google.com/?q=${incident.latitude},${incident.longitude}` : '');

  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-red-600/30 border-2 border-red-400 mb-6 animate-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-red-700 tracking-wider">
                RED ALERT DISPATCH RESULT
              </span>
              <span className="text-xs text-red-100 font-mono bg-black/20 px-2 py-0.5 rounded-md border border-white/10">
                ID: {incident.id}
              </span>
              {isDangerZoneTriggered && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-300 text-slate-900 animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-700" />
                  <span>
                    {language === 'te' ? 'ఆటోమేటిక్ డేంజర్ జోన్ ట్రిగ్గర్' : 'AUTO DANGER ZONE TRIGGER'}
                  </span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
              {isDangerZoneTriggered
                ? (language === 'te' 
                    ? `డేంజర్ జోన్ హెచ్చరిక: ${incident.triggerZoneName || 'హై-రిస్క్ ప్రాంతం'}`
                    : `DANGER ZONE RED ALERT: ${incident.triggerZoneName || 'High-Risk Area'}`)
                : t.sosActiveAlertTitle}
            </h3>
            <div className="flex items-center gap-2 text-xs text-red-100 mt-0.5">
              <Clock className="w-3.5 h-3.5 opacity-80" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          aria-label="Toggle details"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Missing Credentials Alert Banner (Priority 2) */}
      {incident.credentialsConfigured === false && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/70 border border-amber-400 text-amber-100 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-extrabold text-amber-200 block text-xs uppercase tracking-wide">
              {language === 'te' ? 'నిజమైన SMS గేట్‌వే క్రెడెన్షియల్స్ లేవు' : 'Real SMS Gateway Credentials Missing'}
            </span>
            <p className="text-[11px] text-amber-100 mt-0.5 leading-relaxed">
              {language === 'te'
                ? 'సెల్ల్యులర్ ఫోన్లకు నిజమైన SMS డెలివరీ కోసం Twilio క్రెడెన్షియల్స్ (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) ఎన్విరాన్‌మెంట్‌లో సెట్ చేయాలి. క్రింది 1-క్లిక్ WhatsApp మరియు SMS లింక్‌ల ద్వారా మీ ఫోన్ నుండి నేరుగా అలర్ట్ పంపవచ్చు.'
                : 'Twilio SMS credentials are not configured in environment variables. Real cellular SMS cannot be delivered until credentials are provided. You can still use the 1-click WhatsApp and SMS buttons below to broadcast from your phone.'}
            </p>
          </div>
        </div>
      )}

      {/* PRIORITY 3: Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
        {/* Metric 1: Eligible Contacts */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-red-200">
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'అర్హత కలిగిన కాంటాక్ట్స్' : 'Eligible Contacts'}</span>
          </div>
          <span className="text-xl font-black text-white block mt-1">
            {eligibleCount}
          </span>
        </div>

        {/* Metric 2: Accepted by provider */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'ప్రొవైడర్ అంగీకరించినవి' : 'Accepted by Provider'}</span>
          </div>
          <span className="text-xl font-black text-emerald-200 block mt-1">
            {acceptedCount}
          </span>
        </div>

        {/* Metric 3: Failed Notifications */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'విఫలమైన నోటిఫికేషన్లు' : 'Failed Notifications'}</span>
          </div>
          <span className="text-xl font-black text-rose-200 block mt-1">
            {failedCount}
          </span>
        </div>

        {/* Metric 4: GPS Location */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-red-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'ప్రస్తుత GPS' : 'Current GPS'}</span>
          </div>
          {hasCoordinates ? (
            <div className="mt-1">
              <span className="text-xs font-mono font-bold text-white block truncate">
                {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
              </span>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-300 underline font-semibold flex items-center gap-0.5 mt-0.5 hover:text-white"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          ) : (
            <span className="text-xs font-semibold text-amber-200 block mt-1">
              {language === 'te' ? 'లొకేషన్ అందుబాటులో లేదు' : 'Location Unavailable'}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
          {/* Individual Contact Notification Status Cards (Priority 3) */}
          {incident.notifiedContacts && incident.notifiedContacts.length > 0 && (
            <div className="bg-black/30 rounded-2xl p-4 border border-white/10 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <span className="font-extrabold text-white text-xs block">
                    {language === 'te' 
                      ? 'వ్యక్తిగత కాంటాక్ట్ నోటిఫికేషన్ స్థితి & తక్షణ డెస్పాచ్:' 
                      : 'Individual Contact Notification Status & Actions:'}
                  </span>
                  <span className="text-[10px] text-red-200">
                    {language === 'te' 
                      ? `మొత్తం ${incident.notifiedContacts.length} కాంటాక్ట్‌లు ప్రాసెస్ చేయబడ్డాయి` 
                      : `${incident.notifiedContacts.length} eligible contacts processed independently`}
                  </span>
                </div>

                {/* Retry All Failed Notifications Button */}
                {failedCount > 0 && onRetryFailed && (
                  <button
                    onClick={handleRetryAll}
                    disabled={isRetryingAll}
                    className="self-start sm:self-auto py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetryingAll ? 'animate-spin' : ''}`} />
                    <span>
                      {isRetryingAll
                        ? (language === 'te' ? 'పునఃప్రయత్నిస్తోంది...' : 'Retrying Failed...')
                        : (language === 'te' ? `విఫలమైన వాటిని మళ్ళీ పంపండి (${failedCount})` : `Retry Failed Notifications (${failedCount})`)}
                    </span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {incident.notifiedContacts.map((contact, idx) => {
                  const isFailed = contact.status === 'Failed';
                  const isRetryingThis = retryingId === contact.contactId;

                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs border ${
                        isFailed 
                          ? 'bg-rose-950/40 border-rose-500/30' 
                          : 'bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {contact.contactName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-red-100 font-mono">
                            {contact.channel}
                          </span>
                          {renderStatusBadge(contact.status)}
                          {contact.providerMessageId && (
                            <span className="text-[10px] text-emerald-300 font-mono">
                              SID: {contact.providerMessageId.slice(0, 10)}...
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-red-200 font-mono mt-1">
                          <span>{contact.phone}</span>
                          {contact.sentAt && (
                            <>
                              <span>•</span>
                              <span>{new Date(contact.sentAt).toLocaleTimeString()}</span>
                            </>
                          )}
                        </div>

                        {/* Error Reason Display */}
                        {contact.error && (
                          <div className="mt-1.5 text-[11px] text-rose-200 bg-rose-900/40 p-1.5 rounded-lg border border-rose-500/20">
                            <span className="font-semibold">Reason: </span>
                            <span>{contact.error}</span>
                          </div>
                        )}
                      </div>

                      {/* Direct Actions & Retry Button */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center shrink-0">
                        {isFailed && onRetryFailed && (
                          <button
                            onClick={() => handleRetrySingle(contact.contactId)}
                            disabled={isRetryingThis || isRetryingAll}
                            className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                            title="Retry sending SMS to this contact"
                          >
                            <RefreshCw className={`w-3 h-3 ${isRetryingThis ? 'animate-spin' : ''}`} />
                            <span>{isRetryingThis ? 'Retrying...' : 'Retry'}</span>
                          </button>
                        )}

                        {contact.whatsappUrl && (
                          <a
                            href={contact.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-transform active:scale-95"
                            title="Open WhatsApp with pre-filled SOS message"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        {contact.smsUrl && (
                          <a
                            href={contact.smsUrl}
                            className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-transform active:scale-95"
                            title="Open SMS app with pre-filled SOS message"
                          >
                            <Send className="w-3 h-3" />
                            <span>SMS</span>
                          </a>
                        )}

                        {contact.callUrl && (
                          <a
                            href={contact.callUrl}
                            className="py-1 px-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] flex items-center gap-1"
                            title="Call Contact"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Emergency Calling Shortcuts */}
          <div>
            <span className="text-xs font-bold text-red-100 uppercase tracking-wider block mb-2">
              {t.emergencyCallingTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-sm hover:bg-red-50 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callPolice112}</span>
              </a>
              <a
                href="tel:1091"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white text-purple-900 font-extrabold text-xs shadow-sm hover:bg-purple-50 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callWomenHelpline1091}</span>
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white text-orange-600 font-extrabold text-xs shadow-sm hover:bg-orange-50 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callAmbulance108}</span>
              </a>
            </div>
          </div>

          {/* Resolve Emergency Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowNotesModal(true)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.resolveEmergencyBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-slate-800 shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'te' ? 'అలర్ట్ ముగించండి (నేను క్షేమంగా ఉన్నాను)' : 'Resolve Emergency Alert'}
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              {language === 'te'
                ? 'మీరు క్షేమంగా ఉన్నట్లు కాంటాక్ట్స్‌కు మరియు సిస్టమ్‌కు రికార్డ్ చేయబడుతుంది. గమనిక రాయండి:'
                : 'Confirming your safety will update your contacts that the situation is resolved. Add an optional resolution note:'}
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 mb-4"
              placeholder="e.g. Reached safe destination with family."
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold"
              >
                {t.sosModalCancelBtn}
              </button>
              <button
                onClick={handleResolveClick}
                disabled={isResolving}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                {isResolving ? 'Resolving...' : t.resolveEmergencyBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
