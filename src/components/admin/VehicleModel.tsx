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
  vehicleModel: z.string().min(1, {
    message: "Vehicle Model is required",
  }),
})

const VehicleModel = () => {
  const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: { vehicleModel: "" },
          });
          const handleSubmit =  (data: z.infer<typeof formSchema>) => {
            console.log(data);
          }
        return (
            <div className="flex my-8">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Model</CardTitle>
              <CardDescription>Add Vehicle Model for Supplier Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input placeholder="eg. A4,Q8" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will visible in Supplier Dashboard
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Model</Button>
              </form>
            </Form>
            </CardContent>
            </Card>
            </div>
          )
}

export default VehicleModel