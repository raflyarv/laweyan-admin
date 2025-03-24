/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import { LatLngTuple, Icon } from 'leaflet';
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

// Custom Marker component to get current location and handle clicks
const LocationMarker = ({ position, onLocationSelect }: any) => {
  const [currentPosition, setCurrentPosition] = useState<any>(position);

  const map = useMapEvents({
    click(e) {
      setCurrentPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
    locationfound(e) {
      if (!position) {
        setCurrentPosition(e.latlng);
        map.setView(e.latlng, 13); // Set the map center to current location
      }
    },
  });

  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position]);

  return currentPosition === null ? null : (
    <Marker
      position={currentPosition}
      icon={DefaultIcon}
    ></Marker>
  );
};
export default function CoordinateSelector({
  handleLocationSelect,
  latitude,
  longitude,
}: {
  handleLocationSelect: (location: any) => void;
  latitude?: number;
  longitude?: number;
}) {
  const [selectedLocation, setSelectedLocation] = useState<LatLngTuple | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

  // Handle user location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Set user location as initial position
        },
        () => {
          console.error('Unable to retrieve location');
          setUserLocation([-7.568598, 110.791685]); // Fallback to Laweyan, Surakarta if location is not available
        },
      );
    }
  }, []);

  // Update selected location if latitude and longitude props change
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedLocation([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Handle location selection from the map
  const handleLocationMarker = (location: any) => {
    setSelectedLocation([location.lat, location.lng]);
    handleLocationSelect(location);
  };

  const initialPosition: LatLngTuple = selectedLocation ||
    userLocation || [-7.5703264500305405, 110.79604625701906]; // Fallback to Laweyan, Surakarta

  console.log(initialPosition);
  return (
    <Box
      sx={{
        width: '100%',
        height: 400,
        bgcolor: 'background.paper',
        marginBottom: 10,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          width: '80%',
          color: 'GrayText',
          marginBottom: 2,
        }}
        fontStyle={'oblique'}
      >
        Pilih Titik Lokasi Anda pada Peta
      </Typography>
      <MapContainer
        center={initialPosition} // Set the map center to initial position
        zoom={15}
        style={{ height: '100%', width: '100%', zIndex: 99 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={selectedLocation ? selectedLocation : initialPosition}
          onLocationSelect={handleLocationMarker}
        />
      </MapContainer>
    </Box>
  );
}
