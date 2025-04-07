
"use client";
import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
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
import { removeToken, getToken } from "@/components/utils/auth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  ExtraSpace: z.array(z.string()).optional().default([]),
});

const VehicleDetailsForm = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [supplierId, setSupplierId] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<any[]>([]);
  const [vehicleModels, setVehicleModels] = useState<any[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      setSupplierId(userData.userId);

      const [vehicles, types, brands, models] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/supplier/getVehicle/${userData.userId}`),
        fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleType`),
        fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleBrand`),
        fetchWithAuth(`${API_BASE_URL}/supplier/GetVehicleModel`),
      ]);

      setVehicleDetails(vehicles?.data || vehicles || []);
      setVehicleTypes(types?.data || types || []);
      setVehicleBrands(brands?.data || brands || []);
      setVehicleModels(models?.data || models || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.cause?.status === 401 || error.message.includes("401")) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        removeToken();
        window.location.href = "/login";
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, [isDialogOpen]);

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

  useEffect(() => {
    if (isDialogOpen && !editingId) {
      form.reset({
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
      });
    }
  }, [isDialogOpen, editingId]);

  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const extraSpaceOptions = [
    "Roof Rack",
    "Trailer Hitch",
    "Extended Cargo Space",
  ];

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const submitData = {
        ...data,
        ExtraSpace: data.ExtraSpace || [],
        SupplierId: supplierId,
      };

      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateVehicle/${editingId}`
        : `${API_BASE_URL}/supplier/Createvehicle`;

      await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      toast({
        title: "Success!",
        description: `Vehicle ${editingId ? "updated" : "created"} successfully.`,
      });

      await fetchData();
      setIsDialogOpen(false);
      setEditingId(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      if (error.cause?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        removeToken();
        window.location.href = "/login";
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingId(vehicle.id);
    const extraSpaceValue =
      typeof vehicle.ExtraSpace === "string"
        ? JSON.parse(vehicle.ExtraSpace)
        : vehicle.ExtraSpace || [];
        
    form.reset({
      VehicleType: vehicle.VehicleType || "",
      VehicleBrand: vehicle.VehicleBrand || "",
      ServiceType: vehicle.ServiceType || "",
      VehicleModel: vehicle.VehicleModel || "",
      Doors: Number(vehicle.Doors) || 1,
      Seats: Number(vehicle.Seats) || 1,
      Cargo: vehicle.Cargo || "",
      Passengers: Number(vehicle.Passengers) || 1,
      MediumBag: Number(vehicle.MediumBag) || 1,
      SmallBag: Number(vehicle.SmallBag) || 1,
      ExtraSpace: Array.isArray(extraSpaceValue) ? extraSpaceValue : [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/DeleteVehicle/${id}`, {
        method: "DELETE",
      });

      setVehicleDetails((prev) => prev.filter((vehicle) => vehicle.id !== id));
      toast({ title: "Deleted", description: "Vehicle deleted successfully!" });
    } catch (error: any) {
      console.error("Deletion error:", error);
      if (error.cause?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        removeToken();
        window.location.href = "/login";
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !vehicleDetails.length) {
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
            <CardTitle>Vehicle Details</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingId(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Vehicle" : "Add New Vehicle"}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh] w-full pr-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-4 p-1"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="VehicleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Type <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Vehicle Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vehicleTypes.map((type) => (
                                      <SelectItem
                                        key={type.id}
                                        value={type.VehicleType}
                                      >
                                        {type.VehicleType}
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
                          name="VehicleBrand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Brand <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Vehicle Brand" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vehicleBrands.map((brand) => (
                                      <SelectItem
                                        key={brand.id}
                                        value={brand.VehicleBrand}
                                      >
                                        {brand.VehicleBrand}
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
                          name="ServiceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Type <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Service Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from(
                                      new Set(
                                        vehicleBrands.map(
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
                          name="VehicleModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Model <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Vehicle Model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vehicleModels.map((model) => (
                                      <SelectItem
                                        key={model.id}
                                        value={model.VehicleModel}
                                      >
                                        {model.VehicleModel}
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
                          name="Doors"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Doors <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value.toString()}
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
                              <FormLabel>Seats <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value.toString()}
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
                              <FormLabel>Cargo Space (litres)</FormLabel>
                              <FormControl>
                                <Input
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
                              <FormLabel>Passengers <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value.toString()}
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

                        <FormField
                          control={form.control}
                          name="MediumBag"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medium Bag <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
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
                              <FormLabel>Small Bag <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
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

                        <FormField
                          control={form.control}
                          name="ExtraSpace"
                          render={({ field }) => {
                            const value = field.value || [];
                            return (
                              <FormItem className="md:col-span-2">
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

                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : editingId ? "Update" : "Create"} Vehicle
                        </Button>
                      </div>
                    </form>
                  </Form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardHeader>
          {/* <CardContent>
            {vehicleDetails.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No vehicles available</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Vehicle
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Luggage</TableHead>
                    <TableHead>Extras</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleDetails.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        <div>{vehicle.VehicleBrand}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.VehicleModel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vehicle.VehicleType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{vehicle.ServiceType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>Seats: {vehicle.Seats}</span>
                          <span>Doors: {vehicle.Doors}</span>
                          <span>Passengers: {vehicle.Passengers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>Medium: {vehicle.MediumBag}</span>
                          <span>Small: {vehicle.SmallBag}</span>
                          {vehicle.Cargo && <span>Cargo: {vehicle.Cargo}L</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.ExtraSpace?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {vehicle.ExtraSpace.map((extra, index) => (
                              <Badge key={index} variant="secondary">
                                {extra}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(vehicle.id)}
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
          </CardContent> */}

<CardContent>
  {vehicleDetails.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-gray-500">No vehicles available</p>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="mt-4"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Your First Vehicle
      </Button>
    </div>
  ) : (
    <>
      {/* Desktop Table (hidden on mobile) */}
      <div className="table-container hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Luggage</TableHead>
              <TableHead>Extras</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleDetails.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  <div>{vehicle.VehicleBrand}</div>
                  <div className="text-sm text-muted-foreground">
                    {vehicle.VehicleModel}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{vehicle.VehicleType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{vehicle.ServiceType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>Seats: {vehicle.Seats}</span>
                    <span>Doors: {vehicle.Doors}</span>
                    <span>Passengers: {vehicle.Passengers}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>Medium: {vehicle.MediumBag}</span>
                    <span>Small: {vehicle.SmallBag}</span>
                    {vehicle.Cargo && <span>Cargo: {vehicle.Cargo}L</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {vehicle.ExtraSpace?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {vehicle.ExtraSpace.map((extra, index) => (
                        <Badge key={index} variant="secondary">
                          {extra}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards (hidden on desktop) */}
      <div className="mobile-container md:hidden space-y-4">
        {vehicleDetails.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader className="flex flex-row justify-between items-start p-4">
              <div>
                <CardTitle className="text-lg">
                  {vehicle.VehicleBrand} {vehicle.VehicleModel}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{vehicle.VehicleType}</Badge>
                  <Badge>{vehicle.ServiceType}</Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(vehicle)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vehicle.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Capacity</div>
                <div>
                  <div>Seats: {vehicle.Seats}</div>
                  <div>Doors: {vehicle.Doors}</div>
                  <div>Passengers: {vehicle.Passengers}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Luggage</div>
                <div>
                  <div>Medium: {vehicle.MediumBag}</div>
                  <div>Small: {vehicle.SmallBag}</div>
                  {vehicle.Cargo && <div>Cargo: {vehicle.Cargo}L</div>}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <div className="text-sm font-medium text-gray-500">Extras</div>
                {vehicle.ExtraSpace?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {vehicle.ExtraSpace.map((extra, index) => (
                      <Badge key={index} variant="secondary">
                        {extra}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )}
</CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default VehicleDetailsForm;