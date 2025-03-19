// "use client"
 
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
//  import { useToast } from "@/hooks/use-toast"
// const formSchema = z.object({
//   VehicleModel: z.string().min(1, {
//     message: "Vehicle Model is required",
//   }),
// })

// const VehicleModel = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { toast } = useToast();
//   const form = useForm<z.infer<typeof formSchema>>({
//             resolver: zodResolver(formSchema),
//             defaultValues: { VehicleModel: "" },
//           });
//          const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//                  try {
//                      const response = await fetch(`${API_BASE_URL}/supplier/CreateVehicleModel`, {
//                          method: "POST",
//                          headers: {
//                              "Content-Type": "application/json",
//                          },
//                          body: JSON.stringify(data),
//                      });
         
//                      if (!response.ok) {
//                          toast({
//                              title: "Vehicle Model",
//                              description: "Failed to save vehicle Model",
//                              variant: "destructive",
//                          });
//                          return; // Prevents further execution
//                      }
         
//                      const result = await response.json();
//                      console.log("Success:", result);
         
//                      toast({
//                          title: "Vehicle Model",
//                          description: "Vehicle Model added successfully!",
//                      });
         
//                      form.reset(); // Clear the form after success
//                  } catch (error) {
//                      console.error("Error:", error);
//                      toast({
//                          title: "Vehicle Model",
//                          description: "Failed to add Vehicle Model",
//                          variant: "destructive",
//                      });
//                  }
//              };
//         return (
//             <div className="flex my-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Vehicle Model</CardTitle>
//               <CardDescription>Add Vehicle Model for Supplier Dashboard</CardDescription>
//             </CardHeader>
//             <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
//                 <FormField
//                   control={form.control}
//                   name="VehicleModel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Model</FormLabel>
//                       <FormControl>
//                         <Input placeholder="eg. A4,Q8" {...field} />
//                       </FormControl>
//                       <FormDescription>
//                         This will visible in Supplier Dashboard
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type="submit">Add Model</Button>
//               </form>
//             </Form>
//             </CardContent>
//             </Card>
//             </div>
//           )
// }

// export default VehicleModel



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

const formSchema = z.object({
  VehicleModel: z.string().min(1, { message: "Vehicle Model is required" }),
});

const VehicleModel = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [models, setModels] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { VehicleModel: "" },
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/GetVehicleModels`);
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = editingId
        ? `${API_BASE_URL}/supplier/UpdateVehicleModel/${editingId}`
        : `${API_BASE_URL}/supplier/CreateVehicleModel`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save vehicle model");

      toast({ title: "Success", description: `Vehicle Model ${editingId ? "updated" : "added"} successfully!` });
      form.reset();
      setEditingId(null);
      fetchModels();
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleEdit = (model: any) => {
    setEditingId(model.id);
    form.setValue("VehicleModel", model.VehicleModel);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/DeleteVehicleModel/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete vehicle model");

      toast({ title: "Deleted", description: "Vehicle Model removed successfully!" });
      fetchModels();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete vehicle model", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Vehicle Model" : "Add Vehicle Model"}</CardTitle>
          <CardDescription>{editingId ? "Update the selected model" : "Add a new model"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="VehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. A4, Q8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingId ? "Update Model" : "Add Model"}</Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>
                  Cancel
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Display Existing Vehicle Models */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Vehicle Models</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="">
                <th className="border border-gray-300 p-2 font-normal">Model</th>
                <th className="border border-gray-300 p-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border border-gray-200">
                  <td className="p-2">{model.VehicleModel}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => handleEdit(model)} variant="outline">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(model.id)} variant="destructive">
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

export default VehicleModel;
