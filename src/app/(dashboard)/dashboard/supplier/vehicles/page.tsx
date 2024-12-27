import { Vehicle, columns } from "./columns"
import { DataTable } from "./data-table"
import DashboardContainer from "@/components/layout/DashboardContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

async function getData(): Promise<Vehicle[]> {
  // Fetch data from your API here.
//   try {
//     const response = await fetch("http://localhost:8000/api/V1/supplier/GetData");
//     if (!response.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     const data = await response.json();
//     return data.map((item: any) => ({
//       id: item.id,
//       vehicleType: item.vehicleType,
//       country: item.country,
//       city: item.city,
//       serviceType: item.serviceType,
//       dateRange: item.DateRange ? { from: item.DateRange.from, to: item.DateRange.to } : null,
//       extraSpace: item.ExtraSpace || [],
//       rows: item.rows.map((row: any) => ({
//         transferFrom: row.Transfer_from,
//         transferTo: row.Transfer_to,
//         price: row.Price,
//         nightTime: row.NightTime,
//       })),
//     }));
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return [];
//   }
  return [
    {
        id: "vh123",
        vehicleType: "SUV",
        country: "India",
        city: "Noida",
        serviceType: "Premiem",
        amount: 345,
        dateRange:'27-12-24 to 10-01-25',
        transfers:"Airport to Cruise"
    },
    {
        id: "vhq456",
        vehicleType: "XUV",
        country: "USA",
        city: "New York",
        serviceType: "Standard",
        amount: 545,
        dateRange:'29-12-24 to 15-02-25',
        transfers:"Cruise to Airport"
    },
    {
        id: "vr133",
        vehicleType: "Sedan",
        country: "India",
        city: "Patna",
        serviceType: "Premiem",
        amount: 445,
        dateRange:'27-10-24 to 10-11-24',
        transfers:"Airport to Hotel"
    },
    {
        id: "uk123",
        vehicleType: "SUV",
        country: "France",
        city: "Paris",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'27-01-25 to 10-02-25',
        transfers:"City Center to Cruise"
    },
    {
        id: "vh23",
        vehicleType: "XUV",
        country: "UAE",
        city: "Dubai",
        serviceType: "Standard",
        amount: 567,
        dateRange:'27-11-24 to 10-02-25',
        transfers:"Airport to City Center"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
    {
        id: "th123",
        vehicleType: "Sedan",
        country: "India",
        city: "Mumbai",
        serviceType: "Premiem",
        amount: 645,
        dateRange:'20-12-24 to 19-01-25',
        transfers:"Hotel to Cruise"
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <DashboardContainer scrollable>
        <div>
        <h2 className="text-2xl font-bold tracking-tight">
            All Vehicles
          </h2>
          <p className="text-muted-foreground">Here is the list of all vehicles!</p>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
    <div className="container mx-auto py-2 px-1">
      <DataTable columns={columns} data={data} />
    </div>
    <ScrollBar orientation="horizontal" />
    </ScrollArea>
     </DashboardContainer>
  )
}
