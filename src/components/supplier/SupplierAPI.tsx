"use client"
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
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
// import { useToast } from "@/hooks/use-toast";
const formSchema = z.object({
    api:z.string().min(1,{
        message:'API is required'
    }),
    username:z.string().min(1,{
        message:'Username is required'
    }),
    Password:z.string().min(1,{
        message:'Password is required'
    })
})

const SupplierAPI = () => {
    // const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          api: "",
          username:"",
          Password: "",
        },
      });
      const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        // toast({
        //   title: "Supplier API",
        //   description: "API added Successful",
        // });
        // try {
        //   // Define the API endpoint dynamically based on the role
        //   const loginEndpoint = `http://localhost:8000/api/V1/${role}/login`;
    
        //   // Call the API for login with email and password
        //   const response = await axios.post(loginEndpoint, {
        //     Email: data.Email,
        //     Password: data.Password,
        //   });
    
        //   if (response.status === 200) {
        //     // console.log(response.data);
        //     // If login is successful
        //     toast({
        //       title: `${roleTitle} Login`,
        //       description: "Login Successful",
        //     });
        //     // Store the token if needed (localStorage/sessionStorage)
        //     localStorage.setItem("authToken", response.data.token);
        //     localStorage.setItem("user", JSON.stringify(response.data.user));
        //     // Navigate to role-based dashboard
        //     router.push(`/dashboard/${role}`);
        //   } else {
        //     // Handle login failure
        //     toast({
        //       title: "Login Failed",
        //       description: "Please check your credentials and try again.",
        //       variant: "destructive",
        //     });
        //     console.log(response.data);
        //   }
        // } catch (error) {
        //   // Handle API error
        //   toast({
        //     title: "Error",
        //     description: "An error occurred while logging in. Please try again.",
        //     variant: "destructive",
        //   });
        //   console.error("Login error:", error);
        // }
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
            name="api"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
                >
                  API
                </FormLabel>
                <FormControl>
                  <Input
                    // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                    placeholder="Enter API"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                // className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
                >
                  User Name
                </FormLabel>
                <FormControl>
                  <Input
                    // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                    placeholder="Enter User Name"
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
                  <FormLabel>Password</FormLabel>
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
          <Button className="w-full">Submit</Button>
        </form>
      </Form>
    </CardContent>
  </Card>
  )
}

export default SupplierAPI