"use client";
import DashboardContainer from "@/components/layout/DashboardContainer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,CardFooter
  } from '@/components/ui/card';
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { useEffect,useState } from "react";
  import { fetchWithAuth } from "@/components/utils/api";
  import { removeToken } from "@/components/utils/auth";
  import { Skeleton } from "@/components/ui/skeleton";
  import { Car, } from "lucide-react";
const Page = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(
          `${API_BASE_URL}/dashboard`
        );
        setUser(data);
      } catch (err: any) {
        setError(err.message);
        removeToken();
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!user) return(
    <div className="flex flex-col m-4">
        <div className="space-y-2 m-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="space-x-4 flex">
          <Skeleton className="h-[160px] w-[200px] rounded-xl" />
          <Skeleton className="h-[160px] w-[200px] rounded-xl" />
          <Skeleton className="h-[160px] w-[200px] rounded-xl" />
          <Skeleton className="h-[160px] w-[200px] rounded-xl" />
        </div>
      </div>
  );

  return (
    <DashboardContainer scrollable>
    <div className="space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          Hi, {user.Company_name}
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          {/* Additional buttons or tools can go here */}
        </div>
      </div>
      <Tabs defaultValue="booking" className="space-y-4">
        <TabsList>
          
          <TabsTrigger value="booking">
            Booking
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="booking" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Booking
                </CardTitle>
                <Car width={20} height={20}/>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">All Booking</div>
                <p className="text-xs text-muted-foreground">
                  find all booking here
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/supplier/booking">
                  <Button variant="outline">View Booking</Button>
                </Link>
              </CardFooter>
            </Card>
            
           
           
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardContainer>
  )
}

export default Page