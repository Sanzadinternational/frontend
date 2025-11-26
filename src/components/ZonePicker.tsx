"use client";
import { useState } from "react";
import AutocompleteInput from "@/components/AutocompleteInput";

const googleMapsApiKey = "AIzaSyC9vmFHkCL1BZUjf1rTNytSfbKhmDG3OyE";

interface ZonePickerProps {
  onChange: (value: string) => void;
  setValue: (name: string, value: any) => void;
  initialValue?: string;
  initialCoords?: {
    lat: number;
    lng: number;
  };
  onPlaceSelect?: (place: any) => void;
}

const ZonePicker = ({ onChange, setValue, onPlaceSelect }: ZonePickerProps) => {
  const [zoneLocation, setZoneLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    place_id?: string;
  } | null>(null);

  const handleSelectZone = (zone: any) => {
    setZoneLocation(zone);
    console.log("Selected Zone Details with Place ID:", zone);
    
    // Update all form values including place_id
    onChange(zone.address);
    setValue("latitude", zone.lat.toString());
    setValue("longitude", zone.lng.toString());
    
    // Set place_id if available
    if (zone.place_id) {
      setValue("place_id", zone.place_id);
    }
    
    // Call the onPlaceSelect callback if provided
    if (onPlaceSelect) {
      onPlaceSelect(zone);
    }
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
