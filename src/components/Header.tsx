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

const Header = () => {
  return (
    <div className="text-white bg-slate-800 py-2 px-5 mx-10 my-4 flex justify-between rounded-sm items-center">
      <div>
        <Link href="/">
          <Image src="/sanzad-logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>
      <div className="hidden md:flex justify-between items-center gap-4">
        <Link className="hover:bg-slate-700 rounded-md px-2 py-1" href="/">
          Home
        </Link>
        <Link className="hover:bg-slate-700 rounded-md px-2 py-1" href="/agent">
          Agent
        </Link>
        <Link
          className="hover:bg-slate-700 rounded-md px-2 py-1"
          href="/supplier"
        >
          Supplier
        </Link>
        <Link className="hover:bg-slate-700 rounded-md px-2 py-1" href="/login">
          Login
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
