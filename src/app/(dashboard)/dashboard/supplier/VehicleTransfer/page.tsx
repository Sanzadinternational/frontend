// "use client";
// import { useState, useEffect } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import { useToast } from "@/hooks/use-toast";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { removeToken } from "@/components/utils/auth";
// import { Badge } from "@/components/ui/badge";
// import { ChooseCurrency } from "@/components/constants/currency";
// const transferSchema = z.object({
//   rows: z.array(
//     z.object({
//       uniqueId: z.string().min(1, { message: "Vehicle is required" }), // Vehicle ID
//       SelectZone: z.string().min(1, { message: "Zone is required" }),
//       Price: z.string().min(1, { message: "Price is required" }),
//       Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
//       Currency: z.string().min(1, { message: "Currency is required" }),
//       TransferInfo: z.string().optional(),
//       NightTime: z.enum(["yes", "no"]).optional(),
//       NightTime_Price: z.string().optional(),
//       transferId: z.string().optional(),
//       vehicleTax: z.string().optional(),
//       parking: z.string().optional(),
//       tollTax: z.string().optional(),
//       driverCharge: z.string().optional(),
//       driverTips: z.string().optional(),
//     })
//   ),
// });
// type Vehicle = {
//   id: string;
//   VehicleBrand: string;
//   VehicleModel: string;
//   VehicleType: string;
//   ServiceType: string;
// };

// type Zone = {
//   id: string;
//   name: string;
//   address: string;
// };

// type Transfer = {
//   id: string;
//   vehicle_id: string;
//   zone_id: string;
//   price: string;
//   extra_price_per_mile: string;
//   Currency: string;
//   Transfer_info: string;
//   NightTime: "yes" | "no";
//   NightTime_Price: string;
//   Zone_name: string;
//   VehicleBrand: string;
//   VehicleModel: string;
//   vehicleTax: string;
//   parking: string;
//   tollTax: string;
//   driverCharge: string;
//   driverTips: string;
// };

// const VehicleTransfer = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [transfers, setTransfers] = useState<Transfer[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingRows, setEditingRows] = useState<
//     { index: number; transferId: string | null }[]
//   >([]);
//   const [editingTransferId, setEditingTransferId] = useState<string | null>(
//     null
//   );
//   const chooseCurrency = ChooseCurrency;
//   const form = useForm<z.infer<typeof transferSchema>>({
//     resolver: zodResolver(transferSchema),
//     defaultValues: {
//       rows: [
//         {
//           uniqueId: "",
//           SelectZone: "",
//           Price: "",
//           Extra_Price: "",
//           Currency: "INR",
//           TransferInfo: "",
//           NightTime: "no",
//           NightTime_Price: "",
//           vehicleTax: "",
//           parking: "",
//           tollTax: "",
//           driverCharge: "",
//           driverTips: "",
//         },
//       ],
//     },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);

//         const [vehicleResponse, zoneResponse, transfersResponse] =
//           await Promise.all([
//             fetch(
//               `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
//             ),
//             fetch(
//               `${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`
//             ),
//             fetch(
//               `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//             ),
//           ]);

//         if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
//         if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
//         if (!transfersResponse.ok) throw new Error("Failed to fetch transfers");

//         const [vehicleData, zoneData, transfersData] = await Promise.all([
//           vehicleResponse.json(),
//           zoneResponse.json(),
//           transfersResponse.json(),
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

//   const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//     const token = localStorage.getItem("authToken");
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

//     if (!response.ok) {
//       let errorMessage = response.statusText;
//       try {
//         const errorData = await response.text();
//         errorMessage = errorData || errorMessage;
//       } catch (e) {
//         console.warn("Couldn't parse error response", e);
//       }
//       throw new Error(`HTTP ${response.status}: ${errorMessage}`);
//     }

//     // Handle empty responses
//     const contentLength = response.headers.get("content-length");
//     if (contentLength === "0" || response.status === 204) {
//       return null;
//     }

//     try {
//       return await response.json();
//     } catch (e) {
//       console.error("Failed to parse JSON response:", e);
//       throw new Error("Invalid JSON response from server");
//     }
//   };
//   const handleAddRow = () => {
//     const currentRows = form.getValues("rows");
//     form.setValue(
//       "rows",
//       [
//         ...currentRows,
//         {
//           uniqueId: "",
//           SelectZone: "",
//           Price: "",
//           Extra_Price: "",
//           Currency: "INR",
//           TransferInfo: "",
//           NightTime: "no",
//           NightTime_Price: "",
//           vehicleTax: "",
//           parking: "",
//           tollTax: "",
//           driverCharge: "",
//           driverTips: "",
//         },
//       ],
//       { shouldDirty: true, shouldTouch: true, shouldValidate: false }
//     );
//   };

//   const handleDeleteRow = (index: number) => {
//     const rows = form.getValues("rows");
//     if (rows.length <= 1) {
//       toast({
//         title: "Error",
//         description: "You must have at least one row",
//         variant: "destructive",
//       });
//       return;
//     }

//     const rowToDelete = rows[index];
//     if (rowToDelete.uniqueId) {
//       handleDelete(rowToDelete.uniqueId, index);
//     } else {
//       form.setValue(
//         "rows",
//         rows.filter((_, i) => i !== index)
//       );
//     }
//   };

//   const handleEditTransfer = (transfer: Transfer) => {
//     // Set editing state
//     setEditingTransferId(transfer.id);
//     setIsEditing(true);

//     // Get current form values
//     const currentRows = form.getValues("rows");

//     // Replace the first row with the transfer data
//     const updatedRows = [...currentRows];
//     updatedRows[0] = {
//       uniqueId: transfer.vehicle_id,
//       SelectZone: transfer.zone_id,
//       Price: transfer.price,
//       Extra_Price: transfer.extra_price_per_mile,
//       Currency: transfer.Currency,
//       TransferInfo: transfer.Transfer_info || "",
//       NightTime: transfer.NightTime,
//       NightTime_Price: transfer.NightTime_Price || "",
//       transferId: transfer.id,
//       vehicleTax: transfer.vehicleTax,
//       parking: transfer.parking,
//       tollTax: transfer.tollTax,
//       driverCharge: transfer.driverCharge,
//       driverTips: transfer.driverTips,
//     };

//     form.setValue("rows", updatedRows);

//     // Scroll to form
//     document
//       .getElementById("transfer-form")
//       ?.scrollIntoView({ behavior: "smooth" });
//   };
//   const handleDelete = async (id: string, index: number) => {
//     try {
//       // Delete the transfer
//       await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
//         method: "DELETE",
//       });

//       // Remove the deleted transfer from the form state
//       const rows = form.getValues("rows");
//       form.setValue(
//         "rows",
//         rows.filter((_, i) => i !== index)
//       );

//       // Fetch updated transfer list
//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       if (!userData || !userData.userId) throw new Error("User data not found");

//       const transfersResponse = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//       );

//       if (!transfersResponse) throw new Error("Failed to fetch transfers");

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

//   const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
//     setIsSubmitting(true);

//     try {
//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       const promises = [];

//       for (const row of data.rows) {
//         const transferData = {
//           uniqueId: row.uniqueId,
//           SelectZone: row.SelectZone,
//           Price: row.Price,
//           Extra_Price: row.Extra_Price,
//           Currency: row.Currency,
//           TransferInfo: row.TransferInfo || "",
//           NightTime: row.NightTime || "no",
//           NightTime_Price: row.NightTime === "yes" ? row.NightTime_Price : "",
//           supplier_id: userData.userId,
//           vehicleTax: row.vehicleTax,
//           parking: row.parking,
//           tollTax: row.tollTax,
//           driverCharge: row.driverCharge,
//           driverTips: row.driverTips,
//         };

//         if (row.transferId) {
//           // Update existing transfer
//           promises.push(
//             fetchWithAuth(
//               `${API_BASE_URL}/supplier/updateTransfer/${row.transferId}`,
//               {
//                 method: "PUT",
//                 body: JSON.stringify(transferData),
//               }
//             )
//           );
//         } else {
//           // Create new transfer
//           promises.push(
//             fetchWithAuth(`${API_BASE_URL}/supplier/new_transfer`, {
//               method: "POST",
//               body: JSON.stringify({ rows: [transferData] }),
//             })
//           );
//         }
//       }

//       // Wait for all requests to complete
//       await Promise.all(promises);

//       // Refresh data
//       const updatedTransfers = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//       );
//       setTransfers(updatedTransfers);

//       toast({
//         title: "Success",
//         description: "Transfers saved successfully",
//       });

//       // Reset form
//       setEditingRows([]);
//       form.reset({
//         rows: [
//           {
//             uniqueId: "",
//             SelectZone: "",
//             Price: "",
//             Extra_Price: "",
//             Currency: "INR",
//             TransferInfo: "",
//             NightTime: "no",
//             NightTime_Price: "",
//             vehicleTax: "",
//             parking: "",
//             tollTax: "",
//             driverCharge: "",
//             driverTips: "",
//           },
//         ],
//       });
//     } catch (err: any) {
//       console.error("Submission failed:", err);
//       toast({
//         title: "Error",
//         description: err.message || "Failed to save transfers",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   if (loading) {
//     return (
//       <DashboardContainer>
//         <div className="space-y-4">
//           <Skeleton className="h-32 w-full" />
//           <Skeleton className="h-32 w-full" />
//           <Skeleton className="h-32 w-full" />
//         </div>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContainer>
//         <div className="text-red-500 text-center">Error: {error}</div>
//       </DashboardContainer>
//     );
//   }

//   return (
//     <DashboardContainer scrollable>
//       <Card>
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle>Vehicle Transfers</CardTitle>
//           <Button onClick={handleAddRow}>
//             <Plus className="mr-2 h-4 w-4" /> Add Row
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-6"
//               id="transfer-form"
//             >
//               <div className="space-y-4">
//                 {form.watch("rows").map((row, index) => {
//                   const nightTime = form.watch(`rows.${index}.NightTime`);
//                   return (
//                     <div
//                       key={index}
//                       className="border p-4 rounded-lg space-y-4"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.uniqueId`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Select Vehicle{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   onValueChange={field.onChange}
//                                   value={field.value}
//                                 >
//                                   <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Vehicle" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {vehicles.length === 0 ? (
//                                       <p className="text-red-500 text-center p-2">
//                                         No vehicles found
//                                       </p>
//                                     ) : (
//                                       vehicles.map((vehicle) => (
//                                         <SelectItem
//                                           key={vehicle.id}
//                                           value={vehicle.id}
//                                         >
//                                           {vehicle.VehicleBrand} (
//                                           {vehicle.VehicleModel}) -{" "}
//                                           {vehicle.VehicleType}
//                                         </SelectItem>
//                                       ))
//                                     )}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.SelectZone`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Select Zone{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   onValueChange={field.onChange}
//                                   value={field.value || ""}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select Zone" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {zones.map((zone) => (
//                                       <SelectItem key={zone.id} value={zone.id}>
//                                         {zone.name} ({zone.address})
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Currency`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Currency <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   {...field}
//                                   value={`${field.value}`}
//                                   onValueChange={(value) =>
//                                     field.onChange(value)
//                                   }
//                                 >
//                                   <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Currency" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {chooseCurrency?.map((cur) => (
//                                       <SelectItem
//                                         key={cur.value}
//                                         value={`${cur.value}`}
//                                       >
//                                         {cur.name}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.TransferInfo`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Transfer Info</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Transfer Info"
//                                   {...field}
//                                   value={field.value || ""}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Price`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Price <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Extra_Price`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Extra Price Per Mile{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.vehicleTax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Vehicle Tax</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Tax"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.parking`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Parking Charge</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Parking Charge"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.tollTax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Toll Tax</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Toll Tax"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.driverCharge`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Driver Charge</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Driver Charge"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.driverTips`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Driver Tips</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <div className="md:col-span-2">
//                           <FormField
//                             control={form.control}
//                             name={`rows.${index}.NightTime`}
//                             render={({ field }) => (
//                               <FormItem className="space-y-3">
//                                 <FormLabel>
//                                   Night Time Supplements (10PM-06AM)
//                                 </FormLabel>
//                                 <FormControl>
//                                   <RadioGroup
//                                     onValueChange={field.onChange}
//                                     value={field.value || "no"}
//                                     className="flex items-center"
//                                   >
//                                     <FormItem className="flex items-center space-x-3 space-y-0">
//                                       <FormControl>
//                                         <RadioGroupItem value="yes" />
//                                       </FormControl>
//                                       <FormLabel className="font-normal">
//                                         Yes
//                                       </FormLabel>
//                                     </FormItem>
//                                     <FormItem className="flex items-center space-x-3 space-y-0">
//                                       <FormControl>
//                                         <RadioGroupItem value="no" />
//                                       </FormControl>
//                                       <FormLabel className="font-normal">
//                                         No
//                                       </FormLabel>
//                                     </FormItem>
//                                   </RadioGroup>
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           {nightTime === "yes" && (
//                             <FormField
//                               control={form.control}
//                               name={`rows.${index}.NightTime_Price`}
//                               render={({ field }) => (
//                                 <FormItem className="mt-4">
//                                   <FormLabel>
//                                     Night Time Price (per hour)
//                                   </FormLabel>
//                                   <FormControl>
//                                     <div className="flex">
//                                       <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                         {form.watch(`rows.${index}.Currency`) ||
//                                           "N/A"}
//                                       </span>
//                                       <Input
//                                         placeholder="Night Time Price"
//                                         {...field}
//                                         value={field.value || ""}
//                                         type="number"
//                                         className="rounded-l-none"
//                                       />
//                                     </div>
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex justify-end">
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDeleteRow(index)}
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Remove
//                         </Button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleAddRow}>
//                   <Plus className="h-4 w-4 mr-2" /> Add Another Row
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting
//                     ? "Saving..."
//                     : isEditing
//                     ? "Update Transfer"
//                     : "Create Transfer"}
//                 </Button>
//               </div>
//             </form>
//           </Form>

//           {transfers.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-medium mb-4">Existing Transfers</h3>

//               {/* Desktop Table (hidden on mobile) */}
//               <div className="hidden md:block">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Vehicle</TableHead>
//                       <TableHead>Zone</TableHead>
//                       <TableHead>Transfer Info</TableHead>
//                       <TableHead>Price</TableHead>
//                       <TableHead>Extra Price/Mile</TableHead>
//                       <TableHead>Night Time</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {transfers.map((transfer, index) => {
//                       const vehicle = vehicles.find(
//                         (v) => v.id === transfer.vehicle_id
//                       );
//                       const zone = zones.find((z) => z.id === transfer.zone_id);

//                       return (
//                         <TableRow key={transfer.id}>
//                           <TableCell>
//                             {vehicle
//                               ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
//                               : transfer.VehicleBrand
//                               ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
//                               : "Unknown Vehicle"}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.Zone_name ||
//                               (zone ? zone.name : "Unknown Zone")}
//                           </TableCell>
//                           <TableCell>{transfer.Transfer_info || "-"}</TableCell>
//                           <TableCell>
//                             {transfer.Currency} {transfer.price}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.Currency} {transfer.extra_price_per_mile}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.NightTime === "yes"
//                               ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
//                               : "No"}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleEditTransfer(transfer)}
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleDelete(transfer.id, index)}
//                                 className="text-red-500 hover:text-red-700"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Mobile Cards (hidden on desktop) */}
//               <div className="md:hidden space-y-4">
//                 {transfers.map((transfer, index) => {
//                   const vehicle = vehicles.find(
//                     (v) => v.id === transfer.vehicle_id
//                   );
//                   const zone = zones.find((z) => z.id === transfer.zone_id);

//                   return (
//                     <Card key={transfer.id}>
//                       <CardHeader className="flex flex-row justify-between items-start p-4">
//                         <div>
//                           <CardTitle className="text-lg">
//                             {vehicle
//                               ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
//                               : transfer.VehicleBrand
//                               ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
//                               : "Unknown Vehicle"}
//                           </CardTitle>
//                           <div className="mt-2">
//                             <Badge variant="outline">
//                               {transfer.Zone_name ||
//                                 (zone ? zone.name : "Unknown Zone")}
//                             </Badge>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleEditTransfer(transfer)}
//                             className="h-8 w-8"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDelete(transfer.id, index)}
//                             className="h-8 w-8 text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Transfer Info
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Transfer_info || "-"}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Price
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Currency} {transfer.price}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Extra Price/Mile
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Currency} {transfer.extra_price_per_mile}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Night Time
//                           </div>
//                           <div className="text-sm">
//                             {transfer.NightTime === "yes"
//                               ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
//                               : "No"}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </DashboardContainer>
//   );
// };

// export default VehicleTransfer;


// "use client";
// import { useState, useEffect } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import { Pencil, Trash2, Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { removeToken } from "@/components/utils/auth";
// import { Badge } from "@/components/ui/badge";
// import { ChooseCurrency } from "@/components/constants/currency";

// const transferSchema = z.object({
//   rows: z.array(
//     z.object({
//       uniqueId: z.string().min(1, { message: "Vehicle is required" }), // Vehicle ID
//       SelectZone: z.string().min(1, { message: "Zone is required" }),
//       Price: z.string().min(1, { message: "Price is required" }),
//       Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
//       Currency: z.string().min(1, { message: "Currency is required" }),
//       TransferInfo: z.string().optional(),
//       NightTime: z.enum(["yes", "no"]).optional(),
//       NightTime_Price: z.string().optional(),
//       transferId: z.string().optional(),
//       vehicleTax: z.string().optional(),
//       parking: z.string().optional(),
//       tollTax: z.string().optional(),
//       driverCharge: z.string().optional(),
//       driverTips: z.string().optional(),
//     })
//   ),
// });

// type Vehicle = {
//   id: string;
//   VehicleBrand: string;
//   VehicleModel: string;
//   VehicleType: string;
//   ServiceType: string;
// };

// type Zone = {
//   id: string;
//   name: string;
//   address: string;
// };

// type Transfer = {
//   id: string;
//   vehicle_id: string;
//   zone_id: string;
//   price: string;
//   extra_price_per_mile: string;
//   Currency: string;
//   Transfer_info: string;
//   NightTime: "yes" | "no";
//   NightTime_Price: string;
//   Zone_name: string;
//   VehicleBrand: string;
//   VehicleModel: string;
//   vehicleTax: string;
//   parking: string;
//   tollTax: string;
//   driverCharge: string;
//   driverTips: string;
// };

// const VehicleTransfer = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [allTransfers, setAllTransfers] = useState<Transfer[]>([]);
//   const [displayedTransfers, setDisplayedTransfers] = useState<Transfer[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingRows, setEditingRows] = useState<
//     { index: number; transferId: string | null }[]
//   >([]);
//   const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
  
//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Transfer;
//     direction: "ascending" | "descending";
//   } | null>(null);
  
//   const chooseCurrency = ChooseCurrency;

//   const form = useForm<z.infer<typeof transferSchema>>({
//     resolver: zodResolver(transferSchema),
//     defaultValues: {
//       rows: [
//         {
//           uniqueId: "",
//           SelectZone: "",
//           Price: "",
//           Extra_Price: "",
//           Currency: "INR",
//           TransferInfo: "",
//           NightTime: "no",
//           NightTime_Price: "",
//           vehicleTax: "",
//           parking: "",
//           tollTax: "",
//           driverCharge: "",
//           driverTips: "",
//         },
//       ],
//     },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);

//         const [vehicleResponse, zoneResponse, transfersResponse] =
//           await Promise.all([
//             fetch(
//               `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
//             ),
//             fetch(
//               `${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`
//             ),
//             fetch(
//               `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//             ),
//           ]);

//         if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
//         if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
//         if (!transfersResponse.ok) throw new Error("Failed to fetch transfers");

//         const [vehicleData, zoneData, transfersData] = await Promise.all([
//           vehicleResponse.json(),
//           zoneResponse.json(),
//           transfersResponse.json(),
//         ]);

//         setVehicles(vehicleData);
//         setZones(zoneData);
//         setAllTransfers(transfersData);
//         setDisplayedTransfers(transfersData);
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

//   // Apply search filter whenever searchTerm or allTransfers changes
//   useEffect(() => {
//     const filtered = allTransfers.filter(transfer => {
//       const searchLower = searchTerm.toLowerCase();
//       return (
//         (transfer.VehicleBrand?.toLowerCase().includes(searchLower)) ||
//         (transfer.VehicleModel?.toLowerCase().includes(searchLower))||
//         (transfer.Zone_name?.toLowerCase().includes(searchLower)) ||
//         (transfer.Transfer_info?.toLowerCase().includes(searchLower)) ||
//         (transfer.price?.toString().includes(searchTerm)) ||
//         (transfer.extra_price_per_mile?.toString().includes(searchTerm))
//   )});
//     setDisplayedTransfers(filtered);
//     setCurrentPage(1); // Reset to first page when search changes
//   }, [searchTerm, allTransfers]);

//   // Apply sorting whenever sortConfig changes

// useEffect(() => {
//   if (sortConfig !== null) {
//     const sortedTransfers = [...displayedTransfers].sort((a, b) => {
//       // Handle null/undefined values
//       const aValue = a[sortConfig.key] || "";
//       const bValue = b[sortConfig.key] || "";

//       // Special handling for numeric fields
//       if (
//         sortConfig.key === "price" || 
//         sortConfig.key === "extra_price_per_mile" || 
//         sortConfig.key === "NightTime_Price" ||
//         sortConfig.key === "vehicleTax" ||
//         sortConfig.key === "parking" ||
//         sortConfig.key === "tollTax" ||
//         sortConfig.key === "driverCharge" ||
//         sortConfig.key === "driverTips"
//       ) {
//         const numA = parseFloat(aValue as string) || 0;
//         const numB = parseFloat(bValue as string) || 0;
//         return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
//       }

//       // Default string comparison (case insensitive)
//       const strA = String(aValue).toLowerCase();
//       const strB = String(bValue).toLowerCase();
      
//       if (strA < strB) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (strA > strB) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });
//     setDisplayedTransfers(sortedTransfers);
//   }
// }, [sortConfig]);

// const requestSort = (key: keyof Transfer) => {
//   let direction: "ascending" | "descending" = "ascending";
  
//   // If already sorting by this key, toggle direction
//   if (sortConfig?.key === key) {
//     direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
//   }
  
//   setSortConfig({ key, direction });
// };

// const getSortIcon = (key: keyof Transfer) => {
//   if (!sortConfig || sortConfig.key !== key) {
//     return <span className="opacity-0"><ChevronUp size={16} /></span>;
//   }
//   return sortConfig.direction === "ascending" ? (
//     <ChevronUp size={16} />
//   ) : (
//     <ChevronDown size={16} />
//   );
// };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = displayedTransfers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(displayedTransfers.length / itemsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//     const token = localStorage.getItem("authToken");
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

//     if (!response.ok) {
//       let errorMessage = response.statusText;
//       try {
//         const errorData = await response.text();
//         errorMessage = errorData || errorMessage;
//       } catch (e) {
//         console.warn("Couldn't parse error response", e);
//       }
//       throw new Error(`HTTP ${response.status}: ${errorMessage}`);
//     }

//     // Handle empty responses
//     const contentLength = response.headers.get("content-length");
//     if (contentLength === "0" || response.status === 204) {
//       return null;
//     }

//     try {
//       return await response.json();
//     } catch (e) {
//       console.error("Failed to parse JSON response:", e);
//       throw new Error("Invalid JSON response from server");
//     }
//   };

//   const handleAddRow = () => {
//     const currentRows = form.getValues("rows");
//     form.setValue(
//       "rows",
//       [
//         ...currentRows,
//         {
//           uniqueId: "",
//           SelectZone: "",
//           Price: "",
//           Extra_Price: "",
//           Currency: "INR",
//           TransferInfo: "",
//           NightTime: "no",
//           NightTime_Price: "",
//           vehicleTax: "",
//           parking: "",
//           tollTax: "",
//           driverCharge: "",
//           driverTips: "",
//         },
//       ],
//       { shouldDirty: true, shouldTouch: true, shouldValidate: false }
//     );
//   };

//   const handleDeleteRow = (index: number) => {
//     const rows = form.getValues("rows");
//     if (rows.length <= 1) {
//       toast({
//         title: "Error",
//         description: "You must have at least one row",
//         variant: "destructive",
//       });
//       return;
//     }

//     const rowToDelete = rows[index];
//     if (rowToDelete.uniqueId) {
//       handleDelete(rowToDelete.uniqueId, index);
//     } else {
//       form.setValue(
//         "rows",
//         rows.filter((_, i) => i !== index)
//       );
//     }
//   };

//   const handleEditTransfer = (transfer: Transfer) => {
//     setEditingTransferId(transfer.id);
//     setIsEditing(true);

//     const currentRows = form.getValues("rows");
//     const updatedRows = [...currentRows];
//     updatedRows[0] = {
//       uniqueId: transfer.vehicle_id,
//       SelectZone: transfer.zone_id,
//       Price: transfer.price,
//       Extra_Price: transfer.extra_price_per_mile,
//       Currency: transfer.Currency,
//       TransferInfo: transfer.Transfer_info || "",
//       NightTime: transfer.NightTime,
//       NightTime_Price: transfer.NightTime_Price || "",
//       transferId: transfer.id,
//       vehicleTax: transfer.vehicleTax,
//       parking: transfer.parking,
//       tollTax: transfer.tollTax,
//       driverCharge: transfer.driverCharge,
//       driverTips: transfer.driverTips,
//     };

//     form.setValue("rows", updatedRows);
//     document.getElementById("transfer-form")?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleDelete = async (id: string, index: number) => {
//     try {
//       await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
//         method: "DELETE",
//       });

//       const rows = form.getValues("rows");
//       form.setValue(
//         "rows",
//         rows.filter((_, i) => i !== index)
//       );

//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       if (!userData || !userData.userId) throw new Error("User data not found");

//       const transfersResponse = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//       );

//       if (!transfersResponse) throw new Error("Failed to fetch transfers");

//       setAllTransfers(transfersResponse);
//       setDisplayedTransfers(transfersResponse);

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

//   const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
//     setIsSubmitting(true);

//     try {
//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       const promises = [];

//       for (const row of data.rows) {
//         const transferData = {
//           uniqueId: row.uniqueId,
//           SelectZone: row.SelectZone,
//           Price: row.Price,
//           Extra_Price: row.Extra_Price,
//           Currency: row.Currency,
//           TransferInfo: row.TransferInfo || "",
//           NightTime: row.NightTime || "no",
//           NightTime_Price: row.NightTime === "yes" ? row.NightTime_Price : "",
//           supplier_id: userData.userId,
//           vehicleTax: row.vehicleTax,
//           parking: row.parking,
//           tollTax: row.tollTax,
//           driverCharge: row.driverCharge,
//           driverTips: row.driverTips,
//         };

//         if (row.transferId) {
//           promises.push(
//             fetchWithAuth(
//               `${API_BASE_URL}/supplier/updateTransfer/${row.transferId}`,
//               {
//                 method: "PUT",
//                 body: JSON.stringify(transferData),
//               }
//             )
//           );
//         } else {
//           promises.push(
//             fetchWithAuth(`${API_BASE_URL}/supplier/new_transfer`, {
//               method: "POST",
//               body: JSON.stringify({ rows: [transferData] }),
//             })
//           );
//         }
//       }

//       await Promise.all(promises);
//       const updatedTransfers = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
//       );
//       setAllTransfers(updatedTransfers);
//       setDisplayedTransfers(updatedTransfers);

//       toast({
//         title: "Success",
//         description: "Transfers saved successfully",
//       });

//       setEditingRows([]);
//       form.reset({
//         rows: [
//           {
//             uniqueId: "",
//             SelectZone: "",
//             Price: "",
//             Extra_Price: "",
//             Currency: "INR",
//             TransferInfo: "",
//             NightTime: "no",
//             NightTime_Price: "",
//             vehicleTax: "",
//             parking: "",
//             tollTax: "",
//             driverCharge: "",
//             driverTips: "",
//           },
//         ],
//       });
//     } catch (err: any) {
//       console.error("Submission failed:", err);
//       toast({
//         title: "Error",
//         description: err.message || "Failed to save transfers",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardContainer>
//         <div className="space-y-4">
//           <Skeleton className="h-32 w-full" />
//           <Skeleton className="h-32 w-full" />
//           <Skeleton className="h-32 w-full" />
//         </div>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContainer>
//         <div className="text-red-500 text-center">Error: {error}</div>
//       </DashboardContainer>
//     );
//   }

//   return (
//     <DashboardContainer scrollable>
//       <Card>
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle>Vehicle Transfers</CardTitle>
//           <Button onClick={handleAddRow}>
//             <Plus className="mr-2 h-4 w-4" /> Add Row
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-6"
//               id="transfer-form"
//             >
//                <div className="space-y-4">
//                 {form.watch("rows").map((row, index) => {
//                   const nightTime = form.watch(`rows.${index}.NightTime`);
//                   return (
//                     <div
//                       key={index}
//                       className="border p-4 rounded-lg space-y-4"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.uniqueId`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Select Vehicle{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   onValueChange={field.onChange}
//                                   value={field.value}
//                                 >
//                                   <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Vehicle" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {vehicles.length === 0 ? (
//                                       <p className="text-red-500 text-center p-2">
//                                         No vehicles found
//                                       </p>
//                                     ) : (
//                                       vehicles.map((vehicle) => (
//                                         <SelectItem
//                                           key={vehicle.id}
//                                           value={vehicle.id}
//                                         >
//                                           {vehicle.VehicleBrand} (
//                                           {vehicle.VehicleModel}) -{" "}
//                                           {vehicle.VehicleType}
//                                         </SelectItem>
//                                       ))
//                                     )}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.SelectZone`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Select Zone{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   onValueChange={field.onChange}
//                                   value={field.value || ""}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select Zone" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {zones.map((zone) => (
//                                       <SelectItem key={zone.id} value={zone.id}>
//                                         {zone.name} ({zone.address})
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Currency`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Currency <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <Select
//                                   {...field}
//                                   value={`${field.value}`}
//                                   onValueChange={(value) =>
//                                     field.onChange(value)
//                                   }
//                                 >
//                                   <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Currency" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {chooseCurrency?.map((cur) => (
//                                       <SelectItem
//                                         key={cur.value}
//                                         value={`${cur.value}`}
//                                       >
//                                         {cur.name}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.TransferInfo`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Transfer Info</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Transfer Info"
//                                   {...field}
//                                   value={field.value || ""}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Price`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Price <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.Extra_Price`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Extra Price Per Mile{" "}
//                                 <span className="text-red-500">*</span>
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.vehicleTax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Vehicle Tax</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Tax"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.parking`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Parking Charge</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Parking Charge"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.tollTax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Toll Tax</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Toll Tax"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.driverCharge`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Driver Charge</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Driver Charge"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`rows.${index}.driverTips`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Driver Tips</FormLabel>
//                               <FormControl>
//                                 <div className="flex">
//                                   <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                     {form.watch(`rows.${index}.Currency`) ||
//                                       "N/A"}
//                                   </span>
//                                   <Input
//                                     placeholder="Enter Price"
//                                     {...field}
//                                     value={field.value || ""}
//                                     type="number"
//                                     className="rounded-l-none"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <div className="md:col-span-2">
//                           <FormField
//                             control={form.control}
//                             name={`rows.${index}.NightTime`}
//                             render={({ field }) => (
//                               <FormItem className="space-y-3">
//                                 <FormLabel>
//                                   Night Time Supplements (10PM-06AM)
//                                 </FormLabel>
//                                 <FormControl>
//                                   <RadioGroup
//                                     onValueChange={field.onChange}
//                                     value={field.value || "no"}
//                                     className="flex items-center"
//                                   >
//                                     <FormItem className="flex items-center space-x-3 space-y-0">
//                                       <FormControl>
//                                         <RadioGroupItem value="yes" />
//                                       </FormControl>
//                                       <FormLabel className="font-normal">
//                                         Yes
//                                       </FormLabel>
//                                     </FormItem>
//                                     <FormItem className="flex items-center space-x-3 space-y-0">
//                                       <FormControl>
//                                         <RadioGroupItem value="no" />
//                                       </FormControl>
//                                       <FormLabel className="font-normal">
//                                         No
//                                       </FormLabel>
//                                     </FormItem>
//                                   </RadioGroup>
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           {nightTime === "yes" && (
//                             <FormField
//                               control={form.control}
//                               name={`rows.${index}.NightTime_Price`}
//                               render={({ field }) => (
//                                 <FormItem className="mt-4">
//                                   <FormLabel>
//                                     Night Time Price (per hour)
//                                   </FormLabel>
//                                   <FormControl>
//                                     <div className="flex">
//                                       <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
//                                         {form.watch(`rows.${index}.Currency`) ||
//                                           "N/A"}
//                                       </span>
//                                       <Input
//                                         placeholder="Night Time Price"
//                                         {...field}
//                                         value={field.value || ""}
//                                         type="number"
//                                         className="rounded-l-none"
//                                       />
//                                     </div>
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex justify-end">
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDeleteRow(index)}
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Remove
//                         </Button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleAddRow}>
//                   <Plus className="h-4 w-4 mr-2" /> Add Another Row
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting
//                     ? "Saving..."
//                     : isEditing
//                     ? "Update Transfer"
//                     : "Create Transfer"}
//                 </Button>
//               </div>
//             </form>
//           </Form>

//           {allTransfers.length > 0 && (
//             <div className="mt-8">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//                 <h3 className="text-lg font-medium">Existing Transfers</h3>
                
//                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//                   <div className="relative w-full">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search transfers..."
//                       className="pl-10 w-full"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
                  
//                   <Select
//                     value={itemsPerPage.toString()}
//                     onValueChange={(value) => {
//                       setItemsPerPage(Number(value));
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <SelectTrigger className="w-[120px]">
//                       <SelectValue placeholder="Items per page" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="5">5 per page</SelectItem>
//                       <SelectItem value="10">10 per page</SelectItem>
//                       <SelectItem value="20">20 per page</SelectItem>
//                       <SelectItem value="50">50 per page</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Desktop Table */}
//               <div className="hidden md:block">
//                 <Table>
//                   {/* <TableHeader>
//                     <TableRow>
//                       <TableHead 
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => requestSort("VehicleBrand")}
//                       >
//                         <div className="flex items-center gap-1">
//                           Vehicle {getSortIcon("VehicleBrand")}
//                         </div>
//                       </TableHead>
//                       <TableHead 
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => requestSort("Zone_name")}
//                       >
//                         <div className="flex items-center gap-1">
//                           Zone {getSortIcon("Zone_name")}
//                         </div>
//                       </TableHead>
//                       <TableHead>Transfer Info</TableHead>
//                       <TableHead 
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => requestSort("price")}
//                       >
//                         <div className="flex items-center gap-1">
//                           Price {getSortIcon("price")}
//                         </div>
//                       </TableHead>
//                       <TableHead>Extra Price/Mile</TableHead>
//                       <TableHead>Night Time</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader> */}
//                    <TableHeader>
//         <TableRow>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("VehicleBrand")}
//           >
//             <div className="flex items-center gap-1">
//               Vehicle {getSortIcon("VehicleBrand")}
//             </div>
//           </TableHead>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("Zone_name")}
//           >
//             <div className="flex items-center gap-1">
//               Zone {getSortIcon("Zone_name")}
//             </div>
//           </TableHead>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("Transfer_info")}
//           >
//             <div className="flex items-center gap-1">
//               Transfer Info {getSortIcon("Transfer_info")}
//             </div>
//           </TableHead>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("price")}
//           >
//             <div className="flex items-center gap-1">
//               Price {getSortIcon("price")}
//             </div>
//           </TableHead>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("extra_price_per_mile")}
//           >
//             <div className="flex items-center gap-1">
//               Extra Price/Mile {getSortIcon("extra_price_per_mile")}
//             </div>
//           </TableHead>
//           <TableHead 
//             className="cursor-pointer hover:bg-accent"
//             onClick={() => requestSort("NightTime")}
//           >
//             <div className="flex items-center gap-1">
//               Night Time {getSortIcon("NightTime")}
//             </div>
//           </TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//                   <TableBody>
//                     {currentItems.map((transfer, index) => {
//                       const vehicle = vehicles.find(
//                         (v) => v.id === transfer.vehicle_id
//                       );
//                       const zone = zones.find((z) => z.id === transfer.zone_id);

//                       return (
//                         <TableRow key={transfer.id}>
//                           <TableCell>
//                             {vehicle
//                               ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
//                               : transfer.VehicleBrand
//                               ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
//                               : "Unknown Vehicle"}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.Zone_name ||
//                               (zone ? zone.name : "Unknown Zone")}
//                           </TableCell>
//                           <TableCell>{transfer.Transfer_info || "-"}</TableCell>
//                           <TableCell>
//                             {transfer.Currency} {transfer.price}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.Currency} {transfer.extra_price_per_mile}
//                           </TableCell>
//                           <TableCell>
//                             {transfer.NightTime === "yes"
//                               ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
//                               : "No"}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleEditTransfer(transfer)}
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleDelete(transfer.id, index)}
//                                 className="text-red-500 hover:text-red-700"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>

//                 {/* Pagination controls */}
//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-end space-x-2 py-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
//                     <div className="flex items-center gap-1">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
//                         return (
//                           <Button
//                             key={pageNum}
//                             variant={currentPage === pageNum ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => paginate(pageNum)}
//                           >
//                             {pageNum}
//                           </Button>
//                         );
//                       })}
//                       {totalPages > 5 && currentPage < totalPages - 2 && (
//                         <>
//                           <span className="px-2">...</span>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => paginate(totalPages)}
//                           >
//                             {totalPages}
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden space-y-4">
//                 {currentItems.map((transfer, index) => {
//                   const vehicle = vehicles.find(
//                     (v) => v.id === transfer.vehicle_id
//                   );
//                   const zone = zones.find((z) => z.id === transfer.zone_id);

//                   return (
//                     <Card key={transfer.id}>
//                       <CardHeader className="flex flex-row justify-between items-start p-4">
//                         <div>
//                           <CardTitle className="text-lg">
//                             {vehicle
//                               ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
//                               : transfer.VehicleBrand
//                               ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
//                               : "Unknown Vehicle"}
//                           </CardTitle>
//                           <div className="mt-2">
//                             <Badge variant="outline">
//                               {transfer.Zone_name ||
//                                 (zone ? zone.name : "Unknown Zone")}
//                             </Badge>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleEditTransfer(transfer)}
//                             className="h-8 w-8"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDelete(transfer.id, index)}
//                             className="h-8 w-8 text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Transfer Info
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Transfer_info || "-"}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Price
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Currency} {transfer.price}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Extra Price/Mile
//                           </div>
//                           <div className="text-sm">
//                             {transfer.Currency} {transfer.extra_price_per_mile}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <div className="text-sm font-medium text-gray-500">
//                             Night Time
//                           </div>
//                           <div className="text-sm">
//                             {transfer.NightTime === "yes"
//                               ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
//                               : "No"}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}

//                 {/* Mobile pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-sm">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </DashboardContainer>
//   );
// };

// export default VehicleTransfer;


"use client";
import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Pencil, Trash2, Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { removeToken } from "@/components/utils/auth";
import { Badge } from "@/components/ui/badge";
import { ChooseCurrency } from "@/components/constants/currency";
import { Label } from "@/components/ui/label";
const transferSchema = z.object({
  rows: z.array(
    z.object({
      uniqueId: z.string().min(1, { message: "Vehicle is required" }),
      SelectZone: z.string().min(1, { message: "Zone is required" }),
      Price: z.string().min(1, { message: "Price is required" }),
      Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
      Currency: z.string().min(1, { message: "Currency is required" }),
      TransferInfo: z.string().optional(),
      NightTime: z.enum(["yes", "no"]).optional(),
      NightTime_Price: z.string().optional(),
      transferId: z.string().optional(),
      vehicleTax: z.string().optional(),
      vehicleTaxType: z.enum(["fixed", "percentage"]).default("fixed"),
      parking: z.string().optional(),
      tollTax: z.string().optional(),
      driverCharge: z.string().optional(),
      driverTips: z.string().optional(),
    })
  ),
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
  vehicleTax: string;
  vehicleTaxType: "fixed" | "percentage";
  parking: string;
  tollTax: string;
  driverCharge: string;
  driverTips: string;
};

type UserData = {
  userId: string;
  currency?: string;
};
type TaxCalculationRow = {
  vehicleTaxType: "fixed" | "percentage";
  vehicleTax?: string;
  Price?: string;
};
const calculateVehicleTax = (row: TaxCalculationRow): number => {
  const price = parseFloat(row.Price || "0") || 0;
  const taxValue = parseFloat(row.vehicleTax || "0") || 0;

  return row.vehicleTaxType === "percentage"
    ? (price * taxValue) / 100
    : taxValue;
};
const VehicleTransfer = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allTransfers, setAllTransfers] = useState<Transfer[]>([]);
  const [displayedTransfers, setDisplayedTransfers] = useState<Transfer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRows, setEditingRows] = useState<
    { index: number; transferId: string | null }[]
  >([]);
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transfer;
    direction: "ascending" | "descending";
  } | null>(null);
  
  const chooseCurrency = ChooseCurrency;

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      rows: [
        {
          uniqueId: "",
          SelectZone: "",
          Price: "",
          Extra_Price: "",
          Currency: "",
          TransferInfo: "",
          NightTime: "no",
          NightTime_Price: "",
          vehicleTax: "",
          parking: "",
          tollTax: "",
          driverCharge: "",
          driverTips: "",
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setUserData(userData);

        const [vehicleResponse, zoneResponse, transfersResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
            ),
            fetch(
              `${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`
            ),
            fetch(
              `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
            ),
          ]);

        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicles");
        if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
        if (!transfersResponse.ok) throw new Error("Failed to fetch transfers");

        const [vehicleData, zoneData, transfersData] = await Promise.all([
          vehicleResponse.json(),
          zoneResponse.json(),
          transfersResponse.json(),
        ]);

        setVehicles(vehicleData);
        setZones(zoneData);
        setAllTransfers(transfersData);
        setDisplayedTransfers(transfersData);

        // Initialize form with user's currency
        form.reset({
          rows: [
            {
              uniqueId: "",
              SelectZone: "",
              Price: "",
              Extra_Price: "",
              Currency: userData.Currency || "",
              TransferInfo: "",
              NightTime: "no",
              NightTime_Price: "",
              vehicleTax: "",
              parking: "",
              tollTax: "",
              driverCharge: "",
              driverTips: "",
            },
          ],
        });
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

  // Apply search filter whenever searchTerm or allTransfers changes
  useEffect(() => {
    const filtered = allTransfers.filter(transfer => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (transfer.VehicleBrand?.toLowerCase().includes(searchLower)) ||
        (transfer.VehicleModel?.toLowerCase().includes(searchLower))||
        (transfer.Zone_name?.toLowerCase().includes(searchLower)) ||
        (transfer.Transfer_info?.toLowerCase().includes(searchLower)) ||
        (transfer.price?.toString().includes(searchTerm)) ||
        (transfer.extra_price_per_mile?.toString().includes(searchTerm))
      )});
    setDisplayedTransfers(filtered);
    setCurrentPage(1);
  }, [searchTerm, allTransfers]);

  useEffect(() => {
    if (sortConfig !== null) {
      const sortedTransfers = [...displayedTransfers].sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (
          sortConfig.key === "price" || 
          sortConfig.key === "extra_price_per_mile" || 
          sortConfig.key === "NightTime_Price" ||
          sortConfig.key === "vehicleTax" ||
          sortConfig.key === "parking" ||
          sortConfig.key === "tollTax" ||
          sortConfig.key === "driverCharge" ||
          sortConfig.key === "driverTips"
        ) {
          const numA = parseFloat(aValue as string) || 0;
          const numB = parseFloat(bValue as string) || 0;
          return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
        }

        const strA = String(aValue).toLowerCase();
        const strB = String(bValue).toLowerCase();
        
        if (strA < strB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (strA > strB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      setDisplayedTransfers(sortedTransfers);
    }
  }, [sortConfig]);

  const requestSort = (key: keyof Transfer) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Transfer) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-0"><ChevronUp size={16} /></span>;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedTransfers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedTransfers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken");
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

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.text();
        errorMessage = errorData || errorMessage;
      } catch (e) {
        console.warn("Couldn't parse error response", e);
      }
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return null;
    }

    try {
      return await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      throw new Error("Invalid JSON response from server");
    }
  };

  const handleAddRow = () => {
    const currentRows = form.getValues("rows");
    const firstRowCurrency = currentRows[0]?.Currency || userData?.currency || "INR";
    
    form.setValue(
      "rows",
      [
        ...currentRows,
        {
          uniqueId: "",
          SelectZone: "",
          Price: "",
          Extra_Price: "",
          Currency: firstRowCurrency,
          TransferInfo: "",
          NightTime: "no",
          NightTime_Price: "",
          vehicleTax: "",
          parking: "",
          tollTax: "",
          driverCharge: "",
          driverTips: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true, shouldValidate: false }
    );
  };

  const handleDeleteRow = (index: number) => {
    const rows = form.getValues("rows");
    if (rows.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one row",
        variant: "destructive",
      });
      return;
    }

    const rowToDelete = rows[index];
    if (rowToDelete.uniqueId) {
      handleDelete(rowToDelete.uniqueId, index);
    } else {
      form.setValue(
        "rows",
        rows.filter((_, i) => i !== index)
      );
    }
  };

  const handleEditTransfer = (transfer: Transfer) => {
    setEditingTransferId(transfer.id);
    setIsEditing(true);

    const currentRows = form.getValues("rows");
    const updatedRows = [...currentRows];
    updatedRows[0] = {
      uniqueId: transfer.vehicle_id,
      SelectZone: transfer.zone_id,
      Price: transfer.price,
      Extra_Price: transfer.extra_price_per_mile,
      Currency: transfer.Currency,
      TransferInfo: transfer.Transfer_info || "",
      NightTime: transfer.NightTime,
      NightTime_Price: transfer.NightTime_Price || "",
      transferId: transfer.id,
      vehicleTax: transfer.vehicleTax,
      parking: transfer.parking,
      tollTax: transfer.tollTax,
      driverCharge: transfer.driverCharge,
      driverTips: transfer.driverTips,
    };

    form.setValue("rows", updatedRows);
    document.getElementById("transfer-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
        method: "DELETE",
      });

      const rows = form.getValues("rows");
      form.setValue(
        "rows",
        rows.filter((_, i) => i !== index)
      );

      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      if (!userData || !userData.userId) throw new Error("User data not found");

      const transfersResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
      );

      if (!transfersResponse) throw new Error("Failed to fetch transfers");

      setAllTransfers(transfersResponse);
      setDisplayedTransfers(transfersResponse);

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
 
  const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
    setIsSubmitting(true);
console.log("formData",data);
    try {
      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      const promises = [];

      for (const row of data.rows) {
        // const vehicleTaxAmount = row.vehicleTaxType === "percentage"
        // ? (parseFloat(row.Price) || 0) * (parseFloat(row.vehicleTax) || 0) / 100
        // : parseFloat(row.vehicleTax) || 0;
        const calculatedTax = calculateVehicleTax(row);
        const transferData = {
          uniqueId: row.uniqueId,
          SelectZone: row.SelectZone,
          Price: row.Price,
          Extra_Price: row.Extra_Price,
          Currency: row.Currency,
          TransferInfo: row.TransferInfo || "",
          NightTime: row.NightTime || "no",
          NightTime_Price: row.NightTime === "yes" ? row.NightTime_Price : "",
          supplier_id: userData.userId,
          vehicleTax: calculatedTax.toString(),
        vehicleTaxType: row.vehicleTaxType,
          parking: row.parking,
          tollTax: row.tollTax,
          driverCharge: row.driverCharge,
          driverTips: row.driverTips,
        };

        if (row.transferId) {
          promises.push(
            fetchWithAuth(
              `${API_BASE_URL}/supplier/updateTransfer/${row.transferId}`,
              {
                method: "PUT",
                body: JSON.stringify(transferData),
              }
            )
          );
        } else {
          promises.push(
            fetchWithAuth(`${API_BASE_URL}/supplier/new_transfer`, {
              method: "POST",
              body: JSON.stringify({ rows: [transferData] }),
            })
          );
        }
      }

      await Promise.all(promises);
      const updatedTransfers = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
      );
      setAllTransfers(updatedTransfers);
      setDisplayedTransfers(updatedTransfers);

      toast({
        title: "Success",
        description: "Transfers saved successfully",
      });

      setEditingRows([]);
      form.reset({
        rows: [
          {
            uniqueId: "",
            SelectZone: "",
            Price: "",
            Extra_Price: "",
            Currency: userData.Currency || "",
            TransferInfo: "",
            NightTime: "no",
            NightTime_Price: "",
            vehicleTax: "",
            parking: "",
            tollTax: "",
            driverCharge: "",
            driverTips: "",
          },
        ],
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save transfers",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    return (
      <DashboardContainer>
        <div className="text-red-500 text-center">Error: {error}</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer scrollable>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Vehicle Transfers</CardTitle>
          <Button onClick={handleAddRow}>
            <Plus className="mr-2 h-4 w-4" /> Add Row
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
              id="transfer-form"
            >
              <div className="space-y-4">
                {form.watch("rows").map((row, index) => {
                  const nightTime = form.watch(`rows.${index}.NightTime`);
                  return (
                    <div
                      key={index}
                      className="border p-4 rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`rows.${index}.uniqueId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Select Vehicle{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
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
                                          {vehicle.VehicleModel}) -{" "}
                                          {vehicle.VehicleType}
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
                          name={`rows.${index}.SelectZone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Select Zone{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || ""}
                                >
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
                          name={`rows.${index}.Currency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Currency <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  value={`${field.value}`}
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Currency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {chooseCurrency?.map((cur) => (
                                      <SelectItem
                                        key={cur.value}
                                        value={`${cur.value}`}
                                      >
                                        {cur.name}
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
                              <FormLabel>
                                Price <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
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
                          name={`rows.${index}.Extra_Price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Extra Price Per Mile{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
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

                        {/* <FormField
                          control={form.control}
                          name={`rows.${index}.vehicleTax`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Tax</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
                                  </span>
                                  <Input
                                    placeholder="Enter Tax"
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
                        /> */}

<FormField
  control={form.control}
  name={`rows.${index}.vehicleTax`}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vehicle Tax (select % or fixed amount)</FormLabel>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <FormControl>
            <div className="flex">
              <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                {form.watch(`rows.${index}.vehicleTaxType`) === "percentage" 
                  ? "%" 
                  : form.watch(`rows.${index}.Currency`) || "N/A"}
              </span>
              <Input
                placeholder={
                  form.watch(`rows.${index}.vehicleTaxType`) === "percentage"
                    ? "Enter Percentage"
                    : "Enter Tax Amount"
                }
                {...field}
                value={field.value || ""}
                type="number"
                className="rounded-l-none"
              />
            </div>
          </FormControl>
          <FormField
            control={form.control}
            name={`rows.${index}.vehicleTaxType`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="fixed" id={`fixed-${index}`} />
                      <Label htmlFor={`fixed-${index}`}>Fixed</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="percentage" id={`percentage-${index}`} />
                      <Label htmlFor={`percentage-${index}`}>%</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {form.watch(`rows.${index}.vehicleTaxType`) === "percentage" && (
          <div className="text-sm text-muted-foreground">
            Calculated Tax: {form.watch(`rows.${index}.Currency`) || "N/A"}{" "}
            {calculateVehicleTax({
              vehicleTaxType: form.watch(`rows.${index}.vehicleTaxType`),
              vehicleTax: form.watch(`rows.${index}.vehicleTax`),
              Price: form.watch(`rows.${index}.Price`)
            }).toFixed(2)}
          </div>
        )}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>


                        <FormField
                          control={form.control}
                          name={`rows.${index}.parking`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parking Charge</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
                                  </span>
                                  <Input
                                    placeholder="Enter Parking Charge"
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
                          name={`rows.${index}.tollTax`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Toll Tax</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
                                  </span>
                                  <Input
                                    placeholder="Enter Toll Tax"
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
                          name={`rows.${index}.driverCharge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver Charge</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
                                  </span>
                                  <Input
                                    placeholder="Enter Driver Charge"
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
                          name={`rows.${index}.driverTips`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver Tips</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                    {form.watch(`rows.${index}.Currency`) ||
                                      "N/A"}
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
                                <FormItem className="mt-4">
                                  <FormLabel>
                                    Night Time Price (per hour)
                                  </FormLabel>
                                  <FormControl>
                                    <div className="flex">
                                      <span className="bg-secondary px-2 py-1 rounded-l-sm flex items-center">
                                        {form.watch(`rows.${index}.Currency`) ||
                                          "N/A"}
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
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleAddRow}>
                  <Plus className="h-4 w-4 mr-2" /> Add Another Row
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Transfer"
                    : "Create Transfer"}
                </Button>
              </div>
            </form>
          </Form>

          {allTransfers.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-lg font-medium">Existing Transfers</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transfers..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("VehicleBrand")}
                      >
                        <div className="flex items-center gap-1">
                          Vehicle {getSortIcon("VehicleBrand")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("Zone_name")}
                      >
                        <div className="flex items-center gap-1">
                          Zone {getSortIcon("Zone_name")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("Transfer_info")}
                      >
                        <div className="flex items-center gap-1">
                          Transfer Info {getSortIcon("Transfer_info")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("price")}
                      >
                        <div className="flex items-center gap-1">
                          Price {getSortIcon("price")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("extra_price_per_mile")}
                      >
                        <div className="flex items-center gap-1">
                          Extra Price/Mile {getSortIcon("extra_price_per_mile")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => requestSort("NightTime")}
                      >
                        <div className="flex items-center gap-1">
                          Night Time {getSortIcon("NightTime")}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((transfer, index) => {
                      const vehicle = vehicles.find(
                        (v) => v.id === transfer.vehicle_id
                      );
                      const zone = zones.find((z) => z.id === transfer.zone_id);

                      return (
                        <TableRow key={transfer.id}>
                          <TableCell>
                            {vehicle
                              ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
                              : transfer.VehicleBrand
                              ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
                              : "Unknown Vehicle"}
                          </TableCell>
                          <TableCell>
                            {transfer.Zone_name ||
                              (zone ? zone.name : "Unknown Zone")}
                          </TableCell>
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
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTransfer(transfer)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(transfer.id, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => paginate(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {currentItems.map((transfer, index) => {
                  const vehicle = vehicles.find(
                    (v) => v.id === transfer.vehicle_id
                  );
                  const zone = zones.find((z) => z.id === transfer.zone_id);

                  return (
                    <Card key={transfer.id}>
                      <CardHeader className="flex flex-row justify-between items-start p-4">
                        <div>
                          <CardTitle className="text-lg">
                            {vehicle
                              ? `${vehicle.VehicleBrand} (${vehicle.VehicleModel})`
                              : transfer.VehicleBrand
                              ? `${transfer.VehicleBrand} (${transfer.VehicleModel})`
                              : "Unknown Vehicle"}
                          </CardTitle>
                          <div className="mt-2">
                            <Badge variant="outline">
                              {transfer.Zone_name ||
                                (zone ? zone.name : "Unknown Zone")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTransfer(transfer)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(transfer.id, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">
                            Transfer Info
                          </div>
                          <div className="text-sm">
                            {transfer.Transfer_info || "-"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">
                            Price
                          </div>
                          <div className="text-sm">
                            {transfer.Currency} {transfer.price}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">
                            Extra Price/Mile
                          </div>
                          <div className="text-sm">
                            {transfer.Currency} {transfer.extra_price_per_mile}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">
                            Night Time
                          </div>
                          <div className="text-sm">
                            {transfer.NightTime === "yes"
                              ? `Yes (${transfer.Currency} ${transfer.NightTime_Price}/hr)`
                              : "No"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Mobile pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardContainer>
  );
};

export default VehicleTransfer;