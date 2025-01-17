"use client";
import * as z from "zod";
// import { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { Card,
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
// import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
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
  Company_name:z.string().min(1,{
    message:'User Name is Required',
  }),
  Agent_account:z.boolean().optional(),
  Agent_operation:z.boolean().optional(),
  Supplier_account:z.boolean().optional(),
  Supplier_operation:z.boolean().optional(),
});

const page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          Company_name:"",
          Email:"",
          Password:"",
          Agent_account:false,
          Agent_operation:false,
          Supplier_account:false,
          Supplier_operation:false,
        }
      });

      const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
      }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Admin</CardTitle>
        <CardDescription>
          Create new admin with required permission
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
                    Admin Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      // className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
                      placeholder="Enter Admin Name"
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
            <FormField
              control={form.control}
              name="Agent_account"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Agent_account"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Agent_operation"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Agent Operation</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Agent_account"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Agent Account</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Supplier_account"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Supplier Account</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Supplier_account"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Supplier Operation</FormLabel>
                    <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button className="w-full" disabled={isSubmiting}>
            {isSubmiting ? "Signing In..." : "Sign In"}
            </Button> */}
            <Button type="submit">Sumbit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default page