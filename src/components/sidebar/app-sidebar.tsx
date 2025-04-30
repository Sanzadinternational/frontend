
"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sideBarItems } from "../constants/data";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Car,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "../theme/ThemeToggler";
import { Icons } from "../icons";
import { UserNav } from "../layout/user-nav";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
export const company = {
  name: "Sanzad",
  logo: Car,
  plan: "International",
};

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { openMobile, setOpenMobile } = useSidebar();

  const logout = () => {
    try {
      removeToken();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(
          `${API_BASE_URL}/dashboard`
        );
        setUserData(data);
        console.log("userData",data);
      } catch (err: any) {
        console.log("API error fetching data", err);
        setError(err.message);
        removeToken();
        router.push("/login");
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    if (openMobile && window.innerWidth < 768) {
      setOpenMobile(false); 
    }
  }, [pathname]);
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>Loading...</p>;

  const rolename = userData?.role;
  
  // Filter sidebar items based on role and permissions
  let roleData = sideBarItems.filter((name) => name.role === rolename);
  
  // Special handling for admin role to filter based on permissions

  if (rolename === 'admin') {
    roleData = roleData.map(roleItem => ({
      ...roleItem,
      roleItems: roleItem.roleItems.map(item => {
        // For items with sub-items, filter based on permissions
        if (item.items && item.items.length > 0) {
          const filteredItems = item.items.filter(subItem => {
            // Check permission flags from userData
            if (subItem.show) {
              return userData[subItem.show] === true;
            }
            return true;
          });
          
          // Only return the item if it has filtered sub-items
          if (filteredItems.length > 0) {
            return {
              ...item,
              items: filteredItems
            };
          }
          return null; // Will be filtered out
        }
        // Return top-level items without sub-items as-is
        return item;
      }).filter(Boolean) // Remove null entries
    }));
  }
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-white dark:bg-black">
        <SidebarHeader className="bg-white dark:bg-black">
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <company.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs">{company.plan}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden bg-white dark:bg-black">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>
              {roleData.map((item) =>
                item.roleItems.map((data) => {
                  const Icon = data.icon ? Icons[data.icon] : Icons.logo;
                  return data?.items && data?.items.length > 0 ? (
                    <Collapsible
                      key={data.title}
                      asChild
                      defaultOpen={data.isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={data.title}
                            isActive={pathname === data.url}
                          >
                            {data.icon && <Icon />}
                            <span>{data.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {data.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={data.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={data.title}
                        isActive={pathname === data.url}
                      >
                        <Link href={data.url}>
                          <Icon />
                          <span>{data.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white dark:bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={userData?.avatar || "https://github.com/shadcn.png1"}
                        alt="avatar"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                        {userData?.Company_name?.slice(0, 2)?.toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData?.Company_name || "User Name"}
                      </span>
                      <span className="truncate text-xs">
                        {userData?.Email || "user@example.com"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData?.avatar || "https://github.com/shadcn.png1"}
                          alt="avatar"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                          {userData?.Company_name?.slice(0, 2)?.toUpperCase() || "NA"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData?.Company_name || "User Name"}
                        </span>
                        <span className="truncate text-xs">
                          {userData?.Email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
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
                    {rolename === "supplier" && (
                      <DropdownMenuItem>
                        <Link href="/dashboard/supplier/api" className="flex">
                          <CreditCard />
                          Integrate API
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Link href={`/dashboard/${rolename}`}>
            Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2 px-4">
            <UserNav />
            <ThemeToggler />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

