"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";

// Define schema for form validation
const formSchema = z.object({
  uniqueId: z.string().min(1, { message: "Vehicle selection is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  surchargePrice: z.string().min(1, { message: "Surcharge is required" }),
});

const Surcharge = () => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: "",
      date: "",
      surchargePrice: "",
    },
  });

  const [vehicles, setVehicles] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(
          "http://localhost:8000/api/V1/supplier/dashboard"
        );
        console.log("User data:", data);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        removeToken();
      }
    };

    fetchUserData();
  }, []);

  // Fetch vehicle data once user is available
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.userId) return; // Wait for user data
  
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/V1/supplier/getCarDetails/${user.userId}`
        );
  
        if (!response.ok) throw new Error("Failed to fetch vehicles");
  
        const data = await response.json();
        console.log("Vehicle API Response:", data);
  
        // Extract `Car_Details` from each item in the array
        const vehicleList = data.map((item: any) => item.Car_Details);
  
        console.log("Processed Vehicles:", vehicleList);
        setVehicles(vehicleList);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVehicles();
  }, [user?.userId]);
    

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsSubmiting(true);
    const payload = {
      VehicleName: vehicles.find(v => v.uniqueId === data.uniqueId)?.VehicleBrand || "Unknown",
      Date: data.date,
      ExtraPrice: data.surchargePrice,
      uniqueId: data.uniqueId,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/V1/supplier/SurgeCharges",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast({
          title: "Surcharge Added",
          description: "Surcharge added successfully!",
        });
      } else {
        toast({
          title: "API Error",
          description: "Something went wrong, please try again.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error while submitting data",
        description: `API Error: ${error.response?.data || error.message}`,
      });
      console.error("API Error:", error.response?.data || error.message);
    }finally{
        setIsSubmiting(false);
        form.reset();
    }
  };
  

  return (
    <div className="flex justify-center items-center my-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Surcharge</CardTitle>
          <CardDescription>Select a vehicle and enter surcharge details</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle Selection */}
              <FormField
                control={form.control}
                name="uniqueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Vehicle</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.length === 0 ? (
                            <p className="text-red-500 text-center p-2">No vehicles found</p>
                          ) : (
                            vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.uniqueId} value={vehicle.uniqueId}>
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

              {/* Date Selection */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Date
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="date"
                        className=" border border-input rounded-sm  focus:ring-0 p-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Surcharge Input */}
              <FormField
                control={form.control}
                name="surchargePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surge Charge</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter surcharge" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button className="w-full" disabled={isSubmiting}>
                {isSubmiting?"Submiting":"Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Surcharge;
