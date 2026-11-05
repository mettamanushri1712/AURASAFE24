import React, { useState } from 'react';
import { 
  History, ShieldAlert, CheckCircle2, Clock, MapPin, 
  Trash2, ExternalLink, Shield, AlertTriangle, Filter
} from 'lucide-react';
import { EmergencyIncident, Language } from '../types';
import { translations } from '../locales/translations';

interface EmergencyHistoryViewProps {
  incidents: EmergencyIncident[];
  onClearHistory: () => void;
  language: Language;
}

export const EmergencyHistoryView: React.FC<EmergencyHistoryViewProps> = ({
  incidents,
  onClearHistory,
  language,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const t = translations[language];

  const filtered = filter === 'ALL'
    ? incidents
    : incidents.filter((inc) => inc.status === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.historyTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.historySubtitle}
            </p>
          </div>
        </div>

        {incidents.length > 0 && (
          <button
            onClick={() => {
              if (confirm(language === 'te' ? 'మీ వ్యక్తిగత లొకేషన్ రికార్డులను తొలగించాలా?' : 'Are you sure you want to delete your personal location history?')) {
                onClearHistory();
              }
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>{t.clearHistoryBtn}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          {language === 'te' ? 'అన్ని సంఘటనలు' : 'All Incidents'} ({incidents.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'ACTIVE'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-red-50'
          }`}
        >
          {language === 'te' ? 'యాక్టివ్' : 'Active'} ({incidents.filter((i) => i.status === 'ACTIVE').length})
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'RESOLVED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          {language === 'te' ? 'ముగిసినవి' : 'Resolved'} ({incidents.filter((i) => i.status === 'RESOLVED').length})
        </button>
      </div>

      {/* Incidents List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {t.noIncidentsFound}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
                inc.status === 'ACTIVE'
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl text-white ${
                      inc.status === 'ACTIVE' ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{inc.id}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          inc.status === 'ACTIVE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {inc.status}
                      </span>
                      {inc.isDemo && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          DEMO SIMULATION
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(inc.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <a
                  href={inc.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1.5 self-start sm:self-center"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">{t.incidentType}</span>
                  <span className="font-bold text-slate-800 font-mono">{inc.incidentType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">{t.contactsNotified}</span>
                  <span className="font-bold text-slate-800">
                    {inc.contactsNotifiedCount} {language === 'te' ? 'కాంటాక్ట్స్' : 'Contacts'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">{t.incidentDeliveryStatus}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Sandbox Delivered
                  </span>
                </div>
              </div>

              {inc.address && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">{inc.address}</span>
                </div>
              )}

              {inc.resolutionNotes && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    {language === 'te' ? 'ముగింపు గమనిక:' : 'Resolution Notes:'}
                  </span>
                  <span>{inc.resolutionNotes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
