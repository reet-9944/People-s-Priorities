"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Submission } from "@/lib/store";

interface MapProps {
  submissions: Submission[];
}

export default function DashboardMap({ submissions }: MapProps) {
  // Try to find the latest valid coordinate to center the map, otherwise default to a central location
  const validSubs = submissions.filter(s => s.lat && s.lon);
  
  // Calculate initial center synchronously to avoid unmounting the MapContainer
  const initialCenter: [number, number] = validSubs.length > 0 
    ? [validSubs[0].lat!, validSubs[0].lon!] 
    : [28.6139, 77.2090]; // Default New Delhi

  return (
    <MapContainer 
      center={initialCenter} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0, borderRadius: '12px' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      
      {validSubs.map(sub => {
        let markerColor = '#ef4444'; // default red for Pending
        if (sub.status === 'In Progress') markerColor = '#f59e0b'; // orange
        if (sub.status === 'Resolved') markerColor = '#10b981'; // green

        return (
          <CircleMarker
            key={sub.id}
            center={[sub.lat!, sub.lon!]}
            radius={10}
            pathOptions={{ 
              color: markerColor, 
              fillColor: markerColor, 
              fillOpacity: 0.7,
              weight: 2 
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px', color: '#0f172a' }}>{sub.categoryLabel}</div>
                <div style={{ color: markerColor, fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>● {sub.status}</div>
                <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{sub.location}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginBottom: '6px' }}>"{sub.description}"</div>
                {sub.mediaType !== 'none' && (
                  <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 'bold' }}>
                    {sub.mediaType === 'image' ? '📷 Photo Attached' : '🎙️ Voice Note'}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
