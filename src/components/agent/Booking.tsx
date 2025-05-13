"use client";

import { Car } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  mobile: z.string().min(1, { message: "Mobile Number is required" }),
  paymentMethod: z.enum(["pay_now", "already_paid"]),
  referenceNumber: z.string().optional(),
});

const Booking = ({ bookingInfo, setBookingInfo, nextStep }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("pay_now");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      paymentMethod: "pay_now",
      referenceNumber: "",
    },
  });

  const handleSubmit = async (data) => {
    if (!bookingInfo) {
      console.error("Booking info is missing");
      return;
    }

    const bookingData = {
      suplier_id: bookingInfo?.vehicle?.suplier_id,
      vehicle_id: bookingInfo?.vehicle?.vehicle_id,
      agent_id: bookingInfo?.agent_id,
      pickup_location: bookingInfo?.pickup,
      drop_location: bookingInfo?.dropoff,
      pickup_lat: bookingInfo?.pickup_lat,
      pickup_lng: bookingInfo?.pickup_lng,
      drop_lat: bookingInfo?.drop_lat,
      drop_lng: bookingInfo?.drop_lng,
      distance_miles: bookingInfo?.distance_miles,
      price: bookingInfo?.vehicle?.price,
      targetCurrency:bookingInfo?.targetCurrency,
      agent_address:bookingInfo?.agent_address,
      agent_city:bookingInfo?.agent_city,
      agent_country:bookingInfo?.agent_country,
      agent_zipcode:bookingInfo?.agent_zipcode,
      reference_number:
        data.paymentMethod === "already_paid" ? data.referenceNumber : null,
      passenger_name: data.name,
      passenger_email: data.email,
      passenger_phone: data.mobile,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/${
          data.paymentMethod === "pay_now"
            ? "payment/payment-iniciate"
            : "payment/referencePayment"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );
      console.log(bookingData);
      if (!response.ok) throw new Error("Failed to submit booking");
      const result = await response.json();

      if (result.url && result.access_code && result.encRequest) {
        // Create and submit a form dynamically
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.url;

        const accessCodeInput = document.createElement("input");
        accessCodeInput.type = "hidden";
        accessCodeInput.name = "access_code";
        accessCodeInput.value = result.access_code;

        const encRequestInput = document.createElement("input");
        encRequestInput.type = "hidden";
        encRequestInput.name = "encRequest";
        encRequestInput.value = result.encRequest;

        form.appendChild(accessCodeInput);
        form.appendChild(encRequestInput);
        document.body.appendChild(form);
        form.submit(); // Auto-submit the form
      } else {
        console.error("Invalid response from the server");
      }

      console.log("Booking created successfully:", result);

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been created successfully!",
      });
      console.log(
        "Passenger Info - Name:",
        data.name,
        "Email:",
        data.email,
        "Mobile:",
        data.mobile
      );

      // ✅ Update bookingInfo with booking_id
      setBookingInfo((prev) => ({
        ...prev,
        orderId: result.orderId, // Ensure order_id is stored
        passenger: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
        },
      }));
      if (data.paymentMethod !== "pay_now") {
        nextStep();
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking.",
        variant: "destructive",
      });
    }
  };

  // ✅ Calculate price (double if return date and return time are available)
  const basePrice = Number(bookingInfo?.vehicle?.price || 0);
  const extraCost = Number(bookingInfo?.extraCost || 0);
  const isReturnTrip = bookingInfo?.returnDate && bookingInfo?.returnTime;
  const totalPrice = (basePrice + extraCost) * (isReturnTrip ? 2 : 1); // Double price for return trip
  if (!bookingInfo) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Card className="md:w-1/3">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            <Car width={20} height={20} />
            <Separator className="shrink" />
          </div>
          <dl>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd>{bookingInfo?.vehicle?.brand || "N/A"}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-muted-foreground">Transfer Details</dt>
              <dd>
                {bookingInfo?.pickup} to {bookingInfo?.dropoff}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total Cost</dt>
              <dd>{`${bookingInfo?.targetCurrency} ${totalPrice.toFixed(
                2
              )}`}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <ScrollArea className="md:w-2/3 rounded-xl border">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Transfer Details</CardTitle>
            <CardTitle>Passenger Information (Lead Passenger)</CardTitle>
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
                        <Input {...field} />
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
                        <Input type="email" {...field} />
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
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setPaymentMethod(val);
                        }}
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="pay_now" id="pay_now" />
                          </FormControl>
                          <FormLabel htmlFor="pay_now">Pay Now</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem
                              value="already_paid"
                              id="already_paid"
                            />
                          </FormControl>
                          <FormLabel htmlFor="already_paid">
                            Already Paid
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormItem>
                  )}
                />
                {paymentMethod === "already_paid" && (
                  <FormField
                    control={form.control}
                    name="referenceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button type="submit">Proceed</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default Booking;
