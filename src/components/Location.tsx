"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBooking } from "./context/BookingContext";

import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  // CardDescription,
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Plane, Hotel, TrainFront, Bus, Building, MapPin } from "lucide-react";
// import {
//   FaPlane, FaHotel, FaUtensils, FaBuilding, FaMapMarkerAlt,
//   FaTrain, FaBus
// } from "react-icons/fa";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const placeTypeIcons: { [key: string]: JSX.Element } = {
  // airport: <FaPlane className="w-6 h-6 text-blue-500" />,
  airport: <Plane className="w-6 h-6 text-blue-500" />,
  // lodging: <FaHotel className="w-6 h-6 text-yellow-500" />,
  lodging: <Hotel className="w-6 h-6 text-yellow-500" />,
  // restaurant: <FaUtensils className="w-6 h-6 text-red-500" />,
  // establishment: <FaBuilding className="w-6 h-6 text-gray-500" />,
  establishment: <MapPin className="w-6 h-6 text-gray-500" />,
  // train_station: <FaTrain className="w-6 h-6 text-green-500" />,
  train_station: <TrainFront className="w-6 h-6 text-green-500" />,
  // bus_station: <FaBus className="w-6 h-6 text-purple-500" />,
  bus_station: <Bus className="w-6 h-6 text-purple-500" />,
};

const defaultIcon = <MapPin className="w-6 h-6 text-gray-500" />;

const AutocompleteInput = ({ apiKey, onPlaceSelected }: any) => {
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
      if (place && place.geometry) {
        onPlaceSelected(place);
        const placeTypes = place.types || [];
        const icon = placeTypes.find((type) => placeTypeIcons[type]) ? (
          placeTypeIcons[placeTypes.find((type) => placeTypeIcons[type])!]
        ) : (
          <MapPin className="text-gray-500" />
        );

        setSelectedIcon(icon);
        setPredictions([]);
        if (inputRef.current) inputRef.current.value = description;
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Icon inside input */}
        <span className="absolute left-4 text-xl text-gray-500 w-6 h-6 flex items-center justify-center">
          {selectedIcon || <MapPin className="text-gray-500" />}
        </span>

        <input
          ref={inputRef}
          type="text"
          className="w-full bg-slate-100 dark:text-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md pl-12 p-3 text-lg focus:ring-2 focus:ring-blue-400"
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
                  {prediction.description}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Define the validation schema with date and time fields
const formSchema = z.object({
  pickup: z.string().min(1, { message: "Pick Up is Required" }),
  dropoff: z.string().min(1, { message: "Drop Off is Required" }),
  pax: z.string().min(1, { message: "Passenger is required" }),
  date: z.string().min(1, { message: "Date is required" }), // Date for the journey
  time: z.string().min(1, { message: "Time is required" }), // Time for the journey
  returnDate: z.string().optional(), // Optional return date
  returnTime: z.string().optional(), // Optional return time
});
type FormData = z.infer<typeof formSchema>;
export default function Location() {
  const [fromCoords, setFromCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [showReturnFields, setShowReturnFields] = useState(false); // State to toggle return date/time fields
  const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
  const { toast } = useToast();
  const { setBookingData } = useBooking();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup: "",
      dropoff: "",
      pax: "",
      date: "",
      time: "",
      returnDate: "",
      returnTime: "",
    },
  });

  const handleSelectFrom = (place: any) => {
    const location = place.geometry.location;
    setFromCoords({ lat: location.lat(), lng: location.lng() });
  };

  const handleSelectTo = (place: any) => {
    const location = place.geometry.location;
    setToCoords({ lat: location.lat(), lng: location.lng() });
  };

  // const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);

  //   if (!fromCoords || !toCoords) {
  //     toast({
  //       title: "Valid Location",
  //       description:
  //         "Please select valid locations for both Pickup and Dropoff.",
  //       variant: "destructive",
  //     });
  //     // alert("Please select valid locations for both Pickup and Dropoff.");
  //     return;
  //   }

  //   const payload = {
  //     ...data,
  //     pickupLocation: `${fromCoords.lat},${fromCoords.lng}`,
  //     dropoffLocation: `${toCoords.lat},${toCoords.lng}`,
  //   };

  //   console.log("Payload to Send:", payload);
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/data/search`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast({
  //         title: "Searching Vehicle",
  //         description: "Request submitted successfully",
  //       });
  //       // alert("Booking successfully submitted!");
  //       console.log("API Response:", response.data);
  //       // Store the response data in the state
  //       setBookingData({
  //         // formData: data,
  //         formData: payload,
  //         responseData: response.data.data,
  //       });
  //       router.push("/transfer");
  //     } else {
  //       toast({
  //         title: "API Error",
  //         description: "Something went wrong, please try again.",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error while submitting data",
  //       description: `API Error:", ${error.response?.data} || ${error.message}`,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const onSubmit = (data: FormData) => {
    if (!fromCoords || !toCoords) {
      toast({
        title: "Valid Location",
        description: "Please select valid locations for both Pickup and Dropoff.",
        variant: "destructive",
      });
      return;
    }
  
    // Convert form data into query parameters
    const queryParams = new URLSearchParams({
      pickup: data.pickup,
      dropoff: data.dropoff,
      pax: data.pax,
      date: data.date,
      time: data.time,
      returnDate: data.returnDate || "",
      returnTime: data.returnTime || "",
      pickupLocation: `${fromCoords.lat},${fromCoords.lng}`,
      dropoffLocation: `${toCoords.lat},${toCoords.lng}`,
    }).toString();
  
    // Navigate to the transfer page with query parameters
    router.push(`/transfer?${queryParams}`);
  };
  



  const toggleReturnFields = () => {
    setShowReturnFields(!showReturnFields); // Toggle return date/time fields
  };

  return (
    <div className="w-[70%]">
      <Card className=" bg-blue-100/[.5] dark:bg-blend-darken dark:text-primary-foreground">
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
                        <div className="relative w-full">
                          <AutocompleteInput
                            apiKey={googleMapsApiKey}
                            onPlaceSelected={(place) => {
                              handleSelectFrom(place);
                              form.setValue("pickup", place.formatted_address);
                            }}
                            {...field}
                          />
                        </div>
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
                        <div className="relative w-full">
                          <AutocompleteInput
                            apiKey={googleMapsApiKey}
                            onPlaceSelected={(place) => {
                              handleSelectTo(place);
                              form.setValue("dropoff", place.formatted_address);
                            }}
                            {...field}
                          />
                        </div>
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
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter number of passengers"
                          className=" bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.pax?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center">
                  {/* Date Field */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                          Date
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            type="date"
                            className=" bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.date?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Time Field */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                          Time
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            type="time"
                            className=" bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.time?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Passenger Field */}

              {/* Return Button to toggle return fields */}
              <Button
                className="mr-1 bg-blue-500 dark:bg-card-foreground"
                type="button"
                onClick={toggleReturnFields}
              >
                {showReturnFields ? "Remove Return" : "Add Return"}
              </Button>

              {/* Conditional Return Date and Time Fields */}
              {showReturnFields && (
                <div className="flex justify-between items-center">
                  {/* Return Date Field */}
                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                          Return Date
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            type="date"
                            className=" bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.returnDate?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Return Time Field */}
                  <FormField
                    control={form.control}
                    name="returnTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                          Return Time
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            type="time"
                            className=" bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.returnTime?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <Button
                className="bg-blue-500 dark:bg-card-foreground"
                type="submit"
                disabled={isSubmiting}
              >
                {isSubmiting ? "Searching..." : "See Results"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
