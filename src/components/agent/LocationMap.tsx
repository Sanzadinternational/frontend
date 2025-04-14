
// "use client";
// import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// import { useMemo } from "react";

// // Map container styling
// const MapContainerStyle = {
//   width: "350px",
//   height: "300px",
// };

// // Function to convert string coordinates into { lat, lng } object
// const parseCoords = (location) => {
//   if (!location) return null;
//   const [lat, lng] = location.split(",").map(Number);
//   return { lat, lng };
// };

// const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

// const LocationMap = ({ pickupLocation, dropoffLocation }) => {
//   // Load Google Maps API script **before** rendering any conditional JSX
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey,
//   });

//   // Parse the coordinates
//   const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
//   const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

//   // Default center (to avoid errors if coords are missing)
//   const center = useMemo(() => fromCoords || { lat: 28.6418, lng: 77.2223 }, [fromCoords]);

//   // Handle loading or errors
//   if (!isLoaded) return <p className="text-center text-blue-500">Loading Map...</p>;
//   if (loadError) return <p className="text-center text-red-500">Error loading map.</p>;

//   return (
//     <div className="w-full">
//       <GoogleMap mapContainerStyle={MapContainerStyle} center={center} zoom={14}>
//         {fromCoords && <Marker position={fromCoords} label="Pickup" />}
//         {toCoords && <Marker position={toCoords} label="Dropoff" />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default LocationMap;




// "use client";
// import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
// import { useMemo, useCallback, useRef } from "react";

// const MapContainerStyle = {
//   width: "300px",
//   height: "300px",
// };

// const parseCoords = (location) => {
//   if (!location) return null;
//   const [lat, lng] = location.split(",").map(Number);
//   return { lat, lng };
// };

// const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

// const LocationMap = ({ pickupLocation, dropoffLocation }) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey,
//   });

//   const mapRef = useRef();
//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   // Parse coordinates
//   const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
//   const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

//   // Create path for polyline
//   const path = useMemo(() => {
//     if (!fromCoords || !toCoords) return [];
//     return [fromCoords, toCoords];
//   }, [fromCoords, toCoords]);

//   // Fit bounds to show both markers
//   const onBoundsChanged = useCallback(() => {
//     if (mapRef.current && fromCoords && toCoords) {
//       const bounds = new window.google.maps.LatLngBounds();
//       bounds.extend(fromCoords);
//       bounds.extend(toCoords);
//       mapRef.current.fitBounds(bounds);
      
//       // Add some padding if needed
//       const padding = 50; // pixels
//       mapRef.current.panToBounds(bounds, padding);
//     }
//   }, [fromCoords, toCoords]);

//   if (!isLoaded) return <p className="text-center text-blue-500">Loading Map...</p>;
//   if (loadError) return <p className="text-center text-red-500">Error loading map.</p>;

//   return (
//     <div className="">
//       <GoogleMap 
//         mapContainerStyle={MapContainerStyle} 
//         zoom={14}
//         onLoad={onMapLoad}
//         onBoundsChanged={onBoundsChanged}
//         options={{
//           zoomControl: true,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//       >
//         {fromCoords && (
//           <Marker 
//             position={fromCoords} 
//             label="Pickup"
//             icon={{
//               url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
//             }}
//           />
//         )}
        
//         {toCoords && (
//           <Marker 
//             position={toCoords} 
//             label="Dropoff"
//             icon={{
//               url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
//             }}
//           />
//         )}

//         {path.length > 0 && (
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#4285F4",
//               strokeOpacity: 0.8,
//               strokeWeight: 4,
//               geodesic: true
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default LocationMap;



// "use client";
// import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
// import { useMemo, useCallback, useRef, useEffect } from "react";

// const MapContainerStyle = {
//   width: "300px",
//   height: "300px",
// };

// const parseCoords = (location) => {
//   if (!location) return null;
//   const [lat, lng] = location.split(",").map(Number);
//   return { lat, lng };
// };

// const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";

// const LocationMap = ({ pickupLocation, dropoffLocation }) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey,
//   });

//   const mapRef = useRef();
//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   // Parse coordinates
//   const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
//   const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

//   // Create path for polyline
//   const path = useMemo(() => {
//     if (!fromCoords || !toCoords) return [];
//     return [fromCoords, toCoords];
//   }, [fromCoords, toCoords]);

//   // Fit bounds when coordinates change
//   useEffect(() => {
//     if (mapRef.current && fromCoords && toCoords) {
//       const bounds = new window.google.maps.LatLngBounds();
//       bounds.extend(fromCoords);
//       bounds.extend(toCoords);
      
//       // Add some padding
//       const padding = 40; // pixels
//       mapRef.current.fitBounds(bounds, padding);
//     }
//   }, [fromCoords, toCoords]);

//   if (!isLoaded) return <p className="text-center text-blue-500">Loading Map...</p>;
//   if (loadError) return <p className="text-center text-red-500">Error loading map.</p>;

//   return (
//     <div className="w-full">
//       <GoogleMap 
//         mapContainerStyle={MapContainerStyle}
//         onLoad={onMapLoad}
//         options={{
//           zoomControl: true,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//           gestureHandling: "greedy", // Allows zooming with fingers on touch devices
//           disableDoubleClickZoom: false, // Enables double-click zoom
//         }}
//       >
//         {fromCoords && (
//           <Marker 
//             position={fromCoords} 
//             label="Pickup"
//             icon={{
//               url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
//             }}
//           />
//         )}
        
//         {toCoords && (
//           <Marker 
//             position={toCoords} 
//             label="Dropoff"
//             icon={{
//               url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
//             }}
//           />
//         )}

//         {path.length > 0 && (
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#4285F4",
//               strokeOpacity: 0.8,
//               strokeWeight: 4,
//               geodesic: true
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default LocationMap;


"use client";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // Parse coordinates
  const fromCoords = useMemo(() => parseCoords(pickupLocation), [pickupLocation]);
  const toCoords = useMemo(() => parseCoords(dropoffLocation), [dropoffLocation]);

  // Create path for polyline
  const path = useMemo(() => {
    if (!fromCoords || !toCoords) return [];
    return [fromCoords, toCoords];
  }, [fromCoords, toCoords]);

  // Fit bounds when coordinates change
  useEffect(() => {
    if (mapLoaded && mapRef.current && fromCoords && toCoords) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(fromCoords);
      bounds.extend(toCoords);
      
      // Add some padding
      const padding = 40;
      mapRef.current.fitBounds(bounds, padding);
    }
  }, [fromCoords, toCoords, mapLoaded]);

  if (!isLoaded) return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">Loading Map...</div>;
  if (loadError) return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-red-500">Error loading map</div>;

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
          gestureHandling: "greedy",
          disableDoubleClickZoom: false,
        }}
      >
        {fromCoords && (
          <Marker 
            position={fromCoords} 
            label="Pickup"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        )}
        
        {toCoords && (
          <Marker 
            position={toCoords} 
            label="Dropoff"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        )}

        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#4285F4",
              strokeOpacity: 0.8,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;