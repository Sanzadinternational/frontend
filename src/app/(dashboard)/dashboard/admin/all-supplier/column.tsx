"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
export type User = {
  name: string;
  email: string;
  contact: string;
  status: "Pending" | "Approved" | "Rejected";
};

export const columns = (handleAction: (email: string, status: number) => void): ColumnDef<User>[] => [
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
            {/* <button
              onClick={() => handleAction(email, 1)}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Approve
            </button> */}
            {/* <button
              onClick={() => handleAction(email, 2)}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Reject
            </button> */}
            <Button onClick={() => handleAction(email, 1)}>Approve</Button>
            <Button variant='destructive' onClick={() => handleAction(email, 2)}>Reject</Button>
          </div>
        );
      }

      return <span>{status}</span>;
    },
  },
];
