"use client";
import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
const formSchema = z.object({
  rows: z.array(
    z.object({
      uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
      Currency: z.string().min(1, { message: "Currency is required" }),
      TransferInfo: z.string().optional(),
      SelectZone: z
        .string()
        .min(1, { message: "Transfer From is required" }),
      Price: z.string().min(1, { message: "Price is required" }),
      Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
      // Distance: z.string().min(1, { message: "Distance is required" }),
      //   Location: z.string().min(1, { message: "Location is required" }),
      NightTime: z.enum(["yes", "no"]).optional(),
      NightTime_Price: z.string().optional(),
    })
  ),
});


const VehicleTransfer = () => {
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [vehicles, setVehicles] = useState([]);
   const [SupplierId,setSupplierId] = useState();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [rows, setRows] = useState([
    {
      uniqueId: "",
      Currency: "Rs",
      TransferInfo: "",
      SelectZone: "",
      Extra_Price: "",
      Price: "",
      NightTime: "no",
      NightTime_Price: "",
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchWithAuth(
          `${API_BASE_URL}/dashboard`
        );
        setSupplierId(userData.userId);
        
        const vehicleResponse = await fetch(
          `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
          
        );
      

        const zoneResponse = await fetch(`${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`);
        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
        if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
        const vehicleData = await vehicleResponse.json();
        const zoneData = await zoneResponse.json();
        

        setVehicles(vehicleData);
        setZones(zoneData);
        // console.log(processedVehicles);
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
      rows: [
        {
          uniqueId: "",
          Currency: "Rs",
          TransferInfo: "",
          SelectZone: "",
          Extra_Price: "",
          Price: "",
          NightTime: "no",
          NightTime_Price: "",
        },
      ],
    },
  });
  const handleAddRow = () => {
    const newRow = {
      uniqueId: "",
      Currency: "Rs",
      TransferInfo: "",
      SelectZone: "",
      Price: "",
      Extra_Price: "",
      NightTime: "no",
      NightTime_Price: "",
      supplier_id: SupplierId
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
    console.log("Form Submitted:", data);
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/new_transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save Transfer");
      }
  
      toast({ title: "Success!", description: "Vehicle Transfer saved." });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message });
    }
    
  };

  const onError = (errors: any) => {
    console.log("Validation Errors:", errors);
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
      <CardHeader>
        <CardTitle>Vehicle Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6"> */}
          <form
            onSubmit={form.handleSubmit(handleSubmit, onError)}
            className="space-y-6"
          >
            <div>
              {rows.map((row, index) => {
                const nightTime = form.watch(`rows.${index}.NightTime`);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`rows.${index}.uniqueId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Vehicle</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
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
                                      key={vehicle.id}
                                      value={vehicle.id}
                                    >
                                      {vehicle.VehicleBrand} (
                                      {vehicle.VehicleModel})
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

                    {/* <FormField
                      control={form.control}
                      name={`rows.${index}.SelectZone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Zone</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Zone" />
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
                key={index}
                control={form.control}
                name={`rows.${index}.SelectZone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Zone</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone: any) => (
                            <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
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
                      name={`rows.${index}.Currency`}
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
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="ED">ED</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rows.${index}.TransferInfo`}
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
                      name={`rows.${index}.Price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <span className="bg-secondary px-2 py-1 rounded-sm">
                                {form.watch(`rows.${index}.Currency`) || "N/A"}
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
                                {form.watch(`rows.${index}.Currency`) || "N/A"}
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
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
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

              <Button type="button" onClick={handleAddRow} className="my-2">
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

export default VehicleTransfer;
