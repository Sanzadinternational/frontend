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
import { Plane, Hotel, TrainFront, Bus, UsersRound, MapPin, CalendarIcon, ClockIcon } from "lucide-react";

const placeTypeIcons: { [key: string]: JSX.Element } = {
  airport: <Plane className="w-6 h-6 text-blue-500 dark:text-sky-300" />,
  lodging: <Hotel className="w-6 h-6 text-yellow-500" />,
  establishment: <MapPin className="w-6 h-6 text-gray-500 dark:text-gray-100" />,
  train_station: <TrainFront className="w-6 h-6 text-green-500" />,
  bus_station: <Bus className="w-6 h-6 text-purple-500 dark:text-purple-200" />,
};

const defaultIcon = <MapPin className="w-6 h-6 text-gray-500 dark:text-gray-100" />;

// Function to get a clean, short location name
const getCleanLocationName = (place: any): string => {
  if (!place) return "";
  
  // Priority 1: Use the main name (most important)
  if (place.name) {
    return place.name;
  }
  
  // Priority 2: Use formatted address but clean it up
  if (place.formatted_address) {
    const address = place.formatted_address;
    
    // For airports, extract just the airport name
    if (place.types?.includes('airport')) {
      const airportMatch = address.match(/(.*?)(?:Airport|Aeroporto|Aeropuerto)/i);
      if (airportMatch && airportMatch[1]) {
        return `${airportMatch[1].trim()} Airport`;
      }
      return address.split(',')[0] || address;
    }
    
    // For other places, use the first part of the address (usually the name)
    return address.split(',')[0] || address;
  }
  
  // Fallback: Use the description from predictions
  return place.description || "Unknown Location";
};

const AutocompleteInput = ({ apiKey, onPlaceSelected, value, onChange }: any) => {
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
    onChange(inputValue); // Update form value
    
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
        if (inputRef.current) inputRef.current.value = cleanName;
        onChange(cleanName); // Update form value with clean name
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Icon inside input */}
        <span className="absolute left-4 text-xl text-gray-500 w-6 h-6 flex items-center justify-center">
          {selectedIcon || <MapPin className="text-gray-500 dark:text-gray-300" />}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          className="w-full bg-slate-100 dark:text-white dark:bg-slate-500 border border-gray-300 dark:border-gray-600 pl-12 p-3 text-lg rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={
            isGoogleLoaded ? "Search a location..." : "Loading Google Maps..."
          }
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
        />
      </div>

      {/* Dropdown suggestions */}
      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {predictions.map((prediction) => {
            const type =
              prediction.types?.find((t) => placeTypeIcons[t]) ||
              "establishment";
            return (
              <li
                key={prediction.place_id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md"
                onClick={() =>
                  handleSelectPlace(prediction.place_id, prediction.description)
                }
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {placeTypeIcons[type] || defaultIcon}
                </span>
                <span className="text-lg font-medium">
                  {getCleanLocationName(prediction)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// DateInput and TimeInput components remain the same...

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
        className={`w-full bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-2 appearance-none cursor-pointer ${
          showPlaceholder ? "text-transparent" : ""
        }`}
        {...props}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-300">
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
        className={`w-full bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-2 appearance-none cursor-pointer ${
          showPlaceholder ? "text-transparent" : ""
        }`}
        {...props}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-300">
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
  const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
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

  const onSubmit = (data: FormData) => {
    if (!fromPlaceId || !toPlaceId) {
      toast({
        title: "Valid Location",
        description: "Please select valid locations for both Pickup and Dropoff.",
        variant: "destructive",
      });
      return;
    }
  
    // Convert form data into query parameters - using same parameter names but sending place IDs
    const queryParams = new URLSearchParams({
      pickup: data.pickup,
      dropoff: data.dropoff,
      pax: data.pax,
      date: data.date,
      time: data.time,
      returnDate: data.returnDate || "",
      returnTime: data.returnTime || "",
      pickupLocation: fromPlaceId, // Same parameter name but now contains place ID
      dropoffLocation: toPlaceId,  // Same parameter name but now contains place ID
    }).toString();

    console.log("Submitting with data:", {
      pickup: data.pickup,
      dropoff: data.dropoff,
      pickupLocation: fromPlaceId, // Now contains place ID
      dropoffLocation: toPlaceId,  // Now contains place ID
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
      <Card className="bg-blue-100/[.5] dark:bg-blend-darken dark:text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-medium">
            Book Your Rides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Pickup Location */}
                <FormField
                  control={form.control}
                  name="pickup"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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

                {/* Dropoff Location */}
                <FormField
                  control={form.control}
                  name="dropoff"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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
                      <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                        Number of Passengers
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <select
                            {...field}
                            value={field.value || "1"}
                            className="w-full bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-2 appearance-none"
                          >
                            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Passenger' : 'Passengers'}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-3 text-xl text-gray-500 w-6 h-6 flex items-center justify-center pointer-events-none">
                            <UsersRound className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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

              <Button
                className="mr-1 text-black dark:text-white bg-slate-100 dark:bg-slate-500 hover:text-white"
                type="button"
                onClick={toggleReturnFields}
              >
                {showReturnFields ? "Remove Return" : "Add Return"}
              </Button>

              {showReturnFields && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
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
              
              <Button
                className="bg-blue-500 dark:bg-card-foreground"
                type="submit"
              >
                See Results
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
