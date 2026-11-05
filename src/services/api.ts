import { 
  EmergencyContact, 
  EmergencyIncident, 
  NearbyService, 
  RiskZone, 
  SendAlertResponse, 
  VoiceAssistantResponse 
} from '../types';

export const ApiService = {
  // Voice Assistant
  async askVoiceAssistant(
    prompt: string,
    language: 'en' | 'te',
    currentLocation?: { latitude: number; longitude: number }
  ): Promise<VoiceAssistantResponse> {
    const res = await fetch('/api/ai/voice-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, currentLocation }),
    });
    if (!res.ok) throw new Error('Failed to query AI Voice Assistant');
    return res.json();
  },

  // Priority 1 & 2: Primary RED ALERT API Endpoint
  async sendEmergencyAlert(payload: {
    userId: string;
    userName: string;
    userPhone: string;
    incidentType?: string;
    latitude?: number | null;
    longitude?: number | null;
    address?: string;
    preferredLanguage: 'en' | 'te';
    triggerZoneName?: string;
    triggerZoneLevel?: string;
    lastKnownCoords?: { latitude: number; longitude: number };
  }): Promise<SendAlertResponse & { incident?: EmergencyIncident }> {
    const res = await fetch('/api/emergency/send-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send emergency alert');
    }
    return data;
  },

  // Priority 3: Retry failed notifications only
  async retryFailedSms(alertId: string, contactId?: string) {
    const res = await fetch('/api/emergency/retry-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId, contactId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to retry SMS notifications');
    }
    return data;
  },

  // Backward compatible trigger
  async triggerIncident(payload: {
    userId: string;
    userName: string;
    userPhone: string;
    incidentType: string;
    latitude: number;
    longitude: number;
    address?: string;
    contacts: any[];
    preferredLanguage: 'en' | 'te';
    triggerZoneName?: string;
    triggerZoneLevel?: string;
  }): Promise<{ success: boolean; incident: EmergencyIncident; messageEn: string; messageTe: string }> {
    return this.sendEmergencyAlert(payload) as any;
  },

  // Priority 4: Functional Emergency Contact APIs
  async fetchContacts(userId: string = 'user-01'): Promise<EmergencyContact[]> {
    const res = await fetch(`/api/contacts?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch emergency contacts');
    const data = await res.json();
    return data.contacts || [];
  },

  async addContact(contact: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save contact');
    return data.contact;
  },

  async updateContact(id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update contact');
    return data.contact;
  },

  async deleteContact(id: string): Promise<boolean> {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete contact');
    return data.success;
  },

  async verifyContact(id: string, otp: string): Promise<EmergencyContact> {
    const res = await fetch(`/api/contacts/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');
    return data.contact;
  },

  async toggleContactEligibility(id: string, eligibleForSos: boolean): Promise<EmergencyContact> {
    const res = await fetch(`/api/contacts/${id}/eligibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eligibleForSos }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update eligibility');
    return data.contact;
  },

  // Incidents
  async fetchIncidents(): Promise<EmergencyIncident[]> {
    const res = await fetch('/api/incidents');
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const data = await res.json();
    return data.incidents || [];
  },

  async resolveIncident(id: string, notes: string): Promise<EmergencyIncident> {
    const res = await fetch(`/api/incidents/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    const data = await res.json();
    return data.incident;
  },

  // Priority 6: Safety Confirmation Status
  async updateSafetyStatus(payload: {
    userId: string;
    status: 'SAFE' | 'NEED_ASSISTANCE' | 'EMERGENCY';
    latitude?: number;
    longitude?: number;
    language?: 'en' | 'te';
  }) {
    const res = await fetch('/api/safety/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update safety status');
    return res.json();
  },

  // Risk Zones & Nearby Services
  async fetchRiskZones(): Promise<RiskZone[]> {
    const res = await fetch('/api/risk-zones');
    if (!res.ok) throw new Error('Failed to fetch risk zones');
    const data = await res.json();
    return data.riskZones || [];
  },

  async addRiskZone(zone: Partial<RiskZone>): Promise<RiskZone> {
    const res = await fetch('/api/risk-zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zone),
    });
    if (!res.ok) throw new Error('Failed to add risk zone');
    const data = await res.json();
    return data.riskZone;
  },

  async fetchNearbyServices(): Promise<NearbyService[]> {
    const res = await fetch('/api/nearby-services');
    if (!res.ok) throw new Error('Failed to fetch nearby services');
    const data = await res.json();
    return data.services || [];
  },

  async sendTestNotification(payload: {
    contactName: string;
    phone: string;
    channel?: string;
    language?: 'en' | 'te';
  }) {
    const res = await fetch('/api/notifications/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send test alert');
    return res.json();
  },

  async submitCheckin(payload: {
    userId: string;
    response: 'SAFE' | 'NEED_HELP' | 'NOT_SURE' | 'MISSED';
    latitude?: number;
    longitude?: number;
  }) {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to record checkin');
    return res.json();
  },

  async fetchHealth() {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },
};
