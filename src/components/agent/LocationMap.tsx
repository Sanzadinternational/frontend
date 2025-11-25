"use client";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState, useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

const googleMapsApiKey = "AIzaSyC9vmFHkCL1BZUjf1rTNytSfbKhmDG3OyE";

export default function LocationMap({ pickupLocation, dropoffLocation }) {
  // pickupLocation = placeId
  // dropoffLocation = placeId

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  // Convert placeId -> coordinates
  const getCoordsFromPlaceId = (placeId, setter) => {
    if (!placeId) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      { placeId, fields: ["geometry"] },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          setter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        } else {
          console.error("❌ Failed to fetch Place ID:", placeId, status);
        }
      }
    );
  };

  // Resolve Place IDs → coordinates
  useEffect(() => {
    if (!isLoaded) return;

    if (pickupLocation) getCoordsFromPlaceId(pickupLocation, setPickupCoords);
    if (dropoffLocation) getCoordsFromPlaceId(dropoffLocation, setDropoffCoords);
  }, [isLoaded, pickupLocation, dropoffLocation]);

  // Fetch route using Place IDs
  useEffect(() => {
    if (!isLoaded) return;
    if (!pickupLocation || !dropoffLocation) return;

    const svc = new window.google.maps.DirectionsService();

    svc.route(
      {
        origin: { placeId: pickupLocation },
        destination: { placeId: dropoffLocation },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("❌ Route error:", status);
        }
      }
    );
  }, [isLoaded, pickupLocation, dropoffLocation]);

  // Determine initial map center
  const center = useMemo(
    () =>
      pickupCoords ||
      dropoffCoords || { lat: 28.6139, lng: 77.2090 },
    [pickupCoords, dropoffCoords]
  );

  if (!isLoaded)
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        Loading Map…
      </div>
    );

  return (
    <div className="w-full h-[300px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
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
        {pickupCoords && (
          <Marker
            position={pickupCoords}
            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            label="Pickup"
          />
        )}

        {/* Dropoff Marker */}
        {dropoffCoords && (
          <Marker
            position={dropoffCoords}
            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            label="Dropoff"
          />
        )}

        {/* Route */}
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
