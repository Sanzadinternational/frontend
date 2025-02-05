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
