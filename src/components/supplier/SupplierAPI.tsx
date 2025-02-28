// "use client"
// import { useState,useEffect } from 'react';
// import axios from 'axios';
// import * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {useForm} from 'react-hook-form';
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardContent,
//     CardDescription,
//   } from "../ui/card";
//   import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "@/components/ui/form";
//   import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// const formSchema = z.object({
//   Api:z.string().min(1,{
//         message:'API is required'
//     }),
//     Api_User:z.string().min(1,{
//         message:'Username is required'
//     }),
//     Api_Password:z.string().min(1,{
//         message:'Password is required'
//     })
// })
// interface UserData {
//   id: string;
// }
// const SupplierAPI = () => {
//     const { toast } = useToast();
//     const [userData, setUserData] = useState<UserData | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string>("");
//     // Load user data from localStorage
//     // useEffect(() => {
//     //   try {
//     //     const storedUser = localStorage.getItem("user");
//     //     if (storedUser) {
//     //       setUserData(JSON.parse(storedUser));
//     //     }
//     //   } catch (e) {
//     //     console.error("Failed to parse user data:", e);
//     //   }
//     // }, []);
//     useEffect(() => {
//       const fetchUserData = async () => {
//         try {
//           const data = await fetchWithAuth(
//             "http://localhost:8000/api/V1/dashboard"
//           );
//           console.log("API Data from sidebar:",data);
//           setUserData(data);
//         } catch (err: any) {
//           console.log("API error fetching data",err);
//           setError(err.message);
//           removeToken();
//           // window.location.href = "/login";
//           // router.push('/login')
//         }
//       };
  
//       fetchUserData();
//     }, []);
  
//     if (error) return <p>Error: {error}</p>;
//     if (!userData) return <p>Loading...</p>;




//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//           Api: "",
//           Api_User:"",
//           Api_Password: "",
//         },
//       });
//       const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        
//         setIsLoading(true);
//         try {
//           // Define the API endpoint dynamically based on the role
//           const loginEndpoint = `http://localhost:8000/api/V1/supplier/CreateSupplierApi`;
    
//           // Call the API for login with email and password
//           const response = await axios.post(loginEndpoint, {
//             Api: data.Api,
//             Api_User: data.Api_User,
//             Api_Password: data.Api_Password,
//             Api_Id_Foreign:userData?.id,
//           });
    
//           if (response.status === 200) {
//             // console.log(response.data);
//             // If login is successful
//             toast({
//               title: "Supplier API",
//               description: "API added Successful",
//             });
//             // Reset form fields
//              form.reset();
//           } else {
//             // Handle login failure
//             toast({
//               title: "Supplier API",
//               description: "API Integration Failed!",
//               variant: "destructive",
//             });
//             console.log(response.data);
//           }
//         } catch (error) {
//           // Handle API error
//           toast({
//             title: "Error",
//             description: "An error occurred while API Integration. Please try again.",
//             variant: "destructive",
//           });
//           console.error("Login error:", error);
//         }finally {
//           setIsLoading(false);
//         }
//       };
//   return (
//     <Card>
//     <CardHeader>
//       <CardTitle>Login</CardTitle>
//       <CardDescription>
//         Login to your account with right credentials
//       </CardDescription>
//     </CardHeader>
//     <CardContent className="space-y-2">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="space-y-6"
//         >
//           <FormField
//             control={form.control}
//             name="Api"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel
//                 // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
//                 >
//                   API
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                     placeholder="Enter API"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="Api_User"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel
//                 // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
//                 >
//                   User Name
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                     placeholder="Enter User Name"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="Api_Password"
//             render={({ field }) => (
//               <FormItem>
//                   <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                     placeholder="Enter Password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type='submit' className="w-full" disabled={isLoading}>
//           {isLoading ? "Submitting..." : "Submit"}
//           </Button>
//         </form>
//       </Form>
//     </CardContent>
//   </Card>
//   )
// }

// export default SupplierAPI






"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import { Skeleton } from "../ui/skeleton";
const formSchema = z.object({
  Api: z.string().min(1, { message: "API is required" }),
  Api_User: z.string().min(1, { message: "Username is required" }),
  Api_Password: z.string().min(1, { message: "Password is required" }),
});

interface UserData {
  userId: string;
}

const SupplierAPI = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        console.log("User data fetched successfully:", data);
        setUserData(data);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        removeToken();
        // window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Api: "",
      Api_User: "",
      Api_Password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!userData?.userId) {
      toast({
        title: "Error",
        description: "User data is missing. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/V1/supplier/CreateSupplierApi",
        {
          Api: data.Api,
          Api_User: data.Api_User,
          Api_Password: data.Api_Password,
          Api_Id_Foreign: userData.userId,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Supplier API added successfully.",
        });
        form.reset();
      } else {
        throw new Error("API integration failed.");
      }
    } catch (error: any) {
      console.error("Error during API submission:", error);
      toast({
        title: "Error",
        description: error?.message || "An error occurred while integrating the API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!userData) return(
    <div className="flex flex-col justify-center items-center">
      <Skeleton className="h-[300px] w-[250px] rounded-xl" />
      <div className="space-y-2 m-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier API Integration</CardTitle>
        <CardDescription>Enter API details to integrate the supplier API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="Api"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Api_User"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Api_Password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupplierAPI;
