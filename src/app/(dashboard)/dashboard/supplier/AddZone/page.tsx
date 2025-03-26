// "use client";
// import { useState,useEffect } from "react";
// import ZonePicker from "@/components/ZonePicker";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import { removeToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";
// // Validation Schema
// const formSchema = z.object({

//   name: z.string().min(1, { message: "Zone is required" }),
//   address: z.string().min(1, { message: "Zone Address is required" }),
//   radius_miles: z.string().min(1, { message: "Distance is required" }),
//   latitude: z.string().min(1, { message: "Latitude is required" }),
//   longitude: z.string().min(1, { message: "Longitude is required" }),
// });

// const Page = () => {
//   const { toast } = useToast();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [SupplierId,setSupplierId] = useState();

//   // ✅ Fetch User & Vehicles in One Efficient Call
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//           setSupplierId(userData.userId);

//         } catch (err: any) {
//           console.error("Error fetching data:", err);
//           removeToken();
//         }
//       };

//       fetchData();
//     }, []);
//   const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from(
//       { length: (stop - start) / step + 1 },
//       (_, index) => start + index * step
//     );

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name:"",
//       address: "",
//       radius_miles: "",
//       latitude: "",
//       longitude: "",
//     },
//   });

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     console.log("Form Submitted:", data); // Log form values
//     try {
//       const response = await fetch(`${API_BASE_URL}/supplier/new-zone`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({...data, supplier_id: SupplierId}),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save Zone");
//       }

//       toast({ title: "Success!", description: "Zone saved." });
//       form.reset();
//     } catch (error) {
//       toast({ title: "Error", description: (error as Error).message });
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Create Zone</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//           <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Create Zone</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Create Zone"
//                               {...field}
//                               value={field.value || ""}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//             {/* Zone Selection */}
//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Zone Center</FormLabel>
//                   <FormControl>
//                     <ZonePicker onChange={field.onChange} setValue={form.setValue} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Base Distance Selection */}
//             <FormField
//               control={form.control}
//               name="radius_miles"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Base Distance</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Base Distance" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {baseDistance(30, 200, 10).map((distance) => (
//                           <SelectItem value={`${distance}`} key={distance}>
//                             {distance}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit">Create Zone</Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default Page;

// "use client";

// import { useEffect, useState } from "react";
// import ZonePicker from "@/components/ZonePicker";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
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
// import { removeToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";

// // ✅ Validation Schema
// const formSchema = z.object({
//   name: z.string().min(1, { message: "Zone is required" }),
//   address: z.string().min(1, { message: "Zone Address is required" }),
//   radius_miles: z.string().min(1, { message: "Distance is required" }),
//   latitude: z.string().min(1, { message: "Latitude is required" }),
//   longitude: z.string().min(1, { message: "Longitude is required" }),
// });

// const Page = () => {
//   const { toast } = useToast();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [SupplierId, setSupplierId] = useState();
//   const [zones, setZones] = useState([]);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // ✅ Fetch User & Zones
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setSupplierId(userData.userId);

//         const zoneResponse = await fetch(`${API_BASE_URL}/supplier/getZones`);
//         if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
//         const data = await zoneResponse.json();
//         setZones(data);
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         removeToken();
//       }
//     };

//     fetchData();
//   }, []);

//   const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

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

//   // ✅ Submit Form (Create or Update)
//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       const url = editingId
//         ? `${API_BASE_URL}/supplier/updateZone/${editingId}`
//         : `${API_BASE_URL}/supplier/new-zone`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, supplier_id: SupplierId }),
//       });

//       if (!response.ok) throw new Error("Failed to save Zone");

//       toast({ title: "Success!", description: `Zone ${editingId ? "updated" : "created"} successfully.` });
//       form.reset();
//       setEditingId(null);
//       fetchData(); // Refresh data
//     } catch (error) {
//       toast({ title: "Error", description: (error as Error).message });
//     }
//   };

//   // ✅ Edit Zone
//   const handleEdit = (zone: any) => {
//     setEditingId(zone.id);
//     form.setValue("name", zone.name);
//     form.setValue("address", zone.address);
//     form.setValue("radius_miles", zone.radius_miles);
//     form.setValue("latitude", zone.latitude);
//     form.setValue("longitude", zone.longitude);
//   };

//   // ✅ Delete Zone
//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/supplier/deleteZone/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete zone");

//       toast({ title: "Deleted", description: "Zone deleted successfully!" });
//       fetchData();
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to delete zone", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 gap-2 my-4">
//       {/* ✅ Form Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>{editingId ? "Edit Zone" : "Create Zone"}</CardTitle>
//           <CardDescription>
//             {editingId ? "Update the selected zone" : "Add a new zone"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//               <FormField control={form.control} name="name" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Zone Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Zone Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="address" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Zone Center</FormLabel>
//                   <FormControl>
//                     <ZonePicker onChange={field.onChange} setValue={form.setValue} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="radius_miles" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Base Distance</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Base Distance" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {baseDistance(5, 200, 5).map((distance) => (
//                           <SelectItem value={`${distance}`} key={distance}>
//                             {distance}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <Button type="submit">{editingId ? "Update Zone" : "Create Zone"}</Button>
//               {editingId && (
//                 <Button variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>
//                   Cancel
//                 </Button>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//       </Card>

//       {/* ✅ Table Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Existing Zones</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <table className="w-full border-collapse border border-gray-200">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2">Zone Name</th>
//                 <th className="border border-gray-300 p-2">Address</th>
//                 <th className="border border-gray-300 p-2">Base Distance (miles)</th>
//                 <th className="border border-gray-300 p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {zones.map((zone) => (
//                 <tr key={zone.id} className="border border-gray-200">
//                   <td className="p-2">{zone.name}</td>
//                   <td className="p-2">{zone.address}</td>
//                   <td className="p-2">{zone.radius_miles}</td>
//                   <td className="p-2 flex gap-2">
//                     <Button onClick={() => handleEdit(zone)} variant="outline">Edit</Button>
//                     <Button onClick={() => handleDelete(zone.id)} variant="destructive">Delete</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Page;

// "use client";

// import { useEffect, useState } from "react";
// import ZonePicker from "@/components/ZonePicker";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
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
// import { removeToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";

// // ✅ Validation Schema
// const formSchema = z.object({
//   name: z.string().min(1, { message: "Zone is required" }),
//   address: z.string().min(1, { message: "Zone Address is required" }),
//   radius_miles: z.string().min(1, { message: "Distance is required" }),
//   latitude: z.string().min(1, { message: "Latitude is required" }),
//   longitude: z.string().min(1, { message: "Longitude is required" }),
// });

// const Page = () => {
//   const { toast } = useToast();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [SupplierId, setSupplierId] = useState();
//   const [zones, setZones] = useState([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   // ✅ Fetch User & Zones
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setSupplierId(userData.userId);

//         const zoneResponse = await fetch(`${API_BASE_URL}/supplier/getZone`);
//         if (!zoneResponse.ok) throw new Error("Failed to fetch zones");
//         const data = await zoneResponse.json();
//         setZones(data);
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         removeToken();
//       }
//     };

//     fetchData();
//   }, []);

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

//   // ✅ Submit Form (Create or Update)
//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       const url = editingId
//         ? `${API_BASE_URL}/supplier/update-zone/${editingId}`
//         : `${API_BASE_URL}/supplier/new-zone`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, supplier_id: SupplierId }),
//       });

//       if (!response.ok) throw new Error("Failed to save Zone");

//       toast({
//         title: "Success!",
//         description: `Zone ${editingId ? "updated" : "created"} successfully.`,
//       });
//       form.reset();
//       setEditingId(null);
//       setShowForm(false);
//       fetchData(); // Refresh data
//     } catch (error) {
//       toast({ title: "Error", description: (error as Error).message });
//     }
//   };

//   // ✅ Edit Zone
//   const handleEdit = (zone: any) => {
//     setEditingId(zone.id);
//     form.setValue("name", zone.name);
//     form.setValue("address", zone.address);
//     form.setValue("radius_miles", zone.radius_miles);
//     form.setValue("latitude", zone.latitude);
//     form.setValue("longitude", zone.longitude);
//     setShowForm(true);
//   };

//   // ✅ Delete Zone
//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/supplier/deleteZone/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete zone");

//       toast({ title: "Deleted", description: "Zone deleted successfully!" });
//       fetchData();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete zone",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* ✅ Table Section with Create Button */}
//       {!showForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Existing Zones</CardTitle>
//             <Button onClick={() => setShowForm(true)}>Create Zone</Button>
//           </CardHeader>
//           <CardContent>
//             <table className="w-full border-collapse border border-gray-200">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 p-2">Zone Name</th>
//                   <th className="border border-gray-300 p-2">Address</th>
//                   <th className="border border-gray-300 p-2">
//                     Base Distance (miles)
//                   </th>
//                   <th className="border border-gray-300 p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {zones.map((zone) => (
//                   <tr key={zone.id} className="border border-gray-200">
//                     <td className="p-2">{zone.name}</td>
//                     <td className="p-2">{zone.address}</td>
//                     <td className="p-2">{zone.radius_miles}</td>
//                     <td className="p-2 flex gap-2">
//                       <Button
//                         onClick={() => handleEdit(zone)}
//                         variant="outline"
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         onClick={() => handleDelete(zone.id)}
//                         variant="destructive"
//                       >
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//       )}

//       {/* ✅ Form Section (Displayed on Button Click) */}
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
//                             {baseDistance(30, 200, 10).map((distance) => (
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

//                 <Button type="submit">
//                   {editingId ? "Update Zone" : "Create Zone"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditingId(null);
//                     form.reset();
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Page;



// "use client";

// import { useEffect, useState } from "react";
// import ZonePicker from "@/components/ZonePicker";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
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
// import { removeToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";

// // ✅ Validation Schema
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
//   const [SupplierId, setSupplierId] = useState<string | null>(null);
//   const [zones, setZones] = useState([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);



//   const fetchData = async () => {
//     try {
//       // Check token using fetchWithAuth
//       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//       setSupplierId(userData.userId);

//       // Fetch zones
//       const zoneResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getZone`);
//       setZones(zoneResponse);
//     } catch (err: any) {
//       console.error("Error fetching data:", err);
//       toast({ title: "Error", description: err.message });

//       // If unauthorized, redirect to login
//       if (err.message.includes("401")) {
//         removeToken();
//         router.push("/login"); // Redirect to login
//       }
//     }
//   };
//   // ✅ Check Authorization and Fetch Data
//   useEffect(() => {
   

//     fetchData();
//   }, [API_BASE_URL, router]);

//   const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

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

//   // ✅ Submit Form (Create or Update)
//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       const url = editingId
//         ? `${API_BASE_URL}/supplier/update-zone/${editingId}`
//         : `${API_BASE_URL}/supplier/new-zone`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, supplier_id: SupplierId }),
//       });

//       toast({ title: "Success!", description: `Zone ${editingId ? "updated" : "created"} successfully.` });
//       await fetchData();
//       form.reset();
//       setEditingId(null);
//       setShowForm(false);
//     } catch (error) {
//       toast({ title: "Error", description: (error as Error).message });
//     }
//   };

//   // ✅ Edit Zone
//   const handleEdit = (zone: any) => {
//     console.log("Editing Zone Data:", zone);
  
//     setEditingId(zone.id);
//     form.setValue("name", zone.name ?? "");
//     form.setValue("address", zone.address ?? "");
//     form.setValue("radius_miles", zone.radius_miles?.toString() ?? "");
//     form.setValue("latitude", zone.latitude?.toString() ?? "");
//     form.setValue("longitude", zone.longitude?.toString() ?? "");
//     setShowForm(true);
//   };
  
  

//   // ✅ Delete Zone
//   const handleDelete = async (id: string) => {
//     try {
//       await fetchWithAuth(`${API_BASE_URL}/supplier/deleteZone/${id}`, {
//         method: "DELETE",
//       });
  
//       setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
//       toast({ title: "Deleted", description: "Zone deleted successfully!" });
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to delete zone", variant: "destructive" });
//     }
//   };
  

//   return (
//     <div className="space-y-4">
//       {/* ✅ Table Section with Create Button */}
//       {!showForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Existing Zones</CardTitle>
//             <Button onClick={() => setShowForm(true)}>Create Zone</Button>
//           </CardHeader>
//           <CardContent>
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
//                     <td colSpan={4} className="text-center p-4">No zones available</td>
//                   </tr>
//                 ) : (
//                   zones.map((zone) => (
//                     <tr key={zone.id} className="border border-gray-200">
//                       <td className="p-2">{zone.name}</td>
//                       <td className="p-2">{zone.address || "N/A"}</td>
//                       <td className="p-2">{zone.radius_miles}</td>
//                       <td className="p-2 flex gap-2">
//                         <Button onClick={() => handleEdit(zone)} variant="outline">Edit</Button>
//                         <Button onClick={() => handleDelete(zone.id)} variant="destructive">Delete</Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//       )}
//       {/* ✅ Form Section (Displayed on Button Click) */}
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
//                             {baseDistance(30, 200, 10).map((distance) => (
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

//                 <Button type="submit">
//                   {editingId ? "Update Zone" : "Create Zone"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditingId(null);
//                     form.reset();
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Page;


"use client";

import { useEffect, useState } from "react";
import ZonePicker from "@/components/ZonePicker";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// ✅ Validation Schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Zone is required" }),
  address: z.string().min(1, { message: "Zone Address is required" }),
  radius_miles: z.string().min(1, { message: "Distance is required" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
});

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [SupplierId, setSupplierId] = useState<string | null>(null);
  const [zones, setZones] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      setSupplierId(userData.userId);

      const zoneResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getZone`);
      setZones(zoneResponse);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      toast({ title: "Error", description: err.message });

      if (err.message.includes("401")) {
        removeToken();
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_BASE_URL, router]);

  const baseDistance = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      radius_miles: "",
      latitude: "",
      longitude: "",
    },
  });

  // ✅ Submit Form (Create or Update)
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = editingId
        ? `${API_BASE_URL}/supplier/update-zone/${editingId}`
        : `${API_BASE_URL}/supplier/new-zone`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, supplier_id: SupplierId }),
      });

      toast({ title: "Success!", description: `Zone ${editingId ? "updated" : "created"} successfully.` });
      await fetchData();
      form.reset();
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message });
    }
  };

  // ✅ Edit Zone - Fixed to properly set all form values
  const handleEdit = (zone: any) => {
    setEditingId(zone.id);
    form.reset({
      name: zone.name || "",
      address: zone.address || "",
      radius_miles: zone.radius_miles?.toString() || "30", // Default to 30 if not set
      latitude: zone.latitude?.toString() || "",
      longitude: zone.longitude?.toString() || "",
    });
    setShowForm(true);
  };

  // ✅ Delete Zone
  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/deleteZone/${id}`, {
        method: "DELETE",
      });
  
      setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
      toast({ title: "Deleted", description: "Zone deleted successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete zone", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Table Section with Create Button */}
      {!showForm && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Existing Zones</CardTitle>
            <Button onClick={() => setShowForm(true)}>Create Zone</Button>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Zone Name</th>
                  <th className="border border-gray-300 p-2">Address</th>
                  <th className="border border-gray-300 p-2">Base Distance (miles)</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4">No zones available</td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr key={zone.id} className="border border-gray-200">
                      <td className="p-2">{zone.name}</td>
                      <td className="p-2">{zone.address || "N/A"}</td>
                      <td className="p-2">{zone.radius_miles}</td>
                      <td className="p-2 flex gap-2">
                        <Button onClick={() => handleEdit(zone)} variant="outline">Edit</Button>
                        <Button onClick={() => handleDelete(zone.id)} variant="destructive">Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ✅ Form Section (Displayed on Button Click) */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Zone" : "Create Zone"}</CardTitle>
            <CardDescription>
              {editingId ? "Update the selected zone" : "Add a new zone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Zone Name" {...field} />
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
                      <FormLabel>Zone Center</FormLabel>
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
                      <FormLabel>Base Distance</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Base Distance" />
                          </SelectTrigger>
                          <SelectContent>
                            {baseDistance(30, 200, 10).map((distance) => (
                              <SelectItem value={`${distance}`} key={distance}>
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

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Update Zone" : "Create Zone"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;