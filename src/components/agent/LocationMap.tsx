"use client";
import { useBooking } from "../context/BookingContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


const MapContainerStyle = {
  width: "100%",
  height: "300px",
};

const LocationMap = () => {
  const { bookingData } = useBooking();
  // const { fromCoords, toCoords } = bookingData || {};
const fromCoords = {lat:0.0,lng:0.0};
const toCoords = {lat:10.0,lng:10.0};
  const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

  if (!fromCoords || !toCoords) {
    return <p className="text-center text-red-500">Coordinates not available.</p>;
  }

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={MapContainerStyle}
          center={{
            lat: fromCoords.lat,
            lng: fromCoords.lng,
          }}
          zoom={10}
        >
          {/* Marker for Pickup Location */}
          <Marker
            position={{ lat: fromCoords.lat, lng: fromCoords.lng }}
            label="Pickup"
          />
          {/* Marker for Dropoff Location */}
          <Marker
            position={{ lat: toCoords.lat, lng: toCoords.lng }}
            label="Dropoff"
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LocationMap;
