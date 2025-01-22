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
  CardDescription,
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
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";

import { Button } from "./ui/button";
const MapContainerStyle = {
  width: "100%",
  height: "400px",
};

const AutocompleteInput = ({ apiKey, onPlaceSelected }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (inputRef.current && window.google?.maps) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            onPlaceSelected(place);
          }
        });
      }
    };

    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(() => {
          initializeAutocomplete();
        }, 500);
      };
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
  }, [apiKey]);

  return (
    <input
    
      ref={inputRef}
      type="text"
      // className="border p-2 w-full"
      className="bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
      placeholder="Enter a location"
    />
  );
};


// const AutocompleteInput = ({ apiKey, onPlaceSelected, ...props }: any) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const initializeAutocomplete = () => {
//       if (inputRef.current && window.google?.maps) {
//         const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, { types: ["geocode"] });

//         autocomplete.addListener("place_changed", () => {
//           const place = autocomplete.getPlace();
//           if (place.geometry) {
//             onPlaceSelected(place);
//           }
//         });
//       }
//     };

//     if (!window.google?.maps) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => {
//         setTimeout(() => {
//           initializeAutocomplete();
//         }, 500);
//       };
//       document.head.appendChild(script);
//     } else {
//       initializeAutocomplete();
//     }
//   }, [apiKey]);

//   return (
//     <input
//       ref={inputRef}
//       {...props} // Pass additional props like `className` or `placeholder`
//       className="bg-slate-100 dark:bg-slate-500 border-0 rounded-sm ring-1 ring-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white p-1"
//     />
//   );
// };


// Define the validation schema with date and time fields
const formSchema = z.object({
  pickup: z.string().min(1, { message: "Pick Up is Required" }),
  dropoff: z.string().min(1, { message: "Drop Off is Required" }),
  pax: z.string().min(1, { message: "Passenger is required" }),
  date: z.string().min(1, { message: "Date is required" }), // Date for the journey
  time: z.string().min(1, { message: "Time is required" }), // Time for the journey
  // returnDate: z.string().optional(), // Optional return date
  // returnTime: z.string().optional(), // Optional return time
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
  const [priceEstimate, setPriceEstimate] = useState<any[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [showReturnFields, setShowReturnFields] = useState(false); // State to toggle return date/time fields
  const apiUsername = "1863";
  const apiPassword = "1830Voldemort";
  const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
const {toast} = useToast();
const { setBookingData } = useBooking();
const [isSubmiting,setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup: "",
      dropoff: "",
      pax: "",
      date: "",
      time: "",
      // returnDate: "",
      // returnTime: "",
    },
  });

  const loginAndFetchToken = async () => {
    try {
      const response = await axios.post(
        "https://sandbox.iway.io/transnextgen/v3/auth/login",
        {
          user_id: apiUsername,
          password: apiPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const token = response.data.result.token;
      setAuthToken(token);
      return token;
    } catch (error) {
      console.error(
        "Authentication Error:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleSelectFrom = (place: any) => {
    const location = place.geometry.location;
    setFromCoords({ lat: location.lat(), lng: location.lng() });
  };

  const handleSelectTo = (place: any) => {
    const location = place.geometry.location;
    setToCoords({ lat: location.lat(), lng: location.lng() });
  };

  const handleGetPriceEstimate = async () => {
    if (fromCoords && toCoords) {
      const { lat: fromLat, lng: fromLng } = fromCoords;
      const { lat: toLat, lng: toLng } = toCoords;

      try {
        let token = authToken;
        if (!token) {
          token = await loginAndFetchToken();
          if (!token) return;
        }

        const apiUrl = `https://sandbox.iway.io/transnextgen/v3/prices/rent?user_id=${apiUsername}&lang=en&currency=INR&start_place_point=${fromLat},${fromLng}&end_place_point=${toLat},${toLng}&duration=3600`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPriceEstimate(response.data.result || []);
      } catch (error) {
        console.error(
          "Error fetching price estimate:",
          error.response?.data || error.message
        );
      }
    } else {
      console.warn('Both "From" and "To" coordinates must be selected.');
    }
  };

  const handleGetDirections = () => {
    if (fromCoords && toCoords) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: fromCoords,
          destination: toCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirectionsResponse(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  };
  
  const onSubmit = async(data: FormData) => {
setIsSubmitting(true);

    if (!fromCoords || !toCoords) {
      toast({
        title:'Valid Location',
        description:'Please select valid locations for both Pickup and Dropoff.',
        variant:'destructive',
      })
      // alert("Please select valid locations for both Pickup and Dropoff.");
      return;
    }
  
    const payload = {
      ...data, 
        pickupLocation:`${toCoords.lat},${toCoords.lng}`,
        dropoffLocation:`${toCoords.lat},${toCoords.lng}`,

      // pickup: {
      //   address: data.pickup,
      //   coordinates: `${fromCoords.lat},${fromCoords.lng}`,
      // },
      // dropoff: {
      //   address: data.dropoff,
      //   coordinates: `${toCoords.lat},${toCoords.lng}`,
      // },
      // passengers: data.pax,
      // date: data.date,
      // time: data.time,
      // returnDetails: showReturnFields
      //   ? {
      //       date: data.returnDate,
      //       time: data.returnTime,
      //     }
      //   : null,
    };
  
    console.log("Payload to Send:", payload);
  
    try {
      const response = await axios.post("http://localhost:8000/api/V1/data/search", payload, {
        headers: {
          "Content-Type": "application/json",
          
        },
      });
  
      if (response.status === 200) {
        toast({
          title:'Searching Vehicle',
          description:'Request submitted successfully'
        })
        // alert("Booking successfully submitted!");
        console.log("API Response:", response.data);
         // Store the response data in the state
      setBookingData({
        formData: data,
        responseData: response.data.data,
      });
      form.reset();
      } else {
        toast({
          title:'API Error',
          description:'Something went wrong, please try again.'
        })
        // alert("Something went wrong, please try again.");
        // console.error("API Error:", response.data);
      }
    } catch (error) {
      toast({
        title:'Error while submitting data',
        description:`API Error:", ${error.response?.data} || ${error.message}`
      })
      // alert("An error occurred while submitting the booking.");
      // console.error("API Error:", error.response?.data || error.message);
    }finally{
      setIsSubmitting(false);
    }
  };

  const toggleReturnFields = () => {
    setShowReturnFields(!showReturnFields); // Toggle return date/time fields
  };
  return (
    // <div>
    //   <h1>Google Maps Integration with Price Estimate</h1>
    //   <div>
    //     <label>From: </label>
    //     <AutocompleteInput
    //       apiKey={googleMapsApiKey}
    //       onPlaceSelected={handleSelectFrom}
    //       types={["(regions)"]}
    //     />
    //   </div>
    //   <div>
    //     <label>To: </label>
    //     <AutocompleteInput
    //       apiKey={googleMapsApiKey}
    //       onPlaceSelected={handleSelectTo}
    //       types={["(regions)"]}
    //     />
    //   </div>
    //   <div className="flex gap-2 my-2">
    //     <Button onClick={handleGetPriceEstimate}>Get Price</Button>
    //     <Button onClick={handleGetDirections}>Get Directions</Button>
    //   </div>
    //   {/* <button  onClick={handleGetPriceEstimate}>Get Price Estimate</button>
    //   <button onClick={handleGetDirections}>Get Directions</button> */}

    //   {priceEstimate.length > 0 ? (
    //     <div>
    //       <h2>Available Cars</h2>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {priceEstimate.map((car: any, index: number) => (
    //           <div
    //             key={index}
    //             className="border p-4 rounded-lg shadow-lg bg-white"
    //             style={{ height: "200px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    //           >
    //             <h3 className="text-xl font-bold">{car.car_class.models[0]}</h3>
    //             <p className="text-lg">Price: ₹{car.price}</p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   ) : (
    //     <div>No cars available at the moment.</div>
    //   )}

    //   <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
    //     <GoogleMap
    //       mapContainerStyle={MapContainerStyle}
    //       center={fromCoords || { lat: 20.5937, lng: 78.9629 }}
    //       zoom={8}
    //     >
    //       {fromCoords && <Marker position={fromCoords} />}
    //       {toCoords && <Marker position={toCoords} />}
    //       {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
    //     </GoogleMap>
    //   </LoadScript>
    // </div>

    <div className="w-[70%]">
      <Card className=" bg-blue-100/[.5] dark:bg-blend-darken dark:text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-medium">Book Your Rides</CardTitle>
          {/* <CardDescription>
            Search with Autocomplete and Distance Calculation
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 {/* Pickup Field */}
              <FormField
                control={form.control}
                name="pickup"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                      Pickup Location
                    </FormLabel>
                    <FormControl>
                      {/* <LocationAutocomplete
                        onSelect={handleSelectFrom}
                        {...field}
                      /> */}
                      <AutocompleteInput
                        apiKey={googleMapsApiKey}
                        onPlaceSelected={(place) => {
                          handleSelectFrom(place); // Updates `toCoords` with latitude and longitude
                          form.setValue("pickup", place.formatted_address); // Updates the form's `dropoff` field
                        }}
                        types={["(regions)"]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.pickup?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Dropoff Field */}
              <FormField
                control={form.control}
                name="dropoff"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-blue-400 dark:text-white">
                      Dropoff Location
                    </FormLabel>
                    <FormControl>
                      {/* <LocationAutocomplete
                        onSelect={handleSelectTo}
                        {...field}
                      /> */}
                      <AutocompleteInput
                        apiKey={googleMapsApiKey}
                        onPlaceSelected={(place) => {
                          handleSelectTo(place); // Updates `toCoords` with latitude and longitude
                          form.setValue("dropoff", place.formatted_address); // Updates the form's `dropoff` field
                        }}
                        types={["(regions)"]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.dropoff?.message}
                    </FormMessage>
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
              {/* <Button
                className="mr-1 bg-blue-500 dark:bg-card-foreground"
                type="button"
                onClick={toggleReturnFields}
              >
                {showReturnFields ? "Remove Return" : "Add Return"}
              </Button> */}

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
              <Button className="bg-blue-500 dark:bg-card-foreground" type="submit" disabled={isSubmiting}>
                {isSubmiting ? "Searching..." : "See Results"}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
         <GoogleMap
           mapContainerStyle={MapContainerStyle}
           center={fromCoords || { lat: 20.5937, lng: 78.9629 }}
           zoom={8}
         >
           {fromCoords && <Marker position={fromCoords} />}
           {toCoords && <Marker position={toCoords} />}
           {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
         </GoogleMap>
       </LoadScript> */}
    </div>
  );
}
