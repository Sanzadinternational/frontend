
// "use client";

// import { useState, useEffect } from "react";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import { DataTable } from "./data-table";
// import { User, columns } from "./column";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// async function getData(): Promise<User[]> {
//   const response = await fetch(`${API_BASE_URL}/admin/AllAgentRecords`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const apiData = await response.json();

//   return apiData.map((item: any) => ({
//     name: item.Company_name,
//     email: item.Email,
//     contact: item.Mobile_number || item.Office_number,
//     status: item.IsApproved === 1 ? "Approved" : item.IsApproved === 0 ? "Pending" : "Rejected",
//   }));
// }

// async function getUserDetails(email: string) {
//   const response = await fetch(`${API_BASE_URL}/admin/AgentSingleView/${email}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.json();
// }

// export default function DemoPage() {
//   const [loadingActions, setLoadingActions] = useState<{ [email: string]: boolean }>({});
//   const [data, setData] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<any>(null);

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

//   const handleView = async (email: string) => {
//     try {
//       const userDetails = await getUserDetails(email);
//       if (Array.isArray(userDetails) && userDetails.length > 0) {
//         setSelectedUser(userDetails[0]); // Extract first item
//       } else {
//         setSelectedUser(null);
//       }
//       console.log(userDetails);
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//     }
//   };

//   const handleAction = async (email: string, status: number) => {
//     setLoadingActions((prev) => ({ ...prev, [email]: true })); // Start loading
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/ChangeAgentApprovalStatus/${email}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isApproved: status }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update status");
//       }

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
//     }finally {
//       setLoadingActions((prev) => ({ ...prev, [email]: false })); // Stop loading
//     }
//   };

//   return (
//     <DashboardContainer>
//       <div className="container mx-auto py-10">
//         {loading ? (
//           <div className="space-y-4">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-8 w-full" />
//           <Skeleton className="h-8 w-full" />
//           <Skeleton className="h-8 w-full" />
//         </div>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
          
//           <DataTable columns={columns(handleAction, handleView, loadingActions)} data={data} />
//         )}
//       </div>

//       <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>User Details</DialogTitle>
//           </DialogHeader>
//           {selectedUser && (
//             <div>
//               <dl>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">Name</dt>
//                     <dd>{selectedUser?.Company_name || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">Email</dt>
//                     <dd>{selectedUser?.Email || "N/A"}</dd>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">Country</dt>
//                     <dd>{selectedUser?.Country || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">City</dt>
//                     <dd>{selectedUser?.City || "N/A"}</dd>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">Office Number</dt>
//                     <dd>{selectedUser?.Office_number || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">Mobile Number</dt>
//                     <dd>{selectedUser?.Mobile_number || "N/A"}</dd>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">Contact_Person</dt>
//                     <dd>{selectedUser?.Contact_Person || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">Currency</dt>
//                     <dd>{selectedUser?.Currency || "N/A"}</dd>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">Address</dt>
//                     <dd>{selectedUser?.Address || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">Zip Code</dt>
//                     <dd>{selectedUser?.Zip_code || "N/A"}</dd>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2">
//                   <div>
//                     <dt className="text-muted-foreground">IATA_Code</dt>
//                     <dd>{selectedUser?.IATA_Code || "N/A"}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-muted-foreground">Tax ID</dt>
//                     <dd>{selectedUser?.Gst_Vat_Tax_number || "N/A"}</dd>
//                   </div>
//                 </div>
//               </dl>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </DashboardContainer>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { DataTable } from "./data-table";
import { User, columns } from "./column";
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Loader2,ChevronUp,ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getData(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/admin/AllAgentRecords`, {
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
  const response = await fetch(`${API_BASE_URL}/admin/AgentSingleView/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
// Reusable component for detail items
function DetailItem({ label, value }: { label: string; value?: string | null }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!value) return null;

  return (
    <div className="text-sm">
      <div className="flex justify-between items-start">
        <span className="font-medium text-muted-foreground">{label}</span>
        {value.length > 30 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <p className={`mt-1 ${expanded ? '' : 'line-clamp-1'}`}>
        {value}
      </p>
    </div>
  );
}
export default function DemoPage() {
  const [loadingActions, setLoadingActions] = useState<{ [email: string]: boolean }>({});
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
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleAction = async (email: string, status: number) => {
    setLoadingActions((prev) => ({ ...prev, [email]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ChangeAgentApprovalStatus/${email}`, {
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
    } finally {
      setLoadingActions((prev) => ({ ...prev, [email]: false }));
    }
  };

  return (
    <DashboardContainer>
      <div className="container mx-auto py-4 md:py-10">
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
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable columns={columns(handleAction, handleView, loadingActions)} data={data} />
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {data.map((user) => (
                <Card key={user.email}>
                  <CardHeader className="flex flex-row justify-between items-start p-4">
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="mt-2">
                        <Badge variant={user.status === "Approved" ? "default" : user.status === "Pending" ? "secondary" : "destructive"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(user.email)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(user.email, 1)}
                            className="h-8 w-8 text-green-500 hover:text-green-700"
                            disabled={loadingActions[user.email]}
                          >
                            {loadingActions[user.email] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(user.email, 2)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            disabled={loadingActions[user.email]}
                          >
                            {loadingActions[user.email] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="text-sm">{user.email}</div>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="text-sm font-medium text-gray-500">Contact</div>
                      <div className="text-sm">{user.contact || "N/A"}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Company_name || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Email || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Contact_Person || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Country || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.City || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Address || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Zip Code</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Zip_code || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Office Number</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Office_number || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mobile Number</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Mobile_number || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Currency</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Currency || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">IATA Code</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.IATA_Code || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                  <dd className="mt-1 text-sm">{selectedUser?.Gst_Vat_Tax_number || "N/A"}</dd>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {selectedUser?.Company_name || "Agent Details"}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant={
                selectedUser?.IsApproved === 1 ? "default" : 
                selectedUser?.IsApproved === 0 ? "secondary" : "destructive"
              }>
                {selectedUser?.IsApproved === 1 ? "Approved" : 
                 selectedUser?.IsApproved === 0 ? "Pending" : "Rejected"}
              </Badge>
              <span>•</span>
              <span>{selectedUser?.Email}</span>
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {/* Contact Information Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Contact Information</h3>
                <DetailItem label="Contact Person" value={selectedUser?.Contact_Person} />
                <DetailItem label="Mobile" value={selectedUser?.Mobile_number} />
                <DetailItem label="Office" value={selectedUser?.Office_number} />
              </div>

              {/* Location Information Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                <DetailItem label="Country" value={selectedUser?.Country} />
                <DetailItem label="City" value={selectedUser?.City} />
                <DetailItem label="Address" value={selectedUser?.Address} />
                <DetailItem label="Zip Code" value={selectedUser?.Zip_code} />
              </div>

              {/* Business Information Section */}
              <div className="space-y-3 md:col-span-2">
                <h3 className="font-medium text-sm text-muted-foreground">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Currency" value={selectedUser?.Currency} />
                  <DetailItem label="IATA Code" value={selectedUser?.IATA_Code} />
                  <DetailItem label="Tax ID" value={selectedUser?.Gst_Vat_Tax_number} />
                </div>
              </div>

              {/* Additional Notes Section */}
              {selectedUser?.Notes && (
                <div className="md:col-span-2 space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Notes</h3>
                  <p className="text-sm p-3 bg-muted/50 rounded-md">
                    {selectedUser.Notes}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
            {selectedUser?.IsApproved === 0 && (
              <>
                <Button 
                  onClick={() => handleAction(selectedUser.Email, 1)}
                  disabled={loadingActions[selectedUser.Email]}
                >
                  {loadingActions[selectedUser.Email] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleAction(selectedUser.Email, 2)}
                  disabled={loadingActions[selectedUser.Email]}
                >
                  {loadingActions[selectedUser.Email] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Reject
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  );
}