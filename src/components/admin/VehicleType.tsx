"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
const formSchema = z.object({
  vehicleType: z.string().min(1, {
    message: "Vehicle Type is required",
  }),
})

const VehicleType = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { vehicleType: "" },
      });
      const handleSubmit =  (data: z.infer<typeof formSchema>) => {
        console.log(data);
      }
    return (
        <div className="flex my-8">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Type</CardTitle>
          <CardDescription>Add Vehicle Type for Supplier Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Sedan,SUV" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will visible in Supplier Dashboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Type</Button>
          </form>
        </Form>
        </CardContent>
        </Card>
        </div>
      )
}

export default VehicleType