"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { DataTable } from "../all-agent/data-table";
import { User, columns } from "./column";

async function getData(): Promise<User[]> {
  const response = await fetch("http://localhost:8000/api/V1/admin/AllGetSuppliers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const apiData = await response.json();

  // Map API data to the User type
  return apiData.map((item: any) => ({
    name: item.Company_name,
    email: item.Email,
    contact: item.Mobile_number || item.Office_number,
    status: item.IsApproved === 1 ? "Approved" : item.IsApproved === 0 ? "Pending" : "Rejected",
  }));
}

export default function DemoPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAction = async (email: string, status: number) => {
    try {
      const response = await fetch("API_URL_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state after successful API call
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
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable columns={columns(handleAction)} data={data} />
        )}
      </div>
    </DashboardContainer>
  );
}
