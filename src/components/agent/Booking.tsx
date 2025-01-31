
import { Car } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter valid email" }),
  mobile: z.string().min(1, { message: "Mobile Number is required" }),
  agree: z.boolean().default(false).optional(),
});
const Booking = ({bookingInfo}) => {

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      agree: true,
    },
  });
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  if (!bookingInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Card className="md:w-1/3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Summary</CardTitle>
            {/* <Button variant="secondary">Edit Quote</Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            <Car width={20} height={20} />
            <Separator className="shrink" />
          </div>
          {/* <dl className="">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd>{bookingInfo?.brand ||'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Transfer Details</dt>
              <dd>{bookingInfo?.pickup} to {bookingInfo?.dropoff}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Service Date</dt>
              <dd>{bookingInfo?.date} at {bookingInfo?.time}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Transfer Cost</dt>
              <dd>{bookingInfo?.vehicle.currency} {bookingInfo?.vehicle.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Extra Cost</dt>
              <dd>{bookingInfo?.extraCost||"N/A"}</dd>
            </div>
          </dl> */}
          <dl className="">
  <div className="flex justify-between">
    <dt className="text-muted-foreground">Vehicle</dt>
    <dd>{bookingInfo?.vehicle?.brand || 'N/A'}</dd>
  </div>
  <div className="flex flex-col">
    <dt className="text-muted-foreground">Transfer Details</dt>
    <dd>{bookingInfo?.pickup} to {bookingInfo?.dropoff}</dd>
  </div>
  <div className="flex justify-between">
    <dt className="text-muted-foreground">Service Date</dt>
    <dd>{bookingInfo?.date} at {bookingInfo?.time}</dd>
  </div>
  <div className="flex justify-between">
    <dt className="text-muted-foreground">Transfer Cost</dt>
    <dd>{bookingInfo?.vehicle?.currency} {bookingInfo?.vehicle?.price?.toFixed(2)}</dd>
  </div>
  <div className="flex justify-between">
    <dt className="text-muted-foreground">Extra Cost</dt>
    <dd>{bookingInfo?.extraCost || '0'}</dd>
  </div>
</dl>

        </CardContent>
        <CardFooter>
          <div className="w-2/3 rounded-sm px-2 py-2 bg-secondary">
            Total Cost: {`${bookingInfo?.vehicle?.currency} ${(Number(bookingInfo?.vehicle?.price) + (Number(bookingInfo?.extraCost) || 0)).toFixed(2)}`}
          </div>
        </CardFooter>
      </Card>
      <ScrollArea className="md:w-2/3 whitespace-nowrap rounded-md border">
        <h2 className="text-2xl px-4 pt-2">Transfer Details</h2>
        <div className="md:h-80 md:w-[75%] space-x-4 p-4">
          <Card className="">
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
              <CardDescription>Details are used in Voucher</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Contact Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agree"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          
                          <FormLabel>
                            I have read and agree to the terms & conditions and
                            privacy policy.
                          </FormLabel>
                          
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Continue To Pay</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Booking;
