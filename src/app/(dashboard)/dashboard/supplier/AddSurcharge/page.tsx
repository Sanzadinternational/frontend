
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
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken, getToken } from "@/components/utils/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/DatePicker";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: "",
      surchargePrice: "",
      DateRange: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setSupplierId(userData.userId);

        const vehicleResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`);
        
        const processedVehicles = Array.isArray(vehicleResponse?.data || vehicleResponse) 
          ? (vehicleResponse?.data || vehicleResponse).map((vehicle: any) => ({
              id: vehicle?.id?.toString() || `unknown-${Math.random()}`,
              uniqueId: vehicle?.id?.toString() || `unknown-${Math.random()}`,
              VehicleBrand: vehicle?.VehicleBrand || "Unknown Brand",
              ServiceType: vehicle?.ServiceType || "Unknown Service",
            }))
          : [];
          
        setVehicles(processedVehicles);
        
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
        
        if (err.response?.status === 401 || err.message.includes("401")) {
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          });
          removeToken();
          router.push("/login");
          return;
        }
        
        toast({
          title: "Error",
          description: err.message || "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, router, toast]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (vehicles.length === 0) {
        throw new Error("No vehicles available");
      }

      const selectedVehicle = vehicles.find((v) => v.uniqueId === data.uniqueId);

      if (!selectedVehicle) {
        throw new Error("Invalid vehicle selection");
      }

      if (!data.DateRange?.from) {
        throw new Error("Start date is required");
      }

      const payload = {
        VehicleName: selectedVehicle.VehicleBrand,
        Date: {
          from: data.DateRange.from?.toISOString(),
          to: data.DateRange.to?.toISOString(),
        },
        ExtraPrice: data.surchargePrice,
        uniqueId: data.uniqueId,
        supplierId: supplierId,
      };

      const response = await fetchWithAuth(`${API_BASE_URL}/supplier/SurgeCharges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit surcharge");
      }

      toast({ 
        title: "Success", 
        description: "Surcharge added successfully!" 
      });
      form.reset();
      
    } catch (error: any) {
      console.error("Submission error:", error);
      
      if (error.response?.status === 401 || error.message.includes("401")) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        removeToken();
        router.push("/login");
        return;
      }
      
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit surcharge",
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
    return (
      <div className="flex justify-center items-center my-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-500 text-center">{error}</div>
            <Button 
              className="mt-4 w-full" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
              <FormField
                control={form.control}
                name="uniqueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Vehicle</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle">
                            {field.value
                              ? vehicles.find(v => v.uniqueId === field.value)?.VehicleBrand
                              : "Select a vehicle"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.uniqueId} value={vehicle.uniqueId}>
                            {vehicle.VehicleBrand} ({vehicle.ServiceType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control} 
                name="DateRange" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Date Range</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value} 
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                control={form.control} 
                name="surchargePrice" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surcharge Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter surcharge amount" 
                        {...field}
                        disabled={isSubmitting}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <Button 
                className="w-full" 
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
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
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken, getToken } from "@/components/utils/auth";
// import { Skeleton } from "@/components/ui/skeleton";
// import { DatePicker } from "@/components/DatePicker";
// import { useRouter } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Pencil, Trash2, Plus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";

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
//   const router = useRouter();
//   const [vehicles, setVehicles] = useState<any[]>([]);
//   const [surcharges, setSurcharges] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [supplierId, setSupplierId] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       uniqueId: "",
//       surchargePrice: "",
//       DateRange: null,
//     },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = getToken();
//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setSupplierId(userData.userId);

//         const [vehicleResponse, surchargeResponse] = await Promise.all([
//           fetchWithAuth(`${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`),
//           fetchWithAuth(`${API_BASE_URL}/supplier/GetSurgeCharges/${userData.userId}`),
//         ]);
        
//         const processedVehicles = Array.isArray(vehicleResponse?.data || vehicleResponse) 
//           ? (vehicleResponse?.data || vehicleResponse).map((vehicle: any) => ({
//               id: vehicle?.id?.toString() || `unknown-${Math.random()}`,
//               uniqueId: vehicle?.id?.toString() || `unknown-${Math.random()}`,
//               VehicleBrand: vehicle?.VehicleBrand || "Unknown Brand",
//               ServiceType: vehicle?.ServiceType || "Unknown Service",
//             }))
//           : [];
          
//         setVehicles(processedVehicles);
//         setSurcharges(surchargeResponse?.data || surchargeResponse || []);
        
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         setError(err.message || "Something went wrong");
        
//         if (err.response?.status === 401 || err.message.includes("401")) {
//           toast({
//             title: "Session Expired",
//             description: "Please login again",
//             variant: "destructive",
//           });
//           removeToken();
//           router.push("/login");
//           return;
//         }
        
//         toast({
//           title: "Error",
//           description: err.message || "Failed to fetch data",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [API_BASE_URL, router, toast, isDialogOpen]);

//   // Reset form when dialog opens for creation
//   useEffect(() => {
//     if (isDialogOpen && !editingId) {
//       form.reset({
//         uniqueId: "",
//         surchargePrice: "",
//         DateRange: null,
//       });
//     }
//   }, [isDialogOpen, editingId]);

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsSubmitting(true);

//     try {
//       const token = getToken();
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       if (vehicles.length === 0) {
//         throw new Error("No vehicles available");
//       }

//       const selectedVehicle = vehicles.find((v) => v.uniqueId === data.uniqueId);

//       if (!selectedVehicle) {
//         throw new Error("Invalid vehicle selection");
//       }

//       if (!data.DateRange?.from) {
//         throw new Error("Start date is required");
//       }

//       const payload = {
//         VehicleName: selectedVehicle.VehicleBrand,
//         Date: {
//           from: data.DateRange.from?.toISOString(),
//           to: data.DateRange.to?.toISOString(),
//         },
//         ExtraPrice: data.surchargePrice,
//         uniqueId: data.uniqueId,
//         supplierId: supplierId,
//       };

//       const url = editingId 
//         ? `${API_BASE_URL}/supplier/UpdateSurgeCharges/${editingId}`
//         : `${API_BASE_URL}/supplier/SurgeCharges`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to submit surcharge");
//       }

//       toast({ 
//         title: "Success", 
//         description: `Surcharge ${editingId ? "updated" : "added"} successfully!` 
//       });
      
//       setIsDialogOpen(false);
//       setEditingId(null);
//       form.reset();
      
//     } catch (error: any) {
//       console.error("Submission error:", error);
      
//       if (error.response?.status === 401 || error.message.includes("401")) {
//         toast({
//           title: "Session Expired",
//           description: "Please login again",
//           variant: "destructive",
//         });
//         removeToken();
//         router.push("/login");
//         return;
//       }
      
//       toast({
//         title: "Submission Failed",
//         description: error.message || "Failed to submit surcharge",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (surcharge: any) => {
//     setEditingId(surcharge.id);
//     form.reset({
//       uniqueId: surcharge.uniqueId,
//       surchargePrice: surcharge.ExtraPrice,
//       DateRange: {
//         from: new Date(surcharge.Date.from),
//         to: surcharge.Date.to ? new Date(surcharge.Date.to) : null,
//       },
//     });
//     setIsDialogOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/DeleteSurgeCharges/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete surcharge");
//       }

//       setSurcharges((prev) => prev.filter((item) => item.id !== id));
//       toast({
//         title: "Deleted",
//         description: "Surcharge deleted successfully",
//       });
//     } catch (error: any) {
//       console.error("Deletion error:", error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete surcharge",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center my-8">
//         <Card className="w-full max-w-lg">
//           <CardHeader>
//             <CardTitle>Error</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-red-500 text-center">{error}</div>
//             <Button 
//               className="mt-4 w-full" 
//               onClick={() => window.location.reload()}
//             >
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle>Surcharge Management</CardTitle>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button onClick={() => setEditingId(null)}>
//                 <Plus className="mr-2 h-4 w-4" /> Add Surcharge
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px]">
//               <DialogHeader>
//                 <DialogTitle>
//                   {editingId ? "Edit Surcharge" : "Add New Surcharge"}
//                 </DialogTitle>
//               </DialogHeader>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   <FormField
//                     control={form.control}
//                     name="uniqueId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Select Vehicle</FormLabel>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                           disabled={isSubmitting}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a vehicle">
//                                 {field.value
//                                   ? vehicles.find(v => v.uniqueId === field.value)?.VehicleBrand
//                                   : "Select a vehicle"}
//                               </SelectValue>
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {vehicles.map((vehicle) => (
//                               <SelectItem key={vehicle.uniqueId} value={vehicle.uniqueId}>
//                                 {vehicle.VehicleBrand} ({vehicle.ServiceType})
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField 
//                     control={form.control} 
//                     name="DateRange" 
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Select Date Range</FormLabel>
//                         <FormControl>
//                           <DatePicker 
//                             value={field.value} 
//                             onChange={field.onChange}
//                             disabled={isSubmitting}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} 
//                   />

//                   <FormField 
//                     control={form.control} 
//                     name="surchargePrice" 
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Surcharge Amount</FormLabel>
//                         <FormControl>
//                           <Input 
//                             placeholder="Enter surcharge amount" 
//                             {...field}
//                             disabled={isSubmitting}
//                             type="number"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} 
//                   />

//                   <div className="flex justify-end gap-4 pt-4">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsDialogOpen(false)}
//                       type="button"
//                     >
//                       Cancel
//                     </Button>
//                     <Button 
//                       type="submit"
//                       disabled={isSubmitting || !form.formState.isValid}
//                     >
//                       {isSubmitting ? "Submitting..." : editingId ? "Update" : "Submit"}
//                     </Button>
//                   </div>
//                 </form>
//               </Form>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           {surcharges.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No surcharges available</p>
//               <Button 
//                 onClick={() => setIsDialogOpen(true)}
//                 className="mt-4"
//               >
//                 <Plus className="mr-2 h-4 w-4" /> Add Your First Surcharge
//               </Button>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Vehicle</TableHead>
//                   <TableHead>Date Range</TableHead>
//                   <TableHead>Surcharge</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {surcharges.map((surcharge) => {
//                   const vehicle = vehicles.find(v => v.uniqueId === surcharge.uniqueId);
//                   const fromDate = new Date(surcharge.Date.from);
//                   const toDate = surcharge.Date.to ? new Date(surcharge.Date.to) : null;
                  
//                   return (
//                     <TableRow key={surcharge.id}>
//                       <TableCell className="font-medium">
//                         {vehicle?.VehicleBrand || "Unknown Vehicle"}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span>{fromDate.toLocaleDateString()}</span>
//                           {toDate && (
//                             <span className="text-sm text-muted-foreground">
//                               to {toDate.toLocaleDateString()}
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">${surcharge.ExtraPrice}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end space-x-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleEdit(surcharge)}
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDelete(surcharge.id)}
//                           >
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Surcharge;