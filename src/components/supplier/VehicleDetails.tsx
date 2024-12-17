"use client";
import { useState } from "react";
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
// import { useToast } from "@/hooks/use-toast";
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
  rows: z.array(
    z.object({
      TransferFrom: z.string().min(1, { message: "Transfer From is required" }),
      TransferTo: z.string().min(1, { message: "Transfer To is required" }),
      Vice_Versa: z.boolean().optional(),
      Price: z.string().min(1, { message: "Price is required" }),
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
});

const VehicleDetails = () => {
  // const { toast } = useToast();
  // const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([
    { TransferFrom: "", TransferTo: "", Vice_Versa: false, Price: "" },
  ]);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [doors, setDoors] = useState("");
  const [seats, setSeats] = useState("");
  const [pax, setPax] = useState("");
  const [mediumBag, setMediumBag] = useState("");
  const [smallBag, setSmallBag] = useState("");
  const [currency, setCurrency] = useState("Rs");
  // const [transferTo, setTransferTo] = useState("");
  // const [transferFrom, setTransferFrom] = useState("");
  // const [showCurrency,setShowCurrency] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      VehicleType: "",
      VehicleBrand: "",
      ServiceType: "",
      VehicleModel: "",
      ExtraSpace: [""],
      Currency: "",
      Cargo: "",

      rows,
      VehicleRent: "",
      ParkingFee: "",
      TollFee: "",
      Others: "",
      Tip: "",
      // TransferFrom: "",
      // TransferTo: "",
      // Price: "",
    },
  });

  const HalfDayRide = form.watch("HalfDayRide");
  const FullDayRide = form.watch("FullDayRide");
  const Parking = form.watch("Parking");
  const TollTax = form.watch("TollTax");
  const DriverTips = form.watch("DriverTips");
  // Generate numbers from 1 to 100
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const extraSpaceOptions = [
    "Roof Rack",
    "Trailer Hitch",
    "Extended Cargo Space",
  ];
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("form submitted");
    console.log(data);
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
  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    form.setValue("Currency", value);
    // setShowCurrency(true);
  };
  // const handleTransferToChange = (value: string) => {
  //   setTransferTo(value);
  //   form.setValue("TransferTo", value);
  // };
  // const handleTransferFromChange = (value: string) => {
  //   setTransferFrom(value);
  //   form.setValue("TransferFrom", value);
  // };
  const handleAddRow = () => {
    const newRow = {
      TransferFrom: "",
      TransferTo: "",
      Vice_Versa: false,
      Price: "",
    };
    setRows((prevRows) => [...prevRows, newRow]); // Add a new row
    form.setValue("rows", [...form.getValues("rows"), newRow]); // Update the form state
  };
  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index)); // Update the rows state
    form.setValue(
      "rows",
      form.getValues("rows").filter((_, i) => i !== index) // Update the form state
    );
  };

  return (
    <Card>
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
            // onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div>
              <CardDescription className="text-lg">
                Vehicle Details
              </CardDescription>
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Vehicle Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="XUV">XUV</SelectItem>
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
            <div>
              <CardDescription className="text-lg">
                Luggage Info
              </CardDescription>
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
            <div>
              <CardDescription className="text-lg">
                Transfer Details
              </CardDescription>
              <div>
                <FormField
                  control={form.control}
                  name="Currency"
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          // value={`${field.value}`}
                          // onValueChange={(value) => field.onChange(value)}
                          onValueChange={handleCurrencyChange}
                          value={currency}
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
              </div>
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
                >
                  <FormField
                    control={form.control}
                    name={`rows.${index}.TransferFrom`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="From" />
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
                    name={`rows.${index}.TransferTo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="To" />
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
                    name={`rows.${index}.Vice_Versa`}
                    render={({ field }) => (
                      <FormItem>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <FormLabel className="pl-1">Vice-Versa</FormLabel>
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
                              {currency.toUpperCase()}
                            </span>
                            <Input
                              placeholder="Enter Price"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleDeleteRow(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                // variant="secondary"
                onClick={handleAddRow}
                className="my-2"
              >
                Add Row
              </Button>
            </div>

            {/* <Button type="submit" className="w-full"> */}
            {/* {isLoading ? "Submitting..." : "Submit"} */}
            {/* Submit */}
            {/* </Button> */}
            <div>
              <CardDescription className="text-lg">
                Othes Details
              </CardDescription>

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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                                {currency.toUpperCase()}
                              </span>
                              <Input placeholder="Vehicle Rent" {...field} />
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
                                defaultValue={field.value}
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
                                defaultValue={field.value}
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
                                  defaultValue={field.value}
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
                                      {currency.toUpperCase()}
                                    </span>
                                    <Input
                                      placeholder="Parking Fee"
                                      {...field}
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
                                  defaultValue={field.value}
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
                                      {currency.toUpperCase()}
                                    </span>
                                    <Input placeholder="Toll Fees" {...field} />
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
                                  defaultValue={field.value}
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
                                      {currency.toUpperCase()}
                                    </span>
                                    <Input placeholder="Tip" {...field} />
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

            <Button type="submit">Add More Vehicle</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
