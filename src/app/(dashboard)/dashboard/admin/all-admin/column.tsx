import { ColumnDef } from "@tanstack/react-table";

// This type defines the shape of our data
export type User = {
  name: string;
  email: string;
  agentoperation: "Allowed" | "Not-Allowed";
  agentaccount: "Allowed" | "Not-Allowed";
  agentproduct: "Allowed" | "Not-Allowed";
  supplieroperation: "Allowed" | "Not-Allowed";
  supplieraccount: "Allowed" | "Not-Allowed";
  supplierproduct: "Allowed" | "Not-Allowed";
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
    accessorKey: "agentproduct",
    header: "Agent-Product",
  },
  {
    accessorKey: "supplieroperation",
    header: "Supplier-Operation",
  },
  {
    accessorKey: "supplieraccount",
    header: "Supplier-Account",
  },
  {
    accessorKey: "supplierproduct",
    header: "Supplier-Product",
  },
];
