// "use client";

// import DashboardContainer from "@/components/layout/DashboardContainer";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { useEffect, useState } from "react";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Car,
//   FileUser,
//   IndianRupee,
//   User,
//   Bell,
//   X,
// } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import io from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

// const Page = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [user, setUser] = useState<any>(null);
//   const [error, setError] = useState<string>("");
//   const [notifications, setNotifications] = useState<string[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notificationOpen, setNotificationOpen] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setUser(data);
//       } catch (err: any) {
//         setError(err.message);
//         removeToken();
//         window.location.href = "/login";
//       }
//     };

//     fetchUserData();

//     // Listen for new supplier registration
//     socket.on("new_supplier_registered", (data) => {
//       setNotifications((prev) => [data.message, ...prev]);
//       setUnreadCount((prev) => prev + 1);
//     });

//     return () => {
//       socket.off("new_supplier_registered");
//     };
//   }, []);

//   const handleNotificationClick = () => {
//     setNotificationOpen(true);
//     setUnreadCount(0);
//   };

//   const clearNotifications = () => {
//     setNotifications([]);
//     setNotificationOpen(false);
//   };

//   if (error) return <p>Error: {error}</p>;

//   if (!user) {
//     return (
//       <div className="flex flex-col m-4">
//         <div className="space-y-2 m-1">
//           <Skeleton className="h-4 w-[200px]" />
//           <Skeleton className="h-4 w-[250px]" />
//         </div>
//         <div className="space-x-4 flex">
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <DashboardContainer scrollable>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold tracking-tight">
//             Hi, {user.Company_name}
//           </h2>
          
//           {/* Notification Bell */}
//           <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
//             <PopoverTrigger asChild>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="relative"
//                 onClick={handleNotificationClick}
//               >
//                 <Bell className="h-5 w-5" />
//                 {unreadCount > 0 && (
//                   <Badge 
//                     variant="destructive" 
//                     className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
//                   >
//                     {unreadCount}
//                   </Badge>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-0" align="end">
//               <div className="flex items-center justify-between px-4 py-3 border-b">
//                 <h3 className="font-semibold">Notifications</h3>
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={clearNotifications}
//                   disabled={notifications.length === 0}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               {notifications.length > 0 ? (
//                 <div className="max-h-60 overflow-y-auto">
//                   {notifications.map((note, index) => (
//                     <div 
//                       key={index} 
//                       className="px-4 py-3 border-b hover:bg-accent transition-colors"
//                     >
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 pt-0.5">
//                           <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
//                         </div>
//                         <div className="ml-3 flex-1">
//                           <p className="text-sm">{note}</p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {new Date().toLocaleTimeString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-4 text-center text-sm text-muted-foreground">
//                   No notifications yet
//                 </div>
//               )}
//             </PopoverContent>
//           </Popover>
//         </div>

//         <Tabs defaultValue="supplier" className="space-y-4">
//           {/* Rest of your existing tabs content */}
//           <TabsList>
//             <TabsTrigger value="supplier">Supplier</TabsTrigger>
//             <TabsTrigger value="agent">Agent</TabsTrigger>
//             <TabsTrigger value="admin">Admin</TabsTrigger>
//             <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
//           </TabsList>

//           {/* Supplier Tab */}
//           <TabsContent value="supplier" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Supplier List</div>
//                   <p className="text-xs text-muted-foreground">find all supplier here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-supplier">
//                     <Button variant="outline">View Supplier</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                   <IndianRupee width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Add Margin</div>
//                   <p className="text-xs text-muted-foreground">add supplier-wise margin</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/add-margin">
//                     <Button variant="outline">Add Margin</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                   <Car width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Vehicle Info</div>
//                   <p className="text-xs text-muted-foreground">add vehicle model, brand, etc.</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/vehicle-details">
//                     <Button variant="outline">Add Info</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Agent Tab */}
//           <TabsContent value="agent" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Agent</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Agent List</div>
//                   <p className="text-xs text-muted-foreground">find all agents here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-agent">
//                     <Button variant="outline">View Agent</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Admin Tab */}
//           <TabsContent value="admin" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Admin</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Admin List</div>
//                   <p className="text-xs text-muted-foreground">find all admin here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-admin">
//                     <Button variant="outline">View Admin</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Admin</CardTitle>
//                   <User width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Add Admin</div>
//                   <p className="text-xs text-muted-foreground">add new admin here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/add-admin">
//                     <Button variant="outline">Add Admin</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardContainer>
//   );
// };

// export default Page;


// "use client";

// import DashboardContainer from "@/components/layout/DashboardContainer";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { useEffect, useState } from "react";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Car,
//   FileUser,
//   IndianRupee,
//   User,
//   Bell,
//   X,
// } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import io from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

// const Page = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [user, setUser] = useState<any>(null);
//   const [error, setError] = useState<string>("");
//   const [notifications, setNotifications] = useState<string[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notificationOpen, setNotificationOpen] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setUser(data);
//       } catch (err: any) {
//         setError(err.message);
//         removeToken();
//         window.location.href = "/login";
//       }
//     };

//     fetchUserData();

//     // Listen for new supplier registration
//     socket.on("new_supplier_registered", (data) => {
//       setNotifications((prev) => [data.message, ...prev]);
//       setUnreadCount((prev) => prev + 1);
//     });

//     return () => {
//       socket.off("new_supplier_registered");
//     };
//   }, []);

//   const handleNotificationClick = () => {
//     setNotificationOpen(true);
//     setUnreadCount(0);
//   };

//   const clearNotifications = () => {
//     setNotifications([]);
//     setNotificationOpen(false);
//   };

//   if (error) return <p>Error: {error}</p>;

//   if (!user) {
//     return (
//       <div className="flex flex-col m-4">
//         <div className="space-y-2 m-1">
//           <Skeleton className="h-4 w-[200px]" />
//           <Skeleton className="h-4 w-[250px]" />
//         </div>
//         <div className="space-x-4 flex">
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//           <Skeleton className="h-[160px] w-[200px] rounded-xl" />
//         </div>
//       </div>
//     );
//   }

//   const isSuperAdmin = user.role === 'superadmin';

//   return (
//     <DashboardContainer scrollable>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold tracking-tight">
//             Hi, {user.Company_name}
//           </h2>
          
//           {/* Notification Bell */}
//           <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
//             <PopoverTrigger asChild>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="relative"
//                 onClick={handleNotificationClick}
//               >
//                 <Bell className="h-5 w-5" />
//                 {unreadCount > 0 && (
//                   <Badge 
//                     variant="destructive" 
//                     className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
//                   >
//                     {unreadCount}
//                   </Badge>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-0" align="end">
//               <div className="flex items-center justify-between px-4 py-3 border-b">
//                 <h3 className="font-semibold">Notifications</h3>
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={clearNotifications}
//                   disabled={notifications.length === 0}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               {notifications.length > 0 ? (
//                 <div className="max-h-60 overflow-y-auto">
//                   {notifications.map((note, index) => (
//                     <div 
//                       key={index} 
//                       className="px-4 py-3 border-b hover:bg-accent transition-colors"
//                     >
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 pt-0.5">
//                           <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
//                         </div>
//                         <div className="ml-3 flex-1">
//                           <p className="text-sm">{note}</p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {new Date().toLocaleTimeString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-4 text-center text-sm text-muted-foreground">
//                   No notifications yet
//                 </div>
//               )}
//             </PopoverContent>
//           </Popover>
//         </div>

//         <Tabs defaultValue="supplier" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="supplier">Supplier</TabsTrigger>
//             <TabsTrigger value="agent">Agent</TabsTrigger>
//             <TabsTrigger value="admin">Admin</TabsTrigger>
//             <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
//           </TabsList>

//           {/* Supplier Tab - Show for both admin and superadmin */}
//           <TabsContent value="supplier" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Supplier List</div>
//                   <p className="text-xs text-muted-foreground">find all supplier here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-supplier">
//                     <Button variant="outline">View Supplier</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>

//               {/* Only show Add Margin for superadmin */}
//               {isSuperAdmin && (
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                     <IndianRupee width={20} height={20} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-xl font-bold">Add Margin</div>
//                     <p className="text-xs text-muted-foreground">add supplier-wise margin</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Link href="/dashboard/admin/add-margin">
//                       <Button variant="outline">Add Margin</Button>
//                     </Link>
//                   </CardFooter>
//                 </Card>
//               )}

//               {/* Only show Vehicle Info for superadmin */}
//               {isSuperAdmin && (
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Supplier</CardTitle>
//                     <Car width={20} height={20} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-xl font-bold">Vehicle Info</div>
//                     <p className="text-xs text-muted-foreground">add vehicle model, brand, etc.</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Link href="/dashboard/admin/vehicle-details">
//                       <Button variant="outline">Add Info</Button>
//                     </Link>
//                   </CardFooter>
//                 </Card>
//               )}
//             </div>
//           </TabsContent>

//           {/* Agent Tab */}
//           <TabsContent value="agent" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Agent</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Agent List</div>
//                   <p className="text-xs text-muted-foreground">find all agents here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-agent">
//                     <Button variant="outline">View Agent</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Admin Tab - Different content for admin vs superadmin */}
//           <TabsContent value="admin" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               {/* Show Admin List for both roles */}
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Admin</CardTitle>
//                   <FileUser width={20} height={20} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-xl font-bold">Admin List</div>
//                   <p className="text-xs text-muted-foreground">find all admin here</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Link href="/dashboard/admin/all-admin">
//                     <Button variant="outline">View Admin</Button>
//                   </Link>
//                 </CardFooter>
//               </Card>

//               {/* Only show Add Admin for superadmin */}
//               {isSuperAdmin && (
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Admin</CardTitle>
//                     <User width={20} height={20} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-xl font-bold">Add Admin</div>
//                     <p className="text-xs text-muted-foreground">add new admin here</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Link href="/dashboard/admin/add-admin">
//                       <Button variant="outline">Add Admin</Button>
//                     </Link>
//                   </CardFooter>
//                 </Card>
//               )}

//               {/* Example: Add cards that only show for regular admin */}
//               {!isSuperAdmin && user.AdminOperation && (
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Operations</CardTitle>
//                     <User width={20} height={20} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-xl font-bold">Admin Operations</div>
//                     <p className="text-xs text-muted-foreground">manage admin operations</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Link href="/dashboard/admin/operations">
//                       <Button variant="outline">Manage</Button>
//                     </Link>
//                   </CardFooter>
//                 </Card>
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardContainer>
//   );
// };

// export default Page;


"use client";

import DashboardContainer from "@/components/layout/DashboardContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  FileUser,
  IndianRupee,
  User,
  Bell,
  X,
  Settings,
  Package,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

const Page = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setUser(data);
      } catch (err: any) {
        setError(err.message);
        removeToken();
        window.location.href = "/login";
      }
    };

    fetchUserData();

    // Listen for new supplier registration
    socket.on("new_supplier_registered", (data) => {
      setNotifications((prev) => [data.message, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("new_supplier_registered");
    };
  }, []);

  const handleNotificationClick = () => {
    setNotificationOpen(true);
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationOpen(false);
  };

  if (error) return <p>Error: {error}</p>;

  if (!user) {
    return (
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
  }

  const isSuperAdmin = user.role === 'superadmin';

  // Check permissions for admin
  const hasPermission = (permission: string) => {
    return isSuperAdmin || user[permission] === true;
  };

  // Admin tabs data
  const adminTabs = [
    {
      value: "operation",
      label: "Operation",
      icon: Settings,
      items: [
        {
          title: "Agent Operations",
          url: "/dashboard/admin/all-agent",
          permission: "AgentOperation",
          icon: Settings,
        },
        {
          title: "Supplier Operations",
          url: "/dashboard/admin/all-supplier",
          permission: "SupplierOpration",
          icon: Settings,
        },
      ].filter(item => hasPermission(item.permission)),
    },
    {
      value: "product",
      label: "Product",
      icon: Package,
      items: [
        {
          title: "Agent Products",
          url: "/dashboard/admin/agent-products",
          permission: "Agent_product",
          icon: Package,
        },
        {
          title: "Supplier Products",
          url: "/dashboard/admin/vehicle-details",
          permission: "Supplier_product",
          icon: Package,
        },
      ].filter(item => hasPermission(item.permission)),
    },
    {
      value: "account",
      label: "Account",
      icon: CreditCard,
      items: [
        {
          title: "Agent Accounts",
          url: "/dashboard/admin/agent-accounts",
          permission: "AgentAccount",
          icon: CreditCard,
        },
        {
          title: "Supplier Accounts",
          url: "/dashboard/admin/supplier-accounts",
          permission: "SupplierAccount",
          icon: CreditCard,
        },
      ].filter(item => hasPermission(item.permission)),
    },
  ].filter(tab => tab.items.length > 0); // Only show tabs with items

  return (
    <DashboardContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {user.Company_name}
          </h2>
          
          {/* Notification Bell */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearNotifications}
                  disabled={notifications.length === 0}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {notifications.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((note, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-3 border-b hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm">{note}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {isSuperAdmin ? (
          // SuperAdmin View (original layout)
          <Tabs defaultValue="supplier" className="space-y-4">
            <TabsList>
              <TabsTrigger value="supplier">Supplier</TabsTrigger>
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
            </TabsList>

            {/* Supplier Tab */}
            <TabsContent value="supplier" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Supplier</CardTitle>
                    <FileUser width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Supplier List</div>
                    <p className="text-xs text-muted-foreground">find all supplier here</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/all-supplier">
                      <Button variant="outline">View Supplier</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Supplier</CardTitle>
                    <IndianRupee width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Add Margin</div>
                    <p className="text-xs text-muted-foreground">add supplier-wise margin</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/add-margin">
                      <Button variant="outline">Add Margin</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Supplier</CardTitle>
                    <Car width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Vehicle Info</div>
                    <p className="text-xs text-muted-foreground">add vehicle model, brand, etc.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/vehicle-details">
                      <Button variant="outline">Add Info</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Agent Tab */}
            <TabsContent value="agent" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Agent</CardTitle>
                    <FileUser width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Agent List</div>
                    <p className="text-xs text-muted-foreground">find all agents here</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/all-agent">
                      <Button variant="outline">View Agent</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Admin</CardTitle>
                    <FileUser width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Admin List</div>
                    <p className="text-xs text-muted-foreground">find all admin here</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/all-admin">
                      <Button variant="outline">View Admin</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Admin</CardTitle>
                    <User width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Add Admin</div>
                    <p className="text-xs text-muted-foreground">add new admin here</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/admin/add-admin">
                      <Button variant="outline">Add Admin</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Admin View (new permission-based tabs)
          <Tabs defaultValue={adminTabs[0]?.value || ""} className="space-y-4">
            <TabsList>
              {adminTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {adminTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {tab.items.map((item) => (
                    <Card key={item.title}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{tab.label || item.title}</CardTitle>
                        {item.icon && <item.icon width={20} height={20} />}
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">{item.title}</div>
                        <p className="text-xs text-muted-foreground">Manage {item.title.toLowerCase()}</p>
                      </CardContent>
                      <CardFooter>
                        <Link href={item.url}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardContainer>
  );
};

export default Page;