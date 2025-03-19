
"use client";
import { DatePicker } from "../DatePicker";
import CountryCityAPI from "../api/CountryCityAPI";
import { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
// import axios from 'axios';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
interface Country {
  name: string;
  // flag: string;
  // dialCode: string;
  // cities: string[];
}
import { Plane,Hotel,TrainFront,Bus,Building,MapPin } from "lucide-react";
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
      script.onerror = () => console.error("Failed to load Google Maps script.");
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
    service.getPlacePredictions({ input: inputValue, types: ["airport","bus_station","transit_station","train_station","lodging"] }, (results) => {
      setPredictions(results || []);
    });
  };

  const handleSelectPlace = (placeId: string, description: string) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails({ placeId }, (place) => {
      if (place && place.geometry) {
        onPlaceSelected(place);
        const placeTypes = place.types || [];
        const icon = placeTypes.find((type) => placeTypeIcons[type])
          ? placeTypeIcons[placeTypes.find((type) => placeTypeIcons[type])!]
          : <MapPin className="text-gray-500" />;

        setSelectedIcon(icon);
        setPredictions([]);
        if (inputRef.current) inputRef.current.value = description;
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-slate-100 dark:bg-slate-700 border-0 rounded-md ring-2 ring-slate-300 focus:ring-blue-400 text-black dark:text-white p-3 pl-12 text-lg"
          placeholder={isGoogleLoaded ? "Search a location..." : "Loading Google Maps..."}
          disabled={!isGoogleLoaded}
          onChange={handleInputChange}
        />
      <span className="absolute left-4 text-xl text-gray-500 w-6 h-6 flex items-center justify-center">
  {selectedIcon}
</span>
      </div>

      {/* Custom dropdown for suggestions */}
      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {predictions.map((prediction) => {
            const type = prediction.types?.find((t) => placeTypeIcons[t]) || "establishment";
            return (
              <li
              key={prediction.place_id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md"
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {placeTypeIcons[type] || defaultIcon}
              </span>
              <span className="text-lg font-medium">{prediction.description}</span>
            </li>
            
            );
          })}
        </ul>
      )}
    </div>
  );
};



const formSchema = z.object({
  VehicleType: z.string().min(1, {
    message: "Vehicle Type is required",
  }),
  VehicleBrand: z.string().min(1, {
    message: "Vehicle Brand is required",
  }),
  ServiceType: z.string().min(1, {
    message: "Service Type is required",
  }),
  VehicleModel: z.string(),
  Doors: z.string().min(1, { message: "Door is required" }),
  Seats: z.string().min(1, { message: "Seat is required" }),
  Cargo: z.string().optional(),
  Passengers: z.string().min(1, { message: "Passenger is required" }),
  MediumBag: z.string().min(1, { message: "Medium Bag is required" }),
  SmallBag: z.string().min(1, { message: "Small Bag is required" }),
  ExtraSpace: z.array(z.string()).optional(),
  Currency: z.string().min(1, { message: "Currency is required" }),
  Country: z.string().min(1, { message: "Country is required" }),
  City: z.string().min(1, { message: "City is required" }),
  TransferInfo: z.string().optional(),
  DateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .nullable(),
  rows: z.array(
    z.object({
      Transfer_from: z
        .string()
        .min(1, { message: "Transfer From is required" }),
      // Transfer_to: z.string().min(1, { message: "Transfer To is required" }),
      // Vice_versa: z.boolean().optional(),
      Price: z.string().min(1, { message: "Price is required" }),
      Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
      Distance: z.string().min(1, { message: "Distance is required" }),
      Location: z.string().min(1, { message: "Location is required" }),
      NightTime: z.enum(["yes", "no"]).optional(),
      // Night_Vice_Versa:z.boolean().optional(),
      NightTime_Price: z.string().optional(),
    })
  ),
  HalfDayRide: z.enum(["yes", "no"]).optional(),
  FullDayRide: z.enum(["yes", "no"]).optional(),
  VehicleRent: z.string().optional(),
  Fuel: z.enum(["included", "not-included"]).optional(),
  Driver: z.enum(["included", "not-included"]).optional(),
  Parking: z.enum(["included", "not-included"]).optional(),
  TollTax: z.enum(["included", "not-included"]).optional(),
  DriverTips: z.enum(["included", "not-included"]).optional(),
  ParkingFee: z.string().optional(),
  TollFee: z.string().optional(),
  Tip: z.string().optional(),
  Others: z.string().optional(),
  HalfFullNightTime: z.enum(["yes", "no"]).optional(),
  HalfFullNightTimePrice: z.string().optional(),
});

const VehicleDetails = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
  const [fromCoords, setFromCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(
          `${API_BASE_URL}/supplier/dashboard`
        );
        console.log("User Data:", data); // Debugging log for API response
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user data:", err); // Debugging log for errors
        setError(err.message);
        removeToken();
      }
    };

    fetchUserData();
  }, []);

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([
    { TransferFrom: "", TransferTo: "", Vice_Versa: false, Price: "" },
  ]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  // const [selectedCity, setSelectedCity] = useState<string>("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [doors, setDoors] = useState("");
  const [seats, setSeats] = useState("");
  const [pax, setPax] = useState("");
  const [mediumBag, setMediumBag] = useState("");
  const [smallBag, setSmallBag] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      VehicleType: "",
      VehicleBrand: "",
      ServiceType: "",
      VehicleModel: "",
      ExtraSpace: [],
      Currency: "Rs",
      Cargo: "",
      Country: "",
      City: "",
      TransferInfo: "",
      DateRange: {
        from: new Date(),
        to: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to next month
      },
      rows: [
        {
          Transfer_from: "",
          // Transfer_to: "",
          // Vice_versa: false,
          Extra_Price: "",
          Distance: "",
          Price: "",
          Location:"",
          NightTime: "no",
          // Night_Vice_Versa: false,
          NightTime_Price: "",
        },
      ],
      VehicleRent: "",
      ParkingFee: "",
      TollFee: "",
      Others: "",
      Tip: "",
      Fuel: "included",
      Driver: "included",
      HalfDayRide: "no",
      FullDayRide: "no",
      Parking: "included",
      TollTax: "included",
      DriverTips: "included",
      HalfFullNightTime: "no",
    },
  });
  const Currency = form.watch("Currency");
  const HalfDayRide = form.watch("HalfDayRide");
  const FullDayRide = form.watch("FullDayRide");
  const Parking = form.watch("Parking");
  const TollTax = form.watch("TollTax");
  const DriverTips = form.watch("DriverTips");
  const HalfFullNightTime = form.watch("HalfFullNightTime");

  // Generate numbers from 1 to 100
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const baseDistance = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
  const extraSpaceOptions = [
    "Roof Rack",
    "Trailer Hitch",
    "Extended Cargo Space",
  ];
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Generate a unique ID for linking data
      const uniqueId = `vehicle_${Date.now()}`;

      // Prepare data for the whole form API
      const wholeFormData = {
        // ...data,
        uniqueId,
        VehicleType: data.VehicleType,
        VehicleBrand: data.VehicleBrand,
        ServiceType: data.ServiceType,
        VehicleModel: data.VehicleModel,
        Doors: data.Doors,
        Seats: data.Seats,
        Cargo: data.Cargo,
        Country: data.Country,
        City: data.City,
        Passengers: data.Passengers,
        MediumBag: data.MediumBag,
        SmallBag: data.SmallBag,
        TransferInfo: data.TransferInfo,
        HalfDayRide: data.HalfDayRide,
        FullDayRide: data.FullDayRide,
        HalfFullNightTime: data.HalfFullNightTime,
        HalfFullNightTimePrice: data.HalfFullNightTimePrice,
        VehicleRent: data.VehicleRent,
        Fuel: data.Fuel,
        Driver: data.Driver,
        ParkingFee: data.ParkingFee,
        TollTax: data.TollTax,
        Tip: data.Tip,
        From: data.DateRange?.from || null,
        To: data.DateRange?.to || null,
        TollFee: data.TollFee,
        Parking: data.Parking,
        Currency: data.Currency,
        Others: data.Others,
        SupplierId: user.userId,
      };

      // Prepare data for the extraspace API
      const extraspaceData = [
        {
          uniqueId,
          Roof_Rack: data.ExtraSpace?.includes("Roof Rack") ? "Selected" : "",
          Trailer_Hitch: data.ExtraSpace?.includes("Trailer Hitch")
            ? "Selected"
            : "",
          Extended_Cargo_Space: data.ExtraSpace?.includes(
            "Extended Cargo Space"
          )
            ? "Selected"
            : "",
        },
      ];
      console.log("Submitting extraspaceData:", extraspaceData);
      // Prepare data for the rows API
      const rowsData = data.rows.map((row) => ({
        uniqueId,
      Transfer_from: row.Transfer_from,
      Location: row.Location, // Send lat,lng as a single string
      Price: row.Price,
      Extra_Price: row.Extra_Price,
      Distance: row.Distance,
      NightTime: row.NightTime,
      NightTime_Price: row.NightTime_Price,
      }));
      // Prepare data for the dateRange API
      const dateRange = {
        uniqueId,
        // DateRange: data.DateRange,
        from: data.DateRange?.from || null,
        to: data.DateRange?.to || null,
      };
      console.log("Submitting daterange:", dateRange);
      // Sequential API calls
      const wholeFormResponse = await fetch(
        `${API_BASE_URL}/supplier/CreateCarDetail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wholeFormData),
        }
      );

      if (!wholeFormResponse.ok) {
        throw new Error("Failed to save the whole form data");
      }

      const extraspaceResponse = await fetch(
        `${API_BASE_URL}/supplier/CreateExtraSpaces`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(extraspaceData),
        }
      );

      if (!extraspaceResponse.ok) {
        // throw new Error("Failed to save the extraspace data");
        const error = await extraspaceResponse.json();
        console.error("Extraspace API Error:", error);
        throw new Error(error.message || "Failed to save extraspace data");
      }

      const rowsResponse = await fetch(
        `${API_BASE_URL}/supplier/CreateRows`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rowsData),
        }
      );

      if (!rowsResponse.ok) {
        throw new Error("Failed to save the rows data");
      }

      // Show success toast
      toast({
        title: "Success!",
        description: "All data saved successfully.",
      });
      // Reset form after successful submission
      form.reset();
      console.log(data);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: (error as Error).message,
      });
      console.log(data);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    form.setValue("VehicleType", value);
  };
  const handleVehicleBrandChange = (value: string) => {
    setVehicleBrand(value);
    form.setValue("VehicleBrand", value);
  };
  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    form.setValue("ServiceType", value);
  };
  const handleVehicleModelChange = (value: string) => {
    setVehicleModel(value);
    form.setValue("VehicleModel", value);
  };
  const handleDoorsChange = (value: string) => {
    setDoors(value);
    form.setValue("Doors", value);
  };
  const handleSeatsChange = (value: string) => {
    setSeats(value);
    form.setValue("Seats", value);
  };
  const handlePaxChange = (value: string) => {
    setPax(value);
    form.setValue("Passengers", value);
  };
  const handleMediumBagChange = (value: string) => {
    setMediumBag(value);
    form.setValue("MediumBag", value);
  };
  const handleSmallBagChange = (value: string) => {
    setSmallBag(value);
    form.setValue("SmallBag", value);
  };
  const handleCountryChange = (value: string) => {
    const country = countries.find((country) => country.name === value);
    if (country) {
      setSelectedCountry(value);
      form.setValue("Country", value);
      form.trigger("Country");
      form.setValue("City", "");
      // setSelectedCity("");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      Transfer_from: "",
      // Transfer_to: "",
      // Vice_versa: false,
      Price: "",
      Extra_Price: "",
      Distnace: "",
      NightTime: "no",
      NightTime_Price: "",
    };
    setRows((prevRows) => [...prevRows, newRow]); // Add a new row
    form.setValue("rows", [...form.getValues("rows"), newRow]); // Update the form state
  };

  // const handleAddRow = () => {
  //   const newRow = {
  //     Transfer_from: "",
  //     Transfer_to: "",
  //     Vice_versa: false,
  //     Price: "",
  //     NightTime: "no",
  //     NightTime_Price: "",
  //   };
  //   setRows((prevRows) => [...prevRows, newRow]);
  //   form.setValue("rows", [...form.getValues("rows"), newRow], { shouldValidate: true });
  // };

  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index)); // Update the rows state
    form.setValue(
      "rows",
      form.getValues("rows").filter((_, i) => i !== index) // Update the form state
    );
  };

  const handleSelectFrom = (place: any) => {
    const location = place.geometry.location;
    setFromCoords({ lat: location.lat(), lng: location.lng() });
  };

  return (
    <Card>
      <CountryCityAPI onDataFetched={setCountries} />
      <CardHeader>
        <CardTitle>Add Your Vehicle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page refresh
              form.handleSubmit(handleSubmit)(); // Trigger react-hook-form's submit handler
            }}
            className="space-y-6"
          >
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Vehicle Details
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
              {/* <CardDescription className="text-lg">
                Vehicle Details
              </CardDescription> */}
              <div className="grid grid-cols-2 md:grid-cols-4 justify-between items-center gap-2">
                <FormField
                  control={form.control}
                  name="VehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(value)}
                          onValueChange={handleVehicleTypeChange}
                          value={vehicleType}
                        >
                          <SelectTrigger className="w-full ">
                            <SelectValue placeholder="Vehicle Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="XUV">XUV</SelectItem>
                            <SelectItem value="MPV6">MPV6</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="VehicleBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Brand</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(value)}
                          onValueChange={handleVehicleBrandChange}
                          value={vehicleBrand}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Vehicle Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Audi">Audi</SelectItem>
                            <SelectItem value="Mercedis">Mercedis</SelectItem>
                            <SelectItem value="Toyota">Toyota</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ServiceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(value)}
                          onValueChange={handleServiceTypeChange}
                          value={serviceType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Service Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="VehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(value)}
                          onValueChange={handleVehicleModelChange}
                          value={vehicleModel}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Vehicle Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A-ONE">A-ONE</SelectItem>
                            <SelectItem value="M-TWO">M-TWO</SelectItem>
                            <SelectItem value="T-Z">T-Z</SelectItem>
                            <SelectItem value="MPV">MPV</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 justify-between items-center gap-2 pt-2">
                <FormField
                  control={form.control}
                  name="Doors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doors</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(Number(value))}
                          onValueChange={handleDoorsChange}
                          value={doors}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Doors" />
                          </SelectTrigger>
                          <SelectContent>
                            {numbers.map((door) => (
                              <SelectItem value={`${door}`} key={door}>
                                {door}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(Number(value))}
                          onValueChange={handleSeatsChange}
                          value={seats}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Seats" />
                          </SelectTrigger>
                          <SelectContent>
                            {numbers.map((seat) => (
                              <SelectItem value={`${seat}`} key={seat}>
                                {seat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                      // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
                      >
                        Cargo Space (litres)
                      </FormLabel>
                      <FormControl>
                        <Input
                          // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                          placeholder="Enter Cargo"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passengers</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(Number(value))}
                          onValueChange={handlePaxChange}
                          value={pax}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Passengers" />
                          </SelectTrigger>
                          <SelectContent>
                            {numbers.map((pax) => (
                              <SelectItem value={`${pax}`} key={pax}>
                                {pax}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Luggage Info
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
              {/* <CardDescription className="text-lg">
                Luggage Info
              </CardDescription> */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-baseline gap-2">
                <div className="grid grid-cols-2 justify-between items-center gap-2">
                  <FormField
                    control={form.control}
                    name="MediumBag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medium Bag</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            // value={`${field.value}`}
                            // onValueChange={(value) => field.onChange(Number(value))}
                            onValueChange={handleMediumBagChange}
                            value={mediumBag}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Medium Bag" />
                            </SelectTrigger>
                            <SelectContent>
                              {numbers.map((mbag) => (
                                <SelectItem value={`${mbag}`} key={mbag}>
                                  {mbag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="SmallBag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Small Bag</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            // value={`${field.value}`}
                            // onValueChange={(value) => field.onChange(Number(value))}
                            onValueChange={handleSmallBagChange}
                            value={smallBag}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Small Bag" />
                            </SelectTrigger>
                            <SelectContent>
                              {numbers.map((sbag) => (
                                <SelectItem value={`${sbag}`} key={sbag}>
                                  {sbag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:px-5">
                  {/* Multi-Checkbox Field: Extra Space */}
                  <FormField
                    control={form.control}
                    name="ExtraSpace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Space</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            {extraSpaceOptions.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(isChecked) => {
                                    if (isChecked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        option,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (item) => item !== option
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Transfer Details
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
              {/* <CardDescription className="text-lg">
                Transfer Details
              </CardDescription> */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mb-2">
                <FormField
                  control={form.control}
                  name="Country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={handleCountryChange}
                          value={selectedCountry}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries
                              .slice() // create a copy of the array
                              .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically by country name
                              .map((country) => (
                                <SelectItem
                                  key={country.name}
                                  value={country.name}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="City"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        {/* <Select
                          {...field}
                          onValueChange={handleCityChange}
                          value={selectedCity}
                          disabled={!selectedCountry}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city, index) => (
                              <SelectItem key={index} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
                        <Input
                          type="text"
                          // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                          placeholder="Enter Your City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={`${field.value}`}
                          onValueChange={(value) => field.onChange(value)}
                          // onValueChange={handleCurrencyChange}
                          // value={currency}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rs">Rs</SelectItem>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="ed">ED</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="TransferInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Info</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Transfer Info"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="DateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {rows.map((row, index) => {
                const nightTime = form.watch(`rows.${index}.NightTime`);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`rows.${index}.Transfer_from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            {/* <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Transfer From" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Airport">Airport</SelectItem>
                                <SelectItem value="Cruise">Cruise</SelectItem>
                                <SelectItem value="Station">Station</SelectItem>
                                <SelectItem value="City Center">
                                  City Center
                                </SelectItem>
                                <SelectItem value="Hotel">Hotel</SelectItem>
                              </SelectContent>
                            </Select> */}
                            <AutocompleteInput
                              apiKey={googleMapsApiKey}
                              onPlaceSelected={(location) => {
                                form.setValue(`rows.${index}.Transfer_from`, location.address, { shouldValidate: true });
                                form.setValue(`rows.${index}.Location`, location.latLng); // Store "lat,lng"
                              }}
                              types={["(regions)"]}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name={`rows.${index}.Transfer_to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Transfer To" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Airport">Airport</SelectItem>
                                <SelectItem value="Cruise">Cruise</SelectItem>
                                <SelectItem value="Station">Station</SelectItem>
                                <SelectItem value="City Center">
                                  City Center
                                </SelectItem>
                                <SelectItem value="Hotel">Hotel</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name={`rows.${index}.Distance`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Distance (miles)</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Base Distance (miles)" />
                              </SelectTrigger>
                              <SelectContent>
                                {baseDistance(50, 200, 10).map((distance) => (
                                  <SelectItem
                                    value={`${distance}`}
                                    key={distance}
                                  >
                                    {distance}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name={`rows.${index}.Vice_versa`}
                      render={({ field }) => (
                        <FormItem>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel className="pl-1">Vice-Versa</FormLabel>
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name={`rows.${index}.Price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <span className="bg-secondary px-2 py-1 rounded-sm">
                                {Currency.toUpperCase()}
                              </span>
                              <Input
                                placeholder="Enter Price"
                                {...field}
                                value={field.value || ""}
                                type="number"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`rows.${index}.Extra_Price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Price Per Miles</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <span className="bg-secondary px-2 py-1 rounded-sm">
                                {Currency.toUpperCase()}
                              </span>
                              <Input
                                placeholder="Enter Price"
                                {...field}
                                value={field.value || ""}
                                type="number"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormField
                        control={form.control}
                        name={`rows.${index}.NightTime`}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>
                              Night Time Supplements (10PM-06AM)
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || "no"}
                                className="flex items-center"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {nightTime === "yes" && (
                        <FormField
                          control={form.control}
                          name={`rows.${index}.NightTime_Price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Night Time Price (per hour)</FormLabel>
                              <FormControl>
                                <div className="flex justify-center">
                                  <span className="bg-secondary px-2 py-1 rounded-sm">
                                    {Currency.toUpperCase()}
                                  </span>
                                  <Input
                                    placeholder="Night Time Price"
                                    {...field}
                                    value={field.value || ""}
                                    type="number"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleDeleteRow(index)}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}

              <Button
                type="button"
                // variant="secondary"
                onClick={handleAddRow}
                className="my-2"
              >
                Add Row
              </Button>
            </div>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Others Details
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
              {/* <CardDescription className="text-lg">
                Othes Details
              </CardDescription> */}

              <div className="grid grid-cols-2 justify-between items-center">
                <FormField
                  control={form.control}
                  name="HalfDayRide"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Half Day Ride (4hrs)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value || "no"}
                          className="flex items-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="FullDayRide"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Full Day Ride (8hrs)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value || "no"}
                          className="flex items-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Show Inclusions Only If HalfDayRide or FullDayRide is "yes" */}
              {(HalfDayRide === "yes" || FullDayRide === "yes") && (
                <div>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="HalfFullNightTime"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Night Time Supplements (10PM-06AM)
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value || "no"}
                              className="flex items-center"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {HalfFullNightTime === "yes" && (
                      <FormField
                        control={form.control}
                        name="HalfFullNightTimePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Night Time Price (per hour)</FormLabel>
                            <FormControl>
                              <div className="flex justify-center w-1/2 md:w-1/4">
                                <span className="bg-secondary px-2 py-1 rounded-sm">
                                  {Currency.toUpperCase()}
                                </span>
                                <Input
                                  placeholder="Night Time Price"
                                  {...field}
                                  value={field.value || ""}
                                  type="number"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <CardDescription className="text-lg mt-2">
                    Inclusions
                  </CardDescription>
                  <div>
                    <FormField
                      control={form.control}
                      name="VehicleRent"
                      render={({ field }) => (
                        <FormItem className="w-1/4">
                          <FormLabel>Vehicle Rent</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <span className="bg-secondary px-2 py-1 rounded-sm">
                                {Currency.toUpperCase()}
                              </span>
                              <Input
                                placeholder="Vehicle Rent"
                                {...field}
                                type="number"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <FormField
                        control={form.control}
                        name="Fuel"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Fuel</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value || "included"}
                                className="flex items-center"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="included" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Included
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="not-included" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Not Included
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Driver"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Driver</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value || "included"}
                                className="flex items-center"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="included" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Included
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="not-included" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Not Included
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-2 mt-4">
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="Parking"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Parking</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "included"}
                                  className="flex items-center"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Included
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="not-included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Not Included
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {Parking === "not-included" && (
                          <FormField
                            control={form.control}
                            name="ParkingFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Parking Fee</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <span className="bg-secondary px-2 py-1 rounded-sm">
                                      {Currency.toUpperCase()}
                                    </span>
                                    <Input
                                      placeholder="Parking Fee"
                                      {...field}
                                      type="number"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="TollTax"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Toll-Tax</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "included"}
                                  className="flex items-center"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Included
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="not-included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Not Included
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {TollTax === "not-included" && (
                          <FormField
                            control={form.control}
                            name="TollFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Toll Fees</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <span className="bg-secondary px-2 py-1 rounded-sm">
                                      {Currency.toUpperCase()}
                                    </span>
                                    <Input
                                      placeholder="Toll Fees"
                                      {...field}
                                      type="number"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="DriverTips"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Driver Tips</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "included"}
                                  className="flex items-center"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Included
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="not-included" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Not Included
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {DriverTips === "not-included" && (
                          <FormField
                            control={form.control}
                            name="Tip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tip</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <span className="bg-secondary px-2 py-1 rounded-sm">
                                      {Currency.toUpperCase()}
                                    </span>
                                    <Input
                                      placeholder="Tip"
                                      {...field}
                                      type="number"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="Others"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Others</FormLabel>
                          <FormControl>
                            <Input placeholder="Others" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* <Button type="submit" className="w-full"> */}
            {/* {isLoading ? "Submitting..." : "Submit"} */}
            {/* Submit */}
            {/* </Button> */}
            <Button type="submit">
              {isLoading ? "Adding Vehicle..." : "Add More Vehicle"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
