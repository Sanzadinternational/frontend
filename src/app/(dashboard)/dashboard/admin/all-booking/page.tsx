"use client";

import { useState, useEffect } from "react";
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

interface Booking {
  id: string;
  pickup_location: string;
  drop_location: string;
  price: string;
  currency?: string;
  status: string;
  booked_at: string;
  distance_miles?: string;
  completed_at?: string | null;
}

interface Payment {
  id: string;
  booking_id: string;
  payment_method: string;
  payment_status: string;
  amount: string;
  created_at: string;
}

interface BookingWithPayment {
  booking: Booking;
  payments: Payment | null;
}

const ITEMS_PER_PAGE = 10;

const BookingTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(
    null
  );
  const [downloadingVoucher, setDownloadingVoucher] = useState<string | null>(
    null
  );

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState<string>("");
  const formatDateForSearch = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      // Ensure the date is in UTC or local time consistently
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return format(date, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "booking.booked_at",
    direction: "descending",
  });
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

  // Download invoice function
  const downloadInvoice = async (bookingId: string) => {
    try {
      setDownloadingInvoice(bookingId);
      const response = await fetch(
        `${API_BASE_URL}/payment/invoices/${bookingId}/download`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // Get the filename from the content-disposition header or generate one
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `invoice-${bookingId}.pdf`;
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
        description: "Invoice downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download invoice",
        variant: "destructive",
      });
    } finally {
      setDownloadingInvoice(null);
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

  // Safe filtering with null checks
  const filteredBookings = bookings.filter((item) => {
    const pickup = item.booking.pickup_location?.toLowerCase() || "";
    const drop = item.booking.drop_location?.toLowerCase() || "";
    const price = item.booking.price?.toString().toLowerCase() || "";
    const bookingStatus = item.booking.status?.toLowerCase() || "";
    const paymentStatus = item.payments?.payment_status?.toLowerCase() || "";
    const paymentMethod = item.payments?.payment_method?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    // Date filtering
    const bookingDate = formatDateForSearch(item.booking.booked_at);
    const dateSearch = formatDateForSearch(dateSearchTerm);

    // Check if it matches text search OR date filter (if either is specified)
    const matchesTextSearch =
      pickup.includes(search) ||
      drop.includes(search) ||
      price.includes(search) ||
      bookingStatus.includes(search) ||
      paymentStatus.includes(search) ||
      paymentMethod.includes(search);

    const matchesDateFilter =
      dateSearchTerm === "" || bookingDate.includes(dateSearch);

    return matchesTextSearch && matchesDateFilter;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue, bValue;

    if (sortConfig.key.includes("booking.")) {
      const key = sortConfig.key.replace("booking.", "") as keyof Booking;
      aValue = a.booking[key] || "";
      bValue = b.booking[key] || "";

      // Special handling for dates
      if (key === "booked_at" || key === "completed_at") {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }
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

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/GetAllBooking`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();

      // Ensure dates are properly parsed
      const normalizedData =
        data.result?.map((item: any) => ({
          booking: {
            ...item.booking,
            booked_at: item.booking.booked_at
              ? new Date(item.booking.booked_at).toISOString()
              : null,
            completed_at: item.booking.completed_at
              ? new Date(item.booking.completed_at).toISOString()
              : null,
          },
          payments: item.payments || null,
        })) || [];

      setBookings(normalizedData);
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
  const updatePaymentStatus = async (
    bookingId: string | null,
    newStatus: string
  ) => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "No payment associated with this booking",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/ChangePaymentStatusByBookingId/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment_status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      toast({
        title: "Success",
        description: "Payment status updated",
      });

      fetchBookings();
    } catch (error: any) {
      console.error("Error updating payment:", error);
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

  return (
    <DashboardContainer scrollable>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>My Bookings</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
                <div className="relative w-full md:w-64">
                  <Input
                    type="date"
                    placeholder="Filter by date"
                    value={dateSearchTerm}
                    onChange={(e) => {
                      setDateSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pr-8"
                  />
                  {dateSearchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
                No bookings found
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
                              {sortConfig?.key === "booking.booked_at" ? (
                                sortConfig.direction === "ascending" ? (
                                  <ChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                )
                              ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((item) => (
                          <>
                            <TableRow key={item.booking.id}>
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
                                          {item.booking?.currency}{" "}
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
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      {item.payments?.payment_status?.toLowerCase() ===
                                        "completed" && (
                                        <>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              downloadInvoice(item.booking.id)
                                            }
                                            disabled={
                                              downloadingInvoice ===
                                              item.booking.id
                                            }
                                          >
                                            {downloadingInvoice ===
                                            item.booking.id ? (
                                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                            ) : (
                                              <Download className="h-4 w-4 mr-1" />
                                            )}
                                            Invoice
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              downloadVoucher(item.booking.id)
                                            }
                                            disabled={
                                              downloadingVoucher ===
                                              item.booking.id
                                            }
                                          >
                                            {downloadingVoucher ===
                                            item.booking.id ? (
                                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                            ) : (
                                              <Download className="h-4 w-4 mr-1" />
                                            )}
                                            Voucher
                                          </Button>
                                        </>
                                      )}
                                      {item.payments?.payment_status?.toLowerCase() !==
                                        "completed" && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            updatePaymentStatus(
                                              item.booking?.id || null,
                                              "completed"
                                            )
                                          }
                                          className="h-8"
                                          disabled={!item.payments}
                                        >
                                          <Check className="h-4 w-4 mr-1" />
                                          Approve Payment
                                        </Button>
                                      )}
                                      {item.payments?.payment_status?.toLowerCase() !==
                                        "failed" && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            updatePaymentStatus(
                                              item.booking?.id || null,
                                              "failed"
                                            )
                                          }
                                          className="h-8"
                                          disabled={!item.payments}
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
                          </>
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
                  {paginatedBookings
                    .sort((a, b) => {
                      const dateA = new Date(a.booking.booked_at).getTime();
                      const dateB = new Date(b.booking.booked_at).getTime();
                      return dateB - dateA; // Descending order
                    })
                    .map((item) => (
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
                              onClick={() =>
                                toggleRowExpansion(item.booking.id)
                              }
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
                                  {item.booking?.currency}{" "}
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
                              <div className="flex flex-wrap gap-2 pt-2">
                                {item.payments?.payment_status?.toLowerCase() ===
                                  "completed" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        downloadInvoice(item.booking.id)
                                      }
                                      disabled={
                                        downloadingInvoice === item.booking.id
                                      }
                                      className="flex-1"
                                    >
                                      {downloadingInvoice ===
                                      item.booking.id ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <Download className="h-4 w-4 mr-1" />
                                      )}
                                      Invoice
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        downloadVoucher(item.booking.id)
                                      }
                                      disabled={
                                        downloadingVoucher === item.booking.id
                                      }
                                      className="flex-1"
                                    >
                                      {downloadingVoucher ===
                                      item.booking.id ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <Download className="h-4 w-4 mr-1" />
                                      )}
                                      Voucher
                                    </Button>
                                  </>
                                )}
                                {item.payments?.payment_status?.toLowerCase() !==
                                  "completed" && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      updatePaymentStatus(
                                        item.booking?.id || null,
                                        "completed"
                                      )
                                    }
                                    className="flex-1"
                                    disabled={!item.payments}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve Payment
                                  </Button>
                                )}
                                {item.payments?.payment_status?.toLowerCase() !==
                                  "failed" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      updatePaymentStatus(
                                        item.booking?.id || null,
                                        "failed"
                                      )
                                    }
                                    className="flex-1"
                                    disabled={!item.payments}
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

export default BookingTable;
