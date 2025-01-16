"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vehicle = {
  uniqueId: string;
    vehicleType: string;
    country: string;
    city: string;
    serviceType: string;
    dateRange: { from: string; to: string } | null;
    // extraSpace: string[]; // Array of strings
    // transferCar: {
    //   transferFrom: string;
    //   transferTo: string;
    //   price: string;
    // }[];

    // id: string;
    // vehicleType: string;
    // country: string;
    // city: string;
    // serviceType: string;
    // amount: number;
    // transfers:string;
    // dateRange:string;
}

export const columns: ColumnDef<Vehicle>[] = [
    
    {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
      },
      {
        accessorKey: "country",
        // header: "Country",
        header: ({ column }) => {
          return (
            <Button className="ps-0"
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Country
              <ArrowUpDown className="ml-2 h-4 w-full" />
            </Button>
          )
        },
      },
      {
        accessorKey: "city",
        // header: "City",
        header: ({ column }) => {
          return (
            <Button className="ps-0"
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              City
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: "serviceType",
        header: "Service Type",
      },
      {
        accessorKey: "dateRange",
        header: "Date Range",
        cell: ({ row }) => {
          const { from, to } = row.original.dateRange || {};
          return from && to ? `${from} - ${to}` : "N/A";
        },
      },
      // {
      //   accessorKey: "extraSpace",
      //   header: "Extra Space",
      //   cell: ({ row }) => {
      //     const extraSpace = row.original.extraSpace;
      //     return extraSpace.length > 0 ? extraSpace.join(", ") : "N/A";
      //   },
      // },

      // {
      //   accessorKey: "transferCar",
      //   header: "Transfers",
      //   cell: ({ row }) => {
      //     const transfers = row.original.transferCar;
      //     if (transfers.length === 0) return "N/A";
      //     return (
      //       <ul className="list-disc list-inside">
      //         {transfers.map((transfer, index) => (
      //           <li key={index}>
      //             {transfer.transferFrom} to {transfer.transferTo} - ₹{transfer.price}
      //           </li>
      //         ))}
      //       </ul>
      //     );
      //   },
      // },


    // {
    //     accessorKey: "vehicleType",
    //     header: "Vehicle Type",
    //   },
    //   {
    //     accessorKey: "serviceType",
    //     header: "Service Type",
    //   },
    //   {
    //     accessorKey: "country",
    //     // header: "Country",
    //     header: ({ column }) => {
    //         return (
    //           <Button className="ps-0"
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //           >
    //             Country
    //             <ArrowUpDown className="ml-2 h-4 w-full" />
    //           </Button>
    //         )
    //       },
    //   },
    //   {
    //     accessorKey: "city",
    //     // header: "City",
    //     header: ({ column }) => {
    //         return (
    //           <Button className="ps-0"
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //           >
    //             City
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //           </Button>
    //         )
    //       },
    //   },
    //   {
    //     accessorKey: "transfers",
    //     header: "Transfers",
    //   },
    //   {
    //     accessorKey: "dateRange",
    //     header: "Date Range",
    //   },
    //   {
    //     accessorKey: "amount",
    //     header: "Amount",
    //   },
      {
        id: "actions",
        cell: ({ row }) => {
          const vehicle = row.original
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(vehicle.uniqueId)}
                >
                  Copy Vehicle ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      
]
