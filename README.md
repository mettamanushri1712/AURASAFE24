# SHEGUARD – Your Safety, Your Voice
### AI-Powered Bilingual Women Safety Web Application (English & తెలుగు)

**SHEGUARD** is an emergency response and personal safety platform designed to assist women across India, with dedicated native support for Telugu-speaking users. It combines real-time GPS tracking, geofenced risk zone advisories, Gemini AI voice assistance, automated intelligent safety check-ins, and multi-channel emergency alert dispatches.

---

## 🌟 Key Features

### 1. Bilingual Native Interface (English & Telugu - తెలుగు)
- Complete UI translation covering buttons, notifications, greetings, voice interactions, and emergency alert messages.
- Instant 1-click language switcher in the persistent top navigation bar.
- Exact localization:
  - English: *"EMERGENCY ALERT! [User Name] may be in danger and needs assistance. Current location: [Google Maps Link]. Time: [Timestamp]. Please contact her immediately."*
  - Telugu: *"అత్యవసర హెచ్చరిక! [User Name] ప్రమాదంలో ఉండే అవకాశం ఉంది. దయచేసి వెంటనే సహాయం చేయండి. ప్రస్తుత లొకేషన్: [Google Maps Link]. సమయం: [Timestamp]."*

### 2. RED ALERT / SOS Emergency Lifeline
- Prominent pulsing Red Alert button centered on the dashboard.
- Emergency confirmation modal with a 5-second automatic countdown and cancel button.
- Discreet trigger mode for silent activation without audible alarms.
- Instant GPS location capture and Google Maps shareable link generation.
- Real-time incident tracking dashboard with 112 (National Emergency), 1091 (Women Helpline), and 108 (Ambulance) quick dialers.
- Incident resolution workflow with confirmation notes.

### 3. AI Safety Voice Assistant (Gemini 3.8 Flash)
- Bilingual voice recognition and text-to-speech powered by the Web Speech API and Gemini 3.8 Flash.
- Animated listening indicator and audio waveform.
- Emergency Intent Detection: Identifies phrases expressing fear or distress (e.g. *"I am feeling unsafe"*, *"నాకు భయంగా ఉంది"*, *"help me"*, *"అత్యవసర అలర్ట్ పంపించు"*) and immediately opens the Red Alert workflow without conversation delays.

### 4. Emergency Contact Management
- Pre-register at least 5 trusted contacts with name, phone, relationship, and channel preferences.
- OTP mobile number verification modal (with 123456 demo code).
- Mark primary contact and test notification dispatcher.
- Configurable escalation strategy: Alert all contacts simultaneously, verified contacts only, or primary contact first.

### 5. Geographical Risk Zone Detection & Geofencing
- Geofencing that detects entry into Caution and High-Risk advisory areas.
- Configured from official police safety audits (e.g. Sanath Nagar Industrial Overpass, Miyapur ORR).
- Warning alerts prompting users to check in, share location, or trigger SOS.

### 6. Intelligent Safety Check-in System
- Periodic safety prompt: *"Are you safe right now?"* / *"మీరు ప్రస్తుతం సురక్షితంగా ఉన్నారా?"*
- Three explicit responses:
  1. `YES, I AM SAFE` (Updates status to Safe)
  2. `I NEED HELP` (Opens Red Alert workflow)
  3. `I AM NOT SURE` (Prompts location sharing and quick SOS)
- Missed check-in countdown timer with labeled notification to contacts.

### 7. Nearby Emergency Services Directory
- Live interactive Leaflet map with police stations (She Teams), trauma hospitals, Sakhi crisis centers, and ambulance hubs.
- Automatic distance calculation based on current GPS fix.

### 8. Admin Safety Console & Simulation Lab
- Role-based access control (User vs Admin).
- Configure new geographical risk zones with coordinates and radius.
- Interactive Simulation Lab for 1-click testing of SOS dispatches, voice AI, risk geofences, and SMS/WhatsApp payloads without incurring real costs.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet
- **Backend**: Node.js, Express, tsx
- **AI Brain**: `@google/genai` (Gemini 3.8 Flash)
- **Audio & Voice**: Web Speech API (`en-IN`, `te-IN`)
- **Maps & Geolocation**: Leaflet OpenStreetMap tiles & Browser Geolocation API

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
