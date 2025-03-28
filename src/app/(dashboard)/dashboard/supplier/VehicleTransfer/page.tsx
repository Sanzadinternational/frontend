
// "use client";
// import { useState, useEffect } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/hooks/use-toast";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken, getToken } from "@/components/utils/auth";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// // Define interfaces for better type safety
// interface Vehicle {
//   id: string;
//   VehicleBrand: string;
//   ServiceType: string;
// }

// interface Zone {
//   id: string;
//   name: string;
// }

// const formSchema = z.object({
//   rows: z.array(
//     z.object({
//       uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
//       Currency: z.string().min(1, { message: "Currency is required" }),
//       TransferInfo: z.string().optional(),
//       SelectZone: z.string().min(1, { message: "Transfer From is required" }),
//       Price: z.string().min(1, { message: "Price is required" }),
//       Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
//       NightTime: z.enum(["yes", "no"]).optional(),
//       NightTime_Price: z.string().optional(),
//     })
//   ),
// });

// // interface TransferData {
// //   id: string;
// //   // uniqueId: string;
// //   Currency: string;
// //   // TransferInfo: string;
// //   Transfer_info:string;
// //   // SelectZone: string;
// //   Zone_name:string;
// //   // Price: string;
// //   price: string;
// //   // Extra_Price: string;
// //   extra_price_per_mile:string;
// //   NightTime: string;
// //   NightTime_Price: string;
// //   // VehicleBrand: string;
// //   VehicleBrand:string;
// //   ServiceType: string;
// //   // ZoneName?: string;
// // }
// interface TransferData {
//   id: string;
//   uniqueId: string;
//   Currency: string;
//   TransferInfo: string;
//   SelectZone: string;
//   Price: string;
//   Extra_Price: string;
//   NightTime: string;
//   NightTime_Price: string;
//   VehicleBrand: string;
//   ServiceType: string;
//   ZoneName?: string;
// }

// const VehicleTransfer = () => {
//   const { toast } = useToast();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [supplierId, setSupplierId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [transfers, setTransfers] = useState<TransferData[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = getToken();
//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setSupplierId(userData.userId);

//         const [vehicleResponse, zoneResponse, transferResponse] = await Promise.all([
//           fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
//           fetchWithAuth(`${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`),
//           fetchWithAuth(`${API_BASE_URL}/supplier/getTransferById/${userData.userId}`),
//         ]);

//         // Check if responses are valid
//         if (!vehicleResponse || !zoneResponse || !transferResponse) {
//           throw new Error("Failed to fetch required data");
//         }

//         setVehicles(vehicleResponse?.data || vehicleResponse || []);
//         setZones(zoneResponse?.data || zoneResponse || []);
        
//         // Process transfer data to include vehicle and zone info
//         // const processedTransfers = (transferResponse?.data || transferResponse || []).map(transfer => {
//         //   const vehicle = (vehicleResponse?.data || vehicleResponse || []).find(v => v.id === transfer.uniqueId);
//         //   const zone = (zoneResponse?.data || zoneResponse || []).find(z => z.id === transfer.SelectZone);
//         //   return {
//         //     ...transfer,
//         //     VehicleBrand: vehicle?.VehicleBrand,
//         //     ServiceType: vehicle?.ServiceType,
//         //     ZoneName: zone?.name
//         //   };
//         // });
        
//         setTransfers(transferResponse);
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
//           window.location.href = "/login";
//           return;
//         }
        
//         toast({
//           title: "Error",
//           description: err.message || "Failed to load data",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [API_BASE_URL, toast]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       rows: [{
//         uniqueId: "",
//         Currency: "Rs",
//         TransferInfo: "",
//         SelectZone: "",
//         Price: "",
//         Extra_Price: "",
//         NightTime: "no",
//         NightTime_Price: "",
//       }]
//     },
//   });

//   const [rows, setRows] = useState(form.getValues().rows);

//   const handleAddRow = () => {
//     const newRow = {
//       uniqueId: "",
//       Currency: "Rs",
//       TransferInfo: "",
//       SelectZone: "",
//       Price: "",
//       Extra_Price: "",
//       NightTime: "no",
//       NightTime_Price: "",
//     };
//     setRows(prevRows => [...prevRows, newRow]);
//     form.setValue("rows", [...form.getValues("rows"), newRow]);
//   };

//   const handleDeleteRow = (index: number) => {
//     if (rows.length <= 1) {
//       toast({
//         title: "Error",
//         description: "You must have at least one row",
//         variant: "destructive",
//       });
//       return;
//     }
//     setRows(prevRows => prevRows.filter((_, i) => i !== index));
//     form.setValue(
//       "rows",
//       form.getValues("rows").filter((_, i) => i !== index)
//     );
//   };

//   // const handleEdit = (transfer: TransferData) => {
//   //   setEditingId(transfer.id);
//   //   setShowForm(true);
//   //   const editValues = {
//   //     rows: [{
//   //       uniqueId: transfer.uniqueId,
//   //       Currency: transfer.Currency,
//   //       TransferInfo: transfer.TransferInfo || "",
//   //       SelectZone: transfer.SelectZone,
//   //       Price: transfer.Price,
//   //       Extra_Price: transfer.Extra_Price,
//   //       NightTime: transfer.NightTime as "yes" | "no" || "no",
//   //       NightTime_Price: transfer.NightTime_Price || "",
//   //     }]
//   //   };
//   //   form.reset(editValues);
//   //   setRows(editValues.rows);
//   // };


//   const handleEdit = (transfer: TransferData) => {
//     setEditingId(transfer.id);
//     setShowForm(true);
    
//     const editValues = {
//       rows: [{
//         uniqueId: transfer.uniqueId || transfer.id, // Some APIs might use just 'id'
//         Currency: transfer.Currency || "Rs",
//         TransferInfo: transfer.TransferInfo || transfer.Transfer_info || "",
//         SelectZone: transfer.SelectZone || transfer.Zone_name || "",
//         Price: transfer.Price || transfer.price || "",
//         Extra_Price: transfer.Extra_Price || transfer.extra_price_per_mile || "",
//         NightTime: (transfer.NightTime === "yes" ? "yes" : "no") as "yes" | "no",
//         NightTime_Price: transfer.NightTime_Price || "",
//       }]
//     };
    
//     form.reset(editValues);
//     setRows(editValues.rows);
//   };
//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       const response = await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to delete transfer");
//       }

//       setTransfers(prev => prev.filter(transfer => transfer.id !== id));
//       toast({ title: "Deleted", description: "Transfer deleted successfully!" });
//     } catch (error: any) {
//       console.error("Deletion error:", error);
      
//       if (error.response?.status === 401) {
//         toast({
//           title: "Session Expired",
//           description: "Please login again",
//           variant: "destructive",
//         });
//         removeToken();
//         window.location.href = "/login";
//         return;
//       }
      
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete transfer",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       setLoading(true);
      
//       const payload = {
//         vehicleId: data.rows[0].uniqueId,
//         zoneId: data.rows[0].SelectZone,
//         currency: data.rows[0].Currency,
//         price: data.rows[0].Price,
//         extraPrice: data.rows[0].Extra_Price,
//         nightTime: data.rows[0].NightTime === "yes",
//         nightTimePrice: data.rows[0].NightTime_Price || "0",
//         transferInfo: data.rows[0].TransferInfo || "",
//         supplierId: supplierId
//       };

//       const url = editingId
//         ? `${API_BASE_URL}/supplier/updateTransfer/${editingId}`
//         : `${API_BASE_URL}/supplier/new_transfer`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Failed to ${editingId ? "update" : "create"} transfer`);
//       }

//       toast({
//         title: "Success!",
//         description: `Transfer ${editingId ? "updated" : "created"} successfully.`,
//       });

//       // Refresh data
//       const transferResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getTransferById/${supplierId}`);
//       const vehicleResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`);
//       const zoneResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getZonebySupplierId/${supplierId}`);

//       // const processedTransfers = (transferResponse?.data || transferResponse || []).map(transfer => {
//       //   const vehicle = (vehicleResponse?.data || vehicleResponse || []).find(v => v.id === transfer.uniqueId);
//       //   const zone = (zoneResponse?.data || zoneResponse || []).find(z => z.id === transfer.SelectZone);
//       //   return {
//       //     ...transfer,
//       //     VehicleBrand: vehicle?.VehicleBrand,
//       //     ServiceType: vehicle?.ServiceType,
//       //     ZoneName: zone?.name
//       //   };
//       // });
      
//       setTransfers(transferResponse);
//       // Reset form
//       form.reset({
//         rows: [{
//           uniqueId: "",
//           Currency: "Rs",
//           TransferInfo: "",
//           SelectZone: "",
//           Price: "",
//           Extra_Price: "",
//           NightTime: "no",
//           NightTime_Price: "",
//         }]
//       });
//       setRows([{
//         uniqueId: "",
//         Currency: "Rs",
//         TransferInfo: "",
//         SelectZone: "",
//         Price: "",
//         Extra_Price: "",
//         NightTime: "no",
//         NightTime_Price: "",
//       }]);
//       setEditingId(null);
//       setShowForm(false);
//     } catch (error: any) {
//       console.error("Submission error:", error);
      
//       if (error.response?.status === 401) {
//         toast({
//           title: "Session Expired",
//           description: "Please login again",
//           variant: "destructive",
//         });
//         removeToken();
//         window.location.href = "/login";
//         return;
//       }
      
//       toast({
//         title: "Error",
//         description: error.message || "Operation failed. Please check your data and try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onError = (errors: any) => {
//     console.log("Validation Errors:", errors);
//     toast({
//       title: "Validation Error",
//       description: "Please check all required fields",
//       variant: "destructive",
//     });
//   };

//   if (loading) {
//     return (
//       <DashboardContainer>
//       <div className="space-y-4">
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//       </div>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }

//   return (
//     <DashboardContainer scrollable>
//     <Card>
//       <CardHeader className="flex flex-row justify-between items-center">
//         <CardTitle>Vehicle Transfer</CardTitle>
//         {!showForm && (
//           <Button onClick={() => setShowForm(true)}>
//             Add New Transfer
//           </Button>
//         )}
//       </CardHeader>
//       <CardContent>
//         {showForm ? (
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-6">
//               <div>
//                 {rows.map((row, index) => {
//                   const nightTime = form.watch(`rows.${index}.NightTime`);
//                   return (
//                     <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
//                       {/* Vehicle Selection */}
//                       <FormField
//                 control={form.control}
//                 name={`rows.${index}.uniqueId`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Select Vehicle</FormLabel>
//                     <Select
//                       value={field.value}
//                       onValueChange={field.onChange}
                      
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                         <SelectValue placeholder="Select Vehicle" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                                 {vehicles.length === 0 ? (
//                                   <p className="text-red-500 text-center p-2">
//                                     No vehicles found
//                                   </p>
//                                 ) : (
//                                   vehicles.map((vehicle) => (
//                                     <SelectItem
//                                       key={vehicle.id}
//                                       value={vehicle.id}
//                                     >
//                                       {vehicle.VehicleBrand}
//                                     </SelectItem>
//                                   ))
//                                 )}
//                               </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//                       {/* Zone Selection */}
//                       <FormField
//                         control={form.control}
//                         name={`rows.${index}.SelectZone`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Select Zone</FormLabel>
//                             <FormControl>
//                               <Select
//                                 value={field.value}
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                   const newRows = [...rows];
//                                   newRows[index].SelectZone = value;
//                                   setRows(newRows);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Zone">
//                                     {field.value && zones.length > 0
//                                       ? zones.find(z => z.id === field.value)?.name || "Select Zone"
//                                       : "Select Zone"}
//                                   </SelectValue>
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {zones.map((zone) => (
//                                     <SelectItem key={zone.id} value={zone.id}>
//                                       {zone.name}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Currency Selection */}
//                       <FormField
//                         control={form.control}
//                         name={`rows.${index}.Currency`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Currency</FormLabel>
//                             <FormControl>
//                               <Select
//                                 value={field.value}
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                   const newRows = [...rows];
//                                   newRows[index].Currency = value;
//                                   setRows(newRows);
//                                 }}
//                               >
//                                 <SelectTrigger className="w-full">
//                                   <SelectValue placeholder="Select Currency" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="Rs">Rs</SelectItem>
//                                   <SelectItem value="USD">USD</SelectItem>
//                                   <SelectItem value="ED">ED</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Transfer Info */}
//                       <FormField
//                         control={form.control}
//                         name={`rows.${index}.TransferInfo`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Transfer Info</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Transfer Info"
//                                 {...field}
//                                 value={field.value || ""}
//                                 onChange={(e) => {
//                                   field.onChange(e);
//                                   const newRows = [...rows];
//                                   newRows[index].TransferInfo = e.target.value;
//                                   setRows(newRows);
//                                 }}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Price */}
//                       <FormField
//                         control={form.control}
//                         name={`rows.${index}.Price`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Price</FormLabel>
//                             <FormControl>
//                               <div className="flex">
//                                 <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                   {form.watch(`rows.${index}.Currency`) || "N/A"}
//                                 </span>
//                                 <Input
//                                   placeholder="Enter Price"
//                                   {...field}
//                                   value={field.value || ""}
//                                   type="number"
//                                   className="rounded-l-none"
//                                   onChange={(e) => {
//                                     field.onChange(e);
//                                     const newRows = [...rows];
//                                     newRows[index].Price = e.target.value;
//                                     setRows(newRows);
//                                   }}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Extra Price */}
//                       <FormField
//                         control={form.control}
//                         name={`rows.${index}.Extra_Price`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Extra Price Per Miles</FormLabel>
//                             <FormControl>
//                               <div className="flex">
//                                 <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                   {form.watch(`rows.${index}.Currency`) || "N/A"}
//                                 </span>
//                                 <Input
//                                   placeholder="Enter Price"
//                                   {...field}
//                                   value={field.value || ""}
//                                   type="number"
//                                   className="rounded-l-none"
//                                   onChange={(e) => {
//                                     field.onChange(e);
//                                     const newRows = [...rows];
//                                     newRows[index].Extra_Price = e.target.value;
//                                     setRows(newRows);
//                                   }}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Night Time */}
//                       <div className="space-y-2">
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.NightTime`}
//                           render={({ field }) => (
//                             <FormItem className="space-y-3">
//                               <FormLabel>Night Time Supplements (10PM-06AM)</FormLabel>
//                               <FormControl>
//                                 <RadioGroup
//                                   onValueChange={(value) => {
//                                     field.onChange(value);
//                                     const newRows = [...rows];
//                                     newRows[index].NightTime = value;
//                                     setRows(newRows);
//                                   }}
//                                   value={field.value || "no"}
//                                   className="flex items-center"
//                                 >
//                                   <FormItem className="flex items-center space-x-3 space-y-0">
//                                     <FormControl>
//                                       <RadioGroupItem value="yes" />
//                                     </FormControl>
//                                     <FormLabel className="font-normal">Yes</FormLabel>
//                                   </FormItem>
//                                   <FormItem className="flex items-center space-x-3 space-y-0">
//                                     <FormControl>
//                                       <RadioGroupItem value="no" />
//                                     </FormControl>
//                                     <FormLabel className="font-normal">No</FormLabel>
//                                   </FormItem>
//                                 </RadioGroup>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         {nightTime === "yes" && (
//                           <FormField
//                             control={form.control}
//                             name={`rows.${index}.NightTime_Price`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Night Time Price (per hour)</FormLabel>
//                                 <FormControl>
//                                   <div className="flex">
//                                     <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                       {form.watch(`rows.${index}.Currency`) || "N/A"}
//                                     </span>
//                                     <Input
//                                       placeholder="Night Time Price"
//                                       {...field}
//                                       value={field.value || ""}
//                                       type="number"
//                                       className="rounded-l-none"
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         const newRows = [...rows];
//                                         newRows[index].NightTime_Price = e.target.value;
//                                         setRows(newRows);
//                                       }}
//                                     />
//                                   </div>
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         )}
//                       </div>

//                       {/* Delete Row Button */}
//                       <div className="flex justify-end">
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           onClick={() => handleDeleteRow(index)}
//                           className="w-full md:w-auto"
//                         >
//                           Delete Row
//                         </Button>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 <Button type="button" onClick={handleAddRow} className="mt-4">
//                   Add Row
//                 </Button>
//               </div>

//               <div className="flex gap-2">
//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Processing..." : editingId ? "Update Transfer" : "Save Transfer"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditingId(null);
//                     form.reset({
//                       rows: [{
//                         uniqueId: "",
//                         Currency: "Rs",
//                         TransferInfo: "",
//                         SelectZone: "",
//                         Price: "",
//                         Extra_Price: "",
//                         NightTime: "no",
//                         NightTime_Price: "",
//                       }]
//                     });
//                     setRows([{
//                       uniqueId: "",
//                       Currency: "Rs",
//                       TransferInfo: "",
//                       SelectZone: "",
//                       Price: "",
//                       Extra_Price: "",
//                       NightTime: "no",
//                       NightTime_Price: "",
//                     }]);
//                   }}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         ) : (
//           <div className="space-y-4">
//             {transfers.length === 0 ? (
//               <div className="text-center py-4">
//                 {`No transfers found. Click "Add New Transfer" to create one.`}
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border-collapse border border-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Price</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Night Time</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Night Time Price</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Info</th>
//                       <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {transfers.map((transfer) => (
//                       <tr key={transfer.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer.VehicleBrand} ({transfer.ServiceType})
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.Zone_name}
                          
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.Currency}
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.price}
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.extra_price_per_mile}{" "}{transfer?.Currency}/mile
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.NightTime === "yes" ? (
//                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                               Yes
//                             </span>
//                           ) : (
//                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                               No
//                             </span>
//                           )}
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.NightTime_Price}{" "}{transfer?.Currency}/hr
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           {transfer?.Transfer_info}
//                         </td>
//                         <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                           <div className="flex space-x-2">
//                             <Button
//                               onClick={() => handleEdit(transfer)}
//                               variant="outline"
//                               size="sm"
//                               disabled={loading}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               onClick={() => handleDelete(transfer.id)}
//                               variant="destructive"
//                               size="sm"
//                               disabled={loading}
//                             >
//                               Delete
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//     </DashboardContainer>
//   );
// };

// export default VehicleTransfer;




// // "use client";
// // import { useState, useEffect } from "react";
// // import * as z from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { useToast } from "@/hooks/use-toast";
// // import { fetchWithAuth } from "@/components/utils/api";
// // import { removeToken, getToken } from "@/components/utils/auth";
// // import DashboardContainer from "@/components/layout/DashboardContainer";

// // interface Vehicle {
// //   id: string;
// //   VehicleBrand: string;
// //   ServiceType: string;
// // }

// // interface Zone {
// //   id: string;
// //   name: string;
// // }

// // const formSchema = z.object({
// //   rows: z.array(
// //     z.object({
// //       uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
// //       Currency: z.string().min(1, { message: "Currency is required" }),
// //       TransferInfo: z.string().optional(),
// //       SelectZone: z.string().min(1, { message: "Transfer From is required" }),
// //       Price: z.string().min(1, { message: "Price is required" }),
// //       Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
// //       NightTime: z.enum(["yes", "no"]).optional(),
// //       NightTime_Price: z.string().optional(),
// //     })
// //   ),
// // });

// // interface TransferData {
// //   id: string;
// //   uniqueId: string;
// //   Currency: string;
// //   TransferInfo: string;
// //   SelectZone: string;
// //   Price: string;
// //   Extra_Price: string;
// //   NightTime: string;
// //   NightTime_Price: string;
// //   VehicleBrand: string;
// //   ServiceType: string;
// //   ZoneName?: string;
// // }

// // const VehicleTransfer = () => {
// //   const { toast } = useToast();
// //   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// //   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
// //   const [supplierId, setSupplierId] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [formLoading, setFormLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [zones, setZones] = useState<Zone[]>([]);
// //   const [transfers, setTransfers] = useState<TransferData[]>([]);
// //   const [showForm, setShowForm] = useState(false);
// //   const [editingId, setEditingId] = useState<string | null>(null);

// //   // Fetch initial data
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const token = getToken();
// //         if (!token) {
// //           throw new Error("No authentication token found");
// //         }

// //         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
// //         setSupplierId(userData.userId);

// //         const [vehicleResponse, zoneResponse, transferResponse] = await Promise.all([
// //           fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
// //           fetchWithAuth(`${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`),
// //           fetchWithAuth(`${API_BASE_URL}/supplier/getTransferById/${userData.userId}`),
// //         ]);

// //         // Process responses
// //         const vehiclesData = Array.isArray(vehicleResponse?.data) 
// //           ? vehicleResponse.data 
// //           : Array.isArray(vehicleResponse) 
// //             ? vehicleResponse 
// //             : [];
        
// //         const zonesData = Array.isArray(zoneResponse?.data) 
// //           ? zoneResponse.data 
// //           : Array.isArray(zoneResponse) 
// //             ? zoneResponse 
// //             : [];
        
// //         const transfersData = Array.isArray(transferResponse?.data) 
// //           ? transferResponse.data 
// //           : Array.isArray(transferResponse) 
// //             ? transferResponse 
// //             : [];

// //         setVehicles(vehiclesData);
// //         setZones(zonesData);

// //         // Process transfers to include vehicle and zone info
// //         const processedTransfers = transfersData.map(transfer => {
// //           const vehicle = vehiclesData.find(v => v.id === transfer.uniqueId || v.id === transfer.id);
// //           const zone = zonesData.find(z => z.id === transfer.SelectZone);
          
// //           return {
// //             ...transfer,
// //             uniqueId: String(transfer.uniqueId || transfer.id),
// //             SelectZone: String(transfer.SelectZone),
// //             VehicleBrand: vehicle?.VehicleBrand || "",
// //             ServiceType: vehicle?.ServiceType || "",
// //             ZoneName: zone?.name || ""
// //           };
// //         });

// //         setTransfers(processedTransfers);
// //       } catch (err: any) {
// //         console.error("Error fetching data:", err);
// //         setError(err.message || "Something went wrong");
        
// //         if (err.response?.status === 401 || err.message.includes("401")) {
// //           toast({
// //             title: "Session Expired",
// //             description: "Please login again",
// //             variant: "destructive",
// //           });
// //           removeToken();
// //           window.location.href = "/login";
// //           return;
// //         }
        
// //         toast({
// //           title: "Error",
// //           description: err.message || "Failed to load data",
// //           variant: "destructive",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [API_BASE_URL, toast]);

// //   const form = useForm<z.infer<typeof formSchema>>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       rows: [{
// //         uniqueId: "",
// //         Currency: "Rs",
// //         TransferInfo: "",
// //         SelectZone: "",
// //         Price: "",
// //         Extra_Price: "",
// //         NightTime: "no",
// //         NightTime_Price: "",
// //       }]
// //     },
// //   });

// //   const [rows, setRows] = useState(form.getValues().rows);

// //   const handleAddRow = () => {
// //     const newRow = {
// //       uniqueId: "",
// //       Currency: "Rs",
// //       TransferInfo: "",
// //       SelectZone: "",
// //       Price: "",
// //       Extra_Price: "",
// //       NightTime: "no",
// //       NightTime_Price: "",
// //     };
// //     setRows(prevRows => [...prevRows, newRow]);
// //     form.setValue("rows", [...form.getValues("rows"), newRow]);
// //   };

// //   const handleDeleteRow = (index: number) => {
// //     if (rows.length <= 1) {
// //       toast({
// //         title: "Error",
// //         description: "You must have at least one row",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     setRows(prevRows => prevRows.filter((_, i) => i !== index));
// //     form.setValue(
// //       "rows",
// //       form.getValues("rows").filter((_, i) => i !== index)
// //     );
// //   };

// //   const handleEdit = (transfer: TransferData) => {
// //     console.log("Editing transfer:", transfer); // Debug log
// //     setEditingId(transfer.id);
// //     setShowForm(true);
    
// //     const editValues = {
// //       rows: [{
// //         uniqueId: String(transfer.uniqueId),
// //         Currency: transfer.Currency || "Rs",
// //         TransferInfo: transfer.TransferInfo || "",
// //         SelectZone: String(transfer.SelectZone),
// //         Price: transfer.Price || "",
// //         Extra_Price: transfer.Extra_Price || "",
// //         NightTime: transfer.NightTime === "yes" ? "yes" : "no",
// //         NightTime_Price: transfer.NightTime_Price || "",
// //       }]
// //     };
    
// //     console.log("Edit values being set:", editValues); // Debug log
// //     form.reset(editValues);
// //     setRows(editValues.rows);
// //   };

// //   const handleDelete = async (id: string) => {
// //     try {
// //       setLoading(true);
// //       const response = await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
// //         method: "DELETE",
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}));
// //         throw new Error(errorData.message || "Failed to delete transfer");
// //       }

// //       setTransfers(prev => prev.filter(transfer => transfer.id !== id));
// //       toast({ title: "Deleted", description: "Transfer deleted successfully!" });
// //     } catch (error: any) {
// //       console.error("Deletion error:", error);
      
// //       if (error.response?.status === 401) {
// //         toast({
// //           title: "Session Expired",
// //           description: "Please login again",
// //           variant: "destructive",
// //         });
// //         removeToken();
// //         window.location.href = "/login";
// //         return;
// //       }
      
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to delete transfer",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
// //     try {
// //       setFormLoading(true);
      
// //       const payload = {
// //         vehicleId: data.rows[0].uniqueId,
// //         zoneId: data.rows[0].SelectZone,
// //         currency: data.rows[0].Currency,
// //         price: data.rows[0].Price,
// //         extraPrice: data.rows[0].Extra_Price,
// //         nightTime: data.rows[0].NightTime === "yes",
// //         nightTimePrice: data.rows[0].NightTime_Price || "0",
// //         transferInfo: data.rows[0].TransferInfo || "",
// //         supplierId: supplierId
// //       };

// //       const url = editingId
// //         ? `${API_BASE_URL}/supplier/updateTransfer/${editingId}`
// //         : `${API_BASE_URL}/supplier/new_transfer`;

// //       const method = editingId ? "PUT" : "POST";

// //       const response = await fetchWithAuth(url, {
// //         method,
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}));
// //         throw new Error(errorData.message || `Failed to ${editingId ? "update" : "create"} transfer`);
// //       }

// //       toast({
// //         title: "Success!",
// //         description: `Transfer ${editingId ? "updated" : "created"} successfully.`,
// //       });

// //       // Refresh data
// //       const transferResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getTransferById/${supplierId}`);
// //       const vehicleResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`);
// //       const zoneResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getZonebySupplierId/${supplierId}`);

// //       const processedTransfers = (Array.isArray(transferResponse?.data) ? transferResponse.data : Array.isArray(transferResponse) ? transferResponse : []).map(transfer => {
// //         const vehicle = (Array.isArray(vehicleResponse?.data) ? vehicleResponse.data : Array.isArray(vehicleResponse) ? vehicleResponse : []).find(v => v.id === transfer.uniqueId || v.id === transfer.id);
// //         const zone = (Array.isArray(zoneResponse?.data) ? zoneResponse.data : Array.isArray(zoneResponse) ? zoneResponse : []).find(z => z.id === transfer.SelectZone);
// //         return {
// //           ...transfer,
// //           uniqueId: String(transfer.uniqueId || transfer.id),
// //           SelectZone: String(transfer.SelectZone),
// //           VehicleBrand: vehicle?.VehicleBrand || "",
// //           ServiceType: vehicle?.ServiceType || "",
// //           ZoneName: zone?.name || ""
// //         };
// //       });
      
// //       setTransfers(processedTransfers);
      
// //       // Reset form
// //       form.reset({
// //         rows: [{
// //           uniqueId: "",
// //           Currency: "Rs",
// //           TransferInfo: "",
// //           SelectZone: "",
// //           Price: "",
// //           Extra_Price: "",
// //           NightTime: "no",
// //           NightTime_Price: "",
// //         }]
// //       });
// //       setRows([{
// //         uniqueId: "",
// //         Currency: "Rs",
// //         TransferInfo: "",
// //         SelectZone: "",
// //         Price: "",
// //         Extra_Price: "",
// //         NightTime: "no",
// //         NightTime_Price: "",
// //       }]);
// //       setEditingId(null);
// //       setShowForm(false);
// //     } catch (error: any) {
// //       console.error("Submission error:", error);
      
// //       if (error.response?.status === 401) {
// //         toast({
// //           title: "Session Expired",
// //           description: "Please login again",
// //           variant: "destructive",
// //         });
// //         removeToken();
// //         window.location.href = "/login";
// //         return;
// //       }
      
// //       toast({
// //         title: "Error",
// //         description: error.message || "Operation failed. Please check your data and try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setFormLoading(false);
// //     }
// //   };

// //   const onError = (errors: any) => {
// //     console.log("Validation Errors:", errors);
// //     toast({
// //       title: "Validation Error",
// //       description: "Please check all required fields",
// //       variant: "destructive",
// //     });
// //   };

// //   if (loading) {
// //     return (
// //       <DashboardContainer>
// //         <div className="space-y-4">
// //           <Skeleton className="h-32 w-full" />
// //           <Skeleton className="h-32 w-full" />
// //           <Skeleton className="h-32 w-full" />
// //         </div>
// //       </DashboardContainer>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <DashboardContainer>
// //         <div className="text-red-500 text-center">Error: {error}</div>
// //       </DashboardContainer>
// //     );
// //   }

// //   return (
// //     <DashboardContainer scrollable>
// //       <Card>
// //         <CardHeader className="flex flex-row justify-between items-center">
// //           <CardTitle>Vehicle Transfer</CardTitle>
// //           {!showForm && (
// //             <Button onClick={() => setShowForm(true)}>
// //               Add New Transfer
// //             </Button>
// //           )}
// //         </CardHeader>
// //         <CardContent>
// //           {showForm ? (
// //             <Form {...form}>
// //               <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-6">
// //                 <div>
// //                   {rows.map((row, index) => {
// //                     const nightTime = form.watch(`rows.${index}.NightTime`);
// //                     return (
// //                       <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
// //                         {/* Vehicle Selection */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.uniqueId`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Select Vehicle</FormLabel>
// //                               <FormControl>
// //                                 <Select
// //                                   value={field.value}
// //                                   onValueChange={(value) => {
// //                                     field.onChange(value);
// //                                     const newRows = [...rows];
// //                                     newRows[index].uniqueId = value;
// //                                     setRows(newRows);
// //                                   }}
// //                                 >
// //                                   <SelectTrigger className="w-full">
// //                                     <SelectValue placeholder="Select Vehicle">
// //                                       {field.value && vehicles.length > 0
// //                                         ? (vehicles.find(v => v.id === field.value)?.VehicleBrand || "Select Vehicle") + 
// //                                           (vehicles.find(v => v.id === field.value)?.ServiceType 
// //                                             ? ` (${vehicles.find(v => v.id === field.value)?.ServiceType})` 
// //                                             : "")
// //                                         : "Select Vehicle"}
// //                                     </SelectValue>
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     {vehicles.length === 0 ? (
// //                                       <p className="text-red-500 text-center p-2">No vehicles found</p>
// //                                     ) : (
// //                                       vehicles.map((vehicle) => (
// //                                         <SelectItem key={vehicle.id} value={vehicle.id}>
// //                                           {vehicle.VehicleBrand} ({vehicle.ServiceType})
// //                                         </SelectItem>
// //                                       ))
// //                                     )}
// //                                   </SelectContent>
// //                                 </Select>
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Zone Selection */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.SelectZone`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Select Zone</FormLabel>
// //                               <FormControl>
// //                                 <Select
// //                                   value={field.value}
// //                                   onValueChange={(value) => {
// //                                     field.onChange(value);
// //                                     const newRows = [...rows];
// //                                     newRows[index].SelectZone = value;
// //                                     setRows(newRows);
// //                                   }}
// //                                 >
// //                                   <SelectTrigger>
// //                                     <SelectValue placeholder="Select Zone">
// //                                       {field.value && zones.length > 0
// //                                         ? zones.find(z => z.id === field.value)?.name || "Select Zone"
// //                                         : "Select Zone"}
// //                                     </SelectValue>
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     {zones.map((zone) => (
// //                                       <SelectItem key={zone.id} value={zone.id}>
// //                                         {zone.name}
// //                                       </SelectItem>
// //                                     ))}
// //                                   </SelectContent>
// //                                 </Select>
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Currency Selection */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.Currency`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Currency</FormLabel>
// //                               <FormControl>
// //                                 <Select
// //                                   value={field.value}
// //                                   onValueChange={(value) => {
// //                                     field.onChange(value);
// //                                     const newRows = [...rows];
// //                                     newRows[index].Currency = value;
// //                                     setRows(newRows);
// //                                   }}
// //                                 >
// //                                   <SelectTrigger className="w-full">
// //                                     <SelectValue placeholder="Select Currency" />
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     <SelectItem value="Rs">Rs</SelectItem>
// //                                     <SelectItem value="USD">USD</SelectItem>
// //                                     <SelectItem value="ED">ED</SelectItem>
// //                                   </SelectContent>
// //                                 </Select>
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Transfer Info */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.TransferInfo`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Transfer Info</FormLabel>
// //                               <FormControl>
// //                                 <Input
// //                                   placeholder="Transfer Info"
// //                                   {...field}
// //                                   value={field.value || ""}
// //                                   onChange={(e) => {
// //                                     field.onChange(e);
// //                                     const newRows = [...rows];
// //                                     newRows[index].TransferInfo = e.target.value;
// //                                     setRows(newRows);
// //                                   }}
// //                                 />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Price */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.Price`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Price</FormLabel>
// //                               <FormControl>
// //                                 <div className="flex">
// //                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
// //                                     {form.watch(`rows.${index}.Currency`) || "N/A"}
// //                                   </span>
// //                                   <Input
// //                                     placeholder="Enter Price"
// //                                     {...field}
// //                                     value={field.value || ""}
// //                                     type="number"
// //                                     className="rounded-l-none"
// //                                     onChange={(e) => {
// //                                       field.onChange(e);
// //                                       const newRows = [...rows];
// //                                       newRows[index].Price = e.target.value;
// //                                       setRows(newRows);
// //                                     }}
// //                                   />
// //                                 </div>
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Extra Price */}
// //                         <FormField
// //                           control={form.control}
// //                           name={`rows.${index}.Extra_Price`}
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Extra Price Per Miles</FormLabel>
// //                               <FormControl>
// //                                 <div className="flex">
// //                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
// //                                     {form.watch(`rows.${index}.Currency`) || "N/A"}
// //                                   </span>
// //                                   <Input
// //                                     placeholder="Enter Price"
// //                                     {...field}
// //                                     value={field.value || ""}
// //                                     type="number"
// //                                     className="rounded-l-none"
// //                                     onChange={(e) => {
// //                                       field.onChange(e);
// //                                       const newRows = [...rows];
// //                                       newRows[index].Extra_Price = e.target.value;
// //                                       setRows(newRows);
// //                                     }}
// //                                   />
// //                                 </div>
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />

// //                         {/* Night Time */}
// //                         <div className="space-y-2">
// //                           <FormField
// //                             control={form.control}
// //                             name={`rows.${index}.NightTime`}
// //                             render={({ field }) => (
// //                               <FormItem className="space-y-3">
// //                                 <FormLabel>Night Time Supplements (10PM-06AM)</FormLabel>
// //                                 <FormControl>
// //                                   <RadioGroup
// //                                     onValueChange={(value) => {
// //                                       field.onChange(value);
// //                                       const newRows = [...rows];
// //                                       newRows[index].NightTime = value;
// //                                       setRows(newRows);
// //                                     }}
// //                                     value={field.value || "no"}
// //                                     className="flex items-center"
// //                                   >
// //                                     <FormItem className="flex items-center space-x-3 space-y-0">
// //                                       <FormControl>
// //                                         <RadioGroupItem value="yes" />
// //                                       </FormControl>
// //                                       <FormLabel className="font-normal">Yes</FormLabel>
// //                                     </FormItem>
// //                                     <FormItem className="flex items-center space-x-3 space-y-0">
// //                                       <FormControl>
// //                                         <RadioGroupItem value="no" />
// //                                       </FormControl>
// //                                       <FormLabel className="font-normal">No</FormLabel>
// //                                     </FormItem>
// //                                   </RadioGroup>
// //                                 </FormControl>
// //                                 <FormMessage />
// //                               </FormItem>
// //                             )}
// //                           />
// //                           {nightTime === "yes" && (
// //                             <FormField
// //                               control={form.control}
// //                               name={`rows.${index}.NightTime_Price`}
// //                               render={({ field }) => (
// //                                 <FormItem>
// //                                   <FormLabel>Night Time Price (per hour)</FormLabel>
// //                                   <FormControl>
// //                                     <div className="flex">
// //                                       <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
// //                                         {form.watch(`rows.${index}.Currency`) || "N/A"}
// //                                       </span>
// //                                       <Input
// //                                         placeholder="Night Time Price"
// //                                         {...field}
// //                                         value={field.value || ""}
// //                                         type="number"
// //                                         className="rounded-l-none"
// //                                         onChange={(e) => {
// //                                           field.onChange(e);
// //                                           const newRows = [...rows];
// //                                           newRows[index].NightTime_Price = e.target.value;
// //                                           setRows(newRows);
// //                                         }}
// //                                       />
// //                                     </div>
// //                                   </FormControl>
// //                                   <FormMessage />
// //                                 </FormItem>
// //                               )}
// //                             />
// //                           )}
// //                         </div>

// //                         {/* Delete Row Button */}
// //                         <div className="flex justify-end">
// //                           <Button
// //                             type="button"
// //                             variant="destructive"
// //                             onClick={() => handleDeleteRow(index)}
// //                             className="w-full md:w-auto"
// //                           >
// //                             Delete Row
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     );
// //                   })}

// //                   <Button type="button" onClick={handleAddRow} className="mt-4">
// //                     Add Row
// //                   </Button>
// //                 </div>

// //                 <div className="flex gap-2">
// //                   <Button type="submit" disabled={formLoading}>
// //                     {formLoading ? "Processing..." : editingId ? "Update Transfer" : "Save Transfer"}
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     onClick={() => {
// //                       setShowForm(false);
// //                       setEditingId(null);
// //                       form.reset({
// //                         rows: [{
// //                           uniqueId: "",
// //                           Currency: "Rs",
// //                           TransferInfo: "",
// //                           SelectZone: "",
// //                           Price: "",
// //                           Extra_Price: "",
// //                           NightTime: "no",
// //                           NightTime_Price: "",
// //                         }]
// //                       });
// //                       setRows([{
// //                         uniqueId: "",
// //                         Currency: "Rs",
// //                         TransferInfo: "",
// //                         SelectZone: "",
// //                         Price: "",
// //                         Extra_Price: "",
// //                         NightTime: "no",
// //                         NightTime_Price: "",
// //                       }]);
// //                     }}
// //                     disabled={formLoading}
// //                   >
// //                     Cancel
// //                   </Button>
// //                 </div>
// //               </form>
// //             </Form>
// //           ) : (
// //             <div className="space-y-4">
// //               {transfers.length === 0 ? (
// //                 <div className="text-center py-4">
// //                   {`No transfers found. Click "Add New Transfer" to create one.`}
// //                 </div>
// //               ) : (
// //                 <div className="overflow-x-auto">
// //                   <table className="min-w-full border-collapse border border-gray-200">
// //                     <thead className="bg-gray-50">
// //                       <tr>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Price</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Night Time</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Night Time Price</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Info</th>
// //                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                       {transfers.map((transfer) => (
// //                         <tr key={transfer.id} className="hover:bg-gray-50">
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer.VehicleBrand} ({transfer.ServiceType})
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.ZoneName}
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.Currency}
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.Price}
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.Extra_Price} {transfer?.Currency}/mile
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.NightTime === "yes" ? (
// //                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
// //                                 Yes
// //                               </span>
// //                             ) : (
// //                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
// //                                 No
// //                               </span>
// //                             )}
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.NightTime_Price} {transfer?.Currency}/hr
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             {transfer?.TransferInfo}
// //                           </td>
// //                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
// //                             <div className="flex space-x-2">
// //                               <Button
// //                                 onClick={() => handleEdit(transfer)}
// //                                 variant="outline"
// //                                 size="sm"
// //                                 disabled={loading || !vehicles.length || !zones.length}
// //                               >
// //                                 Edit
// //                               </Button>
// //                               <Button
// //                                 onClick={() => handleDelete(transfer.id)}
// //                                 variant="destructive"
// //                                 size="sm"
// //                                 disabled={loading}
// //                               >
// //                                 Delete
// //                               </Button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </DashboardContainer>
// //   );
// // };

// // export default VehicleTransfer;


// "use client";
// import { useState, useEffect } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Skeleton } from "@/components/ui/skeleton";
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
// import { getToken, removeToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";

// const transferSchema = z.object({
//   id: z.string().optional(),
//   uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
//   Currency: z.string().min(1, { message: "Currency is required" }),
//   TransferInfo: z.string().optional(),
//   SelectZone: z.string().min(1, { message: "Transfer From is required" }),
//   Price: z.string().min(1, { message: "Price is required" }),
//   Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
//   NightTime: z.enum(["yes", "no"]).optional(),
//   NightTime_Price: z.string().optional(),
// });

// const VehicleTransfer = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const router = useRouter();
//   const [vehicles, setVehicles] = useState([]);
//   const [transfers, setTransfers] = useState([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [zones, setZones] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentTransfer, setCurrentTransfer] = useState<any>(null);
// const {toast} = useToast();
//   // Fetch initial data
//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        
//         const [vehicleResponse, zoneResponse, transfersResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${API_BASE_URL}/supplier/getTransferById/${userData.userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
//         if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
//         if (!transfersResponse.ok) throw new Error("Failed to fetch transfers");

//         const [vehicleData, zoneData, transfersData] = await Promise.all([
//           vehicleResponse.json(),
//           zoneResponse.json(),
//           transfersResponse.json()
//         ]);

//         setVehicles(vehicleData);
//         setZones(zoneData);
//         setTransfers(transfersData);
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         setError(err.message || "Something went wrong");
//         if (err.response?.status === 401) {
//           removeToken();
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const form = useForm<z.infer<typeof transferSchema>>({
//     resolver: zodResolver(transferSchema),
//     defaultValues: {
//       uniqueId: "",
//       Currency: "Rs",
//       TransferInfo: "",
//       SelectZone: "",
//       Extra_Price: "",
//       Price: "",
//       NightTime: "no",
//       NightTime_Price: "",
//     },
//   });

//   useEffect(() => {
//     if (isDialogOpen) {
//       if (currentTransfer) {
//         form.reset(currentTransfer);
//       } else {
//         form.reset();
//       }
//     }
//   }, [isDialogOpen, currentTransfer]);

//   const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//     const token = getToken();
//     if (!token) {
//       router.push("/login");
//       throw new Error("No authentication token found");
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.status === 401) {
//       removeToken();
//       router.push("/login");
//       throw new Error("Session expired. Please login again.");
//     }

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response.json();
//   };

//   const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
//     try {
//       const token = getToken();
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       const url = data.id 
//         ? `${API_BASE_URL}/supplier/updateTransfer/${data.id}`
//         : `${API_BASE_URL}/supplier/new_transfer`;
      
//       const method = data.id ? "PUT" : "POST";
      
//       await fetchWithAuth(url, {
//         method,
//         body: JSON.stringify({
//           ...data,
//           supplierId: userData.userId
//         }),
//       });

//       // Refresh transfers after successful save
//       const transfersResponse = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferById/${userData.userId}`
//       );
//       setTransfers(transfersResponse);
      
//       toast({
//         title: "Success",
//         description: data.id ? "Transfer updated successfully" : "Transfer created successfully",
//       });

//       setIsDialogOpen(false);
//       setCurrentTransfer(null);
//     } catch (err: any) {
//       console.error("Error saving transfer:", err);
//       toast({
//         title: "Error",
//         description: err.message || "Failed to save transfer",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
//         method: "DELETE",
//       });

//       // Refresh transfers after successful delete
//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       const transfersResponse = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferById/${userData.userId}`
//       );
//       setTransfers(transfersResponse);

//       toast({
//         title: "Success",
//         description: "Transfer deleted successfully",
//       });
//     } catch (err: any) {
//       console.error("Error deleting transfer:", err);
//       toast({
//         title: "Error",
//         description: err.message || "Failed to delete transfer",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = (transfer: any) => {
//     setCurrentTransfer(transfer);
//     setIsDialogOpen(true);
//   };

//   const handleCreate = () => {
//     setCurrentTransfer(null);
//     setIsDialogOpen(true);
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
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row justify-between items-center">
//         <CardTitle>Vehicle Transfers</CardTitle>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={handleCreate}>
//               <Plus className="mr-2 h-4 w-4" /> Create Transfer
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[800px]">
//             <DialogHeader>
//               <DialogTitle>
//                 {currentTransfer ? "Edit Transfer" : "Create New Transfer"}
//               </DialogTitle>
//             </DialogHeader>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="uniqueId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Select Vehicle</FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select Vehicle" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {vehicles.length === 0 ? (
//                                 <p className="text-red-500 text-center p-2">
//                                   No vehicles found
//                                 </p>
//                               ) : (
//                                 vehicles.map((vehicle: any) => (
//                                   <SelectItem
//                                     key={vehicle.id}
//                                     value={vehicle.id}
//                                   >
//                                     {vehicle.VehicleBrand} ({vehicle.VehicleModel})
//                                   </SelectItem>
//                                 ))
//                               )}
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="SelectZone"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Select Zone</FormLabel>
//                         <FormControl>
//                           <Select onValueChange={field.onChange} value={field.value || ""}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select Zone" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {zones.map((zone: any) => (
//                                 <SelectItem key={zone.id} value={zone.name}>{zone.name}</SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="Currency"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Currency</FormLabel>
//                         <FormControl>
//                           <Select
//                             {...field}
//                             value={`${field.value}`}
//                             onValueChange={(value) => field.onChange(value)}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select Currency" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Rs">Rs</SelectItem>
//                               <SelectItem value="USD">USD</SelectItem>
//                               <SelectItem value="ED">ED</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="TransferInfo"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Transfer Info</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Transfer Info"
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="Price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price</FormLabel>
//                         <FormControl>
//                           <div className="flex">
//                             <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                               {form.watch("Currency") || "N/A"}
//                             </span>
//                             <Input
//                               placeholder="Enter Price"
//                               {...field}
//                               value={field.value || ""}
//                               type="number"
//                               className="rounded-l-none"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="Extra_Price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Extra Price Per Miles</FormLabel>
//                         <FormControl>
//                           <div className="flex">
//                             <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                               {form.watch("Currency") || "N/A"}
//                             </span>
//                             <Input
//                               placeholder="Enter Price"
//                               {...field}
//                               value={field.value || ""}
//                               type="number"
//                               className="rounded-l-none"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="md:col-span-2">
//                     <FormField
//                       control={form.control}
//                       name="NightTime"
//                       render={({ field }) => (
//                         <FormItem className="space-y-3">
//                           <FormLabel>
//                             Night Time Supplements (10PM-06AM)
//                           </FormLabel>
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={field.onChange}
//                               value={field.value || "no"}
//                               className="flex items-center"
//                             >
//                               <FormItem className="flex items-center space-x-3 space-y-0">
//                                 <FormControl>
//                                   <RadioGroupItem value="yes" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   Yes
//                                 </FormLabel>
//                               </FormItem>
//                               <FormItem className="flex items-center space-x-3 space-y-0">
//                                 <FormControl>
//                                   <RadioGroupItem value="no" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   No
//                                 </FormLabel>
//                               </FormItem>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     {form.watch("NightTime") === "yes" && (
//                       <FormField
//                         control={form.control}
//                         name="NightTime_Price"
//                         render={({ field }) => (
//                           <FormItem className="mt-4">
//                             <FormLabel>Night Time Price (per hour)</FormLabel>
//                             <FormControl>
//                               <div className="flex">
//                                 <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                   {form.watch("Currency") || "N/A"}
//                                 </span>
//                                 <Input
//                                   placeholder="Night Time Price"
//                                   {...field}
//                                   value={field.value || ""}
//                                   type="number"
//                                   className="rounded-l-none"
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setIsDialogOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit">
//                     {currentTransfer ? "Update" : "Create"} Transfer
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </CardHeader>
//       <CardContent>
//         {transfers.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No transfers found</p>
//             <Button onClick={handleCreate} className="mt-4">
//               <Plus className="mr-2 h-4 w-4" /> Create Your First Transfer
//             </Button>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Vehicle</TableHead>
//                 <TableHead>Zone</TableHead>
//                 <TableHead>Transfer Info</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Extra Price</TableHead>
//                 <TableHead>Night Time</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {transfers.map((transfer: any) => {
//                 const vehicle = vehicles.find((v: any) => v.id === transfer.uniqueId);
//                 const zone = zones.find((z: any) => z.name === transfer.SelectZone);
                
//                 return (
//                   <TableRow key={transfer.id}>
//                     <TableCell>
//                       {vehicle ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})` : "Unknown Vehicle"}
//                     </TableCell>
//                     <TableCell>{zone ? zone.name : transfer.SelectZone}</TableCell>
//                     <TableCell>{transfer.TransferInfo || "-"}</TableCell>
//                     <TableCell>
//                       {transfer.Currency} {transfer.Price}
//                     </TableCell>
//                     <TableCell>
//                       {transfer.Currency} {transfer.Extra_Price}
//                     </TableCell>
//                     <TableCell>
//                       {transfer.NightTime === "yes" 
//                         ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
//                         : "No"}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleEdit(transfer)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleDelete(transfer.id)}
//                         >
//                           <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default VehicleTransfer;



"use client";
import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getToken, removeToken } from "@/components/utils/auth";
import { useToast } from "@/hooks/use-toast";
import DashboardContainer from "@/components/layout/DashboardContainer";
const transferSchema = z.object({
  id: z.string().optional(),
  vehicle_id: z.string().min(1, { message: "Please select a vehicle" }),
  Currency: z.string().min(1, { message: "Currency is required" }),
  Transfer_info: z.string().optional(),
  zone_id: z.string().min(1, { message: "Transfer Zone is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  extra_price_per_mile: z.string().min(1, { message: "Extra Price is required" }),
  NightTime: z.enum(["yes", "no"]).optional(),
  NightTime_Price: z.string().optional(),
});

type Vehicle = {
  id: string;
  VehicleBrand: string;
  VehicleModel: string;
  VehicleType: string;
  ServiceType: string;
};

type Zone = {
  id: string;
  name: string;
  address: string;
};

type Transfer = {
  id: string;
  vehicle_id: string;
  zone_id: string;
  price: string;
  extra_price_per_mile: string;
  Currency: string;
  Transfer_info: string;
  NightTime: "yes" | "no";
  NightTime_Price: string;
  Zone_name: string;
  VehicleBrand: string;
  VehicleModel: string;
};

const VehicleTransfer = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState<Transfer | null>(null);
const {toast} = useToast();
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        
        const [vehicleResponse, zoneResponse, transfersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/supplier/gettransferbyid/${userData.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
        if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
        if (!transfersResponse.ok) throw new Error("Failed to fetch transfers");

        const [vehicleData, zoneData, transfersData] = await Promise.all([
          vehicleResponse.json(),
          zoneResponse.json(),
          transfersResponse.json()
        ]);

        setVehicles(vehicleData);
        setZones(zoneData);
        setTransfers(transfersData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      vehicle_id: "",
      Currency: "Rs",
      Transfer_info: "",
      zone_id: "",
      extra_price_per_mile: "",
      price: "",
      NightTime: "no",
      NightTime_Price: "",
    },
  });

  useEffect(() => {
    if (isDialogOpen && currentTransfer) {
      form.reset({
        id: currentTransfer.id,
        vehicle_id: currentTransfer.vehicle_id,
        Currency: currentTransfer.Currency,
        Transfer_info: currentTransfer.Transfer_info,
        zone_id: currentTransfer.zone_id,
        price: currentTransfer.price,
        extra_price_per_mile: currentTransfer.extra_price_per_mile,
        NightTime: currentTransfer.NightTime,
        NightTime_Price: currentTransfer.NightTime_Price,
      });
    } else if (isDialogOpen) {
      form.reset({
        vehicle_id: "",
        Currency: "Rs",
        Transfer_info: "",
        zone_id: "",
        extra_price_per_mile: "",
        price: "",
        NightTime: "no",
        NightTime_Price: "",
      });
    }
  }, [isDialogOpen, currentTransfer]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      removeToken();
      router.push("/login");
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      const url = data.id 
        ? `${API_BASE_URL}/supplier/transfers/${data.id}`
        : `${API_BASE_URL}/supplier/transfers`;
      
      const method = data.id ? "PUT" : "POST";
      
      await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          ...data,
          supplier_id: userData.userId
        }),
      });

      // Refresh transfers after successful save
      const transfersResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/gettransferbyid/${userData.userId}`
      );
      setTransfers(transfersResponse);
      
      toast({
        title: "Success",
        description: data.id ? "Transfer updated successfully" : "Transfer created successfully",
      });

      setIsDialogOpen(false);
      setCurrentTransfer(null);
    } catch (err: any) {
      console.error("Error saving transfer:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save transfer",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/transfers/${id}`, {
        method: "DELETE",
      });

      // Refresh transfers after successful delete
      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      const transfersResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/gettransferbyid/${userData.userId}`
      );
      setTransfers(transfersResponse);

      toast({
        title: "Success",
        description: "Transfer deleted successfully",
      });
    } catch (err: any) {
      console.error("Error deleting transfer:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete transfer",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transfer: Transfer) => {
    setCurrentTransfer(transfer);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setCurrentTransfer(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <DashboardContainer>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <DashboardContainer scrollable>
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Vehicle Transfers</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Create Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {currentTransfer ? "Edit Transfer" : "Create New Transfer"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle_id"
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
                                    {vehicle.VehicleBrand} ({vehicle.VehicleModel}) - {vehicle.VehicleType}
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

                  <FormField
                    control={form.control}
                    name="zone_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Zone</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {zones.map((zone) => (
                                <SelectItem key={zone.id} value={zone.id}>
                                  {zone.name} ({zone.address})
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
                    name="Transfer_info"
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                              {form.watch("Currency") || "N/A"}
                            </span>
                            <Input
                              placeholder="Enter Price"
                              {...field}
                              value={field.value || ""}
                              type="number"
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extra_price_per_mile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Price Per Mile</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                              {form.watch("Currency") || "N/A"}
                            </span>
                            <Input
                              placeholder="Enter Price"
                              {...field}
                              value={field.value || ""}
                              type="number"
                              className="rounded-l-none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="NightTime"
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
                    {form.watch("NightTime") === "yes" && (
                      <FormField
                        control={form.control}
                        name="NightTime_Price"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Night Time Price (per hour)</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                  {form.watch("Currency") || "N/A"}
                                </span>
                                <Input
                                  placeholder="Night Time Price"
                                  {...field}
                                  value={field.value || ""}
                                  type="number"
                                  className="rounded-l-none"
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
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {currentTransfer ? "Update" : "Create"} Transfer
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transfers found</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Transfer
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Transfer Info</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Extra Price/Mile</TableHead>
                <TableHead>Night Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => {
                const vehicle = vehicles.find(v => v.id === transfer.vehicle_id);
                const zone = zones.find(z => z.id === transfer.zone_id);
                
                return (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      {vehicle ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})` : transfer.VehicleBrand ? `${transfer.VehicleBrand} (${transfer.VehicleModel})` : "Unknown Vehicle"}
                    </TableCell>
                    <TableCell>{transfer.Zone_name || (zone ? zone.name : "Unknown Zone")}</TableCell>
                    <TableCell>{transfer.Transfer_info || "-"}</TableCell>
                    <TableCell>
                      {transfer.Currency} {transfer.price}
                    </TableCell>
                    <TableCell>
                      {transfer.Currency} {transfer.extra_price_per_mile}
                    </TableCell>
                    <TableCell>
                      {transfer.NightTime === "yes" 
                        ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
                        : "No"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transfer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transfer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
    </DashboardContainer>
  );
};

export default VehicleTransfer;