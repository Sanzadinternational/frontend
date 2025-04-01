
// "use client";

// import { useEffect, useState } from "react";
// import ZonePicker from "@/components/ZonePicker";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken, getToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { Badge } from "@/components/ui/badge";
// const formSchema = z.object({
//   name: z.string().min(1, { message: "Zone is required" }),
//   address: z.string().min(1, { message: "Zone Address is required" }),
//   radius_miles: z.string().min(1, { message: "Distance is required" }),
//   latitude: z.string().min(1, { message: "Latitude is required" }),
//   longitude: z.string().min(1, { message: "Longitude is required" }),
// });

// const Page = () => {
//   const { toast } = useToast();
//   const router = useRouter();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [supplierId, setSupplierId] = useState<string | null>(null);
//   const [zones, setZones] = useState([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       // Check token first
//       const token = getToken();
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       setSupplierId(userData.userId);

//       const zoneResponse = await fetchWithAuth(
//         `${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`
//       );
//       setZones(zoneResponse);
//     } catch (err: any) {
//       console.error("Error fetching data:", err);
      
//       // Handle 401 specifically
//       if (err.cause?.status === 401 || err.message.includes("401")) {
//         toast({ 
//           title: "Session Expired", 
//           description: "Please login again",
//           variant: "destructive"
//         });
//         removeToken();
//         router.push("/login");
//       } else {
//         toast({ 
//           title: "Error", 
//           description: err.message || "Failed to fetch data",
//           variant: "destructive"
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Check for token before attempting to fetch data
//     const token = getToken();
//     if (!token) {
//       router.push("/login");
//       return;
//     }
//     fetchData();
//   }, [API_BASE_URL, router]);

//   const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from(
//       { length: (stop - start) / step + 1 },
//       (_, index) => start + index * step
//     );

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       address: "",
//       radius_miles: "",
//       latitude: "",
//       longitude: "",
//     },
//   });

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       const url = editingId
//         ? `${API_BASE_URL}/supplier/update-zone/${editingId}`
//         : `${API_BASE_URL}/supplier/new-zone`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, supplier_id: supplierId }),
//       });

//       toast({ 
//         title: "Success!", 
//         description: `Zone ${editingId ? "updated" : "created"} successfully.` 
//       });
//       await fetchData();
//       form.reset();
//       setEditingId(null);
//       setShowForm(false);
//     } catch (error: any) {
//       toast({ 
//         title: "Error", 
//         description: error.message || "Operation failed",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleEdit = (zone: any) => {
//     setEditingId(zone.id);
//     form.reset({
//       name: zone.name || "",
//       address: zone.address || "",
//       radius_miles: zone.radius_miles?.toString() || "30",
//       latitude: zone.latitude?.toString() || "",
//       longitude: zone.longitude?.toString() || "",
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetchWithAuth(`${API_BASE_URL}/supplier/deleteZone/${id}`, {
//         method: "DELETE",
//       });

//       setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
//       toast({ title: "Deleted", description: "Zone deleted successfully!" });
//     } catch (error: any) {
//       toast({ 
//         title: "Error", 
//         description: error.message || "Failed to delete zone", 
//         variant: "destructive" 
//       });
//     }
//   };

//   if (isLoading) {
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

//   return (
//     <DashboardContainer scrollable>
//     <div className="space-y-4">
//       {/* Table Section with Create Button */}
//       {!showForm && (
//         <Card>
//           <CardHeader className="flex flex-row justify-between items-center">
//             <CardTitle>Existing Zones</CardTitle>
//             <Button onClick={() => setShowForm(true)}>Create Zone</Button>
//           </CardHeader>
//           {/* <CardContent>
//             <table className="w-full border-collapse border border-gray-200">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 p-2">Zone Name</th>
//                   <th className="border border-gray-300 p-2">Address</th>
//                   <th className="border border-gray-300 p-2">Base Distance (miles)</th>
//                   <th className="border border-gray-300 p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {zones.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="text-center p-4">
//                       No zones available
//                     </td>
//                   </tr>
//                 ) : (
//                   zones.map((zone) => (
//                     <tr key={zone.id} className="border border-gray-200">
//                       <td className="p-2">{zone.name}</td>
//                       <td className="p-2">{zone.address || "N/A"}</td>
//                       <td className="p-2">{zone.radius_miles}</td>
//                       <td className="p-2 flex gap-2">
//                         <Button
//                           onClick={() => handleEdit(zone)}
//                           variant="outline"
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           onClick={() => handleDelete(zone.id)}
//                           variant="destructive"
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </CardContent> */}
//           <CardContent>
//               {zones.length === 0 ? (
//                 <div className="text-center py-4">
//                   No zones available. Click "Create Zone" to add one.
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border-collapse border border-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone Name</th>
//                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (miles)</th>
//                         <th className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {zones.map((zone) => (
//                         <tr key={zone.id} className="hover:bg-gray-50">
//                           <td className="border border-gray-200 p-2 text-sm text-gray-900 font-medium">
//                             {zone.name}
//                           </td>
//                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                             {zone.address || "N/A"}
//                           </td>
//                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                             <Badge variant="outline">{zone.radius_miles} miles</Badge>
//                           </td>
//                           <td className="border border-gray-200 p-2 text-sm text-gray-900">
//                             <div className="flex space-x-2">
//                               <Button
//                                 onClick={() => handleEdit(zone)}
//                                 variant="outline"
//                                 size="sm"
//                               >
//                                 Edit
//                               </Button>
//                               <Button
//                                 onClick={() => handleDelete(zone.id)}
//                                 variant="destructive"
//                                 size="sm"
//                               >
//                                 Delete
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </CardContent>
//         </Card>
//       )}

//       {/* Form Section (Displayed on Button Click) */}
//       {showForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>{editingId ? "Edit Zone" : "Create Zone"}</CardTitle>
//             <CardDescription>
//               {editingId ? "Update the selected zone" : "Add a new zone"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(handleSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Zone Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter Zone Name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Zone Center</FormLabel>
//                       <FormControl>
//                         <ZonePicker
//                           onChange={field.onChange}
//                           setValue={form.setValue}
//                           initialValue={form.getValues("address")}
//                           initialCoords={{
//                             lat: parseFloat(form.getValues("latitude")) || undefined,
//                             lng: parseFloat(form.getValues("longitude")) || undefined,
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="radius_miles"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Base Distance</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Base Distance" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {baseDistance(5, 100, 5).map((distance) => (
//                               <SelectItem value={`${distance}`} key={distance}>
//                                 {distance}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Hidden fields for coordinates */}
//                 <FormField
//                   control={form.control}
//                   name="latitude"
//                   render={({ field }) => (
//                     <FormItem className="hidden">
//                       <FormControl>
//                         <Input type="hidden" {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="longitude"
//                   render={({ field }) => (
//                     <FormItem className="hidden">
//                       <FormControl>
//                         <Input type="hidden" {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex gap-2">
//                   <Button type="submit">
//                     {editingId ? "Update Zone" : "Create Zone"}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingId(null);
//                       form.reset();
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//     </DashboardContainer>
//   );
// };

// export default Page;



"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken, getToken } from "@/components/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ZonePicker from "@/components/ZonePicker";

const formSchema = z.object({
  name: z.string().min(1, { message: "Zone name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  radius_miles: z.string().min(1, { message: "Radius is required" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
});

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [zones, setZones] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      radius_miles: "5",
      latitude: "",
      longitude: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen && !editingId) {
      form.reset({
        name: "",
        address: "",
        radius_miles: "5",
        latitude: "",
        longitude: "",
      });
    }
  }, [isDialogOpen, editingId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      setSupplierId(userData.userId);

      const zoneResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getZonebySupplierId/${userData.userId}`
      );
      setZones(zoneResponse);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      
      if (err.cause?.status === 401 || err.message.includes("401")) {
        toast({ 
          title: "Session Expired", 
          description: "Please login again",
          variant: "destructive"
        });
        removeToken();
        router.push("/login");
      } else {
        toast({ 
          title: "Error", 
          description: err.message || "Failed to fetch data",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [API_BASE_URL, router]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      
      const url = editingId
        ? `${API_BASE_URL}/supplier/update-zone/${editingId}`
        : `${API_BASE_URL}/supplier/new-zone`;

      const method = editingId ? "PUT" : "POST";

      await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data,
          supplier_id: userData.userId 
        }),
      });

      toast({ 
        title: "Success!", 
        description: `Zone ${editingId ? "updated" : "created"} successfully.` 
      });
      
      await fetchData();
      setIsDialogOpen(false);
      form.reset();
      setEditingId(null);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Operation failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (zone: any) => {
    setEditingId(zone.id);
    form.reset({
      name: zone.name,
      address: zone.address,
      radius_miles: zone.radius_miles.toString(),
      latitude: zone.latitude.toString(),
      longitude: zone.longitude.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/deleteZone/${id}`, {
        method: "DELETE",
      });

      setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
      toast({ title: "Deleted", description: "Zone deleted successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete zone", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) {
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

  return (
    <DashboardContainer scrollable>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Zones Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingId(null);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Create Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Zone" : "Create New Zone"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter zone name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone Address</FormLabel>
                          <FormControl>
                            <ZonePicker
                              onChange={field.onChange}
                              setValue={form.setValue}
                              initialValue={form.getValues("address")}
                              initialCoords={{
                                lat: parseFloat(form.getValues("latitude")) || undefined,
                                lng: parseFloat(form.getValues("longitude")) || undefined,
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="radius_miles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Radius (miles)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter radius in miles"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hidden fields for coordinates */}
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : editingId ? "Update" : "Create"} Zone
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {zones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No zones found</p>
                <Button 
                  onClick={() => {
                    setEditingId(null);
                    setIsDialogOpen(true);
                  }}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create First Zone
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Radius</TableHead>
                    
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>{zone.address || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{zone.radius_miles} miles</Badge>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(zone)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(zone.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default Page;