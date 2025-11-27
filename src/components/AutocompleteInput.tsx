"use client";
import { useState, useEffect, useRef } from "react";
import { Plane, Hotel, TrainFront, Bus, MapPin, Landmark, Star, Utensils, Mountain, ShoppingBag, Camera } from "lucide-react";

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
    
    console.log("Searching for:", inputValue);
    
    // Try multiple search strategies
    const searchStrategies = [
      { input: inputValue }, // No restrictions
      { input: inputValue, types: ['establishment'] },
      { input: inputValue, types: ['tourist_attraction', 'amusement_park'] },
      { input: inputValue, types: ['geocode'] } // Address-based search
    ];

    let attempts = 0;
    const maxAttempts = searchStrategies.length;

    const tryNextStrategy = (index: number) => {
      if (index >= maxAttempts) {
        console.log("All search strategies exhausted");
        return;
      }

      service.getPlacePredictions(
        searchStrategies[index],
        (results, status) => {
          console.log(`Strategy ${index}:`, searchStrategies[index], "Status:", status, "Results:", results?.length);
          
          if (results && results.length > 0) {
            setPredictions(results);
          } else if (index < maxAttempts - 1) {
            // Try next strategy
            tryNextStrategy(index + 1);
          } else {
            setPredictions([]);
          }
        }
      );
    };

    // Start with first strategy
    tryNextStrategy(0);
  };

  const handleSelectPlace = (placeId: string, description: string) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails({ 
      placeId,
      fields: ['geometry', 'name', 'types', 'formatted_address', 'vicinity', 'address_components']
    }, (place, status) => {
      console.log("Place details status:", status);
      console.log("Full place details:", place);
      
      if (place && place.geometry) {
        const placeTypes = place.types || [];
        console.log("Place types:", placeTypes);
        
        const iconType = placeTypes.find((type) => placeTypeIcons[type]) || "establishment";
        const icon = placeTypeIcons[iconType] || defaultIcon;

        setSelectedIcon(icon);
        setPredictions([]);

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
      } else {
        console.error("Failed to get place details:", status);
        // Fallback: Create a basic place object and try geocoding
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
          address: description,
          name: description,
          lat: location.lat(),
          lng: location.lng(),
          place_id: placeId,
          types: ['geocode'],
          icon: defaultIcon,
        };
        
        console.log("Geocoding fallback result:", selectedPlace);
        onPlaceSelected(selectedPlace);
        
        if (inputRef.current) inputRef.current.value = description;
      }
    });
  };

  const handleManualSearch = () => {
    if (!inputRef.current?.value) return;
    
    const inputValue = inputRef.current.value;
    console.log("Manual search for:", inputValue);
    
    // Try direct Places API search as fallback
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      query: inputValue,
      fields: ['name', 'geometry', 'formatted_address', 'types']
    };
    
    placesService.findPlaceFromQuery(request, (results, status) => {
      console.log("Direct Places API search results:", results, "Status:", status);
      
      if (results && results.length > 0) {
        const place = results[0];
        const selectedPlace = {
          address: place.formatted_address || inputValue,
          name: place.name || inputValue,
          lat: place.geometry?.location.lat(),
          lng: place.geometry?.location.lng(),
          place_id: `manual_${Date.now()}`,
          types: place.types || ['establishment'],
          icon: defaultIcon,
        };
        
        console.log("Manual search result:", selectedPlace);
        onPlaceSelected(selectedPlace);
      }
    });
  };

  const getIconForPrediction = (prediction: any) => {
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
          placeholder={isGoogleLoaded ? "Search for locations, addresses, businesses..." : "Loading Google Maps..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onKeyPress={(e) => {
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
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {getIconForPrediction(prediction)}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{prediction.description}</span>
                {prediction.types && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {prediction.types.join(', ')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Manual search hint */}
      <div className="text-xs text-gray-500 mt-1">
        Press Enter for manual search if location doesn't appear in suggestions
      </div>
    </div>
  );
};

export default AutocompleteInput;
