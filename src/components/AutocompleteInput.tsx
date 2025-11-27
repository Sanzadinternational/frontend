"use client";
import { useState, useEffect, useRef } from "react";
import { Plane, Hotel, TrainFront, Bus, MapPin, Landmark, Star, Utensils, Mountain, ShoppingBag, Camera, Search } from "lucide-react";

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
  const [isSearching, setIsSearching] = useState(false);

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

    setIsSearching(true);
    const service = new window.google.maps.places.AutocompleteService();
    
    console.log("🔍 Searching for:", inputValue);
    
    // Try multiple approaches simultaneously
    const searchRequests = [
      // Broad search
      service.getPlacePredictions({ input: inputValue }, (results, status) => {
        console.log("🌐 Broad search results:", results?.length, "Status:", status);
        return results || [];
      }),
      
      // Establishment search
      service.getPlacePredictions({ input: inputValue, types: ['establishment'] }, (results, status) => {
        console.log("🏢 Establishment search results:", results?.length, "Status:", status);
        return results || [];
      }),
      
      // Tourist attractions search
      service.getPlacePredictions({ input: inputValue, types: ['tourist_attraction', 'amusement_park'] }, (results, status) => {
        console.log("🎯 Tourist attraction search results:", results?.length, "Status:", status);
        return results || [];
      })
    ];

    // Wait for all requests and combine results
    let allResults: any[] = [];
    let completedRequests = 0;

    searchRequests.forEach((request: any) => {
      request.then((results: any[]) => {
        if (results && results.length > 0) {
          // Remove duplicates by place_id
          const newResults = results.filter(result => 
            !allResults.some(existing => existing.place_id === result.place_id)
          );
          allResults = [...allResults, ...newResults];
        }
        
        completedRequests++;
        if (completedRequests === searchRequests.length) {
          console.log("📊 Combined results:", allResults);
          setPredictions(allResults);
          setIsSearching(false);
        }
      });
    });

    // Fallback: If no results after 1 second, try geocoding
    setTimeout(() => {
      if (predictions.length === 0 && inputValue) {
        tryGeocodingSearch(inputValue);
      }
    }, 1000);
  };

  const tryGeocodingSearch = (inputValue: string) => {
    console.log("🗺️ Trying geocoding search for:", inputValue);
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: inputValue }, (results, status) => {
      console.log("🗺️ Geocoding results:", results, "Status:", status);
      
      if (status === 'OK' && results && results.length > 0) {
        const geocodingResults = results.map((result, index) => ({
          place_id: `geocode_${index}_${Date.now()}`,
          description: result.formatted_address,
          types: ['geocode'],
          isGeocodingResult: true
        }));
        
        setPredictions(prev => [...prev, ...geocodingResults]);
      }
      setIsSearching(false);
    });
  };

  const handleSelectPlace = (placeId: string, description: string, isGeocodingResult: boolean = false) => {
    if (isGeocodingResult) {
      // Handle geocoding result
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
          
          console.log("✅ Selected place (geocoding):", selectedPlace);
          onPlaceSelected(selectedPlace);
          if (inputRef.current) inputRef.current.value = description;
        }
      });
      return;
    }

    // Handle normal Places API result
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails({ 
      placeId,
      fields: ['geometry', 'name', 'types', 'formatted_address', 'vicinity']
    }, (place, status) => {
      console.log("📋 Place details status:", status);
      console.log("📋 Full place details:", place);
      
      if (place && place.geometry) {
        const placeTypes = place.types || [];
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

        console.log("✅ Selected place:", selectedPlace);
        onPlaceSelected(selectedPlace);

        if (inputRef.current) inputRef.current.value = place.name || description;
      } else {
        console.error("❌ Failed to get place details, trying geocoding fallback");
        // Fallback to geocoding
        handleSelectPlace(`fallback_${Date.now()}`, description, true);
      }
    });
  };

  const handleDirectSearch = () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;

    console.log("🎯 Direct search for:", inputValue);
    setIsSearching(true);

    // Try Text Search (more comprehensive than autocomplete)
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      query: inputValue,
      fields: ['name', 'geometry', 'formatted_address', 'types', 'place_id']
    };

    placesService.textSearch(request, (results, status) => {
      console.log("🎯 Text search results:", results, "Status:", status);
      
      if (status === 'OK' && results && results.length > 0) {
        const textSearchResults = results.map(place => ({
          place_id: place.place_id,
          description: place.name + ' - ' + place.formatted_address,
          types: place.types || ['establishment'],
          isTextSearchResult: true
        }));
        
        setPredictions(textSearchResults);
      } else {
        // Fallback to geocoding
        tryGeocodingSearch(inputValue);
      }
      setIsSearching(false);
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
          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-12 pr-20 p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={isGoogleLoaded ? "Search for Disneyland Paris or any location..." : "Loading Google Maps..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleDirectSearch();
            }
          }}
        />
        
        <button
          onClick={handleDirectSearch}
          disabled={!isGoogleLoaded || isSearching}
          className="absolute right-3 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Search className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Debug info */}
      <div className="text-xs text-gray-500 mt-1 flex justify-between">
        <span>Try: "Disneyland Paris", "Disneyland® Paris", or press Enter</span>
        {isSearching && <span className="text-blue-500">Searching...</span>}
      </div>

      {/* Dropdown suggestions */}
      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md"
              onClick={() => handleSelectPlace(
                prediction.place_id, 
                prediction.description,
                prediction.isGeocodingResult || prediction.isTextSearchResult
              )}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {getIconForPrediction(prediction)}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{prediction.description}</span>
                {prediction.types && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {prediction.types.join(', ')}
                    {prediction.isGeocodingResult && ' (via Geocoding)'}
                    {prediction.isTextSearchResult && ' (via Text Search)'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {predictions.length === 0 && inputRef.current?.value && !isSearching && (
        <div className="absolute z-50 mt-2 w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            No results found. Try:
          </p>
          <ul className="text-yellow-700 text-xs mt-1 list-disc list-inside">
            <li>Pressing Enter for direct search</li>
            <li>Using different search terms</li>
            <li>Checking browser console for details</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
