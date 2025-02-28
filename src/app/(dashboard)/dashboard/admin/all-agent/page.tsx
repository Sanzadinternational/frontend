// "use client";

// import { useState, useEffect } from "react";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { DataTable } from "./data-table";
// import { User, columns } from "./column";

// async function getData(): Promise<User[]> {
//   const response = await fetch("http://localhost:8000/api/V1/admin/AllAgentRecords", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const apiData = await response.json();

//   // Map API data to the User type
//   return apiData.map((item: any) => ({
//     name: item.Company_name,
//     email: item.Email,
//     contact: item.Mobile_number || item.Office_number,
//     status: item.IsApproved === 1 ? "Approved" : item.IsApproved === 0 ? "Pending" : "Rejected",
//   }));
// }

// export default function DemoPage() {
//   const [data, setData] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const fetchedData = await getData();
//         setData(fetchedData);
//       } catch (err) {
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   const handleAction = async (email: string, status: number) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/V1/admin/ChangeAgentApprovalStatus/${email}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isApproved:status }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update status");
//       }

//       // Update local state after successful API call
//       setData((prevData) =>
//         prevData.map((user) =>
//           user.email === email
//             ? { ...user, status: status === 1 ? "Approved" : "Rejected" }
//             : user
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert("An error occurred while updating the status.");
//     }
//   };

//   return (
//     <DashboardContainer>
//       <div className="container mx-auto py-10">
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <DataTable columns={columns(handleAction)} data={data} />
//         )}
//       </div>
//     </DashboardContainer>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { DataTable } from "./data-table";
import { User, columns } from "./column";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
async function getData(): Promise<User[]> {
  const response = await fetch("http://localhost:8000/api/V1/admin/AllAgentRecords", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const apiData = await response.json();

  return apiData.map((item: any) => ({
    name: item.Company_name,
    email: item.Email,
    contact: item.Mobile_number || item.Office_number,
    status: item.IsApproved === 1 ? "Approved" : item.IsApproved === 0 ? "Pending" : "Rejected",
  }));
}

async function getUserDetails(email: string) {
  const response = await fetch(`http://localhost:8000/api/V1/admin/AgentSingleView/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export default function DemoPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleView = async (email: string) => {
    try {
      const userDetails = await getUserDetails(email);
      if (Array.isArray(userDetails) && userDetails.length > 0) {
        setSelectedUser(userDetails[0]); // Extract first item
      } else {
        setSelectedUser(null);
      }
      console.log(userDetails);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleAction = async (email: string, status: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/V1/admin/ChangeAgentApprovalStatus/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setData((prevData) =>
        prevData.map((user) =>
          user.email === email
            ? { ...user, status: status === 1 ? "Approved" : "Rejected" }
            : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the status.");
    }
  };

  return (
    <DashboardContainer>
      <div className="container mx-auto py-10">
        {loading ? (
          <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable columns={columns(handleAction, handleView)} data={data} />
        )}
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div>
              <dl>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Name</dt>
                    <dd>{selectedUser?.Company_name || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{selectedUser?.Email || "N/A"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Country</dt>
                    <dd>{selectedUser?.Country || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">City</dt>
                    <dd>{selectedUser?.City || "N/A"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Office Number</dt>
                    <dd>{selectedUser?.Office_number || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Mobile Number</dt>
                    <dd>{selectedUser?.Mobile_number || "N/A"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Contact_Person</dt>
                    <dd>{selectedUser?.Contact_Person || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Currency</dt>
                    <dd>{selectedUser?.Currency || "N/A"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Address</dt>
                    <dd>{selectedUser?.Address || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Zip Code</dt>
                    <dd>{selectedUser?.Zip_code || "N/A"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">IATA_Code</dt>
                    <dd>{selectedUser?.IATA_Code || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tax ID</dt>
                    <dd>{selectedUser?.Gst_Vat_Tax_number || "N/A"}</dd>
                  </div>
                </div>
              </dl>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  );
}
