// "use client";
// // import { useState,useEffect } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // import { useToast } from "@/hooks/use-toast";






// // Validation Schema
// const formSchema = z.object({

//   SelectZone: z.string().min(1, { message: "Zone is required" }),
//   BaseDistance: z.string().min(1, { message: "Distance is required" }),
// });

// const AddZone = () => {

//  const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from(
//       { length: (stop - start) / step + 1 },
//       (_, index) => start + index * step
//     );
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//         SelectZone: "",
//       BaseDistance: "",
//     },
//   });



//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     console.log("Form Submitted:", data); // Log form values
   
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Transfer Details</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//           <div className="relative flex py-3 items-center">
//               <div className="flex-grow border-t border-gray-400"></div>
//               <span className="flex-shrink mx-4 text-gray-400">
//               Select Zone
//               </span>
//               <div className="flex-grow border-t border-gray-400"></div>
//             </div>
//           <FormField
//               control={form.control}
//               name="SelectZone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Select Zone</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Zone" />
//                       </SelectTrigger>
//                       <SelectContent>
//                        <SelectItem value="Zone A">Zone A</SelectItem>
//                        <SelectItem value="Zone B">Zone B</SelectItem>
//                        <SelectItem value="Zone C">Zone C</SelectItem>
//                        <SelectItem value="Zone D">Zone D</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="BaseDistance"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Base Distance</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Base Distance" />
//                       </SelectTrigger>
//                       <SelectContent>
//                       {baseDistance(30, 200, 10).map((distance) => (
//                                   <SelectItem
//                                     value={`${distance}`}
//                                     key={distance}
//                                   >
//                                     {distance}
//                                   </SelectItem>
//                                 ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
           
//             <Button type="submit">
//               Create Zone
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AddZone;




// "use client";
// import { useState } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import AutocompleteInput from "@/components/Location";

// // Validation Schema
// const formSchema = z.object({
//   SelectZone: z.string().min(1, { message: "Zone is required" }),
//   BaseDistance: z.string().min(1, { message: "Distance is required" }),
// });

// const AddZone = () => {
//   const [zoneLocation, setZoneLocation] = useState<{
//     lat: number;
//     lng: number;
//     address: string;
//   } | null>(null);

//   const baseDistance = (start: number, stop: number, step: number) =>
//     Array.from(
//       { length: (stop - start) / step + 1 },
//       (_, index) => start + index * step
//     );
//     const googleMapsApiKey = "AIzaSyAjXkEFU-hA_DSnHYaEjU3_fceVwQra0LI";
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       SelectZone: "",
//       BaseDistance: "",
//     },
//   });

//   const handleSelectZone = (place: any) => {
//     const location = place.geometry.location;
//     const address = place.formatted_address;

//     setZoneLocation({
//       lat: location.lat(),
//       lng: location.lng(),
//       address,
//     });

//     form.setValue("SelectZone", address);

//     console.log("Selected Zone Details:");
//     console.log("Address:", address);
//     console.log("Latitude:", location.lat());
//     console.log("Longitude:", location.lng());
//   };

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     console.log("Form Submitted:", data);
//     if (zoneLocation) {
//       console.log("Zone Latitude:", zoneLocation.lat);
//       console.log("Zone Longitude:", zoneLocation.lng);
//       console.log("Zone Address:", zoneLocation.address);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Transfer Details</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <div className="relative flex py-3 items-center">
//               <div className="flex-grow border-t border-gray-400"></div>
//               <span className="flex-shrink mx-4 text-gray-400">Select Zone</span>
//               <div className="flex-grow border-t border-gray-400"></div>
//             </div>

//             {/* Zone Selection with Google Maps Autocomplete */}
//             <FormField
//               control={form.control}
//               name="SelectZone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Select Zone</FormLabel>
//                   <FormControl>
//                     <AutocompleteInput
//                       apiKey={googleMapsApiKey}
//                       onPlaceSelected={handleSelectZone}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Base Distance Selection */}
//             <FormField
//               control={form.control}
//               name="BaseDistance"
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

// export default AddZone;


"use client";
import { useState,useEffect } from "react";
import ZonePicker from "@/components/ZonePicker";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// Validation Schema
const formSchema = z.object({
  
  name: z.string().min(1, { message: "Zone is required" }),
  address: z.string().min(1, { message: "Zone Address is required" }),
  radius_miles: z.string().min(1, { message: "Distance is required" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
});

const Page = () => {
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [SupplierId,setSupplierId] = useState();
  
  // ✅ Fetch User & Vehicles in One Efficient Call
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
          setSupplierId(userData.userId);
         
        } catch (err: any) {
          console.error("Error fetching data:", err);
          removeToken();
        } 
      };
  
      fetchData();
    }, []);
  const baseDistance = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, index) => start + index * step
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      address: "",
      radius_miles: "",
      latitude: "",
      longitude: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form Submitted:", data); // Log form values
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/new-zone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, supplier_id: SupplierId}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save Zone");
      }
  
      toast({ title: "Success!", description: "Zone saved." });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Create Zone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Create Zone"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            {/* Zone Selection */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Center</FormLabel>
                  <FormControl>
                    <ZonePicker onChange={field.onChange} setValue={form.setValue} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base Distance Selection */}
            <FormField
              control={form.control}
              name="radius_miles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Distance</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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

            <Button type="submit">Create Zone</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Page;
