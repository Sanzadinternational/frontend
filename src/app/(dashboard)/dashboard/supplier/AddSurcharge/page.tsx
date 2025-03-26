
// "use client";

// import * as z from "zod";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// import { Skeleton } from "@/components/ui/skeleton";
// import { DatePicker } from "@/components/DatePicker";

// // ✅ Improved Schema with Better Validation
// const formSchema = z.object({
//   uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
//   DateRange: z
//     .object({
//       from: z.date().nullable(),
//       to: z.date().nullable(),
//     })
//     .nullable()
//     .refine((val) => val?.from !== null, { message: "Start date is required" }),
//   surchargePrice: z.string().min(1, { message: "Surcharge is required" }),
// });

// const Surcharge = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { toast } = useToast();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       uniqueId: "",
//       surchargePrice: "",
//       DateRange: null,
//     },
//   });

//   // ✅ Fetch User & Vehicles in One Efficient Call
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         const vehicleResponse = await fetch(
//           `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
//         );
//         if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");

//         const vehicleData = await vehicleResponse.json();
//         const processedVehicles = vehicleData.map((item: any) => item.Car_Details);

//         setVehicles(processedVehicles);
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         setError(err.message || "Something went wrong");
//         removeToken();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ Improved Form Submission with Optimized Error Handling
// //   const onSubmit = async (data: z.infer<typeof formSchema>) => {
// //     setIsSubmitting(true);
    
// //     const selectedVehicle = vehicles.find((v) => v.uniqueId === data.uniqueId);
// //     if (!selectedVehicle) {
// //       toast({ title: "Error", description: "Invalid vehicle selection", variant: "destructive" });
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     const payload = {
// //       VehicleName: selectedVehicle.VehicleBrand || "Unknown",
// //       Date: data.DateRange,
// //       ExtraPrice: data.surchargePrice,
// //       uniqueId: data.uniqueId,
// //     };

// //     try {
// //       const response = await axios.post(`${API_BASE_URL}/supplier/SurgeCharges`, payload, {
// //         headers: { "Content-Type": "application/json" },
// //       });

// //       if (response.status === 200) {
// //         toast({ title: "Success", description: "Surcharge added successfully!" });
// //         form.reset();
// //       } else {
// //         throw new Error("Unexpected server response");
// //       }
// //     } catch (error: any) {
// //       toast({
// //         title: "Submission Failed",
// //         description: error.response?.data?.message || "Failed to submit surcharge",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
// const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsSubmitting(true);
  
//     console.log("Form Data:", data);
    
//     if (vehicles.length === 0) {
//       toast({ title: "Error", description: "No vehicles available", variant: "destructive" });
//       setIsSubmitting(false);
//       return;
//     }
  
//     const selectedVehicle = vehicles.find((v) => v.uniqueId === data.uniqueId);
    
//     if (!selectedVehicle) {
//       toast({ title: "Error", description: "Invalid vehicle selection", variant: "destructive" });
//       setIsSubmitting(false);
//       return;
//     }
  
//     const payload = {
//       VehicleName: selectedVehicle?.VehicleBrand || "Unknown",
//       Date: data.DateRange,
//       ExtraPrice: data.surchargePrice,
//       uniqueId: data.uniqueId,
//     };
  
//     try {
//       const response = await axios.post(`${API_BASE_URL}/supplier/SurgeCharges`, payload);
//       if (response.status === 200) {
//         toast({ title: "Success", description: "Surcharge added successfully!" });
//         form.reset();
//       }
//     } catch (error: any) {
//       toast({ title: "Submission Failed", description: error.response?.data?.message || "Failed to submit surcharge", variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center">
//         <Skeleton className="h-[300px] w-[250px] rounded-xl" />
//         <Skeleton className="h-4 w-[250px] mt-2" />
//         <Skeleton className="h-4 w-[200px]" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }

//   return (
//     <div className="flex justify-center items-center my-8">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle>Add Surcharge</CardTitle>
//           <CardDescription>Select a vehicle and enter surcharge details</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* ✅ Vehicle Selection */}
//               <FormField control={form.control} name="uniqueId" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Select Vehicle</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Vehicle" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {vehicles.length === 0 ? (
//                           <p className="text-red-500 text-center p-2">No vehicles found</p>
//                         ) : (
//                           vehicles.map((vehicle) => (
//                             <SelectItem key={vehicle.uniqueId} value={vehicle.uniqueId}>
//                               {vehicle.VehicleBrand} ({vehicle.VehicleModel})
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               {/* ✅ Date Selection */}
//               <FormField control={form.control} name="DateRange" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Select Date Range</FormLabel>
//                   <FormControl>
//                     <DatePicker value={field.value} onChange={field.onChange} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               {/* ✅ Surcharge Price */}
//               <FormField control={form.control} name="surchargePrice" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Surcharge Amount</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter surcharge amount" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               {/* ✅ Submit Button */}
//               <Button className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Surcharge;



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
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/DatePicker";

// ✅ Form Validation Schema
const formSchema = z.object({
  uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
  DateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .nullable()
    .refine((val) => val?.from !== null, { message: "Start date is required" }),
  surchargePrice: z.string().min(1, { message: "Surcharge is required" }),
});

const Surcharge = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: "",
      surchargePrice: "",
      DateRange: null,
    },
  });

  // ✅ Fetch User & Vehicles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        const vehicleResponse = await fetch(
          `${API_BASE_URL}/supplier/GetVehicleBrand`
        );

        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");

        const vehicleData = await vehicleResponse.json();
        console.log("Vehicle API Response:", vehicleData);

        // ✅ Process and validate vehicle data
        const processedVehicles = vehicleData.map((vehicle: any) => ({
            uniqueId: vehicle?.uniqueId || `unknown-${Math.random()}`,
            VehicleBrand: vehicle?.VehicleBrand || "Unknown Brand",
            ServiceType: vehicle?.ServiceType || "Unknown Servive",
          }));
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

  // ✅ Form Submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    if (vehicles.length === 0) {
      toast({ title: "Error", description: "No vehicles available", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.uniqueId === data.uniqueId);

    if (!selectedVehicle) {
      toast({ title: "Error", description: "Invalid vehicle selection", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      VehicleName: selectedVehicle.VehicleBrand || "Unknown",
      Date: data.DateRange,
      ExtraPrice: data.surchargePrice,
      uniqueId: data.uniqueId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/supplier/SurgeCharges`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast({ title: "Success", description: "Surcharge added successfully!" });
        form.reset();
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit surcharge",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Skeleton className="h-[300px] w-[250px] rounded-xl" />
        <Skeleton className="h-4 w-[250px] mt-2" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center my-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Surcharge</CardTitle>
          <CardDescription>Select a vehicle and enter surcharge details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* ✅ Vehicle Selection */}
              <FormField control={form.control} name="uniqueId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Vehicle</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.length === 0 ? (
                          <p className="text-red-500 text-center p-2">No vehicles found</p>
                        ) : (
                          vehicles.map((vehicle, index) => (
                            vehicle.uniqueId ? (
                                <SelectItem
                                key={vehicle.id}
                                value={vehicle.id}
                              >
                                {vehicle.VehicleBrand} (
                                {vehicle.ServiceType})
                              </SelectItem>
                            ) : (
                              <p key={index} className="text-red-500">Invalid Vehicle Data</p>
                            )
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ Date Selection */}
              <FormField control={form.control} name="DateRange" render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Date Range</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ Surcharge Price */}
              <FormField control={form.control} name="surchargePrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Surcharge Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter surcharge amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ Submit Button */}
              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Surcharge;

