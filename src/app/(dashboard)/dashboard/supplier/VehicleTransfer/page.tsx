
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
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { removeToken } from "@/components/utils/auth";

const transferSchema = z.object({
  rows: z.array(
    z.object({
      uniqueId: z.string().min(1, { message: "Vehicle is required" }), // Vehicle ID
      SelectZone: z.string().min(1, { message: "Zone is required" }),
      Price: z.string().min(1, { message: "Price is required" }),
      Extra_Price: z.string().min(1, { message: "Extra Price is required" }),
      Currency: z.string().min(1, { message: "Currency is required" }),
      TransferInfo: z.string().optional(),
      NightTime: z.enum(["yes", "no"]).optional(),
      NightTime_Price: z.string().optional(),
      transferId: z.string().optional(),
      vehicleTax: z.string().optional(),
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
  vehicleTax: string,
          parking: string,
          tollTax: string,
          driverCharge: string,
          driverTips: string,
};

const VehicleTransfer = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRows, setEditingRows] = useState<
    { index: number; transferId: string | null }[]
  >([]);
  const [editingTransferId, setEditingTransferId] = useState<string | null>(
    null
  );
  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      rows: [
        {
          uniqueId: "",
          SelectZone: "",
          Price: "",
          Extra_Price: "",
          Currency: "Rs",
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

    // Handle empty responses
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
    form.setValue(
      "rows",
      [
        ...currentRows,
        {
          uniqueId: "",
          SelectZone: "",
          Price: "",
          Extra_Price: "",
          Currency: "Rs",
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
    // Set editing state
    setEditingTransferId(transfer.id);
    setIsEditing(true);
  
    // Get current form values
    const currentRows = form.getValues("rows");
    
    // Replace the first row with the transfer data
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
    
    // Scroll to form
    document.getElementById('transfer-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleDelete = async (id: string, index: number) => {
    try {
      // Delete the transfer
      await fetchWithAuth(`${API_BASE_URL}/supplier/deleteTransfer/${id}`, {
        method: "DELETE",
      });

      // Remove the deleted transfer from the form state
      const rows = form.getValues("rows");
      form.setValue(
        "rows",
        rows.filter((_, i) => i !== index)
      );

      // Fetch updated transfer list
      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      if (!userData || !userData.userId) throw new Error("User data not found");

      const transfersResponse = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
      );

      if (!transfersResponse) throw new Error("Failed to fetch transfers");

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

  const handleSubmit = async (data: z.infer<typeof transferSchema>) => {
    setIsSubmitting(true);

    try {
      const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
      const promises = [];

      for (const row of data.rows) {
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
          vehicleTax: row.vehicleTax,
          parking: row.parking,
          tollTax: row.tollTax,
          driverCharge: row.driverCharge,
          driverTips: row.driverTips,
        };

        if (row.transferId) {
          // Update existing transfer
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
          // Create new transfer
          promises.push(
            fetchWithAuth(`${API_BASE_URL}/supplier/new_transfer`, {
              method: "POST",
              body: JSON.stringify({ rows: [transferData] }),
            })
          );
        }
      }

      // Wait for all requests to complete
      await Promise.all(promises);

      // Refresh data
      const updatedTransfers = await fetchWithAuth(
        `${API_BASE_URL}/supplier/getTransferBySupplierId/${userData.userId}`
      );
      setTransfers(updatedTransfers);

      toast({
        title: "Success",
        description: "Transfers saved successfully",
      });

      // Reset form
      setEditingRows([]);
      form.reset({
        rows: [
          {
            uniqueId: "",
            SelectZone: "",
            Price: "",
            Extra_Price: "",
            Currency: "Rs",
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
                              <FormLabel>Select Zone</FormLabel>
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
                              <FormLabel>Currency</FormLabel>
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
                              <FormLabel>Price</FormLabel>
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
                              <FormLabel>Extra Price Per Mile</FormLabel>
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

          {transfers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Existing Transfers</h3>
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
                  {transfers.map((transfer, index) => {
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
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTransfer(transfer)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button> */}
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
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardContainer>
  );
};

export default VehicleTransfer;
