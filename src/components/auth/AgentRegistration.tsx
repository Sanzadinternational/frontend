// "use client";

// import * as z from "zod";
// import { useState } from "react";
// import Image from "next/image";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "../ui/card";
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
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import CountryCityAPI from "../api/CountryCityAPI";
// import { useToast } from "@/hooks/use-toast";
// import { ChooseCurrency } from "../constants/currency";
// interface Country {
//   name: string;
//   flag: string;
//   dialCode: string;
//   // cities: string[];
// }
// const tags = ["GST", "Adhar", "PAN", "Passport"];
// const chooseCurrency = ChooseCurrency;
// const formSchema = z.object({
//   Company_name: z.string().min(1, { message: "Company Name is Required" }),
//   Address: z.string().min(1, { message: "Address is Required" }),
//   Email: z
//     .string()
//     .min(1, { message: "Email is Required" })
//     .email({ message: "Please enter valid email" }),
//   Password: z.string().min(1, { message: "Password is Required" }),
//   Zip_code: z.string().min(1, { message: "Zipcode is Required" }),
//   IATA_Code: z.string().optional(),
//   Country: z.string().min(1, { message: "Country is required" }),
//   City: z.string().min(1, { message: "City is required" }),
//   Gst_Vat_Tax_number: z.string().min(1, { message: "Tax Number is required" }),
//   Contact_Person: z.string(),
//   Otp: z.string(),
//   Office_number: z.string().min(1, { message: "Office No. is required" }),
//   Mobile_number: z.string().min(1, { message: "Mobile No. is required" }),
//   Currency: z.string().min(1, { message: "Currency is required" }),
//   Gst_Tax_Certificate: z.any().refine((file) => file instanceof File, {
//     message: "Upload document is required",
//   }),
// });

// type FormData = z.infer<typeof formSchema>;

// const AgentRegistration: React.FC = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [selectedCountry, setSelectedCountry] = useState<string>("");
//   // const [selectedCity, setSelectedCity] = useState<string>("");
//   const [selectedCurrency, setSelectedCurrency] = useState<string>("");
//   const [selectedDialCode, setSelectedDialCode] = useState<string>("");
//   const [selectedFlag, setSelectedFlag] = useState<string>(""); // To store the Unicode flag
//   const [otpSent, setOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isSendingOtp, setIsSendingOtp] = useState(false); // For sending OTP
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // For verifying OTP
//   const [isSubmiting, setIsSubmiting] = useState(false);
//   const router = useRouter();

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       Company_name: "",
//       Address: "",
//       Email: "",
//       Password: "",
//       Country: "",
//       City: "",
//       Zip_code: "",
//       IATA_Code: "",
//       Gst_Vat_Tax_number: "",
//       Otp: "",
//       Contact_Person: "",
//     },
//   });
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const { toast } = useToast();
//   const handleSendOtp = async () => {
//     const email = form.getValues("Email");
//     if (email) {
//       setIsSendingOtp(true); // Start sending OTP
//       try {
//         const response = await fetch(`${API_BASE_URL}/agent/send-otp`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email }),
//         });

//         if (response.ok) {
//           setOtpSent(true);
//           toast({
//             title: "Sending OTP",
//             description: "OTP sent to email",
//           });
//           console.log("OTP sent to email!");
//         } else if (response.status === 406) {
//           toast({
//             title: "Error",
//             description: "This Email is already registered.",
//             variant: "destructive",
//           });
//           console.log("email already registered.");
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to send OTP.",
//             variant: "destructive",
//           });
//           console.log("Failed to send OTP.");
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: (error as Error).message,
//           variant: "destructive",
//         });
//         console.error("Error sending OTP:", error);
//       } finally {
//         setIsSendingOtp(false); // Stop sending OTP
//       }
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const email = form.getValues("Email");
//     const otp = form.getValues("Otp");
//     setIsVerifyingOtp(true); // Start verifying OTP
//     try {
//       const response = await fetch(`${API_BASE_URL}/agent/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       if (response.ok) {
//         setIsOtpVerified(true);
//         toast({
//           title: "OTP Verification",
//           description: "OTP verified successfully!",
//         });
//         console.log("OTP verified successfully!");
//       } else {
//         toast({
//           title: "OTP Verification",
//           description: "Invalid OTP.",
//           variant: "destructive",
//         });
//         console.log("Invalid OTP.");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: (error as Error).message,
//       });
//       console.log("Error verifying OTP:", error);
//     } finally {
//       setIsVerifyingOtp(false); // Stop verifying OTP
//     }
//   };

//   const handleSubmit: SubmitHandler<FormData> = async (data) => {
//     setIsSubmiting(true);

//     const officeNumberWithDialCode = `${selectedDialCode}${data.Office_number}`;
//     const mobileNumberWithDialCode = `${selectedDialCode}${data.Mobile_number}`;

//     const formData = new FormData();
//     formData.append("Company_name", data.Company_name);
//     formData.append("Address", data.Address);
//     formData.append("Email", data.Email);
//     formData.append("Password", data.Password);
//     formData.append("Zip_code", data.Zip_code);
//     formData.append("IATA_Code", data.IATA_Code);
//     formData.append("Country", data.Country);
//     formData.append("City", data.City);
//     formData.append("Gst_Vat_Tax_number", data.Gst_Vat_Tax_number);
//     formData.append("Contact_Person", data.Contact_Person);
//     formData.append("Office_number", officeNumberWithDialCode);
//     formData.append("Mobile_number", mobileNumberWithDialCode);
//     formData.append("Currency", data.Currency);

//     const fileInput = document.querySelector(
//       'input[type="file"]'
//     ) as HTMLInputElement;
//     if (!fileInput?.files?.[0]) {
//       toast({
//         title: "Error",
//         description: "Please upload the GST Tax Certificate.",
//       });
//       setIsSubmiting(false);
//       return;
//     }
//     formData.append("Gst_Tax_Certificate", fileInput.files[0]);

   

//     if (isOtpVerified) {
//       try {
//         const registrationResponse = await fetch(
//           `${API_BASE_URL}/agent/registration`,
//           {
//             method: "POST",
//             body: formData, 
//           }
//         );

//         if (registrationResponse.ok) {
//           toast({
//             title: "User Registration",
//             description: "Registered Successfully!",
//           });
//           router.push("/login");
//         } else {
//           const errorData = await registrationResponse.json();
//           console.log(data);
//           toast({
//             title: "Error",
//             description: errorData.message || "Registration failed.",
//           });
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "An error occurred during registration.",
//         });
//         console.error("Error during registration:", error);
//         console.log(data);
//       } finally {
//         setIsSubmiting(false);
//       }
//     } else {
//       toast({ title: "Error", description: "Please verify the OTP first." });
//     }
//   };


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       // Validate file type
//       if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith('.pdf')) {
//         toast({
//           title: "Invalid File Type",
//           description: "Please upload a PDF file only.",
//           variant: "destructive",
//         });
//         return;
//       }
      
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//       form.setValue("Gst_Tax_Certificate", selectedFile);
//       form.clearErrors("Gst_Tax_Certificate");
//     }
//   };
//   const handleCountryChange = (value: string) => {
//     const selected = countries.find((country) => country.name === value);
//     if (selected) {
//       setSelectedCountry(value);
//       setSelectedDialCode(selected.dialCode); 
//       setSelectedFlag(selected.flag); 
//       form.setValue("Country", value);
//       form.setValue("City", "");
      
//     }
//   };


//   const handleCurrencyChange = (value: string) => {
//     setSelectedCurrency(value);
//     form.setValue("Currency", value);
//   };

//   return (
//     <Card>
//       <CountryCityAPI onDataFetched={setCountries} />
//       <CardHeader>
//         <CardTitle>Sign Up</CardTitle>
//         <CardDescription>
//           Sign Up to your account with the right credentials
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-6"
//           >
//             <FormField
//               control={form.control}
//               name="Company_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
                  
//                   >
//                     Company Name <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
                     
//                       placeholder="Enter Company Name"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="Address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Enter Your Address"
                     
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="Country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       {...field}
//                       onValueChange={handleCountryChange}
//                       value={selectedCountry}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select a country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countries
//                           .slice() 
//                           .sort((a, b) => a.name.localeCompare(b.name)) 
//                           .map((country) => (
//                             <SelectItem key={country.name} value={country.name}>
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="City"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>City <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
                     
//                       placeholder="Enter Your City"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="Zip_code"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Zip Code <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
                      
//                       placeholder="Enter Zip Code"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="IATA_Code"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>IATA Code</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
                      
//                       placeholder="Enter IATA Code"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="Gst_Vat_Tax_number"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>GST/VAT/TAX Number <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
                   
//                       placeholder="Enter GST/VAT/TAX Number"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="Contact_Person"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Contact Person</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
//                       placeholder="Contact Person"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Email and Send OTP */}
//             <FormField
//               control={form.control}
//               name="Email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
//                   <FormControl>
//                     <div className="flex w-full max-w-sm items-center space-x-2">
//                       <Input
//                         type="email"
//                         placeholder="Enter Email"
//                         {...field}
//                       />
//                       <Button
//                         type="button"
//                         onClick={handleSendOtp}
//                         disabled={otpSent}
//                       >
//                         {isSendingOtp
//                           ? "Sending OTP..."
//                           : otpSent
//                           ? "OTP Sent"
//                           : "Send OTP"}
//                       </Button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                   {/* Display OTP sending message */}
//                   {isSendingOtp && (
//                     <p className="text-sm text-blue-500 mt-2">
//                       OTP is sending...
//                     </p>
//                   )}
//                 </FormItem>
//               )}
//             />

//             {/* OTP Field */}
//             {otpSent && (
//               <FormField
//                 control={form.control}
//                 name="Otp"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>OTP <span className="text-red-500">*</span></FormLabel>
//                     <FormControl>
//                       <div className="flex items-center space-x-2">
//                         <Input
//                           type="text"
//                           placeholder="Enter OTP"
//                           {...field}
//                           disabled={isOtpVerified}
//                         />
//                         <Button
//                           type="button"
//                           onClick={handleVerifyOtp}
//                           disabled={isOtpVerified || isVerifyingOtp}
//                         >
//                           {isVerifyingOtp
//                             ? "Verifying..."
//                             : isOtpVerified
//                             ? "Verified"
//                             : "Verify OTP"}
//                         </Button>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                     {/* Display OTP verifying message */}
//                     {isVerifyingOtp && (
//                       <p className="text-sm text-blue-500 mt-2">
//                         OTP is verifying...
//                       </p>
//                     )}
//                   </FormItem>
//                 )}
//               />
//             )}

//             {isOtpVerified && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name="Password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Create Password <span className="text-red-500">*</span></FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="Enter Password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="Office_number"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Office Number <span className="text-red-500">*</span></FormLabel>
//                       <FormControl>
//                         <div className="flex items-center space-x-2">
//                           {selectedFlag && (
//                             <Image
//                               src={selectedFlag}
//                               alt="flag"
//                               width={30}
//                               height={30}
//                             /> // Display flag
//                           )}
//                           {selectedDialCode && (
//                             <span className="bg-gray-100 border border-gray-300 px-1 py-1">
//                               {selectedDialCode || "+XX"}
//                             </span>
//                           )}
//                           <Input
//                             type="number"
//                             placeholder="Enter Office Number"
//                             {...field}
//                           />
//                         </div>
                       
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="Mobile_number"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
//                       <FormControl>
//                         <div className="flex items-center space-x-2">
//                           {selectedFlag && (
//                             <Image
//                               src={selectedFlag}
//                               alt="flag"
//                               width={30}
//                               height={30}
//                             /> // Display flag
//                           )}
//                           {selectedDialCode && (
//                             <span className="bg-gray-100 border border-gray-300 px-1 py-1">
//                               {selectedDialCode || "+XX"}
//                             </span>
//                           )}
//                           <Input
//                             type="number"
//                             placeholder="Enter Mobile Number"
//                             {...field}
//                           />
//                         </div>
                       
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="Currency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Currency <span className="text-red-500">*</span></FormLabel>
//                       <FormControl>
//                         <Select
//                           {...field}
//                           onValueChange={handleCurrencyChange}
//                           value={selectedCurrency}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Currency" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {
//                               chooseCurrency?.map((cur)=>(
//                                 <SelectItem key={cur.value} value={`${cur.value}`}>{cur.name}</SelectItem>
//                               ))
//                             }
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <ScrollArea className="h-28 w-full rounded-md border">
//                   <div className="p-4">
//                     <h4 className="mb-4 text-xs uppercase font-bold text-zinc-500 dark:text-white leading-none">
//                       Docs To Attach
//                     </h4>
//                     {tags.map((tag, index) => (
//                       <>
//                         <div key={index} className="text-sm">
//                           {tag}
//                         </div>
//                         <Separator className="my-2" />
//                       </>
//                     ))}
//                   </div>
//                 </ScrollArea>
// <FormField
//   control={form.control}
//   name="Gst_Tax_Certificate"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>
//         Upload Document (Tax Certificate) <span className="text-red-500">*</span>
//       </FormLabel>
//       <FormControl>
//         <Input
//           type="file"
//           accept=".pdf,application/pdf" // This restricts to PDF files only
//           onChange={handleFileChange}
//         />
//       </FormControl>
//       {preview && (
//         <div className="mt-4">
//           <p>Preview:</p>
//           <a
//             href={preview}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline"
//           >
//             View PDF
//           </a>
//         </div>
//       )}
//       <FormMessage />
//     </FormItem>
//   )}
// />
//                 <Button type="submit" className="w-full" disabled={isSubmiting}>
//                   {isSubmiting ? "Signing Up..." : "Sign Up"}
//                 </Button>
//               </>
//             )}
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AgentRegistration;




"use client";

import * as z from "zod";
import { useState } from "react";
import Image from "next/image";
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
import { ChooseCurrency } from "../constants/currency";

interface Country {
  name: string;
  flag: string;
  dialCode: string;
}

const tags = ["GST", "Adhar", "PAN", "Passport"];
const chooseCurrency = ChooseCurrency;

const formSchema = z.object({
  Company_name: z.string().min(1, { message: "Company Name is Required" }),
  Address: z.string().min(1, { message: "Address is Required" }),
  Email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email({ message: "Please enter valid email" }),
  Password: z.string().min(1, { message: "Password is Required" }),
  Zip_code: z.string().min(1, { message: "Zipcode is Required" }),
  IATA_Code: z.string().optional(),
  Country: z.string().min(1, { message: "Country is required" }),
  City: z.string().min(1, { message: "City is required" }),
  Gst_Vat_Tax_number: z.string().min(1, { message: "Tax Number is required" }),
  Contact_Person: z.string(),
  Otp: z.string(),
  Office_number: z.string().min(1, { message: "Office No. is required" }),
  Mobile_number: z.string().min(1, { message: "Mobile No. is required" }),
  Currency: z.string().min(1, { message: "Currency is required" }),
  Gst_Tax_Certificate: z.any().refine((file) => file instanceof File, {
    message: "Upload document is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

const AgentRegistration: React.FC = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedDialCode, setSelectedDialCode] = useState<string>("");
  const [selectedFlag, setSelectedFlag] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const validateBeforeSendOtp = async () => {
    // Trigger validation for all required fields except password and OTP
    const isValid = await form.trigger([
      "Company_name",
      "Address",
      "Email",
      "Country",
      "City",
      "Zip_code",
      "Gst_Vat_Tax_number",
      // "Office_number",
      // "Mobile_number"
    ]);

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields before sending OTP",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    const isValid = await validateBeforeSendOtp();
    if (!isValid) return;

    const email = form.getValues("Email");
    if (email) {
      setIsSendingOtp(true);
      try {
        const response = await fetch(`${API_BASE_URL}/agent/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setOtpSent(true);
          toast({
            title: "Sending OTP",
            description: "OTP sent to email",
          });
        } else if (response.status === 406) {
          toast({
            title: "Error",
            description: "This Email is already registered.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send OTP.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const email = form.getValues("Email");
    const otp = form.getValues("Otp");
    setIsVerifyingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agent/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setIsOtpVerified(true);
        toast({
          title: "OTP Verification",
          description: "OTP verified successfully!",
        });
      } else {
        toast({
          title: "OTP Verification",
          description: "Invalid OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    const officeNumberWithDialCode = `${selectedDialCode}${data.Office_number}`;
    const mobileNumberWithDialCode = `${selectedDialCode}${data.Mobile_number}`;

    const formData = new FormData();
    formData.append("Company_name", data.Company_name);
    formData.append("Address", data.Address);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("Zip_code", data.Zip_code);
    formData.append("IATA_Code", data.IATA_Code);
    formData.append("Country", data.Country);
    formData.append("City", data.City);
    formData.append("Gst_Vat_Tax_number", data.Gst_Vat_Tax_number);
    formData.append("Contact_Person", data.Contact_Person);
    formData.append("Office_number", officeNumberWithDialCode);
    formData.append("Mobile_number", mobileNumberWithDialCode);
    formData.append("Currency", data.Currency);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (!fileInput?.files?.[0]) {
      toast({
        title: "Error",
        description: "Please upload the GST Tax Certificate.",
      });
      setIsSubmitting(false);
      return;
    }
    formData.append("Gst_Tax_Certificate", fileInput.files[0]);

    if (isOtpVerified) {
      try {
        const registrationResponse = await fetch(
          `${API_BASE_URL}/agent/registration`,
          {
            method: "POST",
            body: formData, 
          }
        );

        if (registrationResponse.ok) {
          toast({
            title: "User Registration",
            description: "Registered Successfully!",
          });
          router.push("/login");
        } else {
          const errorData = await registrationResponse.json();
          toast({
            title: "Error",
            description: errorData.message || "Registration failed.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred during registration.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({ title: "Error", description: "Please verify the OTP first." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith('.pdf')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      form.setValue("Gst_Tax_Certificate", selectedFile);
      form.clearErrors("Gst_Tax_Certificate");
    }
  };

  const handleCountryChange = (value: string) => {
    const selected = countries.find((country) => country.name === value);
    if (selected) {
      setSelectedCountry(value);
      setSelectedDialCode(selected.dialCode); 
      setSelectedFlag(selected.flag); 
      form.setValue("Country", value);
      form.setValue("City", "");
    }
  };

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    form.setValue("Currency", value);
  };

   return (
    <div className="container mx-auto px-10 md:px-4 py-8 max-w-6xl">
      <Card className="shadow-lg">
        <CountryCityAPI onDataFetched={setCountries} />
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Agent Registration</CardTitle>
          <CardDescription>
            Create your account with the required credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Company Name" {...field} />
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
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact Person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="Address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Your Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="Country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={handleCountryChange}
                          value={selectedCountry}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((country) => (
                                <SelectItem key={country.name} value={country.name}>
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
                      <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your City" {...field} />
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
                      <FormLabel>Zip Code <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tax and Identification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Gst_Vat_Tax_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST/VAT/TAX Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter GST/VAT/TAX Number" {...field} />
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
                      <FormLabel>IATA Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IATA Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email and OTP Section */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="email" placeholder="Enter Email" {...field} />
                          <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpSent}
                            className="whitespace-nowrap"
                          >
                            {isSendingOtp
                              ? "Sending..."
                              : otpSent
                              ? "OTP Sent"
                              : "Send OTP"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {otpSent && (
                  <FormField
                    control={form.control}
                    name="Otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
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
                              className="whitespace-nowrap"
                            >
                              {isVerifyingOtp
                                ? "Verifying..."
                                : isOtpVerified
                                ? "Verified"
                                : "Verify OTP"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {isOtpVerified && (
                <>
                  {/* Password Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="Password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Create Password <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter Password" {...field} />
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
                          <FormLabel>Currency <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              onValueChange={handleCurrencyChange}
                              value={selectedCurrency}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {chooseCurrency?.map((cur) => (
                                  <SelectItem key={cur.value} value={`${cur.value}`}>
                                    {cur.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="Office_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="flex gap-2 items-center">
                              {selectedFlag && (
                                <Image
                                  src={selectedFlag}
                                  alt="flag"
                                  width={24}
                                  height={24}
                                  className="h-6 w-auto"
                                />
                              )}
                              {selectedDialCode && (
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                  {selectedDialCode}
                                </span>
                              )}
                              <Input
                                type="number"
                                placeholder="Enter Office Number"
                                className="flex-1"
                                {...field}
                              />
                            </div>
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
                          <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="flex gap-2 items-center">
                              {selectedFlag && (
                                <Image
                                  src={selectedFlag}
                                  alt="flag"
                                  width={24}
                                  height={24}
                                  className="h-6 w-auto"
                                />
                              )}
                              {selectedDialCode && (
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                  {selectedDialCode}
                                </span>
                              )}
                              <Input
                                type="number"
                                placeholder="Enter Mobile Number"
                                className="flex-1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Documents Section */}
                  <div>
                    <ScrollArea className="h-28 w-full rounded-md border mb-4">
                      <div className="p-4">
                        <h4 className="mb-4 text-xs uppercase font-bold text-zinc-500 dark:text-white leading-none">
                          Documents To Attach
                        </h4>
                        {tags.map((tag, index) => (
                          <div key={index}>
                            <div className="text-sm">{tag}</div>
                            {index < tags.length - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <FormField
                      control={form.control}
                      name="Gst_Tax_Certificate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Upload Tax Certificate (PDF) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileChange}
                            />
                          </FormControl>
                          {preview && (
                            <div className="mt-2 text-sm">
                              <a
                                href={preview}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                View uploaded PDF
                              </a>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Complete Registration"}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentRegistration;