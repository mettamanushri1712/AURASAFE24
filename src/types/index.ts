export type Language = 'en' | 'te';

export type SafetyStatus = 'SAFE' | 'NEED_ASSISTANCE' | 'EMERGENCY';

export type UserRole = 'user' | 'admin';

export type EscalationMode = 'ALL' | 'VERIFIED' | 'PRIMARY_FIRST';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: Language;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  locationSharingEnabled: boolean;
  discreetTriggerEnabled: boolean;
  autoAlertDangerZones: boolean;
  escalationMode: EscalationMode;
  checkinFrequencyMinutes: number;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  email?: string;
  verified: boolean;
  isPrimary: boolean;
  eligibleForSos: boolean; // Priority 4: Select contacts eligible for emergency notifications
  notificationPreferences: {
    sms: boolean;
    whatsapp: boolean;
    call: boolean;
  };
  lastTestNotificationSent?: string;
}

export type IncidentType = 'SOS_BUTTON' | 'VOICE_TRIGGERED' | 'MISSED_CHECKIN' | 'HIGH_RISK_ZONE' | 'DISCREET_TRIGGER';

export type IncidentStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED';

export type ProviderNotificationStatus = 'Accepted by provider' | 'Delivered' | 'Failed' | 'Pending';

export interface AlertNotificationResult {
  contactId: string;
  contactName: string;
  phone: string;
  channel: 'SMS';
  status: ProviderNotificationStatus;
  providerMessageId?: string;
  error?: string;
  message: string;
  sentAt: string;
  whatsappUrl?: string;
  smsUrl?: string;
  callUrl?: string;
}

export interface SendAlertResponse {
  success: boolean;
  alertId: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string;
  locationUnavailable: boolean;
  eligibleContactsCount: number;
  acceptedCount: number;
  failedCount: number;
  notifications: AlertNotificationResult[];
  credentialsConfigured: boolean;
  providerError?: string;
  messageEn: string;
  messageTe: string;
}

export interface EmergencyIncident {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  incidentType: IncidentType;
  status: IncidentStatus;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  googleMapsUrl: string;
  locationUnavailable?: boolean;
  timestamp: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  triggerZoneName?: string;
  triggerZoneLevel?: string;
  contactsNotifiedCount: number;
  acceptedCount?: number;
  failedCount?: number;
  notifiedContacts: AlertNotificationResult[];
  credentialsConfigured?: boolean;
  providerError?: string;
  isDemo: boolean;
}

export interface RiskZone {
  id: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  riskLevel: 'NORMAL' | 'CAUTION' | 'HIGH_RISK';
  latitude: number;
  longitude: number;
  radiusMeters: number;
  dataSource: string;
  lastUpdated: string;
  active: boolean;
}

export interface NearbyService {
  id: string;
  name: string;
  nameTe: string;
  category: 'POLICE' | 'HOSPITAL' | 'WOMEN_HELPLINE' | 'EMERGENCY_AMBULANCE';
  phone: string;
  address: string;
  addressTe: string;
  latitude: number;
  longitude: number;
  is24x7: boolean;
  verified: boolean;
}

export interface SafetyCheckinRecord {
  id: string;
  userId: string;
  scheduledTime: string;
  responseTime?: string;
  response: 'SAFE' | 'NEED_HELP' | 'NOT_SURE' | 'MISSED';
  escalationStatus: 'NONE' | 'REMINDER_SENT' | 'CONTACTS_NOTIFIED';
  latitude?: number;
  longitude?: number;
}

export interface VoiceAssistantResponse {
  intent: 'EMERGENCY' | 'LOCATION_SHARE' | 'SAFETY_CONFIRMATION' | 'NEARBY_HELP' | 'CHECKIN' | 'GENERAL_QUERY';
  isEmergency: boolean;
  responseTextEn: string;
  responseTextTe: string;
  recommendedAction?: 'TRIGGER_SOS_CONFIRMATION' | 'SHOW_MAP' | 'CALL_112' | 'CONFIRM_SAFE' | 'SHOW_CONTACTS';
}
