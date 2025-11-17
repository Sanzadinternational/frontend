"use client";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";

const MapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

const parseCoords = (location) => {
  if (!location) return null;
  const [lat, lng] = location.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
};

const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

const LocationMap = ({ pickupLocation, dropoffLocation }) => {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const mapRef = useRef(null);

  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

  console.log("Pickup parsed:", fromCoords);
  console.log("Dropoff parsed:", toCoords);

  // Auto-center on pickup → or dropoff → fallback Delhi
  const center = useMemo(() => {
    if (fromCoords) return fromCoords;
    if (toCoords) return toCoords;
    return { lat: 28.6139, lng: 77.2090 };
  }, [fromCoords, toCoords]);

  // 🚗 Always try to draw DRIVING route
  useEffect(() => {
    if (!isLoaded) return;

    if (!fromCoords || !toCoords) {
      console.warn("Both coords required for route:", { fromCoords, toCoords });
      return;
    }

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: fromCoords,
        destination: toCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions error:", status, result);
        }
      }
    );
  }, [isLoaded, fromCoords, toCoords]);

  if (!isLoaded) return <div className="w-full h-[300px]">Loading...</div>;

  return (
    <div className="w-full h-[300px]">
      <GoogleMap mapContainerStyle={MapContainerStyle} center={center} zoom={14}>
        {fromCoords && <Marker position={fromCoords} label="Pickup" />}
        {toCoords && <Marker position={toCoords} label="Dropoff" />}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
