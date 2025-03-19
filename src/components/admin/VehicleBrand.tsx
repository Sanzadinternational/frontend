// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// const formSchema = z.object({
//   VehicleBrand: z.string().min(1, {
//     message: "Vehicle Brand is required",
//   }),
//   serviceType: z.string().min(1, {
//     message: "Service Type is required",
//   }),
// });

// const VehicleBrand = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { toast } = useToast();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { VehicleBrand: "", serviceType: "" },
//   });

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//           try {
//               const response = await fetch(`${API_BASE_URL}/supplier/CreateVehicleBrand`, {
//                   method: "POST",
//                   headers: {
//                       "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify(data),
//               });
  
//               if (!response.ok) {
//                   toast({
//                       title: "Vehicle Brand",
//                       description: "Failed to save Vehicle Brand",
//                       variant: "destructive",
//                   });
//                   return; // Prevents further execution
//               }
  
//               const result = await response.json();
//               console.log("Success:", result);
  
//               toast({
//                   title: "Vehicle Brand",
//                   description: "Vehicle Brand added successfully!",
//               });
  
//               form.reset(); // Clear the form after success
//           } catch (error) {
//               console.error("Error:", error);
//               toast({
//                   title: "Vehicle Brand",
//                   description: "Failed to add Vehicle Brand",
//                   variant: "destructive",
//               });
//           }
//       };

//   return (
//     <div className="flex my-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Vehicle Brand</CardTitle>
//           <CardDescription>
//             Add Vehicle Brand for Supplier Dashboard
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="VehicleBrand"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Vehicle Brand</FormLabel>
//                     <FormControl>
//                       <Input placeholder="eg. Audi, Toyota" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="serviceType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Service Type</FormLabel>
//                     <FormControl>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Service Type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="standard">Standard</SelectItem>
//                           <SelectItem value="premium">Premium</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit">Add Brand</Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default VehicleBrand;



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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  VehicleBrand: z.string().min(1, { message: "Vehicle Brand is required" }),
  serviceType: z.string().min(1, { message: "Service Type is required" }),
});

const VehicleBrand = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [brands, setBrands] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null); // Track editing ID

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { VehicleBrand: "", serviceType: "" },
  });

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/GetVehicleBrands`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateVehicleBrand/${editingId}`
        : `${API_BASE_URL}/supplier/CreateVehicleBrand`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save brand");

      toast({
        title: editingId ? "Updated" : "Added",
        description: `Vehicle Brand ${editingId ? "updated" : "added"} successfully!`,
      });

      form.reset();
      setEditingId(null);
      fetchBrands(); // Refresh list
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand.id);
    form.setValue("VehicleBrand", brand.VehicleBrand);
    form.setValue("serviceType", brand.serviceType);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/DeleteVehicleBrand/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete brand");

      toast({ title: "Deleted", description: "Vehicle Brand removed successfully!" });
      fetchBrands(); // Refresh list
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete brand", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Vehicle Brand" : "Add Vehicle Brand"}</CardTitle>
          <CardDescription>{editingId ? "Update the selected brand" : "Add a new brand"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="VehicleBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Audi, Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Service Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingId ? "Update Brand" : "Add Brand"}</Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>
                  Cancel
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Display Existing Brands */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Vehicle Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="">
                <th className="border border-gray-300 p-2 font-normal">Brand</th>
                <th className="border border-gray-300 p-2 font-normal">Service Type</th>
                <th className="border border-gray-300 p-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border border-gray-200">
                  <td className="p-2">{brand.VehicleBrand}</td>
                  <td className="p-2">{brand.serviceType}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => handleEdit(brand)} variant="outline">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(brand.id)} variant="destructive">
                      Delete
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

export default VehicleBrand;
