"use client";
import { useState, useEffect, useRef } from "react";
import { Plane, Hotel, TrainFront, Bus, MapPin, Landmark, Star, Utensils, Mountain, ShoppingBag, Camera, Search, AlertCircle } from "lucide-react";

// 1. Icon Mapping
const placeTypeIcons: { [key: string]: JSX.Element } = {
  airport: <Plane className="w-4 h-4 text-blue-500" />,
  lodging: <Hotel className="w-4 h-4 text-yellow-500" />,
  train_station: <TrainFront className="w-4 h-4 text-green-500" />,
  bus_station: <Bus className="w-4 h-4 text-purple-500" />,
  establishment: <MapPin className="w-4 h-4 text-gray-500" />,
  tourist_attraction: <Landmark className="w-4 h-4 text-red-500" />,
  amusement_park: <Star className="w-4 h-4 text-pink-500" />,
  park: <Mountain className="w-4 h-4 text-green-500" />,
  restaurant: <Utensils className="w-4 h-4 text-orange-500" />,
  shopping_mall: <ShoppingBag className="w-4 h-4 text-purple-500" />,
  point_of_interest: <Camera className="w-4 h-4 text-indigo-500" />,
  cafe: <Utensils className="w-4 h-4 text-brown-500" />,
  store: <ShoppingBag className="w-4 h-4 text-blue-500" />,
};
const defaultIcon = <MapPin className="w-4 h-4 text-gray-500" />;

interface AutocompleteInputProps {
  apiKey: string;
  onPlaceSelected: (place: any) => void;
}

const AutocompleteInput = ({ apiKey, onPlaceSelected }: AutocompleteInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<any>(null);
  
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<JSX.Element | null>(null);

  // 2. Initialize Google Maps
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
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      }
    };

    if (window.google?.maps?.places) {
      initializeGoogleServices();
    } else {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  // 3. The Search Strategy
  const executeSearch = (inputValue: string) => {
    if (!window.google?.maps?.places || !inputValue) return;

    const service = new window.google.maps.places.AutocompleteService();
    
    const request = {
      input: inputValue,
      sessionToken: sessionTokenRef.current,
    };

    service.getPlacePredictions(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        setPredictions(results.slice(0, 5)); // Limit to 5 results
      } else {
        setPredictions([{
            place_id: 'MANUAL_SEARCH',
            description: inputValue,
            isManual: true,
            structured_formatting: {
                main_text: `Search for "${inputValue}"`,
                secondary_text: "Find this place by name"
            }
        }]);
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!inputValue) {
      setPredictions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
        executeSearch(inputValue);
    }, 300);
  };

  const handleSelectPlace = (placeId: string, description: string, isManual: boolean = false) => {
    if (isManual || placeId === 'MANUAL_SEARCH') {
        const inputValue = inputRef.current?.value || description;
        handleFindPlaceFallback(inputValue);
        return;
    }

    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails({ 
      placeId,
      fields: ['geometry', 'name', 'types', 'formatted_address'],
      sessionToken: sessionTokenRef.current
    }, (place, status) => {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        processSelectedPlace(place, placeId, description);
      } else {
        console.error("Details failed, trying fallback name search...");
        handleFindPlaceFallback(description);
      }
    });
  };

  const handleFindPlaceFallback = (query: string) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    
    const request = {
      query: query,
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'types'], 
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        processSelectedPlace(place, place.place_id || `manual_${Date.now()}`, place.formatted_address || query);
      } else {
        console.error("Find Place failed:", status);
      }
    });
  };

  const processSelectedPlace = (place: any, placeId: string, originalDescription: string) => {
    const placeTypes = place.types || [];
    const iconType = placeTypes.find((type: string) => placeTypeIcons[type]) || "establishment";
    const icon = placeTypeIcons[iconType] || defaultIcon;

    setSelectedIcon(icon);
    setPredictions([]);

    const selectedPlace = {
      address: place.formatted_address || originalDescription,
      name: place.name || originalDescription,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      place_id: placeId,
      types: placeTypes,
      icon,
    };

    onPlaceSelected(selectedPlace);
    if (inputRef.current) inputRef.current.value = place.name;
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-xl text-gray-500 w-4 h-4 flex items-center justify-center">
          {selectedIcon || defaultIcon}
        </span>

        <input
          ref={inputRef}
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={isGoogleLoaded ? "Search by name or address..." : "Initializing..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputRef.current?.value) {
               handleFindPlaceFallback(inputRef.current.value);
            }
          }}
        />
      </div>

      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description, prediction.isManual)}
            >
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                 {prediction.isManual ? <Search className="w-3.5 h-3.5 text-blue-500"/> : defaultIcon}
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium truncate">
                    {prediction.structured_formatting?.main_text || prediction.description}
                </span>
                {prediction.structured_formatting?.secondary_text && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {prediction.structured_formatting.secondary_text}
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
