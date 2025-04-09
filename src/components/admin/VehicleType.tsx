
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pencil,Trash2 } from "lucide-react";
const formSchema = z.object({
  VehicleType: z.string().min(1, { message: "Vehicle Type is required" }),
});

const VehicleType = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [types, setTypes] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { VehicleType: "" },
  });

  useEffect(() => {
    fetchTypes();
  }, []);
  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/GetVehicleType`);
      if (!response.ok) throw new Error("Failed to fetch vehicle types");
  
      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid data format");
      }
  
      setTypes(result.data); // Use result.data instead of result
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      setTypes([]); // Prevent issues if fetch fails
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateVehicleTypes/${editingId}`
        : `${API_BASE_URL}/supplier/CreateVehicleType`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save vehicle type");

      toast({ title: "Success", description: `Vehicle Type ${editingId ? "updated" : "added"} successfully!` });
      form.reset();
      setEditingId(null);
      fetchTypes();
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleEdit = (type: any) => {
    setEditingId(type.id);
    form.setValue("VehicleType", type.VehicleType);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/DeleteVehicleType/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete vehicle type");

      toast({ title: "Deleted", description: "Vehicle Type removed successfully!" });
      fetchTypes();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete vehicle type", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Vehicle Type" : "Add Vehicle Type"}</CardTitle>
          <CardDescription>{editingId ? "Update the selected type" : "Add a new type"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="VehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sedan, SUV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingId ? "Update Type" : "Add Type"}</Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>
                  Cancel
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Display Existing Vehicle Types */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="">
                <th className="border border-gray-300 p-2 font-normal">Type</th>
                <th className="border border-gray-300 p-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border border-gray-200">
                  <td className="p-2">{type.VehicleType}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => handleEdit(type)} variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(type.id)} variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleType;
