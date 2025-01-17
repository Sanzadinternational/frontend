'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from '../utils/auth';
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
export function UserNav() {

const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  // const router = useRouter();
  const logout = () => {
    try {
      removeToken();
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        console.log("API data from navbar:", data); // Debugging log for API response
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user data:", err); // Debugging log for errors
        setError(err.message);
        removeToken();
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    console.log(error);
  }
  const rolename = user?.role;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage
                src={session.user?.image ?? ''}
                alt={session.user?.name ?? ''}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback> */}
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="avatar" /> */}
              <AvatarImage
                        src={user?.avatar || "https://github.com/shadcn.png1"}
                        alt="avatar"
                      />
              {/* <AvatarFallback className="text-black">AK</AvatarFallback> */}
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
                {/* {session.user?.name} */}
                {user?.Company_name || "User Name"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {/* {session.user?.email} */}
                {user?.Email || "user@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem> */}
             <DropdownMenuItem>
                      <BadgeCheck />
                      Profile
                    </DropdownMenuItem>
                    {
                      rolename==='supplier'&&(<DropdownMenuItem>
                        <Link href='/dashboard/supplier/api' className="flex">
                        <CreditCard />
                        Integrate API
                        </Link>
                      </DropdownMenuItem>)
                    }
                    
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
          onClick={logout}
          >
            <LogOut/>
            Logout
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
//   }
}