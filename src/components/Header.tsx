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
    <div className="text-white py-2 px-5 mx-10 my-4 flex justify-between rounded-sm items-center" style={{backgroundColor:'rgba(47, 36, 131,1)'}}>
      <div>
        <Link href="/">
          <Image src="/sanzad-logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>
      <div className="hidden md:flex justify-between items-center gap-4">
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="/">
          Home
        </Link>
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="#">
          About
        </Link>
        <Link
          className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1"
          href="#"
        >
          Contact
        </Link>
        <Link className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1" href="#">
          Features
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
                <Link href="#">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mr-2 flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div>
                  <span className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1 cursor-pointer hidden md:block">{user?.Company_name ||
                            "NA"}</span>
                            <span className="bg-blue-200 text-indigo-700 rounded-md px-2 py-1 cursor-pointer md:hidden">{user?.Company_name?.slice(0, 2)?.toUpperCase() ||
                            "NA"}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem  onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hover:bg-blue-200 hover:text-indigo-700 rounded-md px-2 py-1">
              Login
            </Link>
          )}
        </div>
        <div className="hidden md:grid grid-cols-2 divide-x divide-white border border-slate-100 mr-2 p-1 rounded-sm">
          <div>
            <Flag width={20} height={20} />
          </div>
          <div>
            <IndianRupee width={20} height={20} />
          </div>
        </div>
        <div className="hidden md:block">
        <ThemeToggler />
        </div>
      </div>
    </div>
  );
};

export default Header;
