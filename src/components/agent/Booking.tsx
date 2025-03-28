
"use client"

import { Car } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email" }),
    mobile: z.string().min(1, { message: "Mobile Number is required" }),
    paymentMethod: z.enum(["pay_now", "already_paid"]),
    referenceNumber: z.string().optional(),
});

const Booking = ({ bookingInfo, nextStep }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState<"pay_now" | "already_paid">("pay_now");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            paymentMethod: "pay_now",
            referenceNumber: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!bookingInfo) {
            console.error("Booking info is missing");
            return;
        }

        const requestData = {
            supplierId:bookingInfo?.vehicle?.supplierId,
            vehicleId:bookingInfo?.vehicle?.vehicleId,
            agentId:bookingInfo?.agentId,
            pickup: bookingInfo?.pickup,
            dropoff: bookingInfo?.dropoff,
            passenger: bookingInfo?.pax,
            date: bookingInfo?.date,
            time: bookingInfo?.time,
            returnDate: bookingInfo?.returnDate,
            returnTime: bookingInfo?.returnTime,
            estimated_trip_time: bookingInfo?.estimatedTime,
            distance: bookingInfo?.distance,
            vehicle_name: bookingInfo?.vehicle?.brand,
            mediumBag: bookingInfo?.vehicle?.mediumBag,
            passenger_name: data.name,
            passenger_email: data.email,
            passenger_contact_no: data.mobile,
            paymentMethod: data.paymentMethod,
            referenceNumber: data.paymentMethod === "already_paid" ? data.referenceNumber : null,
        };
        console.log("Booking Data:", requestData);
        try {
            const response = await fetch(`${API_BASE_URL}/Booking/Create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit booking");
            }

            const result = await response.json();
            console.log("Booking created successfully:", result);

            toast({
                title: "Booking Confirmed",
                description: "Your booking has been created successfully!",
            });

            if (data.paymentMethod === "pay_now") {
                // Redirect to third-party payment gateway
                window.location.href = "https://your-payment-gateway.com/pay"; // Replace with actual payment link
            } else {
                nextStep(); // Proceed if already paid
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

    if (!bookingInfo) {
        return <p>Loading...</p>;
    }

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
                            <dd>{bookingInfo?.pickup} to {bookingInfo?.dropoff}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Total Cost</dt>
                            <dd>{`${bookingInfo?.vehicle?.currency} ${(Number(bookingInfo?.vehicle?.price || 0) + (Number(bookingInfo?.extraCost) || 0)).toFixed(2)}`}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
            <ScrollArea className="md:w-2/3 rounded-md border">
                <h2 className="text-2xl px-4 pt-2">Transfer Details</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Passenger Information</CardTitle>
                        <CardDescription>Details are used in Voucher</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Full Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="mobile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter Contact Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                
                                {/* Payment Method - Radio Buttons */}
                                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <RadioGroup value={field.value} onValueChange={(val) => {
                                            field.onChange(val);
                                            setPaymentMethod(val as "pay_now" | "already_paid");
                                        }}>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="pay_now" />
                                                </FormControl>
                                                <FormLabel>Pay Now</FormLabel>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="already_paid" />
                                                </FormControl>
                                                <FormLabel>Already Paid</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormItem>
                                )} />
                                
                                {paymentMethod === "already_paid" && (
                                    <FormField control={form.control} name="referenceNumber" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reference Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Reference Number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
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
