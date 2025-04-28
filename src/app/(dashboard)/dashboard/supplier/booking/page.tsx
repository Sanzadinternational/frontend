"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardContainer from "@/components/layout/DashboardContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpDown, Loader2, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken,getToken } from "@/components/utils/auth";

interface Booking {
  id: string;
  pickup_location: string;
  drop_location: string;
  price: string;
  status: string;
  booked_at: string;
  distance_miles: string;
  completed_at: string | null;
}

const ITEMS_PER_PAGE = 10;

const AgentBookingsTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agentId, setAgentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Booking;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Check authentication status
  const isAuthenticated = !!getToken();

  // Fetch agent ID and bookings
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
        setAgentId(userId);
        
        const bookingsData = await fetchWithAuth(
          `${API_BASE_URL}/supplier/GetBookingBySupplierId/${userId}`
        );
        setBookings(bookingsData.result || []);
    
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        
        // Remove token if unauthorized
        if (errorMessage.includes("Unauthorized")) {
          removeToken();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter and sort bookings
//   const filteredBookings = bookings.filter(booking => 
//     booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     booking.drop_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     booking.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     booking.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );
const filteredBookings = bookings.filter((booking) => {
    const pickup = booking.pickup_location?.toLowerCase() ?? "";
    const drop = booking.drop_location?.toLowerCase() ?? "";
    const price = booking.price?.toLowerCase() ?? "";
    const status = booking.status?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    return (
      pickup.includes(search) ||
      drop.includes(search) ||
      price.includes(search) ||
      status.includes(search)
    );
  });
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);

  const requestSort = (key: keyof Booking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "1": return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Booked</Badge>;
      case "0": return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default: return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
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
                {agentId ? "No bookings found" : "Loading your bookings..."}
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
                            <button
                              onClick={() => requestSort('pickup_location')}
                              className="flex items-center hover:text-primary"
                            >
                              Pickup
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              onClick={() => requestSort('drop_location')}
                              className="flex items-center hover:text-primary"
                            >
                              Drop
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              onClick={() => requestSort('distance_miles')}
                              className="flex items-center hover:text-primary"
                            >
                              Distance (miles)
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              onClick={() => requestSort('price')}
                              className="flex items-center hover:text-primary"
                            >
                              Price
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              onClick={() => requestSort('status')}
                              className="flex items-center hover:text-primary"
                            >
                              Status
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              onClick={() => requestSort('booked_at')}
                              className="flex items-center hover:text-primary"
                            >
                              Booked At
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.pickup_location}
                            </TableCell>
                            <TableCell>{booking.drop_location}</TableCell>
                            <TableCell>{booking.distance_miles} miles</TableCell>
                            <TableCell>₹{booking.price}</TableCell>
                            <TableCell>
                              {getStatusBadge(booking.status)}
                            </TableCell>
                            <TableCell>
                                {booking.booked_at
                                  ? format(new Date(booking.booked_at), "PPpp")
                                  : "N/A"}
                              </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">
                              {booking.pickup_location} → {booking.drop_location}
                            </CardTitle>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Distance</p>
                              <p>{booking.distance_miles} miles</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p>₹{booking.price}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">Booked At</p>
                              <p>{booking.booked_at
                                ? format(new Date(booking.booked_at), "PPpp")
                                : "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  
                  {/* Pagination for mobile */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
                      >
                        Next
                      </button>
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

export default AgentBookingsTable;