"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
export type User = {
  name: string;
  email: string;
  contact: string;
  status: "Pending" | "Approved" | "Rejected";
};

export const columns = (
  handleAction: (email: string, status: number) => void,
  handleView: (email: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact No.",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status, email } = row.original;

      if (status === "Pending") {
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleAction(email, 1)}>Approve</Button>
            <Button variant='destructive' onClick={() => handleAction(email, 2)}>Reject</Button>
          </div>
        );
      }

      return <span>{status}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {email} = row.original
 
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
              onClick={() => handleView(email)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
