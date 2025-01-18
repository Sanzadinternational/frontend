"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  name: string
  email: string
  agentoperation:boolean
  agentaccount:boolean
  supplieroperation:boolean
  supplieraccount:boolean
}

export const columns: ColumnDef<Payment>[] = [
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
]
