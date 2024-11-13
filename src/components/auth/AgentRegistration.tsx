"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CountryCityAPI from "../api/CountryCityAPI";
import { useToast } from "@/hooks/use-toast";

interface Country {
  name: string;
  unicodeFlag: string;
  cities: string[];
}
  const tags = ["GST", "Adhar", "PAN", "Passport"];
const formSchema = z.object({
  Company_name: z.string().min(1, { message: "Company Name is Required" }),
  Address: z.string().min(1, { message: "Address is Required" }),
  Email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email({ message: "Please enter valid email" }),
  Password: z.string().min(1, { message: "Password is Required" }),
  Zip_code: z.string().min(1, { message: "Zipcode is Required" }),
  IATA_Code: z.string(),
  Country: z.string().min(1, { message: "Country is required" }),
  City: z.string().min(1, { message: "City is required" }),
  Gst_Vat_Tax_number: z.string().min(1, { message: "Tax Number is required" }),
  Contact_Person: z.string(),
  Otp: z.string(),
  Office_number: z.string().min(1, { message: "Office No. is required" }),
  Mobile_number: z.string().min(1, { message: "Mobile No. is required" }),
  Currency: z.string().min(1, { message: "Currency is required" }),
  Gst_Tax_Certificate: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const AgentRegistration: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false); // For sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // For verifying OTP
  // const [otp, setOtp] = useState("");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Company_name: "",
      Address: "",
      Email: "",
      Password: "",
      Country: "",
      City: "",
      Zip_code: "",
      IATA_Code: "",
      Gst_Vat_Tax_number: "",
      Otp: "",
      Contact_Person: "",
    },
  });

  const handleSendOtp = async () => {
    const email = form.getValues("Email");
    if (email) {
      setIsSendingOtp(true); // Start sending OTP
      try {
        const response = await fetch("http://localhost:8000/api/V1/agent/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setOtpSent(true);
          console.log("OTP sent to email!");
        } else {
          console.log("Failed to send OTP.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
      finally {
        setIsSendingOtp(false); // Stop sending OTP
      }
    }
  };

  const handleVerifyOtp = async () => {
    const email = form.getValues("Email");
    const otp = form.getValues("Otp");
    setIsVerifyingOtp(true); // Start verifying OTP
    try {
      const response = await fetch("http://localhost:8000/api/V1/agent/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setIsOtpVerified(true);
        console.log("OTP verified successfully!");
      } else {
        console.log("Invalid OTP.");
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }finally {
      setIsVerifyingOtp(false); // Stop verifying OTP
    }
    
  };

  const {toast} = useToast();
  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    
    if (isOtpVerified) {
      try {
        const registrationResponse = await fetch(
          "http://localhost:8000/api/V1/agent/registration",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (registrationResponse.ok) {
          toast({
            title:'User Registration',
            description:'Registered Sucessfully...'
          })
          router.push("/");
          
        } else {
          const errorData = await registrationResponse.json();
          console.log("Registration failed:", errorData);
          console.log(data);
        }
      } catch (error) {
        console.log("Error during registration:", error);
      }
    } else {
      console.log("Please verify the OTP first.");
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("Country", value);
    form.setValue("City", "");
    setSelectedCity("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    form.setValue("City", value);
    form.trigger("City"); // Ensure city validation is triggered
  };

  const cities =
    countries.find((country) => country.name === selectedCountry)?.cities || [];

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    form.setValue("Currency", value);
  };

  

  return (
    <Card>
      <CountryCityAPI onDataFetched={setCountries} />
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Register to your account with the right credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="Company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                  // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
                  >
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter Company Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Your Address"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Country
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={handleCountryChange}
                      value={selectedCountry}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries
                          .slice() // create a copy of the array
                          .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically by country name
                          .map((country) => (
                            <SelectItem
                              key={country.name}
                              value={country.name}
                            >
                              {country.name}
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
              name="City"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    City
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={handleCityChange}
                      value={selectedCity}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city,index) => (
                          <SelectItem key={index} value={city}>
                            {city}
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
              name="Zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Zip Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter Zip Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="IATA_Code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    IATA Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter IATA Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Gst_Vat_Tax_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    GST/VAT/TAX Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter GST/VAT/TAX Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Contact_Person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Contact Person
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Contact Person"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email and Send OTP */}
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter Email"
                        {...field}
                      />
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSent}
                      >
                        {isSendingOtp ? "Sending OTP..." : otpSent ? "OTP Sent" : "Send OTP"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {/* Display OTP sending message */}
                  {isSendingOtp && (
                    <p className="text-sm text-blue-500 mt-2">OTP is sending...</p>
                  )}
                </FormItem>
              )}
            />

            {/* OTP Field */}
            {otpSent && (
              <FormField
                control={form.control}
                name="Otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter OTP"
                          {...field}
                          disabled={isOtpVerified}
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isOtpVerified || isVerifyingOtp}
                        >
                          {isVerifyingOtp ? "Verifying..." : isOtpVerified ? "Verified" : "Verify OTP"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {/* Display OTP verifying message */}
                    {isVerifyingOtp && (
                      <p className="text-sm text-blue-500 mt-2">OTP is verifying...</p>
                    )}
                  </FormItem>
                )}
              />
            )}

            {isOtpVerified && (
              <>
                <FormField
                control={form.control}
                name="Password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="Office_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Office Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                        placeholder="Enter Office Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="Mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                        placeholder="Enter Mobile Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="Currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Currency
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={handleCurrencyChange}
                        value={selectedCurrency}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rs">Rs</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="ed">ED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <ScrollArea className="h-28 w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-xs uppercase font-bold text-zinc-500 dark:text-white leading-none">
                    Docs To Attach
                  </h4>
                  {tags.map((tag,index) => (
                    <>
                      <div key={index} className="text-sm">
                        {tag}
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))}
                </div>
              </ScrollArea>
  
              <FormField
                control={form.control}
                name="Gst_Tax_Certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Upload Documents
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                        placeholder="Upload Docs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgentRegistration;
