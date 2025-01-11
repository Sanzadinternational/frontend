"use client"
import Image from "next/image";
import Link from "next/link";
import ThemeToggler from "./theme/ThemeToggler";
import { Flag, IndianRupee,Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "./utils/auth";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        console.log("User Data:", data); // Debugging log for API response
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
    // return <p className="text-red-500 text-center">Error: {error}</p>;
  }
  return (
    <div className="text-white py-2 px-5 mx-10 my-4 flex justify-between rounded-sm items-center" style={{backgroundColor:'#2f2483'}}>
      <div>
        <Link href="/">
          <Image src="/sanzad-logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>
      <div className="hidden md:flex justify-between items-center gap-4">
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="/">
          Home
        </Link>
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="/agent">
          Agent
        </Link>
        <Link
          className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1"
          href="/supplier"
        >
          Supplier
        </Link>
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="/admin">
          Admin
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className="mr-2 flex items-center md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Menu/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/agent">Agent</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/supplier">Supplier</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mr-2 flex items-center">
        {user?.Company_name || user !== null ? (
            <div>
              <span className="font-semibold">{user.Company_name}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:text-indigo-400 font-medium"
            >
              Login
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 divide-x divide-white border border-slate-100 mr-2 p-1 rounded-sm">
          <div>
            <Flag width={20} height={20} />
          </div>
          <div>
            <IndianRupee width={20} height={20} />
          </div>
        </div>
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Header;
