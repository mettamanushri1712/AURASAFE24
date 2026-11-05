export interface TranslationKeys {
  appName: string;
  appTagline: string;
  languageSelect: string;
  
  // Navigation
  navHome: string;
  navMap: string;
  navVoice: string;
  navContacts: string;
  navCheckin: string;
  navNearby: string;
  navHistory: string;
  navProfile: string;
  navAdmin: string;
  navDemoCenter: string;
  logout: string;
  login: string;
  register: string;

  // Welcome & Dashboard
  welcomeGreeting: string;
  howAreYouFeeling: string;
  sosButtonText: string;
  sosSubtext: string;
  safetyStatusTitle: string;
  statusSafe: string;
  statusNeedAssistance: string;
  statusEmergency: string;
  
  // Current Location Card
  currentLocationTitle: string;
  latitude: string;
  longitude: string;
  address: string;
  fetchingLocation: string;
  gpsActive: string;
  gpsInactive: string;
  gpsPermissionDenied: string;
  shareLocationBtn: string;
  liveTrackingActive: string;
  liveTrackingPaused: string;

  // Quick Actions
  quickActionsTitle: string;
  actionVoice: string;
  actionVoiceDesc: string;
  actionContacts: string;
  actionContactsDesc: string;
  actionShareLocation: string;
  actionShareLocationDesc: string;
  actionCheckin: string;
  actionCheckinDesc: string;
  actionNearbyHelp: string;
  actionNearbyHelpDesc: string;
  actionHistory: string;
  actionHistoryDesc: string;

  // SOS Emergency Confirmation Modal
  sosModalTitle: string;
  sosModalQuestion: string;
  sosModalCountdown: string;
  sosModalConfirmBtn: string;
  sosModalCancelBtn: string;
  sosModalDiscreetLabel: string;
  sosSending: string;

  // Emergency Incident Active View
  sosActiveAlertTitle: string;
  sosActiveDesc: string;
  contactsNotified: string;
  liveLocationSent: string;
  emergencyCallingTitle: string;
  callPolice112: string;
  callWomenHelpline1091: string;
  callAmbulance108: string;
  resolveEmergencyBtn: string;
  resolveSuccessMsg: string;

  // Voice Assistant
  voiceTitle: string;
  voiceSubtitle: string;
  voiceListening: string;
  voiceTapToSpeak: string;
  voiceStopListening: string;
  voiceTryCommands: string;
  voiceTextFallbackPlaceholder: string;
  voiceSendBtn: string;
  voiceEmergencyDetected: string;
  voiceTriggerSosNow: string;

  // Emergency Contacts
  contactsTitle: string;
  contactsSubtitle: string;
  addContactBtn: string;
  editContactBtn: string;
  deleteContactBtn: string;
  primaryBadge: string;
  markPrimaryBtn: string;
  verifiedBadge: string;
  unverifiedBadge: string;
  verifyWithOtpBtn: string;
  sendTestNotificationBtn: string;
  contactName: string;
  contactPhone: string;
  contactRelation: string;
  notificationPreferences: string;
  escalationModeTitle: string;
  escalationAll: string;
  escalationSelected: string;
  escalationPrimaryFirst: string;
  otpModalTitle: string;
  otpModalDesc: string;
  enterOtpPlaceholder: string;
  verifyOtpConfirmBtn: string;

  // Safety Check-in
  checkinTitle: string;
  checkinQuestion: string;
  checkinResponseSafe: string;
  checkinResponseSafeDesc: string;
  checkinResponseNeedHelp: string;
  checkinResponseNeedHelpDesc: string;
  checkinResponseNotSure: string;
  checkinResponseNotSureDesc: string;
  checkinFrequencyLabel: string;
  checkinNextScheduled: string;
  checkinMissedWarning: string;
  checkinMissedDesc: string;

  // Risk Zones & Geofencing
  riskZoneCautionTitle: string;
  riskZoneCautionMsg: string;
  riskZoneHighRiskTitle: string;
  riskZoneHighRiskMsg: string;
  riskZoneCheckinPrompt: string;
  riskZoneSharePrompt: string;
  riskZoneSosPrompt: string;
  riskDataSourceLabel: string;
  riskLastUpdatedLabel: string;

  // Nearby Help
  nearbyTitle: string;
  nearbySubtitle: string;
  filterAll: string;
  filterPolice: string;
  filterHospital: string;
  filterWomenHelpline: string;
  filterAmbulance: string;
  open24x7: string;
  getDirections: string;
  callEmergencyNow: string;
  distanceKm: string;

  // Admin Dashboard
  adminTitle: string;
  adminSubtitle: string;
  adminTotalUsers: string;
  adminActiveIncidents: string;
  adminRiskZonesCount: string;
  adminVerifiedContacts: string;
  adminCreateRiskZone: string;
  adminZoneName: string;
  adminRiskLevel: string;
  adminGatewayConfig: string;
  adminDemoModeActive: string;

  // Emergency History
  historyTitle: string;
  historySubtitle: string;
  incidentId: string;
  incidentType: string;
  incidentDate: string;
  incidentLocation: string;
  incidentStatus: string;
  incidentDeliveryStatus: string;
  clearHistoryBtn: string;
  noIncidentsFound: string;

  // Profile & Settings
  profileTitle: string;
  profileSubtitle: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  preferredLanguageLabel: string;
  discreetModeTitle: string;
  discreetModeDesc: string;
  autoAlertDangerZonesTitle: string;
  autoAlertDangerZonesDesc: string;
  saveChangesBtn: string;

  // Demo Banner & Mode
  demoModeNotice: string;
  demoModeBadge: string;
  demoSimulatedNote: string;
}

export const translations: Record<'en' | 'te', TranslationKeys> = {
  en: {
    appName: "AURASAFE24",
    appTagline: "Your Safety, Your Voice",
    languageSelect: "Language",

    navHome: "Home",
    navMap: "Live Map",
    navVoice: "AI Voice",
    navContacts: "Contacts",
    navCheckin: "Check-in",
    navNearby: "Nearby Help",
    navHistory: "History",
    navProfile: "Profile",
    navAdmin: "Admin",
    navDemoCenter: "Simulation Lab",
    logout: "Log Out",
    login: "Log In",
    register: "Register",

    welcomeGreeting: "Hello! Your safety matters.",
    howAreYouFeeling: "How are you feeling today?",
    sosButtonText: "RED ALERT",
    sosSubtext: "TAP OR HOLD IN EMERGENCY",
    safetyStatusTitle: "Safety Status",
    statusSafe: "Safe",
    statusNeedAssistance: "Need Assistance",
    statusEmergency: "Emergency",

    currentLocationTitle: "Current Location",
    latitude: "Latitude",
    longitude: "Longitude",
    address: "Current Address",
    fetchingLocation: "Detecting GPS location...",
    gpsActive: "GPS Active",
    gpsInactive: "GPS Unavailable",
    gpsPermissionDenied: "Location permission denied. Please enable in browser settings.",
    shareLocationBtn: "SHARE LIVE LOCATION",
    liveTrackingActive: "Live tracking is on",
    liveTrackingPaused: "Live tracking paused",

    quickActionsTitle: "Quick Safety Actions",
    actionVoice: "Voice Assistant",
    actionVoiceDesc: "Speak in English or Telugu",
    actionContacts: "Emergency Contacts",
    actionContactsDesc: "5 verified contacts configured",
    actionShareLocation: "Share My Location",
    actionShareLocationDesc: "Send live GPS link",
    actionCheckin: "Safety Check-in",
    actionCheckinDesc: "Automated peace-of-mind alerts",
    actionNearbyHelp: "Nearby Help",
    actionNearbyHelpDesc: "Police, Sakhi centers & hospitals",
    actionHistory: "Alert History",
    actionHistoryDesc: "View incidents & audit trail",

    sosModalTitle: "Emergency Confirmation",
    sosModalQuestion: "Are you sure you want to send an emergency alert?",
    sosModalCountdown: "Sending Red Alert automatically in",
    sosModalConfirmBtn: "YES – SEND RED ALERT",
    sosModalCancelBtn: "CANCEL",
    sosModalDiscreetLabel: "Discreet Trigger Active (silent notifications)",
    sosSending: "Broadcasting Red Alert to emergency contacts & cloud...",

    sosActiveAlertTitle: "EMERGENCY RED ALERT ACTIVE",
    sosActiveDesc: "Your location link and emergency distress notification have been dispatched to your trusted contacts.",
    contactsNotified: "Contacts Notified",
    liveLocationSent: "Live GPS broadcasted",
    emergencyCallingTitle: "Direct Emergency Helplines (India)",
    callPolice112: "Dial 112 (National Emergency)",
    callWomenHelpline1091: "Dial 1091 (Women Helpline)",
    callAmbulance108: "Dial 108 (Medical Emergency)",
    resolveEmergencyBtn: "I Am Safe Now (Resolve Alert)",
    resolveSuccessMsg: "Alert marked resolved. Follow-up safety notification recorded.",

    voiceTitle: "AURASAFE24 AI Voice Assistant",
    voiceSubtitle: "Speak naturally in English or Telugu. In urgent danger, an immediate SOS option will appear without conversation delays.",
    voiceListening: "Listening... Speak now",
    voiceTapToSpeak: "Tap to Speak",
    voiceStopListening: "Stop Listening",
    voiceTryCommands: "Try saying:",
    voiceTextFallbackPlaceholder: "Type your query or emergency statement here...",
    voiceSendBtn: "Send",
    voiceEmergencyDetected: "EMERGENCY INTENT DETECTED",
    voiceTriggerSosNow: "TRIGGER RED ALERT NOW",

    contactsTitle: "Emergency Contacts",
    contactsSubtitle: "Pre-register at least 5 trusted family members or friends to be alerted immediately during an emergency.",
    addContactBtn: "Add New Contact",
    editContactBtn: "Edit",
    deleteContactBtn: "Delete",
    primaryBadge: "Primary Contact",
    markPrimaryBtn: "Set as Primary",
    verifiedBadge: "OTP Verified",
    unverifiedBadge: "Unverified",
    verifyWithOtpBtn: "Verify Phone",
    sendTestNotificationBtn: "Send Test Alert",
    contactName: "Full Name",
    contactPhone: "Mobile Number (e.g. +91 9876543210)",
    contactRelation: "Relationship (Mother, Sister, Friend, etc.)",
    notificationPreferences: "Notification Channels",
    escalationModeTitle: "Alert Escalation Strategy",
    escalationAll: "Broadcast to all emergency contacts simultaneously",
    escalationSelected: "Send to verified contacts only",
    escalationPrimaryFirst: "Alert Primary Contact first, followed by others",
    otpModalTitle: "Verify Mobile Number",
    otpModalDesc: "A 6-digit verification code has been dispatched to test number. In demo mode, use: 123456",
    enterOtpPlaceholder: "Enter 6-digit OTP",
    verifyOtpConfirmBtn: "Confirm & Verify",

    checkinTitle: "Intelligent Safety Check-in",
    checkinQuestion: "Are you safe right now?",
    checkinResponseSafe: "YES, I AM SAFE",
    checkinResponseSafeDesc: "Confirms safety and updates your status without disturbing contacts.",
    checkinResponseNeedHelp: "I NEED HELP",
    checkinResponseNeedHelpDesc: "Immediately opens the Red Alert workflow.",
    checkinResponseNotSure: "I AM NOT SURE",
    checkinResponseNotSureDesc: "Offers to share your current location and provides immediate SOS.",
    checkinFrequencyLabel: "Automated Check-in Frequency",
    checkinNextScheduled: "Next scheduled check-in",
    checkinMissedWarning: "Safety Check-in Missed",
    checkinMissedDesc: "If unanswered after reminder, contacts will be notified of a missed check-in with your last known location (clearly labeled as a missed check-in, not a confirmed emergency).",

    riskZoneCautionTitle: "CAUTION ZONE ADVISORY",
    riskZoneCautionMsg: "CAUTION: You have entered an area marked for additional safety awareness.",
    riskZoneHighRiskTitle: "HIGH-RISK ADVISORY ZONE",
    riskZoneHighRiskMsg: "You are currently inside an area with active official safety advisories. Please verify your surroundings.",
    riskZoneCheckinPrompt: "Do you feel safe right now?",
    riskZoneSharePrompt: "Share live location with emergency contacts",
    riskZoneSosPrompt: "Trigger Red Alert",
    riskDataSourceLabel: "Data source: Verified Official Advisory",
    riskLastUpdatedLabel: "Last updated",

    nearbyTitle: "Nearby Emergency Help",
    nearbySubtitle: "Verified police stations, hospitals, Sakhi women centers, and 24/7 emergency dispatch centers.",
    filterAll: "All Services",
    filterPolice: "Police Stations",
    filterHospital: "Hospitals & Trauma",
    filterWomenHelpline: "Women Helplines",
    filterAmbulance: "Ambulance Units",
    open24x7: "24/7 Available",
    getDirections: "Directions",
    callEmergencyNow: "Call Helpline",
    distanceKm: "km away",

    adminTitle: "AURASAFE24 Admin Console",
    adminSubtitle: "Authorized safety operations, geographical risk zones, verified services, and anonymized incident audit logs.",
    adminTotalUsers: "Registered Users",
    adminActiveIncidents: "Active SOS Incidents",
    adminRiskZonesCount: "Configured Risk Zones",
    adminVerifiedContacts: "Verified Emergency Contacts",
    adminCreateRiskZone: "Add Geographical Risk Zone",
    adminZoneName: "Zone Name",
    adminRiskLevel: "Advisory Level",
    adminGatewayConfig: "Notification Gateways",
    adminDemoModeActive: "DEMO MODE ACTIVE (Simulated Delivery)",

    historyTitle: "Emergency & Check-in History",
    historySubtitle: "Review your past emergency alerts, safety check-ins, and notification delivery records.",
    incidentId: "Incident ID",
    incidentType: "Type",
    incidentDate: "Timestamp",
    incidentLocation: "Coordinates",
    incidentStatus: "Status",
    incidentDeliveryStatus: "Delivery Status",
    clearHistoryBtn: "Delete Personal Location History",
    noIncidentsFound: "No emergency alerts recorded. Stay safe!",

    profileTitle: "User Profile & Settings",
    profileSubtitle: "Manage your personal information, preferred language, and safety preferences.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Mobile Number",
    preferredLanguageLabel: "Preferred Language",
    discreetModeTitle: "Discreet Emergency Trigger",
    discreetModeDesc: "Allows silent activation of Red Alert without loud alarms or visible screen popups when in sensitive environments.",
    autoAlertDangerZonesTitle: "Automatic Red Alert in Danger Zones",
    autoAlertDangerZonesDesc: "Automatically initiates emergency Red Alert workflow upon entering verified high-risk areas.",
    saveChangesBtn: "Save Profile",

    demoModeNotice: "DEMO MODE ACTIVE: Real emergency SMS/WhatsApp will not be charged. All alerts and locations are accurately simulated.",
    demoModeBadge: "DEMO MODE",
    demoSimulatedNote: "Simulated Delivery via AURASAFE24 Sandbox"
  },
  te: {
    appName: "AURASAFE24",
    appTagline: "మీ రక్షణ, మీ గళం",
    languageSelect: "భాష",

    navHome: "హోమ్",
    navMap: "లైవ్ మ్యాప్",
    navVoice: "AI వాయిస్",
    navContacts: "కాంటాక్ట్స్",
    navCheckin: "చెక్-ఇన్",
    navNearby: "సహాయ కేంద్రాలు",
    navHistory: "హిస్టరీ",
    navProfile: "ప్రొఫైల్",
    navAdmin: "అడ్మిన్",
    navDemoCenter: "డెమో ల్యాబ్",
    logout: "లాగ్ అవుట్",
    login: "లాగిన్",
    register: "రిజిస్టర్",

    welcomeGreeting: "నమస్కారం! మీ భద్రతే మా ప్రాధాన్యత.",
    howAreYouFeeling: "మీరు ప్రస్తుతం ఎలా ఉన్నారు?",
    sosButtonText: "రెడ్ అలర్ట్ (SOS)",
    sosSubtext: "అత్యవసర సమయంలో తాకండి",
    safetyStatusTitle: "భద్రతా స్థితి",
    statusSafe: "సురక్షితంగా ఉన్నాను",
    statusNeedAssistance: "సహాయం కావాలి",
    statusEmergency: "అత్యవసర పరిస్థితి",

    currentLocationTitle: "ప్రస్తుత లొకేషన్",
    latitude: "అక్షాంశం (Latitude)",
    longitude: "రేఖాంశం (Longitude)",
    address: "ప్రస్తుత చిరునామా",
    fetchingLocation: "GPS లొకేషన్ గుర్తిస్తోంది...",
    gpsActive: "GPS ఆన్‌లో ఉంది",
    gpsInactive: "GPS అందుబాటులో లేదు",
    gpsPermissionDenied: "లొకేషన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి.",
    shareLocationBtn: "లైవ్ లొకేషన్ షేర్ చేయండి",
    liveTrackingActive: "లైవ్ ట్రాకింగ్ ఆన్‌లో ఉంది",
    liveTrackingPaused: "లైవ్ ట్రాకింగ్ పాజ్ చేయబడింది",

    quickActionsTitle: "త్వరిత భద్రతా చర్యలు",
    actionVoice: "వాయిస్ అసిస్టెంట్",
    actionVoiceDesc: "తెలుగు లేదా ఇంగ్లీషులో మాట్లాడండి",
    actionContacts: "అత్యవసర కాంటాక్ట్స్",
    actionContactsDesc: "5 నమ్మకమైన నంబర్లు సిద్ధంగా ఉన్నాయి",
    actionShareLocation: "లొకేషన్ షేర్ చేయండి",
    actionShareLocationDesc: "లైవ్ GPS లింక్ పంపించండి",
    actionCheckin: "భద్రతా చెక్-ఇన్",
    actionCheckinDesc: "ఆటోమేటిక్ సేఫ్టీ నోటిఫికేషన్లు",
    actionNearbyHelp: "దగ్గర్లోని సహాయం",
    actionNearbyHelpDesc: "పోలీస్, సఖి కేంద్రాలు, హాస్పిటల్స్",
    actionHistory: "అలర్ట్ హిస్టరీ",
    actionHistoryDesc: "మునుపటి సంఘటనల రికార్డులు",

    sosModalTitle: "అత్యవసర నిర్ధారణ",
    sosModalQuestion: "మీరు అత్యవసర అలర్ట్ పంపాలనుకుంటున్నారా?",
    sosModalCountdown: "ఆటోమేటిక్‌గా రెడ్ అలర్ట్ పంపే సమయం:",
    sosModalConfirmBtn: "అవును – రెడ్ అలర్ట్ పంపండి",
    sosModalCancelBtn: "రద్దు చేయండి",
    sosModalDiscreetLabel: "రహస్య ట్రిగ్గర్ ఆన్‌లో ఉంది (శబ్దం లేకుండా పంపబడుతుంది)",
    sosSending: "అత్యవసర కాంటాక్ట్స్‌కు మరియు క్లౌడ్‌కు రెడ్ అలర్ట్ పంపబడుతోంది...",

    sosActiveAlertTitle: "అత్యవసర రెడ్ అలర్ట్ యాక్టివ్‌గా ఉంది",
    sosActiveDesc: "మీ లైవ్ లొకేషన్ లింక్ మరియు అత్యవసర సందేశం మీ నమ్మకమైన కాంటాక్ట్స్‌కు విజయవంతంగా పంపబడ్డాయి.",
    contactsNotified: "నోటిఫై చేయబడిన కాంటాక్ట్స్",
    liveLocationSent: "లైవ్ GPS ప్రసారమవుతోంది",
    emergencyCallingTitle: "తక్షణ అత్యవసర హెల్ప్‌లైన్లు (భారతదేశం)",
    callPolice112: "112 కి కాల్ చేయండి (జాతీయ అత్యవసర విభాగం)",
    callWomenHelpline1091: "1091 కి కాల్ చేయండి (మహిళా హెల్ప్‌లైన్)",
    callAmbulance108: "108 కి కాల్ చేయండి (అంబులెన్స్)",
    resolveEmergencyBtn: "నేను ఇప్పుడు సురక్షితంగా ఉన్నాను (అలర్ట్ ముగించండి)",
    resolveSuccessMsg: "అలర్ట్ ముగించబడింది. మీరు సురక్షితంగా ఉన్నట్లు కాంటాక్ట్స్‌కు రికార్డ్ చేయబడింది.",

    voiceTitle: "AURASAFE24 AI వాయిస్ అసిస్టెంట్",
    voiceSubtitle: "తెలుగులో లేదా ఇంగ్లీషులో సూటిగా మాట్లాడండి. ప్రమాద పరిస్థితిని గుర్తిస్తే వెంటనే SOS బటన్ కనిపిస్తుంది.",
    voiceListening: "వింటోంది... మాట్లాడండి",
    voiceTapToSpeak: "మాట్లాడటానికి తాకండి",
    voiceStopListening: "ఆపండి",
    voiceTryCommands: "ఇలా చెప్పి చూడండి:",
    voiceTextFallbackPlaceholder: "మీ సందేశాన్ని లేదా సమస్యను ఇక్కడ టైప్ చేయండి...",
    voiceSendBtn: "పంపండి",
    voiceEmergencyDetected: "అత్యవసర పరిస్థితి గుర్తించబడింది",
    voiceTriggerSosNow: "వెంటనే రెడ్ అలర్ట్ పంపండి",

    contactsTitle: "అత్యవసర కాంటాక్ట్స్",
    contactsSubtitle: "ఆపద సమయంలో వెంటనే సమాచారం అందేలా కనీసం 5 మంది కుటుంబ సభ్యులు లేదా మిత్రుల నంబర్లను నమోదు చేయండి.",
    addContactBtn: "కొత్త కాంటాక్ట్ జోడించండి",
    editContactBtn: "సవరించండి",
    deleteContactBtn: "తొలగించండి",
    primaryBadge: "ముఖ్యమైన కాంటాక్ట్",
    markPrimaryBtn: "ప్రైమరీగా సెట్ చేయండి",
    verifiedBadge: "OTP తో ధృవీకరించబడింది",
    unverifiedBadge: "ధృవీకరించబడలేదు",
    verifyWithOtpBtn: "నంబర్ ధృవీకరించండి",
    sendTestNotificationBtn: "టెస్ట్ అలర్ట్ పంపండి",
    contactName: "పూర్తి పేరు",
    contactPhone: "మొబైల్ నంబర్ (+91 9876543210)",
    contactRelation: "సంబంధం (తల్లి, సోదరి, స్నేహితురాలు, తదితరులు)",
    notificationPreferences: "నోటిఫికేషన్ మాధ్యమాలు",
    escalationModeTitle: "అలర్ట్ పంపే విధానం",
    escalationAll: "అన్ని కాంటాక్ట్స్‌కు ఒకేసారి పంపండి",
    escalationSelected: "ధృవీకరించబడిన కాంటాక్ట్స్‌కు మాత్రమే పంపండి",
    escalationPrimaryFirst: "ముందుగా ప్రైమరీ కాంటాక్ట్‌కు, తరువాత ఇతరులకు పంపండి",
    otpModalTitle: "మొబైల్ నంబర్ ధృవీకరణ",
    otpModalDesc: "6 అంకెల ధృవీకరణ కోడ్ పంపబడింది. డెమో మోడ్ కోసం ఉపయోగించండి: 123456",
    enterOtpPlaceholder: "6 అంకెల OTP నమోదు చేయండి",
    verifyOtpConfirmBtn: "ధృవీకరించండి",

    checkinTitle: "ఇంటెలిజెంట్ భద్రతా చెక్-ఇన్",
    checkinQuestion: "మీరు ప్రస్తుతం సురక్షితంగా ఉన్నారా?",
    checkinResponseSafe: "నేను సురక్షితంగా ఉన్నాను",
    checkinResponseSafeDesc: "మీరు క్షేమంగా ఉన్నట్లు నమోదు చేస్తుంది. ఇతరులను ఇబ్బంది పెట్టదు.",
    checkinResponseNeedHelp: "నాకు సహాయం కావాలి",
    checkinResponseNeedHelpDesc: "వెంటనే రెడ్ అలర్ట్ స్క్రీన్‌ను తెరుస్తుంది.",
    checkinResponseNotSure: "నాకు ఖచ్చితంగా తెలియదు",
    checkinResponseNotSureDesc: "లొకేషన్ షేర్ చేసే సదుపాయం మరియు తక్షణ SOS అందిస్తుంది.",
    checkinFrequencyLabel: "చెక్-ఇన్ వ్యవధి",
    checkinNextScheduled: "తదుపరి చెక్-ఇన్ సమయం",
    checkinMissedWarning: "చెక్-ఇన్ మిస్సయింది",
    checkinMissedDesc: "సమయానికి స్పందించకపోతే, చివరగా గుర్తించిన లొకేషన్‌తో మీ కాంటాక్ట్స్‌కు 'చెక్-ఇన్ మిస్సయింది' అని స్పష్టంగా తెలియజేయబడుతుంది.",

    riskZoneCautionTitle: "జాగ్రత్త ప్రాంతం హెచ్చరిక",
    riskZoneCautionMsg: "జాగ్రత్త: మీరు అదనపు అప్రమత్తత అవసరమైన ప్రాంతంలోకి ప్రవేశించారు.",
    riskZoneHighRiskTitle: "హై-రిస్క్ సలహా ప్రాంతం",
    riskZoneHighRiskMsg: "మీరు అధికారిక భద్రతా హెచ్చరిక ఉన్న ప్రాంతంలో ఉన్నారు. దయచేసి అప్రమత్తంగా ఉండండి.",
    riskZoneCheckinPrompt: "మీరు సురక్షితంగా ఉన్నారని భావిస్తున్నారా?",
    riskZoneSharePrompt: "లైవ్ లొకేషన్ షేర్ చేయండి",
    riskZoneSosPrompt: "రెడ్ అలర్ట్ పంపండి",
    riskDataSourceLabel: "మూలం: అధికారిక భద్రతా రికార్డులు",
    riskLastUpdatedLabel: "చివరిగా అప్‌డేట్ చేయబడింది",

    nearbyTitle: "దగ్గర్లోని అత్యవసర సహాయం",
    nearbySubtitle: "ధృవీకరించబడిన పోలీస్ స్టేషన్లు, ఆసుపత్రులు, సఖి కేంద్రాలు మరియు 24/7 అత్యవసర కేంద్రాలు.",
    filterAll: "అన్ని కేంద్రాలు",
    filterPolice: "పోలీస్ స్టేషన్లు",
    filterHospital: "హాస్పిటల్స్",
    filterWomenHelpline: "మహిళా హెల్ప్‌లైన్లు",
    filterAmbulance: "అంబులెన్స్ సేవలు",
    open24x7: "24/7 అందుబాటులో ఉంది",
    getDirections: "దారి చూపించు",
    callEmergencyNow: "వెంటనే కాల్ చేయండి",
    distanceKm: "కి.మీ దూరంలో",

    adminTitle: "AURASAFE24 అడ్మిన్ ప్యానెల్",
    adminSubtitle: "భద్రతా పర్యవేక్షణ, జాగ్రత్త ప్రాంతాల నిర్వహణ మరియు రికార్డుల సమాచారం.",
    adminTotalUsers: "నమోదైన వినియోగదారులు",
    adminActiveIncidents: "ప్రస్తుత SOS అలర్టులు",
    adminRiskZonesCount: "నమోదైన రిస్క్ జోన్లు",
    adminVerifiedContacts: "ధృవీకరించిన కాంటాక్ట్స్",
    adminCreateRiskZone: "కొత్త రిస్క్ జోన్ జోడించండి",
    adminZoneName: "జోన్ పేరు",
    adminRiskLevel: "హెచ్చరిక స్థాయి",
    adminGatewayConfig: "నోటిఫికేషన్ గేట్‌వేలు",
    adminDemoModeActive: "డెమో మోడ్ యాక్టివ్ (సిమ్యులేషన్)",

    historyTitle: "అత్యవసర మరియు చెక్-ఇన్ రికార్డులు",
    historySubtitle: "మీ గత అత్యవసర అలర్టులు, చెక్-ఇన్లు మరియు నోటిఫికేషన్ వివరాలను ఇక్కడ చూడవచ్చు.",
    incidentId: "సంఘటన ఐడీ",
    incidentType: "రకం",
    incidentDate: "సమయం",
    incidentLocation: "లొకేషన్",
    incidentStatus: "స్థితి",
    incidentDeliveryStatus: "డెలివరీ స్థితి",
    clearHistoryBtn: "నా లొకేషన్ హిస్టరీని తొలగించండి",
    noIncidentsFound: "ఎలాంటి అత్యవసర రికార్డులు లేవు. మీరు ఎల్లప్పుడూ క్షేమంగా ఉండాలని కోరుకుంటున్నాము!",

    profileTitle: "వినియోగదారు ప్రొఫైల్ & సెట్టింగ్స్",
    profileSubtitle: "మీ వ్యక్తిగత వివరాలు, భాష మరియు భద్రతా ప్రాధాన్యతలను నిర్వహించండి.",
    fullName: "పూర్తి పేరు",
    emailAddress: "ఈమెయిల్ చిరునామా",
    phoneNumber: "మొబైల్ నంబర్",
    preferredLanguageLabel: "ప్రాధాన్య భాష",
    discreetModeTitle: "రహస్య అత్యవసర ట్రిగ్గర్ (Discreet Mode)",
    discreetModeDesc: "క్లిష్టమైన పరిస్థితులలో బయటకు తెలియకుండా, శబ్దం లేకుండా అలర్ట్ పంపేందుకు ఉపయోగపడుతుంది.",
    autoAlertDangerZonesTitle: "డేంజర్ జోన్లలో ఆటోమేటిక్ రెడ్ అలర్ట్",
    autoAlertDangerZonesDesc: "అధికారిక హై-రిస్క్ ప్రమాదకర ప్రాంతాల్లోకి ప్రవేశించిన వెంటనే ఆటోమేటిక్‌గా అత్యవసర అలర్ట్‌ను ప్రారంభిస్తుంది.",
    saveChangesBtn: "సేవ్ చేయండి",

    demoModeNotice: "డెమో మోడ్ ఆన్‌లో ఉంది: నిజమైన SMS/WhatsApp ఛార్జీలు పడవు. అన్ని అలర్టులు సురక్షితంగా అనుకరించబడతాయి.",
    demoModeBadge: "డెమో మోడ్",
    demoSimulatedNote: "AURASAFE24 శాండ్‌బాక్స్ ద్వారా సిమ్యులేట్ చేయబడింది"
  }
};
