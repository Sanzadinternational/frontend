"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import DashboardContainer from "@/components/layout/DashboardContainer";
interface Vehicle {
  id: string;
  uniqueId: string;
  VehicleBrand: string;
  ServiceType: string;
}

interface Surcharge {
  id: string;
  VehicleName: string;
  From: string;
  To: string | null;
  SurgeChargePrice: string;
  vehicle_id: string | null;
  supplier_id: string;
}

const formSchema = z.object({
  uniqueId: z.string().min(1, { message: "Please select a vehicle" }),
  DateRange: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date().nullable(),
  }),
  SurgeChargePrice: z
    .string()
    .min(1, { message: "Surcharge is required" })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Must be a valid number",
    }),
});

const Surcharge = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [surcharges, setSurcharges] = useState<Surcharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: "",
      SurgeChargePrice: "",
      DateRange: { from: null, to: null },
    },
    mode: "onChange",
  });
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No authentication token found");

        const userData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setSupplierId(userData.userId);

        const [vehiclesData, surchargesData] = await Promise.all([
          fetchWithAuth(
            `${API_BASE_URL}/supplier/getVehiclebySupplierId/${userData.userId}`
          ),
          fetchWithAuth(
            `${API_BASE_URL}/supplier/GetSurgeCharges/${userData.userId}`
          ),
        ]);

        setVehicles(
          Array.isArray(vehiclesData)
            ? vehiclesData.map((v) => ({
                id: v.id?.toString(),
                uniqueId: v.id?.toString(),
                VehicleBrand: v.VehicleBrand || "Unknown Brand",
                ServiceType: v.ServiceType || "Unknown Service",
              }))
            : []
        );

        setSurcharges(Array.isArray(surchargesData) ? surchargesData : []);
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
  }, [API_BASE_URL, router, toast, showForm]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const selectedVehicle = vehicles.find(
        (v) => v.uniqueId === data.uniqueId
      );
      if (!selectedVehicle) throw new Error("Invalid vehicle selection");

      const payload = {
        VehicleName: selectedVehicle.VehicleBrand,
        From: format(data.DateRange.from, "yyyy-MM-dd"),
        // From: data.DateRange?.from || null,
        To: data.DateRange.to ? format(data.DateRange.to, "yyyy-MM-dd") : null,
        // To: data.DateRange?.to || null,
        SurgeChargePrice: data.SurgeChargePrice,
        uniqueId: data.uniqueId,
        supplier_id: supplierId,
      };

      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateSurgeCharges/${editingId}`
        : `${API_BASE_URL}/supplier/SurgeCharges`;

      await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      toast({
        title: "Success",
        description: `Surcharge ${
          editingId ? "updated" : "added"
        } successfully!`,
      });
      console.log("formdata:", payload);
      setShowForm(false);
      setEditingId(null);
      form.reset();

      // Refresh data
      const updatedSurcharges = await fetchWithAuth(
        `${API_BASE_URL}/supplier/GetSurgeCharges/${supplierId}`
      );
      setSurcharges(Array.isArray(updatedSurcharges) ? updatedSurcharges : []);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit surcharge",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (surcharge: Surcharge) => {
    setEditingId(surcharge.id);

    // Convert ID to string if needed
    const vehicleId = surcharge.vehicle_id ? String(surcharge.vehicle_id) : "";

    form.reset({
      uniqueId: vehicleId,
      SurgeChargePrice: surcharge.SurgeChargePrice,
      DateRange: {
        from: new Date(surcharge.From),
        to: surcharge.To ? new Date(surcharge.To) : null,
      },
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/supplier/DeleteSurgeCharges/${id}`, {
        method: "DELETE",
      });

      setSurcharges((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Deleted",
        description: "Surcharge deleted successfully",
      });
    } catch (error: any) {
      console.error("Deletion error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete surcharge",
        variant: "destructive",
      });
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
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer scrollable>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Surcharge Management</CardTitle>
            <Button
              onClick={() => {
                setEditingId(null);
                form.reset({
                  uniqueId: "",
                  SurgeChargePrice: "",
                  DateRange: { from: null, to: null },
                });
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Surcharge
            </Button>
          </CardHeader>

          <CardContent>
            {showForm || editingId ? (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="uniqueId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Vehicle <span className="text-red-500">*</span></FormLabel>
                          <Select
                            value={field.value}
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.trigger("uniqueId");
                            }}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
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
                          <FormLabel>Select Date Range <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value} // Ensure selected value is controlled
                              onChange={(date) => {
                                field.onChange(date); // Update form state
                                form.trigger("DateRange"); // Trigger validation
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="SurgeChargePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surcharge Amount <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter surcharge amount"
                              {...field}
                              disabled={isSubmitting}
                              type="number"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                form.trigger("SurgeChargePrice");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          form.reset();
                        }}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isValid}
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : editingId
                          ? "Update"
                          : "Submit"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : null}

            {/* {surcharges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No surcharges available</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Surcharge
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Surcharge</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surcharges.map((surcharge) => {
                    const vehicle = vehicles.find(
                      (v) => v.uniqueId === surcharge.vehicle_id
                    );
                    const fromDate = new Date(surcharge.From);
                    const toDate = surcharge.To ? new Date(surcharge.To) : null;

                    return (
                      <TableRow key={surcharge.id}>
                        <TableCell className="font-medium">
                          {vehicle?.VehicleBrand ||
                            surcharge.VehicleName ||
                            "Unknown Vehicle"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{format(fromDate, "MMM dd, yyyy")}</span>
                            {toDate && (
                              <span className="text-sm text-muted-foreground">
                                to {format(toDate, "MMM dd, yyyy")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            ${surcharge.SurgeChargePrice}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(surcharge)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(surcharge.id)}
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
            )} */}

{surcharges.length === 0 ? (
  <div className="text-center py-8">
    <p className="text-gray-500">No surcharges available</p>
    <Button onClick={() => setShowForm(true)} className="mt-4">
      <Plus className="mr-2 h-4 w-4" /> Add Your First Surcharge
    </Button>
  </div>
) : (
  <>
    {/* Desktop Table (hidden on mobile) */}
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Surcharge</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surcharges.map((surcharge) => {
            const vehicle = vehicles.find(
              (v) => v.uniqueId === surcharge.vehicle_id
            );
            const fromDate = new Date(surcharge.From);
            const toDate = surcharge.To ? new Date(surcharge.To) : null;

            return (
              <TableRow key={surcharge.id}>
                <TableCell className="font-medium">
                  {vehicle?.VehicleBrand ||
                    surcharge.VehicleName ||
                    "Unknown Vehicle"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(fromDate, "MMM dd, yyyy")}</span>
                    {toDate && (
                      <span className="text-sm text-muted-foreground">
                        to {format(toDate, "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    ${surcharge.SurgeChargePrice}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(surcharge)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(surcharge.id)}
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
    </div>

    {/* Mobile Cards (hidden on desktop) */}
    <div className="md:hidden space-y-4">
      {surcharges.map((surcharge) => {
        const vehicle = vehicles.find(
          (v) => v.uniqueId === surcharge.vehicle_id
        );
        const fromDate = new Date(surcharge.From);
        const toDate = surcharge.To ? new Date(surcharge.To) : null;

        return (
          <Card key={surcharge.id}>
            <CardHeader className="flex flex-row justify-between items-start p-4">
              <div>
                <CardTitle className="text-lg">
                  {vehicle?.VehicleBrand ||
                    surcharge.VehicleName ||
                    "Unknown Vehicle"}
                </CardTitle>
                <div className="mt-2">
                  <Badge variant="outline">
                    ${surcharge.SurgeChargePrice}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(surcharge)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(surcharge.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Date Range</div>
                <div className="text-sm">
                  {format(fromDate, "MMM dd, yyyy")}
                  {toDate && (
                    <span className="text-muted-foreground">
                      {" "}to {format(toDate, "MMM dd, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </>
)}
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default Surcharge;
