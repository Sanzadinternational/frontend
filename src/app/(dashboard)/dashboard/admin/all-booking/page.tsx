"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

interface Booking {
  id: string;
  pickup_location: string;
  drop_location: string;
  price: string;
  status: string;
  booked_at: string;
  distance_miles?: string;
  completed_at?: string | null;
}

const ITEMS_PER_PAGE = 10;

const BookingTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Booking;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Safe date formatting
  const safeFormatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  // Safe filtering with null checks
  const filteredBookings = bookings.filter(booking => {
    const pickup = booking.pickup_location?.toLowerCase() || '';
    const drop = booking.drop_location?.toLowerCase() || '';
    const price = booking.price?.toString().toLowerCase() || '';
    const status = booking.status?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      pickup.includes(search) ||
      drop.includes(search) ||
      price.includes(search) ||
      status.includes(search)
    );
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    const aValue = a[key] || '';
    const bValue = b[key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const requestSort = (key: keyof Booking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/GetAllBooking`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      // Extract booking objects from the nested structure
      const extractedBookings = data.result?.map((item: any) => item.booking) || [];
      setBookings(extractedBookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/UpdateBookingStatus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      toast({
        title: "Success",
        description: "Booking status updated",
      });

      fetchBookings();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "1":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "0":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <DashboardContainer scrollable>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Booking Approvals</CardTitle>
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
              <p className="text-center text-gray-500 py-8">No bookings found</p>
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
                              onClick={() => requestSort('pickup_location')}
                              className="p-0 hover:bg-transparent"
                            >
                              Pickup
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort('drop_location')}
                              className="p-0 hover:bg-transparent"
                            >
                              Drop
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort('price')}
                              className="p-0 hover:bg-transparent"
                            >
                              Price
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort('status')}
                              className="p-0 hover:bg-transparent"
                            >
                              Status
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => requestSort('booked_at')}
                              className="p-0 hover:bg-transparent"
                            >
                              Booked At
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.pickup_location || 'N/A'}
                            </TableCell>
                            <TableCell>{booking.drop_location || 'N/A'}</TableCell>
                            <TableCell>₹{booking.price || '0'}</TableCell>
                            <TableCell>
                              {getStatusBadge(booking.status)}
                            </TableCell>
                            <TableCell>
                              {safeFormatDate(booking.booked_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {booking.status !== "1" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, "1")}
                                    className="h-8"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                {booking.status !== "2" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, "2")}
                                    className="h-8"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
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
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {booking.pickup_location || 'N/A'} → {booking.drop_location || 'N/A'}
                            </CardTitle>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline">
                                ₹{booking.price || '0'}
                              </Badge>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              {safeFormatDate(booking.booked_at)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {booking.status !== "1" && (
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "1")}
                                className="h-8"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {booking.status !== "2" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "2")}
                                className="h-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  
                  {/* Pagination for mobile */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

export default BookingTable;