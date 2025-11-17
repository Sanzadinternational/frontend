"use client";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";

const MapContainerStyle = {
  width: "300px",
  height: "300px",
  borderRadius: "8px",
};

const parseCoords = (location) => {
  if (!location) return null;
  const [lat, lng] = location.split(",").map(Number);
  return { lat, lng };
};

const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

const LocationMap = ({ pickupLocation, dropoffLocation }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [directions, setDirections] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

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

  if (!isLoaded)
    return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">Loading Map...</div>;
  if (loadError)
    return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-red-500">Error loading map</div>;

  return (
    <div className="w-full h-[300px]">
      <GoogleMap
        mapContainerStyle={MapContainerStyle}
        onLoad={onMapLoad}
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
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
          />
        )}

        {toCoords && (
          <Marker
            position={toCoords}
            label="Dropoff"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}

        {/* 🚗 Draw road route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
