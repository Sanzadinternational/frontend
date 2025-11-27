"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Plane, Hotel, TrainFront, Bus, MapPin, Landmark, Star, Utensils, Mountain, ShoppingBag, Camera, Search } from "lucide-react";

// Expanded place type icons mapping
const placeTypeIcons: { [key: string]: JSX.Element } = {
  airport: <Plane className="w-6 h-6 text-blue-500" />,
  lodging: <Hotel className="w-6 h-6 text-yellow-500" />,
  train_station: <TrainFront className="w-6 h-6 text-green-500" />,
  bus_station: <Bus className="w-6 h-6 text-purple-500" />,
  establishment: <MapPin className="w-6 h-6 text-gray-500" />,
  tourist_attraction: <Landmark className="w-6 h-6 text-red-500" />,
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<any>(null); // Store session token
  
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
      }, 100);
    };

    const initializeGoogleServices = () => {
      if (window.google?.maps?.places) {
        setIsGoogleLoaded(true);
        // Initialize session token
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      }
    };

    if (window.google?.maps?.places) {
      initializeGoogleServices();
    } else {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  // Main search logic wrapped in a function
  const executeSearch = (inputValue: string) => {
    if (!window.google?.maps?.places) return;

    const service = new window.google.maps.places.AutocompleteService();
    
    // Strategy: Simple Autocomplete with Session Token
    const request = {
      input: inputValue,
      sessionToken: sessionTokenRef.current,
      // Optional: Add componentRestrictions to limit to France if this is a France-only app
      // componentRestrictions: { country: 'fr' }, 
    };

    service.getPlacePredictions(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        setPredictions(results);
      } else {
        // If Autocomplete fails (common for full addresses), offer a "Manual Search" option in the dropdown
        setPredictions([{
            place_id: 'MANUAL_FALLBACK',
            description: `Use this exact address: "${inputValue}"`,
            isManual: true,
            structured_formatting: {
                main_text: inputValue,
                secondary_text: "Search via Geocoding"
            }
        }]);
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Clear existing timer
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!inputValue) {
      setPredictions([]);
      return;
    }

    // Set new timer (Debounce 300ms)
    debounceTimerRef.current = setTimeout(() => {
        executeSearch(inputValue);
    }, 300);
  };

  const handleSelectPlace = (placeId: string, description: string, isManual: boolean = false) => {
    if (isManual) {
        // If user clicked the manual fallback, trigger geocoding immediately
        handleGeocodingFallback(inputRef.current?.value || description, `manual_${Date.now()}`);
        return;
    }

    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    
    placesService.getDetails({ 
      placeId,
      fields: ['geometry', 'name', 'types', 'formatted_address', 'vicinity', 'address_components'],
      sessionToken: sessionTokenRef.current // Use the same token for details
    }, (place, status) => {
      
      // Refresh session token after usage
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

      if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
        const placeTypes = place.types || [];
        const iconType = placeTypes.find((type) => placeTypeIcons[type]) || "establishment";
        const icon = placeTypeIcons[iconType] || defaultIcon;

        setSelectedIcon(icon);
        setPredictions([]);

        const selectedPlace = {
          address: place.formatted_address || description,
          name: place.name || description,
          lat: place.geometry.location?.lat(),
          lng: place.geometry.location?.lng(),
          place_id: placeId,
          types: placeTypes,
          icon,
        };

        onPlaceSelected(selectedPlace);
        if (inputRef.current) inputRef.current.value = place.name || description;
      } else {
        console.error("Failed to get place details:", status);
        handleGeocodingFallback(description, placeId);
      }
    });
  };

  const handleGeocodingFallback = (description: string, placeId: string) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const selectedPlace = {
          address: results[0].formatted_address || description,
          name: description, // Use the input description as name
          lat: location.lat(),
          lng: location.lng(),
          place_id: placeId,
          types: ['geocode'],
          icon: defaultIcon,
        };
        
        setSelectedIcon(defaultIcon);
        setPredictions([]);
        onPlaceSelected(selectedPlace);
        
        // Update input to formatted address from geocoder if available
        if (inputRef.current) inputRef.current.value = results[0].formatted_address;
      }
    });
  };

  const handleManualSearch = () => {
    if (!inputRef.current?.value) return;
    const inputValue = inputRef.current.value;
    
    // First try the custom geocoding fallback
    handleGeocodingFallback(inputValue, `manual_${Date.now()}`);
  };

  const getIconForPrediction = (prediction: any) => {
    if (prediction.isManual) return <Search className="w-5 h-5 text-gray-400" />;
    const types = prediction.types || [];
    const iconType = types.find((type: string) => placeTypeIcons[type]) || "establishment";
    return placeTypeIcons[iconType] || defaultIcon;
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-xl text-gray-500 w-6 h-6 flex items-center justify-center">
          {selectedIcon || defaultIcon}
        </span>

        <input
          ref={inputRef}
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-12 p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={isGoogleLoaded ? "Search for locations..." : "Loading Maps..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleManualSearch();
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
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description, prediction.isManual)}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {getIconForPrediction(prediction)}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                    {prediction.structured_formatting?.main_text || prediction.description}
                </span>
                {prediction.structured_formatting?.secondary_text && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {prediction.structured_formatting.secondary_text}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Help text */}
      <div className="text-xs text-gray-400 mt-1 px-1">
        Can't find it? Press Enter to search precisely.
      </div>
    </div>
  );
};

export default AutocompleteInput;
