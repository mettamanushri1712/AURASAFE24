import { EmergencyContact, EscalationMode, Language, SafetyStatus, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'sheguard_user',
  CONTACTS: 'sheguard_contacts',
  SAFETY_STATUS: 'sheguard_safety_status',
  LANGUAGE: 'sheguard_language',
  LAST_COORDS: 'sheguard_last_coords',
  ESCALATION_MODE: 'sheguard_escalation_mode',
  AUTO_ALERT_ZONES: 'sheguard_auto_alert_zones',
};

export const defaultUser: UserProfile = {
  id: 'user-01',
  name: 'Preethika P',
  email: 'pentapreethika@gmail.com',
  phone: '+91 98765 43210',
  preferredLanguage: 'en',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  createdAt: '2026-01-10T08:00:00.000Z',
  locationSharingEnabled: true,
  discreetTriggerEnabled: false,
  autoAlertDangerZones: true,
  escalationMode: 'ALL',
  checkinFrequencyMinutes: 30,
};

export const defaultContacts: EmergencyContact[] = [
  {
    id: 'c1',
    userId: 'user-01',
    name: 'Sunita (Mother)',
    phone: '+91 98765 11111',
    relationship: 'Mother',
    email: 'sunita.family@gmail.com',
    verified: true,
    isPrimary: true,
    eligibleForSos: true,
    notificationPreferences: { sms: true, whatsapp: true, call: true },
    lastTestNotificationSent: '2026-11-04T18:30:00.000Z',
  },
  {
    id: 'c2',
    userId: 'user-01',
    name: 'Ravi (Father)',
    phone: '+91 98765 22222',
    relationship: 'Father',
    email: 'ravi.family@gmail.com',
    verified: true,
    isPrimary: false,
    eligibleForSos: true,
    notificationPreferences: { sms: true, whatsapp: true, call: false },
    lastTestNotificationSent: '2026-11-04T18:30:00.000Z',
  },
  {
    id: 'c3',
    userId: 'user-01',
    name: 'Ananya (Sister)',
    phone: '+91 98765 33333',
    relationship: 'Sister',
    email: 'ananya.p@gmail.com',
    verified: true,
    isPrimary: false,
    eligibleForSos: true,
    notificationPreferences: { sms: true, whatsapp: true, call: false },
  },
  {
    id: 'c4',
    userId: 'user-01',
    name: 'Kavitha (Best Friend)',
    phone: '+91 98765 44444',
    relationship: 'Friend',
    verified: true,
    isPrimary: false,
    eligibleForSos: true,
    notificationPreferences: { sms: true, whatsapp: false, call: false },
  },
  {
    id: 'c5',
    userId: 'user-01',
    name: 'Suresh (Colleague)',
    phone: '+91 98765 55555',
    relationship: 'Colleague',
    verified: true,
    isPrimary: false,
    eligibleForSos: true,
    notificationPreferences: { sms: true, whatsapp: false, call: false },
  },
];

export const StorageService = {
  getUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultUser,
          ...parsed,
          autoAlertDangerZones: parsed.autoAlertDangerZones ?? true,
          escalationMode: parsed.escalationMode ?? 'ALL',
        };
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return defaultUser;
  },

  setUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  getContacts(): EmergencyContact[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => ({
            ...c,
            eligibleForSos: c.eligibleForSos !== false,
          }));
        }
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return defaultContacts;
  },

  setContacts(contacts: EmergencyContact[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error(e);
    }
  },

  getEscalationMode(): EscalationMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ESCALATION_MODE);
      if (stored === 'ALL' || stored === 'VERIFIED' || stored === 'PRIMARY_FIRST') {
        return stored;
      }
    } catch (e) {}
    return 'ALL';
  },

  setEscalationMode(mode: EscalationMode) {
    try {
      localStorage.setItem(STORAGE_KEYS.ESCALATION_MODE, mode);
    } catch (e) {}
  },

  getAutoAlertDangerZones(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTO_ALERT_ZONES);
      if (stored !== null) return stored === 'true';
    } catch (e) {}
    return true; // Default to TRUE
  },

  setAutoAlertDangerZones(enabled: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_ALERT_ZONES, String(enabled));
    } catch (e) {}
  },

  getSafetyStatus(): SafetyStatus {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAFETY_STATUS);
      if (stored) return stored as SafetyStatus;
    } catch (e) {}
    return 'SAFE';
  },

  setSafetyStatus(status: SafetyStatus) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAFETY_STATUS, status);
    } catch (e) {}
  },

  getLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (stored === 'en' || stored === 'te') return stored;
    } catch (e) {}
    return 'en';
  },

  setLanguage(lang: Language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {}
  },

  getLastCoords(): { latitude: number; longitude: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_COORDS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { latitude: 17.4375, longitude: 78.4482 };
  },

  setLastCoords(coords: { latitude: number; longitude: number }) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_COORDS, JSON.stringify(coords));
    } catch (e) {}
  },
};
