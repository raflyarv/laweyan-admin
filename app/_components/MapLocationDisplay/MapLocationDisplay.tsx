// MapComponent.tsx
'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon for the marker
const DefaultIcon = new Icon({
  iconUrl: markerIconPng.src,
  shadowUrl: markerShadowPng.src,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

export default function MapLocationDisplay({ latitude, longitude }: MapComponentProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ width: '100%', height: '200px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
        icon={DefaultIcon}
      >
        <Popup>
          Location: {latitude}, {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
