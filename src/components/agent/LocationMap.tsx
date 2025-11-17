"use client";

import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useMemo, useState, useCallback } from "react";

const MapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

// Parse "lat,lng"
const parseCoords = (location) => {
  if (!location) return null;

  const [lat, lng] = location.split(",").map(Number);

  if (isNaN(lat) || isNaN(lng)) {
    console.error("❌ Invalid coordinate format:", location);
    return null;
  }

  return { lat, lng };
};

const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

export default function LocationMap({ pickupLocation, dropoffLocation }) {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

  console.log("Pickup parsed:", fromCoords);
  console.log("Dropoff parsed:", toCoords);

  // Auto-center map on pickup or dropoff
  const center = useMemo(() => {
    if (fromCoords) return fromCoords;
    if (toCoords) return toCoords;
    return { lat: 28.6139, lng: 77.2090 }; // fallback
  }, [fromCoords, toCoords]);

  // Call Directions API
  useEffect(() => {
    if (!isLoaded) return;
    if (!fromCoords || !toCoords) return;

    console.log("🚗 Fetching route...");

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: fromCoords,
        destination: toCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("Directions Status:", status);

        if (status === "OK" && result) {
          console.log("Route found:", result);
          setDirections(result);
        } else {
          console.error("❌ Directions failed:", status, result);
        }
      }
    );
  }, [isLoaded, fromCoords, toCoords]);

  if (!isLoaded)
    return <div className="w-full h-[300px] flex items-center justify-center">Loading Map…</div>;

  return (
    <div className="w-full h-[300px]">
      <GoogleMap
        mapContainerStyle={MapContainerStyle}
        center={center}
        zoom={14}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Pickup Marker */}
        {fromCoords && (
          <Marker
            position={fromCoords}
            label="Pickup"
            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          />
        )}

        {/* Dropoff Marker */}
        {toCoords && (
          <Marker
            position={toCoords}
            label="Dropoff"
            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          />
        )}

        {/* 🚗 Directions Line */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
