import React, { useState, useEffect, useRef } from 'react';
import { 
  EmergencyContact, EmergencyIncident, EscalationMode, Language, 
  NearbyService, RiskZone, SafetyStatus, UserProfile 
} from './types';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SosModal } from './components/SosModal';
import { ActiveSosBanner } from './components/ActiveSosBanner';
import { CheckinPromptModal } from './components/CheckinPromptModal';
import { PermissionModal } from './components/PermissionModal';

// Views
import { DashboardView } from './views/DashboardView';
import { LiveTrackingView } from './views/LiveTrackingView';
import { VoiceAssistantView } from './views/VoiceAssistantView';
import { ContactsView } from './views/ContactsView';
import { SafetyCheckinView } from './views/SafetyCheckinView';
import { NearbyHelpView } from './views/NearbyHelpView';
import { EmergencyHistoryView } from './views/EmergencyHistoryView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { DemoCenterView } from './views/DemoCenterView';
import { AuthView } from './views/AuthView';

export default function App() {
  // Authentication & Profile
  const [user, setUser] = useState<UserProfile | null>(() => StorageService.getUser());
  const [language, setLanguage] = useState<Language>(() => StorageService.getLanguage());
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>(() => StorageService.getSafetyStatus());
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => StorageService.getContacts());
  const [escalationMode, setEscalationMode] = useState<EscalationMode>(() => StorageService.getEscalationMode());
  const [autoAlertDangerZones, setAutoAlertDangerZones] = useState<boolean>(() => StorageService.getAutoAlertDangerZones());

  // Navigation
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // GPS & Location State
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  }>(() => {
    const saved = StorageService.getLastCoords();
    return {
      latitude: saved.latitude,
      longitude: saved.longitude,
      address: 'Begumpet Metro Station, Hyderabad, Telangana',
    };
  });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);

  // Risk Zones & Nearby Services
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [services, setServices] = useState<NearbyService[]>([]);
  const [currentRiskZone, setCurrentRiskZone] = useState<RiskZone | null>(null);

  // Incidents
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(null);

  // Modals & Triggers
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState<boolean>(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Automatic Danger Zone Alert Tracking
  const [dangerZoneTriggerInfo, setDangerZoneTriggerInfo] = useState<{ name: string; level: string } | null>(null);
  const lastAutoTriggeredZoneRef = useRef<string | null>(null);

  // Contacts to alert resolution logic (Ensures all specified contacts are included!)
  const getContactsToAlert = (): EmergencyContact[] => {
    if (escalationMode === 'VERIFIED') {
      const verifiedOnly = contacts.filter((c) => c.verified);
      return verifiedOnly.length > 0 ? verifiedOnly : contacts;
    }
    if (escalationMode === 'PRIMARY_FIRST') {
      const primary = contacts.filter((c) => c.isPrimary);
      const others = contacts.filter((c) => !c.isPrimary);
      return [...primary, ...others];
    }
    // Default 'ALL': Broadcast to all specified registered emergency contacts
    return contacts;
  };

  // Geofence calculation (Haversine formula in meters)
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [zones, serv, incs, health] = await Promise.allSettled([
          ApiService.fetchRiskZones(),
          ApiService.fetchNearbyServices(),
          ApiService.fetchIncidents(),
          ApiService.fetchHealth(),
        ]);

        if (zones.status === 'fulfilled') setRiskZones(zones.value);
        if (serv.status === 'fulfilled') setServices(serv.value);
        if (incs.status === 'fulfilled') {
          setIncidents(incs.value);
          const active = incs.value.find((i) => i.status === 'ACTIVE');
          if (active) setActiveIncident(active);
        }
        if (health.status === 'fulfilled') {
          setIsDemoMode(health.value.demoMode);
        }
      } catch (e) {
        console.error('Initialization error:', e);
      }
    };

    loadInitialData();
  }, []);

  // Geolocation watch
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setIsGpsActive(true);
        const newCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          address: coords.address,
        };
        setCoords(newCoords);
        StorageService.setLastCoords(newCoords);
      },
      (err) => {
        console.warn('Geolocation error or permission denied:', err.message);
        setIsGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Real-time Geofence Risk Zone proximity check & AUTOMATIC RED ALERT
  useEffect(() => {
    if (!coords || riskZones.length === 0) return;

    const matchedZone = riskZones.find((zone) => {
      if (!zone.active) return false;
      const dist = calculateDistanceMeters(
        coords.latitude,
        coords.longitude,
        zone.latitude,
        zone.longitude
      );
      return dist <= zone.radiusMeters;
    });

    setCurrentRiskZone(matchedZone || null);

    // If entered a High-Risk / Danger Zone:
    if (matchedZone && matchedZone.riskLevel === 'HIGH_RISK') {
      if (lastAutoTriggeredZoneRef.current !== matchedZone.id && !activeIncident) {
        lastAutoTriggeredZoneRef.current = matchedZone.id;
        const zoneName = language === 'te' ? matchedZone.nameTe : matchedZone.name;

        setDangerZoneTriggerInfo({
          name: zoneName,
          level: matchedZone.riskLevel,
        });

        // Trigger automatic Red Alert sequence if autoAlertDangerZones is enabled
        if (autoAlertDangerZones) {
          setIsSosModalOpen(true);
        }
      }
    } else if (!matchedZone) {
      lastAutoTriggeredZoneRef.current = null;
    }
  }, [coords, riskZones, autoAlertDangerZones, activeIncident, language]);

  // Periodic Safety Check-in Timer
  useEffect(() => {
    const intervalMinutes = user?.checkinFrequencyMinutes || 30;
    const interval = setInterval(() => {
      if (!activeIncident) {
        setIsCheckinModalOpen(true);
      }
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, activeIncident]);

  // Language Change Handler
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    StorageService.setLanguage(newLang);
    if (user) {
      const updated = { ...user, preferredLanguage: newLang };
      setUser(updated);
      StorageService.setUser(updated);
    }
  };

  // Status Change Handler
  const handleStatusChange = (newStatus: SafetyStatus) => {
    setSafetyStatus(newStatus);
    StorageService.setSafetyStatus(newStatus);
  };

  // Direct trigger for Danger Zone Red Alert (Used by simulation & geofencing)
  const handleTriggerDangerZoneAlert = (zone: RiskZone) => {
    const zoneName = language === 'te' ? zone.nameTe : zone.name;
    setDangerZoneTriggerInfo({
      name: zoneName,
      level: zone.riskLevel,
    });
    setCurrentRiskZone(zone);
    setIsSosModalOpen(true);
  };

  // Capture latest GPS coordinates with timeout; falls back gracefully
  const getLatestGpsCoordinates = async (): Promise<{ latitude: number | null; longitude: number | null }> => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 10000,
          });
        });
        const fresh = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          address: coords.address,
        };
        setCoords(fresh);
        StorageService.setLastCoords(fresh);
        return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (err) {
        console.warn('Fresh GPS capture timed out or failed, using last known coordinates:', err);
      }
    }
    return {
      latitude: coords.latitude ?? null,
      longitude: coords.longitude ?? null,
    };
  };

  // Trigger Red Alert SOS System (Priority 1 & 2)
  const handleConfirmSos = async (isDiscreet: boolean) => {
    try {
      setSafetyStatus('EMERGENCY');
      StorageService.setSafetyStatus('EMERGENCY');

      // Priority 1: Step 3 - Capture latest GPS coordinates
      const capturedLoc = await getLatestGpsCoordinates();
      const zoneTrigger = dangerZoneTriggerInfo;

      // Priority 1 & 2: Call POST /api/emergency/send-alert
      const res = await ApiService.sendEmergencyAlert({
        userId: user?.id || 'user-01',
        userName: user?.name || 'Preethika P',
        userPhone: user?.phone || '+91 98765 43210',
        incidentType: zoneTrigger ? 'HIGH_RISK_ZONE' : (isDiscreet ? 'DISCREET_TRIGGER' : 'SOS_BUTTON'),
        latitude: capturedLoc.latitude,
        longitude: capturedLoc.longitude,
        address: coords.address,
        preferredLanguage: language,
        triggerZoneName: zoneTrigger?.name,
        triggerZoneLevel: zoneTrigger?.level,
        lastKnownCoords: StorageService.getLastCoords(),
      });

      if (res.success && res.incident) {
        setActiveIncident(res.incident);
        setIncidents((prev) => [res.incident!, ...prev.filter((i) => i.id !== res.incident!.id)]);
      }
    } catch (e) {
      console.error('Failed to trigger emergency alert:', e);
    } finally {
      setDangerZoneTriggerInfo(null);
    }
  };

  // Retry failed SMS notifications only (Priority 3)
  const handleRetrySms = async (contactId?: string) => {
    if (!activeIncident) return;
    try {
      const res = await ApiService.retryFailedSms(activeIncident.id, contactId);
      if (res.success && res.notifications) {
        const updatedIncident: EmergencyIncident = {
          ...activeIncident,
          acceptedCount: res.acceptedCount,
          failedCount: res.failedCount,
          notifiedContacts: res.notifications,
        };
        setActiveIncident(updatedIncident);
        setIncidents((prev) =>
          prev.map((i) => (i.id === updatedIncident.id ? updatedIncident : i))
        );
      }
    } catch (err) {
      console.error('Failed to retry SMS:', err);
    }
  };

  // Resolve Emergency Alert
  const handleResolveIncident = async (notes: string) => {
    if (!activeIncident) return;
    try {
      const resolved = await ApiService.resolveIncident(activeIncident.id, notes);
      setActiveIncident(null);
      setSafetyStatus('SAFE');
      StorageService.setSafetyStatus('SAFE');
      setIncidents((prev) =>
        prev.map((i) => (i.id === resolved.id ? resolved : i))
      );
    } catch (e) {
      console.error('Failed to resolve incident:', e);
    }
  };

  // Handle Check-in Response
  const handleCheckinResponse = async (
    response: 'SAFE' | 'NEED_HELP' | 'NOT_SURE' | 'MISSED'
  ) => {
    try {
      await ApiService.submitCheckin({
        userId: user?.id || 'user-01',
        response,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (response === 'SAFE') {
        handleStatusChange('SAFE');
      } else if (response === 'NEED_HELP') {
        handleStatusChange('EMERGENCY');
        setIsSosModalOpen(true);
      } else if (response === 'NOT_SURE') {
        setCurrentView('map');
      } else if (response === 'MISSED') {
        console.warn('Check-in missed. Automated notification dispatched to contacts.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If user is not authenticated, show AuthView
  if (!user) {
    return (
      <AuthView
        language={language}
        onLanguageChange={handleLanguageChange}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          StorageService.setUser(loggedUser);
          setLanguage(loggedUser.preferredLanguage);
          setIsPermissionsModalOpen(true);
        }}
      />
    );
  }

  const specifiedContacts = getContactsToAlert();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        activeIncident={Boolean(activeIncident)}
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5">
        {/* Active Emergency SOS Banner (Persistent when an emergency is live) */}
        {activeIncident && (
          <ActiveSosBanner
            incident={activeIncident}
            onResolve={handleResolveIncident}
            onRetryFailed={handleRetrySms}
            language={language}
          />
        )}

        {/* View Routing */}
        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            language={language}
            safetyStatus={safetyStatus}
            onStatusChange={handleStatusChange}
            coords={coords}
            isGpsActive={isGpsActive}
            onTriggerSos={() => {
              setDangerZoneTriggerInfo(null);
              setIsSosModalOpen(true);
            }}
            onNavigate={setCurrentView}
            onShareLocation={() => setCurrentView('map')}
            currentRiskZone={currentRiskZone}
            onTriggerCheckinPrompt={() => setIsCheckinModalOpen(true)}
          />
        )}

        {currentView === 'map' && (
          <LiveTrackingView
            coords={coords}
            isGpsActive={isGpsActive}
            onRefreshLocation={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (p) => setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
                  () => {}
                );
              }
            }}
            riskZones={riskZones}
            services={services}
            language={language}
            onTriggerSos={() => {
              setDangerZoneTriggerInfo(null);
              setIsSosModalOpen(true);
            }}
            onTriggerCheckin={() => setIsCheckinModalOpen(true)}
            currentRiskZone={currentRiskZone}
          />
        )}

        {currentView === 'voice' && (
          <VoiceAssistantView
            language={language}
            onLanguageChange={handleLanguageChange}
            onTriggerSos={() => {
              setDangerZoneTriggerInfo(null);
              setIsSosModalOpen(true);
            }}
            currentCoords={coords}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'contacts' && (
          <ContactsView
            contacts={contacts}
            onUpdateContacts={(updated) => {
              setContacts(updated);
              StorageService.setContacts(updated);
            }}
            language={language}
            escalationMode={escalationMode}
            onUpdateEscalationMode={(mode) => {
              setEscalationMode(mode);
              StorageService.setEscalationMode(mode);
              if (user) {
                const updated = { ...user, escalationMode: mode };
                setUser(updated);
                StorageService.setUser(updated);
              }
            }}
          />
        )}

        {currentView === 'checkin' && (
          <SafetyCheckinView
            language={language}
            onStatusChange={handleStatusChange}
            onTriggerSos={() => {
              setDangerZoneTriggerInfo(null);
              setIsSosModalOpen(true);
            }}
            onOpenCheckinModal={() => setIsCheckinModalOpen(true)}
            userCoords={coords}
          />
        )}

        {currentView === 'nearby' && (
          <NearbyHelpView
            services={services}
            userCoords={coords}
            language={language}
          />
        )}

        {currentView === 'history' && (
          <EmergencyHistoryView
            incidents={incidents}
            onClearHistory={() => setIncidents([])}
            language={language}
          />
        )}

        {currentView === 'profile' && (
          <ProfileSettingsView
            user={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              StorageService.setUser(updated);
              setAutoAlertDangerZones(updated.autoAlertDangerZones);
              StorageService.setAutoAlertDangerZones(updated.autoAlertDangerZones);
            }}
            language={language}
            onLanguageChange={handleLanguageChange}
            onLogout={() => {
              setUser(null);
              localStorage.removeItem('sheguard_user');
            }}
            onOpenPermissions={() => setIsPermissionsModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            user={user}
            incidents={incidents}
            riskZones={riskZones}
            onAddRiskZone={async (zone) => {
              const created = await ApiService.addRiskZone(zone);
              setRiskZones((prev) => [...prev, created]);
            }}
            language={language}
          />
        )}

        {currentView === 'demo' && (
          <DemoCenterView
            language={language}
            onLanguageChange={handleLanguageChange}
            onTriggerSos={() => {
              setDangerZoneTriggerInfo(null);
              setIsSosModalOpen(true);
            }}
            onSimulateRiskZone={(zone) => setCurrentRiskZone(zone)}
            onResetRiskZone={() => setCurrentRiskZone(null)}
            onSetSimulatedCoords={(loc) => {
              setCoords({
                latitude: loc.latitude,
                longitude: loc.longitude,
                address: loc.address,
              });
            }}
            onOpenCheckinPrompt={() => setIsCheckinModalOpen(true)}
            onNavigate={setCurrentView}
            riskZones={riskZones}
            onTriggerDangerZoneAlert={handleTriggerDangerZoneAlert}
          />
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onTriggerSos={() => {
          setDangerZoneTriggerInfo(null);
          setIsSosModalOpen(true);
        }}
      />

      {/* Emergency SOS Confirmation Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => {
          setIsSosModalOpen(false);
          setDangerZoneTriggerInfo(null);
        }}
        onConfirm={handleConfirmSos}
        language={language}
        discreetDefault={user.discreetTriggerEnabled}
        dangerZoneName={dangerZoneTriggerInfo?.name}
        dangerZoneLevel={dangerZoneTriggerInfo?.level}
        specifiedContactNames={specifiedContacts.map((c) => `${c.name} (${c.relationship})`)}
      />

      {/* Safety Check-in Periodic Prompt Modal */}
      <CheckinPromptModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onResponse={handleCheckinResponse}
        language={language}
      />

      {/* Permissions Explanation Onboarding Modal */}
      <PermissionModal
        isOpen={isPermissionsModalOpen}
        onGrantAll={() => {
          setIsPermissionsModalOpen(false);
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (p) => {
                setIsGpsActive(true);
                setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude });
              },
              () => setIsGpsActive(false)
            );
          }
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
        }}
        onDismiss={() => setIsPermissionsModalOpen(false)}
        language={language}
      />
    </div>
  );
}
