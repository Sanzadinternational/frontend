import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";

// ... (MapContainerStyle, parseCoords)

const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI"; // <-- FIX 1: Use env variable

const LocationMap = ({ pickupLocation, dropoffLocation }) => {
  // ... (useState, useLoadScript)

  // FIX 2: Add a default center for the map
  const defaultCenter = useMemo(() => ({
    lat: 28.6139, // Default to Delhi, for example
    lng: 77.2090,
  }), []);

  // ... (mapRef, onMapLoad, fromCoords, toCoords, useEffect)

  // ... (loading and error states)

  return (
    <div className="w-full h-[300px]">
      <GoogleMap
        mapContainerStyle={MapContainerStyle}
        onLoad={onMapLoad}
        // FIX 3: Add center and zoom props
        center={defaultCenter}
        zoom={10}
        options={{
          // ... (your options)
        }}
      >
        {/* Markers */}
        {fromCoords && (
          <Marker
            position={fromCoords}
            label="Pickup"
            // FIX 4: Remove broken icon prop to use default pin
            // icon={{ url: "..." }}
          />
        )}

        {toCoords && (
          <Marker
            position={toCoords}
            label="Dropoff"
            // FIX 4: Remove broken icon prop to use default pin
            // icon={{ url: "..." }}
          />
        )}

        {/* 🚗 Draw road route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }} // Optional: hides the default 'A' and 'B' markers
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
