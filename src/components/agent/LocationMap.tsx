// "use client";
// // import { useBooking } from "../context/BookingContext";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


// const MapContainerStyle = {
//   width: "100%",
//   height: "300px",
// };

// const LocationMap = ({fromCoords,toCoords}) => {
//   // const { bookingData } = useBooking();
//   // const { fromCoords, toCoords } = bookingData || {};
// // const fromCoords = {lat:0.0,lng:0.0};
// // const toCoords = {lat:10.0,lng:10.0};
//   const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

//   if (!fromCoords || !toCoords) {
//     return <p className="text-center text-red-500">Coordinates not available.</p>;
//   }

//   return (
//     <div className="w-full">
//       <LoadScript googleMapsApiKey={googleMapsApiKey}>
//         <GoogleMap
//           mapContainerStyle={MapContainerStyle}
//           center={{
//             lat: fromCoords.lat,
//             lng: fromCoords.lng,
//           }}
//           zoom={10}
//         >
//           {/* Marker for Pickup Location */}
//           <Marker
//             position={{ lat: fromCoords.lat, lng: fromCoords.lng }}
//             label="Pickup"
//           />
//           {/* Marker for Dropoff Location */}
//           <Marker
//             position={{ lat: toCoords.lat, lng: toCoords.lng }}
//             label="Dropoff"
//           />
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// };

// export default LocationMap;


"use client";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

// Map container styling
const MapContainerStyle = {
  width: "350px",
  height: "300px",
};

// Function to convert string coordinates into { lat, lng } object
const parseCoords = (location) => {
  if (!location) return null;
  const [lat, lng] = location.split(",").map(Number);
  return { lat, lng };
};

const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

const LocationMap = ({ pickupLocation, dropoffLocation }) => {
  // Load Google Maps API script **before** rendering any conditional JSX
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
  });

  // Parse the coordinates
  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

  // Default center (to avoid errors if coords are missing)
  const center = useMemo(() => fromCoords || { lat: 28.6418, lng: 77.2223 }, [fromCoords]);

  // Handle loading or errors
  if (!isLoaded) return <p className="text-center text-blue-500">Loading Map...</p>;
  if (loadError) return <p className="text-center text-red-500">Error loading map.</p>;

  return (
    <div className="w-full">
      <GoogleMap mapContainerStyle={MapContainerStyle} center={center} zoom={14}>
        {fromCoords && <Marker position={fromCoords} label="Pickup" />}
        {toCoords && <Marker position={toCoords} label="Dropoff" />}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;