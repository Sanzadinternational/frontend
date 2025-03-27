"use client";
import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import DashboardContainer from "@/components/layout/DashboardContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  // ExtraSpace: z.array(z.string()).optional(),
  ExtraSpace: z.array(z.string()).optional().default([]),
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
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // ✅ Fetch User & Vehicle Data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
  //       setSupplierId(userData.userId);
  //       const vehicleResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getVehicle/${userData.userId}`);
  //       setVehicleDetails(vehicleResponse);
  //       // Fetch all vehicle-related data
  //       const [typeRes, brandRes, modelRes] = await Promise.all([
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
  //       ]);

  //       console.log("Vehicle Types:", typeRes.data);
  //       console.log("Brands & Services:", brandRes.data);
  //       console.log("Vehicle Models:", modelRes.data);

  //       // ✅ Store Data
  //       setVehicleTypes(typeRes?.data || []);
  //       setVehicleBrands(Array.isArray(brandRes) ? brandRes : []);
  //       setVehicleModels(modelRes?.data || []);
  //       // Extract unique service types from brand response
  //       const uniqueServices = [
  //         ...new Set(
  //           brandRes.data.map((item: VehicleBrandData) => item.ServiceType)
  //         ),
  //       ];
  //       setServiceTypes(uniqueServices);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       removeToken(); // Handle unauthorized errors
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);

  //       // Fetch user data
  //       const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
  //       setSupplierId(userData.userId);

  //       // Fetch vehicle data
  //       const vehicleResponse = await fetchWithAuth(`${API_BASE_URL}/supplier/getVehicle/${userData.userId}`);
  //       setVehicleDetails(vehicleResponse.data || vehicleResponse); // Handle both formats

  //       // Fetch all vehicle-related data
  //       const [typeRes, brandRes, modelRes] = await Promise.all([
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
  //         fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
  //       ]);

  //       // Handle responses properly
  //       setVehicleTypes(typeRes?.data || typeRes || []);
  //       setVehicleBrands(brandRes?.data || brandRes || []);
  //       setVehicleModels(modelRes?.data || modelRes || []);

  //       // Extract unique service types
  //       const brands = brandRes?.data || brandRes || [];
  //       const uniqueServices = [...new Set(brands.map((item: VehicleBrandData) => item.ServiceType))];
  //       setServiceTypes(uniqueServices);

  //     } catch (error: any) {
  //       console.error("Error fetching data:", error);

  //       // Only logout on 401 Unauthorized
  //       if (error.response?.status === 401) {
  //         removeToken();
  //         toast({ title: "Session Expired", description: "Please login again" });
  //       } else {
  //         toast({
  //           title: "Error",
  //           description: error.message || "Failed to fetch data"
  //         });
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setSupplierId(userData.userId);

        const fetchVehicles = async () => {
          const vehicleResponse = await fetchWithAuth(
            `${API_BASE_URL}/supplier/getVehicle/${userData.userId}`
          );
          setVehicleDetails(vehicleResponse.data || vehicleResponse);
        };

        await fetchVehicles();

        const [typeRes, brandRes, modelRes] = await Promise.all([
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
          fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
        ]);

        setVehicleTypes(typeRes?.data || typeRes || []);
        setVehicleBrands(brandRes?.data || brandRes || []);
        setVehicleModels(modelRes?.data || modelRes || []);

        const brands = brandRes?.data || brandRes || [];
        const uniqueServices = [
          ...new Set(brands.map((item: VehicleBrandData) => item.ServiceType)),
        ];
        setServiceTypes(uniqueServices);
      } catch (error) {
        console.error("Error fetching data:", error);
        if ((error as any).response?.status === 401) {
          removeToken();
        }
      }
    };

    fetchData();
  }, [showForm]); // Add showForm as dependency to refetch when form closes

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
  // const handleSubmit = async (data: z.infer<typeof formSchema>) => {
  //   console.log("Form Submitted:", data);
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/supplier/Createvehicle`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...data, SupplierId }),
  //     });

  //     if (!response.ok) throw new Error("Failed to save vehicle details");

  //     toast({ title: "Success!", description: "Vehicle details saved." });
  //     form.reset();
  //   } catch (error) {
  //     toast({ title: "Error", description: (error as Error).message });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
  //     try {
  //       const url = editingId
  //         ? `${API_BASE_URL}/supplier/UpdateVehicle/${editingId}`
  //         : `${API_BASE_URL}/supplier/Createvehicle`;

  //       const method = editingId ? "PUT" : "POST";

  //       const response = await fetchWithAuth(url, {
  //         method,
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ ...data, SupplierId }),
  //       });

  //       toast({ title: "Success!", description: `Vehicle ${editingId ? "updated" : "created"} successfully.` });
  //       form.reset();
  //       setEditingId(null);
  //       setShowForm(false);
  //     } catch (error) {
  //       toast({ title: "Error", description: (error as Error).message });
  //     }
  //   };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert ExtraSpace to JSON string if needed
      const submitData = {
        ...data,
        ExtraSpace: data.ExtraSpace || [], // Ensure it's always an array
        SupplierId,
      };

      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateVehicle/${editingId}`
        : `${API_BASE_URL}/supplier/Createvehicle`;

      const response = await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      // Force refresh of vehicle data
      const updatedResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getVehicle/${SupplierId}`
      );
      setVehicleDetails(updatedResponse.data || updatedResponse);

      toast({
        title: "Success!",
        description: `Vehicle ${
          editingId ? "updated" : "created"
        } successfully.`,
      });

      form.reset();
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  // ✅ Edit Zone - Fixed to properly set all form values
  // const handleEdit = (vehicle: any) => {
  //   setEditingId(vehicle.id);
  //   form.reset({
  //     VehicleType: vehicle.VehicleType,
  //     VehicleBrand: vehicle.VehicleBrand,
  //     ServiceType: vehicle.ServiceType,
  //     VehicleModel: vehicle.VehicleModel,
  //           Doors: Number(vehicle.Doors),
  //     Seats: Number(vehicle.Seats),
  //     Cargo: vehicle.Cargo,
  //     Passengers: Number(vehicle.Passengers),
  //     MediumBag: Number(vehicle.MediumBag),
  //     SmallBag: Number(vehicle.SmallBag),
  //     ExtraSpace: vehicle.ExtraSpace,
  //   });
  //   setShowForm(true);
  // };

  const handleEdit = (vehicle: any) => {
    setEditingId(vehicle.id);
    // Convert ExtraSpace to array if it's stored as string
    const extraSpaceValue =
      typeof vehicle.ExtraSpace === "string"
        ? JSON.parse(vehicle.ExtraSpace)
        : vehicle.ExtraSpace || [];
    form.reset({
      VehicleType: vehicle.VehicleType,
      VehicleBrand: vehicle.VehicleBrand,
      ServiceType: vehicle.ServiceType,
      VehicleModel: vehicle.VehicleModel,
      Doors: Number(vehicle.Doors),
      Seats: Number(vehicle.Seats),
      Cargo: vehicle.Cargo,
      Passengers: Number(vehicle.Passengers),
      MediumBag: Number(vehicle.MediumBag),
      SmallBag: Number(vehicle.SmallBag),
      ExtraSpace: Array.isArray(extraSpaceValue) ? extraSpaceValue : [],
    });
    setShowForm(true);
  };
  // ✅ Delete Zone
  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/DeleteVehicle/${id}`, {
        method: "DELETE",
      });

      setVehicleDetails((prevZones) =>
        prevZones.filter((vehicle) => vehicle.id !== id)
      );
      toast({ title: "Deleted", description: "Vehicle deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Vehicle",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardContainer scrollable>
      <ScrollArea className="w-[350px] md:w-[900px] whitespace-nowrap rounded-md border">
        <div className="space-y-4">
          {/* ✅ Table Section with Create Button */}
          {!showForm && (
            <Card>
              <CardHeader className="flex flex-row justify-start items-center gap-5">
                <CardTitle>Existing Zones</CardTitle>
                <Button onClick={() => setShowForm(true)}>
                  Add Vehicle Details
                </Button>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">
                        Vehicle Type
                      </th>
                      <th className="border border-gray-300 p-2">
                        Vehicle Brand
                      </th>
                      <th className="border border-gray-300 p-2">
                        Service Type
                      </th>
                      <th className="border border-gray-300 p-2">
                        Vehicle Model
                      </th>
                      <th className="border border-gray-300 p-2">Doors</th>
                      <th className="border border-gray-300 p-2">Seats</th>
                      <th className="border border-gray-300 p-2">Cargo</th>
                      <th className="border border-gray-300 p-2">Passengers</th>
                      <th className="border border-gray-300 p-2">Medium Bag</th>
                      <th className="border border-gray-300 p-2">Small Bag</th>
                      <th className="border border-gray-300 p-2">
                        Extra Space
                      </th>
                      <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleDetails.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center p-4">
                          No Vehicle available
                        </td>
                      </tr>
                    ) : (
                      vehicleDetails.map((vehicle) => (
                        <tr key={vehicle.id} className="border border-gray-200">
                          <td className="p-2">{vehicle.VehicleType}</td>
                          <td className="p-2">{vehicle.VehicleBrand}</td>
                          <td className="p-2">{vehicle.ServiceType}</td>
                          <td className="p-2">{vehicle.VehicleModel}</td>
                          <td className="p-2">{vehicle.Doors}</td>
                          <td className="p-2">{vehicle.Seats}</td>
                          <td className="p-2">{vehicle.Cargo}</td>
                          <td className="p-2">{vehicle.Passengers}</td>
                          <td className="p-2">{vehicle.MediumBag}</td>
                          <td className="p-2">{vehicle.SmallBag}</td>
                          <td className="p-2">
                            {Array.isArray(vehicle.ExtraSpace)
                              ? vehicle.ExtraSpace.join(", ")
                              : vehicle.ExtraSpace || "None"}
                          </td>
                          <td className="p-2 flex gap-2">
                            <Button
                              onClick={() => handleEdit(vehicle)}
                              variant="outline"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(vehicle.id)}
                              variant="destructive"
                            >
                              Delete
                            </Button>
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
                <CardTitle>
                  {editingId ? "Edit Vehicle" : "Create Vehicle"}
                </CardTitle>
                <CardDescription>
                  {editingId
                    ? "Update Vehicle Details & Luggage Info"
                    : "Vehicle Details & Luggage Info"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
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
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Vehicle Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vehicleTypes.length > 0 ? (
                                      vehicleTypes.map((type) => (
                                        <SelectItem
                                          key={type.id}
                                          value={type.VehicleType}
                                        >
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
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
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
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Service Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vehicleBrands.length > 0 ? (
                                      Array.from(
                                        new Set(
                                          vehicleBrands?.map(
                                            (brand) => brand.ServiceType
                                          )
                                        )
                                      ).map((serviceType, index) => (
                                        <SelectItem
                                          key={index}
                                          value={serviceType}
                                        >
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
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
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
                                  //  {...field}
                                  //  value={`${field.value}`}
                                  //  onValueChange={(value) =>
                                  //    field.onChange(Number(value))
                                  //  }
                                  value={field.value.toString()} // Convert to string for display
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Convert back to number
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
                                  //  {...field}
                                  //  value={`${field.value}`}
                                  //  onValueChange={(value) =>
                                  //    field.onChange(Number(value))
                                  //  }
                                  value={field.value.toString()} // Convert to string for display
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Convert back to number
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
                                  //  {...field}
                                  //  value={`${field.value}`}
                                  //  onValueChange={(value) =>
                                  //    field.onChange(Number(value))
                                  //  }
                                  value={field.value.toString()} // Convert to string for display
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Convert back to number
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
                                  //  value={String(field.value)}
                                  //  onValueChange={(val) => field.onChange(Number(val))}
                                  value={field.value.toString()} // Convert to string for display
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Convert back to number
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
                                  //  value={String(field.value)}
                                  //  onValueChange={(val) => field.onChange(Number(val))}
                                  value={field.value.toString()} // Convert to string for display
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Convert back to number
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
                        {/* <FormField
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
                 /> */}
                        <FormField
                          control={form.control}
                          name="ExtraSpace"
                          render={({ field }) => {
                            const value = field.value || [];
                            return (
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
                                          id={`extra-space-${option}`}
                                          checked={value.includes(option)}
                                          onCheckedChange={(checked) => {
                                            const newValue = checked
                                              ? [...value, option]
                                              : value.filter(
                                                  (item) => item !== option
                                                );
                                            field.onChange(newValue);
                                          }}
                                        />
                                        <label
                                          htmlFor={`extra-space-${option}`}
                                          className="text-sm"
                                        >
                                          {option}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                    {/* <Button type="submit">
              {isLoading ? "Saving..." : "Save Vehicle Details"}
            </Button> */}

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingId
                          ? "Update Vehicle Details"
                          : "Save Vehicle Details"}
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DashboardContainer>
  );
};

export default VehicleDetailsForm;
