// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Search, ArrowUpDown, Loader2, Check, X, Clock } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken, getToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";
// interface Booking {
//   id: string;
//   agent_id?: number;
//   vehicle_id?: string;
//   supplier_id?: number;
//   pickup_location?: string;
//   drop_location?: string;
//   pickup_lat?: string;
//   pickup_lng?: string;
//   drop_lat?: string;
//   drop_lng?: string;
//   distance_miles?: string;
//   price?: string;
//   status?: string;
//   booked_at?: string;
//   completed_at?: string | null;
// }

// interface Payment {
//   id: string;
//   booking_id: string;
//   payment_method: string;
//   payment_status: string;
//   transaction_id: string | null;
//   reference_number: string;
//   amount: string;
//   created_at: string;
// }

// interface BookingWithPayment {
//   booking: Booking;
//   payments: Payment | null;
// }

// const ITEMS_PER_PAGE = 10;

// const SupplierBookingsTable = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [bookings, setBookings] = useState<BookingWithPayment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [supplierId, setSupplierId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
// const {toast} = useToast();
//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: "ascending" | "descending";
//   } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Safe date formatting
//   const safeFormatDate = (dateString: string | null | undefined) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPpp");
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // Check authentication status
//   const isAuthenticated = !!getToken();

//   // Fetch supplier ID and bookings
//   useEffect(() => {
//     if (!isAuthenticated) {
//       setError("Please log in to view your bookings");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const dashboardData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         const userId = dashboardData.userId;
//         setSupplierId(userId);

//         const bookingsData = await fetchWithAuth(
//           `${API_BASE_URL}/supplier/GetBookingBySupplierId/${userId}`
//         );
//         const normalizedData =
//           bookingsData.result?.map((item: any) => ({
//             booking: item.booking,
//             payments: item.payments || null,
//           })) || [];
//         setBookings(normalizedData);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         const errorMessage =
//           err instanceof Error ? err.message : "An unknown error occurred";
//         setError(errorMessage);
//         toast({
//           title: "Error",
//           description: "Failed to load bookings",
//           variant: "destructive",
//         });
//         if (errorMessage.includes("Unauthorized")) {
//           removeToken();
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isAuthenticated]);

//   // Update booking status
//   const updateBookingStatus = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/supplier/ChangeBookingStatusByBookingId/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update booking status");
//       }
//       toast({
//         title: "Success",
//         description: "Booking status updated",
//       });
//       // Update local state
//       setBookings((prevBookings) =>
//         prevBookings.map((item) =>
//           item.booking.id === bookingId
//             ? {
//                 ...item,
//                 booking: {
//                   ...item.booking,
//                   status: newStatus,
//                 },
//               }
//             : item
//         )
//       );
//     } catch (error: any) {
//       console.error("Error updating booking:", error);
//       setError(error.message);
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   // Safe filtering with null checks
//   const filteredBookings = bookings.filter((item) => {
//     const pickup = item.booking.pickup_location?.toLowerCase() ?? "";
//     const drop = item.booking.drop_location?.toLowerCase() ?? "";
//     const price =
//       item.payments?.amount?.toString().toLowerCase() ??
//       item.booking.price?.toString().toLowerCase() ??
//       "";
//     const bookingStatus = item.booking.status?.toLowerCase() ?? "";
//     const paymentStatus = item.payments?.payment_status?.toLowerCase() ?? "";
//     const search = searchTerm.toLowerCase();

//     return (
//       pickup.includes(search) ||
//       drop.includes(search) ||
//       price.includes(search) ||
//       bookingStatus.includes(search) ||
//       paymentStatus.includes(search)
//     );
//   });

//   // Sort bookings with null checks
//   const sortedBookings = [...filteredBookings].sort((a, b) => {
//     if (!sortConfig) return 0;

//     let aValue, bValue;

//     if (sortConfig.key.includes("booking.")) {
//       const key = sortConfig.key.replace("booking.", "") as keyof Booking;
//       aValue = a.booking[key] || "";
//       bValue = b.booking[key] || "";
//     } else if (sortConfig.key.includes("payments.")) {
//       const key = sortConfig.key.replace("payments.", "") as keyof Payment;
//       aValue = a.payments?.[key] || "";
//       bValue = b.payments?.[key] || "";
//     } else {
//       return 0;
//     }

//     if (aValue < bValue) {
//       return sortConfig.direction === "ascending" ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === "ascending" ? 1 : -1;
//     }
//     return 0;
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
//   const paginatedBookings = sortedBookings.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const requestSort = (key: string) => {
//     let direction: "ascending" | "descending" = "ascending";
//     if (sortConfig?.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getStatusBadge = (
//     status: string | undefined,
//     type: "booking" | "payment"
//   ) => {
//     if (!status) {
//       return <Badge variant="outline">N/A</Badge>;
//     }

//     const statusText = status.toLowerCase();

//     if (type === "booking") {
//       switch (statusText) {
//         case "approved":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Booking:</span>
//               <Badge className="bg-green-500 hover:bg-green-600">
//                 <Check className="h-3 w-3 mr-1" />
//                 Approved
//               </Badge>
//             </div>
//           );
//         case "pending":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Booking:</span>
//               <Badge className="bg-yellow-500 hover:bg-yellow-600">
//                 <Clock className="h-3 w-3 mr-1" />
//                 Pending
//               </Badge>
//             </div>
//           );
//         case "rejected":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Booking:</span>
//               <Badge variant="destructive">
//                 <X className="h-3 w-3 mr-1" />
//                 Rejected
//               </Badge>
//             </div>
//           );
//         default:
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Booking:</span>
//               <Badge variant="outline">{statusText}</Badge>
//             </div>
//           );
//       }
//     } else {
//       // Payment status
//       switch (statusText) {
//         case "completed":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Payment:</span>
//               <Badge className="bg-green-500 hover:bg-green-600">
//                 <Check className="h-3 w-3 mr-1" />
//                 Completed
//               </Badge>
//             </div>
//           );
//         case "pending":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Payment:</span>
//               <Badge className="bg-yellow-500 hover:bg-yellow-600">
//                 <Clock className="h-3 w-3 mr-1" />
//                 Pending
//               </Badge>
//             </div>
//           );
//         case "failed":
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Payment:</span>
//               <Badge variant="destructive">
//                 <X className="h-3 w-3 mr-1" />
//                 Failed
//               </Badge>
//             </div>
//           );
//         default:
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">Payment:</span>
//               <Badge variant="outline">{statusText}</Badge>
//             </div>
//           );
//       }
//     }
//   };

//   if (!isAuthenticated || error?.includes("Unauthorized")) {
//     return (
//       <DashboardContainer scrollable>
//         <div className="flex items-center justify-center h-full">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-center">Session Expired</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center text-destructive">
//                 Your session has expired. Please log in again.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContainer scrollable>
//         <div className="flex items-center justify-center h-full">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-center">Error</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center text-destructive">{error}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </DashboardContainer>
//     );
//   }

//   return (
//     <DashboardContainer scrollable>
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <CardTitle>My Bookings</CardTitle>
//               <div className="relative w-full md:w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search bookings..."
//                   className="pl-9"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="flex justify-center items-center h-32">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//               </div>
//             ) : bookings.length === 0 ? (
//               <p className="text-center text-gray-500 py-8">
//                 {supplierId ? "No bookings found" : "Loading your bookings..."}
//               </p>
//             ) : (
//               <>
//                 {/* Desktop Table */}
//                 <div className="hidden md:block">
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Booking ID</TableHead>
//                           <TableHead>Payment ID</TableHead>
//                           <TableHead>
//                             <button
//                               onClick={() =>
//                                 requestSort("booking.pickup_location")
//                               }
//                               className="flex items-center hover:text-primary"
//                             >
//                               Pickup
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </button>
//                           </TableHead>
//                           <TableHead>
//                             <button
//                               onClick={() =>
//                                 requestSort("booking.drop_location")
//                               }
//                               className="flex items-center hover:text-primary"
//                             >
//                               Drop
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </button>
//                           </TableHead>
//                           <TableHead>
//                             <button
//                               onClick={() => requestSort("payments.amount")}
//                               className="flex items-center hover:text-primary"
//                             >
//                               Price
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </button>
//                           </TableHead>
//                           <TableHead>
//                             <button
//                               onClick={() => requestSort("booking.status")}
//                               className="flex items-center hover:text-primary"
//                             >
//                               Status
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </button>
//                           </TableHead>
//                           <TableHead>Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {paginatedBookings.map((item) => (
//                           <TableRow key={item.booking.id}>
//                             <TableCell className="font-medium">
//                               {item.booking.id.substring(0, 8)}...
//                             </TableCell>
//                             <TableCell>
//                               {item.payments?.id.substring(0, 8) || "N/A"}...
//                             </TableCell>
//                             <TableCell>
//                               {item.booking.pickup_location || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {item.booking.drop_location || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               ₹
//                               {item.payments?.amount ||
//                                 item.booking.price ||
//                                 "0"}
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex flex-col gap-2">
//                                 {getStatusBadge(item.booking.status, "booking")}
//                                 {getStatusBadge(
//                                   item.payments?.payment_status,
//                                   "payment"
//                                 )}
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex gap-2">
//                                 {item.booking.status?.toLowerCase() !==
//                                   "approved" && (
//                                   <Button
//                                     size="sm"
//                                     onClick={() =>
//                                       updateBookingStatus(
//                                         item.booking.id,
//                                         "approved"
//                                       )
//                                     }
//                                     className="h-8"
//                                   >
//                                     <Check className="h-4 w-4 mr-1" />
//                                     Approve
//                                   </Button>
//                                 )}
//                                 {item.booking.status?.toLowerCase() !==
//                                   "rejected" && (
//                                   <Button
//                                     variant="destructive"
//                                     size="sm"
//                                     onClick={() =>
//                                       updateBookingStatus(
//                                         item.booking.id,
//                                         "rejected"
//                                       )
//                                     }
//                                     className="h-8"
//                                   >
//                                     <X className="h-4 w-4 mr-1" />
//                                     Reject
//                                   </Button>
//                                 )}
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-end space-x-2 py-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage(Math.max(1, currentPage - 1))
//                         }
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       <span className="text-sm">
//                         Page {currentPage} of {totalPages}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage(Math.min(totalPages, currentPage + 1))
//                         }
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="md:hidden space-y-4">
//                   {paginatedBookings.map((item) => (
//                     <Card key={item.booking.id}>
//                       <CardHeader className="p-4">
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <CardTitle className="text-lg">
//                                 {item.booking.pickup_location || "N/A"} →{" "}
//                                 {item.booking.drop_location || "N/A"}
//                               </CardTitle>
//                               <div className="mt-1 text-sm text-muted-foreground">
//                                 Booking: {item.booking.id.substring(0, 8)}...
//                               </div>
//                               {item.payments?.id && (
//                                 <div className="text-sm text-muted-foreground">
//                                   Payment: {item.payments.id.substring(0, 8)}...
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex flex-col items-end gap-1">
//                               {getStatusBadge(item.booking.status, "booking")}
//                               {getStatusBadge(
//                                 item.payments?.payment_status,
//                                 "payment"
//                               )}
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-2">
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Price
//                               </p>
//                               <p>
//                                 ₹
//                                 {item.payments?.amount ||
//                                   item.booking.price ||
//                                   "0"}
//                               </p>
//                             </div>
//                             <div className="col-span-2">
//                               <div className="flex gap-2">
//                                 {item.booking.status?.toLowerCase() !==
//                                   "approved" && (
//                                   <Button
//                                     size="sm"
//                                     onClick={() =>
//                                       updateBookingStatus(
//                                         item.booking.id,
//                                         "approved"
//                                       )
//                                     }
//                                     className="h-8"
//                                   >
//                                     <Check className="h-4 w-4" />
//                                   </Button>
//                                 )}
//                                 {item.booking.status?.toLowerCase() !==
//                                   "rejected" && (
//                                   <Button
//                                     variant="destructive"
//                                     size="sm"
//                                     onClick={() =>
//                                       updateBookingStatus(
//                                         item.booking.id,
//                                         "rejected"
//                                       )
//                                     }
//                                     className="h-8"
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </CardHeader>
//                     </Card>
//                   ))}

//                   {/* Pagination for mobile */}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-between space-x-2 py-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage(Math.max(1, currentPage - 1))
//                         }
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       <span className="text-sm text-muted-foreground">
//                         Page {currentPage} of {totalPages}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage(Math.min(totalPages, currentPage + 1))
//                         }
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardContainer>
//   );
// };

// export default SupplierBookingsTable;

// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import DashboardContainer from "@/components/layout/DashboardContainer";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Search, ArrowUpDown, Loader2, Check, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { fetchWithAuth } from "@/components/utils/api";
// import { removeToken, getToken } from "@/components/utils/auth";
// import { useToast } from "@/hooks/use-toast";

// interface Booking {
//   id: string;
//   agent_id?: number;
//   vehicle_id?: string;
//   supplier_id?: number;
//   pickup_location?: string;
//   drop_location?: string;
//   pickup_lat?: string;
//   pickup_lng?: string;
//   drop_lat?: string;
//   drop_lng?: string;
//   distance_miles?: string;
//   price?: string;
//   status?: string;
//   booked_at?: string;
//   completed_at?: string | null;
// }

// interface Payment {
//   id: string;
//   booking_id: string;
//   payment_method: string;
//   payment_status: string;
//   transaction_id: string | null;
//   reference_number: string;
//   amount: string;
//   created_at: string;
// }

// interface BookingWithPayment {
//   booking: Booking;
//   payments: Payment | null;
// }

// const ITEMS_PER_PAGE = 10;

// const SupplierBookingsTable = () => {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const [bookings, setBookings] = useState<BookingWithPayment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [supplierId, setSupplierId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
//   const { toast } = useToast();

//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: "ascending" | "descending";
//   } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const toggleRowExpansion = (bookingId: string) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [bookingId]: !prev[bookingId]
//     }));
//   };

//   // Safe date formatting
//   const safeFormatDate = (dateString: string | null | undefined) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPpp");
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // Check authentication status
//   const isAuthenticated = !!getToken();

//   // Fetch supplier ID and bookings
//   useEffect(() => {
//     if (!isAuthenticated) {
//       setError("Please log in to view your bookings");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const dashboardData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         const userId = dashboardData.userId;
//         setSupplierId(userId);

//         const bookingsData = await fetchWithAuth(
//           `${API_BASE_URL}/supplier/GetBookingBySupplierId/${userId}`
//         );
//         const normalizedData =
//           bookingsData.result?.map((item: any) => ({
//             booking: item.booking,
//             payments: item.payments || null,
//           })) || [];
//         setBookings(normalizedData);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         const errorMessage =
//           err instanceof Error ? err.message : "An unknown error occurred";
//         setError(errorMessage);
//         toast({
//           title: "Error",
//           description: "Failed to load bookings",
//           variant: "destructive",
//         });
//         if (errorMessage.includes("Unauthorized")) {
//           removeToken();
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isAuthenticated]);

//   // Update booking status
//   const updateBookingStatus = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/supplier/ChangeBookingStatusByBookingId/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update booking status");
//       }
//       toast({
//         title: "Success",
//         description: "Booking status updated",
//       });
//       // Update local state
//       setBookings((prevBookings) =>
//         prevBookings.map((item) =>
//           item.booking.id === bookingId
//             ? {
//                 ...item,
//                 booking: {
//                   ...item.booking,
//                   status: newStatus,
//                 },
//               }
//             : item
//         )
//       );
//     } catch (error: any) {
//       console.error("Error updating booking:", error);
//       setError(error.message);
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   // Safe filtering with null checks
//   const filteredBookings = bookings.filter((item) => {
//     const pickup = item.booking.pickup_location?.toLowerCase() ?? "";
//     const drop = item.booking.drop_location?.toLowerCase() ?? "";
//     const price =
//       item.payments?.amount?.toString().toLowerCase() ??
//       item.booking.price?.toString().toLowerCase() ??
//       "";
//     const bookingStatus = item.booking.status?.toLowerCase() ?? "";
//     const paymentStatus = item.payments?.payment_status?.toLowerCase() ?? "";
//     const search = searchTerm.toLowerCase();

//     return (
//       pickup.includes(search) ||
//       drop.includes(search) ||
//       price.includes(search) ||
//       bookingStatus.includes(search) ||
//       paymentStatus.includes(search)
//     );
//   });

//   // Sort bookings with null checks
//   const sortedBookings = [...filteredBookings].sort((a, b) => {
//     if (!sortConfig) return 0;

//     let aValue, bValue;

//     if (sortConfig.key.includes("booking.")) {
//       const key = sortConfig.key.replace("booking.", "") as keyof Booking;
//       aValue = a.booking[key] || "";
//       bValue = b.booking[key] || "";
//     } else if (sortConfig.key.includes("payments.")) {
//       const key = sortConfig.key.replace("payments.", "") as keyof Payment;
//       aValue = a.payments?.[key] || "";
//       bValue = b.payments?.[key] || "";
//     } else {
//       return 0;
//     }

//     if (aValue < bValue) {
//       return sortConfig.direction === "ascending" ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === "ascending" ? 1 : -1;
//     }
//     return 0;
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
//   const paginatedBookings = sortedBookings.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const requestSort = (key: string) => {
//     let direction: "ascending" | "descending" = "ascending";
//     if (sortConfig?.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getStatusBadge = (
//     status: string | undefined,
//     type: "booking" | "payment"
//   ) => {
//     if (!status) {
//       return <Badge variant="outline">N/A</Badge>;
//     }

//     const statusText = status.toLowerCase();

//     if (type === "booking") {
//       switch (statusText) {
//         case "approved":
//           return (
//             <Badge className="bg-green-500 hover:bg-green-600">
//               <Check className="h-3 w-3 mr-1" />
//               Approved
//             </Badge>
//           );
//         case "pending":
//           return (
//             <Badge className="bg-yellow-500 hover:bg-yellow-600">
//               <Clock className="h-3 w-3 mr-1" />
//               Pending
//             </Badge>
//           );
//         case "rejected":
//           return (
//             <Badge variant="destructive">
//               <X className="h-3 w-3 mr-1" />
//               Rejected
//             </Badge>
//           );
//         default:
//           return <Badge variant="outline">{statusText}</Badge>;
//       }
//     } else {
//       // Payment status
//       switch (statusText) {
//         case "completed":
//           return (
//             <Badge className="bg-green-500 hover:bg-green-600">
//               <Check className="h-3 w-3 mr-1" />
//               Completed
//             </Badge>
//           );
//         case "pending":
//           return (
//             <Badge className="bg-yellow-500 hover:bg-yellow-600">
//               <Clock className="h-3 w-3 mr-1" />
//               Pending
//             </Badge>
//           );
//         case "failed":
//           return (
//             <Badge variant="destructive">
//               <X className="h-3 w-3 mr-1" />
//               Failed
//             </Badge>
//           );
//         default:
//           return <Badge variant="outline">{statusText}</Badge>;
//       }
//     }
//   };

//   if (!isAuthenticated || error?.includes("Unauthorized")) {
//     return (
//       <DashboardContainer scrollable>
//         <div className="flex items-center justify-center h-full">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-center">Session Expired</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center text-destructive">
//                 Your session has expired. Please log in again.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContainer scrollable>
//         <div className="flex items-center justify-center h-full">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-center">Error</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center text-destructive">{error}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </DashboardContainer>
//     );
//   }

//   return (
//     <DashboardContainer scrollable>
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <CardTitle>My Bookings</CardTitle>
//               <div className="relative w-full md:w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search bookings..."
//                   className="pl-9"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="flex justify-center items-center h-32">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//               </div>
//             ) : bookings.length === 0 ? (
//               <p className="text-center text-gray-500 py-8">
//                 {supplierId ? "No bookings found" : "Loading your bookings..."}
//               </p>
//             ) : (
//               <>
//                 {/* Desktop Table */}
//                 <div className="hidden md:block">
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>
//                             <Button
//                               variant="ghost"
//                               onClick={() => requestSort("booking.pickup_location")}
//                               className="p-0 hover:bg-transparent"
//                             >
//                               Pickup
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </Button>
//                           </TableHead>
//                           <TableHead>
//                             <Button
//                               variant="ghost"
//                               onClick={() => requestSort("booking.drop_location")}
//                               className="p-0 hover:bg-transparent"
//                             >
//                               Drop
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </Button>
//                           </TableHead>
//                           <TableHead>
//                             <Button
//                               variant="ghost"
//                               onClick={() => requestSort("booking.status")}
//                               className="p-0 hover:bg-transparent"
//                             >
//                               Status
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </Button>
//                           </TableHead>
//                           <TableHead>
//                             <Button
//                               variant="ghost"
//                               onClick={() => requestSort("booking.booked_at")}
//                               className="p-0 hover:bg-transparent"
//                             >
//                               Booked At
//                               <ArrowUpDown className="ml-2 h-4 w-4" />
//                             </Button>
//                           </TableHead>
//                           <TableHead className="text-right">Details</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {paginatedBookings.map((item) => (
//                           <>
//                             <TableRow key={item.booking.id}>
//                               <TableCell className="font-medium">
//                                 {item.booking.pickup_location || "N/A"}
//                               </TableCell>
//                               <TableCell>
//                                 {item.booking.drop_location || "N/A"}
//                               </TableCell>
//                               <TableCell>
//                                 {getStatusBadge(item.booking.status, "booking")}
//                               </TableCell>
//                               <TableCell>
//                                 {safeFormatDate(item.booking.booked_at)}
//                               </TableCell>
//                               <TableCell className="text-right">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => toggleRowExpansion(item.booking.id)}
//                                   className="h-8"
//                                 >
//                                   {expandedRows[item.booking.id] ? (
//                                     <ChevronUp className="h-4 w-4" />
//                                   ) : (
//                                     <ChevronDown className="h-4 w-4" />
//                                   )}
//                                   <span className="ml-1">Details</span>
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                             {expandedRows[item.booking.id] && (
//                               <TableRow className="bg-gray-50">
//                                 <TableCell colSpan={5}>
//                                   <div className="p-4 space-y-4">
//                                     <div className="grid grid-cols-2 gap-4">
//                                       <div>
//                                         <h4 className="text-sm font-medium text-gray-500">Booking ID</h4>
//                                         <p>{item.booking.id}</p>
//                                       </div>
//                                       <div>
//                                         <h4 className="text-sm font-medium text-gray-500">Price</h4>
//                                         <p>₹{item.payments?.amount || item.booking.price || "0"}</p>
//                                       </div>
//                                       <div>
//                                         <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
//                                         <p>{getStatusBadge(item.payments?.payment_status, "payment")}</p>
//                                       </div>
//                                       <div>
//                                         <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
//                                         <p>{item.payments?.payment_method || "N/A"}</p>
//                                       </div>
//                                       {item.payments?.transaction_id && (
//                                         <div>
//                                           <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
//                                           <p>{item.payments.transaction_id}</p>
//                                         </div>
//                                       )}
//                                       {item.payments?.reference_number && (
//                                         <div>
//                                           <h4 className="text-sm font-medium text-gray-500">Reference Number</h4>
//                                           <p>{item.payments.reference_number}</p>
//                                         </div>
//                                       )}
//                                     </div>
//                                     <div className="flex justify-end gap-2">
//                                       {item.booking.status?.toLowerCase() !== "approved" && (
//                                         <Button
//                                           size="sm"
//                                           onClick={() => updateBookingStatus(item.booking.id, "approved")}
//                                           className="h-8"
//                                         >
//                                           <Check className="h-4 w-4 mr-1" />
//                                           Approve
//                                         </Button>
//                                       )}
//                                       {item.booking.status?.toLowerCase() !== "rejected" && (
//                                         <Button
//                                           variant="destructive"
//                                           size="sm"
//                                           onClick={() => updateBookingStatus(item.booking.id, "rejected")}
//                                           className="h-8"
//                                         >
//                                           <X className="h-4 w-4 mr-1" />
//                                           Reject
//                                         </Button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-end space-x-2 py-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       <span className="text-sm">
//                         Page {currentPage} of {totalPages}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="md:hidden space-y-4">
//                   {paginatedBookings.map((item) => (
//                     <Card key={item.booking.id}>
//                       <CardHeader className="p-4">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <CardTitle className="text-lg">
//                               {item.booking.pickup_location || "N/A"} →{" "}
//                               {item.booking.drop_location || "N/A"}
//                             </CardTitle>
//                             <div className="mt-2 flex items-center gap-2">
//                               {getStatusBadge(item.booking.status, "booking")}
//                             </div>
//                             <div className="mt-2 text-sm text-gray-500">
//                               {safeFormatDate(item.booking.booked_at)}
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => toggleRowExpansion(item.booking.id)}
//                           >
//                             {expandedRows[item.booking.id] ? (
//                               <ChevronUp className="h-4 w-4" />
//                             ) : (
//                               <ChevronDown className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       {expandedRows[item.booking.id] && (
//                         <CardContent className="p-4 pt-0 border-t">
//                           <div className="space-y-3">
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500">Booking ID</h4>
//                               <p className="text-sm">{item.booking.id}</p>
//                             </div>
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500">Price</h4>
//                               <p className="text-sm">₹{item.payments?.amount || item.booking.price || "0"}</p>
//                             </div>
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
//                               <p className="text-sm">{getStatusBadge(item.payments?.payment_status, "payment")}</p>
//                             </div>
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
//                               <p className="text-sm">{item.payments?.payment_method || "N/A"}</p>
//                             </div>
//                             {item.payments?.transaction_id && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
//                                 <p className="text-sm">{item.payments.transaction_id}</p>
//                               </div>
//                             )}
//                             {item.payments?.reference_number && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500">Reference Number</h4>
//                                 <p className="text-sm">{item.payments.reference_number}</p>
//                               </div>
//                             )}
//                             <div className="flex gap-2 pt-2">
//                               {item.booking.status?.toLowerCase() !== "approved" && (
//                                 <Button
//                                   size="sm"
//                                   onClick={() => updateBookingStatus(item.booking.id, "approved")}
//                                   className="flex-1"
//                                 >
//                                   <Check className="h-4 w-4 mr-1" />
//                                   Approve
//                                 </Button>
//                               )}
//                               {item.booking.status?.toLowerCase() !== "rejected" && (
//                                 <Button
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => updateBookingStatus(item.booking.id, "rejected")}
//                                   className="flex-1"
//                                 >
//                                   <X className="h-4 w-4 mr-1" />
//                                   Reject
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </CardContent>
//                       )}
//                     </Card>
//                   ))}

//                   {/* Pagination for mobile */}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-between space-x-2 py-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       <span className="text-sm text-muted-foreground">
//                         Page {currentPage} of {totalPages}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardContainer>
//   );
// };

// export default SupplierBookingsTable;

"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardContainer from "@/components/layout/DashboardContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ArrowUpDown,
  Loader2,
  Check,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken, getToken } from "@/components/utils/auth";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  agent_id?: number;
  vehicle_id?: string;
  supplier_id?: number;
  pickup_location?: string;
  drop_location?: string;
  pickup_lat?: string;
  pickup_lng?: string;
  drop_lat?: string;
  drop_lng?: string;
  distance_miles?: string;
  price?: string;
  currency?:string;
  status?: string;
  booked_at?: string;
  completed_at?: string | null;
}

interface Payment {
  id: string;
  booking_id: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  reference_number: string;
  amount: string;
  created_at: string;
}

interface BookingWithPayment {
  booking: Booking;
  payments: Payment | null;
}

const ITEMS_PER_PAGE = 10;

const SupplierBookingsTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [bookings, setBookings] = useState<BookingWithPayment[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [downloadingVoucher, setDownloadingVoucher] = useState<string | null>(
    null
  );
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRowExpansion = (bookingId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  // Safe date formatting
  const safeFormatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPpp");
    } catch {
      return "Invalid date";
    }
  };

  const downloadVoucher = async (bookingId: string) => {
    try {
      setDownloadingVoucher(bookingId);
      const response = await fetch(
        `${API_BASE_URL}/payment/vouchers/${bookingId}/download`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download voucher");
      }

      // Get the filename from the content-disposition header or generate one
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `voucher-${bookingId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Voucher downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading voucher:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download voucher",
        variant: "destructive",
      });
    } finally {
      setDownloadingVoucher(null);
    }
  };

  // Check authentication status
  const isAuthenticated = !!getToken();

  // Fetch supplier ID and bookings
  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to view your bookings");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const dashboardData = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        const userId = dashboardData.userId;
        setSupplierId(userId);

        const [bookingsData, driversData] = await Promise.all([
          fetchWithAuth(
            `${API_BASE_URL}/supplier/GetBookingBySupplierId/${userId}`
          ),
          fetchWithAuth(`${API_BASE_URL}/supplier/GetDriver/${userId}`),
        ]);

        const normalizedData =
          bookingsData.result?.map((item: any) => ({
            booking: item.booking,
            payments: item.payments || null,
          })) || [];
        setBookings(normalizedData);
        setDrivers(driversData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
        if (errorMessage.includes("Unauthorized")) {
          removeToken();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (newStatus === "approved" && !selectedDriver) {
      toast({
        title: "Error",
        description: "Please select a driver before approving",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/supplier/ChangeBookingStatusByBookingId/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            driver_id: newStatus === "approved" ? selectedDriver : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      toast({
        title: "Success",
        description:
          newStatus === "approved"
            ? "Booking approved and driver assigned"
            : "Booking status updated",
      });

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((item) =>
          item.booking.id === bookingId
            ? {
                ...item,
                booking: {
                  ...item.booking,
                  status: newStatus,
                },
              }
            : item
        )
      );

      // Reset selected driver after approval
      if (newStatus === "approved") {
        setSelectedDriver(null);
      }
    } catch (error: any) {
      console.error("Error updating booking:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Safe filtering with null checks
  const filteredBookings = bookings.filter((item) => {
    const pickup = item.booking.pickup_location?.toLowerCase() ?? "";
    const drop = item.booking.drop_location?.toLowerCase() ?? "";
    const price =
      item.payments?.amount?.toString().toLowerCase() ??
      item.booking.price?.toString().toLowerCase() ??
      "";
    const bookingStatus = item.booking.status?.toLowerCase() ?? "";
    const paymentStatus = item.payments?.payment_status?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    return (
      pickup.includes(search) ||
      drop.includes(search) ||
      price.includes(search) ||
      bookingStatus.includes(search) ||
      paymentStatus.includes(search)
    );
  });

  // Sort bookings with null checks
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue, bValue;

    if (sortConfig.key.includes("booking.")) {
      const key = sortConfig.key.replace("booking.", "") as keyof Booking;
      aValue = a.booking[key] || "";
      bValue = b.booking[key] || "";
    } else if (sortConfig.key.includes("payments.")) {
      const key = sortConfig.key.replace("payments.", "") as keyof Payment;
      aValue = a.payments?.[key] || "";
      bValue = b.payments?.[key] || "";
    } else {
      return 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (
    status: string | undefined,
    type: "booking" | "payment"
  ) => {
    if (!status) {
      return <Badge variant="outline">N/A</Badge>;
    }

    const statusText = status.toLowerCase();

    if (type === "booking") {
      switch (statusText) {
        case "approved":
          return (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          );
        case "pending":
          return (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          );
        case "rejected":
          return (
            <Badge variant="destructive">
              <X className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          );
        default:
          return <Badge variant="outline">{statusText}</Badge>;
      }
    } else {
      // Payment status
      switch (statusText) {
        case "completed":
          return (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          );
        case "pending":
          return (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          );
        case "failed":
          return (
            <Badge variant="destructive">
              <X className="h-3 w-3 mr-1" />
              Failed
            </Badge>
          );
        default:
          return <Badge variant="outline">{statusText}</Badge>;
      }
    }
  };

  if (!isAuthenticated || error?.includes("Unauthorized")) {
    return (
      <DashboardContainer scrollable>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Session Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-destructive">
                Your session has expired. Please log in again.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer scrollable>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-destructive">{error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer scrollable>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>My Bookings</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {supplierId ? "No bookings found" : "Loading your bookings..."}
              </p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                requestSort("booking.pickup_location")
                              }
                              className="p-0 hover:bg-transparent"
                            >
                              Pickup
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                requestSort("booking.drop_location")
                              }
                              className="p-0 hover:bg-transparent"
                            >
                              Drop
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort("booking.status")}
                              className="p-0 hover:bg-transparent"
                            >
                              Status
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort("booking.booked_at")}
                              className="p-0 hover:bg-transparent"
                            >
                              Booked At
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((item) => (
                          <React.Fragment key={item.booking.id}>
                            <TableRow>
                              <TableCell className="font-medium">
                                {item.booking.pickup_location || "N/A"}
                              </TableCell>
                              <TableCell>
                                {item.booking.drop_location || "N/A"}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(item.booking.status, "booking")}
                              </TableCell>
                              <TableCell>
                                {safeFormatDate(item.booking.booked_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleRowExpansion(item.booking.id)
                                  }
                                  className="h-8"
                                >
                                  {expandedRows[item.booking.id] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span className="ml-1">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>

                            {expandedRows[item.booking.id] && (
                              <TableRow className="bg-gray-50">
                                <TableCell colSpan={5}>
                                  <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                          Booking ID
                                        </h4>
                                        <p>{item.booking.id}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                          Price
                                        </h4>
                                        <p>
                                          {item.booking?.currency}
                                          {item.payments?.amount ||
                                            item.booking.price ||
                                            "0"}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                          Payment Status
                                        </h4>
                                        <p>
                                          {getStatusBadge(
                                            item.payments?.payment_status,
                                            "payment"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                          Payment Method
                                        </h4>
                                        <p>
                                          {item.payments?.payment_method ||
                                            "N/A"}
                                        </p>
                                      </div>
                                      {item.payments?.transaction_id && (
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">
                                            Transaction ID
                                          </h4>
                                          <p>{item.payments.transaction_id}</p>
                                        </div>
                                      )}
                                      {item.payments?.reference_number && (
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">
                                            Reference Number
                                          </h4>
                                          <p>
                                            {item.payments.reference_number}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {item.booking.status?.toLowerCase() !==
                                      "approved" && (
                                      <div className="col-span-2">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                                          Assign Driver
                                        </h4>
                                        <select
                                          className="w-full p-2 border rounded"
                                          value={selectedDriver || ""}
                                          onChange={(e) =>
                                            setSelectedDriver(e.target.value)
                                          }
                                        >
                                          <option value="">
                                            Select a driver
                                          </option>
                                          {drivers.map((driver) => (
                                            <option
                                              key={driver.id}
                                              value={driver.id}
                                            >
                                              {driver.DriverName} (
                                              {driver.DriverContact})
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                      <div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          downloadVoucher(item.booking.id)
                                        }
                                        disabled={
                                          downloadingVoucher === item.booking.id
                                        }
                                        className="h-8"
                                      >
                                        {downloadingVoucher ===
                                        item.booking.id ? (
                                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        ) : (
                                          <Download className="h-4 w-4 mr-1" />
                                        )}
                                        Voucher
                                      </Button>
                                    </div>
                                      {item.booking.status?.toLowerCase() !==
                                        "approved" && (
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            if (!selectedDriver) {
                                              toast({
                                                title: "Warning",
                                                description:
                                                  "Please select a driver before approving",
                                                variant: "destructive",
                                              });
                                              return;
                                            }
                                            updateBookingStatus(
                                              item.booking.id,
                                              "approved"
                                            );
                                          }}
                                          className="h-8"
                                        >
                                          <Check className="h-4 w-4 mr-1" />
                                          Approve Booking
                                        </Button>
                                      )}
                                      {item.booking.status?.toLowerCase() !==
                                        "rejected" && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            updateBookingStatus(
                                              item.booking.id,
                                              "rejected"
                                            )
                                          }
                                          className="h-8"
                                        >
                                          <X className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedBookings.map((item) => (
                    <Card key={item.booking.id}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {item.booking.pickup_location || "N/A"} →{" "}
                              {item.booking.drop_location || "N/A"}
                            </CardTitle>
                            <div className="mt-2 flex items-center gap-2">
                              {getStatusBadge(item.booking.status, "booking")}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              {safeFormatDate(item.booking.booked_at)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(item.booking.id)}
                          >
                            {expandedRows[item.booking.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      {expandedRows[item.booking.id] && (
                        <CardContent className="p-4 pt-0 border-t">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">
                                Booking ID
                              </h4>
                              <p className="text-sm">{item.booking.id}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">
                                Price
                              </h4>
                              <p className="text-sm">
                                {item.booking?.currency}
                                {item.payments?.amount ||
                                  item.booking.price ||
                                  "0"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">
                                Payment Status
                              </h4>
                              <p className="text-sm">
                                {getStatusBadge(
                                  item.payments?.payment_status,
                                  "payment"
                                )}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">
                                Payment Method
                              </h4>
                              <p className="text-sm">
                                {item.payments?.payment_method || "N/A"}
                              </p>
                            </div>
                            {item.payments?.transaction_id && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                  Transaction ID
                                </h4>
                                <p className="text-sm">
                                  {item.payments.transaction_id}
                                </p>
                              </div>
                            )}
                            {item.payments?.reference_number && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                  Reference Number
                                </h4>
                                <p className="text-sm">
                                  {item.payments.reference_number}
                                </p>
                              </div>
                            )}
                            
                            {item.booking.status?.toLowerCase() !==
                              "approved" && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                  Assign Driver
                                </h4>
                                <select
                                  className="w-full p-2 border rounded mt-1"
                                  value={selectedDriver || ""}
                                  onChange={(e) =>
                                    setSelectedDriver(e.target.value)
                                  }
                                >
                                  <option value="">Select a driver</option>
                                  {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                      {driver.DriverName} (
                                      {driver.DriverCarInfo})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadVoucher(item.booking.id)}
                                disabled={
                                  downloadingVoucher === item.booking.id
                                }
                              >
                                {downloadingVoucher === item.booking.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4 mr-1" />
                                )}
                                Voucher
                              </Button>
                            </div>
                              {item.booking.status?.toLowerCase() !==
                                "approved" && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (!selectedDriver) {
                                      toast({
                                        title: "Warning",
                                        description:
                                          "Please select a driver before approving",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    updateBookingStatus(
                                      item.booking.id,
                                      "approved"
                                    );
                                  }}
                                  className="flex-1"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve Booking
                                </Button>
                              )}
                              {item.booking.status?.toLowerCase() !==
                                "rejected" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    updateBookingStatus(
                                      item.booking.id,
                                      "rejected"
                                    )
                                  }
                                  className="flex-1"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                  {/* Pagination for mobile */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default SupplierBookingsTable;
