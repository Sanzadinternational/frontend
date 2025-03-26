// "use client";
// import { useState } from "react";
// import AutocompleteInput from "@/components/AutocompleteInput";
// const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
// const ZonePicker = () => {
//     const [zoneLocation, setZoneLocation] = useState<{
//         lat: number;
//         lng: number;
//         address: string;
//       } | null>(null);

//       const handleSelectZone = (zone: any) => {
//         setZoneLocation(zone);
//         console.log("Selected Zone Details:", zone);
//         onChange(zone.address); // Update form value
//       };

//   return (
//     <div className="w-full max-w-md p-4 border rounded-md">
//       <h2 className="text-lg font-bold mb-4">Select Your Zone</h2>
//       <AutocompleteInput
//         apiKey={googleMapsApiKey}
//         onPlaceSelected={handleSelectZone}
//       />
      
//       {/* {zoneLocation && (
//         <div className="mt-4">
//           <p><strong>Selected Address:</strong> {zoneLocation.address}</p>
//           <p><strong>Latitude:</strong> {zoneLocation.lat}</p>
//           <p><strong>Longitude:</strong> {zoneLocation.lng}</p>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default ZonePicker;



"use client";
import { useState } from "react";
import AutocompleteInput from "@/components/AutocompleteInput";
const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
// type ZonePickerProps = {
//   onChange: (value: string) => void;
//   setValue: (name: string, value: string) => void;
// };
interface ZonePickerProps {
  onChange: (value: string) => void;
  setValue: (name: string, value: any) => void;
  initialValue?: string;
  initialCoords?: {
    lat: number;
    lng: number;
  };
}
const ZonePicker = ({ onChange, setValue }: ZonePickerProps) => {
  const [zoneLocation, setZoneLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const handleSelectZone = (zone: any) => {
    setZoneLocation(zone);
    console.log("Selected Zone Details:", zone);
    onChange(zone.address);
    setValue("latitude", zone.lat.toString());
    setValue("longitude", zone.lng.toString());
  };

  return (
    <div className="w-full">
      <AutocompleteInput
        apiKey={googleMapsApiKey}
        onPlaceSelected={handleSelectZone}
      />
    </div>
  );
};

export default ZonePicker;
