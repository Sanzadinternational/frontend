"use client";
import * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "../context/RoleContext";
import axios from "axios";
const formSchema = z.object({
  Email: z
    .string()
    .min(1, {
      message: "Email is Required",
    })
    .email({
      message: "Please enter valid email",
    }),
  Password: z.string().min(1, {
    message: "Password is Required",
  }),
});
interface LoginRoleProps {
  role: string;
}

const Login = ({ role }: LoginRoleProps) => {
  const { setRole } = useRole();
  const { toast } = useToast();
  const router = useRouter();
  // Use useEffect to set the role after the component renders
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
      Password: "",
    },
  });
  const roleTitle: string = role[0].toUpperCase() + role.slice(1);
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // toast({
    //   title: `${roleTitle} Login`,
    //   description: "Login Successful",
    // });
    // router.push(`/dashboard/${role}`);
    try {
      // Define the API endpoint dynamically based on the role
      const loginEndpoint = `http://localhost:8000/api/V1/${role}/login`;

      // Call the API for login with email and password
      const response = await axios.post(loginEndpoint, {
        Email: data.Email,
        Password: data.Password,
      });

      if (response.status === 200) {
        // console.log(response.data);
        // If login is successful
        toast({
          title: `${roleTitle} Login`,
          description: "Login Successful",
        });
        // Store the token if needed (localStorage/sessionStorage)
        localStorage.setItem("authToken", response.data.token);
        // Navigate to role-based dashboard
        router.push(`/dashboard/${role}`);
      } else {
        // Handle login failure
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
        console.log(response.data);
      }
    } catch (error) {
      // Handle API error
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login to your account with right credentials
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
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                  // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
                  >
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
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
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href={`/${role}/forget-password`}
                      className="text-xs text-blue-500 underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
