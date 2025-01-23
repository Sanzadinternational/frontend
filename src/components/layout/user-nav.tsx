// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "../utils/auth";
// import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// export function UserNav() {
//   const [user, setUser] = useState<any>(null);
//   const [error, setError] = useState<string>("");
//   // const router = useRouter();
//   const logout = () => {
//     try {
//       removeToken();
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Failed to navigate:", error);
//     }
//   };
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(
//           "http://localhost:8000/api/V1/dashboard"
//         );
//         console.log("API data from navbar:", data); // Debugging log for API response
//         setUser(data);
//       } catch (err: any) {
//         console.error("Error fetching user data:", err); // Debugging log for errors
//         setError(err.message);
//         removeToken();
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (error) {
//     console.log(error);
//   }
//   const rolename = user?.role;
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8">
//           <Avatar className="h-8 w-8">
//             <AvatarImage
//               src={user?.avatar || "https://github.com/shadcn.png1"}
//               alt="avatar"
//             />
//             <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
//               {user?.Company_name?.slice(0, 2) || "NA"}
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">
//               {user?.Company_name || "User Name"}
//             </p>
//             <p className="text-xs leading-none text-muted-foreground">
//               {user?.Email || "user@example.com"}
//             </p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             {
//               rolename === 'superadmin'?(<Link
//                 href={`/dashboard/admin/profile`}
//                 className="flex items-center gap-2"
//               ><BadgeCheck />
//               Profile
//             </Link>):(<Link
//                 href={`/dashboard/${rolename}/profile`}
//                 className="flex items-center gap-2"
//               ><BadgeCheck />
//               Profile
//             </Link>)
//             }
//           </DropdownMenuItem>
//           {rolename === "supplier" && (
//             <DropdownMenuItem>
//               <Link href="/dashboard/supplier/api" className="flex">
//                 <CreditCard />
//                 Integrate API
//               </Link>
//             </DropdownMenuItem>
//           )}

//           <DropdownMenuItem>
//             <Bell />
//             Notifications
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={logout}>
//           <LogOut />
//           Logout
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
//   //   }
// }



"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "../utils/auth";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserNav() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Logout function
  const logout = () => {
    try {
      removeToken();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        console.log("API data from navbar:", data); // Debugging log for API response
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user data:", err); // Debugging log for errors
        setError(err.message);
        removeToken(); // Remove token in case of error
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    console.error("Error in UserNav:", error); // Enhanced error handling
  }

  const rolename = user?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar || "https://github.com/shadcn.png1"}
              alt="avatar"
            />
            <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
              {user?.Company_name?.slice(0, 2) || "NA"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.Company_name || "User Name"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.Email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Role-Based Profile Links */}
          <DropdownMenuItem>
            <Link
              href={
                rolename === "superadmin"
                  ? `/dashboard/admin/profile`
                  : `/dashboard/${rolename}/profile`
              }
              className="flex items-center gap-2"
            >
              <BadgeCheck />
              Profile
            </Link>
          </DropdownMenuItem>

          {/* Supplier-Specific Links */}
          {rolename === "supplier" && (
            <DropdownMenuItem>
              <Link href="/dashboard/supplier/api" className="flex">
                <CreditCard />
                Integrate API
              </Link>
            </DropdownMenuItem>
          )}

          {/* Notifications */}
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
