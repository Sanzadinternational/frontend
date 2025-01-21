import { ColumnDef } from "@tanstack/react-table";

// This type defines the shape of our data
export type User = {
  name: string;
  email: string;
  agentoperation: "Allowed" | "Not-Allowed";
  agentaccount: "Allowed" | "Not-Allowed";
  supplieroperation: "Allowed" | "Not-Allowed";
  supplieraccount: "Allowed" | "Not-Allowed";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "agentoperation",
    header: "Agent-Operation",
  },
  {
    accessorKey: "agentaccount",
    header: "Agent-Account",
  },
  {
    accessorKey: "supplieroperation",
    header: "Supplier-Operation",
  },
  {
    accessorKey: "supplieraccount",
    header: "Supplier-Account",
  },
];
