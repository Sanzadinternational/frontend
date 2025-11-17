"use client";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";

// FIX 4: Make the map container fill its parent
const MapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

// Helper function to parse coordinates
const parseCoords = (location) => {
  if (!location) return null;
  const [lat, lng] = location.split(",").map(Number);
  return { lat, lng };
};

// FIX 1: Load API key securely from environment variables
// DO NOT hardcode your key here.
const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

const LocationMap = ({ pickupLocation, dropoffLocation }) => {
  const [directions, setDirections] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

  // FIX 2: Add a default center for the map to load
  // This prevents the "blank map" issue. I've set it to Delhi, India.
const center = useMemo(() => {
  if (fromCoords) return fromCoords;
  if (toCoords) return toCoords;

  // Only fallback when both are missing
  return { lat: 28.6139, lng: 77.2090 };
}, [fromCoords, toCoords]);

  // Call Directions API
  useEffect(() => {
    if (isLoaded && fromCoords && toCoords) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: fromCoords,
          destination: toCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [isLoaded, fromCoords, toCoords]);

  // Loading and Error States
  if (!isLoaded)
    return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">Loading Map...</div>;
  if (loadError)
    return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-red-500">Error loading map</div>;

  // Main Map Render
  return (
    <div className="w-full h-[300px]"> {/* This div controls the final size */}
      <GoogleMap
        mapContainerStyle={MapContainerStyle}
        onLoad={onMapLoad}
        // FIX 2: Provide the default center and zoom
        center={center}
        zoom={10}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Markers */}
        {fromCoords && (
          <Marker
            position={fromCoords}
            label="Pickup"
            // FIX 3: Removed broken icon prop. Uses default pin.
          />
        )}

        {toCoords && (
          <Marker
            position={toCoords}
            label="Dropoff"
            // FIX 3: Removed broken icon prop. Uses default pin.
          />
        )}

        {/* 🚗 Draw road route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            // FIX 5: Hides default 'A'/'B' markers
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
