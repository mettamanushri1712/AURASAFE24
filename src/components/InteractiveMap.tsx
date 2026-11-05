import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NearbyService, RiskZone } from '../types';

interface InteractiveMapProps {
  userLocation: { latitude: number; longitude: number; accuracy?: number };
  riskZones?: RiskZone[];
  services?: NearbyService[];
  onSelectService?: (service: NearbyService) => void;
  height?: string;
  language?: 'en' | 'te';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLocation,
  riskZones = [],
  services = [],
  onSelectService,
  height = '420px',
  language = 'en',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([userLocation.latitude, userLocation.longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan map to user location smoothly
    map.setView([userLocation.latitude, userLocation.longitude], map.getZoom());

    // Clear previous dynamic layers
    if (layersGroupRef.current) {
      layersGroupRef.current.clearLayers();
    }

    // Custom User Marker Icon
    const userIcon = L.divIcon({
      className: 'sheguard-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full bg-purple-600 opacity-30 animate-ping"></div>
          <div class="relative w-5 h-5 rounded-full bg-purple-700 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
    } else {
      userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      const userPopupText = language === 'te' 
        ? '<strong>మీ ప్రస్తుత లొకేషన్</strong><br/>లైవ్ GPS పర్యవేక్షణలో ఉంది'
        : '<strong>Your Current Location</strong><br/>Live GPS Guard Active';
      userMarkerRef.current.bindPopup(userPopupText);
    }

    // Render Risk Zones (Geofenced Circles)
    riskZones.forEach((zone) => {
      const color =
        zone.riskLevel === 'HIGH_RISK'
          ? '#dc2626'
          : zone.riskLevel === 'CAUTION'
          ? '#f59e0b'
          : '#10b981';

      const circle = L.circle([zone.latitude, zone.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: zone.riskLevel === 'HIGH_RISK' ? 0.25 : 0.15,
        weight: 2,
        radius: zone.radiusMeters,
      });

      const zoneName = language === 'te' ? zone.nameTe : zone.name;
      const zoneDesc = language === 'te' ? zone.descriptionTe : zone.description;
      const levelLabel =
        zone.riskLevel === 'HIGH_RISK'
          ? (language === 'te' ? 'హై-రిస్క్ సలహా ప్రాంతం' : 'High-Risk Advisory Zone')
          : zone.riskLevel === 'CAUTION'
          ? (language === 'te' ? 'జాగ్రత్త ప్రాంతం' : 'Caution Area')
          : (language === 'te' ? 'సురక్షిత ప్రాంతం' : 'Safe Transit Corridor');

      circle.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <div style="font-weight: 700; color: ${color}; margin-bottom: 4px;">${levelLabel}</div>
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${zoneName}</div>
          <div style="color: #4b5563; margin-bottom: 6px;">${zoneDesc}</div>
          <div style="font-size: 11px; color: #9ca3af;">${zone.dataSource}</div>
        </div>
      `);

      if (layersGroupRef.current) {
        layersGroupRef.current.addLayer(circle);
      }
    });

    // Render Nearby Services (Police, Hospital, Sakhi Helpline)
    services.forEach((service) => {
      let iconColor = '#2563eb'; // blue for police
      let iconSymbol = '👮‍♀️';

      if (service.category === 'HOSPITAL') {
        iconColor = '#e11d48';
        iconSymbol = '🏥';
      } else if (service.category === 'WOMEN_HELPLINE') {
        iconColor = '#7c3aed';
        iconSymbol = '🛡️';
      } else if (service.category === 'EMERGENCY_AMBULANCE') {
        iconColor = '#ea580c';
        iconSymbol = '🚑';
      }

      const serviceIcon = L.divIcon({
        className: 'sheguard-service-marker',
        html: `
          <div class="flex items-center justify-center w-7 h-7 rounded-full shadow-md border-2 border-white text-xs" style="background-color: ${iconColor}; color: white;">
            <span>${iconSymbol}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const serviceMarker = L.marker([service.latitude, service.longitude], {
        icon: serviceIcon,
      });

      const sName = language === 'te' ? service.nameTe : service.name;
      const sAddr = language === 'te' ? service.addressTe : service.address;

      serviceMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; max-width: 220px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px;">${sName}</div>
          <div style="color: #4b5563; margin-bottom: 6px; font-size: 12px;">${sAddr}</div>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="tel:${service.phone}" style="background-color: #7c3aed; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center;">
              📞 ${service.phone}
            </a>
            <a href="https://maps.google.com/?q=${service.latitude},${service.longitude}" target="_blank" rel="noopener noreferrer" style="background-color: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
              Directions
            </a>
          </div>
        </div>
      `);

      if (layersGroupRef.current) {
        layersGroupRef.current.addLayer(serviceMarker);
      }
    });

  }, [userLocation, riskZones, services, language]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-purple-100 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend overlay */}
      <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
          <span className="text-slate-600 font-medium">{language === 'te' ? 'మీరు' : 'You'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-600 font-medium">{language === 'te' ? 'జాగ్రత్త' : 'Caution'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span className="text-slate-600 font-medium">{language === 'te' ? 'హై-రిస్క్' : 'High Risk'}</span>
        </div>
      </div>
    </div>
  );
};
