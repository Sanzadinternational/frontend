// "use client";
// import { useState, useEffect } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// // Validation Schema
// const formSchema = z.object({
//   VehicleType: z.string().min(1, { message: "Vehicle Type is required" }),
//   VehicleBrand: z.string().min(1, { message: "Vehicle Brand is required" }),
//   ServiceType: z.string().min(1, { message: "Service Type is required" }),
//   VehicleModel: z.string().optional(),
//   Doors: z.number().min(1, { message: "Doors are required" }),
//   Seats: z.number().min(1, { message: "Seats are required" }),
//   Cargo: z.string().optional(),
//   Passengers: z.number().min(1, { message: "Passengers are required" }),
//   MediumBag: z.number().min(1, { message: "Medium Bag is required" }),
//   SmallBag: z.number().min(1, { message: "Small Bag is required" }),
//   ExtraSpace: z.array(z.string()).optional(),
// });
// interface VehicleBrandData {
//   id: number;
//   VehicleBrand: string;
//   ServiceType: string;
// }

// const VehicleDetailsForm = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [SupplierId, setSupplierId] = useState();
//   const [vehicleTypes, setVehicleTypes] = useState([]);
//   const [vehicleBrands, setVehicleBrands] = useState<VehicleBrandData[]>([]);
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [vehicleModels, setVehicleModels] = useState([]);

//   // ✅ Fetch User & Vehicles in One Efficient Call
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//   //       setSupplierId(userData.userId);

//   //     } catch (err: any) {
//   //       console.error("Error fetching data:", err);
//   //       removeToken();
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch user data
//         const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setSupplierId(userData.userId);

//         // Fetch vehicle data
//         const [typeResponse, brandServiceResponse, modelResponse] =
//           await Promise.all([
//             fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
//             fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
//             fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
//           ]);
//           if (!typeResponse.ok || !brandServiceResponse.ok || !modelResponse.ok) {
//             throw new Error("Failed to fetch data. Check API endpoints.");
//           }
//           const vehicleTypesData = await typeResponse.json();
//           const brandServiceData = await brandServiceResponse.json();
//           const vehicleModelsData = await modelResponse.json();

//           console.log("Vehicle Types:", vehicleTypesData);
//           console.log("Brands & Services:", brandServiceData);
//           console.log("Vehicle Models:", vehicleModelsData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         removeToken(); // Remove token and handle logout if necessary
//       }
//     };

//     fetchData();
//   }, []);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       VehicleType: "",
//       VehicleBrand: "",
//       ServiceType: "",
//       VehicleModel: "",
//       Doors: 1,
//       Seats: 1,
//       Cargo: "",
//       Passengers: 1,
//       MediumBag: 1,
//       SmallBag: 1,
//       ExtraSpace: [],
//     },
//   });

//   const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
//   const extraSpaceOptions = [
//     "Roof Rack",
//     "Trailer Hitch",
//     "Extended Cargo Space",
//   ];

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     console.log("Form Submitted:", data); // Log form values

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/supplier/Createvehicle`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, SupplierId: SupplierId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save vehicle details");
//       }

//       toast({ title: "Success!", description: "Vehicle details saved." });
//       form.reset();
//     } catch (error) {
//       toast({ title: "Error", description: (error as Error).message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Vehicle Details & Luggage Info</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-6"
//           >
//             {/* Vehicle Details */}
//             <div className="relative flex py-3 items-center">
//               <div className="flex-grow border-t border-gray-400"></div>
//               <span className="flex-shrink mx-4 text-gray-400">
//                 Vehicle Details
//               </span>
//               <div className="flex-grow border-t border-gray-400"></div>
//             </div>
//             <div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                 {/* Vehicle Type */}
//                 <FormField
//                   control={form.control}
//                   name="VehicleType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Type</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Vehicle Type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {/* <SelectItem value="Sedan">Sedan</SelectItem>
//                         <SelectItem value="SUV">SUV</SelectItem>
//                         <SelectItem value="XUV">XUV</SelectItem>
//                         <SelectItem value="MPV6">MPV6</SelectItem> */}
//                             {vehicleTypes.map((type) => (
//                               <SelectItem key={type.id} value={type.name}>
//                                 {type.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Vehicle Brand */}
//                 <FormField
//                   control={form.control}
//                   name="VehicleBrand"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Brand</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Vehicle Brand" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {/* <SelectItem value="Audi">Audi</SelectItem>
//                         <SelectItem value="Mercedes">Mercedes</SelectItem>
//                         <SelectItem value="Toyota">Toyota</SelectItem> */}
//                             {vehicleBrands && vehicleBrands.length > 0 ? (
//                               vehicleBrands?.map((item) => (
//                                 <SelectItem
//                                   key={item.id}
//                                   value={item.VehicleBrand}
//                                 >
//                                   {item.VehicleBrand}
//                                 </SelectItem>
//                               ))
//                             ) : (
//                               <SelectItem disabled>
//                                 No Vehicle Brands Available
//                               </SelectItem>
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="ServiceType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Service Type</FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           value={`${field.value}`}
//                           onValueChange={(value) => field.onChange(value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Service Type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {vehicleBrands?.length > 0 ? (
//                               // Extract unique Service Types using Set
//                               [
//                                 ...new Set(
//                                   vehicleBrands.map((item) => item.ServiceType)
//                                 ),
//                               ].map((service, index) => (
//                                 <SelectItem key={index} value={service}>
//                                   {service}
//                                 </SelectItem>
//                               ))
//                             ) : (
//                               <SelectItem disabled>
//                                 No Service Types Available
//                               </SelectItem>
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="VehicleModel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Model</FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           value={`${field.value}`}
//                           onValueChange={(value) => field.onChange(value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Vehicle Model" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {/* <SelectItem value="A-ONE">A-ONE</SelectItem>
//                                           <SelectItem value="M-TWO">M-TWO</SelectItem>
//                                           <SelectItem value="T-Z">T-Z</SelectItem>
//                                           <SelectItem value="MPV">MPV</SelectItem>
//                                            */}
//                             {vehicleModels.map((model) => (
//                               <SelectItem key={model.id} value={model.name}>
//                                 {model.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 justify-between items-center gap-2 pt-2">
//                 <FormField
//                   control={form.control}
//                   name="Doors"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Doors</FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           value={`${field.value}`}
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Doors" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {numbers.map((door) => (
//                               <SelectItem value={`${door}`} key={door}>
//                                 {door}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="Seats"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Seats</FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           value={`${field.value}`}
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Seats" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {numbers.map((seat) => (
//                               <SelectItem value={`${seat}`} key={seat}>
//                                 {seat}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="Cargo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel
//                       // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
//                       >
//                         Cargo Space (litres)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                           placeholder="Enter Cargo"
//                           {...field}
//                           type="number"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="Passengers"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Passengers</FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           value={`${field.value}`}
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Passengers" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {numbers.map((pax) => (
//                               <SelectItem value={`${pax}`} key={pax}>
//                                 {pax}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             {/* Luggage Info */}
//             <div className="relative flex py-3 items-center">
//               <div className="flex-grow border-t border-gray-400"></div>
//               <span className="flex-shrink mx-4 text-gray-400">
//                 Luggage Info
//               </span>
//               <div className="flex-grow border-t border-gray-400"></div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 items-baseline gap-2">
//               <div className="grid grid-cols-2 gap-2">
//                 {/* Medium Bag */}
//                 <FormField
//                   control={form.control}
//                   name="MediumBag"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Medium Bag</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={String(field.value)}
//                           onValueChange={(val) => field.onChange(Number(val))}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Medium Bag" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {numbers.map((num) => (
//                               <SelectItem key={num} value={`${num}`}>
//                                 {num}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="SmallBag"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Small Bag</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={String(field.value)}
//                           onValueChange={(val) => field.onChange(Number(val))}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Small Bag" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {numbers.map((num) => (
//                               <SelectItem key={num} value={`${num}`}>
//                                 {num}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {/* Extra Space */}
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="ExtraSpace"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Extra Space</FormLabel>
//                       <FormControl>
//                         <div className="flex flex-col gap-2">
//                           {extraSpaceOptions.map((option) => (
//                             <div
//                               key={option}
//                               className="flex items-center space-x-2"
//                             >
//                               <Checkbox
//                                 checked={field.value?.includes(option)}
//                                 onCheckedChange={(isChecked) => {
//                                   field.onChange(
//                                     isChecked
//                                       ? [...(field.value || []), option]
//                                       : field.value?.filter(
//                                           (item) => item !== option
//                                         )
//                                   );
//                                 }}
//                               />
//                               <span>{option}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <Button type="submit">
//               {isLoading ? "Saving..." : "Save Vehicle Details"}
//               {/* Save Vehicle Details */}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default VehicleDetailsForm;

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// ✅ Validation Schema
const formSchema = z.object({
  VehicleType: z.string().min(1, { message: "Vehicle Type is required" }),
  VehicleBrand: z.string().min(1, { message: "Vehicle Brand is required" }),
  ServiceType: z.string().min(1, { message: "Service Type is required" }),
  VehicleModel: z.string().min(1, { message: "Vehicle Model is required" }),
    Doors: z.number().min(1, { message: "Doors are required" }),
  Seats: z.number().min(1, { message: "Seats are required" }),
  Cargo: z.string().optional(),
  Passengers: z.number().min(1, { message: "Passengers are required" }),
  MediumBag: z.number().min(1, { message: "Medium Bag is required" }),
  SmallBag: z.number().min(1, { message: "Small Bag is required" }),
  ExtraSpace: z.array(z.string()).optional(),
});

// ✅ Type Definitions
interface VehicleBrandData {
  id: number;
  VehicleBrand: string;
  ServiceType: string;
}

interface VehicleTypeData {
  id: number;
  name: string;
}

interface VehicleModelData {
  id: number;
  name: string;
}

const VehicleDetailsForm = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [SupplierId, setSupplierId] = useState("");

  // ✅ State for API Data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeData[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrandData[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModelData[]>([]);

  // ✅ Fetch User & Vehicle Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setSupplierId(userData.userId);

        // Fetch all vehicle-related data
        const [typeRes, brandRes, modelRes] = await Promise.all([
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
        ]);

        console.log("Vehicle Types:", typeRes.data);
        console.log("Brands & Services:", brandRes.data);
        console.log("Vehicle Models:", modelRes.data);

        // ✅ Store Data
        setVehicleTypes(typeRes?.data || []);
        setVehicleBrands(Array.isArray(brandRes) ? brandRes : []);
        setVehicleModels(modelRes?.data || []);
        // Extract unique service types from brand response
        const uniqueServices = [
          ...new Set(
            brandRes.data.map((item: VehicleBrandData) => item.ServiceType)
          ),
        ];
        setServiceTypes(uniqueServices);
      } catch (error) {
        console.error("Error fetching data:", error);
        removeToken(); // Handle unauthorized errors
      }
    };

    fetchData();
  }, []);

  // ✅ React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      VehicleType: "",
      VehicleBrand: "",
      ServiceType: "",
      VehicleModel: "",
            Doors: 1,
      Seats: 1,
      Cargo: "",
      Passengers: 1,
      MediumBag: 1,
      SmallBag: 1,
      ExtraSpace: [],
    },
  });
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const extraSpaceOptions = [
    "Roof Rack",
    "Trailer Hitch",
    "Extended Cargo Space",
  ];

  // ✅ Form Submit
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form Submitted:", data);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/supplier/Createvehicle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, SupplierId }),
      });

      if (!response.ok) throw new Error("Failed to save vehicle details");

      toast({ title: "Success!", description: "Vehicle details saved." });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details & Luggage Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* ✅ Vehicle Type */}
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
               <span className="flex-shrink mx-4 text-gray-400">
                 Vehicle Details
               </span>
              <div className="flex-grow border-t border-gray-400"></div>
           </div>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <FormField
              control={form.control}
              name="VehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vehicle Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.length > 0 ? (
                          vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.VehicleType}>
                              {type.VehicleType}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No Vehicle Types Available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Vehicle Brand */}

            <FormField
              control={form.control}
              name="VehicleBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Brand</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vehicle Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleBrands?.length > 0 ? (
                          vehicleBrands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.VehicleBrand}
                            >
                              {brand.VehicleBrand}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No Vehicle Brands Available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Service Type */}

            <FormField
              control={form.control}
              name="ServiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleBrands.length > 0 ? (
                          Array.from(
                            new Set(
                              vehicleBrands?.map((brand) => brand.ServiceType)
                            )
                          ).map((serviceType, index) => (
                            <SelectItem key={index} value={serviceType}>
                              {serviceType}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No Service Types Available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Vehicle Model */}
            <FormField
              control={form.control}
              name="VehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Model</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vehicle Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleModels.length > 0 ? (
                          vehicleModels.map((model) => (
                            <SelectItem
                              key={model.id}
                              value={model.VehicleModel}
                            >
                              {model.VehicleModel}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No Vehicle Models Available
                          </SelectItem>
                        )}
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
                           value={`${field.value}`}
                           onValueChange={(value) =>
                             field.onChange(Number(value))
                           }
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
                           value={`${field.value}`}
                           onValueChange={(value) =>
                             field.onChange(Number(value))
                           }
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
                           type="number"
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
                           value={`${field.value}`}
                           onValueChange={(value) =>
                             field.onChange(Number(value))
                           }
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
             {/* Luggage Info */}
             <div className="relative flex py-3 items-center">
               <div className="flex-grow border-t border-gray-400"></div>
               <span className="flex-shrink mx-4 text-gray-400">
                 Luggage Info
               </span>
               <div className="flex-grow border-t border-gray-400"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 items-baseline gap-2">
               <div className="grid grid-cols-2 gap-2">
                 {/* Medium Bag */}
                 <FormField
                   control={form.control}
                   name="MediumBag"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Medium Bag</FormLabel>
                       <FormControl>
                         <Select
                           value={String(field.value)}
                           onValueChange={(val) => field.onChange(Number(val))}
                         >
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Medium Bag" />
                           </SelectTrigger>
                           <SelectContent>
                             {numbers.map((num) => (
                               <SelectItem key={num} value={`${num}`}>
                                 {num}
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
                           value={String(field.value)}
                           onValueChange={(val) => field.onChange(Number(val))}
                         >
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Small Bag" />
                           </SelectTrigger>
                           <SelectContent>
                             {numbers.map((num) => (
                               <SelectItem key={num} value={`${num}`}>
                                 {num}
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
               {/* Extra Space */}
               <div>
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
                                   field.onChange(
                                     isChecked
                                       ? [...(field.value || []), option]
                                       : field.value?.filter(
                                           (item) => item !== option
                                         )
                                   );
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
            <Button type="submit">
              {isLoading ? "Saving..." : "Save Vehicle Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsForm;
