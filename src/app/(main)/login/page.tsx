// "use client";
// import * as z from "zod";
// import { useEffect,useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// const formSchema = z.object({
//   Email: z
//     .string()
//     .min(1, {
//       message: "Email is Required",
//     })
//     .email({
//       message: "Please enter valid email",
//     }),
//   Password: z.string().min(1, {
//     message: "Password is Required",
//   }),
// });
// // interface LoginRoleProps {
// //   role: string;
// // }

// const Login = () => {
//   const [user, setUser] = useState<any>(null);
//     const [error, setError] = useState<string>("");
  
//     useEffect(() => {
//       const fetchUserData = async () => {
//         try {
//           const data = await fetchWithAuth(
//             "http://localhost:8000/api/V1/dashboard"
//           );
//           console.log("API Data from Login page",data);
//           setUser(data);
          
//           window.location.href = `/dashboard/${data.role}`;
          
//         } catch (err: any) {
//           console.log("error during fetching data",err);
//           setError(err.message);
//           removeToken();
//           // window.location.href = "/login";
//         }
//       };
  
//       fetchUserData();
//     }, []);
//   const [isSubmiting, setIsSubmiting] = useState(false);
//   const { toast } = useToast();
 
//   const router = useRouter();
//   // Use useEffect to set the role after the component renders

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       Email: "",
//       Password: "",
//     },
//   });

//   const handleSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsSubmiting(true);
//     // console.log(data);
//     // toast({
//     //   title: `${roleTitle} Login`,
//     //   description: "Login Successful",
//     // });
//     // router.push(`/dashboard/${role}`);
//     try {
//       // Define the API endpoint dynamically based on the role
//       const loginEndpoint = `http://localhost:8000/api/V1/login`;

//       // Call the API for login with email and password
//       const response = await axios.post(loginEndpoint, {
//         Email: data.Email,
//         Password: data.Password,
//       });

//       if (response.status === 200) {
//         // console.log(response.data);
//         // If login is successful

//         toast({
//           // title: `Login`,
//           title: `${response.data.role} Login`,
//           description: "Login Successful",
//         });
//         // Store the token if needed (localStorage/sessionStorage)
//         localStorage.setItem("authToken", response.data.accessToken);
//         console.log(data);
//         // localStorage.setItem("user", JSON.stringify(response.data.user));
//         // Navigate to role-based dashboard
//         router.push(`/dashboard/${response.data.role}`);
//       } else {
//         // Handle login failure
//         toast({
//           title: "Login Failed",
//           description: "Please check your credentials and try again.",
//           variant: "destructive",
//         });
//         console.log(response.data);
//       }
//     } catch (error) {
//       // Handle API error
//       toast({
//         title: "Error",
//         description: "An error occurred while logging in. Please try again.",
//         variant: "destructive",
//       });
//       console.error("Login error:", error);
//     }finally{
//       setIsSubmiting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center my-8">
//     <Card>
//       <CardHeader>
//         <CardTitle>Login</CardTitle>
//         <CardDescription>
//           Login to your account with right credentials
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
//               name="Email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                   // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
//                   >
//                     Email
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                       placeholder="Enter Email"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="Password"
//               render={({ field }) => (
//                 <FormItem>
//                   <div className="flex justify-between">
//                     <FormLabel>Password</FormLabel>
//                     <Link
//                       // href={`/${role}/forget-password`}
//                       href=''
//                       className="text-xs text-blue-500 underline"
//                     >
//                       Forgot Password?
//                     </Link>
//                   </div>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                       placeholder="Enter Password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className="w-full" disabled={isSubmiting}>
//             {isSubmiting ? "Signing In..." : "Sign In"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//     </div>
//   );
// };

// export default Login;




"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";

const formSchema = z.object({
  Email: z.string().email({ message: "Invalid email address" }),
  Password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        console.log("User Data:", data);
        setUser(data);
        router.push(`/dashboard/${data.role}`);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message);
        removeToken();
      }
    };

    fetchUserData();
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { Email: "", Password: "" },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmiting(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/V1/login", data);
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.accessToken);
        toast({ title: "Login Successful", description: `Welcome ${response.data.role}!` });
        router.push(`/dashboard/${response.data.role}`);
        console.log(response.data.role);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      toast({ title: "Error", description: error, variant: "destructive" });
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-8">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password" className="text-xs text-blue-500 underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" disabled={isSubmiting}>
                {isSubmiting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
