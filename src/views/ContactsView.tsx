import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Phone, ShieldCheck, Star, Trash2, Edit2, 
  Send, CheckCircle2, AlertCircle, X, Shield, BellRing, MessageSquare,
  Check, ToggleLeft, ToggleRight, Radio
} from 'lucide-react';
import { EmergencyContact, Language } from '../types';
import { translations } from '../locales/translations';
import { ApiService } from '../services/api';

interface ContactsViewProps {
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  language: Language;
  escalationMode: 'ALL' | 'VERIFIED' | 'PRIMARY_FIRST';
  onUpdateEscalationMode: (mode: 'ALL' | 'VERIFIED' | 'PRIMARY_FIRST') => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onUpdateContacts,
  language,
  escalationMode,
  onUpdateEscalationMode,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [otpModalContact, setOtpModalContact] = useState<EmergencyContact | null>(null);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [testAlertStatus, setTestAlertStatus] = useState<{ id: string; msg: string } | null>(null);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+91 ');
  const [formRelation, setFormRelation] = useState('Mother');
  const [formEmail, setFormEmail] = useState('');
  const [formEligibleForSos, setFormEligibleForSos] = useState(true);
  const [formSms, setFormSms] = useState(true);
  const [formWhatsApp, setFormWhatsApp] = useState(true);
  const [formCall, setFormCall] = useState(false);

  const t = translations[language];

  // Fetch from backend on mount to guarantee database synchronization
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const remoteContacts = await ApiService.fetchContacts('user-01');
        if (remoteContacts && remoteContacts.length > 0) {
          onUpdateContacts(remoteContacts);
        }
      } catch (err) {
        console.warn('Contacts backend sync warning:', err);
      }
    };
    syncWithBackend();
  }, []);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormName('');
    setFormPhone('+91 ');
    setFormRelation('Mother');
    setFormEmail('');
    setFormEligibleForSos(true);
    setFormSms(true);
    setFormWhatsApp(true);
    setFormCall(false);
    setSavingError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormRelation(contact.relationship);
    setFormEmail(contact.email || '');
    setFormEligibleForSos(contact.eligibleForSos !== false);
    setFormSms(contact.notificationPreferences.sms);
    setFormWhatsApp(contact.notificationPreferences.whatsapp);
    setFormCall(contact.notificationPreferences.call);
    setSavingError(null);
    setShowAddModal(true);
  };

  const handleSaveContact = async () => {
    if (!formName.trim() || !formPhone.trim()) {
      setSavingError(language === 'te' ? 'దయచేసి పేరు మరియు మొబైల్ నంబర్ నమోదు చేయండి' : 'Name and mobile number are required.');
      return;
    }

    setIsSubmitting(true);
    setSavingError(null);

    try {
      if (editingContact) {
        // Update contact via Backend API
        const updated = await ApiService.updateContact(editingContact.id, {
          name: formName.trim(),
          phone: formPhone.trim(),
          relationship: formRelation,
          email: formEmail.trim() || undefined,
          eligibleForSos: formEligibleForSos,
          notificationPreferences: {
            sms: formSms,
            whatsapp: formWhatsApp,
            call: formCall,
          },
        });

        const newContactsList = contacts.map((c) =>
          c.id === editingContact.id ? updated : c
        );
        onUpdateContacts(newContactsList);
      } else {
        // Add new contact via Backend API
        const created = await ApiService.addContact({
          userId: 'user-01',
          name: formName.trim(),
          phone: formPhone.trim(),
          relationship: formRelation,
          email: formEmail.trim() || undefined,
          eligibleForSos: formEligibleForSos,
          notificationPreferences: {
            sms: formSms,
            whatsapp: formWhatsApp,
            call: formCall,
          },
        });

        onUpdateContacts([...contacts, created]);
      }
      setShowAddModal(false);
    } catch (err: any) {
      setSavingError(err?.message || 'Failed to save contact in database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm(language === 'te' ? 'ఈ కాంటాక్ట్‌ను తొలగించాలా?' : 'Are you sure you want to remove this contact?')) {
      try {
        await ApiService.deleteContact(id);
        const remaining = contacts.filter((c) => c.id !== id);
        if (remaining.length > 0 && !remaining.some((c) => c.isPrimary)) {
          remaining[0].isPrimary = true;
        }
        onUpdateContacts(remaining);
      } catch (err) {
        console.error('Failed to delete contact from backend:', err);
        const remaining = contacts.filter((c) => c.id !== id);
        onUpdateContacts(remaining);
      }
    }
  };

  const handleMarkPrimary = async (id: string) => {
    try {
      await ApiService.updateContact(id, { isPrimary: true });
      const updated = contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }));
      onUpdateContacts(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEligibility = async (contact: EmergencyContact) => {
    const nextState = !contact.eligibleForSos;
    try {
      const updated = await ApiService.toggleContactEligibility(contact.id, nextState);
      const newContactsList = contacts.map((c) =>
        c.id === contact.id ? { ...c, eligibleForSos: updated.eligibleForSos } : c
      );
      onUpdateContacts(newContactsList);
    } catch (err) {
      // Optimistic fallback
      const newContactsList = contacts.map((c) =>
        c.id === contact.id ? { ...c, eligibleForSos: nextState } : c
      );
      onUpdateContacts(newContactsList);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpModalContact) return;
    try {
      const updated = await ApiService.verifyContact(otpModalContact.id, otpInput.trim());
      const newContactsList = contacts.map((c) =>
        c.id === otpModalContact.id ? { ...c, verified: true } : c
      );
      onUpdateContacts(newContactsList);
      setOtpModalContact(null);
      setOtpInput('');
      setOtpError(null);
    } catch (err: any) {
      setOtpError(language === 'te' ? 'సరైన 6 అంకెల OTP నమోదు చేయండి (డెమో కోడ్: 123456)' : (err.message || 'Invalid OTP. Enter 123456 for demo.'));
    }
  };

  const handleSendTestNotification = async (contact: EmergencyContact) => {
    setTestAlertStatus({ id: contact.id, msg: 'Dispatching...' });
    try {
      await ApiService.sendTestNotification({
        contactName: contact.name,
        phone: contact.phone,
        channel: contact.notificationPreferences.whatsapp ? 'WHATSAPP' : 'SMS',
        language,
      });

      setTestAlertStatus({
        id: contact.id,
        msg: language === 'te' ? 'టెస్ట్ అలర్ట్ డెలివరీ అయింది!' : 'Test alert delivered!',
      });

      const updated = contacts.map((c) =>
        c.id === contact.id ? { ...c, lastTestNotificationSent: new Date().toISOString() } : c
      );
      onUpdateContacts(updated);

      setTimeout(() => setTestAlertStatus(null), 4000);
    } catch (e) {
      setTestAlertStatus({ id: contact.id, msg: 'Error sending test' });
    }
  };

  const eligibleCount = contacts.filter(c => c.eligibleForSos !== false).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.contactsTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'te'
                ? `రెడ్ అలర్ట్ కోసం ${eligibleCount}/${contacts.length} కాంటాక్ట్‌లు ఎంపిక చేయబడ్డాయి`
                : `${eligibleCount} of ${contacts.length} contacts eligible for Red Alert SMS`}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addContactBtn}</span>
        </button>
      </div>

      {/* Escalation Policy Card */}
      <div className="bg-purple-50/70 border border-purple-100 rounded-3xl p-5">
        <h3 className="text-sm font-extrabold text-purple-950 mb-3 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-purple-700" />
          <span>{t.escalationModeTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
            escalationMode === 'ALL'
              ? 'bg-white border-purple-600 shadow-xs text-purple-950 font-bold'
              : 'bg-purple-50/50 border-purple-200 text-slate-600 font-medium'
          }`}>
            <input
              type="radio"
              name="escalation"
              className="sr-only"
              checked={escalationMode === 'ALL'}
              onChange={() => onUpdateEscalationMode('ALL')}
            />
            <span>{t.escalationAll}</span>
          </label>

          <label className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
            escalationMode === 'VERIFIED'
              ? 'bg-white border-purple-600 shadow-xs text-purple-950 font-bold'
              : 'bg-purple-50/50 border-purple-200 text-slate-600 font-medium'
          }`}>
            <input
              type="radio"
              name="escalation"
              className="sr-only"
              checked={escalationMode === 'VERIFIED'}
              onChange={() => onUpdateEscalationMode('VERIFIED')}
            />
            <span>{t.escalationSelected}</span>
          </label>

          <label className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
            escalationMode === 'PRIMARY_FIRST'
              ? 'bg-white border-purple-600 shadow-xs text-purple-950 font-bold'
              : 'bg-purple-50/50 border-purple-200 text-slate-600 font-medium'
          }`}>
            <input
              type="radio"
              name="escalation"
              className="sr-only"
              checked={escalationMode === 'PRIMARY_FIRST'}
              onChange={() => onUpdateEscalationMode('PRIMARY_FIRST')}
            />
            <span>{t.escalationPrimaryFirst}</span>
          </label>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-3.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`bg-white rounded-3xl p-5 border transition-all ${
              contact.isPrimary
                ? 'border-purple-300 ring-2 ring-purple-100 shadow-sm'
                : 'border-slate-200 shadow-2xs hover:border-purple-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-lg shrink-0">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {t.primaryBadge}
                      </span>
                    )}
                    {contact.verified ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t.verifiedBadge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-slate-400" />
                        {t.unverifiedBadge}
                      </span>
                    )}

                    {/* Priority 4: Select contacts eligible for emergency notifications */}
                    <button
                      onClick={() => handleToggleEligibility(contact)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
                        contact.eligibleForSos !== false
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                      }`}
                      title="Click to toggle SOS alert eligibility for this contact"
                    >
                      <Radio className="w-2.5 h-2.5" />
                      <span>
                        {contact.eligibleForSos !== false
                          ? (language === 'te' ? 'అత్యవసర అలర్ట్‌కు అర్హత ఉంది' : 'Eligible for SOS')
                          : (language === 'te' ? 'అలర్ట్ నిలిపివేయబడింది' : 'SOS Disabled')}
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">{contact.phone}</span>
                    <span>•</span>
                    <span className="text-purple-700 font-medium">{contact.relationship}</span>
                    {contact.email && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">{contact.email}</span>
                      </>
                    )}
                  </div>

                  {/* Channel Preferences */}
                  <div className="flex items-center gap-2 mt-2">
                    {contact.notificationPreferences.whatsapp && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        WhatsApp
                      </span>
                    )}
                    {contact.notificationPreferences.sms && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        SMS
                      </span>
                    )}
                    {contact.notificationPreferences.call && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        Voice Call
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                {!contact.verified && (
                  <button
                    onClick={() => {
                      setOtpModalContact(contact);
                      setOtpInput('123456'); // Pre-fill with demo code for effortless testing
                    }}
                    className="py-1.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.verifyWithOtpBtn}
                  </button>
                )}

                <button
                  onClick={() => handleSendTestNotification(contact)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Send Test Notification"
                >
                  <Send className="w-3.5 h-3.5 text-purple-700" />
                  <span>
                    {testAlertStatus?.id === contact.id
                      ? testAlertStatus.msg
                      : t.sendTestNotificationBtn}
                  </span>
                </button>

                {!contact.isPrimary && (
                  <button
                    onClick={() => handleMarkPrimary(contact.id)}
                    className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.markPrimaryBtn}
                  </button>
                )}

                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingContact ? t.editContactBtn : t.addContactBtn}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savingError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {savingError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.contactName}
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sunita Devi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.contactPhone}
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.contactRelation}
                </label>
                <select
                  value={formRelation}
                  onChange={(e) => setFormRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Mother">Mother / తల్లి</option>
                  <option value="Father">Father / తండ్రి</option>
                  <option value="Sister">Sister / సోదరి</option>
                  <option value="Brother">Brother / సోదరుడు</option>
                  <option value="Spouse">Spouse / జీవిత భాగస్వామి</option>
                  <option value="Friend">Friend / స్నేహితురాలు</option>
                  <option value="Guardian">Guardian / సంరక్షకులు</option>
                  <option value="Colleague">Colleague / సహోద్యోగి</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="family@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Priority 4: Select contacts eligible for emergency notifications */}
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">
                      {language === 'te' 
                        ? 'అత్యవసర నోటిఫికేషన్లకు అర్హత (రెడ్ అలర్ట్)' 
                        : 'Eligible for Emergency Notifications (Red Alert)'}
                    </span>
                    <span className="text-[11px] text-rose-700">
                      {language === 'te'
                        ? 'రెడ్ అలర్ట్ నొక్కినప్పుడు ఈ కాంటాక్ట్‌కు SMS పంపబడుతుంది'
                        : 'Send real emergency SMS to this contact when RED ALERT is triggered'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formEligibleForSos}
                    onChange={(e) => setFormEligibleForSos(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                </label>
              </div>

              {/* Notification Channel Checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {t.notificationPreferences}
                </label>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formWhatsApp}
                      onChange={(e) => setFormWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSms}
                      onChange={(e) => setFormSms(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span>SMS</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formCall}
                      onChange={(e) => setFormCall(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span>Voice Call</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                {t.sosModalCancelBtn}
              </button>
              <button
                onClick={handleSaveContact}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-purple-800 text-white font-bold text-xs hover:bg-purple-900 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : t.saveChangesBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpModalContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-purple-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">
              {t.otpModalTitle}
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              {t.otpModalDesc}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder={t.enterOtpPlaceholder}
              className="w-full text-center tracking-widest text-xl font-mono py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-600 mb-2"
            />

            {otpError && (
              <p className="text-xs text-red-600 font-medium mb-3">{otpError}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setOtpModalContact(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {t.sosModalCancelBtn}
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2.5 rounded-xl bg-purple-800 text-white text-xs font-bold hover:bg-purple-900 cursor-pointer"
              >
                {t.verifyOtpConfirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
