// "use client";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
// import { useState,useEffect } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRole } from "../context/RoleContext";
// import { useToast } from "@/hooks/use-toast"
// import axios from "axios";
// const formSchema = z.object({
//   email: z
//     .string()
//     .min(1, {
//       message: "Email is Required",
//     })
//     .email({
//       message: "Please enter valid email",
//     }),
//   newpassword: z.string().min(1, {
//     message: "Password is Required",
//   }),
// });
// interface LoginRoleProps {
//   role: string;
// }

// const ResetPassword = ({ role }: LoginRoleProps) => {
//   const router = useRouter();
//   const {toast} = useToast();
//   const { token } = router.query; // Get token from URL
//   const [isTokenValid, setIsTokenValid] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isEmailVerifying, setIsEmailVerifying] = useState(false);
//   const { setRole } = useRole();
//   setRole(role);
//   // Send reset link after verifying email
// const handleVerifyEmail = async () => {
//   const email = form.getValues("email");
//   setIsEmailVerifying(true);
//   try {
//     const response = await fetch(
//       `http://localhost:8000/api/V1/${role}/send-reset-link`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       }
//     );

//     if (response.ok) {
//       console.log("Reset email sent successfully!");
//       toast({
//         title: 'Email Sent',
//         description: "A password reset link has been sent to your email.",
//       });
//     } else {
//       toast({
//         title: 'Email Failed',
//         description: "Invalid email or user not found.",
//         variant: 'destructive',
//       });
//       console.log("Invalid Email.");
//     }
//   } catch (error) {
//     toast({
//       title: 'Error',
//       description: "Error sending reset link.",
//       variant: 'destructive',
//     });
//     console.log("Error sending reset link:", error);
//   } finally {
//     setIsEmailVerifying(false);
//   }
// };

// useEffect(() => {
//   if (token) {
//     // Verify the token with the backend
//     const verifyToken = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/api/V1/${role}/verify-reset-token`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ token }),
//         });
//         if (response.ok) {
//           setIsTokenValid(true); // Token is valid
//         } else {
//           toast({
//             title: 'Invalid Token',
//             description: 'The reset link is invalid or has expired.',
//             variant: 'destructive',
//           });
//           router.push('/'); // Redirect to homepage or login
//         }
//       } catch (error) {
//         console.error("Token verification error:", error);
//       }
//     };
//     verifyToken();
//   }
// }, [token, role, router, toast]);

  
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       newpassword: "",
//     },
//   });
//   const handleSubmit = async(data: z.infer<typeof formSchema>) => {
//     // console.log(data);
//     // router.push("/");
//     try {
//       // API call to reset password using the token
//       const response = await axios.post(`http://localhost:8000/api/V1/${role}/resetpassword`, {
//         token,  // Pass the token received from the reset link
//         newPassword: data.newpassword,
//       });

//       if (response.status === 200) {
//         toast({
//           title: 'Password Reset Successful',
//           description: 'You can now log in with your new password.',
//         });
//         router.push(`/${role}/login`);
//       } else {
//         toast({
//           title: 'Password Reset Failed',
//           description: 'An error occurred. Please try again.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Error resetting password.',
//         variant: 'destructive',
//       });
//       console.error("Reset password error:", error);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Reset Password</CardTitle>
//         <CardDescription>Reset your password</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-6"
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
//                     Email
//                   </FormLabel>
//                   <FormControl>
//                     {/* <Input className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white" placeholder="Enter Email" {...field} /> */}
//                     <div className="flex w-full max-w-sm items-center space-x-2">
//                       <Input
//                         type="email"
//                         placeholder="Enter Email"
//                         {...field}
//                       />
//                       <Button
//                         type="button"
//                         onClick={handleVerifyEmail}
//                         disabled={isEmailVerified}
//                       >
//                         {isEmailVerifying
//                           ? "Verifying Email..."
//                           : isEmailVerified
//                           ? "Email Verified"
//                           : "Verify Email"}
//                       </Button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                   {/* Display OTP sending message */}
//                   {isEmailVerifying && (
//                     <p className="text-sm text-blue-500 mt-2">
//                       Email is verifying...
//                     </p>
//                   )}
//                 </FormItem>
//               )}
//             />
//             {isTokenValid && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name="newpassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
//                         New Password
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
//                           placeholder="Enter New Password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type= 'submit'className="w-full">Reset Password</Button>
//               </>
//             )}
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default ResetPassword;


// "use client";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams,useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// // import { useRole } from "../context/RoleContext";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// // Zod schema for email verification and new password
// const emailSchema = z.object({
//   email: z.string().email("Please enter a valid email"),
// });

// const passwordSchema = z.object({
//   newpassword: z.string().min(6, {
//     message: "Password must be at least 6 characters long",
//   }),
// });

// // interface LoginRoleProps {
// //   role: string;
// // }

// const ResetPassword = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const { toast } = useToast();
//   const [isTokenValid, setIsTokenValid] = useState(false);
//   // const { setRole } = useRole();
//   // setRole(role);

//   // Separate form for email
//   const emailForm = useForm<z.infer<typeof emailSchema>>({
//     resolver: zodResolver(emailSchema),
//     defaultValues: { email: "" },
//   });

//   // Separate form for new password
//   const passwordForm = useForm<z.infer<typeof passwordSchema>>({
//     resolver: zodResolver(passwordSchema),
//     defaultValues: { newpassword: "" },
//   });

//   const [isEmailSent, setIsEmailSent] = useState(false);

//   // Handle email verification form submission
//   const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/V1/forgetpassword`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: data.email }),
//         }
//       );

//       if (response.ok) {
//         toast({
//           title: "Email Sent",
//           description: "A password reset link has been sent to your email.",
//         });
//         setIsEmailSent(true);
//       } else {
//         toast({
//           title: "Email Failed",
//           description: "Invalid email or user not found.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Error sending reset link.",
//         variant: "destructive",
//       });
//       console.log(error);
//     }
//   };

//   // Verify token on component load (for reset password flow)
//   useEffect(() => {
//     if (token) {
//       const verifyToken = async () => {
//         try {
//           const response = await fetch(
//             `http://localhost:8000/api/V1/verify_token`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ token }),
//             }
//           );
//           if (response.ok) {
//             setIsTokenValid(true); // Token is valid
//           } else {
//             toast({
//               title: "Invalid Token",
//               description: "The reset link is invalid or has expired.",
//               variant: "destructive",
//             });
//             router.push("/"); // Redirect to homepage or login
//           }
//         } catch (error) {
//           console.error("Token verification error:", error);
//         }
//       };
//       verifyToken();
//     }
//   }, [token,toast,router]);

//   // Handle new password submission
//   const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/V1/resetpassword`,
//         {
//           token, // Pass the token received from the reset link
//           newPassword: data.newpassword,
//         }
//       );

//       if (response.status === 200) {
//         toast({
//           title: "Password Reset Successful",
//           description: "You can now log in with your new password.",
//         });
//         router.push(`/${role}`);
//       } else {
//         toast({
//           title: "Password Reset Failed",
//           description: "An error occurred. Please try again.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Error resetting password.",
//         variant: "destructive",
//       });
//       console.log(error);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Reset Password</CardTitle>
//         <CardDescription>
//           {token ? "Enter a new password" : "Enter your email to reset your password"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         {!token && (
//           <Form {...emailForm}>
//             <form
//               onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
//               className="space-y-6"
//             >
//               <FormField
//                 control={emailForm.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="Enter your email"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full">
//                 Send Reset Link
//               </Button>
//             </form>
//           </Form>
//         )}

//         {token && isTokenValid && (
//           <Form {...passwordForm}>
//             <form
//               onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
//               className="space-y-6"
//             >
//               <FormField
//                 control={passwordForm.control}
//                 name="newpassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>New Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="Enter new password"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full">
//                 Reset Password
//               </Button>
//             </form>
//           </Form>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ResetPassword;



"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
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

// Zod validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const passwordSchema = z.object({
  newpassword: z.string().min(4, {
    message: "Password must be at least 4 characters long",
  }),
});

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL
  const { toast } = useToast();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [savedEmail, setSavedEmail] = useState(""); // Store email for later use

  // Email Form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newpassword: "" },
  });

  // Handle email submission (Request Reset Link)
  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsEmailSent(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/V1/forgetpassword",
        { Email: data.email } // Ensure key matches API
      );

      if (response.status === 200) {
        setSavedEmail(data.email); // Store email for later use
        toast({
          title: "Email Sent",
          description: "A password reset link has been sent to your email.",
        });
        
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or user not found.",
        variant: "destructive",
      });
      console.error("Email submission error:", error);
    }
    finally{
      setIsEmailSent(false);
    }
  };

  // Verify reset token
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/V1/verify_token",
          { Token: token }
        );

        if (response.status === 200) {
          setIsTokenValid(true);
        } else {
          toast({
            title: "Invalid Token",
            description: "The reset link is invalid or has expired.",
            variant: "destructive",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    };

    verifyToken();
  }, [token, router, toast]);

  // Handle new password submission
  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsPasswordSent(true);
    try {
      const response = await axios.post("http://localhost:8000/api/V1/resetpassword", {
        Password: data.newpassword, // Match API expected key
        Email: savedEmail, // Use saved email
        Token: token, // Use token from URL
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Password reset successfully. You can now log in.",
        });
       
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: "Password reset failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error resetting password.",
        variant: "destructive",
      });
      console.error("Password reset error:", error);
    }
    finally{
      setIsPasswordSent(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          {token
            ? "Enter a new password"
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Email Form (Request Reset Link) */}
        {!token && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-6"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isEmailSent}>
                {isEmailSent?"Sending Reset Link":"Send Reset Link"}
              </Button>
            </form>
          </Form>
        )}

        {/* Password Reset Form */}
        {token && isTokenValid && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-6"
            >
              <FormField
                control={passwordForm.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPasswordSent}>
                {isPasswordSent?"Resetting Password":"Reset Password"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
