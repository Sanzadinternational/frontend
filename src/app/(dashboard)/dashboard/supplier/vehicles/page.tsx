import { Vehicle, columns } from "./columns"
import { DataTable } from "./data-table"
import DashboardContainer from "@/components/layout/DashboardContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

async function getData(): Promise<Vehicle[]> {
  // Fetch data from your API here.
  try {
    const response = await fetch("http://localhost:8000/api/V1/supplier/GetAllCarDetails");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
  //   return data.map((item: any) => ({
  //     uniqueId: item.uniqueId,
  //     vehicleType: item.VehicleType,
  //     country: item.Country,
  //     city: item.City,
  //     serviceType: item.ServiceType,
  //     dateRange: item.From - item.To,
  //     // extraSpace: item.ExtraSpace || [],
  //     // transferCar: item.TransferCar.map((row: any) => ({
  //     //   transferFrom: row.Transfer_from,
  //     //   transferTo: row.Transfer_to,
  //     //   price: row.Price,
  //     // })),
  //   }));
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   return [];
  // }

  return data.map((item: any) => ({
    uniqueId: item.Car_Details.uniqueId,
    vehicleType: item.Car_Details.VehicleType,
    country: item.Car_Details.Country,
    city: item.Car_Details.City,
    serviceType: item.Car_Details.ServiceType,
    dateRange: item.Car_Details.From && item.Car_Details.To 
              ? { from: item.Car_Details.From, to: item.Car_Details.To } 
              : null,
              transferCar: Array.isArray(item.TransferCar)
  ? item.TransferCar.map((row: any) => ({
      transferFrom: row.Transfer_from,
      transferTo: row.Transfer_to,
      price: row.Price,
    }))
  : item.TransferCar
  ? [
      {
        transferFrom: item.TransferCar.Transfer_from,
        transferTo: item.TransferCar.Transfer_to,
        price: item.TransferCar.Price,
        nightTime: item.TransferCar.NightTime || "N/A",
      },
    ]
  : [],
  }));
} catch (error) {
  console.error("Error fetching data:", error);
  return [];
}





  // return [
  //   {
  //       id: "vh123",
  //       vehicleType: "SUV",
  //       country: "India",
  //       city: "Noida",
  //       serviceType: "Premiem",
  //       amount: 345,
  //       dateRange:'27-12-24 to 10-01-25',
  //       transfers:"Airport to Cruise"
  //   },
  //   {
  //       id: "vhq456",
  //       vehicleType: "XUV",
  //       country: "USA",
  //       city: "New York",
  //       serviceType: "Standard",
  //       amount: 545,
  //       dateRange:'29-12-24 to 15-02-25',
  //       transfers:"Cruise to Airport"
  //   },
  //   {
  //       id: "vr133",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Patna",
  //       serviceType: "Premiem",
  //       amount: 445,
  //       dateRange:'27-10-24 to 10-11-24',
  //       transfers:"Airport to Hotel"
  //   },
  //   {
  //       id: "uk123",
  //       vehicleType: "SUV",
  //       country: "France",
  //       city: "Paris",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'27-01-25 to 10-02-25',
  //       transfers:"City Center to Cruise"
  //   },
  //   {
  //       id: "vh23",
  //       vehicleType: "XUV",
  //       country: "UAE",
  //       city: "Dubai",
  //       serviceType: "Standard",
  //       amount: 567,
  //       dateRange:'27-11-24 to 10-02-25',
  //       transfers:"Airport to City Center"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  //   {
  //       id: "th123",
  //       vehicleType: "Sedan",
  //       country: "India",
  //       city: "Mumbai",
  //       serviceType: "Premiem",
  //       amount: 645,
  //       dateRange:'20-12-24 to 19-01-25',
  //       transfers:"Hotel to Cruise"
  //   },
  // ]
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
