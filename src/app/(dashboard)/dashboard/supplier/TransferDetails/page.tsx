"use client";
import { useState,useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/DatePicker";
import CountryCityAPI from "@/components/api/CountryCityAPI";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
interface Country {
  name: string;
}

// Validation Schema
const formSchema = z.object({
  uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
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
      Transfer_from: z.string().min(1, { message: "Transfer From is required" }),
      Price: z.string().min(1, { message: "Price is required" }),
      Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
      Distance: z.string().min(1, { message: "Distance is required" }),
    //   Location: z.string().min(1, { message: "Location is required" }),
      NightTime: z.enum(["yes", "no"]).optional(),
      NightTime_Price: z.string().optional(),
    })
  ),
});

const TransferDetailsForm = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([
    { TransferFrom: "", TransferTo: "", Vice_Versa: false, Price: "" },
  ]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const { toast } = useToast();
  // const [isLoading, setIsLoading] = useState(false);
 // ✅ Fetch User & Vehicles in One Efficient Call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchWithAuth(
          `${API_BASE_URL}/supplier/dashboard`
        );
        const vehicleResponse = await fetch(
          `${API_BASE_URL}/supplier/getCarDetails/${userData.userId}`
        );
        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");

        const vehicleData = await vehicleResponse.json();
        const processedVehicles = vehicleData.map(
          (item: any) => item.Car_Details
        );

        setVehicles(processedVehicles);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: "",
      Currency: "Rs",
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
          Extra_Price: "",
          Distance: "",
          Price: "",
        //   Location: "",
          NightTime: "no",
          NightTime_Price: "",
        },
      ],
    },
  });

  const Currency = form.watch("Currency");

  const baseDistance = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, index) => start + index * step
    );

  const handleCountryChange = (value: string) => {
    const country = countries.find((country) => country.name === value);
    if (country) {
      setSelectedCountry(value);
      form.setValue("Country", value);
      form.trigger("Country");
      form.setValue("City", "");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      Transfer_from: "",
      Price: "",
      Extra_Price: "",
      Distance: "",
    //   Location: "",
      NightTime: "no",
      NightTime_Price: "",
    };
    setRows((prevRows) => [...prevRows, newRow]);
    form.setValue("rows", [...form.getValues("rows"), newRow]);
  };

  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
    form.setValue(
      "rows",
      form.getValues("rows").filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form Submitted:", data); // Log form values
console.log("clicked");
    // setIsLoading(true);
    // try {
    //   // Simulate an API call
    //   const response = await fetch("/api/transfer-details", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to save transfer details");
    //   }

    //   toast({ title: "Success!", description: "Transfer details saved." });
    //   form.reset();
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   toast({ title: "Error", description: (error as Error).message });
    // } finally {
    //   setIsLoading(false);
    // }
  };


  if (loading) {
    return (
      <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <Card>
      <CountryCityAPI onDataFetched={setCountries} />
      <CardHeader>
        <CardTitle>Transfer Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
              Select Vehicle
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          <FormField
              control={form.control}
              name="uniqueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Vehicle</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.length === 0 ? (
                          <p className="text-red-500 text-center p-2">
                            No vehicles found
                          </p>
                        ) : (
                          vehicles.map((vehicle) => (
                            <SelectItem
                              key={vehicle.uniqueId}
                              value={vehicle.uniqueId}
                            >
                              {vehicle.VehicleBrand} ({vehicle.VehicleModel})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Transfer Details
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
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
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
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
                        <Input
                          type="text"
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
                            <Select
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
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                {baseDistance(30, 200, 10).map((distance) => (
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
                onClick={handleAddRow}
                className="my-2"
              >
                Add Row
              </Button>
            </div>
            <Button type="submit">
              {/* {isLoading ? "Saving..." : "Save Transfer Details"} */}
              Save Transfer Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransferDetailsForm;