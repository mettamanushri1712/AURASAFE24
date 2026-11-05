import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import twilio from 'twilio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Twilio SMS Gateway Configuration Check
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';

const isTwilioConfigured = Boolean(
  twilioAccountSid &&
  twilioAuthToken &&
  twilioPhoneNumber &&
  twilioAccountSid.startsWith('AC') &&
  !twilioAccountSid.includes('MY_')
);

const twilioClient = isTwilioConfigured ? twilio(twilioAccountSid, twilioAuthToken) : null;

// ==========================================
// UNIFIED DATABASE & STORAGE (Simulating Firebase Firestore)
// ==========================================

interface EmergencyContactRecord {
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
  createdAt: string;
  lastTestNotificationSent?: string;
}

let contactsDatabase: EmergencyContactRecord[] = [
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
    createdAt: '2026-01-10T08:00:00.000Z',
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
    createdAt: '2026-01-10T08:00:00.000Z',
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
    createdAt: '2026-01-10T08:00:00.000Z',
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
    createdAt: '2026-01-15T08:00:00.000Z',
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
    createdAt: '2026-02-01T08:00:00.000Z',
  },
];

interface AlertNotificationResult {
  contactId: string;
  contactName: string;
  phone: string;
  channel: 'SMS';
  status: 'Accepted by provider' | 'Delivered' | 'Failed' | 'Pending';
  providerMessageId?: string;
  error?: string;
  message: string;
  sentAt: string;
  whatsappUrl?: string;
  smsUrl?: string;
  callUrl?: string;
}

interface IncidentRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  incidentType: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
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
  acceptedCount: number;
  failedCount: number;
  notifiedContacts: AlertNotificationResult[];
  credentialsConfigured: boolean;
  providerError?: string;
  isDemo: boolean;
}

let incidentsDatabase: IncidentRecord[] = [
  {
    id: 'INC-2026-8841',
    userId: 'user-01',
    userName: 'Preethika P',
    userPhone: '+91 98765 43210',
    incidentType: 'SOS_BUTTON',
    status: 'RESOLVED',
    latitude: 17.4375,
    longitude: 78.4482,
    address: 'Near Begumpet Metro Station, Hyderabad, Telangana',
    googleMapsUrl: 'https://maps.google.com/?q=17.4375,78.4482',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: 'Reached home safely with family assistance.',
    contactsNotifiedCount: 2,
    acceptedCount: 2,
    failedCount: 0,
    credentialsConfigured: isTwilioConfigured,
    notifiedContacts: [
      {
        contactId: 'c1',
        contactName: 'Sunita (Mother)',
        phone: '+91 98765 11111',
        channel: 'SMS',
        status: 'Delivered',
        providerMessageId: 'SMdemo_mock_001',
        message: 'EMERGENCY ALERT! Preethika P needs immediate assistance. Current Location: https://maps.google.com/?q=17.4375,78.4482. Please contact her immediately.',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        contactId: 'c2',
        contactName: 'Ravi (Father)',
        phone: '+91 98765 22222',
        channel: 'SMS',
        status: 'Delivered',
        providerMessageId: 'SMdemo_mock_002',
        message: 'అత్యవసర హెచ్చరిక! Preethika P కు తక్షణ సహాయం అవసరం. ప్రస్తుత లొకేషన్: https://maps.google.com/?q=17.4375,78.4482. దయచేసి వెంటనే సంప్రదించండి.',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    isDemo: !isTwilioConfigured,
  }
];

let riskZones = [
  {
    id: 'rz-01',
    name: 'Sanath Nagar Industrial Overpass',
    nameTe: 'సనత్‌నగర్ ఇండస్ట్రియల్ ఓవర్‌పాస్ పరిసరాలు',
    description: 'Low-light transit corridor with limited public movement post 9 PM. Identified by local police safety survey.',
    descriptionTe: 'రాత్రి 9 గంటల తర్వాత తక్కువ వెలుతురు ఉండే ప్రాంతం. స్థానిక పోలీసుల రక్షణ సర్వే ద్వారా గుర్తించబడింది.',
    riskLevel: 'CAUTION',
    latitude: 17.4520,
    longitude: 78.4350,
    radiusMeters: 600,
    dataSource: 'Telangana Police Safety Advisory & Traffic Cell',
    lastUpdated: '2026-10-15',
    active: true,
  },
  {
    id: 'rz-02',
    name: 'Miyapur Outer Ring Road Isolated Junction',
    nameTe: 'మియాపూర్ ఔటర్ రింగ్ రోడ్ జంక్షన్',
    description: 'High-risk advisory zone due to frequent infrastructure work and reduced mobile signal coverage.',
    descriptionTe: 'మౌలిక సదుపాయాల పనులు మరియు మొబైల్ సిగ్నల్ తక్కువగా ఉండే అధిక-ప్రమాద హెచ్చరిక ప్రాంతం.',
    riskLevel: 'HIGH_RISK',
    latitude: 17.4980,
    longitude: 78.3560,
    radiusMeters: 900,
    dataSource: 'Cyberabad Police She Teams Advisory Report',
    lastUpdated: '2026-11-01',
    active: true,
  },
  {
    id: 'rz-03',
    name: 'Ameerpet Metro Hub Safe Transit Corridor',
    nameTe: 'అమీర్‌పేట్ మెట్రో హబ్ సురక్షిత ప్రాంతం',
    description: 'High security presence with 24/7 CCTV surveillance and active She Teams booth.',
    descriptionTe: '24/7 సీసీటీవీ నిఘా మరియు షీ టీమ్స్ బూత్ ఉన్న అధిక రక్షణ ప్రాంతం.',
    riskLevel: 'NORMAL',
    latitude: 17.4374,
    longitude: 78.4482,
    radiusMeters: 500,
    dataSource: 'Hyderabad City Police & Metro Rail Security',
    lastUpdated: '2026-11-04',
    active: true,
  }
];

const nearbyServices = [
  {
    id: 'ns-01',
    name: 'Begumpet Women Police Station (She Teams)',
    nameTe: 'బేగంపేట్ మహిళా పోలీస్ స్టేషన్ (షీ టీమ్స్)',
    category: 'POLICE',
    phone: '1091',
    address: 'Near Old Airport Road, Begumpet, Hyderabad',
    addressTe: 'పాత ఎయిర్‌పోర్ట్ రోడ్, బేగంపేట్, హైదరాబాద్',
    latitude: 17.4410,
    longitude: 78.4600,
    is24x7: true,
    verified: true,
  },
  {
    id: 'ns-02',
    name: 'National Emergency Response Centre (ERSS)',
    nameTe: 'జాతీయ అత్యవసర స్పందన కేంద్రం (112)',
    category: 'POLICE',
    phone: '112',
    address: 'Central Police Command & Control Centre, Banjara Hills',
    addressTe: 'కమాండ్ & కంట్రోల్ సెంటర్, బంజారా హిల్స్',
    latitude: 17.4200,
    longitude: 78.4480,
    is24x7: true,
    verified: true,
  },
  {
    id: 'ns-03',
    name: 'Sakhi One Stop Crisis Centre for Women',
    nameTe: 'సఖి వన్ స్టాప్ మహిళా సహాయ కేంద్రం',
    category: 'WOMEN_HELPLINE',
    phone: '181',
    address: 'Niloufer Hospital Campus, Red Hills, Lakdikapul',
    addressTe: 'నీలోఫర్ హాస్పిటల్ ప్రాంగణం, రెడ్ హిల్స్, లక్డీకాపూల్',
    latitude: 17.4010,
    longitude: 78.4650,
    is24x7: true,
    verified: true,
  },
  {
    id: 'ns-04',
    name: 'Osmania General Hospital & Trauma Care',
    nameTe: 'ఉస్మానియా జనరల్ హాస్పిటల్ & ట్రామా కేర్',
    category: 'HOSPITAL',
    phone: '040-24600121',
    address: 'Afzal Gunj, Hyderabad',
    addressTe: 'అఫ్జల్‌గంజ్, హైదరాబాద్',
    latitude: 17.3780,
    longitude: 78.4750,
    is24x7: true,
    verified: true,
  },
  {
    id: 'ns-05',
    name: 'GVK EMRI 108 Emergency Ambulance Hub',
    nameTe: '108 అత్యవసర అంబులెన్స్ సేవలు',
    category: 'EMERGENCY_AMBULANCE',
    phone: '108',
    address: 'Devar Yamjal, Medchal Road / Dispatch Citywide',
    addressTe: 'నగరవ్యాప్త తక్షణ అంబులెన్స్ నెట్‌వర్క్',
    latitude: 17.4320,
    longitude: 78.4410,
    is24x7: true,
    verified: true,
  }
];

let checkinRecords: any[] = [];
const recentSosRequestsByUser = new Map<string, { timestamp: number; alertId: string }>();

// Helper: E.164 phone formatting and validation
function validateAndFormatPhone(phoneInput: string): { valid: boolean; formatted: string; cleanDigits: string; error?: string } {
  if (!phoneInput || typeof phoneInput !== 'string') {
    return { valid: false, formatted: '', cleanDigits: '', error: 'Phone number is required.' };
  }
  const cleanDigits = phoneInput.replace(/[^0-9]/g, '');
  if (cleanDigits.length < 10) {
    return { valid: false, formatted: phoneInput, cleanDigits, error: 'Phone number must have at least 10 digits.' };
  }
  if (cleanDigits.length === 10) {
    return { valid: true, formatted: `+91${cleanDigits}`, cleanDigits: `91${cleanDigits}` };
  }
  if (phoneInput.trim().startsWith('+')) {
    return { valid: true, formatted: `+${cleanDigits}`, cleanDigits };
  }
  return { valid: true, formatted: `+${cleanDigits}`, cleanDigits };
}

// ==========================================
// API ROUTES
// ==========================================

// Health & Gateway Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    demoMode: !isTwilioConfigured,
    twilioConfigured: isTwilioConfigured,
    gateways: {
      twilioSms: isTwilioConfigured ? 'CONFIGURED_REAL_SMS' : 'CREDENTIALS_MISSING',
      whatsAppCloud: process.env.WHATSAPP_API_TOKEN ? 'CONFIGURED' : 'DIRECT_INTENT_LINK',
      geminiAi: apiKey ? 'ACTIVE' : 'FALLBACK_RULE_BASED',
    },
    version: '2.1.0-emergency-sms',
  });
});

// ==========================================
// PRIORITY 4: EMERGENCY CONTACT MANAGEMENT APIS (Synchronized with Database)
// ==========================================

// Get user contacts
app.get('/api/contacts', (req, res) => {
  const userId = (req.query.userId as string) || 'user-01';
  const userContacts = contactsDatabase.filter(c => c.userId === userId);
  res.json({ contacts: userContacts });
});

// Add new contact
app.post('/api/contacts', (req, res) => {
  const {
    userId = 'user-01',
    name,
    phone,
    relationship = 'Family',
    email,
    notificationPreferences = { sms: true, whatsapp: true, call: false },
    eligibleForSos = true,
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and mobile number are required.' });
  }

  const phoneCheck = validateAndFormatPhone(phone);
  if (!phoneCheck.valid) {
    return res.status(400).json({ error: phoneCheck.error });
  }

  const newContact: EmergencyContactRecord = {
    id: `c-${Date.now()}`,
    userId,
    name: name.trim(),
    phone: phoneCheck.formatted,
    relationship: relationship.trim(),
    email: email ? email.trim() : undefined,
    verified: false,
    isPrimary: contactsDatabase.filter(c => c.userId === userId).length === 0,
    eligibleForSos: Boolean(eligibleForSos),
    notificationPreferences: {
      sms: Boolean(notificationPreferences.sms ?? true),
      whatsapp: Boolean(notificationPreferences.whatsapp ?? true),
      call: Boolean(notificationPreferences.call ?? false),
    },
    createdAt: new Date().toISOString(),
  };

  contactsDatabase.push(newContact);
  res.status(201).json({ success: true, contact: newContact });
});

// Edit contact
app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, relationship, email, notificationPreferences, eligibleForSos, isPrimary } = req.body;

  const contact = contactsDatabase.find(c => c.id === id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  if (name) contact.name = name.trim();
  if (phone) {
    const phoneCheck = validateAndFormatPhone(phone);
    if (!phoneCheck.valid) return res.status(400).json({ error: phoneCheck.error });
    contact.phone = phoneCheck.formatted;
  }
  if (relationship) contact.relationship = relationship.trim();
  if (email !== undefined) contact.email = email.trim() || undefined;
  if (notificationPreferences) {
    contact.notificationPreferences = {
      sms: Boolean(notificationPreferences.sms ?? contact.notificationPreferences.sms),
      whatsapp: Boolean(notificationPreferences.whatsapp ?? contact.notificationPreferences.whatsapp),
      call: Boolean(notificationPreferences.call ?? contact.notificationPreferences.call),
    };
  }
  if (eligibleForSos !== undefined) contact.eligibleForSos = Boolean(eligibleForSos);
  if (isPrimary !== undefined) {
    if (isPrimary) {
      contactsDatabase.forEach(c => {
        if (c.userId === contact.userId) c.isPrimary = (c.id === contact.id);
      });
    } else {
      contact.isPrimary = false;
    }
  }

  res.json({ success: true, contact });
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const index = contactsDatabase.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  const [deleted] = contactsDatabase.splice(index, 1);
  res.json({ success: true, deletedId: deleted.id });
});

// Verify contact with OTP
app.post('/api/contacts/:id/verify', (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  const contact = contactsDatabase.find(c => c.id === id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  // Accepts 6-digit code or demo 123456
  if (!otp || (otp !== '123456' && String(otp).trim().length !== 6)) {
    return res.status(400).json({ error: 'Invalid 6-digit OTP code.' });
  }

  contact.verified = true;
  res.json({ success: true, contact });
});

// Toggle contact eligibility for emergency alerts
app.patch('/api/contacts/:id/eligibility', (req, res) => {
  const { id } = req.params;
  const { eligibleForSos } = req.body;

  const contact = contactsDatabase.find(c => c.id === id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  contact.eligibleForSos = Boolean(eligibleForSos);
  res.json({ success: true, contact });
});

// ==========================================
// PRIORITY 1 & 2: RED ALERT REAL SMS DISPATCH API
// POST /api/emergency/send-alert
// ==========================================

const handleEmergencySendAlert = async (req: express.Request, res: express.Response) => {
  const {
    userId = 'user-01',
    userName = 'Preethika P',
    userPhone = '+91 98765 43210',
    incidentType = 'SOS_BUTTON',
    latitude,
    longitude,
    address,
    preferredLanguage = 'en',
    triggerZoneName,
    triggerZoneLevel,
    lastKnownCoords,
  } = req.body;

  // Duplicate SOS Request Prevention (Debounce check within 8 seconds)
  const now = Date.now();
  const lastRequest = recentSosRequestsByUser.get(userId);
  if (lastRequest && (now - lastRequest.timestamp < 8000)) {
    return res.status(429).json({
      success: false,
      duplicatePrevented: true,
      error: preferredLanguage === 'te'
        ? 'అలర్ట్ ఇప్పటికే పంపబడుతోంది. దయచేసి కొన్ని సెకన్లు వేచి ఉండండి.'
        : 'An emergency alert is already in progress. Please wait a few seconds before retrying.',
      activeAlertId: lastRequest.alertId,
    });
  }

  const alertId = `ALERT-${Date.now().toString().slice(-6)}`;
  recentSosRequestsByUser.set(userId, { timestamp: now, alertId });

  // Priority 4: Retrieve ALL eligible emergency contacts saved in the database
  const eligibleContacts = contactsDatabase.filter(c => c.userId === userId && c.eligibleForSos !== false);

  if (eligibleContacts.length === 0) {
    return res.status(400).json({
      success: false,
      error: preferredLanguage === 'te'
        ? 'అత్యవసర కాంటాక్ట్‌లు ఏవీ నమోదు కాలేదు. దయచేసి కనీసం ఒక కాంటాక్ట్‌ను నమోదు చేయండి.'
        : 'No eligible emergency contacts registered. Please save at least one emergency contact before triggering Red Alert.',
    });
  }

  // Priority 5: GPS Location Processing (Do NOT block if GPS unavailable)
  const hasFreshGps = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);
  let effectiveLat: number | null = hasFreshGps ? latitude : null;
  let effectiveLng: number | null = hasFreshGps ? longitude : null;
  let locationUnavailable = !hasFreshGps;
  let locationNote = '';

  if (!hasFreshGps && lastKnownCoords && typeof lastKnownCoords.latitude === 'number') {
    effectiveLat = lastKnownCoords.latitude;
    effectiveLng = lastKnownCoords.longitude;
    locationNote = ' (Last Known Location)';
  }

  const googleMapsUrl = effectiveLat && effectiveLng
    ? `https://maps.google.com/?q=${effectiveLat},${effectiveLng}`
    : 'Location Unavailable';

  // Priority 1 & 7: Generate Exact Emergency SMS Content
  let zonePrefixEn = triggerZoneName ? `[DANGER ZONE: ${triggerZoneName}] ` : '';
  let zonePrefixTe = triggerZoneName ? `[ప్రమాదకర ప్రాంతం: ${triggerZoneName}] ` : '';

  let messageEn = '';
  let messageTe = '';

  if (!locationUnavailable) {
    messageEn = `EMERGENCY ALERT! ${zonePrefixEn}${userName} needs immediate assistance. Current Location: ${googleMapsUrl}. Please contact her immediately.`;
    messageTe = `అత్యవసర హెచ్చరిక! ${zonePrefixTe}${userName} కు తక్షణ సహాయం అవసరం. ప్రస్తుత లొకేషన్: ${googleMapsUrl}. దయచేసి వెంటనే సంప్రదించండి.`;
  } else {
    messageEn = `EMERGENCY ALERT! ${zonePrefixEn}${userName} needs immediate assistance. Current Location: Location unavailable${locationNote ? ' (' + locationNote + ')' : ''}. Please contact her immediately.`;
    messageTe = `అత్యవసర హెచ్చరిక! ${zonePrefixTe}${userName} కు తక్షణ సహాయం అవసరం. ప్రస్తుత లొకేషన్: అందుబాటులో లేదు. దయచేసి వెంటనే సంప్రదించండి.`;
  }

  const activeMessage = preferredLanguage === 'te' ? messageTe : messageEn;
  const timestamp = new Date().toISOString();

  // Priority 1 & 2: Send Real SMS to EVERY eligible contact independently
  const notifications: AlertNotificationResult[] = [];

  for (const contact of eligibleContacts) {
    const phoneValidation = validateAndFormatPhone(contact.phone);

    // Direct Intent Fallback URLs for 1-click native client delivery
    const cleanDigits = phoneValidation.cleanDigits;
    const cleanPhone = phoneValidation.formatted;
    const whatsappPhone = cleanDigits.startsWith('91') ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);

    const directActionUrls = {
      whatsappUrl: `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(activeMessage)}`,
      smsUrl: `sms:${cleanPhone}?body=${encodeURIComponent(activeMessage)}`,
      callUrl: `tel:${cleanPhone}`,
    };

    if (!phoneValidation.valid) {
      notifications.push({
        contactId: contact.id,
        contactName: contact.name,
        phone: contact.phone,
        channel: 'SMS',
        status: 'Failed',
        error: `Invalid phone number format: ${phoneValidation.error}`,
        message: activeMessage,
        sentAt: timestamp,
        ...directActionUrls,
      });
      continue;
    }

    // Real Twilio SMS API Execution
    if (isTwilioConfigured && twilioClient) {
      try {
        const twilioRes = await twilioClient.messages.create({
          body: activeMessage,
          from: twilioPhoneNumber,
          to: phoneValidation.formatted,
        });

        // Twilio returns a message SID on acceptance
        notifications.push({
          contactId: contact.id,
          contactName: contact.name,
          phone: phoneValidation.formatted,
          channel: 'SMS',
          status: 'Accepted by provider',
          providerMessageId: twilioRes.sid,
          message: activeMessage,
          sentAt: timestamp,
          ...directActionUrls,
        });
      } catch (err: any) {
        console.error(`Twilio SMS dispatch failed for ${contact.name} (${contact.phone}):`, err?.message || err);
        notifications.push({
          contactId: contact.id,
          contactName: contact.name,
          phone: phoneValidation.formatted,
          channel: 'SMS',
          status: 'Failed',
          error: err?.message || 'Twilio carrier rejected SMS request.',
          message: activeMessage,
          sentAt: timestamp,
          ...directActionUrls,
        });
      }
    } else {
      // Priority 2: If credentials are not configured, clearly display that real SMS delivery is unavailable
      // DO NOT pretend messages were sent!
      notifications.push({
        contactId: contact.id,
        contactName: contact.name,
        phone: phoneValidation.formatted,
        channel: 'SMS',
        status: 'Failed',
        error: 'Twilio SMS gateway credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not configured in environment variables.',
        message: activeMessage,
        sentAt: timestamp,
        ...directActionUrls,
      });
    }
  }

  const acceptedCount = notifications.filter(n => n.status === 'Accepted by provider' || n.status === 'Delivered').length;
  const failedCount = notifications.filter(n => n.status === 'Failed').length;

  const incidentRecord: IncidentRecord = {
    id: alertId,
    userId,
    userName,
    userPhone,
    incidentType,
    status: 'ACTIVE',
    latitude: effectiveLat,
    longitude: effectiveLng,
    address,
    googleMapsUrl,
    locationUnavailable,
    timestamp,
    triggerZoneName,
    triggerZoneLevel,
    contactsNotifiedCount: eligibleContacts.length,
    acceptedCount,
    failedCount,
    notifiedContacts: notifications,
    credentialsConfigured: isTwilioConfigured,
    providerError: !isTwilioConfigured
      ? 'Real SMS Gateway Not Configured: Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env to deliver real SMS to cellular networks.'
      : undefined,
    isDemo: !isTwilioConfigured,
  };

  incidentsDatabase.unshift(incidentRecord);

  res.status(201).json({
    success: true,
    alertId,
    timestamp,
    latitude: effectiveLat,
    longitude: effectiveLng,
    googleMapsUrl,
    locationUnavailable,
    eligibleContactsCount: eligibleContacts.length,
    acceptedCount,
    failedCount,
    notifications,
    credentialsConfigured: isTwilioConfigured,
    providerError: incidentRecord.providerError,
    messageEn,
    messageTe,
    incident: incidentRecord,
  });
};

app.post('/api/emergency/send-alert', handleEmergencySendAlert);
app.post('/api/incidents', handleEmergencySendAlert);

// Retry failed SMS notifications
app.post('/api/emergency/retry-sms', async (req, res) => {
  const { alertId, contactId } = req.body;

  const incident = incidentsDatabase.find(i => i.id === alertId);
  if (!incident) {
    return res.status(404).json({ error: 'Alert incident not found' });
  }

  const targets = contactId
    ? incident.notifiedContacts.filter(n => n.contactId === contactId)
    : incident.notifiedContacts.filter(n => n.status === 'Failed');

  if (targets.length === 0) {
    return res.status(400).json({ error: 'No failed notifications found for retry.' });
  }

  for (const item of targets) {
    const phoneCheck = validateAndFormatPhone(item.phone);
    if (!phoneCheck.valid) {
      item.status = 'Failed';
      item.error = phoneCheck.error;
      continue;
    }

    if (isTwilioConfigured && twilioClient) {
      try {
        const twilioRes = await twilioClient.messages.create({
          body: item.message,
          from: twilioPhoneNumber,
          to: phoneCheck.formatted,
        });
        item.status = 'Accepted by provider';
        item.providerMessageId = twilioRes.sid;
        item.error = undefined;
      } catch (err: any) {
        item.status = 'Failed';
        item.error = err?.message || 'Twilio retry failed.';
      }
    } else {
      item.status = 'Failed';
      item.error = 'Twilio credentials not configured in environment variables.';
    }
  }

  incident.acceptedCount = incident.notifiedContacts.filter(n => n.status === 'Accepted by provider' || n.status === 'Delivered').length;
  incident.failedCount = incident.notifiedContacts.filter(n => n.status === 'Failed').length;

  res.json({
    success: true,
    acceptedCount: incident.acceptedCount,
    failedCount: incident.failedCount,
    notifications: incident.notifiedContacts,
  });
});

// Get incidents history
app.get('/api/incidents', (req, res) => {
  res.json({ incidents: incidentsDatabase });
});

// Resolve emergency alert
app.patch('/api/incidents/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { notes = 'User confirmed safe and resolved alert' } = req.body;

  const incident = incidentsDatabase.find(inc => inc.id === id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  incident.status = 'RESOLVED';
  incident.resolvedAt = new Date().toISOString();
  incident.resolutionNotes = notes;

  res.json({ success: true, incident });
});

// ==========================================
// PRIORITY 6: SAFETY CONFIRMATION API
// ==========================================

app.post('/api/safety/status', async (req, res) => {
  const { userId = 'user-01', userName = 'Preethika P', status, notifyContacts = false, preferredLanguage = 'en' } = req.body;

  const safeMsgEn = `${userName}: I am safe. No assistance is needed.`;
  const safeMsgTe = `${userName}: నేను సురక్షితంగా ఉన్నాను. ఎలాంటి సహాయం అవసరం లేదు.`;
  const message = preferredLanguage === 'te' ? safeMsgTe : safeMsgEn;

  let notifiedList: any[] = [];

  if (status === 'SAFE' && notifyContacts) {
    const eligible = contactsDatabase.filter(c => c.userId === userId && c.eligibleForSos !== false);
    for (const c of eligible) {
      const phoneCheck = validateAndFormatPhone(c.phone);
      if (isTwilioConfigured && twilioClient && phoneCheck.valid) {
        try {
          const resTwilio = await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneCheck.formatted,
          });
          notifiedList.push({ contact: c.name, status: 'Accepted by provider', sid: resTwilio.sid });
        } catch (e: any) {
          notifiedList.push({ contact: c.name, status: 'Failed', error: e.message });
        }
      } else {
        notifiedList.push({
          contact: c.name,
          status: 'DirectLinkReady',
          whatsappUrl: `https://api.whatsapp.com/send?phone=${phoneCheck.cleanDigits}&text=${encodeURIComponent(message)}`,
        });
      }
    }
  }

  res.json({ success: true, status, notifiedList, message });
});

// AI Voice Assistant & Intent Classification
app.post('/api/ai/voice-assistant', async (req, res) => {
  const { prompt, language = 'en', currentLocation } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const lowerPrompt = prompt.toLowerCase();
  const emergencyKeywords = [
    'unsafe', 'danger', 'help', 'emergency', 'sos', 'following me', 'scared', 'police', 'attack', 'kidnap', 'save me',
    'భయంగా', 'సహాయం', 'అత్యవసరం', 'ప్రమాదం', 'కాపాడండి', 'పోలీస్', 'వెంటపడుతున్నారు', 'రక్షించండి', 'అలర్ట్'
  ];

  const matchedEmergency = emergencyKeywords.some(kw => lowerPrompt.includes(kw));

  if (apiKey) {
    try {
      const systemInstruction = `
You are the AI Safety Brain of AURASAFE24, a women's safety platform built for India (supporting English and Telugu).
Your duty is to protect the user with maximum speed, calm empathy, and accurate intent detection.

CRITICAL DIRECTIVES:
1. If user indicates fear, harassment, being followed, physical threat, or calls for help/police/SOS:
   - "isEmergency": true
   - "intent": "EMERGENCY"
   - "recommendedAction": "TRIGGER_SOS_CONFIRMATION"
   - Keep answers under 15 words.
2. If safe: "intent": "SAFETY_CONFIRMATION", "isEmergency": false, "recommendedAction": "CONFIRM_SAFE"
3. If location share: "intent": "LOCATION_SHARE", "isEmergency": false, "recommendedAction": "SHOW_MAP"
4. If nearby help: "intent": "NEARBY_HELP", "isEmergency": false, "recommendedAction": "SHOW_MAP"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User Query: "${prompt}"\nCurrent Location: ${JSON.stringify(currentLocation || { lat: 17.4375, lng: 78.4482 })}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              isEmergency: { type: Type.BOOLEAN },
              responseTextEn: { type: Type.STRING },
              responseTextTe: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
            },
            required: ['intent', 'isEmergency', 'responseTextEn', 'responseTextTe'],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (matchedEmergency) {
          parsed.isEmergency = true;
          parsed.intent = 'EMERGENCY';
          parsed.recommendedAction = 'TRIGGER_SOS_CONFIRMATION';
        }
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error('Gemini error:', err?.message || err);
    }
  }

  if (matchedEmergency) {
    return res.json({
      intent: 'EMERGENCY',
      isEmergency: true,
      responseTextEn: "Emergency intent detected. Opening Red Alert immediately. Stay calm.",
      responseTextTe: "అత్యవసర పరిస్థితి గుర్తించబడింది. వెంటనే రెడ్ అలర్ట్ ఓపెన్ చేస్తున్నాను. భయపడకండి.",
      recommendedAction: 'TRIGGER_SOS_CONFIRMATION',
    });
  }

  if (lowerPrompt.includes('safe') || lowerPrompt.includes('సురక్షిత')) {
    return res.json({
      intent: 'SAFETY_CONFIRMATION',
      isEmergency: false,
      responseTextEn: "I'm glad to know you are safe. Your status is updated to Safe.",
      responseTextTe: "మీరు సురక్షితంగా ఉన్నందుకు సంతోషం. మీ భద్రతా స్థితి సురక్షితంగా అప్‌డేట్ చేయబడింది.",
      recommendedAction: 'CONFIRM_SAFE',
    });
  }

  if (lowerPrompt.includes('location') || lowerPrompt.includes('లొకేషన్')) {
    return res.json({
      intent: 'LOCATION_SHARE',
      isEmergency: false,
      responseTextEn: "Sharing your live GPS location link with your emergency contacts.",
      responseTextTe: "మీ లైవ్ GPS లొకేషన్ లింక్‌ను మీ కాంటాక్ట్స్‌కు షేర్ చేస్తున్నాను.",
      recommendedAction: 'SHOW_MAP',
    });
  }

  return res.json({
    intent: 'GENERAL_QUERY',
    isEmergency: false,
    responseTextEn: "AURASAFE24 is monitoring your safety. Speak commands in English or Telugu anytime.",
    responseTextTe: "AURASAFE24 మీ రక్షణ కోసం సిద్ధంగా ఉంది. మీరు ఎప్పుడైనా తెలుగు లేదా ఇంగ్లీషులో ఆదేశాలు ఇవ్వవచ్చు.",
    recommendedAction: 'SHOW_CONTACTS',
  });
});

// Risk Zones
app.get('/api/risk-zones', (req, res) => {
  res.json({ riskZones });
});

app.post('/api/risk-zones', (req, res) => {
  const { name, nameTe, description, descriptionTe, riskLevel, latitude, longitude, radiusMeters, dataSource } = req.body;
  if (!name || !riskLevel || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required risk zone fields' });
  }

  const newZone = {
    id: `rz-${Date.now().toString().slice(-4)}`,
    name,
    nameTe: nameTe || name,
    description: description || 'Configured via AURASAFE24 Admin Console',
    descriptionTe: descriptionTe || description || 'షీగార్డ్ అడ్మిన్ ద్వారా నమోదు చేయబడింది',
    riskLevel,
    latitude: Number(latitude),
    longitude: Number(longitude),
    radiusMeters: Number(radiusMeters) || 500,
    dataSource: dataSource || 'Official State Safety Directive',
    lastUpdated: new Date().toISOString().split('T')[0],
    active: true,
  };

  riskZones.push(newZone);
  res.status(201).json({ success: true, riskZone: newZone });
});

// Nearby Services
app.get('/api/nearby-services', (req, res) => {
  res.json({ services: nearbyServices });
});

// Test Notification Dispatcher
app.post('/api/notifications/test', (req, res) => {
  const { contactName, phone, language = 'en' } = req.body;
  const message = language === 'te'
    ? `[AURASAFE24 టెస్ట్]: మీ నంబర్ (${phone}) Preethika అత్యవసర కాంటాక్ట్‌గా విజయవంతంగా నమోదైంది. అత్యవసర సమయంలో ఈ నంబర్‌కు సహాయం కోరుతూ SMS వస్తుంది.`
    : `[AURASAFE24 TEST]: Your phone (${phone}) has been registered as an Emergency Contact for Preethika. You will receive live GPS SMS alerts during emergencies.`;

  res.json({
    success: true,
    channel: 'SMS',
    recipient: { contactName, phone },
    previewMessage: message,
    timestamp: new Date().toISOString(),
    isTwilioConfigured,
  });
});

// Check-in Record API
app.post('/api/checkin', (req, res) => {
  const { userId = 'user-01', response, latitude, longitude } = req.body;
  const record = {
    id: `chk-${Date.now().toString().slice(-6)}`,
    userId,
    scheduledTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    responseTime: new Date().toISOString(),
    response,
    latitude,
    longitude,
    escalationStatus: response === 'MISSED' ? 'CONTACTS_NOTIFIED' : 'NONE',
  };
  checkinRecords.unshift(record);
  res.json({ success: true, record });
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURASAFE24 server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
