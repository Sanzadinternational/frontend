
"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardContainer from "@/components/layout/DashboardContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface Supplier {
  id: number;
  Company_name: string;
  Currency: string;
}

interface Margin {
  id: number;
  supplier_id: number;
  Company_name: string;
  Currency: string;
  MarginPrice: string;
}

const formSchema = z.object({
  supplier_id: z.string().min(1, { message: "Supplier is required" }),
  Company_name: z.string().min(1),
  Currency: z.string().min(1),
  MarginPrice: z.string().min(1, { message: "Margin Price is required" }),
});

const AddMargin = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [margins, setMargins] = useState<Margin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: "",
      Company_name: "",
      Currency: "",
      MarginPrice: ""
    },
  });

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/AllGetSuppliers`);
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error: any) {
      console.error("Error fetching suppliers:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    }
  };

  const fetchMargins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/GetMarginData`);
      if (!response.ok) {
        throw new Error("Failed to fetch margins");
      }
      const data = await response.json();
      setMargins(data.data || []); // Access the data array from response
    } catch (error: any) {
      console.error("Error fetching margins:", error);
      toast({
        title: "Error",
        description: "Failed to load margins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchMargins();
  }, []);

  const handleSupplierChange = (supplierId: string) => {
    const selectedSupplier = suppliers.find(s => s.id.toString() === supplierId);
    if (selectedSupplier) {
      form.setValue("supplier_id", supplierId);
      form.setValue("Company_name", selectedSupplier.Company_name);
      form.setValue("Currency", selectedSupplier.Currency);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      supplier_id: parseInt(data.supplier_id),
      Company_name: data.Company_name,
      Currency: data.Currency,
      MarginPrice: data.MarginPrice
    };

    try {
      if (editingId) {
        // Update existing margin
        const response = await axios.put(
          `${API_BASE_URL}/admin/UpdateMarginData/${editingId}`,
          payload
        );
        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Margin updated successfully",
          });
          setEditingId(null);
          form.reset();
          fetchMargins();
        }
      } else {
        // Create new margin
        const response = await axios.post(
          `${API_BASE_URL}/admin/CreateMargindata`,
          payload
        );
        if (response.status === 201) {
          toast({
            title: "Success",
            description: "Margin added successfully",
          });
          form.reset();
          fetchMargins();
        }
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      const errorMessage = err.response?.data?.message || "Operation failed";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (margin: Margin) => {
    setEditingId(margin.id);
    form.setValue("supplier_id", margin.supplier_id.toString());
    form.setValue("Company_name", margin.Company_name);
    form.setValue("Currency", margin.Currency);
    form.setValue("MarginPrice", margin.MarginPrice);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/DeleteMarginData/${id}`
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Margin deleted successfully",
        });
        fetchMargins();
      }
    } catch (err: any) {
      console.error("Deletion Error:", err);
      toast({
        title: "Error",
        description: "Failed to delete margin",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  return (
    <DashboardContainer scrollable>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Margin" : "Add Margin"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {error && <p className="text-red-500">{error}</p>}
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select Supplier <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleSupplierChange(value);
                          }}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoading
                                  ? "Loading suppliers..."
                                  : "Select a supplier"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.id.toString()}
                              >
                                {supplier.Company_name} ({supplier.Currency})
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
                  name="MarginPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Margin Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter margin price"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting || isLoading}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {editingId ? "Update Margin" : "Add Margin"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Margin List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : margins.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No margins found</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Margin Price</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {margins.map((margin) => (
                      <TableRow key={margin.id}>
                        <TableCell className="font-medium">
                          {margin.Company_name}
                        </TableCell>
                        <TableCell>{margin.MarginPrice}</TableCell>
                        <TableCell>{margin.Currency}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(margin)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(margin.id)}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default AddMargin;