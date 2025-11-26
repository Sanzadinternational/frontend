"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Plane, Hotel, TrainFront, Bus, UsersRound, MapPin, CalendarIcon, ClockIcon, ArrowUpDown } from "lucide-react";

const placeTypeIcons: { [key: string]: JSX.Element } = {
  airport: <Plane className="w-4 h-4 text-blue-500" />,
  lodging: <Hotel className="w-4 h-4 text-yellow-500" />,
  establishment: <MapPin className="w-4 h-4 text-gray-500" />,
  train_station: <TrainFront className="w-4 h-4 text-green-500" />,
  bus_station: <Bus className="w-4 h-4 text-purple-500" />,
};

const defaultIcon = <MapPin className="w-4 h-4 text-gray-500" />;

// Function to get a clean, short location name
const getCleanLocationName = (place: any): string => {
  if (!place) return "";
  
  if (place.name) {
    return place.name;
  }
  
  if (place.formatted_address) {
    const address = place.formatted_address;
    
    if (place.types?.includes('airport')) {
      const airportMatch = address.match(/(.*?)(?:Airport|Aeroporto|Aeropuerto)/i);
      if (airportMatch && airportMatch[1]) {
        return `${airportMatch[1].trim()} Airport`;
      }
      return address.split(',')[0] || address;
    }
    
    return address.split(',')[0] || address;
  }
  
  return place.description || "Unknown Location";
};

const AutocompleteInput = ({ apiKey, onPlaceSelected, value, onChange }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<JSX.Element | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
    onChange(inputValue);
    
    if (!inputValue) {
      setPredictions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: inputValue,
        types: [
          "airport",
          "bus_station",
          "transit_station",
          "train_station",
          "lodging",
        ],
      },
      (results) => {
        setPredictions(results || []);
      }
    );
  };

  const handleSelectPlace = (placeId: string, description: string) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    placesService.getDetails({ placeId }, (place) => {
      if (place) {
        const cleanName = getCleanLocationName(place);
        onPlaceSelected(place, cleanName, placeId);
        
        const placeTypes = place.types || [];
        const icon = placeTypes.find((type) => placeTypeIcons[type]) ? (
          placeTypeIcons[placeTypes.find((type) => placeTypeIcons[type])!]
        ) : (
          <MapPin className="text-gray-500" />
        );

        setSelectedIcon(icon);
        setPredictions([]);
        setIsFocused(false);
        if (inputRef.current) inputRef.current.value = cleanName;
        onChange(cleanName);
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-500 w-4 h-4 flex items-center justify-center">
          {selectedIcon || <MapPin className="text-gray-500" />}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2.5 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={isGoogleLoaded ? "Search location..." : "Loading..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      {/* Improved Dropdown */}
      {predictions.length > 0 && isFocused && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.slice(0, 5).map((prediction) => {
            const type = prediction.types?.find((t: string) => placeTypeIcons[t]) || "establishment";
            return (
              <button
                key={prediction.place_id}
                type="button"
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
              >
                <span className="flex-shrink-0">
                  {placeTypeIcons[type] || defaultIcon}
                </span>
                <span className="text-sm font-medium truncate">
                  {getCleanLocationName(prediction)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DateInput = ({ value, onChange, ...props }) => {
  const inputRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!value);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setShowPlaceholder(!e.target.value);
  };

  const handleBlur = () => {
    setShowPlaceholder(!inputRef.current?.value);
  };

  return (
    <div className="relative" onClick={handleClick}>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 px-3 appearance-none cursor-pointer ${
          showPlaceholder ? "text-transparent" : ""
        }`}
        {...props}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-gray-400 dark:text-gray-400 text-sm">
          DD-MM-YYYY
        </div>
      )}
    </div>
  );
};

const TimeInput = ({ value, onChange, ...props }) => {
  const inputRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!value);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setShowPlaceholder(!e.target.value);
  };

  const handleBlur = () => {
    setShowPlaceholder(!inputRef.current?.value);
  };

  return (
    <div className="relative" onClick={handleClick}>
      <input
        ref={inputRef}
        type="time"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 px-3 appearance-none cursor-pointer ${
          showPlaceholder ? "text-transparent" : ""
        }`}
        {...props}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-gray-400 dark:text-gray-400 text-sm">
          HH:MM
        </div>
      )}
    </div>
  );
};

const formSchema = z.object({
  pickup: z.string().min(1, { message: "Pick Up is Required" }),
  dropoff: z.string().min(1, { message: "Drop Off is Required" }),
  pax: z.string().min(1, { message: "Passenger is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Location({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [fromPlaceId, setFromPlaceId] = useState<string | null>(null);
  const [toPlaceId, setToPlaceId] = useState<string | null>(null);
  const [showReturnFields, setShowReturnFields] = useState(false);
  const googleMapsApiKey = "AIzaSyC9vmFHkCL1BZUjf1rTNytSfbKhmDG3OyE";
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup: "",
      dropoff: "",
      pax: "1",
      date: "",
      time: "",
      returnDate: "",
      returnTime: "",
    },
  });

  const handleSelectFrom = (place: any, cleanName: string, placeId: string) => {
    setFromPlaceId(placeId);
    console.log("Pickup place ID:", placeId);
    console.log("Pickup name:", cleanName);
  };

  const handleSelectTo = (place: any, cleanName: string, placeId: string) => {
    setToPlaceId(placeId);
    console.log("Dropoff place ID:", placeId);
    console.log("Dropoff name:", cleanName);
  };

  const swapLocations = () => {
    const pickupValue = form.getValues("pickup");
    const dropoffValue = form.getValues("dropoff");
    
    form.setValue("pickup", dropoffValue);
    form.setValue("dropoff", pickupValue);
    
    // Swap place IDs as well
    const tempPlaceId = fromPlaceId;
    setFromPlaceId(toPlaceId);
    setToPlaceId(tempPlaceId);
  };

  const onSubmit = (data: FormData) => {
    if (!fromPlaceId || !toPlaceId) {
      toast({
        title: "Valid Location",
        description: "Please select valid locations for both Pickup and Dropoff.",
        variant: "destructive",
      });
      return;
    }
  
    const queryParams = new URLSearchParams({
      pickup: data.pickup,
      dropoff: data.dropoff,
      pax: data.pax,
      date: data.date,
      time: data.time,
      returnDate: data.returnDate || "",
      returnTime: data.returnTime || "",
      pickupLocation: fromPlaceId,
      dropoffLocation: toPlaceId,
    }).toString();

    console.log("Submitting with data:", {
      pickup: data.pickup,
      dropoff: data.dropoff,
      pickupLocation: fromPlaceId,
      dropoffLocation: toPlaceId,
    });

    if (onFormSubmit) {
      onFormSubmit();
    }
    
    router.push(`/transfer?${queryParams}`);
  };

  const toggleReturnFields = () => {
    setShowReturnFields(!showReturnFields);
  };

  return (
    <div className="w-[70%]">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
            Book Your Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-end">
                {/* Pickup Location */}
                <FormField
                  control={form.control}
                  name="pickup"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pickup Location
                      </FormLabel>
                      <FormControl>
                        <AutocompleteInput
                          apiKey={googleMapsApiKey}
                          onPlaceSelected={handleSelectFrom}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Swap Button */}
                <div className="flex justify-center py-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    onClick={swapLocations}
                  >
                    <ArrowUpDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                </div>

                {/* Dropoff Location */}
                <FormField
                  control={form.control}
                  name="dropoff"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Dropoff Location
                      </FormLabel>
                      <FormControl>
                        <AutocompleteInput
                          apiKey={googleMapsApiKey}
                          onPlaceSelected={handleSelectTo}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="pax"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Passengers
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <select
                            {...field}
                            value={field.value || "1"}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 pl-3 pr-10 appearance-none"
                          >
                            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Passenger' : 'Passengers'}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-3 text-gray-500 pointer-events-none">
                            <UsersRound className="w-4 h-4" />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Date
                        </FormLabel>
                        <FormControl>
                          <DateInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Time
                        </FormLabel>
                        <FormControl>
                          <TimeInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={toggleReturnFields}
                >
                  {showReturnFields ? "Remove Return Trip" : "+ Add Return Trip"}
                </Button>

                {showReturnFields && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Return Date
                          </FormLabel>
                          <FormControl>
                            <DateInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="returnTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Return Time
                          </FormLabel>
                          <FormControl>
                            <TimeInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-sm transition-colors"
                type="submit"
              >
                Search Transfers
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
