"use client";
import { useState, useEffect, useRef } from "react";
import { Plane, Hotel, TrainFront, Bus, MapPin, Landmark, Star, Utensils, Mountain, ShoppingBag, Camera } from "lucide-react";

// Expanded place type icons mapping
const placeTypeIcons: { [key: string]: JSX.Element } = {
  // Original icons
  airport: <Plane className="w-6 h-6 text-blue-500" />,
  lodging: <Hotel className="w-6 h-6 text-yellow-500" />,
  train_station: <TrainFront className="w-6 h-6 text-green-500" />,
  bus_station: <Bus className="w-6 h-6 text-purple-500" />,
  establishment: <MapPin className="w-6 h-6 text-gray-500" />,
  tourist_attraction: <Landmark className="w-6 h-6 text-red-500" />,
  
  // Additional types for theme parks and attractions
  amusement_park: <Star className="w-6 h-6 text-pink-500" />,
  park: <Mountain className="w-6 h-6 text-green-500" />,
  restaurant: <Utensils className="w-6 h-6 text-orange-500" />,
  shopping_mall: <ShoppingBag className="w-6 h-6 text-purple-500" />,
  point_of_interest: <Camera className="w-6 h-6 text-indigo-500" />,
  cafe: <Utensils className="w-6 h-6 text-brown-500" />,
  store: <ShoppingBag className="w-6 h-6 text-blue-500" />,
};
const defaultIcon = <MapPin className="w-6 h-6 text-gray-500" />;

interface AutocompleteInputProps {
  apiKey: string;
  onPlaceSelected: (place: any) => void;
}

const AutocompleteInput = ({ apiKey, onPlaceSelected }: AutocompleteInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.querySelector("#google-maps-script")) {
        waitForGoogleMaps(initializeGoogleServices);
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => waitForGoogleMaps(initializeGoogleServices);
      document.head.appendChild(script);
    };

    const waitForGoogleMaps = (callback: () => void) => {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          callback();
        }
      }, 500);
    };

    const initializeGoogleServices = () => {
      if (window.google?.maps?.places) setIsGoogleLoaded(true);
    };

    if (window.google?.maps?.places) {
      initializeGoogleServices();
    } else {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (!inputValue) {
      setPredictions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    
    // Try with broader search first
    service.getPlacePredictions(
      {
        input: inputValue,
        types: ['establishment'], // Try with establishment type for Disneyland
      },
      (results, status) => {
        console.log("Autocomplete results:", results);
        console.log("Autocomplete status:", status);
        
        if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          // If no results with establishment, try without any type restrictions
          service.getPlacePredictions(
            {
              input: inputValue,
              // No types restriction
            },
            (fallbackResults) => {
              console.log("Fallback results:", fallbackResults);
              setPredictions(fallbackResults || []);
            }
          );
        } else {
          setPredictions(results || []);
        }
      }
    );
  };

  const handleSelectPlace = (placeId: string, description: string) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails({ 
      placeId,
      fields: ['geometry', 'name', 'types', 'formatted_address']
    }, (place, status) => {
      console.log("Place details status:", status);
      console.log("Full place details:", place);
      
      if (place && place.geometry) {
        const placeTypes = place.types || [];
        console.log("Place types:", placeTypes);
        
        // Find the most relevant icon
        const iconType = placeTypes.find((type) => placeTypeIcons[type]) || "establishment";
        const icon = placeTypeIcons[iconType] || defaultIcon;

        setSelectedIcon(icon);
        setPredictions([]);

        // Create the place object with place_id included
        const selectedPlace = {
          address: place.formatted_address || description,
          name: place.name || description,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place_id: placeId,
          types: placeTypes,
          icon,
        };

        console.log("Selected place details:", selectedPlace);

        onPlaceSelected(selectedPlace);

        if (inputRef.current) inputRef.current.value = place.name || description;
      }
    });
  };

  const getIconForPrediction = (prediction: any) => {
    const types = prediction.types || [];
    console.log("Prediction types:", types, "for:", prediction.description);
    
    const iconType = types.find((type: string) => placeTypeIcons[type]) || "establishment";
    return placeTypeIcons[iconType] || defaultIcon;
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Icon inside input */}
        <span className="absolute left-4 text-xl text-gray-500 w-6 h-6 flex items-center justify-center">
          {selectedIcon || defaultIcon}
        </span>

        <input
          ref={inputRef}
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-12 p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={isGoogleLoaded ? "Search for locations, addresses, businesses..." : "Loading Google Maps..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onFocus={(e) => {
            // Trigger search when input is focused with existing text
            if (e.target.value) {
              handleInputChange({ target: { value: e.target.value } } as any);
            }
          }}
        />
      </div>

      {/* Dropdown suggestions */}
      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md"
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {getIconForPrediction(prediction)}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{prediction.description}</span>
                {prediction.types && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Types: {prediction.types.join(', ')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
