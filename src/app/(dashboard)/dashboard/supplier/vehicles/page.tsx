
// import { Vehicle, columns } from "./columns"
// import { DataTable } from "./data-table"
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { useState,useEffect } from "react";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";

// async function getData(): Promise<Vehicle[]> {
//   // const [user, setUser] = useState<any>(null);
//   // const [error, setError] = useState<string>("");

//   // useEffect(() => {
//   //   const fetchUserData = async () => {
//   //     try {
//   //       const data = await fetchWithAuth("http://localhost:8000/api/V1/supplier/dashboard");
//   //       console.log("User Data:", data); // Debugging log for API response
//   //       setUser(data);
        
//   //     } catch (err: any) {
//   //       console.error("Error fetching user data:", err); // Debugging log for errors
//   //       setError(err.message);
//   //       removeToken();
//   //     }
//   //   };

//   //   fetchUserData();
//   // }, []);
//   // Fetch data from your API here.
//   try {
//     const response = await fetch(`http://localhost:8000/api/V1/supplier/getCarDetails/${user.userId}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     const data = await response.json();
//     console.log(data);

//   return data.map((item: any) => ({
//     uniqueId: item.Car_Details.uniqueId,
//     vehicleType: item.Car_Details.VehicleType,
//     country: item.Car_Details.Country,
//     city: item.Car_Details.City,
//     serviceType: item.Car_Details.ServiceType,
//     dateRange: item.Car_Details.From && item.Car_Details.To 
//               ? { from: item.Car_Details.From, to: item.Car_Details.To } 
//               : null,
//               transferCar: Array.isArray(item.TransferCar)
//   ? item.TransferCar.map((row: any) => ({
//       transferFrom: row.Transfer_from,
//       transferTo: row.Transfer_to,
//       price: row.Price,
//     }))
//   : item.TransferCar
//   ? [
//       {
//         transferFrom: item.TransferCar.Transfer_from,
//         transferTo: item.TransferCar.Transfer_to,
//         price: item.TransferCar.Price,
//         nightTime: item.TransferCar.NightTime || "N/A",
//       },
//     ]
//   : [],
//   }));
// } catch (error) {
//   console.error("Error fetching data:", error);
//   return [];
// }

// }

// export default async function DemoPage() {
//   const data = await getData()

//   return (
//     <DashboardContainer scrollable>
//         <div>
//         <h2 className="text-2xl font-bold tracking-tight">
//             All Vehicles
//           </h2>
//           <p className="text-muted-foreground">Here is the list of all vehicles!</p>
//         </div>
//         <ScrollArea className="w-full whitespace-nowrap">
//     <div className="container mx-auto py-2 px-1">
//       <DataTable columns={columns} data={data} />
//     </div>
//     <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//      </DashboardContainer>
//   )
// }


// "use client";

// import { useState, useEffect } from "react";
// import { DataTable } from "./data-table"; // Your table component
// import EditVehicleForm from "@/components/supplier/EditVehicleForm"; // The form component
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken } from "@/components/utils/auth";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal } from "lucide-react"
// import { ArrowUpDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// // Define the Vehicle type
// export type Vehicle = {
//   uniqueId: string;
//   vehicleType: string;
//   country: string;
//   city: string;
//   serviceType: string;
//   dateRange: { from: string; to: string } | null;
//   transferCar: {
//     transferFrom: string;
//     transferTo: string;
//     price: string;
//   }[];
// };

// export default function VehiclePage() {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [error, setError] = useState<string>("");


//   useEffect(() => {
//       const fetchUserData = async () => {
//         try {
//           const data = await fetchWithAuth("http://localhost:8000/api/V1/supplier/dashboard");
//           console.log("table data:", data); // Debugging log for API response
//           setUser(data);
          
          
//         } catch (err: any) {
//           console.error("Error fetching user data:", err); // Debugging log for errors
//           setError(err.message);
//           removeToken();
//         }
//       };
  
//       fetchUserData();
//     }, []);
//   // Fetch all vehicle data
//   const fetchVehicles = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/V1/supplier/getCarDetails/${user.userId}`);
//       if (!response.ok) throw new Error("Failed to fetch vehicles");
//       const data = await response.json();
//       setVehicles(data.map(formatVehicleData)); // Format the API data
//     } catch (error) {
//       console.error("Error fetching vehicles:", error);
//     }
//   };

//   // Format data (adapt based on your API response structure)
//   const formatVehicleData = (item: any): Vehicle => ({
//     uniqueId: item.Car_Details.uniqueId,
//     vehicleType: item.Car_Details.VehicleType,
//     country: item.Car_Details.Country,
//     city: item.Car_Details.City,
//     serviceType: item.Car_Details.ServiceType,
//     dateRange: item.Car_Details.From && item.Car_Details.To
//       ? { from: item.Car_Details.From, to: item.Car_Details.To }
//       : null,
//     transferCar: Array.isArray(item.TransferCar)
//       ? item.TransferCar.map((row: any) => ({
//           transferFrom: row.Transfer_from,
//           transferTo: row.Transfer_to,
//           price: row.Price,
//         }))
//       : [],
//   });

//   // Fetch a single vehicle by ID
//   const fetchVehicleById = async (uniqueId: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/V1/supplier/GetCarDetails/${uniqueId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch vehicle details");
//       const vehicle = await response.json();
//       setEditingVehicle(vehicle);
//       setIsEditing(true);
//       console.log(uniqueId);
//     } catch (error) {
//       console.error("Error fetching vehicle details:", error);
//     }
//   };

//   // Update vehicle details
//   const updateVehicle = async (updatedVehicle: Vehicle) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/V1/supplier/UpdatedSingleCarDetails`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedVehicle),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update vehicle details");
//       await fetchVehicles(); // Refresh table data
//       setIsEditing(false); // Close form
//     } catch (error) {
//       console.error("Error updating vehicle:", error);
//     }
//   };

//   useEffect(() => {
//     fetchVehicles(); // Load vehicles when the component mounts
//   }, []);

//   return (
//     <DashboardContainer scrollable>
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight">All Vehicles</h2>
//         <p className="text-muted-foreground">Manage vehicle details here.</p>
//       </div>

//       <ScrollArea className="w-full whitespace-nowrap">
//         <div className="container mx-auto py-2 px-1">
//           <DataTable
//             columns={[
//               {
//                 accessorKey: "vehicleType",
//                 header: "Vehicle Type",
//               },
//               {
//                 accessorKey: "country",
//                 // header: "Country",
//                 header: ({ column }) => {
//                   return (
//                     <Button className="ps-0"
//                       variant="ghost"
//                       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//                     >
//                       Country
//                       <ArrowUpDown className="ml-2 h-4 w-full" />
//                     </Button>
//                   )
//                 },
//               },
//               {
//                 accessorKey: "city",
//                 // header: "City",
//                 header: ({ column }) => {
//                   return (
//                     <Button className="ps-0"
//                       variant="ghost"
//                       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//                     >
//                       City
//                       <ArrowUpDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   )
//                 },
//               },
//               {
//                 accessorKey: "serviceType",
//                 header: "Service Type",
//               },
//               {
//                 accessorKey: "dateRange",
//                 header: "Date Range",
//                 cell: ({ row }) =>
//                   row.original.dateRange
//                     ? `${row.original.dateRange.from} - ${row.original.dateRange.to}`
//                     : "N/A",
//               },
//               {
//                 accessorKey: "transferCar",
//                 header: "Transfers",
//                 cell: ({ row }) => {
//                   const transfers = row.original.transferCar;
//                   if (transfers.length === 0) return "N/A";
//                   return (
//                     <ul className="list-disc list-inside">
//                       {transfers.map((transfer, index) => (
//                         <li key={index}>
//                           {transfer.transferFrom} to {transfer.transferTo} - ₹{transfer.price}
//                         </li>
//                       ))}
//                     </ul>
//                   );
//                 },
//               },
//               // {
//               //   id: "actions",
//               //   cell: ({ row }) => (
//               //     <button
//               //       onClick={() => fetchVehicleById(row.original.uniqueId)}
//               //       className="btn btn-primary"
//               //     >
//               //       Edit
//               //     </button>
//               //   ),
//               // },

//               {
//                 id: "actions",
//         cell: ({ row }) => {
     
//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => fetchVehicleById(row.original.uniqueId)}>
//                   Edit
//                   </DropdownMenuItem>
//                 <DropdownMenuItem>Delete</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )
//         },
//               },
//             ]}
//             data={vehicles}
//           />
//         </div>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>

//       {isEditing && editingVehicle && (
//         <EditVehicleForm
//           vehicle={editingVehicle}
//           onSave={updateVehicle}
//           onCancel={() => setIsEditing(false)}
//         />
//       )}
//     </DashboardContainer>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./data-table"; // Your table component
import EditVehicleForm from "@/components/supplier/EditVehicleForm"; // The form component
import DashboardContainer from "@/components/layout/DashboardContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the Vehicle type
export type Vehicle = {
  uniqueId: string;
  vehicleType: string;
  country: string;
  city: string;
  serviceType: string;
  dateRange: { from: string; to: string } | null;
  transferCar: {
    transferFrom: string;
    transferTo: string;
    price: string;
  }[];
};

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  // const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/supplier/dashboard");
        console.log("User data:", data);
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        removeToken();
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) return; // Wait for the user data to load
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/V1/supplier/getCarDetails/${user.userId}`);
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(data.map(formatVehicleData));
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]); // Depend on `user`

  const formatVehicleData = (item: any): Vehicle => ({
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
      : [],
  });

  if (loading) {
    return (
      <DashboardContainer scrollable>
        <div>Loading...</div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer scrollable>
        <div>Error: {error}</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer scrollable>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Vehicles</h2>
        <p className="text-muted-foreground">Manage vehicle details here.</p>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="container mx-auto py-2 px-1">
          <DataTable
            columns={[
              {
                accessorKey: "vehicleType",
                header: "Vehicle Type",
              },
              {
                accessorKey: "country",
                header: ({ column }) => (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Country
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                ),
              },
              {
                accessorKey: "city",
                header: ({ column }) => (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    City
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                ),
              },
              {
                accessorKey: "serviceType",
                header: "Service Type",
              },
              {
                accessorKey: "dateRange",
                header: "Date Range",
                cell: ({ row }) =>
                  row.original.dateRange
                    ? `${row.original.dateRange.from} - ${row.original.dateRange.to}`
                    : "N/A",
              },
              {
                accessorKey: "transferCar",
                header: "Transfers",
                cell: ({ row }) => {
                  const transfers = row.original.transferCar;
                  if (!transfers.length) return "N/A";
                  return (
                    <ul>
                      {transfers.map((transfer, index) => (
                        <li key={index}>
                          {transfer.transferFrom} to {transfer.transferTo} - ₹{transfer.price}
                        </li>
                      ))}
                    </ul>
                  );
                },
              },
              {
                id: "actions",
                cell: ({ row }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => console.log(row.original.uniqueId)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              },
            ]}
            data={vehicles}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DashboardContainer>
  );
}
