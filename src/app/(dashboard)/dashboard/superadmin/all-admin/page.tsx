import DashboardContainer from "@/components/layout/DashboardContainer"
import { Payment, columns } from "./column"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      name: "Ashish",
      email: "m@example.com",
      agentaccount:true,
      agentoperation:true,
      supplieraccount:true,
      supplieroperation:true,
    },
    {
        name: "Sanzad",
        email: "s@example.com",
        agentaccount:false,
        agentoperation:true,
        supplieraccount:false,
        supplieroperation:true,
      },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <DashboardContainer scrollable>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    </DashboardContainer>
  )
}
