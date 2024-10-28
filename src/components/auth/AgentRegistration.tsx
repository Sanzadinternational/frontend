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

// Define country and city types
interface Country {
  code: string;
  name: string;
  cities: string[];
}

const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    cities: ["New York", "Los Angeles", "Chicago"],
  },
  { code: "CA", name: "Canada", cities: ["Toronto", "Vancouver", "Montreal"] },
  {
    code: "GB",
    name: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham"],
  },
  {
    code: "IN",
    name: "India",
    cities: ["Patna", "Noida", "Delhi", "Mumbai", "Kolkata"],
  },
];

const formSchema = z.object({
  Company_name: z.string().min(1, { message: "Company Name is Required" }),
  Address: z.string().min(1, {
    message: "Address is Required",
  }),
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
  otp: z.string(),
  Office_number: z.string().min(1, {
    message: "Office No. is required",
  }),
  Mobile_number: z.string().min(1, {
    message: "Mobile No. is required",
  }),
  Currency: z.string().min(1, {
    message: "Currency is required",
  }),
  Gst_Tax_Certificate: z.string(),
});

// Type for form data
type FormData = z.infer<typeof formSchema>;

const AgentRegistration: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
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
      otp: "",
      Contact_Person: "",
    },
  });

  const handleSubmit: SubmitHandler<FormData> = async(data) => {
    try{
      const response = await fetch('http://localhost:8000/Api/V1/Agent/registration',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
      });
    }
    catch(error){
console.log(error);
    }

    console.log(data);
    router.push("/");
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
  };

  const cities: string[] =
    countries.find((country) => country.code === selectedCountry)?.cities || [];

  const tags = ["GST", "Adhar", "PAN", "Passport"];
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    form.setValue("Currency", value);
  };
  return (
    <Card>
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Your Address"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
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
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
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
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Zip Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    IATA Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    GST/VAT/TAX Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Contact Person
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Contact Person"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Email
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter Email"
                      {...field}
                    /> */}
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter Email"
                        {...field}
                      />
                      <Button type="button">Send OTP</Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter OTP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Office Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
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
                {tags.map((tag) => (
                  <>
                    <div key={tag} className="text-sm">
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
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Upload Documents
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Upload Docs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgentRegistration;
