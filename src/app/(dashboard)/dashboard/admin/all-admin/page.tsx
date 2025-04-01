"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { User, columns } from "./column"
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton"
export default function DemoPage() {
  const [data, setData] = useState<User[]>([]); // Store table data
  const [loading, setLoading] = useState(true); // Loading state
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true); // Show loading state while fetching
    try {
      const response = await fetch(`${API_BASE_URL}/admin/AllAdminRecords`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const apiData = await response.json();

      // Map the API response to the `User` type
      const formattedData = apiData.map((item: any) => ({
        name: item.Company_name,
        email: item.Email,
        agentoperation: item.Agent_operation === true ? "Allowed" : "Not-Allowed",
        agentaccount: item.Agent_account === true ? "Allowed" : "Not-Allowed",
        agentproduct: item.Agent_product === true ? "Allowed" : "Not-Allowed",
        supplieroperation: item.Supplier_operation === true ? "Allowed" : "Not-Allowed",
        supplieraccount: item.Supplier_account === true ? "Allowed" : "Not-Allowed",
        supplierproduct: item.Supplier_product === true ? "Allowed" : "Not-Allowed",
      }));

      setData(formattedData); // Update state with the new data
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);


  const {toast} = useToast();
  // Delete function to remove a record
  const handleDelete = async (email: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${email}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/DestroyAdmin/${email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // alert("Admin deleted successfully");
        toast({
          title:'Delete Data',
          description:'Data deleted successfully'
        })
        fetchData(); // Re-fetch data after deletion
      } else {
        const errorData = await response.json();
        toast({
          title:'Error',
          description:`${errorData.message} || "Failed to delete admin`
        })
        // alert(errorData.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Something went wrong");
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
         </div> // Show loading indicator
        ) : (
          <DataTable
            columns={[
              ...columns,
              {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                  const email = row.original.email;
                  return (
                    <Button variant='destructive' onClick={() => handleDelete(email)}>Delete</Button>
                  );
                },
              },
            ]}
            data={data}
          />
        )}
      </div>
    </DashboardContainer>
  );
}
